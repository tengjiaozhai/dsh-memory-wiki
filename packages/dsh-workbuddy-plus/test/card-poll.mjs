/**
 * 卡片是否真的会「自己再读一次」切号文档。
 *
 * 这条链路以前零覆盖：控件只在挂载时 GET 一次 /account，而 Host 的 degraded /
 * unavailableReason 都是在卡片已经挂在屏幕上之后才写的。挂载后不再读，意味着
 * 「按了备号但它不可用」这句原因要等用户折叠再展开才看得到——等于看不见。
 *
 * 服务端渲染测不出这件事（renderToStaticMarkup 不跑 effect），所以这里带一个
 * 极小的 hooks 运行时：渲染、跑 effect、重渲染、手动触发定时器，全部自己驱动。
 *
 *   node test/card-poll.mjs
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const MARKER = '//#region dsh-workbuddy-plus/account-switch'
const source = readFileSync(join(root, 'lib/connect/client.js'), 'utf8')
const start = source.indexOf(MARKER)
assert.ok(start > 0, '找不到补丁区')
const end = source.indexOf('\n//#endregion', start)
assert.ok(end > start, '补丁区没有结尾围栏')
const region = source.slice(start + MARKER.length, end)

/**
 * 迷你 hooks 运行时：够跑 useAccountSwitch 用的那四个钩子。
 *
 * 与 React 的差别只在调度：这里没有并发、没有批处理，setState 之后立刻同步重渲染。
 * 对本测试关心的东西（effect 何时重跑、清理函数是否被调用）语义是一致的。
 */
function createHooks() {
	let cells = []
	let cursor = 0
	let pendingEffects = []
	let scheduled = false
	/** 依赖数组逐个比较：长度不同即视为变了。 */
	const sameDeps = (a, b) => {
		if (a === undefined || b === undefined) return false
		if (a.length !== b.length) return false
		return a.every((value, index) => Object.is(value, b[index]))
	}
	const react = {
		useState(initial) {
			const index = cursor++
			if (!(index in cells)) cells[index] = typeof initial === 'function' ? initial() : initial
			const set = (next) => {
				const value = typeof next === 'function' ? next(cells[index]) : next
				if (Object.is(value, cells[index])) return
				cells[index] = value
				scheduled = true
			}
			return [cells[index], set]
		},
		useRef(initial) {
			const index = cursor++
			if (!(index in cells)) cells[index] = { current: initial }
			return cells[index]
		},
		useCallback(fn, deps) {
			const index = cursor++
			const previous = cells[index]
			if (previous !== undefined && sameDeps(previous.deps, deps)) return previous.fn
			cells[index] = { fn, deps }
			return fn
		},
		useEffect(fn, deps) {
			const index = cursor++
			const previous = cells[index]
			const changed = previous === undefined || !sameDeps(previous.deps, deps)
			cells[index] = { deps, cleanup: previous?.cleanup }
			if (changed) pendingEffects.push({ index, fn })
		},
	}
	/** 一次渲染 + 把新排队的 effect 跑完（含清理上一轮的）。 */
	const render = (component) => {
		cursor = 0
		pendingEffects = []
		const output = component()
		for (const { index, fn } of pendingEffects) {
			const cell = cells[index]
			if (typeof cell.cleanup === 'function') cell.cleanup()
			const cleanup = fn()
			cell.cleanup = typeof cleanup === 'function' ? cleanup : undefined
		}
		return output
	}
	/** 一直重渲染到没有 setState 排进来的为止（最多 20 轮，防跑飞）。 */
	const settle = (component) => {
		let output = render(component)
		for (let round = 0; round < 20 && scheduled; round += 1) {
			scheduled = false
			output = render(component)
		}
		assert.ok(!scheduled, '重渲染没有收敛（effect 里在无条件改状态？）')
		return output
	}
	return { react, render: settle, cells }
}

/** 让出几个微任务：让 await fetch / await json 走完。 */
const flush = async (rounds = 8) => {
	for (let index = 0; index < rounds; index += 1) await Promise.resolve()
	await new Promise((resolve) => setTimeout(resolve, 0))
}

const { react, render } = createHooks()
const build = new Function(
	'react',
	'react_jsx_runtime',
	'errorStyle',
	'noticeStyle',
	'CN_CARD_VARIANT',
	'AI_CARD_VARIANT',
	'POLL_INTERVAL_MS',
	region + '\nreturn { useAccountSwitch };',
)
// 变体是要比身份（`variant === CN_CARD_VARIANT`），所以这里必须复用同一个对象：
// 传两个字面量进去，控件会以为自己不是 CN 卡片，整段逻辑都不跑。
const CN_VARIANT = { id: 'workbuddy' }
const { useAccountSwitch } = build(react, {}, {}, {}, CN_VARIANT, { id: 'workbuddy-ai' }, 25)

const dict = {
	accountUnreadable: 'WorkBuddy 返回了读不懂的账号回复',
	accountModeAuto: '自动',
	accountModePrimary: '主号',
	accountModeSecondary: '备号',
}
const t = (key) => dict[key] ?? key

