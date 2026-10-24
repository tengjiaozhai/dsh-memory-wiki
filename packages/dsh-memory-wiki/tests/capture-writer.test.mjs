import assert from 'node:assert/strict'
import test from 'node:test'
import { createWikiWriter } from '../lib/server/capture.js'

const input = { instructions: 'Loaded llm-wiki instructions', evidence: { requestedTask: 'Diagnose' }, pages: [], sourceRef: 'wiki/sources/fixture' }

test('background writer receives the frozen route and Skill but no tools or parent session', async () => {
  let request
  const generate = createWikiWriter({ async *stream(options) {
    request = options
    const text = JSON.stringify({ claims: [], updates: [] })
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text }
    yield { type: 'block-end', index: 0, block: { type: 'text', text } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  } })
  await generate(input, { provider: 'original', model: 'writer-model', reasoningEffort: 'high' }, new AbortController().signal)
  assert.deepEqual(request.tools, [])
  assert.equal(request.sessionId, undefined)
  assert.equal(request.provider, 'original')
  assert.equal(request.model, 'writer-model')
  assert.equal(request.system, input.instructions)
  assert.equal(request.reasoningEffort, 'high')
})

test('a tool call or incomplete writer response is rejected before ingestion', async () => {
  const generate = createWikiWriter({ async *stream() { yield { type: 'finish', reason: { kind: 'tool-calls' } } } })
  await assert.rejects(generate(input, { provider: 'test', model: 'test' }, new AbortController().signal), /did not finish/)
})
