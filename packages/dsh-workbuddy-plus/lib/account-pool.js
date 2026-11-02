/**
 * 手动优先账号（CN 通道）：把「当前优先用主号还是备号」变成可写状态。
 *
 * 本模块是 `dsh-workbuddy-plus` 自研部分，不是上游 vendor 产物，所以重跑
 * `scripts/vendor-upstream.mjs` 不会覆盖它。它与 `index.js` 的 chatStream 管线
 * 通过同一个全局 Symbol 共享状态，热重载后旧闭包仍能被新模块驱动。
 *
 * 语义刻意分成两件事：
 *
 *  - **策略**（`WORKBUDDY_ACCOUNT_POLICY`）决定「谁先谁后、什么时候自动换号」；
 *  - **手动优先**（本模块）只覆盖「这一次先试谁」，仍然保留另一侧的兜底。
 *
 * 所以手动切到备号并不会让主号彻底出局：备号 5xx/404 时照样回落主号——那正是
 * 用户按下按钮时想要的，而不是一个「切过去就再也回不来」的状态。
 *
 * @module dsh-workbuddy-plus/account-pool
 */
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { existsSync } from 'node:fs'

/** 手动优先账号的取值域。`auto` 表示交回策略自己决定。 */
export const ACCOUNT_OVERRIDES = ['auto', 'primary', 'secondary']

/** 写操作路由：与 status/probe 同一个前缀，Host 与浏览器两半都写死它。 */
export const ACCOUNT_ROUTE_PATH = '/plugins/dsh-workbuddy-connect/account'

/** 手动优先账号的请求头（写操作必须证明自己拿到过 key）。 */
export const ACCOUNT_KEY_HEADER = 'x-workbuddy-account-key'

/** 控制体上限：只有一个短字符串。 */
const MAX_BODY_BYTES = 1024

/** Loopback 主机名白名单，与上游 loopback 守卫同一份集合。 */
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]'])

/** 跨模块实例共享的状态（热重载安全）。 */
const STATE_KEY = Symbol.for('dsh-workbuddy-plus/account-override')

const state = (globalThis[STATE_KEY] ??= {
	/** 'auto' | 'primary' | 'secondary' */
	override: 'auto',
	/** 最近一次手动设置的时间戳，0 表示从未手动设置过。 */
	updatedAt: 0,
	/** 每个宿主进程一枚，只发给同源卡片。 */
	key: randomBytes(24).toString('hex'),
	/** 写入后的副作用钩子；index.js 用它把失败切号留下的池状态收口。 */
	listeners: [],
})

// 热重载时可能接上旧模块留下的状态对象，缺字段就补齐，而不是假设它是最新的。
if (!Array.isArray(state.listeners)) state.listeners = []

/**
 * 当前手动优先账号。
 *
 * @returns {'auto' | 'primary' | 'secondary'} 当前取值
 */
export function accountPreference() {
	return state.override
}

/**
 * 写入手动优先账号。
 *
 * @param {unknown} value 期望的取值
 * @returns {{override: string, updatedAt: number}} 写入后的状态
 */
export function setAccountPreference(value) {
	if (typeof value !== 'string' || !ACCOUNT_OVERRIDES.includes(value)) {
		throw new Error('workbuddy: unknown account preference ' + JSON.stringify(value))
	}
	state.override = value
	state.updatedAt = Date.now()
	for (const listener of state.listeners) {
		// 监听方（池状态收口）出错不能把一次成功的写入变成 500：状态已经改了。
		try {
			listener(state.override, state.updatedAt)
		} catch (error) {
			// 静默：这是内部一致性维护，不是请求路径。
		}
	}
	return { override: state.override, updatedAt: state.updatedAt }
}

/**
 * 订阅手动优先的写入。
 *
 * 手动切号期间请求管线不改池状态（否则一次成功就会把用户按下的档位吃掉），
 * 所以「从手动档回到自动」这一刻必须有人把池状态收口，否则自动策略会带着
 * 手动期间遗留的 `preferred='secondary'` 继续跑。这就是这个钩子的唯一职责。
 *
 * @param {(override: string, updatedAt: number) => void} listener 写入后回调
 * @returns {() => void} 取消订阅
 */
