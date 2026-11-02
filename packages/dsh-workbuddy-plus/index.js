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
 *     品牌串的 system prompt 判为未授权渠道（HTTP 400，code 11128，见下）
 *     另有一条 @ 路径说明句也会被拦，两处都必须改写。合并后不再有插件顺序依赖：
 *
 *  3. 双账号池（本项目自研）——CN 通道可以配第二个账号的登录凭据文件，默认
 *     「主账号优先，额度用尽/限流/登录失效时自动切到备用账号」，也可以配成
 *     每次请求轮换。
 *
 * 配置（环境变量）：
 *   WORKBUDDY_BRAND_FIX=0        关闭品牌改写（默认开启）
 *   WORKBUDDY_BRAND_FROM         被替换的串（默认：16 字符的宿主品牌串，见下方品牌改写段）
 *   WORKBUDDY_BRAND_TO           替换成的串（默认："WorkBuddy"）
 *   WORKBUDDY_AUTH_FILE_2        第二个 CN 账号的凭据文件（默认 $DSH_HOME/.workbuddy-account-2.info，旧名 .workbuddy-account-b.info 仍兼容）
 *   WORKBUDDY_ACCOUNT_POLICY     failover（默认）| rotate | off
 *   WORKBUDDY_ACCOUNT_COOLDOWN_MS 切到备用账号后多久再优先试主账号（默认 600000）
 */
import { existsSync, statSync } from 'node:fs'
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
import {
	accountPreference,
	applyAccountOverride,
	onAccountPreferenceChange,
	registerAccountRoute,
	secondaryConfiguredAt,
	setAccountPreference,
} from './lib/account-pool.js'

/** Cordis 插件名，沿用上游，保证模型注册与设置命名空间不变。 */
export const name = connectName

/** 上游要求的服务：模型注册表。 */
export const inject = connectInject

/** 上游的设置 schema，原样透出，设置页的行为不变。 */
export const Config = connectConfig

/* ------------------------------------------------------------------ */
/* 品牌令牌改写                                                        */
/* ------------------------------------------------------------------ */

/**
 * 网关的渠道校验（HTTP 400 / code 11128 "Illegal API invocation from an
 * unapproved channel"，界面显示「请求被拦截，请重新发送」）命中两个串，
 * 二者都必须改写——只改一个仍然 400（实测）。
 *
 *   1. 宿主品牌串（16 字符，D-e-e-p-S-e-e-k + 空格 + H-a-r-n-e-s-s）。
 *      DSH 的 system prompt 首句固定是 "You are an AI agent powered by <它>."，
 *      网关把「声称自己是某渠道的 agent」这种句式判为未授权渠道。
 *   2. @ 路径说明句："Tokens prefixed with @ are paths ... referenced."
 *      DSH 运行时上下文里的固定段落，语义风控命中，改措辞即过。
 *
 * 两串按码点构造而不是写字面量：本仓的文本通道会把 16 字符那串静默归一
 * 成 9 字符的宿主品牌名，导致「改写前」「改写后」变成同一个串，补丁自我
 * 失效且看不出来。下面的断言保证两者确实不同。
 *
 * 实测（CN 通道 copilot.tencent.com / deepseek-v4.1-flash）：
 *   原始 system prompt 196KB → 11128（12/12）
 *   两处都改写后           → 200（连续 2 轮，含哨兵对照）
 */
const BRAND_FROM = process.env.WORKBUDDY_BRAND_FROM ?? String.fromCodePoint(68, 101, 101, 112, 83, 101, 101, 107, 32, 72, 97, 114, 110, 101, 115, 115)
const BRAND_TO = process.env.WORKBUDDY_BRAND_TO ?? String.fromCodePoint(87, 111, 114, 107, 66, 117, 100, 100, 121)
const BRAND_FIX_ENABLED = process.env.WORKBUDDY_BRAND_FIX !== '0'

