/**
 * 手动切号（CN 通道卡片按钮）的端到端验证。
 *
 * 场景清单见下方 `SCENARIOS`（每个场景一个进程：池状态与手动优先都是模块级单例，
 * 同进程连跑会互相污染）。逐项枚举在这里维护过一次就漂了，所以只留这一句。
 *
 *   node test/switch-ui.mjs <场景名>
 *   node test/switch-ui.mjs all        # 逐个场景起子进程跑一遍
 * 不传参数等价于 route。退出码 0 = 通过。
 *
 * 除 route 外都需要一份备用凭据文件；测试自己写临时文件，不碰 $DSH_HOME。
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import * as httpModule from 'node:http'
import { createServer } from 'node:http'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SCENARIOS = [
	'route',
	'wiring',
	'switch-first',
	'fallback',
	'sticky',
	'auto-release',
	'auto-residual',
	'unavailable',
	'bad-secondary',
	'no-secondary',
	'secondary-degraded',
	'secondary-upstream-fail',
	'primary-fell-back',
	'strict',
	'strict-unavailable',
	'guards',
	'route-failure',
	'route-stale-degraded',
	'double-fail-manual',
	'manual-miss-hard-fail',
	'manual-miss-single-slot',
	'same-slot-repress',
	'inflight-switch',
]
const scenario = process.argv[2] ?? 'route'

// 「全部跑一遍」必须一个场景一个进程：手动优先是模块级单例，同进程连跑会互相污染。
if (scenario === 'all') {
	const failed = []
	for (const name of SCENARIOS) {
		const run = spawnSync(process.execPath, [process.argv[1], name], { encoding: 'utf8' })
		process.stdout.write((run.status === 0 ? 'ok   ' : 'FAIL ') + name + '\n')
		if (run.status !== 0) failed.push({ name, stdout: run.stdout, stderr: run.stderr })
	}
	if (failed.length > 0) {
		process.stderr.write(JSON.stringify(failed, null, 2) + '\n')
		process.exit(1)
	}
	process.stdout.write('all ' + SCENARIOS.length + ' scenarios passed\n')
	process.exit(0)
}
const dir = mkdtempSync(join(tmpdir(), 'wb-switch-'))
const secondaryPath = join(dir, 'account-b.info')
const hour = 3_600_000

/** 写一份明文凭据（桌面 App 老格式，parseWorkBuddyAuth 直接认）。 */
function writeCredential(path, token, uid) {
	writeFileSync(
		path,
		JSON.stringify({
			auth: { accessToken: token, domain: 'www.workbuddy.cn', expiresAt: Date.now() + hour },
			account: { uid },
		}),
		{ mode: 0o600 },
	)
}
writeCredential(secondaryPath, 'token-b', 'uid-b')

process.env.WORKBUDDY_ACCOUNT_POLICY = 'failover'
process.env.WORKBUDDY_ACCOUNT_COOLDOWN_MS = '600000'
delete process.env.WORKBUDDY_BRAND_FIX
if (scenario === 'unavailable') {
	// 指向一个不存在的路径：卡片上的「备号」按钮应当是禁用的。
	process.env.WORKBUDDY_AUTH_FILE_2 = join(dir, 'nope.info')
} else {
	process.env.WORKBUDDY_AUTH_FILE_2 = secondaryPath
}

const pool = await import('dsh-workbuddy-plus/account-pool')
const plus = await import('dsh-workbuddy-plus')
const { WorkBuddyUpstreamClient } = await import('dsh-workbuddy-plus/connect')

/**
 * 把路由挂到裸服务器上，用真实 fetch 打它。
 *
 * @param {{secondaryConfigured: boolean}} described 池状态探针的返回值
 * @returns {Promise<{url: string, close: () => Promise<void>}>} 服务器句柄
 */
async function mount(described) {
	const server = createServer(pool.accountRouteHandler({ describe: () => described }))
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
	const { port } = server.address()
	return {
		port,
		url: 'http://127.0.0.1:' + port + '/plugins/dsh-workbuddy-connect/account',
		close: () => new Promise((resolve) => server.close(resolve)),
	}
}

/**
 * 用 node:http 直接发一个请求。
 *
 * 必须绕开 fetch：Host 是 fetch 的禁止头，会被 undici 静默丢掉，于是「伪 Host 该被
 * 403」这条断言会变成「带着正确 Host 却断言 403」的假测试。
 *
 * @param {number} port 目标端口
 * @param {{method?: string, headers?: Record<string, string>, body?: string}} options 请求参数
 * @returns {Promise<{status: number, body: string}>} 响应
 */
