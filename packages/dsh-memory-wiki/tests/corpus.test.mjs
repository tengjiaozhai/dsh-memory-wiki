/**
 * L1 · 元数据有效/无效、大小写、越界路径。
 * 跑的是构建产物（tests/.build/core），不是 .ts 加载器。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { core } from './_load.mjs'

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')
const corpus = core.scanCorpus({ root: FIXTURE })

test('扫到的有效页正好是 fixture 里的 11 页，index/log 不参与检索', () => {
  assert.equal(corpus.stats.scanned, 14)
  assert.equal(corpus.stats.valid, 11)
  assert.equal(corpus.stats.invalid, 3)
  assert.equal(corpus.pages.has('wiki/concepts/index'), false)
  assert.equal(corpus.pages.has('wiki/log'), false)
})

test('pageId 是库内规范相对路径且保留真实大小写', () => {
  assert.ok(corpus.pages.has('wiki/concepts/工具熔断'))
  assert.ok(corpus.pages.has('wiki/concepts/大小写冲突'))
  assert.ok(corpus.pages.has('wiki/concepts/大小写冲突2'))
  // 两页只差一个字符，不能被小写化合并
  assert.equal(corpus.pages.size, 11)
  for (const pageId of corpus.pageIds) {
    assert.ok(pageId.startsWith('wiki/'), pageId)
    assert.ok(!pageId.includes('.md'), pageId)
    assert.equal(pageId, pageId.trim())
  }
})

test('frontmatter 有效字段被解析：title / as_of / tags / related / 未知字段保留', () => {
  const page = corpus.pages.get('wiki/concepts/工具熔断')
  assert.equal(page.title, '工具熔断')
  assert.equal(page.kind, 'concept')
  assert.equal(page.asOf, '2026-10-19')
  assert.equal(page.meta.confidence, 'high')
  assert.deepEqual(page.meta.tags, ['reliability', 'circuit-breaker'])
  assert.deepEqual(page.meta.aliases, ['circuit-breaker', '熔断器'])
  assert.deepEqual(page.meta.related, ['wiki/concepts/旁路缓存'])
  assert.equal(page.meta.extra.source_type, undefined)
})

test('无效元数据被逐条拒绝，并在 issues 里给出可定位的 code', () => {
  const codes = (pageId) => corpus.issues.filter((issue) => issue.pageId === pageId).map((issue) => issue.code)
  assert.deepEqual(codes('wiki/concepts/坏类型'), ['type-mismatch'])
  assert.deepEqual(codes('wiki/concepts/缺标题'), ['missing-title'])
  assert.deepEqual(codes('wiki/concepts/无前置'), ['missing-frontmatter'])
  for (const pageId of ['wiki/concepts/坏类型', 'wiki/concepts/缺标题', 'wiki/concepts/无前置']) {
    assert.equal(corpus.pages.has(pageId), false, pageId)
  }
})

test('缺目录只报 issue，不抛异常', () => {
  const partial = core.scanCorpus({ root: FIXTURE, dirs: ['concepts', 'outputs', '不存在的目录'] })
  assert.equal(partial.issues.some((issue) => issue.code === 'missing-dir'), true)
  assert.equal(partial.stats.valid, 8) // 7 concepts + 1 output
  assert.equal(core.scanCorpus({ root: FIXTURE }).issues.some((issue) => issue.code === 'missing-dir'), false)
})

test('库版本 = 路径集合 + 哈希集合：稳定，且内容变化即变', () => {
  const first = core.scanCorpus({ root: FIXTURE })
  const second = core.scanCorpus({ root: FIXTURE })
  assert.equal(first.revision, second.revision)
  assert.match(first.revision, /^[0-9a-f]{16}$/)

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-rev-'))
  fs.cpSync(FIXTURE, tmp, { recursive: true })
  const before = core.scanCorpus({ root: tmp })
  // 版本只由路径集合 + 哈希集合决定，同一份内容换个根目录版本不变
  assert.equal(before.revision, first.revision)
  fs.appendFileSync(path.join(tmp, 'wiki/concepts/旁路缓存.md'), '\n\n追加一行。\n')
  const after = core.scanCorpus({ root: tmp })
  assert.notEqual(before.revision, after.revision)
  // 已取到的旧视图不受磁盘后续变化影响
  assert.equal(before.revision, first.revision)
})

test('越界路径在读文件之前就被拒绝', () => {
  const bad = ['/etc/passwd', '../etc/passwd', 'wiki/../../etc/passwd', 'C:\\Windows\\x', 'wiki//concepts/x', ' ./x', 'wiki/concepts/..']
  for (const pageId of bad) {
    assert.throws(() => core.assertSafePageId(pageId), (error) => error.code === 'unsafe-page-id', pageId)
    assert.throws(() => core.readPage(corpus, pageId), (error) => error.code === 'unsafe-page-id', pageId)
  }
  assert.throws(() => core.readPage(corpus, 'wiki/concepts/不存在'), (error) => error.code === 'unknown-page')
})

test('指向库外的符号链接被拒绝，库内符号链接照常解析', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-link-'))
  const library = path.join(tmp, 'library')
  fs.cpSync(FIXTURE, library, { recursive: true })
  const outside = path.join(tmp, 'outside.md')
  fs.writeFileSync(outside, '---\ntype: concept\ntitle: "外部"\n---\n\n# 外部\n\n泄露内容。\n')
  fs.symlinkSync(outside, path.join(library, 'wiki/concepts/外部链接.md'))
  fs.symlinkSync(path.join(library, 'wiki/concepts/旁路缓存.md'), path.join(library, 'wiki/concepts/库内链接.md'))

  const snapshot = core.scanCorpus({ root: library })
  assert.equal(snapshot.pages.has('wiki/concepts/外部链接'), false)
  assert.equal(snapshot.issues.some((issue) => issue.code === 'escaped-root'), true)
  assert.equal(snapshot.pages.has('wiki/concepts/库内链接'), true)
})

test('大小写不一致的 pageId 解析到真实大小写的规范页', () => {
  const page = core.readPage(corpus, 'wiki/CONCEPTS/工具熔断')
  assert.equal(page.pageId, 'wiki/concepts/工具熔断')
  assert.equal(core.readPage(corpus, 'wiki/concepts/工具熔断').pageId, 'wiki/concepts/工具熔断')
})

test('页面对象是只读的', () => {
  const page = corpus.pages.get('wiki/concepts/工具熔断')
  assert.equal(Object.isFrozen(page), true)
  assert.equal(Object.isFrozen(page.meta), true)
  assert.equal(Object.isFrozen(page.meta.tags), true)
  assert.equal(Object.isFrozen(page.blocks), true)
  assert.equal(Object.isFrozen(corpus), true)
  assert.equal(Object.isFrozen(corpus.pageIds), true)
  assert.throws(() => {
    page.meta.tags.push('x')
  })
})
