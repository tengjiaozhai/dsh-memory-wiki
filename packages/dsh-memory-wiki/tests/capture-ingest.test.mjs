import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createHash } from 'node:crypto'
import { WikiIngest } from '../lib/server/capture.js'

const evidence = { jobId: 'a'.repeat(64), origin: { sessionId: 'test', turn: 1, turnStartSeq: 0, turnEndSeq: 4 }, outcome: 'completed', workspaceIdentity: 'fixture', requestedTask: 'Diagnose retries', events: [{ seq: 2, kind: 'tool/result', text: 'Retrying a non-idempotent write duplicated the record.', hash: 'fixture' }], limitations: [], contentHash: 'fixture' }
evidence.events[0].hash = createHash('sha256').update(evidence.events[0].text).digest('hex')

export async function library(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-ingest-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const wikiRoot = path.join(root, 'library')
  const skillRoot = path.join(root, 'skill')
  for (const dir of ['wiki/sources', 'wiki/entities', 'wiki/concepts', 'wiki/synthesis', 'wiki/outputs', 'tools']) await fs.mkdir(path.join(wikiRoot, dir), { recursive: true })
  await fs.mkdir(path.join(skillRoot, 'references'), { recursive: true })
  await fs.writeFile(path.join(wikiRoot, 'AGENTS.md'), '# Schema\n<!-- dsh-memory-wiki:auto-capture=v1 -->\n')
  await fs.writeFile(path.join(wikiRoot, 'wiki/index.md'), '# Index\n<!-- wiki-index:auto-end -->\n')
  await fs.writeFile(path.join(wikiRoot, 'wiki/log.md'), '# Log\n')
  // External command fixtures. Production integration separately runs the real Wiki scripts.
  await fs.writeFile(path.join(wikiRoot, 'tools/wiki-index.mjs'), "console.log('fixture index')\n")
  await fs.writeFile(path.join(wikiRoot, 'tools/wiki-lint.mjs'), "console.log('fixture lint')\n")
  for (const file of ['SKILL.md', 'references/operations.md', 'references/page-templates.md']) await fs.writeFile(path.join(skillRoot, file), 'Read evidence, ingest sources, link knowledge, index and log.\n')
  return { wikiRoot, dataRoot: path.join(root, 'data'), skillPath: path.join(skillRoot, 'SKILL.md') }
}

function proposal(input) {
  return { claims: [{ text: 'Observed a duplicate record after retrying the same non-idempotent write.', evidenceRefs: [2], quotes: [{ seq: 2, text: evidence.events[0].text }] }], updates: [{ path: 'wiki/synthesis/retry-case.md', content: `---\ntype: synthesis\nkind: incident\ntitle: Retry case\ndate: 2026-10-24\nstatus: settled\ndomain: tool\nsources: ["${input.sourceRef}"]\n---\n# Retry case\n\nObserved a duplicate record after retrying the same non-idempotent write.\n\nEvidence: [[${input.sourceRef}|original observations]]\n` }] }
}

test('Skill ingest prepares outside the live Wiki, then publishes linked source and knowledge', async t => {
  const config = await library(t)
  const ingest = new WikiIngest({ ...config, generate: async input => {
    assert.match(input.instructions, /Read evidence/)
    return proposal(input)
  } })
  const prepared = await ingest.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal)
  await assert.rejects(fs.stat(path.join(config.wikiRoot, 'wiki/synthesis/retry-case.md')), { code: 'ENOENT' })
  const pages = await ingest.publish(prepared, new AbortController().signal)
  assert.ok(pages.includes('wiki/synthesis/retry-case'))
  assert.match(await fs.readFile(path.join(config.wikiRoot, 'wiki/synthesis/retry-case.md'), 'utf8'), /Observed a duplicate/)
  assert.match(await fs.readFile(path.join(config.wikiRoot, 'wiki/log.md'), 'utf8'), /jobId=/)
  await ingest.publish(prepared, new AbortController().signal)
  const log = await fs.readFile(path.join(config.wikiRoot, 'wiki/log.md'), 'utf8')
  assert.equal(log.match(/jobId=/g).length, 1)
})

test('writer cannot escape the staging knowledge directories or invent evidence references', async t => {
  const config = await library(t)
  const escaping = new WikiIngest({ ...config, generate: async input => ({ ...proposal(input), updates: [{ path: '../escaped.md', content: proposal(input).updates[0].content }] }) })
  await assert.rejects(escaping.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal), /outside knowledge/)
  const fabricated = new WikiIngest({ ...config, generate: async input => ({ ...proposal(input), claims: [{ text: 'Invented successful repair', evidenceRefs: [999], quotes: [{ seq: 999, text: 'invented' }] }] }) })
  await assert.rejects(fabricated.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal), /unknown original event/)
})