/** 定时器桩：只登记回调，由测试决定什么时候「到点」。 */
const timers = []
globalThis.window = {
	setInterval: (fn, ms) => {
		const handle = { fn, ms, cleared: false }
		timers.push(handle)
		return handle
	},
	clearInterval: (handle) => {
		if (handle !== undefined) handle.cleared = true
	},
}

let requests = []
let responder = () => ({ status: 200, body: { key: 'k1', override: 'auto', policy: 'failover', available: { primary: true, secondary: true } } })
/** 手写的 fetch 桩：记录请求，按 responder 回包。 */
globalThis.fetch = async (url, init = {}) => {
	const record = { url: String(url), method: init.method ?? 'GET', body: init.body, headers: init.headers ?? {} }
	requests.push(record)
	const reply = await responder(record)
	if (reply === 'hang') return new Promise(() => {})
	return new Response(JSON.stringify(reply.body), { status: reply.status, headers: { 'content-type': 'application/json' } })
}

let latest
const component = () => {
	latest = useAccountSwitch(t, CN_VARIANT)
	return latest
}

/**
 * 跑一轮：渲染（effect 发请求）→ 让 promise 链走完 → 再渲染，把状态读出来。
 *
 * setState 发生在 await 之后，已经不在 render 的调用栈里了，所以必须显式再渲染一次。
 */
const step = async (rounds = 8) => {
	render(component)
	await flush(rounds)
	render(component)
}

// ---- 1. 挂载就读一次 ----
await step()
assert.equal(requests.length, 1, '挂载后必须读一次切号文档')
assert.equal(requests[0].method, 'GET')
assert.equal(latest.doc?.override, 'auto', '读到的文档要进状态')

// ---- 2. 定时器把它自己重读一遍 ----
assert.equal(timers.length, 1, '只该有一个轮询定时器')
const poll = timers[0]
assert.equal(poll.ms, 25, '轮询间隔取上游的 POLL_INTERVAL_MS')
responder = () => ({ status: 200, body: { key: 'k1', override: 'secondary', policy: 'failover', available: { primary: true, secondary: false }, unavailableReason: '备用账号与主账号是同一个账号', degraded: { kind: 'secondary-unusable', message: '已选备用账号但它不可用' } } })
poll.fn()
await step()
assert.equal(requests.length, 2, '到点必须再读一次')
assert.equal(latest.doc?.override, 'secondary', 'Host 侧改的档位要能自己走到卡片上')
assert.equal(latest.doc?.unavailableReason, '备用账号与主账号是同一个账号', '禁用原因要能自己走到卡片上')
assert.equal(latest.doc?.degraded?.message, '已选备用账号但它不可用', 'degraded 要能自己走到卡片上')

// ---- 3. 写入进行中不许并发的读 ----
// 写入还没回来时再读一次，会让「刚按下的档位」被一份更旧的文档覆盖。
let releaseWrite
const writeGate = new Promise((resolve) => {
	releaseWrite = resolve
})
const baseResponder = responder
responder = async (request) => {
	if (request.method !== 'POST') return baseResponder(request)
	await writeGate
	return { status: 200, body: { key: 'k1', override: 'primary', policy: 'failover', available: { primary: true, secondary: true } } }
}
const pressing = latest.set('primary')
await flush()
assert.equal(requests.at(-1).method, 'POST', '前置：写入已经发出')
const duringWrite = requests.length
poll.fn()
await flush()
assert.equal(requests.length, duringWrite, '写入还没回来时，轮询不该再发一个读请求（否则会覆盖掉刚按下的档位）')
releaseWrite()
await pressing
await step()
assert.equal(latest.doc?.override, 'primary', '写回的新档位要落到卡片状态里')
assert.equal(latest.busy, false, '写入结束后必须解除 busy')
assert.ok(poll.cleared !== true, '写入结束后轮询照旧')
responder = baseResponder

// ---- 4. 路由不存在（404）时整块隐身，且停掉轮询 ----
const before = timers.length
responder = () => ({ status: 404, body: {} })
timers[0].fn()
await step()
assert.equal(latest.enabled, false, '404 时控件必须隐身（宿主还没重启，没做错任何事）')
assert.ok(timers[0].cleared, '隐身之后不该继续轮询一个不存在的路由')
assert.equal(timers.length, before, '不该新开定时器')

// ---- 5. 网络失败要留一句可读的话 ----
responder = () => {
	throw new Error('network down')
}
latest.refresh()
await step()
assert.equal(latest.failure, 'network down', '失败原因要能显示出来')
assert.equal(latest.doc?.override, 'primary', '失败不得清掉已知的文档')

console.log(JSON.stringify({
	ok: true,
	reads: requests.filter((request) => request.method === 'GET').length,
	writes: requests.filter((request) => request.method === 'POST').length,
	hiddenOn404: true,
	pollStoppedOn404: true,
}, null, 2))
