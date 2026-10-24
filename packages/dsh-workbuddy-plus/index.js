/**
 * dsh-workbuddy-plus — DSH 的 WorkBuddy 接入插件（品牌令牌改写 + 双账号池）
 *
 * 这个包由三件事合并而来：
 *
 *  1. dsh-workbuddy-connect@0.7.9（作者 corrinehu，MIT）——把 WorkBuddy 桌面
 *     App 的模型接进 DSH。原发布物只按 dsh 0.2.1-rc.2 构建，且 peerDependencies
 *     写的是精确版本号 0.2.1-rc.2；宿主升级到 0.2.1-rc.3 后，DSH 的插件兼容性
 *     闸门判定 "Plugin dsh-workbuddy-connect@0.7.9 is incompatible with dsh
 *     0.2.1-rc.3"，直接跳过该 bundle，模型入口整个消失。
 *     这里把同一份构建产物 vendor 到 ./lib/connect/（Host 半逐字节原样，浏览器
 *     半只改「按包名接线」的标识），并在其上重新声明包名与版本范围。
 *
 *  2. dsh-workbuddy-brandfix@1.0.0（本项目自研）——WorkBuddy 网关会把带宿主
 *     品牌串 "DeepSeek Harness" 的 system prompt 判为未授权渠道（HTTP 400，
 *     code 11128）。合并后不再有插件顺序依赖：补丁在 import 阶段就装好。
 *
 *  3. 双账号池（本项目自研）——CN 通道可以配第二个账号的登录凭据文件，默认
 *     「主账号优先，额度用尽/限流/登录失效时自动切到备用账号」，也可以配成
 *     每次请求轮换。
 *
 * 配置（环境变量）：
 *   WORKBUDDY_BRAND_FIX=0        关闭品牌改写（默认开启）
 *   WORKBUDDY_BRAND_FROM         被替换的串（默认 "DeepSeek Harness"）
 *   WORKBUDDY_BRAND_TO           替换成的串（默认 "WorkBuddy"）
 *   WORKBUDDY_AUTH_FILE_2        第二个 CN 账号的凭据文件（默认 $DSH_HOME/.workbuddy-account-2.info，旧名 .workbuddy-account-b.info 仍兼容）
 *   WORKBUDDY_ACCOUNT_POLICY     failover（默认）| rotate | off
 *   WORKBUDDY_ACCOUNT_COOLDOWN_MS 切到备用账号后多久再优先试主账号（默认 600000）
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import { atRestKeyProviderFor } from './lib/connect/at-rest.js'
import {
	CN_VARIANT,
	WorkBuddyCredentialStore,
	WorkBuddyUpstreamClient,
	apply as connectApply,
	Config as connectConfig,
	inject as connectInject,
	name as connectName,
} from './lib/connect/index.js'

/** Cordis 插件名，沿用上游，保证模型注册与设置命名空间不变。 */
export const name = connectName

/** 上游要求的服务：模型注册表。 */
export const inject = connectInject

/** 上游的设置 schema，原样透出，设置页的行为不变。 */
export const Config = connectConfig

/* ------------------------------------------------------------------ */
/* 品牌令牌改写                                                        */
/* ------------------------------------------------------------------ */

const BRAND_FROM = process.env.WORKBUDDY_BRAND_FROM ?? 'DeepSeek Harness'
const BRAND_TO = process.env.WORKBUDDY_BRAND_TO ?? 'WorkBuddy'
const BRAND_FIX_ENABLED = process.env.WORKBUDDY_BRAND_FIX !== '0'

/**
 * 把一段文本转成 JSON 字符串字面量内部的形式。
 *
 * 改写发生在已经序列化好的 body 上，所以要按 JSON 规则转义后再查找/替换。
 *
 * @param {string} value 原始文本
 * @returns {string} 可直接放进 JSON 字符串字面量的文本
 */
function jsonStringBody(value) {
	return JSON.stringify(value).slice(1, -1)
}

const BRAND_FROM_IN_JSON = jsonStringBody(BRAND_FROM)
const BRAND_TO_IN_JSON = jsonStringBody(BRAND_TO)

/**
 * 把一段出站 JSON body 里的品牌串替换掉。
 *
 * 上游把整个请求体序列化成一个字符串交给 chatStream，这里做的是整串替换，
 * 因此用户消息、工具结果里出现的同一串也会被一起改——这是刻意的取舍：
 * 不动 JSON 结构就不可能产出非法 body。要关掉就设 WORKBUDDY_BRAND_FIX=0。
 *
 * @param {unknown} bodyJson 上游要发出的 JSON 字符串
 * @returns {unknown} 改写后的字符串；非字符串原样返回
 */
