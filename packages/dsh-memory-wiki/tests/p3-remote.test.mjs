/**
 * tests/p3-remote.test.mjs — P3b six Remote methods.
 *
 * Two layers:
 *   1. STRICT DECODING — drives the generated artifact (lib/typert.remote-client.js)
 *      and asserts every method's parameter codec rejects unknown fields and
 *      wrong types, while the plain codec would have accepted them. This is the
 *      "strict, not plain" evidence the gate asks for.
 *   2. SERVER BEHAVIOUR — drives the real MemoryWikiAdapter from the built
 *      bundle: session re-resolution, expectedRevision rejection, actionable
 *      errors (overBy / expected+actual), draft → prepare → clear transitions,
 *      and per-session serialization.
 */
import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

const LIB = path.join(import.meta.dirname, '..', 'lib')
const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')
/** Small purpose-built library for draft/budget cases (P1 fixture counts must not drift). */
const P3_FIXTURE = path.join(import.meta.dirname, 'fixtures', 'p3-library')

const { MemoryWikiAdapter } = await import(pathToFileURL(path.join(LIB, 'server', 'index.js')).href)
const remoteModule = await import(pathToFileURL(path.join(LIB, 'typert.remote-client.js')).href)
const remote = remoteModule.TYPERT_REMOTE ?? remoteModule.default

/** Fake host: only the session store, which is the authorization authority. */
const knownSession = 'session-test-1'
const ctx = { sessions: { get: id => (id === knownSession ? { id } : undefined) } }

const adapter = () => new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: FIXTURE, budgetChars: 4000 })

// ---------------------------------------------------------------- strict codec

const VALID = {
  view: { sessionId: knownSession, expectedRevision: 1 },
  search: { sessionId: knownSession, query: '工具熔断', hops: 1 },
  readPage: { sessionId: knownSession, pageId: 'wiki/concepts/工具熔断' },
  reviseDraft: { sessionId: knownSession, expectedRevision: 1, query: '工具熔断', selectedPages: [], budgetChars: 4000, hops: 1 },
  prepareOverride: { sessionId: knownSession, expectedRevision: 1 },
  clearOverride: { sessionId: knownSession, expectedRevision: 1 },
}

const WITH_EXTRA = {
  view: { ...VALID.view, injected: 'x' },
  search: { ...VALID.search, injected: 'x' },
  readPage: { ...VALID.readPage, injected: 'x' },
  reviseDraft: { ...VALID.reviseDraft, injected: 'x' },
  prepareOverride: { ...VALID.prepareOverride, injected: 'x' },
  clearOverride: { ...VALID.clearOverride, injected: 'x' },
}

const WRONG_TYPE = {
  view: { sessionId: 1, expectedRevision: 1 },
  search: { sessionId: knownSession, query: 1, hops: 1 },
  readPage: { sessionId: knownSession, pageId: 1 },
  reviseDraft: { sessionId: knownSession, expectedRevision: 'x', query: 'q', selectedPages: [], budgetChars: 4000, hops: 1 },
  prepareOverride: { sessionId: knownSession, expectedRevision: 'x' },
  clearOverride: { sessionId: knownSession, expectedRevision: null },
}

for (const method of Object.keys(VALID)) {
  test(`严格解码 ${method}：拒绝多余字段与类型不符`, () => {
    const endpoint = remote.methods['memoryWiki/' + method]
    assert.ok(endpoint, 'endpoint must exist: memoryWiki/' + method)
    const codec = endpoint.parameters[0]
    assert.equal(codec.strictCodec.mode, 'strict')
    assert.equal(codec.strictCodec.jsonSchema.additionalProperties, false)

    const strict = codec.strictCodec.create()
    const plain = codec.codec.create()

    assert.equal(strict.safeParse(VALID[method]).success, true, 'valid input must pass')
    const extra = strict.safeParse(WITH_EXTRA[method])
    assert.equal(extra.success, false, 'strict codec must reject unknown fields')
    assert.equal(extra.error.issues[0].code, 'unrecognized_keys')
    assert.equal(plain.safeParse(WITH_EXTRA[method]).success, true, 'plain codec strips instead (proves strict ≠ plain)')

    const wrong = strict.safeParse(WRONG_TYPE[method])
    assert.equal(wrong.success, false, 'strict codec must reject wrong types')
  })
}

