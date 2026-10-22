/**
 * P3b client seam: fixture ↔ remote consistency, D25 line mapping, and the
 * "no fixture in production" guard.
 *
 * The fixture implementation now lives in `tests/client-fixtures` and is only
 * reachable through `registerFixtureSource()`. These tests import BOTH mappings
 * (fixture from tests, remote from src/client) against the SAME DTOs, so the two
 * cannot drift while the panel keeps a single view model.
 *
 * Evidence level: L1 (unit + static import-graph assertions). Host rendering is
 * evidenced separately in research/probes/p3-panel.md.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build, buildClientSeam } from './_build.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))

build()
buildClientSeam()

const { createFixtureSource } = await import('./.build/client-fixtures/fixture-source.js')
const { buildFixtureView, PAGE_ID } = await import('./.build/client-fixtures/wiki-fixture.js')
const { createRemoteSource } = await import('./.build/client-source/remote-source.js')
const { RemoteCallError } = await import('./.build/client-source/unwrap.js')

const countLines = (text) => text.replace(/\r\n/g, '\n').split('\n').length

// A PageDocument exactly as the server builds it: the body is the same bytes,
// and bodyStartLine is the file line the server parsed ONCE.
function pageDocument(page) {
  return {
    pageId: page.pageId,
    title: page.title,
    kind: page.kind,
    contentHash: page.contentHash,
    body: page.body,
    bodyStartLine: page.bodyStartLine,
    totalLines: page.totalLines,
    bodyChars: page.body.length,
    bodyBytes: Buffer.byteLength(page.body, 'utf8'),
    fullChars: page.body.length,
    truncated: false,
    limitChars: 24000,
  }
}

/** Stub transport: returns generated-client envelopes, records every request. */
function stubClient(page) {
  const calls = []
  const preview = {
    // 999 deliberately differs from text.length: the panel must show the
    // server's number, never a recomputed one.
    text: '【Wiki 证据快照】服务端编译结果',
    chars: 999,
    fits: true,
    overBy: 0,
    sources: [
      {
        pageId: page.pageId,
        title: page.title,
        contentHash: page.contentHash,
        segments: [{ startLine: page.bodyStartLine, endLine: page.bodyStartLine + 2 }],
      },
    ],
  }
  return {
    calls,
    async getView(request) {
      calls.push({ method: 'view', request })
      return {
        ok: true,
        value: {
          revision: 7,
          mode: 'automatic',
          budgetChars: 4000,
          hops: 1,
          draft: {
            query: '工具连续失败怎么处理',
            libraryRevision: 'lib-fixture',
            selectedPages: [{ pageId: page.pageId, contentHash: page.contentHash }],
            budgetChars: 4000,
            hops: 1,
            preview,
          },
          skippedReason: 'disabled',
        },
      }
    },
    async search(request) {
      calls.push({ method: 'search', request })
      return {
        ok: true,
        value: { revision: 7, libraryRevision: 'lib-fixture', query: 'q', hops: 1, candidates: [], edges: [] },
      }
    },
    async readPage(request) {
      calls.push({ method: 'readPage', request })
      return { ok: true, value: { revision: 7, page: pageDocument(page) } }
    },
    async reviseDraft(request) {
      calls.push({ method: 'reviseDraft', request })
      return { ok: true, value: { revision: 8, mode: 'manual-ready', draft: {} } }
    },
    async prepareOverride(request) {
      calls.push({ method: 'prepareOverride', request })
      return { ok: false, error: { code: 'stale-revision', expected: 7, actual: 9 } }
    },
    async clearOverride(request) {
      calls.push({ method: 'clearOverride', request })
      return { ok: true, value: { revision: 9, mode: 'automatic' } }
    },
  }
}

test('fixture source：视图与页面仍是同一份 DTO（P3a 可复现）', async () => {
  const fixture = createFixtureSource()
  const view = await fixture.getView({ sessionId: null })
  assert.equal(view.revision, 1)
  assert.equal(view.report.candidates.length, 5)
  assert.ok(view.compile.text.startsWith('【Wiki 证据快照】'))
  assert.ok(view.history.length >= 1)

  const page = await fixture.readPage({ pageId: PAGE_ID.breaker })
  assert.equal(page.pageId, PAGE_ID.breaker)
  assert.ok(page.bodyStartLine > 1, 'frontmatter must push the body down')
  assert.equal(page.bodyStartLine + countLines(page.body) - 1, page.totalLines)
  assert.ok(page.confidence !== undefined, 'fixture lifts meta.confidence for the detail pane')
})