export function rewriteBrandTokens(bodyJson) {
	if (!BRAND_FIX_ENABLED) return bodyJson
	if (typeof bodyJson !== 'string' || !bodyJson.includes(BRAND_FROM_IN_JSON)) return bodyJson
	return bodyJson.split(BRAND_FROM_IN_JSON).join(BRAND_TO_IN_JSON)
}

/* ------------------------------------------------------------------ */
/* 双账号池                                                            */
/* ------------------------------------------------------------------ */

/** 第二个 CN 账号的凭据文件路径。 */
const SECONDARY_AUTH_ENV = 'WORKBUDDY_AUTH_FILE_2'
/** 轮换策略：off / failover（默认，额度用尽再切） / rotate（每次请求交替）。 */
const POLICY_ENV = 'WORKBUDDY_ACCOUNT_POLICY'
/** 切到备用账号后，多久内继续优先用它。 */
const COOLDOWN_ENV = 'WORKBUDDY_ACCOUNT_COOLDOWN_MS'
const DEFAULT_COOLDOWN_MS = 600_000
/** 备用账号刷新后的凭据落在自己的副本里，不碰主账号那份。 */
const SECONDARY_OWN_FILENAME = '.workbuddy-auth-2.json'
/**
 * 备用账号凭据的默认位置：`$DSH_HOME/.workbuddy-account-2.info`。
 *
 * 故意用「2」而不是账号字母命名：槽位里放哪个账号由你决定，主备随时可以对调
 * （把另一个账号的文件覆盖过来即可），文件名不该暗示身份。
 *
 * 桌面 App 从 Finder 启动时拿不到 shell 环境变量，所以「把文件放到这个位置」
 * 才是免配置的用法；`WORKBUDDY_AUTH_FILE_2` 只是给需要换路径的人用的覆盖。
 */
const SECONDARY_DEFAULT_FILENAME = '.workbuddy-account-2.info'
/** 旧版槽位名，只为兼容上一版 README 的布局；新文件存在时它一律被忽略。 */
const SECONDARY_LEGACY_FILENAME = '.workbuddy-account-b.info'
/**
 * 上游把失败归类成这几种 kind（见 lib/connect/index.js 的 KIND_STATUS）。
 * 只有「换个账号可能就好了」的三类才触发切换：
 *   hard_credit  额度/余额用尽（HTTP 402 或命中余额文案）
 *   soft_rate    限流（HTTP 429）
 *   session_dead 登录失效（HTTP 401）
 * server / not_found / client 属于上游或本插件的问题，换账号只会白烧一次请求。
 */
const SWITCHABLE_KINDS = new Set(['hard_credit', 'soft_rate', 'session_dead'])

/**
 * 跨模块实例共享的状态。
 *
 * DSH 热重载会重新求值本模块，但原型上的补丁只装一次——把 logger 和池状态放在
 * 全局 Symbol 上，重载后的 apply() 仍然能驱动第一次安装的那份闭包，否则日志和
 * accountPoolStatus() 会失真。
 */
const STATE_KEY = Symbol.for('dsh-workbuddy-plus/state')
const shared = (globalThis[STATE_KEY] ??= {
	logger: undefined,
	pool: {
		/** 'primary' | 'secondary'：failover 模式下当前优先用谁。 */
		preferred: 'primary',
		/** 最近一次切到备用账号的时间戳。 */
		switchedAt: 0,
		/** rotate 模式下「下一次是否先用备用账号」。首请求先用主账号。 */
		rotateSecondaryNext: false,
		/** 备用 store 缓存：每个 client 实例一份，热重载后旧实例不会串到新实例上。 */
		stores: new WeakMap(),
		/** 按 key 限速的日志闸门，避免一种告警吞掉另一种。 */
		logGates: new Map(),
	},
})
const pool = shared.pool

/** 当前策略，非法值一律退回 failover。 */
function accountPolicy() {
	const raw = (process.env[POLICY_ENV] ?? 'failover').trim().toLowerCase()
	if (raw === 'off' || raw === 'rotate' || raw === 'failover') return raw
	return 'failover'
}

