/**
 * 真 apply 接线：不喂桩 describe，直接让 index.js 的 apply() 在假 ctx 上跑一遍，
 * 再把它注册的路由挂进真 http server 打一轮请求。
 *
 * 别的测试都在验「处理器本身对不对」，这条验的是「处理器有没有真的被装上、装在哪、
 * 谁给的 describe、底层 describe 有没有真的去解析备号文件」——render-card 只加载浏览器
 * 半，switch-ui 只调 registerAccountRoute，两边都绕过了 apply()。
 *
 * node test/apply-wiring.mjs
 */
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const home = mkdtempSync(join(tmpdir(), 'wb-apply-'))
mkdirSync(home, { recursive: true })
process.env.DSH_HOME = home
process.env.WORKBUDDY_ACCOUNT_POLICY = 'failover'
delete process.env.WORKBUDDY_AUTH_FILE_2
delete process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT

const secondaryPath = join(home, '.workbuddy-account-2.info')

/** 写一份能真解析的备号凭据（桌面 App 的明文 JSON 形态，不走信封解码）。 */
function writeSecondary(token = 'token-b', uid = 'uid-b') {
	writeFileSync(
		secondaryPath,
		JSON.stringify({
			auth: { accessToken: token, domain: 'www.workbuddy.cn', expiresAt: Date.now() + 3600_000 },
			account: { uid },
		}),
	)
}

writeSecondary()

const plus = await import('../index.js')
const pool = await import('../lib/account-pool.js')

const routes = []
const disposers = []
/** 只实现 apply() 真正用到的那几个服务；缺一个都会在 apply 里炸出真实错误，这正是这条测试要的。 */
const ctx = {
	logger: { info() {}, warn() {}, error() {}, debug() {} },
	effect(fn, label) {
		const dispose = fn()
		disposers.push({ label, dispose })
	},
	inject(names, fn) {
		fn({
			effect: ctx.effect,
			webServer: {
				register(route) {
					routes.push(route)
					return () => routes.splice(routes.indexOf(route), 1)
				},
			},
		})
	},
	on() {
		return () => {}
	},
	plugin() {
		return () => {}
	},
}

// apply 里还有品牌改写的日志分支，宿主 context 上那些服务这里都没有；缺了只该影响
// 我们自己插进去的那一段，不该让整条接线失败。
let applyError
try {
	plus.apply(ctx, {})
} catch (error) {
	applyError = error
}
assert.equal(applyError, undefined, 'apply() 不该抛错：' + (applyError && applyError.message))

const accountRoute = routes.find((route) => route.path === pool.ACCOUNT_ROUTE_PATH)
assert.ok(accountRoute, 'apply() 必须挂上切号路由（路径 ' + pool.ACCOUNT_ROUTE_PATH + '）')
assert.equal(accountRoute.kind, 'exact')
assert.equal(typeof accountRoute.handler, 'function')
assert.ok(
	disposers.some((entry) => String(entry.label).includes('account preference')),
	'路由必须挂在带可读标签的 effect 里，插件卸载时才能摘掉',
)
assert.equal(plus.accountPoolStatus().routeFailed, false, '挂上了就不该留失败痕迹')

const server = createServer((req, res) => {
	accountRoute.handler(req, res).catch((error) => {
		res.writeHead(500)
		res.end(String(error))
	})
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = 'http://127.0.0.1:' + server.address().port + pool.ACCOUNT_ROUTE_PATH

try {
	// 1) GET：真 describe 走到 secondaryAvailability，备号文件能解析 → available.secondary=true。
	const first = await fetch(base)
	assert.equal(first.status, 200)
	const doc = await first.json()
	assert.equal(doc.override, 'auto', '默认是自动档')
	assert.equal(doc.policy, 'failover')
	assert.deepEqual(doc.available, { primary: true, secondary: true }, '能解析的备号要报可用')
	assert.equal(typeof doc.key, 'string')
	assert.equal(doc.unavailableReason, undefined, '能解析就不该带不可用原因')
	assert.equal(doc.degraded, undefined, '自动档不该带降级原因')
	assert.equal(first.headers.get('cache-control'), 'no-store')

	// 2) 把备号文件写成坏信封：文档要跟着变。这条只有走真 describe 才成立——
	//    桩 describe 无论文件怎么改都吐同一个答案。
	writeFileSync(secondaryPath, '{"auth": broken envelope')
	const broken = await (await fetch(base)).json()
	assert.equal(broken.available.secondary, false, '坏信封必须报不可用（按钮要禁用）')
	assert.ok(String(broken.unavailableReason).includes('备用凭据'), '要说清为什么不可用：' + broken.unavailableReason)

	// 3) 把文件写回能解析的形态：可用性判定必须跟着回来（缓存按 size+mtime 失效，
	//    否则改好文件还要等 15s 才在卡片上生效）。
	writeSecondary()
	const restored = await (await fetch(base)).json()
	assert.deepEqual(restored.available, { primary: true, secondary: true }, '文件改好后必须重新报可用')
	assert.equal(restored.unavailableReason, undefined, '改好后不该再挂着上一条不可用原因')

	// 4) POST：带 key 与同源 Origin 才能改档位。
	const updated = await fetch(base, {
		method: 'POST',
		headers: { 'content-type': 'application/json', [pool.ACCOUNT_KEY_HEADER]: doc.key, origin: 'http://127.0.0.1:' + server.address().port },
		body: JSON.stringify({ account: 'primary' }),
	})
	assert.equal(updated.status, 200)
	const next = await updated.json()
	assert.equal(next.override, 'primary', 'POST 的响应必须回吐新档位（不是写之前读到的旧值）')
	assert.equal(pool.accountPreference(), 'primary', 'Host 侧状态要真的变了')
	assert.equal(next.degraded, undefined, '刚写入的响应不该带上一轮的降级原因')

	// 5) 插件卸载时路由与 effect 都要能摘干净，否则模板热替换会越挂越多。
	//    这里只验 disposer 真的把路由从注册表摘掉；真实宿主里 handler 随 server 一起走，
	//    本地这条 http server 是我自己挂的，摘不摘是我的责任，不构成对宿主的断言。
	for (const entry of disposers) entry.dispose()
	assert.equal(routes.length, 0, 'dispose 后注册表里不该还剩路由')
} finally {
	await new Promise((resolve) => server.close(resolve))
}

console.log(JSON.stringify({ ok: true, routes: routes.map((route) => route.path) }))
// apply() 里上游会留定时器（update store），不显式退出会挂住。
process.exit(0)