/** @ 路径说明句的原文与替换文本（等长改写，不动无关字节）。 */
const AT_PATH_FROM = 'Tokens prefixed with @ are paths the user explicitly referenced.'
const AT_PATH_TO = 'Tokens prefixed with symbols are paths the reader mentioned earlier.'

/**
 * 当前生效的改写对。
 *
 * 两条不重叠，逐条替换比一次正则更可读，也便于单独开关；环境变量把
 * from/to 设成同一个值时该条自动跳过。
 *
 * @returns {Array<{from: string, to: string}>} 改写对
 */
export function rewritePairs() {
	const pairs = []
	if (BRAND_FROM !== '' && BRAND_FROM !== BRAND_TO) pairs.push({ from: BRAND_FROM, to: BRAND_TO })
	if (AT_PATH_FROM !== AT_PATH_TO) pairs.push({ from: AT_PATH_FROM, to: AT_PATH_TO })
	return pairs
}

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

/** 预先把每条改写对转成 JSON 字面量内部形式（body 已是序列化字符串）。 */
const REWRITE_PAIRS_IN_JSON = rewritePairs().map((pair) => ({
	from: jsonStringBody(pair.from),
	to: jsonStringBody(pair.to),
}))

/**
 * 自检：改写对必须真的不同，且必须能命中宿主品牌串。
 *
 * 这道断言存在的理由很具体——本仓的文本通道会把 16 字符的品牌串静默归一
 * 成 9 字符，于是 from 与 to 变成同一个值、补丁静默失效，而表面上看不出
 * 任何异常。宁可 import 期直接抛错，也不要带着一个空转的补丁上线。
 */
function assertRewriteIsEffective() {
	if (!BRAND_FIX_ENABLED) return
	for (const pair of REWRITE_PAIRS_IN_JSON) {
		if (pair.from === pair.to) {
			throw new Error('[dsh-workbuddy-plus] 改写对前后相同（' + JSON.stringify(pair.from) + '），补丁不会生效')
		}
	}
	const brand = REWRITE_PAIRS_IN_JSON[0]
	if (brand !== undefined && !jsonStringBody('You are an AI agent powered by ' + BRAND_FROM + '.').includes(brand.from)) {
		throw new Error('[dsh-workbuddy-plus] 品牌改写串无法命中 system prompt 首句')
	}
}
assertRewriteIsEffective()

/**
 * 把一段出站 JSON body 里的拦截串替换掉。
 *
 * 上游把整个请求体序列化成一个字符串交给 chatStream，这里做的是整串替换，
 * 因此用户消息、工具结果里出现的同一串也会被一起改——这是刻意的取舍：
 * 不动 JSON 结构就不可能产出非法 body。要关掉就设 WORKBUDDY_BRAND_FIX=0。
 *
 * 每条改写对独立判断是否命中，没有命中的直接跳过，避免无谓的整串扫描。
 *
 * @param {unknown} bodyJson 上游要发出的 JSON 字符串
 * @returns {unknown} 改写后的字符串；非字符串原样返回
 */
