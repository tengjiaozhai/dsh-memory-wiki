/**
 * L1 · 三个只读工具：契约、分页截断声明、版本与路径错误。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { core } from './_load.mjs'

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')
const corpus = core.scanCorpus({ root: FIXTURE })
const tools = core.createWikiTools(corpus)

test('工具规格是纯 JSON Schema 子集，名字与设计一致', () => {
  assert.deepEqual(core.WIKI_TOOL_NAMES, ['wiki_search', 'wiki_read', 'wiki_neighbors'])
  for (const spec of core.WIKI_TOOL_SPECS) {
    assert.ok(spec.name.startsWith('wiki_'))
    assert.equal(spec.inputSchema.type, 'object')
    assert.ok(spec.inputSchema.required.length >= 1)
  }
})

test('wiki_search 复用同一套检索，不创建覆盖也不冻结快照', () => {
  const result = tools.search({ query: '工具熔断', hops: 1 })
  assert.equal(result.ok, true)
  assert.equal(result.value.libraryRevision, corpus.revision)
  assert.ok(result.value.report.candidates.length > 0)
  assert.equal(result.value.report.candidates.every((candidate) => candidate.selected === false), true)
  const bad = tools.search({ query: '   ' })
  assert.equal(bad.ok, false)
  assert.equal(bad.error.code, 'invalid-argument')
})

test('wiki_read 返回带绝对行号的正文，长页明确分页', () => {
  const pageId = 'wiki/sources/长页'
  const page = corpus.pages.get(pageId)
  const first = tools.read({ pageId, maxChars: 300 })
  assert.equal(first.ok, true)
  assert.equal(first.value.pageId, pageId)
  assert.equal(first.value.totalLines, page.totalLines)
  assert.equal(first.value.startLine, page.bodyStartLine)
  assert.equal(first.value.truncated, true)
  assert.equal(typeof first.value.nextOffset, 'number')
  assert.ok(first.value.text.length > 0)

  // 逐页读完，拼起来的正文等于整页正文
  let offset = 0
  const chunks = []
  let guard = 0
  for (;;) {
    const chunk = tools.read({ pageId, offset, maxChars: 300 })
    assert.equal(chunk.ok, true)
    chunks.push(chunk.value.text)
    if (!chunk.value.truncated) {
      assert.equal(chunk.value.nextOffset, null)
      break
    }
    offset = chunk.value.nextOffset
    guard += 1
    assert.ok(guard < 100, '分页没有收敛')
  }
  assert.equal(chunks.join('\n'), page.body)
})

test('wiki_read 的版本不符/未知页/越界路径都是显式错误', () => {
  const mismatch = tools.read({ pageId: 'wiki/concepts/工具熔断', revision: 'deadbeef' })
  assert.equal(mismatch.ok, false)
  assert.equal(mismatch.error.code, 'version-mismatch')

  const unknown = tools.read({ pageId: 'wiki/concepts/没有这一页' })
  assert.equal(unknown.ok, false)
  assert.equal(unknown.error.code, 'unknown-page')

  const escape = tools.read({ pageId: '../../etc/passwd' })
  assert.equal(escape.ok, false)
  assert.equal(escape.error.code, 'unsafe-page-id')

  const ok = tools.read({ pageId: 'wiki/concepts/工具熔断', revision: corpus.pages.get('wiki/concepts/工具熔断').contentHash })
  assert.equal(ok.ok, true)
})

test('wiki_neighbors 用同一张图，0 跳默认，1 跳带方向与边来源', () => {
  const zero = tools.neighbors({ pageId: 'wiki/concepts/工具熔断' })
  assert.equal(zero.ok, true)
  assert.equal(zero.value.hops, 0)
  assert.deepEqual(zero.value.nodes, [])

  const one = tools.neighbors({ pageId: 'wiki/concepts/工具熔断', hops: 1 })
  assert.equal(one.ok, true)
  assert.ok(one.value.nodes.length > 0)
  for (const node of one.value.nodes) {
    assert.ok(node.direction === 'out' || node.direction === 'in')
    assert.ok(node.source === 'body' || node.source === 'related')
    assert.equal(typeof node.title, 'string')
  }
  const escape = tools.neighbors({ pageId: '/etc/passwd', hops: 1 })
  assert.equal(escape.ok, false)
  assert.equal(escape.error.code, 'unsafe-page-id')
})

test('工具绑定在一份不可变语料视图上', () => {
  assert.equal(tools.corpus, corpus)
  assert.equal(Object.isFrozen(tools.corpus), true)
})
