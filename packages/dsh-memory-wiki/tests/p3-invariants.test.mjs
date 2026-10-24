/**
 * tests/p3-invariants.test.mjs — P4-hardening invariants (Lead-requested).
 *
 * These exist because selection authority is split on purpose: the EDIT state
 * (`draft`) lives in the adapter, the INJECTION authority (`pendingOverride`)
 * lives in core/SessionMemory. Prose in comments does not survive a refactor, so
 * each invariant is a test:
 *
 *   I1  A draft alone never affects injection; only pendingOverride does.
 *   I2  reviseDraft never writes pendingOverride.
 *   I3  pendingOverride is written ONLY by prepareOverride, and may be cleared by
 *       EXACTLY THREE sanctioned paths, no others:
 *         (1) our own user/message commit that explicitly carries its snapshotId;
 *         (2) reviseDraft, where a changed selection invalidates the old override
 *             (design §8.2);
 *         (3) clearOverride, i.e. the user returning to automatic.
 *
 * I3 also pins the exact reason no OTHER path may clear it: a foreign commit is
 * how users silently lose a prepared selection. (Lead decision D21 replaced the
 * earlier, too-narrow wording "cleared only by our own user/message".)
 */
import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

const LIB = path.join(import.meta.dirname, '..', 'lib')
const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'p3-library')
const { MemoryWikiAdapter } = await import(pathToFileURL(path.join(LIB, 'server', 'index.js')).href)

const SESSION = 'session-test-1'

/** Fake host: session store (authorization) only. */
const ctx = { sessions: { get: id => (id === SESSION ? { id } : undefined) } }

/** Fake agent whose surface can be inspected by preStep. */
function fakeAgent(surface = []) {
  return { id: SESSION, session: { id: SESSION, deriveMessages: () => surface } }
}

/** Automatic snapshot used by the injected "retrieval" port. */
const AUTOMATIC_TEXT = 'AUTOMATIC-SNAPSHOT-TEXT'

function automaticSnapshot() {
  return {
    snapshotId: 'sw_automatic',
    libraryRevision: 'rev-1',
    origin: 'automatic',
    budgetChars: 4000,
    sources: [],
    text: AUTOMATIC_TEXT,
    payloadHash: 'hash-automatic',
    chars: AUTOMATIC_TEXT.length,
  }
}

const human = text => ({ id: 'h-' + text, role: 'user', content: [{ type: 'text', text }], source: { kind: 'user' } })

/** Adapter with an injected automatic-retrieval port that never touches disk. */
function adapter(pageBodyLimitChars) {
  const config = { enabled: true, wikiRoot: FIXTURE, budgetChars: 4000, ...(pageBodyLimitChars === undefined ? {} : { pageBodyLimitChars }) }
  return new MemoryWikiAdapter(ctx, config, { build: () => automaticSnapshot() })
}

/** Put a successful manual draft in place (the only supported way to have a draft). */
async function makeDraft(a) {
  const page = await a.readPage({ pageId: 'wiki/concepts/短页' })
  const view = await a.getView({ sessionId: SESSION, expectedRevision: 1 })
  const drafted = await a.reviseDraft({
    sessionId: SESSION,
    expectedRevision: view.revision,
    query: '短页',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(drafted.error, undefined)
  return drafted
}

// --------------------------------------------------------------------- I1

test('I1：draft 单独存在时不影响注入，注入只用 pendingOverride', async () => {
  const a = adapter()
  const drafted = await makeDraft(a)
  assert.equal(drafted.mode, 'manual-ready')
  assert.ok(drafted.draft !== undefined, 'draft exists')
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'a draft is not an override')

  const decision = { kind: 'enter', messages: [human('问一句')] }
  const out = await a.preStep({ agent: fakeAgent(), turn: 1, step: 1 }, async () => decision)
  const injected = out.messages.filter(m => m.source?.kind === 'memory-wiki')
  assert.equal(injected.length, 1)
  assert.equal(injected[0].content[0].text, AUTOMATIC_TEXT, 'draft text must NOT reach the model without prepareOverride')
  assert.equal(injected[0].source.snapshotId, 'sw_automatic')
})

test('I1b：同样的 draft，prepareOverride 之后注入的就是手选快照', async () => {
  const a = adapter()
  const drafted = await makeDraft(a)
  const prepared = await a.prepareOverride({ sessionId: SESSION, expectedRevision: drafted.revision })
  assert.equal(prepared.error, undefined)

  const out = await a.preStep({ agent: fakeAgent(), turn: 1, step: 1 }, async () => ({ kind: 'enter', messages: [human('问一句')] }))
  const injected = out.messages.filter(m => m.source?.kind === 'memory-wiki')
  assert.equal(injected.length, 1)
  assert.notEqual(injected[0].content[0].text, AUTOMATIC_TEXT, 'prepared manual snapshot wins over retrieval')
  assert.equal(injected[0].source.snapshotId, prepared.prepared.snapshotId)
})

// --------------------------------------------------------------------- I2

test('I2：reviseDraft 不写 pendingOverride', async () => {
  const a = adapter()
  await makeDraft(a)
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'reviseDraft must not create an override')

  const view = await a.getView({ sessionId: SESSION, expectedRevision: 1 })
  assert.equal(view.prepared, undefined, 'prepared is absent until prepareOverride')
})