/** 冷却窗口，非法值退回默认值。 */
function cooldownMs() {
	const value = Number(process.env[COOLDOWN_ENV])
	return Number.isFinite(value) && value >= 0 ? value : DEFAULT_COOLDOWN_MS
}

/**
 * 备用账号凭据路径：环境变量优先，其次看 $DSH_HOME 下的默认文件。
 *
 * 注意：环境变量给出的路径这里不校验存在性——路径写错了应该在真正要切号时
 * 报出来（并降级为单账号），而不是在 import 期就让整个插件起不来。
 *
 * @returns {string | undefined} 路径，未配置时 undefined
 */
function secondaryAuthPath() {
	const value = process.env[SECONDARY_AUTH_ENV]?.trim()
	if (value !== undefined && value !== '') return value
	const home = resolveDshHome()
	const slot = join(home, SECONDARY_DEFAULT_FILENAME)
	if (existsSync(slot)) return slot
	const legacy = join(home, SECONDARY_LEGACY_FILENAME)
	return existsSync(legacy) ? legacy : undefined
}

/**
 * 该凭据属于国际站吗？
 *
 * 与上游 regionOf 同一套规则：空域名算 CN，只有 workbuddy.ai 及其子域算国际站。
 * 国际站通道不参与双账号池——备用账号是 CN 的。
 *
 * @param {string | undefined} domain 凭据里的登录域
 * @returns {boolean} 是否国际站
 */
function isGlobalDomain(domain) {
	const lowered = (domain ?? '').trim().toLowerCase()
	return lowered === 'workbuddy.ai' || lowered.endsWith('.workbuddy.ai')
}

/**
 * 两份凭据是不是同一个账号。
 *
 * uid 缺失时无法靠身份判断（这类凭据会以 X-No-User-Id 发出），退而比较 access
 * token：同一个账号从两个文件里读出来，token 也是同一串。
 *
 * @param {{ uid?: string, enterpriseId?: string, accessToken?: string }} a 一份凭据
 * @param {{ uid?: string, enterpriseId?: string, accessToken?: string }} b 另一份凭据
 * @returns {boolean} 是否同一账号
 */
function sameAccount(a, b) {
	if (typeof a?.accessToken === 'string' && a.accessToken !== '' && a.accessToken === b?.accessToken) return true
	if (typeof a?.uid !== 'string' || a.uid === '') return false
	return a.uid === b?.uid && (a.enterpriseId ?? '') === (b?.enterpriseId ?? '')
}

/**
 * 取（或复用）备用账号的 credential store。
 *
 * 刷新必须挂到同一个 client 实例上——上游的 store 靠 `refresh` 回调续期，
 * 不传就只能用尚未过期的 access token。ownPath 单独一份，避免主备互相覆盖。
 *
 * @param {InstanceType<typeof WorkBuddyUpstreamClient>} client 当前 client
 * @param {string} authPath 备用凭据文件
 * @returns {InstanceType<typeof WorkBuddyCredentialStore>} store
 */
function secondaryStore(client, authPath) {
	const cached = pool.stores.get(client)
	if (cached !== undefined && cached.authPath === authPath) return cached.store
	const store = new WorkBuddyCredentialStore({
		variant: CN_VARIANT,
		desktopPath: authPath,
		ownPath: join(resolveDshHome(), SECONDARY_OWN_FILENAME),
		// 备用凭据通常是 WorkBuddy 5.6 的加密信封；不带 discovery 的默认 provider 会
		// 直接报「no WorkBuddy Electron binary is configured」，于是静默退回单账号。
		keyProvider: atRestKeyProviderFor(CN_VARIANT),
		refresh: (credential) => client.refreshToken(credential),
	})
	pool.stores.set(client, { authPath, store })
	return store
}

/**
 * 解析备用账号当前可用的凭据。只在真要切号时才调用（主号健康时不碰它）。
 *
 * 失败一律当作「备用不可用」：文件没配好、账号区域不匹配、刷新失败，都不应该
 * 让主账号的请求跟着失败。
 *
 * @param {InstanceType<typeof WorkBuddyUpstreamClient>} client 当前 client
 * @param {string} authPath 备用凭据文件
 * @returns {Promise<object | undefined>} 凭据对象
 */
async function secondaryCredential(client, authPath) {
	try {
		return await secondaryStore(client, authPath).resolve()
	} catch (error) {
		notify('secondary-unavailable', '备用账号不可用（' + String(error?.message ?? error) + '），本次只用主账号')
		return undefined
	}
}

