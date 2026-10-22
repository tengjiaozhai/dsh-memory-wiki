/**
 * tests/eval-s3.mjs — 在真实库上重评检索（计划 §2 P1 第 5 条：只记录，不设门禁）。
 *
 * 口径与 experiments/ablation.mjs 保持一致，便于与旧的 A6c（top2 + 1 跳，4k）
 * 直接对比：
 *   - 同一套 S3 手写问句（12 条），gold = 页相对路径
 *   - needle = 该页 "一句话定义" 首段（概念页）或 H1 后首个实质段落，clean 后取前 60 字
 *   - 命中 = clean(快照正文) 包含 needle；页面命中 = gold 页出现在快照 sources 里
 *
 * 用法：node tests/eval-s3.mjs [--root <库根>] [--budget 4000]
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { core } from './_load.mjs'

const DEFAULT_ROOT = '/Volumes/PortableSSD/docs/tengjiaozhai.github.io'
const args = process.argv.slice(2)
const argOf = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] !== undefined ? args[index + 1] : fallback
}
const ROOT = argOf('root', process.env.MW_WIKI_ROOT ?? DEFAULT_ROOT)
const BUDGET = Number(argOf('budget', '4000'))

const S3_MAP = [
  ['工具连续失败怎么处理', '工具熔断'],
  ['上下文塞满了该怎么办', '上下文压缩'],
  ['为什么要边生成边推送', 'SSE流式推送'],
  ['缓存不一致的窗口期怎么解释', '旁路缓存'],
  ['两个人同时发消息会怎样', '会话并发互斥'],
  ['什么时候该用 skill 什么时候该用 tool', 'Skill-vs-Tool'],
  ['重试会不会导致重复写入', '幂等与写入恢复'],
  ['怎么判断模型改完变差了', 'Agent评测'],
  ['意图识别要分几层才够', '意图识别分层'],
  ['先规划再执行和直接执行怎么选', 'Plan-Execute'],
  ['向量库到底怎么选型', '向量库选型'],
  ['为什么测试集要人工标注标准答案', '金标'],
]

const clean = (value) =>
  value.replace(/\*\*/g, '').replace(/\s+/g, '').replace(/[「」“”"]/g, '')

function evidenceOf(page) {
  const body = page.body
  if (page.kind === 'concept') {
    const section = /##\s*一句话定义\s*\n+([\s\S]*?)(?=\n##\s)/.exec(body)
    if (section) {
      const paragraph = (section[1] ?? '').split(/\n\s*\n/).find((part) => clean(part).length > 30)
      if (paragraph !== undefined) return clean(paragraph).slice(0, 60)
    }
  }
  const afterH1 = body.replace(/^#\s+.+\n/, '')
  const paragraph = afterH1
    .split(/\n\s*\n/)
    .find((part) => !part.startsWith('#') && !part.startsWith('|') && clean(part).length > 40)
  return clean(paragraph ?? body).slice(0, 60)
}

const corpus = core.scanCorpus({ root: ROOT })
const byTitle = new Map()
for (const pageId of corpus.pageIds) {
  const page = corpus.pages.get(pageId)
  byTitle.set(page.title, page)
  byTitle.set(pageId, page)
}

const rows = []
for (const [query, title] of S3_MAP) {
  const goldPage = byTitle.get(title) ?? byTitle.get(`wiki/concepts/${title}`)
  if (goldPage === undefined) {
    rows.push({ query, title, status: 'gold-missing' })
    continue
  }
  const needle = evidenceOf(goldPage)
  const report = core.search(corpus, { query, hops: 1, directLimit: 2, perPageLinks: 3, maxCandidates: 8 })
  const ids = report.candidates.map((candidate) => candidate.pageId)
  const { snapshot, result } = core.buildSnapshot(corpus, ids, {
    origin: 'automatic',
    budgetChars: BUDGET,
    query,
    report,
  })
  const text = snapshot?.text ?? result.text
  const selected = (snapshot?.sources ?? result.sources).map((source) => source.pageId)
  const pageHit = selected.includes(goldPage.pageId)
  const evidenceHit = needle.length > 0 && clean(text).includes(needle)
  rows.push({
    query,
    gold: goldPage.pageId.replace(/^wiki\//, ''),
    direct: report.candidates
      .filter((candidate) => candidate.match === 'direct')
      .map((candidate) => candidate.pageId.replace(/^wiki\//, ''))
      .join(' + '),
    selected: selected.map((pageId) => pageId.replace(/^wiki\//, '')).join(' + '),
    chars: result.chars,
    fits: result.fits,
    pageHit,
    evidenceHit,
  })
}

const scored = rows.filter((row) => row.status !== 'gold-missing')
const pct = (count) => `${Math.round((100 * count) / Math.max(1, scored.length))}%`
const pageHits = scored.filter((row) => row.pageHit).length
const evidenceHits = scored.filter((row) => row.evidenceHit).length
const both = scored.filter((row) => row.pageHit && row.evidenceHit).length
const avgChars = Math.round(scored.reduce((sum, row) => sum + row.chars, 0) / Math.max(1, scored.length))

console.log(`corpus root   : ${corpus.root}`)
console.log(`pages         : ${corpus.stats.valid} valid / ${corpus.stats.invalid} invalid / ${corpus.stats.scanned} scanned`)
console.log(`revision      : ${corpus.revision}`)
console.log(`broken links  : ${corpus.brokenLinks.length}`)
console.log(`budget        : ${BUDGET} chars`)
console.log('')
const header = ['query', 'gold', 'direct(top2)', 'selected', 'chars', 'page', 'evidence']
console.log(header.join('\t'))
for (const row of scored) {
  console.log(
    [row.query, row.gold, row.direct, row.selected, row.chars, row.pageHit ? 'Y' : '-', row.evidenceHit ? 'Y' : '-'].join('\t'),
  )
}
console.log('')
console.log(`S3 needled    : ${scored.length} 条（旧实验同口径）`)
console.log(`页面命中      : ${pageHits}/${scored.length} = ${pct(pageHits)}`)
console.log(`证据命中      : ${evidenceHits}/${scored.length} = ${pct(evidenceHits)}`)
console.log(`页面+证据都中 : ${both}/${scored.length} = ${pct(both)}`)
console.log(`平均字符数    : ${avgChars} / ${BUDGET}`)