test('I2b：已有 prepareOverride 后**真的改选**，待用按 design §8.2 失效（同值重提交不算改选，见 p3-remote 的 B13 用例）', async () => {
  const a = adapter()
  const drafted = await makeDraft(a)
  const prepared = await a.prepareOverride({ sessionId: SESSION, expectedRevision: drafted.revision })
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, true)

  // 真正的改选（这里改了 query）= 用户改主意，旧快照必须失效，而不是继续悄悄生效。
  // 注意：完全相同的重提交是幂等的，不会清 prepared（回归 B13），所以这里必须真的改点什么。
  const again = await a.reviseDraft({
    sessionId: SESSION,
    expectedRevision: prepared.revision,
    query: '改选后的另一个问题',
    selectedPages: [{ pageId: 'wiki/concepts/短页', contentHash: drafted.draft.selectedPages[0].contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(again.error, undefined)
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'reviseDraft invalidates the pending override (sanctioned clear)')
})

// --------------------------------------------------------------------- I3

test('I3：pendingOverride 只由 prepareOverride 写；只由三条 sanctioned 路径清（① 自身提交 ② reviseDraft 失效 ③ clearOverride）', async () => {
  const a = adapter()
  const drafted = await makeDraft(a)

  // 写：只有 prepareOverride
  await a.search({ sessionId: SESSION, query: '短页', hops: 1 })
  await a.readPage({ pageId: 'wiki/concepts/短页' })
  await a.getView({ sessionId: SESSION, expectedRevision: drafted.revision })
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'reads never write an override')

  const prepared = await a.prepareOverride({ sessionId: SESSION, expectedRevision: drafted.revision })
  assert.equal(prepared.error, undefined)
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, true)

  // 清：只允许三条 sanctioned 路径（D21）——① 自身 user/message 提交、② reviseDraft 失效、③ clearOverride；
  // 除此之外任何事件都不得清掉（runtime-context 提交、attempt、turn/end 都在下面验证）。
  a.observe({ id: SESSION }, { type: 'user/message', seq: 3, data: { source: { kind: 'runtime-context' }, content: [{ type: 'text', text: 'ctx' }] } })
  a.observe({ id: SESSION }, { type: 'assistant/attempt', seq: 4, data: { turn: 1, step: 1, stream: [] } })
  a.observe({ id: SESSION }, { type: 'turn/end', seq: 5, data: { turn: 1, reason: { kind: 'completed' } } })
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, true, 'foreign commits must NOT clear a prepared override')

  // 我们自己的 user/message 落地 → 消费（且只消费一次）
  const snapshotId = prepared.prepared.snapshotId
  a.observe({ id: SESSION }, { type: 'user/message', seq: 6, data: { source: { kind: 'memory-wiki', snapshotId }, turnStartSeq: 1 } })
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'our own commit consumes exactly once')
  a.observe({ id: SESSION }, { type: 'user/message', seq: 7, data: { source: { kind: 'memory-wiki', snapshotId }, turnStartSeq: 1 } })
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'consumption is idempotent')
})

test('I3b：clearOverride 是第三条 sanctioned 清路径', async () => {
  const a = adapter()
  const drafted = await makeDraft(a)
  const prepared = await a.prepareOverride({ sessionId: SESSION, expectedRevision: drafted.revision })
  const cleared = await a.clearOverride({ sessionId: SESSION, expectedRevision: prepared.revision })
  assert.equal(cleared.error, undefined)
  assert.equal(a.memoryFor(SESSION).hasPendingOverride, false)
  assert.equal(cleared.mode, 'automatic')
})

// ------------------------------------------------------------- readPage body

test('readPage 体积：小页不截断，超限页显式 truncated + limitChars + fullChars', async () => {
  const small = adapter()
  const ok = await small.readPage({ pageId: 'wiki/concepts/短页' })
  assert.equal(ok.page.truncated, false)
  assert.equal(ok.page.limitChars, 24000)
  assert.equal(ok.page.bodyChars, ok.page.fullChars)
  assert.ok(ok.page.bodyBytes >= ok.page.bodyChars, 'utf8 bytes >= utf16 units for CJK')

  const tight = adapter(200)
  const cut = await tight.readPage({ pageId: 'wiki/concepts/超长页' })
  assert.equal(cut.page.truncated, true)
  assert.equal(cut.page.limitChars, 200)
  assert.ok(cut.page.bodyChars <= 200, 'returned body respects the threshold')
  assert.ok(cut.page.fullChars > cut.page.bodyChars, 'fullChars reports what was left out')
  assert.equal(cut.page.body, cut.page.body.slice(0, cut.page.bodyChars))
  assert.ok(cut.page.body.length > 0)
})