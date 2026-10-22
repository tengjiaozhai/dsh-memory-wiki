/**
 * Client review fixes (B1–B12) — rule-level cases.
 *
 * These tests are the *cheap* half of the evidence: the pure session rules are
 * exercised directly, and the call-site rules a component cannot express in a
 * pure function (which request payload, which reset, no fallback body) are
 * pinned by reading the component source. The DOM half (real clicks, request
 * payloads, geometry, screenshots) lives in research/probes/p3-fixes.md.
 *
 * Nothing production-side is modified: session-guard.ts is type-stripped into
 * tests/.build, exactly like tests/_build.mjs does for the seam.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { stripTypeScriptTypes } from 'node:module'

import { build, buildClientSeam } from './_build.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(here, '..')
const CLIENT = path.join(ROOT, 'src', 'client')

process.removeAllListeners('warning')
build()
buildClientSeam()

const GUARD_OUT = path.join(here, '.build', 'client-source', 'session-guard.js')
{
  const code = stripTypeScriptTypes(
    fs.readFileSync(path.join(CLIENT, 'session-guard.ts'), 'utf8'),
    { mode: 'strip' },
  )
  fs.mkdirSync(path.dirname(GUARD_OUT), { recursive: true })
  fs.writeFileSync(GUARD_OUT, code)
}
const guard = await import(pathToFileURL(GUARD_OUT).href)
const { createRemoteSource } = await import(
  pathToFileURL(path.join(here, '.build', 'client-source', 'remote-source.js')).href
)

const readSource = (rel) => fs.readFileSync(path.join(CLIENT, rel), 'utf8')

const PAGE = { pageId: 'concepts/breaker.md', contentHash: 'h-breaker' }

const viewWith = (draft, extra = {}) => ({
  revision: 7,
  mode: 'manual-ready',
  budgetChars: 4000,
  hops: 1,
  ...(draft === undefined ? {} : { draft }),
  ...extra,
})

const draftWith = (pageIds, previewSources) => ({
  query: 'q',
  libraryRevision: 'lib-1',
  selectedPages: pageIds.map((pageId) => ({ pageId, contentHash: 'h-' + pageId })),
  budgetChars: 4000,
  hops: 1,
  preview: {
    text: 'server text',
    chars: 42,
    payloadHash: 'p'.repeat(64),
    fits: true,
    overBy: 0,
    sources: previewSources,
  },
})

// ------------------------------------------------------------------ B1

test('B1：读路径类型上没有 expectedRevision，wire 请求里也没有', async () => {
  const types = readSource('source/types.ts')
  const block = types.match(/interface ViewRequest \{[\s\S]*?\n\}/)[0]
  assert.doesNotMatch(block, /expectedRevision/, 'ViewRequest must not be able to carry a revision')

  const remote = readSource('source/remote-source.ts')
  const getViewRegion = remote.slice(remote.indexOf('async getView'), remote.indexOf('async search'))
  assert.doesNotMatch(getViewRegion, /expectedRevision/, 'the read path must not forward a revision')

  const calls = []
  const stub = {
    async getView(request) {
      calls.push(request)
      return { ok: true, value: { revision: 1, mode: 'automatic', budgetChars: 4000, hops: 1 } }
    },
  }
  await createRemoteSource(stub, 'test').getView({ sessionId: 'session-1' })
  assert.deepEqual(calls, [{ sessionId: 'session-1' }], 'a read sends exactly the session id')
})

// ------------------------------------------------------------------ B2

test('B2：切会话重挂载面板，并清掉本会话的全部本地状态与写 pin', () => {
  const panel = readSource('MemoryPanel.tsx')
  assert.match(panel, /<RemotePanel[\s\S]*?key=\{sessionKey\}/, 'RemotePanel must be keyed by sessionKey')
  assert.match(panel, /previousSessionRef\.current === sessionKey/, 'a session change must be detected')
  const resetBlock = panel.slice(
    panel.indexOf('previousSessionRef.current = sessionKey'),
    panel.indexOf('}, [sessionKey])'),
  )
  for (const reset of [
    'revisionRef.current = undefined',
    'setViewState(null)',
    'setActivePageId(null)',
    'setLastReadAt(null)',
  ]) {
    assert.ok(resetBlock.includes(reset), 'session change must reset ' + reset)
  }

  // The child keeps its own reset as a second line of defence (a caller could
  // forget the key): picks, report, query, notices all go.
  const remote = readSource('RemotePanel.tsx')
  const childStart = remote.indexOf('if (previousSessionRef.current === sessionId) return')
  const childReset = remote.slice(childStart, remote.indexOf('}, [sessionId])', childStart))
  for (const reset of ['setOverride({})', 'setReport(null)', 'setQuery(\'\')', 'setNotice(null)', 'setRefreshError(null)']) {
    assert.ok(childReset.includes(reset), 'child session reset must clear ' + reset)
  }
})

// ------------------------------------------------------------------ B3

test('B3：异步结果只在发起会话仍是当前会话时才允许回 UI', () => {
  const scope = guard.launchScope('session-A')
  assert.equal(scope.sessionId, 'session-A')
  assert.equal(guard.stillCurrent(scope, 'session-A'), true)
  assert.equal(guard.stillCurrent(scope, 'session-B'), false, 'A\'s answer must not land in B')
  assert.equal(guard.stillCurrent(scope, null), false, 'an unbound panel accepts nothing')
  assert.equal(guard.launchScope(null), null)
  assert.equal(guard.launchScope(''), null)

  const remote = readSource('RemotePanel.tsx')
  assert.match(remote, /stillCurrent\(scope, sessionRef\.current\)/g, 'every async path checks the session')
  assert.match(remote, /onView\(next, scope\.sessionId\)/, 'the callee is told which session answered')
  const panel = readSource('MemoryPanel.tsx')
  assert.match(
    panel,
    /applyView = useCallback\(\(next: MemoryWikiView, requestSession: string\)[\s\S]*?sessionRef\.current !== requestSession\) return/,
    'the panel rejects a view from another session',
  )
})

// ------------------------------------------------------------------ B4

test('B4：未绑定会话不发请求；错误响应的 revision 不写进写 pin', () => {
  assert.equal(guard.boundSession('s'), true)
  assert.equal(guard.boundSession(null), false)
  assert.equal(guard.boundSession(''), false)

  const panel = readSource('MemoryPanel.tsx')
  const effect = panel.slice(panel.indexOf('const scope = launchScope(sessionKey)'), panel.indexOf('}, [source, sessionKey, preset, budget, readNonce])'))
  const scopeAt = effect.indexOf('launchScope(sessionKey)')
  const callAt = effect.indexOf('source.getView(')
  assert.ok(scopeAt >= 0 && scopeAt < callAt, 'the read must be gated before getView is called')
  assert.match(effect, /if \(scope === null\) \{[\s\S]*?return\n/, 'an unbound session returns before any call')
  assert.match(panel, /data-testid="mw-unbound"/, 'unbound renders a neutral state')

  // A dirty view is displayed but never pins a write.
  assert.match(effect, /if \(next\.error === undefined\) revisionRef\.current = next\.revision/)
  assert.match(
    panel,
    /applyView = useCallback\(\(next: MemoryWikiView, requestSession: string\) => \{[\s\S]*?if \(next\.error === undefined\) revisionRef\.current = next\.revision/,
  )
})

// ------------------------------------------------------------------ B5

test('B5：写成功但刷新失败，不许报成写调用失败', () => {
  const committed = guard.committedReadFailureCopy('revise-draft', 'timeout')
  const rejected = guard.rejectedReadFailureCopy('revise-draft', 'timeout')
  const plain = guard.readFailureCopy('timeout')

  assert.match(committed, /写入已提交/)
  assert.doesNotMatch(committed, /写调用失败/)
  assert.match(committed, /读取最新视图失败/)
  assert.match(rejected, /被服务端拒绝/)
  assert.doesNotMatch(rejected, /写入已提交/)
  assert.doesNotMatch(plain, /写入/)
  assert.match(plain, /读取服务端最新视图失败/)

  const remote = readSource('RemotePanel.tsx')
  assert.match(remote, /data-testid="mw-write-transport-error"/)
  assert.match(remote, /data-testid="mw-refresh-error"/, 'the follow-up read failure has its own surface')
  // The write call is the only statement inside the failure capture that means
  // "the write failed"; the reload happens after it, in its own try.
  const writeCapture = remote.slice(remote.indexOf('result = await call(scope, writeRevision)'))
  assert.ok(
    writeCapture.indexOf('await reload(scope, operation') > writeCapture.indexOf('setBusy(false)'),
    'the post-write read is captured outside the write try/catch',
  )
})

// ------------------------------------------------------------------ B6

test('B6：应用改选的页数 = 真正会提交的页数；缺 contentHash 显式不可提交', () => {
  const view = viewWith(draftWith(['a'], []))
  const selection = guard.committableSelection(['a', 'ghost'], view, [
    { pageId: 'a', contentHash: 'h-a' },
    { pageId: 'b', contentHash: 'h-b' },
  ])
  assert.deepEqual(selection.committable, [{ pageId: 'a', contentHash: 'h-a' }])
  assert.deepEqual(selection.unfrozen, ['ghost'], 'a page with no version is not submittable')
  assert.equal(selection.selectedPageIds.length, 2)

  const panel = readSource('RemotePanel.tsx')
  assert.match(panel, /应用改选（\{selection\.committable\.length\} 页）/)
  assert.match(panel, /未冻结·不可提交/)
  assert.match(panel, /selection\.unfrozen\.length === 0/, 'an unfrozen pick blocks the submit')
})

// ------------------------------------------------------------------ B7

test('B7：search 带递增 requestId，迟到结果不得覆盖当前 report', () => {
  const first = guard.nextRequestId(0)
  const second = guard.nextRequestId(first)
  assert.equal(first, 1)
  assert.equal(second, 2)
  assert.equal(guard.isCurrentRequest(first, second), false, 'an older search answer is dropped')
  assert.equal(guard.isCurrentRequest(second, second), true)

  const remote = readSource('RemotePanel.tsx')
  assert.match(remote, /searchIdRef\.current = id/)
  assert.match(remote, /isCurrentRequest\(id, searchIdRef\.current\)/, 'the late answer is checked')
  assert.match(remote, /const locked = busy \|\| searching/, 'a search locks the panel')
})

// ------------------------------------------------------------------ B8

test('B8：选中态 = draft ∪ picks（含本地取消），不读 search 报告的 selected', () => {
  const draft = [{ pageId: 'a', contentHash: 'h-a' }]
  assert.deepEqual(guard.effectiveSelection(draft, {}), ['a'])
  assert.deepEqual(guard.effectiveSelection(draft, { b: true }), ['a', 'b'])
  assert.deepEqual(guard.effectiveSelection(draft, { a: false }), [], 'a local removal wins over the draft')
  assert.deepEqual(guard.effectiveSelection(draft, { a: false, b: true }), ['b'])

  const toggled = guard.toggleSelection({}, 'a', true)
  assert.deepEqual(toggled, { a: false })
  assert.deepEqual(guard.toggleSelection(toggled, 'a', false), { a: true })

  const remote = readSource('RemotePanel.tsx')
  assert.doesNotMatch(remote, /candidate\.selected/, 'the server writes selected:false for every candidate')
  assert.match(remote, /selectedPageIds=\{selection\.selectedPageIds\}/)
})

// ------------------------------------------------------------------ B9

test('B9：片段边界只来自 preview.sources；没有就明说，不回退整页、不拼接', () => {
  const view = viewWith(
    draftWith(['a'], [
      { pageId: 'a', title: 'A', contentHash: 'h-a', segments: [{ startLine: 12, endLine: 15 }] },
    ]),
  )
  assert.deepEqual(guard.previewSegments(view, 'a'), [{ startLine: 12, endLine: 15 }])
  assert.equal(guard.previewSegments(view, 'b'), null)
  assert.equal(guard.previewSegments(viewWith(undefined), 'a'), null)
  // A candidate carrying segments (fixture-shaped) is NOT an authority here.
  const withCandidateOnly = viewWith({ ...draftWith(['a'], []), preview: { ...draftWith(['a'], []).preview, sources: [] } })
  assert.equal(guard.previewSegments(withCandidateOnly, 'a'), null)

  const detail = readSource('SourceDetail.tsx')
  assert.doesNotMatch(detail, /function excerptOf/, 'the client-side slicer is gone')
  assert.doesNotMatch(detail, /split\('\\n'\)/, 'no line splitting → no fragment reassembly')
  assert.doesNotMatch(detail, /\.join\('\\n/, 'no joining of fragments')
  assert.match(detail, /服务端未提供片段边界/)
  assert.match(detail, /data-testid="mw-segments-missing"/)
  assert.match(readSource('RemotePanel.tsx'), /previewSegments\(view, activePageId\)/)
})

// ------------------------------------------------------------------ B10 / B11

test('B10/B11：stale 文案不说正在刷新，也不把只读说成写操作', () => {
  const copy = guard.staleCopy({ code: 'stale-revision', expected: 3, actual: 4 }, 'prepare-override')
  assert.doesNotMatch(copy.hint, /正在用服务端最新版本刷新/)
  assert.doesNotMatch(copy.hint, /正在刷新/)
  assert.match(copy.hint, /读取服务端最新视图/)
  assert.match(copy.title, /写入被拒绝/)
  assert.match(copy.detail, /「准备覆盖」/, 'the sentence names the write that was rejected')
  assert.match(copy.detail, /revision 3/)
  assert.match(copy.detail, /4/)

  const hints = readSource('source/error-hints.ts')
  assert.doesNotMatch(hints, /正在用服务端最新版本刷新/)
  assert.match(hints, /'library-changed'/)
})

test('stale 响应的视图字段被采纳：prepared/draft 照常显示，错误条同时出现', () => {
  const remote = readSource('RemotePanel.tsx')
  // Adopt first (draft/mode/revision), then show the error, then re-read.
  const region = remote.slice(remote.indexOf('onView(adoptWrite(result)'), remote.indexOf('await reload(scope, operation'))
  assert.match(region, /setNotice\(/)
  assert.match(remote, /const next: MemoryWikiView = \{ \.\.\.view, revision: result\.revision, mode: result\.mode \}/)
  assert.match(remote, /if \(result\.draft !== undefined\) next\.draft = result\.draft/, 'the server draft rides along')
  assert.match(remote, /else next\.error = result\.error/)
})

// ------------------------------------------------------------------ B12

test('B12：窗口 focus/可见时重读，并在标题标注上次读取时刻', () => {
  const panel = readSource('MemoryPanel.tsx')
  assert.match(panel, /addEventListener\('focus'/)
  assert.match(panel, /addEventListener\('visibilitychange'/)
  assert.match(panel, /setReadNonce\(\(value\) => value \+ 1\)/)
  assert.match(panel, /data-testid="mw-last-read"/)
  assert.match(panel, /上次读取/)

  const remote = readSource('RemotePanel.tsx')
  assert.match(remote, /const refreshView = async/)
  assert.match(remote, /readFailureCopy/)
})

// ------------------------------------------------------- S1 / S5 / 约束

test('S1：客户端不再给服务端字段补默认值', () => {
  const remote = readSource('RemotePanel.tsx')
  assert.doesNotMatch(remote, /view\.budgetChars \?\? 4000/)
  assert.doesNotMatch(remote, /view\.hops \?\? 1/)
  assert.doesNotMatch(remote, /draft\?\.budgetChars \?\? 4000/)
  assert.match(remote, /budgetChars === undefined \? '未提供'/)

  // 草稿预览现在带服务端冻结哈希，UI 用它区分已冻结。
  assert.match(remote, /preview\.payloadHash\.slice\(0, 12\)/)
  assert.match(remote, /data-testid="mw-draft-hash"/)
})

test('约束：src/client 内没有 as any', () => {
  const offenders = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!/\.(ts|tsx)$/.test(entry.name)) continue
      // Comments legitimately talk about the ban ("no as any"); only code counts.
      const code = fs
        .readFileSync(full, 'utf8')
        .split('\n')
        .filter((line) => {
          const trimmed = line.trim()
          return !trimmed.startsWith('*') && !trimmed.startsWith('//') && !trimmed.startsWith('/*')
        })
        .join('\n')
      if (/as\s+any\b/.test(code)) offenders.push(path.relative(CLIENT, full))
    }
  }
  walk(CLIENT)
  assert.deepEqual(offenders, [])
})
