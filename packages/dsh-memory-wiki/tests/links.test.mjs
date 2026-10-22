/**
 * L1 · 失效链接、边来源、0/1 跳。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { core } from './_load.mjs'

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')
const corpus = core.scanCorpus({ root: FIXTURE })

const outEdges = (pageId) => corpus.edges.filter((edge) => edge.from === pageId)
const hasEdge = (from, to, source) =>
  corpus.edges.some((edge) => edge.from === from && edge.to === to && edge.source === source)

test('正文边与 related 边分别记账', () => {
  assert.equal(hasEdge('wiki/concepts/工具熔断', 'wiki/concepts/旁路缓存', 'body'), true)
  assert.equal(hasEdge('wiki/concepts/工具熔断', 'wiki/concepts/旁路缓存', 'related'), true)
  assert.equal(hasEdge('wiki/concepts/工具熔断', 'wiki/entities/agentscope', 'body'), true)
  assert.equal(hasEdge('wiki/synthesis/决策', 'wiki/concepts/工具熔断', 'related'), true)

  const bodyEdge = outEdges('wiki/concepts/工具熔断').find(
    (edge) => edge.to === 'wiki/concepts/旁路缓存' && edge.source === 'body',
  )
  assert.equal(typeof bodyEdge.line, 'number')
  assert.ok(bodyEdge.line > 0)
})

test('正文 [[…]] 的行号是一基、且含 frontmatter 行', () => {
  const page = corpus.pages.get('wiki/concepts/工具熔断')
  const edge = outEdges('wiki/concepts/工具熔断').find(
    (candidate) => candidate.to === 'wiki/concepts/旁路缓存' && candidate.source === 'body',
  )
  const line = page.body.split('\n')[edge.line - page.bodyStartLine]
  assert.match(line, /\[\[wiki\/concepts\/旁路缓存\]\]/)
})

test('代码围栏与行内代码里的 [[…]] 不是边', () => {
  assert.equal(hasEdge('wiki/concepts/工具熔断', 'wiki/synthesis/不该成为边', 'body'), false)
  assert.equal(corpus.brokenLinks.some((link) => link.target === 'wikilink'), false)
  assert.equal(corpus.edges.some((edge) => edge.to === 'wikilink'), false)
})

test('失效链接被记录，不改写也不抛出', () => {
  const broken = corpus.brokenLinks.filter((link) => link.from === 'wiki/concepts/工具熔断')
  const missing = broken.find((link) => link.target === 'wiki/concepts/不存在的页')
  assert.ok(missing)
  assert.equal(missing.reason, 'unknown-page')
  assert.equal(missing.source, 'body')
  assert.equal(typeof missing.line, 'number')

  const relatedBroken = corpus.brokenLinks.find(
    (link) => link.from === 'wiki/synthesis/决策' && link.source === 'related',
  )
  assert.ok(relatedBroken)
  assert.equal(relatedBroken.reason, 'unknown-page')
})

test('别名、.md 后缀、锚点与表格里的转义竖线都能解析到同一目标', () => {
  assert.equal(hasEdge('wiki/synthesis/决策', 'wiki/entities/agentscope', 'body'), true)
  // 大小写不一致的链接解析到真实大小写的规范 pageId
  assert.equal(hasEdge('wiki/concepts/旁路缓存', 'wiki/concepts/工具熔断', 'body'), true)
  const escaped = core.splitWikilink('wiki/concepts/关联度模型\\|关联度模型')
  assert.equal(escaped.target, 'wiki/concepts/关联度模型')
  assert.equal(escaped.alias, '关联度模型')
  assert.equal(core.normalizeLinkTarget('wiki/concepts/工具熔断.md#小节'), 'wiki/concepts/工具熔断')
})

test('0 跳没有邻居，1 跳先出后入且去重', () => {
  assert.deepEqual(core.neighbors(corpus, 'wiki/concepts/工具熔断', 0), [])
  const one = core.neighbors(corpus, 'wiki/concepts/工具熔断', 1)
  assert.ok(one.length > 0)

  const outgoing = one.filter((node) => node.direction === 'out')
  const incoming = one.filter((node) => node.direction === 'in')
  assert.ok(outgoing.length > 0)
  assert.ok(incoming.length > 0)
  // 出边整体排在入边之前
  assert.ok(one.findIndex((node) => node.direction === 'in') > one.findIndex((node) => node.direction === 'out'))
  // 同一目标只出现一次（body + related 双边的旁路缓存只算一个邻居）
  assert.equal(one.filter((node) => node.pageId === 'wiki/concepts/旁路缓存').length, 1)
  assert.ok(outgoing.some((node) => node.pageId === 'wiki/entities/agentscope'))
  assert.ok(incoming.some((node) => node.pageId === 'wiki/synthesis/决策'))

  const page = corpus.pages.get('wiki/entities/agentscope')
  assert.deepEqual(page.meta.extra.concepts, ['wiki/concepts/工具熔断'])
})

test('图谱只收录本库有效内容页', () => {
  const known = new Set(corpus.pageIds)
  for (const edge of corpus.edges) {
    assert.ok(known.has(edge.from), edge.from)
    assert.ok(known.has(edge.to), edge.to)
  }
  // 无效页（坏类型等）既不是边的起点也不是终点
  assert.equal(corpus.edges.some((edge) => edge.from === 'wiki/concepts/坏类型'), false)
})
