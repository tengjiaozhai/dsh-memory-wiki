/**
 * tests/p3-freshness.test.mjs — library freshness (design §4.2) reachable in a real host.
 *
 * Regression for: `refreshCorpus()` existed but nothing called it, so the lazy
 * corpus cache made `library-changed` unreachable outside tests. The adapter now
 * checks a STAT-level fingerprint at every entry point (pre-step / getView /
 * search / readPage / prepareOverride) and only rescans when it moved.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

const LIB = path.join(import.meta.dirname, '..', 'lib')
const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'p3-library')
const { MemoryWikiAdapter } = await import(pathToFileURL(path.join(LIB, 'server', 'index.js')).href)

const SESSION = 'session-fresh-1'
const ctx = { sessions: { get: id => (id === SESSION ? { id } : undefined) } }

/** Copy the fixture library into a scratch dir so a test may edit pages. */
function scratchLibrary() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-fresh-'))
  const root = path.join(tmp, 'library')
  fs.cpSync(FIXTURE, root, { recursive: true })
  return { tmp, root, page: path.join(root, 'wiki', 'concepts', '短页.md') }
}

const read = (root, pageId) => fs.readFileSync(path.join(root, pageId), 'utf8')

test('库变更后 getView 的 revision 变、内容变；未变更时走 stat 快路径不重扫', async () => {
  const { tmp, root, page } = scratchLibrary()
  try {
    const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: root, budgetChars: 4000 })
    const first = await a.getView({ sessionId: SESSION })
    assert.equal(first.error, undefined)
    assert.equal(a.stats.scans, 1, 'initial read scans once')

    // 快路径：没有任何改动时反复读不得重扫
    const again = await a.getView({ sessionId: SESSION, expectedRevision: first.revision })
    await a.search({ sessionId: SESSION, query: '短页', hops: 1 })
    await a.readPage({ pageId: 'wiki/concepts/短页' })
    assert.equal(again.error, undefined)
    assert.equal(a.stats.scans, 1, 'unchanged library must not be rescanned')

    // 改一页 → revision 变化、正文变化、扫描次数 +1
    fs.writeFileSync(page, read(root, 'wiki/concepts/短页.md') + ['', '## 新增段', '', '这是库变更后的内容。', ''].join(String.fromCharCode(10)))
    const afterEdit = await a.getView({ sessionId: SESSION })
    assert.notEqual(afterEdit.revision, first.revision, 'library change must move the view revision')
    assert.equal(a.stats.scans, 2, 'a real change rescans exactly once')
    const doc = await a.readPage({ pageId: 'wiki/concepts/短页' })
    assert.ok(doc.page.body.includes('这是库变更后的内容'), 'reads must return the new body')

    // 再读一次仍然是新视图，且不再重扫
    const steady = await a.getView({ sessionId: SESSION, expectedRevision: afterEdit.revision })
    assert.equal(steady.error, undefined)
    assert.equal(a.stats.scans, 2, 'stable after the change')
  }
  finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})

test('库变更使未消费的 prepared 失效，且之后 prepareOverride 返回 library-changed', async () => {
  const { tmp, root, page } = scratchLibrary()
  try {
    const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: root, budgetChars: 4000 })
    const view = await a.getView({ sessionId: SESSION })
    const doc = await a.readPage({ pageId: 'wiki/concepts/短页' })
    const drafted = await a.reviseDraft({
      sessionId: SESSION, expectedRevision: view.revision, query: '短页',
      selectedPages: [{ pageId: doc.page.pageId, contentHash: doc.page.contentHash }], budgetChars: 4000, hops: 1,
    })
    assert.equal(drafted.error, undefined)
    const prepared = await a.prepareOverride({ sessionId: SESSION, expectedRevision: drafted.revision })
    assert.equal(prepared.error, undefined)
    assert.equal(a.memoryFor(SESSION).hasPendingOverride, true)

    // 改页 → 下一次读触发重扫：待用按 §8.2 失效
    fs.writeFileSync(page, read(root, 'wiki/concepts/短页.md') + ['', '又改了。', ''].join(String.fromCharCode(10)))
    const after = await a.getView({ sessionId: SESSION })
    assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'an unconsumed override dies with the library view')
    assert.equal(after.mode, 'manual-invalid')
    assert.equal(after.prepared, undefined)
    assert.equal(after.skippedReason, 'library-changed')

    // 用新 revision 再 prepare：草稿的 libraryRevision 已过期 → 必须要求重新预览
    const retry = await a.prepareOverride({ sessionId: SESSION, expectedRevision: after.revision })
    assert.equal(retry.error.code, 'library-changed')
    assert.equal(retry.error.expected, drafted.draft.libraryRevision)
    assert.notEqual(retry.error.actual, drafted.draft.libraryRevision)
    assert.equal(a.memoryFor(SESSION).hasPendingOverride, false, 'a rejected prepare must not park a snapshot')
  }
  finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})

test('pre-step 也走 freshness：库变后注入的是新版本快照', async () => {
  const { tmp, root, page } = scratchLibrary()
  try {
    const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: root, budgetChars: 4000 })
    const agent = { id: SESSION, session: { id: SESSION, deriveMessages: () => [] } }
    const human = { id: 'h1', role: 'user', content: [{ type: 'text', text: '短页' }], source: { kind: 'user' } }
    fs.writeFileSync(page, read(root, 'wiki/concepts/短页.md') + ['', '库变更标记：freshness-probe。', ''].join(String.fromCharCode(10)))
    const decision = await a.preStep({ agent, turn: 1, step: 1 }, async () => ({ kind: 'enter', messages: [human] }))
    const injected = decision.messages.filter(m => m.source?.kind === 'memory-wiki')
    assert.equal(injected.length, 1)
    assert.ok(injected[0].content[0].text.includes('freshness-probe'), 'pre-step must freeze the fresh library view')
  }
  finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})