function rawRequest(port, options = {}) {
	const { request } = httpModule
	return new Promise((resolve, reject) => {
		const req = request(
			{
				host: '127.0.0.1',
				port,
				method: options.method ?? 'GET',
				path: '/plugins/dsh-workbuddy-connect/account',
				headers: options.headers ?? {},
			},
			(res) => {
				let body = ''
				res.setEncoding('utf8')
				res.on('data', (chunk) => {
					body += chunk
				})
				res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }))
			},
		)
		req.on('error', reject)
		if (options.body !== undefined) req.write(options.body)
		req.end()
	})
}

/** 真 fetch，打桩前的原件：打桩之后要打本地 HTTP 路由时得换回来。 */
const realFetch = globalThis.fetch
/** 打桩 fetch：记录每次调用的凭据，按 token 决定返回什么。 */
const calls = []
function stubFetch(handler) {
	globalThis.fetch = async (url, init) => {
		const headers = init?.headers ?? {}
		const record = {
			authorization: headers.Authorization ?? headers.authorization,
			userId: headers['X-User-Id'] ?? headers['x-user-id'],
		}
		calls.push(record)
		return handler(record)
	}
}
const sseOk = () => new Response('data: [DONE]\n\n', { status: 200, headers: { 'content-type': 'text/event-stream' } })
const credit402 = () =>
	new Response(JSON.stringify({ code: 402, msg: 'insufficient credits' }), { status: 402, headers: { 'content-type': 'application/json' } })
const server500 = () => new Response('upstream exploded', { status: 500, headers: { 'content-type': 'text/plain' } })
const byToken = (map, fallback) => (call) => {
	const token = String(call.authorization ?? '').replace('Bearer ', '')
	const chosen = map[token] ?? fallback ?? server500
	return typeof chosen === 'function' ? chosen() : chosen
}

const client = new WorkBuddyUpstreamClient()
const body = JSON.stringify({ messages: [{ role: 'user', content: 'hi' }], stream: true })
const credentialA = {
	accessToken: 'token-a',
	refreshToken: '',
	expiresAtMs: Date.now() + hour,
	domain: 'www.workbuddy.cn',
	uid: 'uid-a',
	source: 'desktop',
}
const tokens = () => calls.map((call) => String(call.authorization).replace('Bearer ', ''))

