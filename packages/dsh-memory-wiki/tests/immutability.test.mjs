/**
 * L1 · 同一次查询只引用一份不可变语料视图。
 *
 * 门禁原文：一次查询引用同一份不可变语料视图，不混合重建前后的页面。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { core } from './_load.mjs'

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')

test('检索 → 编译 → 读取共用同一 revision，不重新扫盘', () => {
  const corpus = core.scanCorpus({ root: FIXTURE })
  const report = core.search(corpus, { query: '工具熔断', hops: 1 })
  const ids = report.candidates.map((candidate) => candidate.pageId)
  const { snapshot } = core.buildSnapshot(corpus, ids, {
    origin: 'automatic',
    budgetChars: 4000,
    query: '工具熔断',
    report,
  })
  assert.ok(snapshot)
  assert.equal(report.libraryRevision, corpus.revision)
  assert.equal(snapshot.libraryRevision, corpus.revision)
  assert.equal(snapshot.report.libraryRevision, corpus.revision)
  const read = core.readPage(corpus, ids[0])
  assert.equal(core.readPage(corpus, ids[0]).contentHash, read.contentHash)
  assert.equal(core.hasPage(corpus, ids[0]), true)
})

test('磁盘在查询期间变化不会渗进已经取到的视图', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-frozen-'))
  fs.cpSync(FIXTURE, tmp, { recursive: true })
  const frozen = core.scanCorpus({ root: tmp })
  const before = core.compileSnapshot(frozen, ['wiki/concepts/旁路缓存'], {
    origin: 'automatic',
    budgetChars: 4000,
  })
  fs.writeFileSync(path.join(tmp, 'wiki/concepts/旁路缓存.md'), '---\ntype: concept\ntitle: "旁路缓存"\n---\n\n# 旁路缓存\n\n整页被换掉了。\n')
  const after = core.compileSnapshot(frozen, ['wiki/concepts/旁路缓存'], {
    origin: 'automatic',
    budgetChars: 4000,
  })
  assert.deepEqual(after.sources, before.sources)
  assert.equal(after.text, before.text)
  const rescan = core.scanCorpus({ root: tmp })
  assert.notEqual(rescan.revision, frozen.revision)
  assert.notEqual(
    core.compileSnapshot(rescan, ['wiki/concepts/旁路缓存'], { origin: 'automatic', budgetChars: 4000 }).text,
    before.text,
  )
})

test('报告、候选、快照都是冻结对象', () => {
  const corpus = core.scanCorpus({ root: FIXTURE })
  const report = core.search(corpus, { query: '工具熔断', hops: 1 })
  assert.equal(Object.isFrozen(report), true)
  assert.equal(Object.isFrozen(report.candidates), true)
  assert.equal(Object.isFrozen(report.candidates[0]), true)
  assert.equal(Object.isFrozen(report.candidates[0].why), true)
  assert.equal(Object.isFrozen(report.edges), true)
  assert.throws(() => {
    report.candidates.push({})
  })
  assert.throws(() => {
    report.candidates[0].selected = true
  })
})

test('语料视图里的 Map 不会被外部改写路径', () => {
  const corpus = core.scanCorpus({ root: FIXTURE })
  assert.ok(corpus.pages instanceof Map)
  assert.equal(Object.isFrozen(corpus.pageIds), true)
  assert.throws(() => {
    corpus.pageIds.push('wiki/concepts/伪造')
  })
})