// ------------------------------------------------- 首次读取 vs 乐观并发（可选 revision）

test('view：不传 expectedRevision 也能读（首次打开面板），且返回当前状态', async () => {
  const a = adapter()
  const first = await a.getView({ sessionId: knownSession })
  assert.equal(first.error, undefined)
  assert.equal(first.revision, 1)
  assert.equal(first.budgetChars, 4000)
  assert.equal(first.hops, 1)

  // 生成产物必须把 expectedRevision 标成非必填
  const codec = remote.methods['memoryWiki/view'].parameters[0].strictCodec
  assert.deepEqual(codec.jsonSchema.required, ['sessionId'])
  assert.equal(codec.strictCodec ?? codec.jsonSchema.additionalProperties, false)
  assert.equal(codec.create().safeParse({ sessionId: knownSession }).success, true)
})

test('view：传了陈旧 revision 仍然拒绝且不改状态；写方法保持必填', async () => {
  const a = adapter()
  const stale = await a.getView({ sessionId: knownSession, expectedRevision: 0 })
  assert.equal(stale.error.code, 'stale-revision')
  assert.equal(stale.error.expected, 0)
  assert.equal(stale.error.actual, 1)
  const after = await a.getView({ sessionId: knownSession })
  assert.equal(after.revision, 1, '被拒的读不会推进 revision')

  // 写方法不放宽：省略 expectedRevision 必须被 strict codec 拒绝
  for (const method of ['reviseDraft', 'prepareOverride', 'clearOverride']) {
    const schema = remote.methods['memoryWiki/' + method].parameters[0].strictCodec
    assert.ok(schema.jsonSchema.required.includes('expectedRevision'), method + ' 必须要求 expectedRevision')
    assert.equal(schema.create().safeParse({ sessionId: knownSession }).success, false, method + ' 省略 revision 必须被拒')
  }
})

// ---------------------------------------------------------------- session + revision

test('未知会话被拒（不信任客户端 id）', async () => {
  const a = adapter()
  const view = await a.getView({ sessionId: 'session-from-another-machine', expectedRevision: 1 })
  assert.equal(view.error.code, 'unknown-session')
  const search = await a.search({ sessionId: '', query: 'q', hops: 1 })
  assert.equal(search.error.code, 'unknown-session')
})

test('expectedRevision 真的拒旧值，且不改状态', async () => {
  const a = adapter()
  const fresh = await a.getView({ sessionId: knownSession, expectedRevision: 1 })
  assert.equal(fresh.revision, 1)
  assert.equal(fresh.error, undefined)

  const stale = await a.getView({ sessionId: knownSession, expectedRevision: 0 })
  assert.equal(stale.error.code, 'stale-revision')
  assert.equal(stale.error.expected, 0)
  assert.equal(stale.error.actual, 1)

  const after = await a.getView({ sessionId: knownSession, expectedRevision: 1 })
  assert.equal(after.revision, 1, 'a rejected call must not bump the revision')
})

// ---------------------------------------------------------------- search / readPage

test('search 返回候选与库版本，且不改 revision', async () => {
  const a = adapter()
  const result = await a.search({ sessionId: knownSession, query: '工具熔断', hops: 1 })
  assert.equal(result.error, undefined)
  assert.ok(result.candidates.length > 0)
  assert.ok(result.libraryRevision.length > 0)
  assert.equal(result.revision, 1)
})

