/**
 * 双账号池的端到端验证：用打桩 fetch 走完「品牌改写 → 尝试 → 失败切号」整条链路。
 *
 * 每个场景一个进程（模块级池状态是单例，同进程连跑会互相污染）：
 *   node test/accounts.mjs switch | rotate | solo | default-path | double-fail | server | abort | same-account | cooldown-fallback
 * 不传参数等价于 switch。退出码 0 = 通过。
 */
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const scenario = process.argv[2] ?? 'switch'
const dir = mkdtempSync(join(tmpdir(), 'wb-pool-'))
const secondaryPath = join(dir, 'account-b.info')
const hour = 3_600_000

/**
 * 写一份明文凭据文件（桌面 App 的老格式，parseWorkBuddyAuth 直接认）。
 *
 * @param {string} path 目标路径
 * @param {string} token access token
 * @param {string} uid 账号 uid
 */
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

process.env.WORKBUDDY_ACCOUNT_COOLDOWN_MS = '600000'
delete process.env.WORKBUDDY_BRAND_FIX
process.env.WORKBUDDY_ACCOUNT_POLICY = scenario === 'rotate' ? 'rotate' : 'failover'
if (scenario === 'default-path') {
	// 免配置路径：凭据放在 $DSH_HOME 的默认位置，不设环境变量。
	process.env.DSH_HOME = dir
	writeCredential(join(dir, '.workbuddy-account-2.info'), 'token-b', 'uid-b')
} else if (scenario === 'legacy-path') {
	// 旧槽位名仍兼容（上一版 README 的布局）。
	process.env.DSH_HOME = dir
	writeCredential(join(dir, '.workbuddy-account-b.info'), 'token-b', 'uid-b')
} else if (scenario === 'solo') {
	// 单账号：既没有环境变量，也没有默认文件。
	process.env.DSH_HOME = mkdtempSync(join(tmpdir(), 'wb-solo-'))
} else {
	process.env.WORKBUDDY_AUTH_FILE_2 = secondaryPath
}

const { WorkBuddyUpstreamClient } = await import('dsh-workbuddy-plus/connect')
const { accountPoolStatus } = await import('dsh-workbuddy-plus')

const credentialA = {
	accessToken: 'token-a',
	refreshToken: '',
	expiresAtMs: Date.now() + hour,
	domain: 'www.workbuddy.cn',
	uid: scenario === 'same-account' ? 'uid-b' : 'uid-a',
	source: 'desktop',
}

/** 打桩 fetch：记录每个请求的凭据与 body，按场景返回。 */
const calls = []
function stubFetch(handler) {
	globalThis.fetch = async (url, init) => {
		const headers = init?.headers ?? {}
		const record = {
			authorization: headers.Authorization ?? headers.authorization,
			userId: headers['X-User-Id'] ?? headers['x-user-id'],
			body: String(init?.body ?? ''),
		}
		calls.push(record)
		return handler(record)
	}
}

const sseOk = () => new Response('data: [DONE]\n\n', { status: 200, headers: { 'content-type': 'text/event-stream' } })
const credit402 = () =>
	new Response(JSON.stringify({ code: 402, msg: 'insufficient credits' }), { status: 402, headers: { 'content-type': 'application/json' } })
const auth401 = () =>
	new Response(JSON.stringify({ code: 401, msg: 'token expired' }), { status: 401, headers: { 'content-type': 'application/json' } })
const server500 = () =>
	new Response('upstream exploded', { status: 500, headers: { 'content-type': 'text/plain' } })

/** 按 access token 决定返回什么。 */
const byToken = (map, fallback) => (call) => {
	const token = String(call.authorization ?? '').replace('Bearer ', '')
	const chosen = map[token] ?? fallback ?? server500
	return typeof chosen === 'function' ? chosen() : chosen
}

const client = new WorkBuddyUpstreamClient()
const body = JSON.stringify({ messages: [{ role: 'system', content: 'You are DeepSeek Harness.' }], stream: true })
const tokens = () => calls.map((call) => call.authorization)

