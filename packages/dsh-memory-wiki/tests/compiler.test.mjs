/**
 * L1 · 编译：完整块、来源行段、UTF-16 字符口径、payloadHash、预算与排除原因。
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { core } from './_load.mjs'

const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'library')
const corpus = core.scanCorpus({ root: FIXTURE })

const fileLines = (page) => fs.readFileSync(page.path, 'utf8').replace(/\r\n/g, '\n').split('\n')

test('chars = text.length（UTF-16 code units），payloadHash 就是这段 text 的哈希', () => {
  const result = core.compileSnapshot(corpus, ['wiki/concepts/工具熔断'], {
    origin: 'automatic',
    budgetChars: 4000,
    query: '工具熔断',
  })
  assert.ok(result.text.length > 0)
  assert.equal(result.chars, result.text.length)
  assert.equal(result.payloadHash, core.sha256(result.text))
  assert.equal(result.fits, true)
  assert.equal(result.overBy, 0)
})

test('来源头带路径、资料日期、页面哈希与一基行段', () => {
  const result = core.compileSnapshot(corpus, ['wiki/concepts/工具熔断'], {
    origin: 'automatic',
    budgetChars: 4000,
  })
  const page = corpus.pages.get('wiki/concepts/工具熔断')
  assert.equal(result.sources.length, 1)
  assert.equal(result.sources[0].pageId, 'wiki/concepts/工具熔断')
  assert.equal(result.sources[0].contentHash, page.contentHash)
  assert.match(result.text, new RegExp(page.contentHash.slice(0, 8)))
  assert.match(result.text, /2026-10-19/)
  assert.match(result.text, /wiki\/concepts\/工具熔断/)
  assert.ok(result.sources[0].segments.length > 0)
  for (const segment of result.sources[0].segments) {
    assert.ok(Number.isInteger(segment.startLine) && segment.startLine >= 1)
    assert.ok(segment.endLine >= segment.startLine)
    assert.ok(segment.endLine <= page.totalLines)
  }
})

test('行段是真的行段：一段的原文逐字出现在快照里（含 frontmatter 偏移）', () => {
  const result = core.compileSnapshot(corpus, ['wiki/concepts/工具熔断'], {
    origin: 'automatic',
    budgetChars: 4000,
  })
  const page = corpus.pages.get('wiki/concepts/工具熔断')
  const lines = fileLines(page)
  for (const segment of result.sources[0].segments) {
    const slice = lines.slice(segment.startLine - 1, segment.endLine).join('\n')
    assert.ok(slice.trim().length > 0)
    assert.ok(result.text.includes(slice), `segment ${segment.startLine}-${segment.endLine} 不在 text 里`)
  }
  // frontmatter 本身不进正文，但行号必须把它算进去：正文第一行的绝对行号 > 1
  assert.ok(page.bodyStartLine > 1)
})

test('代码围栏是原子块：预算不够就整块不带，绝不截半段', () => {
  const page = corpus.pages.get('wiki/concepts/大代码块')
  const codeBlock = page.blocks.find((block) => block.kind === 'code')
  assert.ok(codeBlock)
  const result = core.compileSnapshot(corpus, ['wiki/concepts/大代码块'], {
    origin: 'automatic',
    budgetChars: 400,
    query: '大代码块',
  })
  assert.equal(result.text.includes('```'), false)
  assert.equal(result.droppedBlocks.some((block) => block.startLine === codeBlock.startLine), true)
  assert.ok(result.chars <= 400)
  // 短块仍然进来了，说明不是整页被丢
  assert.ok(result.sources.length === 1)
})

test('表格也是原子块', () => {
  const page = corpus.pages.get('wiki/outputs/索引')
  const table = page.blocks.find((block) => block.kind === 'table')
  assert.ok(table)
  const full = core.compileSnapshot(corpus, ['wiki/outputs/索引'], { origin: 'automatic', budgetChars: 4000 })
  assert.ok(full.text.includes(table.text))
  const lines = table.text.split('\n')
  // 取到就整表取到
  for (const line of lines) assert.ok(full.text.includes(line))
})

test('预算不足：页面级原因区分 budget 与 no-usable-block', () => {
  const empty = core.compileSnapshot(corpus, ['wiki/concepts/只有标题'], {
    origin: 'automatic',
    budgetChars: 4000,
  })
  assert.equal(empty.sources.length, 0)
  assert.equal(empty.dropped.find((entry) => entry.pageId === 'wiki/concepts/只有标题').reason, 'no-usable-block')

  const huge = core.compileSnapshot(corpus, ['wiki/concepts/超长段'], {
    origin: 'automatic',
    budgetChars: 120,
  })
  assert.equal(huge.sources.length, 0)
  assert.equal(huge.dropped.find((entry) => entry.pageId === 'wiki/concepts/超长段').reason, 'no-usable-block')

  const overrun = core.compileSnapshot(corpus, ['wiki/concepts/工具熔断', 'wiki/concepts/旁路缓存'], {
    origin: 'automatic',
    budgetChars: 200,
  })
  const droppedBudget = overrun.dropped.find((entry) => entry.pageId === 'wiki/concepts/旁路缓存')
  assert.ok(droppedBudget, JSON.stringify(overrun.dropped))
  assert.equal(droppedBudget.reason, 'budget')
  assert.ok(overrun.chars <= 200)
})

test('自动路径在任意预算下都不超预算，且不带半块', () => {
  for (const budgetChars of [80, 120, 260, 400, 1000, 4000]) {
    const result = core.compileSnapshot(corpus, corpus.pageIds, {
      origin: 'automatic',
      budgetChars,
      query: '工具熔断 缓存',
    })
    assert.ok(result.chars <= budgetChars, `budget ${budgetChars} -> ${result.chars}`)
    const fences = (result.text.match(/```/g) ?? []).length
    assert.equal(fences % 2, 0, '不能出现落单的围栏标记')
  }
})

test('预算扫描：任何预算下 chars 都不超过预算（含"未带入"行的反噬）', () => {
  const pageIds = ['wiki/concepts/工具熔断', 'wiki/concepts/旁路缓存', 'wiki/sources/长页', 'wiki/synthesis/决策']
  for (let budgetChars = 90; budgetChars <= 2200; budgetChars += 7) {
    const result = core.compileSnapshot(corpus, pageIds, {
      origin: 'automatic',
      budgetChars,
      query: '缓存 熔断 长页',
    })
    assert.ok(result.chars <= budgetChars, `budget ${budgetChars} -> chars ${result.chars}`)
    assert.equal(result.chars, result.text.length)
    if (result.sources.length === 0) assert.equal(result.text, '')
  }
})

test('手选路径超额就报超额，绝不偷偷删掉选择或截断正文', () => {
  const page = corpus.pages.get('wiki/concepts/大代码块')
  const codeBlock = page.blocks.find((block) => block.kind === 'code')
  const result = core.compileSnapshot(corpus, ['wiki/concepts/大代码块'], {
    origin: 'manual',
    budgetChars: 200,
  })
  assert.equal(result.fits, false)
  assert.ok(result.overBy > 0)
  assert.equal(result.sources.length, 1)
  assert.ok(result.text.includes(codeBlock.text))
  assert.deepEqual(result.dropped, [])
})

test('报告候选被回填 selected / segments / excludedReason，候选 ≠ 已选入', () => {
  const report = core.search(corpus, { query: '工具熔断', hops: 1 })
  const allIds = report.candidates.map((candidate) => candidate.pageId)
  const result = core.compileSnapshot(corpus, allIds.slice(0, 1), {
    origin: 'automatic',
    budgetChars: 4000,
    query: '工具熔断',
    report,
  })
  assert.ok(result.report)
  const selected = result.report.candidates.filter((candidate) => candidate.selected)
  assert.deepEqual(
    selected.map((candidate) => candidate.pageId),
    result.sources.map((source) => source.pageId),
  )
  for (const candidate of selected) assert.ok(candidate.segments.length > 0)
  for (const candidate of result.report.candidates.filter((entry) => !entry.selected)) {
    assert.equal(candidate.excludedReason, 'not-selected')
    assert.equal(candidate.segments, undefined)
  }
})

test('候选报告与语料视图版本不一致就拒绝，不混用两份语料', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mw-report-'))
  fs.cpSync(FIXTURE, tmp, { recursive: true })
  fs.appendFileSync(path.join(tmp, 'wiki/concepts/旁路缓存.md'), '\n\n变化一行。\n')
  const newer = core.scanCorpus({ root: tmp })
  assert.notEqual(newer.revision, corpus.revision)
  const staleReport = core.search(corpus, { query: '工具熔断', hops: 1 })
  assert.throws(
    () =>
      core.compileSnapshot(newer, ['wiki/concepts/工具熔断'], {
        origin: 'automatic',
        budgetChars: 4000,
        report: staleReport,
      }),
    /library revision/,
  )
})

test('请求里不存在的页记为 missing，不静默吞掉', () => {
  const result = core.compileSnapshot(corpus, ['wiki/concepts/工具熔断', 'wiki/concepts/没有这一页'], {
    origin: 'automatic',
    budgetChars: 4000,
  })
  assert.deepEqual(result.missing, ['wiki/concepts/没有这一页'])
  assert.equal(result.sources.length, 1)
})

test('buildSnapshot 生成独立 snapshotId 与恰好 text 的 payloadHash', () => {
  const { snapshot, result } = core.buildSnapshot(corpus, ['wiki/concepts/工具熔断'], {
    origin: 'automatic',
    budgetChars: 4000,
    snapshotId: 'sw_test_1',
  })
  assert.ok(snapshot)
  assert.equal(snapshot.snapshotId, 'sw_test_1')
  assert.equal(snapshot.libraryRevision, corpus.revision)
  assert.equal(snapshot.chars, result.chars)
  assert.equal(snapshot.payloadHash, core.sha256(snapshot.text))
  assert.equal(snapshot.payloadHash, result.payloadHash)
  assert.equal(Object.isFrozen(snapshot), true)
  assert.equal(Object.isFrozen(snapshot.sources), true)
  assert.equal(Object.isFrozen(snapshot.sources[0].segments), true)

  const empty = core.buildSnapshot(corpus, ['wiki/concepts/只有标题'], { origin: 'automatic', budgetChars: 4000 })
  assert.equal(empty.snapshot, null)
  const over = core.buildSnapshot(corpus, ['wiki/concepts/大代码块'], { origin: 'manual', budgetChars: 200 })
  assert.equal(over.snapshot, null)
  assert.equal(over.result.fits, false)
})