test('publication preserves external changes and resumes partially written manifests once', async t => {
  const config = await library(t)
  const ingest = new WikiIngest({ ...config, generate: async input => proposal(input) })
  const prepared = await ingest.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal)
  await fs.writeFile(path.join(config.wikiRoot, 'wiki/log.md'), '# Log\nHuman added a note\n')
  await assert.rejects(ingest.publish(prepared, new AbortController().signal), error => error.message.includes('changed outside') && error.partial === false)
  assert.match(await fs.readFile(path.join(config.wikiRoot, 'wiki/log.md'), 'utf8'), /Human added/)
  await fs.writeFile(path.join(config.wikiRoot, 'wiki/log.md'), '# Log\n')
  const first = prepared.files[0]
  await fs.mkdir(path.dirname(path.join(config.wikiRoot, first.path)), { recursive: true })
  await fs.writeFile(path.join(config.wikiRoot, first.path), first.after)
  await ingest.publish(prepared, new AbortController().signal)
  await ingest.publish(prepared, new AbortController().signal)
  assert.equal((await fs.readFile(path.join(config.wikiRoot, 'wiki/log.md'), 'utf8')).match(/jobId=/g).length, 1)
})

test('automatic ingestion cannot replace an existing judgment while preserving only its sources', async t => {
  const config = await library(t)
  const previous = '---\ntype: synthesis\nkind: incident\ntitle: Previous case\ndate: 2026-10-24\nstatus: investigating\ndomain: tool\n---\n# Existing judgment\nOriginal conditions must survive.\n'
  await fs.writeFile(path.join(config.wikiRoot, 'wiki/synthesis/retry-case.md'), previous)
  const ingest = new WikiIngest({ ...config, generate: async input => proposal(input) })
  await assert.rejects(ingest.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal), /existing judgment/)
})

test('an external save in the publication gap is retained instead of being overwritten', async t => {
  const config = await library(t)
  const ingest = new WikiIngest({ ...config, generate: async input => proposal(input) })
  const prepared = await ingest.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal)
  const log = path.join(await fs.realpath(config.wikiRoot), 'wiki/log.md')
  const rename = fsSync.renameSync
  const injected = t.mock.method(fsSync, 'renameSync', (source, destination) => {
    rename(source, destination)
    if (source === log) fsSync.writeFileSync(log, '# External editor saved here\n')
  })
  await assert.rejects(ingest.publish(prepared, new AbortController().signal), error => error.message.includes('External save') && error.partial === true)
  injected.mock.restore()
  assert.equal(await fs.readFile(log, 'utf8'), '# External editor saved here\n')
})

test('changed frozen evidence and invented quotations are rejected', async t => {
  const config = await library(t)
  const ingest = new WikiIngest({ ...config, generate: async input => proposal(input) })
  await assert.rejects(ingest.prepare({ ...evidence, events: [{ ...evidence.events[0], text: 'mutated' }] }, { provider: 'fixture', model: 'writer' }, new AbortController().signal), /content hash/)
  const fabricated = new WikiIngest({ ...config, generate: async input => {
    const result = proposal(input)
    result.claims[0].quotes[0].text = 'No such source text'
    return result
  } })
  await assert.rejects(fabricated.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal), /quote does not match/)
})

test('a verification state that cannot fit Jev is refused instead of failing at the endpoint', async t => {
  const config = await library(t)
  const ingest = new WikiIngest({ ...config, generate: async input => proposal(input) })
  const text = 'y'.repeat(80_000)
  // user/message is a fixed kind: folding cannot shrink it, so the precheck must reject.
  const oversized = { ...evidence, events: [evidence.events[0], { seq: 3, kind: 'user/message', text, hash: createHash('sha256').update(text).digest('hex') }] }
  await assert.rejects(
    ingest.prepare(oversized, { provider: 'fixture', model: 'writer' }, new AbortController().signal),
    error => error.name === 'JudgeBudgetExceeded' && /超出本地预算/.test(error.message),
  )
})

test('verification is refused when the pages under review alone exceed the budget', async t => {
  const config = await library(t)
  const ingest = new WikiIngest({ ...config, generate: async input => {
    const result = proposal(input)
    // files are the text under verification: folding may never shorten them.
    result.updates[0].content = result.updates[0].content.replace('Evidence:', 'x'.repeat(80_000) + '\n\nEvidence:')
    return result
  } })
  await assert.rejects(
    ingest.prepare(evidence, { provider: 'fixture', model: 'writer' }, new AbortController().signal),
    error => error.name === 'JudgeBudgetExceeded',
  )
})