if (scenario === 'rotate') {
	stubFetch(sseOk)
	const first = await client.chatStream(credentialA, body, undefined)
	const second = await client.chatStream(credentialA, body, undefined)
	assert.equal(first.ok, true)
	assert.equal(second.ok, true)
	assert.deepEqual(tokens(), ['Bearer token-a', 'Bearer token-b'], 'rotate 应交替两个账号')
	assert.deepEqual(calls.map((c) => c.userId), ['uid-a', 'uid-b'], 'X-User-Id 必须跟着账号走')
	assert.equal(accountPoolStatus().preferred, 'primary', 'rotate 不应改动 failover 的 preferred')
} else if (scenario === 'switch') {
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, '切换后应拿到成功结果')
	assert.deepEqual(tokens(), ['Bearer token-a', 'Bearer token-b'], '应先试主账号，402 后自动切备用')
	assert.deepEqual(calls.map((c) => c.userId), ['uid-a', 'uid-b'])
	assert.equal(accountPoolStatus().preferred, 'secondary', '切过之后应记为优先备用')
	assert.ok(!calls[0].body.includes('DeepSeek Harness'), '出站 body 不应包含宿主品牌串')
	assert.ok(calls[0].body.includes('WorkBuddy'), '出站 body 应已改写成 WorkBuddy')
} else if (scenario === 'solo') {
	stubFetch(credit402)
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(calls.length, 1, '没有第二个账号时不应重试')
	assert.equal(result.ok, false)
	assert.equal(result.kind, 'hard_credit', '失败类型应保持上游分类')
} else if (scenario === 'default-path' || scenario === 'legacy-path') {
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(result.ok, true, scenario + '：槽位文件里的备用账号也应生效')
	assert.deepEqual(tokens(), ['Bearer token-a', 'Bearer token-b'])
} else if (scenario === 'double-fail') {
	// 主号额度不足、备号登录失效：都要试过，但报出来的必须是**主号**的原因。
	stubFetch(byToken({ 'token-a': credit402(), 'token-b': auth401() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['Bearer token-a', 'Bearer token-b'])
	assert.equal(result.ok, false)
	assert.equal(result.kind, 'hard_credit', '双败时应报主账号的 hard_credit，而不是备号的 session_dead')
	assert.equal(accountPoolStatus().preferred, 'primary', '双败不应把状态锁到备用账号')
} else if (scenario === 'server') {
	// 上游 5xx 换号解决不了：只发一次，原样返回。
	stubFetch(server500)
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(calls.length, 1, 'server 失败不应换号重试')
	assert.equal(result.ok, false)
	assert.equal(result.kind, 'server')
} else if (scenario === 'abort') {
	// 会话已取消：即使主号 402 也不再拿备号重发。
	stubFetch(credit402)
	const controller = new AbortController()
	controller.abort()
	const result = await client.chatStream(credentialA, body, controller.signal)
	assert.equal(calls.length, 1, 'abort 后不应再试第二个账号')
	assert.equal(result.ok, false)
} else if (scenario === 'same-account') {
	// 两个文件其实是同一个账号：切号没有意义，不重发。
	stubFetch(credit402)
	const result = await client.chatStream(credentialA, body, undefined)
	assert.equal(calls.length, 1, '同一账号时不应重发')
	assert.equal(result.ok, false)
	assert.equal(result.kind, 'hard_credit')
} else if (scenario === 'cooldown-fallback') {
	// 冷却窗口内备用账号也挂了（5xx）：必须回落到主账号，而不是整窗失败。
	stubFetch(byToken({ 'token-a': credit402() }, sseOk))
	await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['Bearer token-a', 'Bearer token-b'], '第一次应切到备用')
	assert.equal(accountPoolStatus().preferred, 'secondary')
	calls.length = 0
	stubFetch(byToken({ 'token-b': server500(), 'token-a': sseOk() }))
	const result = await client.chatStream(credentialA, body, undefined)
	assert.deepEqual(tokens(), ['Bearer token-b', 'Bearer token-a'], '冷却窗口内备用失败应回落主账号')
	assert.equal(result.ok, true, '回落主账号后应成功')
} else {
	throw new Error('unknown scenario: ' + scenario)
}

console.log(JSON.stringify({ ok: true, scenario, calls: tokens() }, null, 2))
