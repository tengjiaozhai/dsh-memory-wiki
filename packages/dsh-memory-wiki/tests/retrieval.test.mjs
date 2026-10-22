/**
 * L1 · 检索：中文二元字 + 英文词项 + BM25 页级 top2、一跳扩展上限、命中依据。
 * 命中率不设门禁（计划 §2 P1 第 5 条），这里只验结构与边界。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { core } from './_load.mjs'

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')
const corpus = core.scanCorpus({ root: FIXTURE })

test('分词：中文出二元字，英文出小写词项，单字中文保留', () => {
  const terms = core.tokenize('工具熔断 Tool')
  assert.deepEqual(terms.filter((term) => term.startsWith('b:')), ['b:工具', 'b:具熔', 'b:熔断'])
  assert.deepEqual(terms.filter((term) => term.startsWith('w:')), ['w:tool'])
  assert.deepEqual(core.tokenize('熔'), ['b:熔'])
  assert.deepEqual(core.tokenize(''), [])
})

test('页级 top2 直接命中，报告带上库版本与命中依据', () => {
  const report = core.search(corpus, { query: '工具熔断', hops: 0 })
  assert.equal(report.libraryRevision, corpus.revision)
  const direct = report.candidates.filter((candidate) => candidate.match === 'direct')
  assert.equal(direct.length, 2)
  assert.equal(direct[0].pageId, 'wiki/concepts/工具熔断')
  assert.equal(direct[0].rank, 1)
  assert.ok(direct[0].why.length > 0)
  assert.ok(direct[0].why.every((term) => term.startsWith('b:') || term.startsWith('w:')))
  assert.equal(direct[0].selected, false) // 候选 ≠ 已选入
  assert.equal(direct[0].contentHash, corpus.pages.get('wiki/concepts/工具熔断').contentHash)
})

test('0 跳只返回直接命中；1 跳补关联页且每页 ≤3、总计 ≤8', () => {
  const zero = core.search(corpus, { query: '工具熔断', hops: 0 })
  assert.equal(zero.candidates.every((candidate) => candidate.match === 'direct'), true)
  assert.equal(zero.hops, 0)

  const one = core.search(corpus, { query: '工具熔断', hops: 1 })
  assert.equal(one.hops, 1)
  assert.ok(one.candidates.length <= 8)
  const linked = one.candidates.filter((candidate) => candidate.match === 'linked')
  for (const candidate of linked) {
    assert.ok(candidate.viaPageId)
    assert.equal(candidate.rank, 0)
    assert.equal(candidate.selected, false)
    assert.ok(candidate.why.some((reason) => reason.startsWith('via ')))
  }
  const perDirect = new Map()
  for (const candidate of linked) {
    const key = candidate.viaPageId
    perDirect.set(key, (perDirect.get(key) ?? 0) + 1)
  }
  for (const count of perDirect.values()) assert.ok(count <= 3, String(count))
  // 关联页不重复计入直接命中
  const ids = one.candidates.map((candidate) => candidate.pageId)
  assert.equal(new Set(ids).size, ids.length)
})

test('候选上限可收窄，且 edges 只覆盖候选内部', () => {
  const limited = core.search(corpus, { query: '工具熔断', hops: 1, maxCandidates: 3 })
  assert.ok(limited.candidates.length <= 3)
  const ids = new Set(limited.candidates.map((candidate) => candidate.pageId))
  for (const edge of limited.edges) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to))
    assert.ok(edge.source === 'body' || edge.source === 'related')
  }
})

test('完全不命中时返回空候选，不伪造结果', () => {
  const report = core.search(corpus, { query: 'zzzqqqxxxx', hops: 1 })
  assert.deepEqual(report.candidates, [])
  assert.equal(report.libraryRevision, corpus.revision)
})
