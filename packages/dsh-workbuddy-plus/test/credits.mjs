/**
 * 卡片双账号额度：mergeCredits 的纯函数用例 + fetchCredits 包装的端到端用例。
 *
 * 用法：node test/credits.mjs   （退出码 0 = 通过）
 */
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const { mergeCredits, accountLabel } = await import('dsh-workbuddy-plus')

/* ---------- 纯函数：合并语义 ---------- */

const primary = {
	total: 80,
	accounts: [{ packageName: 'personal', remain: 80, size: 100, endTimeMs: Date.now() + 86400000 }],
	expiry: { within24h: 1, within3d: 1, within7d: 1 },
	cycleResetTime: '2026-11-01T00:00:00Z',
}
const secondary = {
	total: 40,
	accounts: [
		{ packageName: 'enterprise', remain: 30, size: 50 },
		{ packageName: 'personal', remain: 10, size: 20 },
	],
	expiry: { within24h: 0, within3d: 2, within7d: 2 },
}

const merged = mergeCredits(primary, secondary, 'B', 'A')
assert.equal(merged.total, 120, '合计应是两个账号之和')
assert.equal(merged.accounts.length, 3, '两个账号的账号行都应保留')
assert.deepEqual(
	merged.accounts.map((row) => row.packageName),
	['B · personal', 'A · enterprise', 'A · personal'],
	'每行都要带账号前缀，否则分不清属于谁',
)
assert.equal(merged.cycleResetTime, primary.cycleResetTime, '重置时间沿用主账号')
assert.deepEqual(merged.expiry, { within24h: 1, within3d: 3, within7d: 3 }, '三类即将过期计数相加')

const unlimited = mergeCredits({ total: 0, unlimited: true, accounts: [] }, secondary, 'B', 'A')
assert.equal(unlimited.unlimited, true, '任一方不限量，合计就显示不限量')

const onlyPrimary = mergeCredits(primary, undefined, 'B', 'A')
assert.equal(onlyPrimary.total, 80)
assert.equal(onlyPrimary.accounts.length, 1, '没有备号时只出主号的行')

assert.equal(accountLabel({ nickname: '小明' }), '小明', '有昵称优先用昵称')
assert.equal(accountLabel({ uid: '321026e3-aaaa' }), '321026', '没昵称用 uid 前 6 位')
assert.equal(accountLabel({}), '账号', '两者都没有时给中性名')

/* ---------- 端到端：fetchCredits 包装真的去读了第二个账号 ---------- */

const dir = mkdtempSync(join(tmpdir(), 'wb-credits-'))
const secondaryPath = join(dir, 'account-2.info')
writeFileSync(
	secondaryPath,
	JSON.stringify({
		auth: { accessToken: 'token-b', domain: 'www.workbuddy.cn', expiresAt: Date.now() + 3_600_000 },
		account: { uid: 'uid-b', nickname: '小号' },
	}),
	{ mode: 0o600 },
)
process.env.WORKBUDDY_AUTH_FILE_2 = secondaryPath
process.env.WORKBUDDY_ACCOUNT_POLICY = 'failover'
delete process.env.WORKBUDDY_ACCOUNT_CARD

const { WorkBuddyUpstreamClient } = await import('dsh-workbuddy-plus/connect')

/** 计费接口的打桩：按 token 返回不同的账号行。 */
const seen = []
globalThis.fetch = async (url, init) => {
	const auth = String(init?.headers?.Authorization ?? '')
	const isB = auth.includes('token-b')
	seen.push({ url: String(url), auth })
	const body = {
		code: 0,
		data: {
			Response: {
				Data: {
					Accounts: [
						{
							PackageName: isB ? 'personal' : 'personal',
							CycleCapacitySize: 100,
							CycleCapacityRemain: isB ? 40 : 80,
						},
					],
				},
			},
		},
	}
	return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

const client = new WorkBuddyUpstreamClient()
const credentialA = {
	accessToken: 'token-a',
	refreshToken: '',
	expiresAtMs: Date.now() + 3_600_000,
	domain: 'www.workbuddy.cn',
	uid: 'uid-a',
	nickname: '主号',
	source: 'desktop',
}
const credits = await client.fetchCredits(credentialA)
assert.equal(seen.length, 2, '应分别向两个账号的计费接口各请求一次')
assert.equal(credits.total, 120, '卡片拿到的合计应是两号之和')
assert.deepEqual(
	credits.accounts.map((row) => row.packageName),
	['主号 · personal', '小号 · personal'],
	'账号行前缀是昵称（没有昵称时是 uid 前 6 位）',
)

console.log(JSON.stringify({ ok: true, total: credits.total, rows: credits.accounts.map((row) => row.packageName) }, null, 2))