test('readPage：正常读取、版本不符给 expected/actual、未知页给 unknown-page', async () => {
  const a = adapter()
  const ok = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/工具熔断' })
  assert.equal(ok.error, undefined)
  assert.equal(ok.page.pageId, 'wiki/concepts/工具熔断')
  assert.ok(ok.page.body.length > 0)
  const hash = ok.page.contentHash

  const mismatch = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/工具熔断', contentHash: 'deadbeef' })
  assert.equal(mismatch.error.code, 'page-version-mismatch')
  assert.equal(mismatch.error.expected, 'deadbeef')
  assert.equal(mismatch.error.actual, hash)

  const unknown = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/并不存在的页' })
  assert.equal(unknown.error.code, 'unknown-page')
})

test('readPage 行号：bodyStartLine 是文件 1-based 行号，且与 totalLines 自洽', async () => {
  const fs = await import('node:fs')
  const countLines = (text) => {
    if (text.length === 0) return 0
    const lines = text.replace(/\r\n/g, '\n').split('\n')
    if (lines[lines.length - 1] === '') lines.pop()
    return lines.length
  }

  const a = adapter()
  const fixture = (await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/工具熔断' })).page
  assert.ok(fixture.bodyStartLine > 1, 'a page with frontmatter must start its body after line 1')
  assert.equal(fixture.bodyStartLine + countLines(fixture.body) - 1, fixture.totalLines, 'bodyStartLine + body lines - 1 == totalLines')

  // 真实库（本机存在时）：任取一页同一恒等式必须成立
  const realRoot = '/Volumes/PortableSSD/docs/tengjiaozhai.github.io'
  if (!fs.existsSync(realRoot)) return
  const real = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: realRoot, budgetChars: 4000 })
  const report = await real.search({ sessionId: knownSession, query: '工具熔断', hops: 1 })
  assert.ok(report.candidates.length > 0, 'real library must return a candidate')
  for (const candidate of report.candidates.slice(0, 3)) {
    const page = (await real.readPage({ sessionId: knownSession, pageId: candidate.pageId })).page
    assert.ok(page.bodyStartLine >= 1)
    assert.equal(page.bodyStartLine + countLines(page.body) - 1, page.totalLines, 'real page: ' + page.pageId)
    if (page.truncated) continue
    assert.ok(page.bodyStartLine + countLines(page.body) - 1 === page.totalLines)
  }
})

// ---------------------------------------------------------------- draft → prepare → clear