export function onAccountPreferenceChange(listener) {
	if (typeof listener !== 'function') return () => {}
	state.listeners.push(listener)
	return () => {
		const index = state.listeners.indexOf(listener)
		if (index !== -1) state.listeners.splice(index, 1)
	}
}

/**
 * 按手动优先重排一次请求的尝试顺序。
 *
 * 只调整顺序，不删元素：另一侧仍然留在列表里当兜底。两个账号指向同一个账号时
 * 由调用方（chatStream 管线）的 sameAccount 检查处理，这里不重复判断。
 *
 * @param {Array<'primary' | 'secondary'>} order 策略算出的顺序
 * @param {'auto' | 'primary' | 'secondary'} [override] 手动优先，默认读当前状态
 * @returns {Array<'primary' | 'secondary'>} 重排后的顺序
 */
export function applyAccountOverride(order, override = accountPreference()) {
	if (override !== 'primary' && override !== 'secondary') return order
	const first = override
	// 只重排已有的元素：手动档不该凭空造出一个本次根本没资格尝试的账号
	// （例如单账号部署里按了「备号」，或调用方只传了一个元素）。也不去重——
	// 重排是排列操作，去重是调用方的职责。
	if (!order.includes(first)) return order
	const rest = order.filter((name) => name !== first)
	return [first, ...rest]
}

/** 去掉 Host 头里的可选端口，IPv6 方括号感知。 */
function hostnameOf(host) {
	let hostname = String(host ?? '').trim().toLowerCase()
	if (hostname.startsWith('[')) {
		const end = hostname.indexOf(']')
		return end === -1 ? hostname : hostname.slice(0, end + 1)
	}
	const colon = hostname.lastIndexOf(':')
	if (colon !== -1 && !hostname.slice(0, colon).includes(':') && /^\d+$/.test(hostname.slice(colon + 1))) {
		hostname = hostname.slice(0, colon)
	}
	return hostname
}

/** Host 头必须指向 loopback（挡住 DNS rebinding 页面）。 */
function hostIsLoopback(host) {
	if (host === undefined || String(host).trim() === '') return false
	return LOOPBACK_HOSTS.has(hostnameOf(host))
}

/** 从 Host 头里取端口（缺省按 80），IPv6 方括号感知。 */
function portOf(host) {
	const text = String(host ?? '').trim()
	if (text.startsWith('[')) {
		const end = text.indexOf(']')
		if (end === -1) return '80'
		const rest = text.slice(end + 1)
		return rest.startsWith(':') && /^[0-9]+$/.test(rest.slice(1)) ? rest.slice(1) : '80'
	}
	const colon = text.lastIndexOf(':')
	return colon !== -1 && /^[0-9]+$/.test(text.slice(colon + 1)) ? text.slice(colon + 1) : '80'
}

/**
 * 浏览器带来的 Origin 必须与本次请求的 Host 完全一致；非浏览器客户端不带 Origin，放行。
 *
 * 只比主机名是不够的：同机上任何一个端口的网页（本地开发服务器、随手起的一个
 * http-server）写的都是 `http://127.0.0.1:其他端口`，主机名一样过得了老检查。而这份
 * 文档里带着写 key——拿到 key 就能改用户的手动档位。所以端口必须一起比。
 *
 * 比 Host 而不是比硬编码端口：宿主端口是启动时选的（甚至可以是 0 → 随机），插件不该
 * 知道它；浏览器发请求时一定把同一个端口写进 Host 与 Origin，两者相等就说明这是
 * 「本页自己发起的请求」。
 *
 * @param {string | undefined} origin 请求的 Origin 头
 * @param {string | undefined} host 请求的 Host 头
 * @returns {boolean} 是否可信
 */