/**
 * 按 key 限速写日志：同一种告警一分钟一条，不同告警互不吞。
 *
 * @param {string} key 告警类别
 * @param {string} message 内容
 */
function notify(key, message) {
	const now = Date.now()
	if (now - (pool.logGates.get(key) ?? 0) < 60_000) return
	pool.logGates.set(key, now)
	shared.logger?.warn?.('[dsh-workbuddy-plus] ' + message)
}

/**
 * 记录一次切到备用账号。
 *
 * @param {string} reason 主账号的失败类别
 */
function noteSwitch(reason) {
	pool.preferred = 'secondary'
	pool.switchedAt = Date.now()
	shared.logger?.info?.(
		'[dsh-workbuddy-plus] 主账号失败（' + reason + '），已切到备用账号；' + Math.round(cooldownMs() / 1000) + 's 内优先用它',
	)
}

/** 记录切回主账号（只在状态真的变化时打一行）。 */
function notePrimary() {
	if (pool.preferred === 'primary') return
	pool.preferred = 'primary'
	shared.logger?.info?.('[dsh-workbuddy-plus] 已切回主账号')
}

/**
 * 本次请求的尝试顺序。
 *
 * failover：默认主账号优先；切过一次后，冷却窗口内继续优先备用，窗口过了先试主账号。
 * rotate：每次请求交替，且**不碰** failover 的 preferred 状态。
 *
 * @param {'failover' | 'rotate'} policy 当前策略
 * @returns {Array<'primary' | 'secondary'>} 顺序
 */
function attemptOrder(policy) {
	if (policy === 'rotate') {
		const secondaryFirst = pool.rotateSecondaryNext
		pool.rotateSecondaryNext = !secondaryFirst
		return secondaryFirst ? ['secondary', 'primary'] : ['primary', 'secondary']
	}
	if (pool.preferred === 'secondary' && Date.now() - pool.switchedAt < cooldownMs()) {
		return ['secondary', 'primary']
	}
	return ['primary', 'secondary']
}

/**
 * 一次成功请求后的状态收尾。
 *
 * @param {'failover' | 'rotate'} policy 当前策略
 * @param {'primary' | 'secondary'} name 这次用的是谁
 * @param {Map<string, { kind?: string }>} results 本次已尝试的结果
 */
function noteSuccess(policy, name, results) {
	if (policy !== 'failover') return
	if (name === 'primary') {
		notePrimary()
		return
	}
	if (pool.preferred !== 'secondary') {
		const reason = results.get('primary')?.kind ?? '上一次请求失败'
		noteSwitch(reason)
	}
}

/* ------------------------------------------------------------------ */
/* 卡片上的双账号额度                                                  */
/* ------------------------------------------------------------------ */

/**
 * 关掉卡片合并（`WORKBUDDY_ACCOUNT_CARD=off`）。
 *
 * 上游的卡片渲染的是 status 文档里的 `credits`：顶部一行合计、下面「按套餐」
 * 逐行列出。它认 `{ total, unlimited, accounts:[{packageName, remain, size}], expiry }`，
 * 而账号行显示的标签就是 `packageName` 原文——所以只要把第二个账号的账号行
 * 打上「账号名 · 套餐名」前缀并进同一个列表，卡片不用改一行代码就能显示两个账号。
 */
const CARD_ENV = 'WORKBUDDY_ACCOUNT_CARD'

/**
 * 一个账号在卡片里的显示名：优先昵称，其次 uid 前 6 位。
 *
 * @param {{ nickname?: string, uid?: string } | undefined} credential 凭据
 * @returns {string} 显示名
 */
export function accountLabel(credential) {
	const nickname = typeof credential?.nickname === 'string' ? credential.nickname.trim() : ''
	if (nickname !== '') return nickname
	const uid = typeof credential?.uid === 'string' ? credential.uid : ''
	return uid === '' ? '账号' : uid.slice(0, 6)
}

/**
 * 把一份 credits 里的账号行加上账号前缀。
 *
 * @param {object | undefined} credits 上游 fetchCredits 的返回
 * @param {string} label 账号显示名
 * @returns {Array<object>} 加了前缀的账号行
 */
function tagAccountRows(credits, label) {
	const rows = Array.isArray(credits?.accounts) ? credits.accounts : []
	return rows.map((row) => ({
		...row,
		packageName: label + ' · ' + (typeof row?.packageName === 'string' && row.packageName !== '' ? row.packageName : '额度'),
	}))
}

