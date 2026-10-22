/**
 * tests/p2-adapter.test.mjs — the REAL pre-step wiring (compaction re-injection).
 *
 * Unlike p2-session-memory.test.mjs (pure state machine), this drives
 * MemoryWikiAdapter.preStep from the built bundle (lib/server/index.js) with a
 * fake host, so the branch that the P2 gate names is proven on the shipped code:
 *
 *   - first pre-step freezes exactly one snapshot and splices it before the
 *     human input;
 *   - after the model-facing surface is made to lose it (deriveMessages shaded),
 *     the next pre-step of the SAME turn re-injects the same snapshotId and
 *     payloadHash, and the retrieval port is never asked twice;
 *   - a throwing retrieval port leaves the decision untouched (degradation).
 */
import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

const LIB = path.join(import.meta.dirname, '..', 'lib', 'server', 'index.js')
const { MemoryWikiAdapter } = await import(pathToFileURL(LIB).href)

/** Fake host context: the adapter's preStep never touches it. */
const fakeCtx = {}

/** Fake agent whose session surface can be shaded between steps. */
function fakeAgent() {
  const state = { messages: [] }
  return {
    id: 'session-test-1',
    session: {
      id: 'session-test-1',
      deriveMessages: () => state.messages,
    },
    /** Host-side surface mutation used to imitate what compaction does. */
    setSurface: messages => { state.messages = messages },
  }
}

const human = text => ({ id: 'human-1', role: 'user', content: [{ type: 'text', text }], source: { kind: 'user' } })
const producer = snapshotId => ({ id: 'mw-' + snapshotId, role: 'user', content: [{ type: 'text', text: 'x' }], source: { kind: 'memory-wiki', snapshotId } })

function snapshot(id) {
  return {
    snapshotId: id,
    libraryRevision: 'rev-1',
    origin: 'automatic',
    budgetChars: 4000,
    sources: [],
    text: 'frozen text ' + id,
    payloadHash: 'hash-' + id,
    chars: 12,
  }
}

function adapterWith(build) {
  const adapter = new MemoryWikiAdapter(fakeCtx, { enabled: true, wikiRoot: '/fixture', budgetChars: 4000 }, { build })
  return adapter
}

test('真实 preStep：注入 → surface 被遮蔽 → 同轮补注同一 snapshotId/hash，且不重新检索', async () => {
  const agent = fakeAgent()
  let builds = 0
  const adapter = adapterWith(() => { builds += 1; return snapshot('sw_1') })
  const next = async () => ({ kind: 'enter', messages: [human('工具熔断怎么恢复')] })

  const first = await adapter.preStep({ agent, turn: 1, step: 1 }, next)
  assert.equal(first.kind, 'enter')
  assert.equal(first.messages.length, 2)
  assert.equal(first.messages[0].source.kind, 'memory-wiki')
  assert.equal(first.messages[1].source.kind, 'user', 'producer must precede the human input')
  const frozenId = first.messages[0].source.snapshotId
  const frozenHash = first.messages[0].source.payloadHash
  assert.equal(builds, 1)

  // The surface now holds the committed snapshot: a later step must not duplicate.
  agent.setSurface([{ ...first.messages[0] }, { ...first.messages[1] }])
  const second = await adapter.preStep({ agent, turn: 1, step: 2 }, async () => ({ kind: 'enter', messages: [human('第二步')] }))
  assert.equal(second.messages.filter(m => m.source?.kind === 'memory-wiki').length, 0)
  assert.equal(builds, 1)

  // Compaction: the surface no longer holds it. Same turn, next pre-step.
  agent.setSurface([{ id: 'summary', role: 'user', content: [{ type: 'text', text: 'summary' }], source: { kind: 'compaction' } }])
  const third = await adapter.preStep({ agent, turn: 1, step: 3 }, async () => ({ kind: 'enter', messages: [human('第三步')] }))
  const injected = third.messages.filter(m => m.source?.kind === 'memory-wiki')
  assert.equal(injected.length, 1, 'exactly one re-injection')
  assert.equal(injected[0].source.snapshotId, frozenId, 'same snapshot identity')
  assert.equal(injected[0].source.payloadHash, frozenHash, 'same payload hash')
  assert.equal(builds, 1, 're-injection must not re-retrieve')
})

test('真实 preStep：没有真人输入时不检索不注入', async () => {
  const agent = fakeAgent()
  let builds = 0
  const adapter = adapterWith(() => { builds += 1; return snapshot('sw_x') })
  const toolOnly = [{ id: 't1', role: 'user', content: [{ type: 'text', text: 'tool output' }], source: { kind: 'tool', callId: 'c1' } }]
  const out = await adapter.preStep({ agent, turn: 1, step: 2 }, async () => ({ kind: 'enter', messages: toolOnly }))
  assert.equal(out.messages.length, 1)
  assert.equal(builds, 0)
})

test('真实 preStep：检索抛错时原样返回 decision（异常不阻断）', async () => {
  const agent = fakeAgent()
  const adapter = adapterWith(() => { throw new Error('corpus down') })
  const decision = { kind: 'enter', messages: [human('问一句')] }
  const out = await adapter.preStep({ agent, turn: 1, step: 1 }, async () => decision)
  assert.deepEqual(out, decision)
  assert.equal(out.messages.filter(m => m.source?.kind === 'memory-wiki').length, 0)
})