function originMatchesHost(origin, host) {
	if (origin === undefined || String(origin).trim() === '') return true
	if (!hostIsLoopback(host)) return false
	let parsed
	try {
		parsed = new URL(String(origin))
	} catch {
		return false
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
	const originPort = parsed.port !== '' ? parsed.port : parsed.protocol === 'https:' ? '443' : '80'
	// URL 会把主机名规范化成小写、去掉末尾的方括号 IPv6 也不需要额外处理；
	// Host 头是原样的，所以两边都过一遍 hostnameOf 再比。
	return hostnameOf(host) === parsed.hostname.toLowerCase() && portOf(host) === originPort
}

/** 常量时间比较；长度不符直接失败，不抛。 */
function keyMatches(expected, presented) {
	if (typeof presented !== 'string' || presented.length !== expected.length) return false
	const a = Buffer.from(expected)
	const b = Buffer.from(presented)
	return a.length === b.length && timingSafeEqual(a, b)
}

/** 写一个 JSON 响应。 */
function json(res, status, body) {
	const payload = JSON.stringify(body)
	res.writeHead(status, {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(payload),
		// 文档里带本进程的写 key：任何缓存都不该留住它。
		'Cache-Control': 'no-store',
	})
	res.end(payload)
}

/** 读请求体，超过上限返回 undefined。 */
async function readBody(req) {
	const chunks = []
	let total = 0
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
		total += buffer.length
		if (total > MAX_BODY_BYTES) return undefined
		chunks.push(buffer)
	}
	return Buffer.concat(chunks).toString('utf8')
}

/**
 * 解析写操作体：只认 `{ account: 'auto' | 'primary' | 'secondary' }`。
 *
 * @param {string} text 原始请求体
 * @returns {{account: string} | undefined} 合法动作，或 undefined
 */
export function parseAccountAction(text) {
	let parsed
	try {
		parsed = JSON.parse(text)
	} catch {
		return undefined
	}
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return undefined
	const account = parsed.account
	if (typeof account !== 'string' || !ACCOUNT_OVERRIDES.includes(account)) return undefined
	return { account }
}

/**
 * 组装这个路由的响应文档。
 *
 * `available` 让卡片能禁用「备号」按钮，而不是让用户按下后才收到一句错误：
 * 备用凭据文件不存在时，切到备号是没有意义的。
 *
 * @param {() => ({policy: string, secondaryConfigured: boolean, degraded?: object} | Promise<{policy: string, secondaryConfigured: boolean, degraded?: object}>)} describe 池状态探针
 * @returns {Promise<object>} 状态文档
 */
async function accountDocument(describe) {
	const described = await describe()
	// 每个字段只读一次：探针是个可能带副作用的回调（Host 半要在里面真解析凭据、
	// 还可能顺手清掉过期的降级记录），把它当纯取值器用两遍会读出两种答案。
	const degraded = described.degraded
	const unavailableReason = described.unavailableReason
	return {
		key: state.key,
		override: state.override,
		updatedAt: state.updatedAt,
		policy: described.policy,
		available: { primary: true, secondary: described.secondaryConfigured === true },
		// 「按了备号但请求落回主号」的原因。没有这个字段就是一切正常。
		...(degraded === undefined ? {} : { degraded }),
		// 备号为什么被禁用（文件不存在 / 坏信封 / 与主号同账号）。
		...(unavailableReason === undefined ? {} : { unavailableReason }),
	}
}

/**
 * 手动优先账号路由的处理函数，抽出来便于测试直接挂到裸服务器上。
 *
 * GET 只读：返回 key 与当前状态（loopback 就够，与 status 路由同一道门）。
 * POST 写入：额外要求 key，与 probe 路由同一道门——loopback 不是认证。
 *
 * @param {{describe: () => ({policy: string, secondaryConfigured: boolean})}} deps 状态探针
 * @returns {(req: any, res: any) => Promise<void>} 处理函数
 */