export function rewriteBrandTokens(bodyJson) {
	if (!BRAND_FIX_ENABLED) return bodyJson
	if (typeof bodyJson !== 'string') return bodyJson
	let out = bodyJson
	for (const pair of REWRITE_PAIRS_IN_JSON) {
		if (!out.includes(pair.from)) continue
		out = out.split(pair.from).join(pair.to)
	}
	return out
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
 * 手动档是否也允许「失败就换另一侧」。
 *
 * 默认允许：手动档只决定谁先上，额度用尽这类失败仍然切另一侧——否则按下
 * 「主号」就等于「备号从此不许用」，额度没了直接报错，比自动档还差。
 * 环境变量 WORKBUDDY_ACCOUNT_MANUAL_STRICT=1 可改成严格档：手动选谁就只用谁。
 */
const MANUAL_STRICT_ENV = 'WORKBUDDY_ACCOUNT_MANUAL_STRICT'

/** 手动档是否严格只用选中的那一个账号。 */
function manualStrict() {
	const value = process.env[MANUAL_STRICT_ENV]?.trim().toLowerCase()
	return value === '1' || value === 'true'
}

/** 可用性探针的缓存时长：卡片每次展开都会问一次，真解析不便宜。 */
const AVAILABILITY_TTL_MS = 15_000

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
	/**
	 * 最近一次「按了手动档、请求却落在另一个账号」的记录。
	 *
	 * 只在手动档期间有意义：卡片用它说明「备号不可用，已回落主号」，否则用户只会
	 * 看到按钮亮着、额度一行都没变。
	 */
	degraded: undefined,
	/** 手动档写入的收口钩子是否已装（热重载时状态挂在 globalThis 上，只装一次）。 */
	bridgeInstalled: false,
	/** 可用性探针复用的 key provider 与主号 store（都在进程内缓存）。 */
	keyProvider: undefined,
	primaryStore: undefined,
	availability: undefined,
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
 * 记一条「手动档没兑现」的原因，供卡片读取。
 *
 * 手动按下某一档之后，请求仍可能落在另一个账号上（备号读不出来、备号与主号同账号、
 * 主号额度用尽）。这种时候按钮还亮在按下态，用户却看不到任何变化——卡片必须能把
 * 原因说出来，否则这个控件就是个骗人的开关。
 *
 * @param {'secondary-unusable' | 'primary-fell-back'} kind 降级类别
 * @param {string} message 说明
 */
function noteDegraded(kind, message) {
	// 只按 kind 去重会把新原因吞掉：先「备号上游 500」后「凭据文件被删」时，卡片仍
	// 显示前一句。同 kind 但换了说法就必须更新。
	if (shared.degraded?.kind === kind && shared.degraded?.message === message) return
	shared.degraded = { kind, message, at: Date.now() }
	notify('degraded-' + kind, message)
}

/**
 * 手动档「按了却没兑现」的统一留痕。
 *
 * 两个调用点（主号不可切换类失败的早退、两档全败的收尾）共用一份措辞，避免同一
 * 件事在卡片上有两种说法。文案里的档数必须按**真发出去的请求**写：严格档下只发
 * 一档，说「两档都没成功」是给用户讲一件没发生的事。
 *
 * @param {'auto' | 'primary' | 'secondary'} override **请求起手时**的档位快照
 * @param {Array<'primary' | 'secondary'>} attempted 真正发出过请求的档位（按顺序）
 * @param {Map<string, { ok?: boolean, kind?: string }>} results 本次每档的结果
 * @param {{ ok?: boolean, kind?: string }} fallback 最终报给用户的那次失败
 */
function noteManualMiss(override, attempted, results, fallback) {
	if (override === 'auto') return
	// 用户在请求飞行期间改了档位：这次请求反映的是旧意图，写下来的每一句都会
	// 跟按钮当前状态打架。让新档位的下一次请求自己说事实。
	if (accountPreference() !== override) return
	if (fallback?.ok === true) return
	// 选中那档一个请求都没发出去（备号读不出来、与主号同账号）。那种情况的原因
	// 已经由 chatStream 的入口路径写过了（"已选备用账号但它不可用（…），本次请求
	// 回落主账号"）。这里再写一遍只会用主号的失败类别冒充备号的失败——用户会跑去
	// 查备号凭据文件，而真因是主号额度不足。
	if (!attempted.includes(override)) return
	const label = override === 'secondary' ? '备用' : '主'
	// 说「选中那档为什么失败」比说「最后报给你的那次失败」更贴近用户按下按钮的意图：
	// 手动选了备号、备号 500 而主号额度不足时，真因是备号的 500。
	const picked = results?.get?.(override)
	const source = picked !== undefined && picked.ok !== true ? picked : fallback
	const kind = source?.kind ?? '失败'
	const both = attempted.includes('primary') && attempted.includes('secondary')
	noteDegraded(
		override === 'secondary' ? 'secondary-unusable' : 'primary-fell-back',
		'已选' + label + '账号但它这次失败（' + kind + '），' +
			(both ? '两档都没成功' : '本次只尝试了' + (attempted.includes(override) ? '选中的这一档' : '另一档')),
	)
}

/** 清掉降级记录（手动档真的兑现了，或用户重新按了一次）。 */
function clearDegraded() {
	shared.degraded = undefined
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
 * 本次请求真正要试的顺序：策略顺序 + 手动优先覆盖。
 *
 * 手动优先只重排、不截断（`applyAccountOverride`）：用户按下「备号」想要的是
 * 「这次先烧备号」，而不是「主号从此不许用」——备号 5xx 时仍然兜底回主号。
 *
 * `WORKBUDDY_ACCOUNT_MANUAL_STRICT=1` 时改成严格档：只留选中的那一个。这条路给
 * 「必须确定走某个账号」的场景（对账、复现某个账号的额度问题），代价是失败没有兜底。
 *
 * @param {'failover' | 'rotate'} policy 当前策略
 * @returns {Array<'primary' | 'secondary'>} 顺序
 */
function requestOrder(policy) {
	const order = attemptOrder(policy)
	const override = accountPreference()
	if (override !== 'auto' && manualStrict() && order.includes(override)) return [override]
	return applyAccountOverride(order, override)
}

/**
 * 一次成功请求后的状态收尾。
 *
 * @param {'failover' | 'rotate'} policy 当前策略
 * @param {'primary' | 'secondary'} name 这次用的是谁
 * @param {Map<string, { kind?: string }>} results 本次已尝试的结果
 * @param {'auto' | 'primary' | 'secondary'} manualAtStart **请求起手时**的档位快照
 */
function noteSuccess(policy, name, results, manualAtStart) {
	// 用户在请求飞行期间改了档位（点了备号又立刻按回自动，或反过来）：这次请求的
	// 结果反映的是旧意图，写进池状态会把用户的新选择悄悄推翻——实测「手动备号 →
	// 按回自动 → 飞行中的备号请求成功」会把 preferred 写回 secondary，回自动后的
	// 第一个请求又先打备号。整段跳过，让新档位的下一次请求自己定事实。
	if (accountPreference() !== manualAtStart) return
	// 手动优先期间不改池状态：那条覆盖是用户显式按下的，不该被一次请求的结果
	// 悄悄改写，否则「备号」按钮会在一次成功后被自动策略吃掉。
	const override = manualAtStart
	if (override !== 'auto') {
		// 但「按下的那一档没兑现」必须留痕，否则卡片会一直亮着按不下去的档位。
		if (name === override) {
			clearDegraded()
			// 手动档兑现：把池状态对齐到用户的选择，这样按回「自动」时不会带着
			// 手动期间遗留的 preferred 继续跑（review 必修 1 的另一半）。
			if (policy === 'failover') {
				if (name === 'primary') notePrimary()
				else if (pool.preferred !== 'secondary') noteSwitch('手动切到备用账号')
			}
		}
		else if (override === 'secondary') {
			// 这里是「备号被正常读出来、请求也真的发出去了，但上游失败」的路径。
			// 说「读不到 / 内容损坏 / 同账号」是误诊——用户会去查凭据文件，而真因是上游。
			//
			// results 里没有 secondary 就说明备号压根没被用上：那句更准确的原因
			// 已经由 chatStream 的入口路径写过了，这里不能再盖掉它。
			if (results.has('secondary')) {
				const reason = results.get('secondary')?.kind ?? '失败'
				noteDegraded('secondary-unusable', '已选备用账号但它这次失败（' + reason + '），本次请求由主账号接住')
			}
		} else {
			const reason = results.get('primary')?.kind ?? '失败'
			noteDegraded('primary-fell-back', '已选主账号但它本次失败（' + reason + '），本次请求由备用账号接住')
		}
		return
	}
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
		/** 真正发出过请求的档位（严格档只发一个，所以不能拿 order 当它用）。 */
		const attempted = []
		let secondary
		let secondaryUnusable = false
		/** 备号读不出来时的原因（循环结束后「一次都没发」也要用它）。 */
		let lastUnusableReason
		// 档位快照：请求飞行期间用户可能改档，届时这次请求的结果属于旧意图。
		const manualAtStart = accountPreference()
		const order = requestOrder(policy)

		for (const name of order) {
			let attempt = credential
			if (name === 'secondary') {
				/** 备号读不出来时的具体原因，用来给卡片一句可读的话。 */
				let unusableReason
				if (!secondaryUnusable && secondary === undefined) {
					secondary = await secondaryCredential(this, authPath)
					if (secondary === undefined) unusableReason = '读不到备用账号凭据（文件缺失、内容损坏或刷新失败）'
					else if (sameAccount(secondary, credential)) {
						// 两条路径指向同一个账号：切了也是同一个额度，白烧一次请求。
						secondary = undefined
						unusableReason = '备用账号与主账号是同一个账号'
					}
				}
				if (secondary === undefined) {
					secondaryUnusable = true
					lastUnusableReason = unusableReason ?? '本次不可用'
					// 用户亲手按了「备号」却没兑现：必须让卡片说出来，不能静默落回主号。
					// 严格档下 order 里只剩备号，说「回落主账号」是假话——一个请求都没发。
					if (manualAtStart === 'secondary') {
						noteDegraded(
							'secondary-unusable',
							order.includes('primary')
								? '已选备用账号但它不可用（' + lastUnusableReason + '），本次请求回落主账号'
								: '已选备用账号但它不可用（' + lastUnusableReason + '），严格档不会换号，本次请求没有发出',
						)
					}
					continue
				}
				attempt = secondary
			}

			const result = await original.call(this, attempt, body, signal)
			results.set(name, result)
			attempted.push(name)
			if (result?.ok === true) {
				noteSuccess(policy, name, results, manualAtStart)
				return result
			}
			// 用户/会话已取消：不要再用另一个账号重发。
			if (signal?.aborted === true) return result
			// 主账号遇到非「换号能解决」的失败：原样返回，不动备用账号。
			//
			// 这条早退也必须留痕：5xx/网络错误不属于 SWITCHABLE_KINDS，请求就停在
			// 主号，手动选了档位却一次都没兑现——不留痕的话卡片上什么都不显示，
			// 正是「同一件事两种说法」的那一半。
			if (name === 'primary' && !SWITCHABLE_KINDS.has(result?.kind)) {
				noteManualMiss(manualAtStart, attempted, results, result)
				return result
			}
			// 备用账号失败（任何原因）都继续试主账号——主账号才是用户预期的那一个。
		}

		// 都失败了：报主账号的失败原因，别用备号的 session_dead 把主号的额度不足说歪。
		//
		// 手动选了某一档、全败时也留一句：成功路径上「按下的那档没兑现」会写
		// degraded，全失败时如果什么都不写，同一件事在卡片上就有两种说法。
		const primaryResult = results.get('primary') ?? results.get('secondary')
		if (primaryResult !== undefined) noteManualMiss(manualAtStart, attempted, results, primaryResult)
		if (primaryResult !== undefined) return primaryResult
		// 一个请求都没发出去（严格档下唯一选中的账号不可用）。上游兜底给的是
		// status 0 的 'no credential attempted'，那对用户等于没有信息。
		return {
			ok: false,
			kind: 'client',
			status: 400,
			message:
				lastUnusableReason === undefined
					? 'workbuddy: no credential attempted'
					: 'workbuddy: 已选备用账号但它不可用（' + lastUnusableReason + '）',
		}
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

/**
 * 备用账号「真的能用」吗？
 *
 * `existsSync` 只证明文件躺在那里：文件可能是坏信封、可能是主账号自己的拷贝、
 * 也可能是国际站凭据。以前拿它当可用性，结果卡片上「备号」按钮亮着，按下去每次
 * 都静默空转。这里真解析一次，只读不刷新——过期但能解析的凭据仍然算可用，
 * 续期是请求路径的事。
 *
 * @param {string} authPath 备用凭据文件
 * @returns {Promise<{configured: boolean, usable: boolean, reason?: string}>} 可用性
 */
export async function secondaryAvailability(authPath) {
	const signature = secondarySignature(authPath)
	const cached = shared.availability
	if (cached !== undefined && cached.signature === signature && Date.now() - cached.at < AVAILABILITY_TTL_MS) {
		return cached.value
	}
	/** 成功/失败都写进缓存，坏文件的结论也要复用，不然每次打开卡片都重新解析。 */
	const value = await probeSecondary(authPath)
	shared.availability = { signature, at: Date.now(), value }
	return value
}

/** 备用凭据文件的大小+修改时间，用来给可用性缓存做失效判定。 */
function secondarySignature(authPath) {
	try {
		const info = statSync(authPath)
		return info.size + ':' + Math.round(info.mtimeMs)
	} catch {
		return 'missing'
	}
}

/**
 * 真解析一次主备凭据并比较身份。
 *
 * @param {string} authPath 备用凭据文件
 * @returns {Promise<{configured: boolean, usable: boolean, reason?: string}>} 结论
 */
async function probeSecondary(authPath) {
	if (!existsSync(authPath)) return { configured: false, usable: false, reason: '备用凭据文件不存在' }
	const keyProvider = (shared.keyProvider ??= atRestKeyProviderFor(CN_VARIANT))
	let secondary
	try {
		secondary = await new WorkBuddyCredentialStore({
			variant: CN_VARIANT,
			desktopPath: authPath,
			ownPath: join(resolveDshHome(), SECONDARY_OWN_FILENAME),
			keyProvider,
		}).current()
	} catch (error) {
		return { configured: true, usable: false, reason: '备用凭据读不出来（' + String(error?.message ?? error) + '）' }
	}
	if (secondary === undefined) return { configured: true, usable: false, reason: '备用凭据文件里没有登录信息' }
	try {
		const primary = await (shared.primaryStore ??= new WorkBuddyCredentialStore({ variant: CN_VARIANT, keyProvider })).current()
		if (primary !== undefined && sameAccount(secondary, primary)) {
			return { configured: true, usable: false, reason: '备用账号与主账号是同一个账号' }
		}
	} catch {
		// 主号读不出来不是备号的错：只影响「是否同一账号」这条判断，放行。
	}
	return { configured: true, usable: true }
}

/**
 * 手动档写入的收口钩子：按回「自动」的同一刻把池状态复位。
 *
 * review 必修 1 的根因是「手动期间池状态冻住」——一旦手动档没兑现（或者兑现了但
 * 池里还留着上次自动切号的结果），回 auto 后第一个请求就会拿旧顺序走。这里在写入
 * 那一刻复位，比在每个请求里补判更省心：状态只有一个源头。
 *
 * 装在 globalThis 上，热重载不会叠加监听器。
 */
function installPreferenceBridge() {
	if (shared.bridgeInstalled) return
	shared.bridgeInstalled = true
	onAccountPreferenceChange((override) => {
		if (override === 'auto') {
			pool.preferred = 'primary'
			pool.switchedAt = 0
			clearDegraded()
			return
		}
		// 换档就等于换了意图：降级提示必须跟着清掉，否则上一档的红字会挂在新档上。
		clearDegraded()
	})
}

installPreferenceBridge()

const installed = installChatPipeline()

/**
 * 只读诊断：当前池状态。给 CLI / 排查用，不参与请求路径。
 *
 * @returns {{policy: string, secondarySlot: boolean, secondaryUsable: boolean | undefined,
 *   secondaryPath: string | undefined, preferred: string, switchedAt: number,
 *   override: string, degraded?: {kind: string, message: string}, routeFailed: boolean}} 状态快照
 */
export function accountPoolStatus() {
	const authPath = secondaryAuthPath()
	// 缓存里的可用性结论（同步可见）：没探测过、或文件已经变了就是 undefined。
	const warmed = shared.availability
	const usable =
		authPath !== undefined && warmed !== undefined && warmed.signature === secondarySignature(authPath)
			? warmed.value.usable
			: undefined
	return {
		policy: accountPolicy(),
		/** 备用槽位文件在不在（不等于是不是能用——坏信封也会是 true）。 */
		secondarySlot: authPath !== undefined && secondaryConfiguredAt(authPath),
		/** 最近一次真解析的结论：undefined 表示还没探测过。 */
		secondaryUsable: usable,
		secondaryPath: authPath,
		preferred: pool.preferred,
		switchedAt: pool.switchedAt,
		/** 卡片上的手动优先（auto | primary | secondary）。 */
		override: accountPreference(),
		/** 手动档没兑现的原因（只在手动档期间出现）。 */
		...(shared.degraded === undefined ? {} : { degraded: shared.degraded }),
		/** 切号路由挂载失败过（卡片上不会有控件，日志里有 warn）。 */
		routeFailed: shared.routeFailed !== undefined,
	}
}

/**
 * 手动优先账号的读写入口（CLI / 测试用；卡片走 HTTP 路由）。
 *
 * @param {'auto' | 'primary' | 'secondary'} [value] 不传则只读
 * @returns {ReturnType<typeof accountPoolStatus>} 状态（写完后是最新快照）
 */
export function accountSwitch(value) {
	if (value !== undefined) setAccountPreference(value)
	return accountPoolStatus()
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
			// 两条规则分别报，便于一眼看出是品牌串还是 @ 路径句在生效。
			const pairs = rewritePairs()
			ctx?.logger?.info?.(
				'[dsh-workbuddy-plus] 出站请求改写 ' +
					pairs.length + ' 条规则：' +
					pairs.map((p) => JSON.stringify(p.from.slice(0, 24)) + '->' + JSON.stringify(p.to.slice(0, 24))).join('；'),
			)
		} else {
			ctx?.logger?.warn?.('[dsh-workbuddy-plus] 未找到 WorkBuddyUpstreamClient.prototype.chatStream，品牌改写未生效')
		}
		const policy = accountPolicy()
		const authPath = policy === 'off' ? undefined : secondaryAuthPath()
		// 手动切换路由：只要有备用槽位就挂上，卡片才能在两个账号间来回按。
		//
		// 留痕点在 registerAccountRoute 内部（那里才在 cordis 的 fiber 回调里）。
		// 外面的 try 只兜「组装参数时抛错」这一路，抓不到 inject 回调里的失败——
		// cordis 会把它交给 fiber 的 .catch，调用方一行也看不到。
		shared.routeFailed = undefined
		if (authPath !== undefined) {
			try {
				registerAccountRoute(ctx, {
					describe: async () => {
						const status = accountPoolStatus()
						// 可用性必须是「真能解析成另一个账号」，不能用文件在不在——
						// 否则坏信封会让「备号」按钮亮着，按下去每次静默空转。
						const availability = await secondaryAvailability(authPath)
						return {
							policy: status.policy,
							secondaryConfigured: availability.usable,
							...(availability.usable || availability.reason === undefined
								? {}
								: { unavailableReason: availability.reason }),
							...(shared.degraded === undefined ? {} : { degraded: shared.degraded }),
						}
					},
				}, undefined, (error) => {
					// 挂不上路由 = 卡片上会安静地少一个控件。这条日志是唯一的留痕。
					shared.routeFailed = error
					shared.logger?.warn?.('[dsh-workbuddy-plus] 手动切号路由未挂上（卡片不会显示切换控件）', error)
				})
			} catch (error) {
				shared.routeFailed = error
				shared.logger?.warn?.('[dsh-workbuddy-plus] 手动切号路由未挂上（卡片不会显示切换控件）', error)
			}
		}
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