test('reviseDraft：超额给 overBy 且进入 manual-invalid；成功进入 manual-ready', async () => {
  const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: P3_FIXTURE, budgetChars: 4000 })
  const long = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/超长页' })
  const over = await a.reviseDraft({
    sessionId: knownSession,
    expectedRevision: 1,
    query: '超长页',
    selectedPages: [{ pageId: long.page.pageId, contentHash: long.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(over.error.code, 'manual-over-budget')
  assert.ok(over.error.overBy > 0, 'overBy must be a positive number')
  assert.equal(over.error.budgetChars, 4000)
  assert.equal(over.mode, 'manual-invalid')

  const okPage = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/短页' })
  const good = await a.reviseDraft({
    sessionId: knownSession,
    expectedRevision: over.revision,
    query: '短页',
    selectedPages: [{ pageId: okPage.page.pageId, contentHash: okPage.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(good.error, undefined)
  assert.equal(good.mode, 'manual-ready')
  assert.equal(good.draft.preview.fits, true)
  assert.equal(good.draft.selectedPages[0].pageId, 'wiki/concepts/短页')
})

test('reviseDraft：页面版本变了就拒绝，不静默用新正文', async () => {
  const a = adapter()
  const stale = await a.reviseDraft({
    sessionId: knownSession,
    expectedRevision: 1,
    query: 'q',
    selectedPages: [{ pageId: 'wiki/concepts/工具熔断', contentHash: 'stale-hash' }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(stale.error.code, 'page-version-mismatch')
  assert.equal(stale.mode, 'manual-invalid')
})

test('prepareOverride：无选择给 nothing-selected；有草稿则冻结快照；clearOverride 只清未消费', async () => {
  const a = adapter()
  const empty = await a.prepareOverride({ sessionId: knownSession, expectedRevision: 1 })
  assert.equal(empty.error.code, 'nothing-selected')
  assert.equal(empty.mode, 'manual-invalid')

  const page = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/工具熔断' })
  const draft = await a.reviseDraft({
    sessionId: knownSession,
    expectedRevision: empty.revision,
    query: '工具熔断',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  const prepared = await a.prepareOverride({ sessionId: knownSession, expectedRevision: draft.revision })
  assert.equal(prepared.error, undefined)
  assert.equal(prepared.mode, 'manual-ready')
  assert.ok(prepared.prepared.payloadHash.length > 0)
  assert.equal(prepared.prepared.origin, 'manual')

  const staleClear = await a.clearOverride({ sessionId: knownSession, expectedRevision: 1 })
  assert.equal(staleClear.error.code, 'stale-revision')

  const view = await a.getView({ sessionId: knownSession, expectedRevision: prepared.revision })
  assert.ok(view.prepared !== undefined, 'prepared snapshot is visible before commit')

  const cleared = await a.clearOverride({ sessionId: knownSession, expectedRevision: prepared.revision })
  assert.equal(cleared.error, undefined)
  assert.equal(cleared.mode, 'automatic')
  const after = await a.getView({ sessionId: knownSession, expectedRevision: cleared.revision })
  assert.equal(after.prepared, undefined)
})

// ---------------------------------------------------------------- serialization

test('同会话串行化：并发改选用同一个 revision，只有一个成功', async () => {
  const a = adapter()
  const page = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/工具熔断' })
  const input = {
    sessionId: knownSession,
    expectedRevision: 1,
    query: '工具熔断',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  }
  const [first, second] = await Promise.all([a.reviseDraft(input), a.reviseDraft(input)])
  const outcomes = [first, second]
  const ok = outcomes.filter(result => result.error === undefined)
  const stale = outcomes.filter(result => result.error?.code === 'stale-revision')
  assert.equal(ok.length, 1, 'exactly one call may win the revision')
  assert.equal(stale.length, 1, 'the other must be rejected as stale')
  assert.equal(stale[0].error.actual, 2)
})

test('不同会话互不影响（各自的 revision 与状态）', async () => {
  const twoSessions = new MemoryWikiAdapter(
    { sessions: { get: id => (id === 'a' || id === 'b' ? { id } : undefined) } },
    { enabled: true, wikiRoot: FIXTURE, budgetChars: 4000 },
  )
  const a1 = await twoSessions.getView({ sessionId: 'a', expectedRevision: 1 })
  const b1 = await twoSessions.getView({ sessionId: 'b', expectedRevision: 1 })
  assert.equal(a1.revision, 1)
  assert.equal(b1.revision, 1)
  const page = await twoSessions.readPage({ sessionId: 'a', pageId: 'wiki/concepts/工具熔断' })
  const drafted = await twoSessions.reviseDraft({
    sessionId: 'a',
    expectedRevision: 1,
    query: '工具熔断',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(drafted.revision, 2)
  const bView = await twoSessions.getView({ sessionId: 'b', expectedRevision: 1 })
  assert.equal(bView.revision, 1, 'session b must not see session a mutations')
  assert.equal(bView.draft, undefined)
})

// ------------------------------------------------- 回归：同值重提交 / 预览==冻结 / 库变更

test('B13：同值重提交不改 revision、不清 prepared（服务端幂等）', async () => {
  const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: P3_FIXTURE, budgetChars: 4000 })
  const page = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/短页' })
  const input = {
    sessionId: knownSession,
    expectedRevision: 1,
    query: '短页',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  }
  const drafted = await a.reviseDraft(input)
  assert.equal(drafted.error, undefined)
  const prepared = await a.prepareOverride({ sessionId: knownSession, expectedRevision: drafted.revision })
  assert.equal(prepared.error, undefined)
  assert.equal(a.memoryFor(knownSession).hasPendingOverride, true)

  // 同样的选择再提交一次（用户只是又点了一次「应用改选」）
  const again = await a.reviseDraft({ ...input, expectedRevision: prepared.revision })
  assert.equal(again.error, undefined)
  assert.equal(again.revision, prepared.revision, 'identical re-submit must not bump the revision')
  assert.equal(again.mode, 'manual-ready')
  assert.deepEqual(again.draft, drafted.draft)
  assert.equal(a.memoryFor(knownSession).hasPendingOverride, true, 'identical re-submit must not drop prepared')

  // 真的改了选择 → 按 D21 ② 失效并推进 revision
  const changed = await a.reviseDraft({ ...input, expectedRevision: prepared.revision, query: '另一问' })
  assert.equal(changed.error, undefined)
  assert.equal(changed.revision, prepared.revision + 1)
  assert.equal(a.memoryFor(knownSession).hasPendingOverride, false)
})

test('prepareOverride 冻结的就是预览正文（text/chars/payloadHash 逐字相同）', async () => {
  const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: P3_FIXTURE, budgetChars: 4000 })
  const page = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/短页' })
  const drafted = await a.reviseDraft({
    sessionId: knownSession, expectedRevision: 1, query: '短页',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }], budgetChars: 4000, hops: 1,
  })
  const prepared = await a.prepareOverride({ sessionId: knownSession, expectedRevision: drafted.revision })
  assert.equal(prepared.error, undefined)
  assert.equal(prepared.prepared.text, drafted.draft.preview.text, 'frozen text must equal the previewed text')
  assert.equal(prepared.prepared.chars, drafted.draft.preview.chars)
  assert.equal(prepared.prepared.payloadHash, drafted.draft.preview.payloadHash)
  assert.equal(prepared.prepared.libraryRevision, drafted.draft.libraryRevision)
})

test('库变更后 prepareOverride 拒绝冻结（要求重新预览），并给出 expected/actual', async () => {
  const fs = await import('node:fs')
  const os = await import('node:os')
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-library-'))
  const root = path.join(tmp, 'library')
  fs.cpSync(P3_FIXTURE, root, { recursive: true })
  try {
    const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: root, budgetChars: 4000 })
    const page = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/短页' })
    const drafted = await a.reviseDraft({
      sessionId: knownSession, expectedRevision: 1, query: '短页',
      selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }], budgetChars: 4000, hops: 1,
    })
    const before = drafted.draft.libraryRevision

    const target = path.join(root, 'wiki', 'concepts', '短页.md')
    fs.writeFileSync(target, fs.readFileSync(target, 'utf8') + ['', '', '## 新增', '', '库改动。', ''].join(String.fromCharCode(10)))
    const after = a.refreshCorpus()
    assert.notEqual(after, before, 'rescan must observe a new revision')

    const prepared = await a.prepareOverride({ sessionId: knownSession, expectedRevision: drafted.revision })
    assert.equal(prepared.error.code, 'library-changed')
    assert.equal(prepared.error.expected, before)
    assert.equal(prepared.error.actual, after)
    assert.equal(prepared.mode, 'manual-invalid')
    assert.equal(a.memoryFor(knownSession).hasPendingOverride, false, 'a rejected prepare must not park a snapshot')
  }
  finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})

test('stale 的 getView 仍带完整当前视图（read 不藏状态）', async () => {
  const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: P3_FIXTURE, budgetChars: 4000 })
  const page = await a.readPage({ sessionId: knownSession, pageId: 'wiki/concepts/短页' })
  const drafted = await a.reviseDraft({
    sessionId: knownSession, expectedRevision: 1, query: '短页',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }], budgetChars: 4000, hops: 1,
  })
  const prepared = await a.prepareOverride({ sessionId: knownSession, expectedRevision: drafted.revision })

  const stale = await a.getView({ sessionId: knownSession, expectedRevision: 1 })
  assert.equal(stale.error.code, 'stale-revision')
  assert.equal(stale.error.actual, prepared.revision)
  assert.ok(stale.draft !== undefined, 'stale response must still carry the draft')
  assert.ok(stale.prepared !== undefined, 'stale response must still carry the prepared snapshot')
})