export function accountRouteHandler(deps) {
	return async (req, res) => {
		try {
			// 守卫在前：否则任意 Host 都能用 405/403 的差异探出这条路由存在。
			if (!hostIsLoopback(req.headers.host) || !originMatchesHost(req.headers.origin, req.headers.host)) {
				json(res, 403, { error: 'request-not-trusted' })
				return
			}
			if (req.method !== 'GET' && req.method !== 'POST') {
				json(res, 405, { error: 'method not allowed' })
				return
			}
			if (req.method === 'GET') {
				json(res, 200, await accountDocument(deps.describe))
				return
			}
			if (!keyMatches(state.key, req.headers[ACCOUNT_KEY_HEADER])) {
				json(res, 403, { error: 'invalid-account-key' })
				return
			}
			const body = await readBody(req)
			if (body === undefined) {
				json(res, 413, { error: 'body too large' })
				return
			}
			const action = parseAccountAction(body)
			if (action === undefined) {
				json(res, 400, { error: 'invalid account preference' })
				return
			}
			// 先读文档、再写状态。顺序反过来时，describe 抛错会让客户端收到失败
			// （宿主的 catch 把 500 压成 400），而服务端其实已经写成功了——卡片还
			// 显示旧档位，下一轮请求却真的换了账号。这种「说了没按成，其实按成了」
			// 的不一致比一次干净的错误更难排查。
			const document = await accountDocument(deps.describe)
			const written = setAccountPreference(action.account)
			// document 是写入**之前**读的，两处必须按「写入后」的事实修正：
			//
			//  - override/updatedAt：written 展开在后面，否则会把刚写进去的档位用旧值
			//    盖掉，客户端收到「200 + override 还是 auto」，看着像没按成；
			//  - degraded：「按下另一档」本身就意味着换了意图，Host 半在写入那一刻会
			//    把降级记录清掉，所以写入前的文档里那行红字已经过期，带上它会让卡片
			//    按一下就多出一句已经作废的说明。available/unavailableReason 不受
			//    档位影响（那是凭据的可用性），照旧透传。
			json(res, 200, {
				state: 'updated',
				key: document.key,
				policy: document.policy,
				available: document.available,
				...(document.unavailableReason === undefined ? {} : { unavailableReason: document.unavailableReason }),
				...written,
			})
		} catch (error) {
			// 状态探针失败（凭据解析、key provider 构造）不能让宿主把它压成
			// 「400 + 空体」：那对卡片等于没有信息，也掩盖了这是服务端的错。
			if (res.headersSent === true) return
			json(res, 500, {
				error: 'account-route-failed',
				detail: String(error?.message ?? error),
			})
		}
	}
}

/**
 * 把路由挂到 webServer 上（没有 webServer 的宿主里什么都不做）。
 *
 * 留痕必须发生在**回调里面**。cordis 把 `inject` 的回调当 fiber 的 apply 跑，回调
 * 抛出的错由 fiber 自己 `.catch(() => ctx.logger.error)` 吞掉——调用方的 try/catch
 * 一行也抓不到。所以这里把 try/catch 放在最内层，并在 `onError` 里交给调用方记一笔。
 *
 * @param {any} ctx Cordis 上下文
 * @param {{describe: () => ({policy: string, secondaryConfigured: boolean})}} deps 状态探针
 * @param {string} [path] 覆盖路由路径（测试用）
 * @param {(error: unknown) => void} [onError] 挂不上路由时的留痕回调（同步回调内调用）
 * @returns {void}
 */
export function registerAccountRoute(ctx, deps, path = ACCOUNT_ROUTE_PATH, onError) {
	ctx.inject(['webServer'], (webCtx) => {
		try {
			webCtx.effect(() => {
				const dispose = webCtx.webServer.register({
					kind: 'exact',
					path,
					handler: accountRouteHandler(deps),
				})
				return () => {
					dispose()
				}
			}, 'dsh-workbuddy-plus: account preference route')
		} catch (error) {
			// 同步 register 失败（重复 exact 路径、path 非法）：在这里留痕，别指望调用方。
			try {
				onError?.(error)
			} catch {
				// 留痕本身失败不能再往上抛：那会把 cordis 的 fiber 弄成 failed。
			}
		}
	})
}

/** 备用凭据文件是否存在（决定「备号」按钮能否按下）。 */
export function secondaryConfiguredAt(path) {
	return typeof path === 'string' && existsSync(path)
}

// 这条路由对外只讲「档位与可用性」：key 是本进程随机数，available/reason 由真解析
// 得出，凭据（token/uid/authorization）一个字段都不出现在文档里。
//
// 改这个文件（以及 index.js）之后必须**重启宿主**才生效：实测 touch 改 mtime、
// 追加一行内容后等 46s、连续多次 POST，响应里的 key 与字段顺序都不变，说明 Host 半
// 用的是启动时加载的模块，不吃热更新。浏览器半 lib/connect/client.js 不一样——它走
// /plugins/events 的 graph 帧热更新，改完刷新页面即可。