/**
 * 合并两个账号的额度，交给上游卡片现有的渲染。
 *
 * 语义（写进 README，免得误读）：
 *   - 顶部合计 = 两个账号之和；任一方 unlimited 则显示不限
 *   - 「按套餐」每行前缀是该账号的显示名，这样一眼能看出哪行属于谁
 *   - 重置时间沿用主账号；「即将过期」三类计数相加
 *
 * @param {object | undefined} primary 主账号 credits
 * @param {object | undefined} secondary 备用账号 credits
 * @param {string} primaryLabel 主账号显示名
 * @param {string} secondaryLabel 备用账号显示名
 * @returns {object} 合并后的 credits
 */
export function mergeCredits(primary, secondary, primaryLabel, secondaryLabel) {
	const accounts = [...tagAccountRows(primary, primaryLabel), ...tagAccountRows(secondary, secondaryLabel)]
	const unlimited = primary?.unlimited === true || secondary?.unlimited === true
	const numeric = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined)
	const primaryTotal = numeric(primary?.total)
	const secondaryTotal = numeric(secondary?.total)
	const total = primaryTotal === undefined && secondaryTotal === undefined ? undefined : (primaryTotal ?? 0) + (secondaryTotal ?? 0)

	/** 三类「即将过期」计数相加；两方都没有就整段省略。 */
	const mergeExpiry = () => {
		const parts = [primary?.expiry, secondary?.expiry].filter((value) => typeof value === 'object' && value !== null)
		if (parts.length === 0) return undefined
		const bucket = (key) => parts.reduce((sum, part) => sum + (numeric(part?.[key]) ?? 0), 0)
		return { within24h: bucket('within24h'), within3d: bucket('within3d'), within7d: bucket('within7d') }
	}
	const expiry = mergeExpiry()

	return {
		...(total === undefined ? {} : { total }),
		...(unlimited ? { unlimited: true } : {}),
		accounts,
		...(expiry === undefined ? {} : { expiry }),
		...(primary?.cycleResetTime === undefined ? {} : { cycleResetTime: primary.cycleResetTime }),
	}
}

/** 安装标记；放一个 Symbol 防止重复包装。 */
const PATCHED = Symbol.for('dsh-workbuddy-plus/chat-pipeline')
/** 额度合并的安装标记，与 chatStream 的补丁互不影响。 */
const PATCHED_CREDITS = Symbol.for('dsh-workbuddy-plus/credits-merge')

/**
 * 把一次 chatStream 包成「品牌改写 + 账号池」的完整管线。
 *
 * 幂等：重复安装（热重载、重复 import）不会套多层。返回是否已生效。
 *
 * @returns {boolean} 原型方法是否处于已安装状态
 */
