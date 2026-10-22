/**
 * tests/p2-session-memory.test.mjs — P2 state machine (L1).
 *
 * Runs the compiled src/core/session-memory.ts (see tests/_build.mjs), so the
 * assertions cover the artifact the host actually loads, not a TS loader.
 *
 * Every case here maps to one P2 gate:
 *   - 一次真人轮次只取证一次   → "same turn freezes once"
 *   - 多步/重试无重复         → "later step reuses", "surface hit skips"
 *   - 异常不阻断              → "build failure propagates"
 *   - compaction 补注同一份   → "surface loss re-injects the same snapshot"
 *   - 手选覆盖只消费一次      → "override consumed only after commit"
 */
import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'
import { build, OUT_DIR } from './_build.mjs'

build()
const { SessionMemory } = await import(pathToFileURL(path.join(OUT_DIR, 'session-memory.js')).href)

/** Minimal frozen snapshot; the state machine never reads the body. */
function snapshot(id) {
  return {
    snapshotId: id,
    libraryRevision: 'rev-1',
    origin: 'automatic',
    budgetChars: 4000,
    sources: [],
    text: 'text of ' + id,
    payloadHash: 'hash-' + id,
    chars: 8,
  }
}

/** Count builds so "never re-retrieves" is observable, not inferred. */
function builder(ids) {
  let calls = 0
  const build = () => {
    const id = ids[calls] ?? ids[ids.length - 1]
    calls += 1
    return id === undefined ? undefined : snapshot(id)
  }
  return { build, calls: () => calls }
}

test('同一轮只取证一次：后续 step 复用，不会重新构建', () => {
  const memory = new SessionMemory()
  const b = builder(['s1'])
  const first = memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: b.build })
  assert.equal(first.action, 'inject')
  assert.equal(first.reason, 'first')
  const second = memory.prepare({ turn: 1, step: 2, surfaceHas: id => id === 's1', build: b.build })
  assert.deepEqual(second, { action: 'none', reason: 'already-in-surface' })
  const retry = memory.prepare({ turn: 1, step: 2, surfaceHas: id => id === 's1', build: b.build })
  assert.equal(retry.action, 'none')
  assert.equal(b.calls(), 1, 'build must run exactly once per turn')
})

test('surface 已含快照时不再注入（多步去重的判据不是 batch）', () => {
  const memory = new SessionMemory()
  const b = builder(['s1'])
  memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: b.build })
  // 第 3 步的 batch 里没有 producer，但 surface 有 → 不能重复插入
  const outcome = memory.prepare({ turn: 1, step: 3, surfaceHas: id => id === 's1', build: b.build })
  assert.equal(outcome.action, 'none')
  assert.equal(outcome.reason, 'already-in-surface')
})

test('compaction 丢掉快照后补注同一份，不重新检索', () => {
  const memory = new SessionMemory()
  const b = builder(['s1', 's2-new-search-must-not-happen'])
  memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: b.build })
  memory.observe({ kind: 'compaction-end', seq: 42 })
  const after = memory.prepare({ turn: 1, step: 2, surfaceHas: () => false, build: b.build })
  assert.equal(after.action, 'inject')
  assert.equal(after.reason, 're-injected')
  assert.equal(after.snapshot.snapshotId, 's1', 'must re-inject the frozen snapshot')
  assert.equal(b.calls(), 1)
  memory.noteReInjected(1)
  assert.equal(memory.turnRecord(1).reInjections, 1)
})

test('无可用块时跳过，且不留下 turn 记录', () => {
  const memory = new SessionMemory()
  const outcome = memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: () => undefined })
  assert.deepEqual(outcome, { action: 'none', reason: 'no-usable-block' })
  assert.equal(memory.turnRecord(1), undefined)
  assert.equal(memory.lastFrozenTurn, 0)
})

test('检索/编译失败向上抛出，由 adapter 归还原 decision', () => {
  const memory = new SessionMemory()
  assert.throws(
    () => memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: () => { throw new Error('corpus exploded') } }),
    /corpus exploded/,
  )
  assert.equal(memory.turnRecord(1), undefined)
})

test('不同轮各自冻结，互不复用', () => {
  const memory = new SessionMemory()
  const b = builder(['s1', 's2'])
  memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: b.build })
  const second = memory.prepare({ turn: 2, step: 1, surfaceHas: id => id === 's1', build: b.build })
  assert.equal(second.action, 'inject')
  assert.equal(second.snapshot.snapshotId, 's2')
  assert.equal(b.calls(), 2)
})

test('手选覆盖：只在自身 user/message 提交后消费一次', () => {
  const memory = new SessionMemory()
  const override = snapshot('manual-1')
  memory.prepareOverride(override)
  assert.equal(memory.hasPendingOverride, true)

  const b = builder(['automatic-should-not-be-used'])
  const outcome = memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: b.build })
  assert.equal(outcome.action, 'inject')
  assert.equal(outcome.snapshot.snapshotId, 'manual-1')
  assert.equal(b.calls(), 0, 'manual path never reaches retrieval')

  // hook 返回不代表已提交：覆盖仍待用
  assert.equal(memory.hasPendingOverride, true)
  // 别的消息提交（不是我们这条）不消费
  memory.observe({ kind: 'message-committed', turn: 1, seq: 7 })
  assert.equal(memory.hasPendingOverride, true)
  // 自身 producer 提交 → 消费
  memory.observe({ kind: 'message-committed', turn: 1, seq: 8, snapshotId: 'manual-1' })
  assert.equal(memory.hasPendingOverride, false)
  assert.equal(memory.turnRecord(1).committedSeq, 8)
})

test('观察到提交/turn-end 的相位变化', () => {
  const memory = new SessionMemory()
  memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: () => snapshot('s1') })
  assert.equal(memory.turnRecord(1).phase, 'preparing')
  memory.observe({ kind: 'message-committed', turn: 1, seq: 9, snapshotId: 's1' })
  assert.equal(memory.turnRecord(1).phase, 'committed')
  memory.observe({ kind: 'attempt-settled', turn: 1, failed: true })
  assert.equal(memory.turnRecord(1).phase, 'failed')
  memory.observe({ kind: 'turn-end', turn: 1, outcome: 'aborted' })
  assert.equal(memory.turnRecord(1).phase, 'aborted')
})

test('view 的 revision 单调递增', () => {
  const memory = new SessionMemory()
  const before = memory.view().revision
  memory.prepare({ turn: 1, step: 1, surfaceHas: () => false, build: () => snapshot('s1') })
  const after = memory.view().revision
  assert.ok(after > before)
  assert.equal(memory.view().lastTurn.snapshotId, 's1')
})