if (scenario === 'route') {
	const server = await mount({ policy: 'failover', secondaryConfigured: true })
	try {
		// 1. GET 给出 key 与当前状态
		const read = await fetch(server.url, { headers: { accept: 'application/json' } })
		assert.equal(read.status, 200, 'GET 应 200')
		const doc = await read.json()
		assert.equal(doc.override, 'auto', '初始应为 auto')
		assert.deepEqual(doc.available, { primary: true, secondary: true }, '两个账号都应可用')
		assert.equal(typeof doc.key, 'string', 'GET 必须给出写入用的 key')
		assert.ok(doc.key.length >= 32, 'key 应足够长')

		// 2. 没有 key 的 POST 必须被拒（loopback 不是认证）
		const noKey = await fetch(server.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ account: 'secondary' }),
		})
		assert.equal(noKey.status, 403, '缺 key 的写入必须 403')
		assert.equal((await noKey.json()).error, 'invalid-account-key')

		// 3. 错误 key 同样拒绝
		const badKey = await fetch(server.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WorkBuddy-Account-Key': 'deadbeef' },
			body: JSON.stringify({ account: 'secondary' }),
		})
		assert.equal(badKey.status, 403)

		// 4. 带 key 的写入生效，并回吐完整文档
		const ok = await fetch(server.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WorkBuddy-Account-Key': doc.key },
			body: JSON.stringify({ account: 'secondary' }),
		})
		assert.equal(ok.status, 200, '带 key 的写入应 200')
		const written = await ok.json()
		assert.equal(written.state, 'updated')
		// 这个字段顺序是硬约束：document 是写入**之前**读的（override 还是旧值），
		// written 必须展开在后面。反过来就会回「200 + override 还是 auto」，
		// 卡片看着像没按成，而服务端其实已经切号了。
		assert.equal(written.override, 'secondary', '响应体必须吐出新档位，不是写入前的旧值')
		assert.ok(written.updatedAt > 0)
		assert.equal(typeof written.key, 'string', '写回后仍要给出 key，下一次 POST 还要用')
		assert.equal(pool.accountPreference(), 'secondary', '模块状态必须跟着变')
		assert.equal(plus.accountPoolStatus().override, 'secondary', '导出状态也要跟着变')

		// 5. 非法取值被拒（不因为 loopback 就信任 body）
		const bad = await fetch(server.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WorkBuddy-Account-Key': doc.key },
			body: JSON.stringify({ account: 'tertiary' }),
		})
		assert.equal(bad.status, 400, '未知取值必须 400')

		// 6. 再读一次：写入已持久
		const again = await (await fetch(server.url)).json()
		assert.equal(again.override, 'secondary')
	} finally {
		await server.close()
	}
	console.log(JSON.stringify({ ok: true, scenario }, null, 2))
} else if (scenario === 'unavailable') {
	// 备用槽位不存在：GET 必须自报 secondary:false，让按钮先禁用。
	const server = await mount({ policy: 'failover', secondaryConfigured: false })
	try {
		const doc = await (await fetch(server.url)).json()
		assert.deepEqual(doc.available, { primary: true, secondary: false }, '没有备用文件时 secondary 必须不可用')
	} finally {
		await server.close()
	}
	assert.equal(plus.accountPoolStatus().secondarySlot, false, '池状态也要如实报告备用槽位不存在')
	console.log(JSON.stringify({ ok: true, scenario }, null, 2))
} else if (scenario === 'switch-first') {
	// 手动选备号：即使策略想先试主号，也必须先发备号。
	pool.setAccountPreference('secondary')
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true)
	assert.deepEqual(tokens(), ['token-b'], '手动优先备号时第一个请求必须用备号')
	assert.deepEqual(calls.map((c) => c.userId), ['uid-b'])
	assert.equal(plus.accountPoolStatus().override, 'secondary', '一次成功不应改写手动优先')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'fallback') {
	// 手动选备号但备号 5xx：必须回落主号，而不是整次失败。
	pool.setAccountPreference('secondary')
	stubFetch(byToken({ 'token-b': server500(), 'token-a': sseOk() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, '备号失败后应回落主号成功')
	assert.deepEqual(tokens(), ['token-b', 'token-a'], '顺序必须是先备号再主号')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'sticky') {
	// 手动优先必须扛住多次请求：不能被自动策略的 noteSuccess 吃掉。
	pool.setAccountPreference('secondary')
	stubFetch(sseOk)
	await client.chatStream(credentialA, body, undefined)
	calls.length = 0
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-b'], '第二次请求仍应先备用')
	assert.equal(pool.accountPreference(), 'secondary')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'auto-release') {
	// 回到自动：下一次请求必须恢复策略顺序（主号优先）。
	pool.setAccountPreference('secondary')
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-b'])
	calls.length = 0
	pool.setAccountPreference('auto')
	stubFetch(sseOk)
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-a'], '切回自动后应回到主号优先')
	assert.equal(pool.accountPreference(), 'auto')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'no-secondary') {
	// 备号槽位不可用 + 手动选了备号：请求必须仍然成功（只能落到主号），
	// 而不是整轮报错。路由层的 available.secondary=false 只是不让按，
	// 但状态是进程内的，别的入口（CLI / 测试 / 旧页面）照样能写进来。
	process.env.WORKBUDDY_AUTH_FILE_2 = join(dir, 'nope.info')
	pool.setAccountPreference('secondary')
	stubFetch(sseOk)
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, '备号不可用时仍应走主号成功')
	assert.deepEqual(tokens(), ['token-a'], '只能发一次，且必须是主号')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'auto-residual') {
	// review 必修 1 的回归：自动档下主号 402 触发切号 → 手动按主号 → 按回自动，
	// 下一个请求必须回到主号优先。没有「写 auto 时复位池状态」的话，这里仍会先发备号。
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-a', 'token-b'], '自动档应先主后备')
	assert.equal(plus.accountPoolStatus().preferred, 'secondary', '切号后池里应记为优先备号')

	calls.length = 0
	pool.setAccountPreference('primary')
	stubFetch(sseOk)
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-a'], '手动主号应只发主号')

	calls.length = 0
	pool.setAccountPreference('auto')
	stubFetch(sseOk)
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-a'], '按回自动后必须回到主号优先，不能残留上一次的切号状态')
	assert.equal(plus.accountPoolStatus().preferred, 'primary', '回自动时池状态必须收口')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'bad-secondary') {
	// 备号文件在、但是坏信封：可用性必须判成 false（按钮禁用），而不是「文件存在即可用」。
	process.env.WORKBUDDY_AUTH_FILE_2 = secondaryPath
	writeFileSync(secondaryPath, '{"auth": broken envelope', { mode: 0o600 })
	const availability = await plus.secondaryAvailability(secondaryPath)
	assert.equal(availability.configured, true, '文件在，configured 应为 true')
	assert.equal(availability.usable, false, '坏信封绝不能算可用')
	assert.ok(String(availability.reason).length > 0, '必须给出不可用的原因')

	const server = await mount({
		policy: 'failover',
		secondaryConfigured: availability.usable,
		unavailableReason: availability.reason,
	})
	try {
		const doc = await (await fetch(server.url)).json()
		assert.equal(doc.available.secondary, false, '坏文件时备号按钮必须禁用')
		assert.ok(String(doc.unavailableReason).includes('备用凭据'), '必须把原因交给卡片')
	} finally {
		await server.close()
	}
	console.log(JSON.stringify({ ok: true, scenario, reason: availability.reason }, null, 2))
} else if (scenario === 'secondary-degraded') {
	// review 必修 2 的回归：手动按了备号但备号不可用，请求落到主号，卡片必须能说出原因。
	process.env.WORKBUDDY_AUTH_FILE_2 = secondaryPath
	writeFileSync(secondaryPath, '{"auth": broken envelope', { mode: 0o600 })
	pool.setAccountPreference('secondary')
	stubFetch(sseOk)
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, '备号不可用时仍应走主号成功')
	assert.deepEqual(tokens(), ['token-a'], '只能发一次，且必须是主号')

	const status = plus.accountPoolStatus()
	assert.equal(status.override, 'secondary', '手动档没兑现也不能偷偷改掉用户的选择')
	assert.equal(status.degraded?.kind, 'secondary-unusable', '必须记下降级原因')
	assert.ok(String(status.degraded?.message).includes('回落主账号'), '降级说明要写清发生了什么')
	// 误诊隔离：备号一个请求都没发出去，失败类别是主号的 hard_credit。如果用主号的
	// 类别去讲备号，用户会跑去查备号凭据文件，而真因是主号额度不足。
	const message = String(status.degraded?.message)
	assert.ok(!message.includes('但它这次失败'), '备号没发过请求，不能说「它这次失败」：' + message)
	assert.ok(!message.includes('hard_credit'), '失败类别是主号的，不能挂在备号身上：' + message)

	const server = await mount({ policy: 'failover', secondaryConfigured: false, degraded: status.degraded })
	globalThis.fetch = realFetch
	try {
		const doc = await (await fetch(server.url)).json()
		assert.equal(doc.degraded?.kind, 'secondary-unusable', '降级原因必须出现在卡片读到的文档里')
	} finally {
		await server.close()
	}

	// 回到自动：降级提示必须被清掉，否则红字会挂在一个已经不存在的状态上。
	pool.setAccountPreference('auto')
	assert.equal(plus.accountPoolStatus().degraded, undefined, '换档必须清掉上一档的降级提示')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'secondary-upstream-fail') {
	// 备号被正常读出来、请求也真发出去了，但上游 500：degraded 不能说「读不到 / 内容
	// 损坏 / 同账号」——那是误诊，会把用户赶去查凭据文件。必须说清是这次失败。
	pool.setAccountPreference('secondary')
	stubFetch(byToken({ 'token-b': server500(), 'token-a': sseOk() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, '备号 500 后应回落主号成功')
	assert.deepEqual(tokens(), ['token-b', 'token-a'], '备号确实被用过')

	const degraded = plus.accountPoolStatus().degraded
	assert.equal(degraded?.kind, 'secondary-unusable')
	assert.ok(String(degraded.message).includes('server'), '要说出真实类别：' + String(degraded?.message))
	assert.ok(!String(degraded.message).includes('内容损坏'), '不能把上游 500 说成凭据损坏')
	assert.ok(!String(degraded.message).includes('读不到'), '不能把上游 500 说成读不到')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens(), degraded }, null, 2))
} else if (scenario === 'primary-fell-back') {
	// 手动按主号但主号额度用尽、由备号接住：这是「手动档没兑现」的另一半，之前零覆盖。
	pool.setAccountPreference('primary')
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, '主号 402 后应由备号接住')
	assert.deepEqual(tokens(), ['token-a', 'token-b'])
	const degraded = plus.accountPoolStatus().degraded
	assert.equal(degraded?.kind, 'primary-fell-back', '必须记成「主号没兑现」')
	assert.ok(String(degraded.message).includes('hard_credit'), '要带上真实类别')
	assert.equal(plus.accountPoolStatus().override, 'primary', '不能偷偷改掉用户的选择')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens(), degraded }, null, 2))
} else if (scenario === 'strict-unavailable') {
	// 严格档 + 手动备号 + 备号槽位不存在：一个请求都发不出去。这时既不能声称
	// 「回落主账号」（根本没回落），也不能只给上游的 status 0 'no credential attempted'。
	process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT = '1'
	process.env.WORKBUDDY_AUTH_FILE_2 = join(dir, 'nope.info')
	pool.setAccountPreference('secondary')
	stubFetch(sseOk)
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, false, '严格档没有兜底，必须失败')
	assert.deepEqual(tokens(), [], '一个请求都不该发出去')
	assert.notEqual(result.status, 0, '状态码必须可读，不能是上游兜底的 0')
	assert.ok(String(result.message).includes('不可用'), '错误信息要给出可读原因：' + String(result.message))
	const degraded = plus.accountPoolStatus().degraded
	assert.ok(String(degraded?.message).includes('没有发出'), 'degraded 不能声称回落主账号')
	assert.ok(!String(degraded?.message).includes('回落'), '严格档根本没回落')
	delete process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens(), message: result.message, degraded }, null, 2))
} else if (scenario === 'guards') {
	// 路由的守卫层：这一层之前只有一次性人工验证，没有回归。
	const server = await mount({ policy: 'failover', secondaryConfigured: true })
	try {
		const doc = JSON.parse((await rawRequest(server.port)).body)
		assert.equal(pool.accountPreference(), 'auto')

		// 1. 伪 Host：loopback 不是靠「连得上」判断的
		const badHost = await rawRequest(server.port, { headers: { host: 'evil.example.com' } })
		assert.equal(badHost.status, 403, '伪 Host 必须 403')
		assert.equal(JSON.parse(badHost.body).error, 'request-not-trusted')

		// 2. 跨站 Origin：浏览器里防的是「别的网页替我按按钮」
		const badOrigin = await rawRequest(server.port, { headers: { origin: 'http://evil.example' } })
		assert.equal(badOrigin.status, 403, '跨站 Origin 必须 403')
		const nullOrigin = await rawRequest(server.port, { headers: { origin: 'null' } })
		assert.equal(nullOrigin.status, 403, 'Origin: null 必须 403')

		// 3. 非 GET/POST：守卫在 method 之前，所以非 loopback 看不到 405 的差异
		const put = await rawRequest(server.port, { method: 'PUT' })
		assert.equal(put.status, 405, 'PUT 必须 405')
		const putEvil = await rawRequest(server.port, { method: 'PUT', headers: { host: 'evil.example.com' } })
		assert.equal(putEvil.status, 403, '非 loopback 的 PUT 必须还是 403（不泄露路由存在）')

		// 4. body 上限：2KB 必须 413，而且不能顺手把 override 改掉
		const big = await rawRequest(server.port, {
			method: 'POST',
			headers: { 'X-WorkBuddy-Account-Key': doc.key, 'content-type': 'application/json' },
			body: JSON.stringify({ account: 'secondary', pad: 'x'.repeat(2048) }),
		})
		assert.equal(big.status, 413, '超长 body 必须 413')
		assert.equal(pool.accountPreference(), 'auto', '被拒的写入不能改状态')

		// 5. 响应不得被缓存
		const read = await rawRequest(server.port)
		assert.equal(read.headers['cache-control'], 'no-store')
		// 6. GET 里不能出现任何凭据
		assert.ok(!/token|authorization|uid/i.test(read.body), 'GET 文档不能带凭据')
	} finally {
		await server.close()
	}
	console.log(JSON.stringify({ ok: true, scenario }, null, 2))
} else if (scenario === 'double-fail-manual') {
	// 手动选了备号、两档全败：成功路径上「按下的那档没兑现」会写 degraded，
	// 全失败时也得写一句，否则同一件事在卡片上有两种说法（一种说、一种不说）。
	pool.setAccountPreference('secondary')
	stubFetch(byToken({ 'token-b': server500(), 'token-a': credit402() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, false, '两档都失败就该整体失败')
	assert.deepEqual(tokens(), ['token-b', 'token-a'], '先备号后主号')

	const status = plus.accountPoolStatus()
	assert.equal(status.override, 'secondary', '失败不得改写用户按下的档位')
	assert.equal(status.degraded?.kind, 'secondary-unusable', '全失败也要留痕')
	assert.ok(String(status.degraded.message).includes('两档都没成功'), '要说清是两档都没成：' + String(status.degraded?.message))
	assert.ok(String(status.degraded.message).includes('server'), '要带上选中那档的真实失败类别')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens(), degraded: status.degraded }, null, 2))
} else if (scenario === 'manual-miss-hard-fail') {
	// 主号 500 不属于 SWITCHABLE_KINDS，请求停在主号就早退——这条路径以前完全不写
	// degraded，于是「按了主号却失败」在卡片上什么都不显示。
	pool.setAccountPreference('primary')
	stubFetch(byToken({ 'token-a': server500(), 'token-b': sseOk() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, false, '主号 500 应原样失败')
	assert.deepEqual(tokens(), ['token-a'], '不可切换类失败不得去试备号')

	const status = plus.accountPoolStatus()
	assert.equal(status.degraded?.kind, 'primary-fell-back', '硬失败也要留痕')
	const message = String(status.degraded.message)
	assert.ok(message.includes('server'), '要说真实类别：' + message)
	assert.ok(message.includes('本次只尝试了选中的这一档'), '只发了一档就得这么说：' + message)
	assert.ok(!message.includes('两档都没成功'), '说「两档」是在讲一件没发生的事：' + message)
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens(), degraded: status.degraded }, null, 2))
} else if (scenario === 'manual-miss-single-slot') {
	// 严格档只发选中的那一档，文案不能再说「两档都没成功」。
	process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT = '1'
	pool.setAccountPreference('primary')
	stubFetch(byToken({ 'token-a': credit402(), 'token-b': sseOk() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, false, '严格档没有兜底')
	assert.deepEqual(tokens(), ['token-a'], '严格档只发选中的那一档')

	const message = String(plus.accountPoolStatus().degraded?.message)
	assert.ok(message.includes('本次只尝试了选中的这一档'), '文案要按真实档数写：' + message)
	assert.ok(!message.includes('两档都没成功'), '严格档根本没试第二档：' + message)
	delete process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens(), message }, null, 2))
} else if (scenario === 'same-slot-repress') {
	// 再按一次当前档位 = 手动清掉红字。语义上说得通（重新表个态），锁住它以免
	// 以后被当成 bug 改掉：Host 在写入那一刻 clearDegraded，响应里不该再带旧记录。
	const server = await mount({
		policy: 'failover',
		secondaryConfigured: true,
		degraded: { kind: 'secondary-unusable', message: '上一轮遗留的原因', at: 1 },
	})
	try {
		const doc = await (await fetch(server.url)).json()
		assert.equal(doc.override, 'auto')
		assert.equal(doc.degraded?.kind, 'secondary-unusable', '前置：先有一条旧记录')

		const press = (account) => fetch(server.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WorkBuddy-Account-Key': doc.key },
			body: JSON.stringify({ account }),
		}).then((res) => res.json())

		const first = await press('secondary')
		assert.equal(first.override, 'secondary')
		const again = await press('secondary')
		assert.equal(again.override, 'secondary', '同档重按仍是同档')
		assert.equal(again.degraded, undefined, '重按即表态，旧红字必须消失')
		assert.equal(pool.accountPreference(), 'secondary', '状态仍是用户按下的那一档')
		console.log(JSON.stringify({ ok: true, scenario }, null, 2))
	} finally {
		await server.close()
	}
} else if (scenario === 'inflight-switch') {
	// 请求飞行期间用户按回自动：这次请求的结果属于旧意图。把 preferred 写回备号
	// 的话，回自动后的第一个请求又会先打备号——用户按了「自动」，下一次却还是备号。
	const server = undefined
	pool.setAccountPreference('secondary')
	let release
	const gate = new Promise((resolve) => {
		release = resolve
	})
	let gated = true
	globalThis.fetch = async (url, init) => {
		const headers = init?.headers ?? {}
		const record = {
			authorization: headers.Authorization ?? headers.authorization,
			userId: headers['X-User-Id'] ?? headers['x-user-id'],
		}
		calls.push(record)
		if (gated) {
			gated = false
			await gate
		}
		return sseOk()
	}
	const pending = client.chatStream(credentialA, body, undefined)
	// 等到第一个请求真的发出去（备号已解析、fetch 已被调用）。
	while (calls.length === 0) await new Promise((resolve) => setTimeout(resolve, 5))
	assert.equal(plus.accountPoolStatus().override, 'secondary', '前置：起手时是手动备号')
	pool.setAccountPreference('auto')
	release()
	const result = await pending
	assert.equal(result.ok, true, '飞行中的请求本身仍应成功')
	assert.deepEqual(tokens(), ['token-b'], '起手是备号，这次请求就该用备号')

	// 关键断言：旧请求不得把池状态写回备号。
	assert.equal(plus.accountPoolStatus().preferred, 'primary', '飞行中改档后，旧请求的结果不得改写池状态')

	calls.length = 0
	stubFetch(sseOk)
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['token-a'], '回自动后的第一个请求必须走主号')
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'route-stale-degraded') {
	// POST 的响应是「写入后的文档」，但 describe 是在写之前调的：那一刻的
	// degraded 记录在写入时已经被 Host 清掉了。把它带回客户端，卡片会在用户
	// 刚按下新档位时多挂一句已经作废的红字。
	// 探针每次都吐同一条旧记录（Host 的真实行为是：写入那一刻才清），
	// 这样断言「POST 响应里没有它」才不是靠探测顺序碰巧成立的。
	const server = await mount({
		policy: 'failover',
		secondaryConfigured: true,
		degraded: { kind: 'secondary-unusable', message: '上一轮遗留的原因', at: 1 },
	})
	try {
		const doc = await (await fetch(server.url)).json()
		assert.equal(doc.degraded?.kind, 'secondary-unusable', '写入前 GET 应能看到旧记录')

		const ok = await fetch(server.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-WorkBuddy-Account-Key': doc.key },
			body: JSON.stringify({ account: 'primary' }),
		})
		assert.equal(ok.status, 200)
		const written = await ok.json()
		assert.equal(written.override, 'primary', '响应该吐出新档位')
		assert.equal(written.degraded, undefined, '写入前读到的降级记录已经作废，不能带回来')
		assert.equal(written.available.secondary, true, '可用性与档位无关，照旧透传')
		console.log(JSON.stringify({ ok: true, scenario }, null, 2))
	} finally {
		await server.close()
	}
} else if (scenario === 'route-failure') {
	// 状态探针抛错（凭据解析失败、atRest key provider 构造失败）：宿主
	// dsh-host-webserver 对 handler 的 .catch 是 writeHead(400) + end()，所以
	// handler 自己得兜住，否则卡片只会拿到「400 + 空体」。
	//
	// 更关键的是 POST 的顺序：先写状态再读文档时，读文档失败会让客户端收到
	// 失败、卡片停在旧档位，可服务端的 override 其实已经改了——「说了没按成，
	// 其实按成了」比一次干净的错误难查得多。
	const good = await mount({ policy: 'failover', secondaryConfigured: true })
	let key
	try {
		key = (await (await fetch(good.url)).json()).key
	} finally {
		await good.close()
	}

	const boom = () => {
		throw new Error('describe boom')
	}
	const server = createServer(pool.accountRouteHandler({ describe: boom }))
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
	const { port } = server.address()
	try {
		// 1. GET：500 + 可读原因，不是空体
		const read = await rawRequest(port)
		assert.equal(read.status, 500, '探针抛错必须 500（宿主会把未捕获异常压成 400 空体）')
		const doc = JSON.parse(read.body)
		assert.equal(doc.error, 'account-route-failed', '错误码要能区分「路由自己挂了」')
		assert.ok(String(doc.detail).includes('describe boom'), 'detail 要带真原因')

		// 2. POST：读文档失败 → 状态一点没改
		pool.setAccountPreference('auto')
		const write = await rawRequest(port, {
			method: 'POST',
			headers: { 'X-WorkBuddy-Account-Key': key, 'content-type': 'application/json' },
			body: JSON.stringify({ account: 'secondary' }),
		})
		assert.equal(write.status, 500, 'POST 也必须 500')
		assert.equal(pool.accountPreference(), 'auto', '回失败就不能已经偷偷改了状态')

		// 3. 失败响应同样不该被缓存
		assert.equal(read.headers['cache-control'], 'no-store')
	} finally {
		await server.close()
	}
	console.log(JSON.stringify({ ok: true, scenario }, null, 2))
} else if (scenario === 'strict') {
	// WORKBUDDY_ACCOUNT_MANUAL_STRICT=1：手动档严格只用选中的账号，失败也不换。
	process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT = '1'
	pool.setAccountPreference('primary')
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, false, '严格档下主号 402 不应偷偷换成备号')
	assert.deepEqual(tokens(), ['token-a'], '严格档只允许发一次，且必须是指定账号')
	delete process.env.WORKBUDDY_ACCOUNT_MANUAL_STRICT
	console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
} else if (scenario === 'wiring') {
	// apply() 的接线：有备用槽位时挂路由、路径正确、dispose 闭包可用。
	const registered = []
	const disposers = []
	const ctx = {
		effect(fn, label) {
			const dispose = fn()
			disposers.push({ label, dispose })
		},
		inject(names, fn) {
			assert.deepEqual(names, ['webServer'], '必须注入 webServer')
			fn({
				effect: ctx.effect,
				webServer: {
					register(route) {
						registered.push(route)
						return () => registered.splice(registered.indexOf(route), 1)
					},
				},
			})
		},
	}
	pool.registerAccountRoute(ctx, { describe: () => ({ policy: 'failover', secondaryConfigured: true }) })
	assert.equal(registered.length, 1, '应注册一条路由')
	assert.equal(registered[0].kind, 'exact')
	assert.equal(registered[0].path, '/plugins/dsh-workbuddy-connect/account', '路径必须与浏览器半写死的常量一致')
	assert.equal(typeof registered[0].handler, 'function')
	assert.equal(disposers.length, 1, '必须挂在 effect 里，插件卸载时能被清理')
	assert.ok(String(disposers[0].label).includes('account preference'), 'effect 要有可读标签')
	disposers[0].dispose()
	assert.equal(registered.length, 0, 'dispose 后路由应被摘掉')

	// 浏览器半的常量必须与 Host 半一致（两半独立构建，写死是刻意的）。
	const { readFileSync } = await import('node:fs')
	const client = readFileSync(new URL('../lib/connect/client.js', import.meta.url), 'utf8')
	assert.ok(client.includes('const ACCOUNT_ROUTE_PATH = "' + pool.ACCOUNT_ROUTE_PATH + '";'), '浏览器半的路由常量必须与 Host 半相同')
	assert.ok(client.includes('"X-WorkBuddy-Account-Key": doc.key'), '浏览器半必须带 key 头发写请求')
	assert.ok(client.includes('function AccountSwitch('), '切换控件必须存在于浏览器半')
	assert.ok(client.includes('useAccountSwitch(t, variant)'), '卡片必须挂上切号状态钩子')
	assert.ok(client.includes('accountModeSecondaryUnavailable'), '未配置备用账号时要有禁用文案')
	// 文案不能承诺不存在的兜底：主号 5xx 是不会换号的（SWITCHABLE_KINDS 不含 server）。
	assert.ok(!client.includes('5xx / 网络失败'), '不准承诺 5xx 兜底')
	assert.ok(!client.includes('still covers 5xx and network failures'), '英文文案同样不准承诺 5xx 兜底')
	assert.ok(client.includes('额度用尽 / 限流 / 登录失效时仍会切到备号'), '主号档要写清真正会换号的那三类')

	// register 在 inject 回调里抛错时，留痕回调必须被调用——调用方的 try/catch 抓不到
	// （cordis 把回调当 fiber 的 apply 跑，错误交给 fiber 自己的 .catch）。
	const recorded = []
	const failingCtx = {
		inject(names, fn) {
			// 模拟 cordis：回调里的异常由 fiber 自己吞掉，不会冒泡到调用方。
			try {
				fn({
					effect(run) {
						run()
					},
					webServer: {
						register() {
							throw new Error('webserver: duplicate exact route "/plugins/dsh-workbuddy-connect/account"')
						},
					},
				})
			} catch {
				// 故意吞掉：真实 cordis 就是这个行为
			}
		},
	}
	let leaked
	try {
		pool.registerAccountRoute(failingCtx, { describe: () => ({ policy: 'failover', secondaryConfigured: true }) }, undefined, (error) => {
			recorded.push(error)
		})
	} catch (error) {
		leaked = error
	}
	assert.equal(leaked, undefined, 'registerAccountRoute 不该把 inject 回调里的错抛给调用方')
	assert.equal(recorded.length, 1, '必须通过 onError 留痕（否则卡片少一个控件而日志全空）')
	assert.ok(String(recorded[0].message).includes('duplicate exact route'), '留痕要带上原始错误')
	console.log(JSON.stringify({ ok: true, scenario, path: pool.ACCOUNT_ROUTE_PATH, routeFailureTraced: recorded.length === 1 }, null, 2))
} else {
	throw new Error('unknown scenario: ' + scenario)
}