export function installChatPipeline() {
	const proto = WorkBuddyUpstreamClient?.prototype
	if (proto === undefined || typeof proto.chatStream !== 'function') return false
	if (proto[PATCHED] === true) return true
	const original = proto.chatStream

	proto.chatStream = async function chatStream(credential, bodyJson, signal) {
		const body = rewriteBrandTokens(bodyJson)
		const policy = accountPolicy()
		const authPath = policy === 'off' ? undefined : secondaryAuthPath()
		// 没有第二个账号、策略关闭、或这是国际站凭据：完全等于上游行为。
		if (authPath === undefined || isGlobalDomain(credential?.domain)) {
			return original.call(this, credential, body, signal)
		}

		/** 本次每个账号的结果，用于最后决定把谁的错误报给用户。 */
		const results = new Map()
		let secondary
		let secondaryUnusable = false

		for (const name of attemptOrder(policy)) {
			let attempt = credential
			if (name === 'secondary') {
				if (!secondaryUnusable && secondary === undefined) {
					secondary = await secondaryCredential(this, authPath)
					if (secondary !== undefined && sameAccount(secondary, credential)) {
						// 两条路径指向同一个账号：切了也是同一个额度，白烧一次请求。
						secondary = undefined
						secondaryUnusable = true
					}
				}
				if (secondary === undefined) {
					secondaryUnusable = true
					continue
				}
				attempt = secondary
			}

			const result = await original.call(this, attempt, body, signal)
			results.set(name, result)
			if (result?.ok === true) {
				noteSuccess(policy, name, results)
				return result
			}
			// 用户/会话已取消：不要再用另一个账号重发。
			if (signal?.aborted === true) return result
			// 主账号遇到非「换号能解决」的失败：原样返回，不动备用账号。
			if (name === 'primary' && !SWITCHABLE_KINDS.has(result?.kind)) return result
			// 备用账号失败（任何原因）都继续试主账号——主账号才是用户预期的那一个。
		}

		// 都失败了：报主账号的失败原因，别用备号的 session_dead 把主号的额度不足说歪。
		return results.get('primary') ?? results.get('secondary') ?? { ok: false, kind: 'client', status: 0, message: 'workbuddy: no credential attempted' }
	}
	Object.defineProperty(proto, PATCHED, { value: true, enumerable: false })

	// 卡片额度：同一份 status 文档里给出两个账号的额度（详情见 mergeCredits）。
	if (typeof proto.fetchCredits === 'function' && proto[PATCHED_CREDITS] !== true) {
		const originalCredits = proto.fetchCredits
		proto.fetchCredits = async function fetchCredits(credential) {
			const primary = await originalCredits.call(this, credential)
			if (process.env[CARD_ENV] === 'off' || accountPolicy() === 'off' || isGlobalDomain(credential?.domain)) {
				return primary
			}
			const authPath = secondaryAuthPath()
			if (authPath === undefined) return primary
			// 备用账号读不到/没登录：卡片照旧显示主账号，不让状态页跟着报错。
			const secondary = await secondaryCredential(this, authPath)
			if (secondary === undefined || sameAccount(secondary, credential)) return primary
			let extra
			try {
				extra = await originalCredits.call(this, secondary)
			} catch (error) {
				notify('secondary-credits', '备用账号额度读取失败（' + String(error?.message ?? error) + '），卡片只显示主账号')
				return primary
			}
			return mergeCredits(primary, extra, accountLabel(credential), accountLabel(secondary))
		}
		Object.defineProperty(proto, PATCHED_CREDITS, { value: true, enumerable: false })
	}
	return true
}

const installed = installChatPipeline()

/**
 * 只读诊断：当前池状态。给 CLI / 排查用，不参与请求路径。
 *
 * @returns {{policy: string, secondaryConfigured: boolean, preferred: string, switchedAt: number}} 状态快照
 */
export function accountPoolStatus() {
	const authPath = secondaryAuthPath()
	return {
		policy: accountPolicy(),
		secondaryConfigured: authPath !== undefined && existsSync(authPath),
		secondaryPath: authPath,
		preferred: pool.preferred,
		switchedAt: pool.switchedAt,
	}
}

/* ------------------------------------------------------------------ */
/* 插件入口                                                            */
/* ------------------------------------------------------------------ */

/**
 * Cordis 插件入口：记录一次改写/池状态，然后交给上游 apply。
 *
 * 上游 apply 负责一切真实工作（凭据、目录、回环端点、provider 注册、路由、
 * 设置卡片）。这里只多打日志，不吞异常——那属于上游的职责边界。
 *
 * @param {object} ctx Cordis 上下文
 * @param {object} config 插件配置
 * @returns {unknown} 上游 apply 的返回值
 */
export function apply(ctx, config) {
	shared.logger = ctx?.logger
	try {
		if (!BRAND_FIX_ENABLED) {
			ctx?.logger?.info?.('[dsh-workbuddy-plus] WORKBUDDY_BRAND_FIX=0，品牌改写已关闭')
		} else if (installed) {
			ctx?.logger?.info?.(
				'[dsh-workbuddy-plus] 出站请求改写 ' + JSON.stringify(BRAND_FROM) + ' -> ' + JSON.stringify(BRAND_TO),
			)
		} else {
			ctx?.logger?.warn?.('[dsh-workbuddy-plus] 未找到 WorkBuddyUpstreamClient.prototype.chatStream，品牌改写未生效')
		}
		const policy = accountPolicy()
		const authPath = policy === 'off' ? undefined : secondaryAuthPath()
		if (authPath === undefined) return connectApply(ctx, config)
		if (existsSync(authPath)) {
			ctx?.logger?.info?.('[dsh-workbuddy-plus] 双账号池已启用：policy=' + policy + '，备用凭据文件 ' + authPath)
		} else {
			ctx?.logger?.warn?.(
				'[dsh-workbuddy-plus] 双账号池已配置但备用凭据文件不存在（' + authPath + '），暂时按单账号运行',
			)
		}
	} catch {
		// 日志失败绝不能挡住插件本身。
	}
	return connectApply(ctx, config)
}