test('remote source：SessionView 字段逐字透传，不重算 chars/payloadHash', async () => {
  const page = await createFixtureSource().readPage({ pageId: PAGE_ID.breaker })
  const stub = stubClient(page)
  const remote = createRemoteSource(stub, 'test')

  const view = await remote.getView({ sessionId: 'session-1' })
  assert.equal(view.revision, 7)
  assert.equal(view.mode, 'automatic')
  assert.equal(view.skippedReason, 'disabled')
  assert.equal(view.draft.preview.text, '【Wiki 证据快照】服务端编译结果')
  assert.equal(view.draft.preview.chars, 999, 'client must echo the server char count verbatim')
  assert.equal(view.budgetChars, 4000)
  assert.equal(view.hops, 1)

  // D26: the first read sends only the session id — no invented revision.
  assert.deepEqual(stub.calls[0].request, { sessionId: 'session-1' })
})

test('D25：readPage 用服务端 bodyStartLine，fixture 与 remote 得到同一文件行号', async () => {
  const fixture = createFixtureSource()
  const fixturePage = await fixture.readPage({ pageId: PAGE_ID.breaker })

  const stub = stubClient(fixturePage)
  const remote = createRemoteSource(stub, 'test')
  const remotePage = await remote.readPage({
    pageId: PAGE_ID.breaker,
    contentHash: fixturePage.contentHash,
    sessionId: 'session-1',
  })

  assert.equal(remotePage.bodyStartLine, fixturePage.bodyStartLine, 'same absolute file line')
  assert.equal(remotePage.body, fixturePage.body, 'body bytes unchanged')
  assert.equal(remotePage.totalLines, fixturePage.totalLines)
  assert.equal(remotePage.bodyStartLine + countLines(remotePage.body) - 1, remotePage.totalLines)
  // PageDocument has no confidence: the client must not invent one.
  assert.equal(remotePage.confidence, undefined)
  assert.equal(remotePage.truncated, undefined)
})

test('写方法：业务错误留在 value.error，传输失败才抛 RemoteCallError', async () => {
  const page = await createFixtureSource().readPage({ pageId: PAGE_ID.breaker })
  const stub = stubClient(page)
  const remote = createRemoteSource(stub, 'test')

  // stale-revision arrives as an envelope error → one typed exception with the code.
  await assert.rejects(
    () => remote.prepareOverride({ sessionId: 'session-1', expectedRevision: 7 }),
    (error) => {
      assert.ok(error instanceof RemoteCallError)
      assert.equal(error.code, 'stale-revision')
      return true
    },
  )

  // A successful write returns the server's new revision/mode, not a local guess.
  const revised = await remote.reviseDraft({
    sessionId: 'session-1',
    expectedRevision: 7,
    query: 'q',
    selectedPages: [{ pageId: page.pageId, contentHash: page.contentHash }],
    budgetChars: 4000,
    hops: 1,
  })
  assert.equal(revised.revision, 8)
  assert.equal(revised.mode, 'manual-ready')
})

test('生产 import 图：src/client 里没有任何 fixture 模块或示例数据', () => {
  const root = path.join(here, '..', 'src', 'client')
  assert.equal(fs.existsSync(path.join(root, '__fixtures__')), false, 'no fixture directory in production source')

  const offenders = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!/\.(ts|tsx|css)$/.test(entry.name)) continue
      const text = fs.readFileSync(full, 'utf8')
      const rel = path.relative(root, full)
      // Only *module edges* matter here: comments may explain the fixture policy.
      const edges = [...text.matchAll(/(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g)].map((match) => match[1])
      for (const edge of edges) {
        if (/fixture/i.test(edge) || /__fixtures__/.test(edge)) offenders.push(rel + ' -> ' + edge)
      }
      for (const identifier of ['createFixtureSource', 'FIXTURE_DOC_SOURCES', 'sha256Hex']) {
        if (new RegExp('\\b' + identifier + '\\s*(\\(|\\b)').test(text) && !rel.endsWith('index.ts')) {
          offenders.push(rel + ' :: ' + identifier)
        }
      }
    }
  }
  walk(root)
  assert.deepEqual(offenders, [], 'fixture references leaked into production client source')

  // The injected factory is the ONE place allowed to mention fixtures.
  const indexSource = fs.readFileSync(path.join(root, 'source', 'index.ts'), 'utf8')
  assert.match(indexSource, /export function registerFixtureSource/)
  assert.match(indexSource, /fixture-not-bundled/)
})
