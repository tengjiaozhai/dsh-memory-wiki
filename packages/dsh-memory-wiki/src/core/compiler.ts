/**
 * core/compiler.ts — the one body compiler for both the automatic and the
 * manual path (design §5.2).
 *
 * Rules enforced here:
 *   - Markdown block boundaries are atomic: a fenced code block or a table is
 *     taken whole or not at all. Nothing is sliced in the middle.
 *   - Concept pages keep "定义 / 当前判断" first, then mechanism, then examples;
 *     other kinds prefer their conclusion/summary over the query-hit body.
 *   - Every source carries path, as-of, page hash and 1-based line segments that
 *     include the frontmatter lines.
 *   - `chars = text.length` (UTF-16 code units, same as the prototype), and the
 *     wrapper line is included in that count.
 *   - `payloadHash` is the hash of exactly `text`.
 *   - Automatic mode fills greedily with whole blocks and records why a page or
 *     block did not fit; manual mode never drops a selection, it reports the
 *     exact overrun instead.
 */
import crypto from 'node:crypto'

import type {
  CompileResult,
  CorpusSnapshot,
  DroppedBlock,
  DroppedPage,
  EvidenceSnapshot,
  EvidenceOrigin,
  MarkdownBlock,
  PageSegment,
  RetrievalReport,
  SnapshotSource,
  WikiPage,
} from './types.js'
import { sha256 } from './wiki-corpus.js'
import { resolvePageId } from './wiki-corpus.js'
import { tokenize } from './retrieval.js'

const HEADER_TITLE = '【Wiki 证据快照】'
const FOOTER = '【快照结束】'

const TIER_DEFINITION = ['定义', '判断', '结论', '是什么', '摘要', '概述', '一句话']
const TIER_MECHANISM = ['机制', '原理', '流程', '怎么', '路径', '判据', '为什么', '关键', '用法', '配置', '处理']
const TIER_EXAMPLE = ['实例', '例子', '案例', '落地', '示例', '例子', '应用', '清单']

const CONCEPT_WEIGHTS = { definition: 3, mechanism: 2, example: 1 }
const DEFAULT_WEIGHTS = { definition: 2, mechanism: 1.5, example: 0.5 }

function tierOf(text: string): 'definition' | 'mechanism' | 'example' | 'none' {
  if (TIER_DEFINITION.some((keyword) => text.includes(keyword))) return 'definition'
  if (TIER_MECHANISM.some((keyword) => text.includes(keyword))) return 'mechanism'
  if (TIER_EXAMPLE.some((keyword) => text.includes(keyword))) return 'example'
  return 'none'
}

function headingTextOf(block: MarkdownBlock): string {
  return block.text.replace(/^#+\s*/, '').trim()
}

function isStructural(block: MarkdownBlock): boolean {
  return block.kind === 'heading' || block.kind === 'hr'
}

/** Heading blocks that must travel with a content block so it stays readable. */
function headingChain(page: WikiPage, block: MarkdownBlock): MarkdownBlock[] {
  const chain: MarkdownBlock[] = []
  let depth = 0
  for (const entry of block.headingPath) {
    depth += 1
    const found = page.blocks.find(
      (candidate) =>
        candidate.kind === 'heading' &&
        candidate.level === depth &&
        candidate.headingPath.length === depth - 1 &&
        headingTextOf(candidate) === entry &&
        candidate.startLine < block.startLine,
    )
    if (found !== undefined) chain.push(found)
  }
  return chain
}

interface PagePlan {
  page: WikiPage
  /** Selectable content blocks, priority order (highest first). */
  ordered: MarkdownBlock[]
  /** Blocks that can never be used, e.g. the duplicate H1 title. */
  unusable: MarkdownBlock[]
  hasContent: boolean
}

function planPage(page: WikiPage, queryTerms: readonly string[]): PagePlan {
  const weights = page.kind === 'concept' || page.kind === 'synthesis' ? CONCEPT_WEIGHTS : DEFAULT_WEIGHTS
  const ordered: MarkdownBlock[] = []
  const unusable: MarkdownBlock[] = []
  const blockTermCache = new Map<number, Set<string>>()
  const termsOfBlock = (block: MarkdownBlock): Set<string> => {
    const cached = blockTermCache.get(block.startLine)
    if (cached !== undefined) return cached
    const terms = new Set(tokenize(block.text))
    blockTermCache.set(block.startLine, terms)
    return terms
  }

  for (const block of page.blocks) {
    if (block.kind === 'heading' && block.level === 1) {
      unusable.push(block)
      continue
    }
    if (isStructural(block)) continue
    ordered.push(block)
  }

  const querySet = queryTerms.length > 0 ? new Set(queryTerms) : new Set<string>()
  const scored = ordered.map((block, docIndex) => {
    const heading = block.headingPath.join(' / ')
    const tier = tierOf(heading.length > 0 ? heading : headingTextOf(block))
    let priority = 0
    if (tier === 'definition') priority = weights.definition
    else if (tier === 'mechanism') priority = weights.mechanism
    else if (tier === 'example') priority = weights.example
    let overlap = 0
    if (querySet.size > 0) {
      const blockTerms = termsOfBlock(block)
      for (const term of querySet) if (blockTerms.has(term)) overlap += 1
      overlap = overlap / querySet.size
    }
    const kindBonus = block.kind === 'table' ? 0.15 : block.kind === 'paragraph' ? 0.1 : 0.05
    return { block, docIndex, score: priority + overlap * 0.6 + kindBonus }
  })
  scored.sort((a, b) => (b.score === a.score ? a.docIndex - b.docIndex : b.score - a.score))

  const plan: PagePlan = {
    page,
    ordered: scored.map((entry) => entry.block),
    unusable,
    hasContent: scored.length > 0,
  }
  return plan
}

interface Section {
  page: WikiPage
  blocks: MarkdownBlock[]
  segments: PageSegment[]
}

export interface CompileOptions {
  origin: EvidenceOrigin
  /** Production values are 4000 | 8000 (BudgetChars); tests may use less. */
  budgetChars: number
  /** The natural-language question; used only for block ordering. */
  query?: string
  /** Retrieval report captured at selection time, annotated in the result. */
  report?: RetrievalReport
}

function segmentsOf(blocks: readonly MarkdownBlock[]): PageSegment[] {
  const sorted = [...blocks].sort((a, b) => a.startLine - b.startLine)
  const segments: PageSegment[] = []
  for (const block of sorted) {
    const last = segments[segments.length - 1]
    if (last !== undefined && block.startLine <= last.endLine + 1) {
      last.endLine = Math.max(last.endLine, block.endLine)
      continue
    }
    segments.push({ startLine: block.startLine, endLine: block.endLine })
  }
  return segments
}

interface RenderArgs {
  revision: string
  origin: EvidenceOrigin
  budgetChars: number
  sections: Section[]
  dropped: readonly DroppedPage[]
}

const REASON_TEXT: Record<string, string> = {
  budget: '预算不足',
  'no-usable-block': '无可用块',
  'not-selected': '未选',
}

/** Render the exact text the model would receive. Deterministic. */
export function renderSnapshotText(args: RenderArgs): string {
  const { revision, origin, budgetChars, sections, dropped } = args
  const count = sections.length
  // No usable block means no snapshot text at all: the round simply runs
  // without Wiki context (design §5.2). Emitting an empty wrapper would still
  // cost characters and would claim an injection that carries nothing.
  if (count === 0) return ''
  const parts: string[] = []
  parts.push(`${HEADER_TITLE}库版本 ${revision} · ${origin} · 预算 ${budgetChars} 字符 · ${count} 页`)
  sections.forEach((section, index) => {
    const hash8 = section.page.contentHash.slice(0, 8)
    const asOf = section.page.asOf ?? '未提供'
    const lineSpec = section.segments.map((segment) => `${segment.startLine}-${segment.endLine}`).join(',')
    const header = `—— 来源 ${index + 1}/${count} ${section.page.pageId} · ${section.page.title} · hash ${hash8} · as_of ${asOf} · 行 ${lineSpec}`
    const body = section.blocks.map((block) => block.text).join('\n\n')
    parts.push(`${header}\n${body}`)
  })
  const excluded = dropped
    .filter((entry) => entry.reason === 'budget' || entry.reason === 'no-usable-block')
    .map((entry) => `${entry.pageId}（${REASON_TEXT[entry.reason] ?? entry.reason}）`)
  if (excluded.length > 0) parts.push(`未带入 ${excluded.join('、')}`)
  parts.push(FOOTER)
  return parts.join('\n\n')
}

function cloneReport(
  report: RetrievalReport,
  selectedIds: ReadonlySet<string>,
  reasons: ReadonlyMap<string, DroppedPage['reason']>,
  segments: ReadonlyMap<string, PageSegment[]>,
): RetrievalReport {
  const candidates = report.candidates.map((candidate) => {
    const isSelected = selectedIds.has(candidate.pageId)
    const reason = reasons.get(candidate.pageId)
    const next: typeof candidate = {
      pageId: candidate.pageId,
      title: candidate.title,
      contentHash: candidate.contentHash,
      match: candidate.match,
      selected: isSelected,
      why: candidate.why,
      score: candidate.score,
      rank: candidate.rank,
      ...(candidate.asOf !== undefined ? { asOf: candidate.asOf } : {}),
      ...(candidate.viaPageId !== undefined ? { viaPageId: candidate.viaPageId } : {}),
      ...(isSelected
        ? { segments: segments.get(candidate.pageId) ?? [] }
        : { excludedReason: reason ?? 'not-selected' }),
    }
    Object.freeze(next.why)
    if (next.segments !== undefined) Object.freeze(next.segments)
    return Object.freeze(next)
  })
  const edges = report.edges.map((edge) => Object.freeze({ ...edge }))
  Object.freeze(candidates)
  Object.freeze(edges)
  return Object.freeze({
    libraryRevision: report.libraryRevision,
    query: report.query,
    hops: report.hops,
    candidates,
    edges,
  })
}

/**
 * Compile a selection against one immutable corpus view.
 *
 * Automatic: pages in the given order, blocks in priority order, whole blocks
 * only; the first block that does not fit is dropped and the next cheaper one is
 * tried. Manual: every block of every selected page, no silent dropping.
 */
export function compileSnapshot(
  corpus: CorpusSnapshot,
  pageIds: readonly string[],
  options: CompileOptions,
): CompileResult {
  const budgetChars = Math.max(1, Math.floor(options.budgetChars))
  const queryTerms = options.query !== undefined ? tokenize(options.query) : []
  const missing: string[] = []
  const plans: PagePlan[] = []
  const seen = new Set<string>()

  for (const requested of pageIds) {
    let canonical: string
    try {
      canonical = resolvePageId(corpus, requested)
    } catch {
      missing.push(requested)
      continue
    }
    if (seen.has(canonical)) continue
    seen.add(canonical)
    const page = corpus.pages.get(canonical) as WikiPage
    plans.push(planPage(page, queryTerms))
  }

  const included = new Map<string, MarkdownBlock[]>()
  const dropped: DroppedPage[] = []
  const droppedBlocks: DroppedBlock[] = []

  const sectionsNow = (): Section[] => {
    const result: Section[] = []
    for (const plan of plans) {
      const blocks = included.get(plan.page.pageId)
      if (blocks === undefined || blocks.length === 0) continue
      const ordered = [...blocks].sort((a, b) => a.startLine - b.startLine)
      result.push({ page: plan.page, blocks: ordered, segments: segmentsOf(ordered) })
    }
    return result
  }
  const renderNow = (droppedNow: readonly DroppedPage[]): string =>
    renderSnapshotText({
      revision: corpus.revision,
      origin: options.origin,
      budgetChars,
      sections: sectionsNow(),
      dropped: droppedNow,
    })

  /** True when the block could fit an otherwise empty snapshot at the real budget. */
  const fitsAlone = (plan: PagePlan, block: MarkdownBlock): boolean => {
    const chain = headingChain(plan.page, block)
    const blocks = [...chain, block]
    const text = renderSnapshotText({
      revision: corpus.revision,
      origin: options.origin,
      budgetChars,
      sections: [{ page: plan.page, blocks, segments: segmentsOf(blocks) }],
      dropped: [],
    })
    return text.length <= budgetChars
  }

  if (options.origin === 'manual') {
    // Manual selection never silently drops or truncates: every block of every
    // selected page goes in, and an overrun is reported as an overrun.
    for (const plan of plans) {
      const blocks: MarkdownBlock[] = []
      for (const block of plan.ordered) {
        for (const heading of headingChain(plan.page, block)) {
          if (!blocks.some((existing) => existing.startLine === heading.startLine)) blocks.push(heading)
        }
        blocks.push(block)
      }
      if (blocks.length > 0) included.set(plan.page.pageId, blocks)
      else dropped.push({ pageId: plan.page.pageId, title: plan.page.title, reason: 'no-usable-block' })
    }
  } else {
    /**
     * Greedy fill with whole blocks only. The effective budget is the caller's
     * budget minus whatever the trailing "未带入" line will add once the pages
     * that did not fit are known; that line is unknown before the run, so the
     * fill is repeated with a shrunk budget until the rendered text fits.
     */
    const greedyFill = (effectiveBudget: number): void => {
      included.clear()
      dropped.length = 0
      droppedBlocks.length = 0
      for (const plan of plans) {
        const accepted: MarkdownBlock[] = []
        for (const block of plan.ordered) {
          const additions: MarkdownBlock[] = []
          for (const heading of headingChain(plan.page, block)) {
            if (!accepted.some((existing) => existing.startLine === heading.startLine)) additions.push(heading)
          }
          additions.push(block)
          included.set(plan.page.pageId, [...accepted, ...additions])
          if (renderNow([]).length <= effectiveBudget) {
            accepted.push(...additions)
            included.set(plan.page.pageId, [...accepted])
          } else {
            included.set(plan.page.pageId, [...accepted])
            droppedBlocks.push({
              pageId: plan.page.pageId,
              startLine: block.startLine,
              endLine: block.endLine,
              reason: 'budget',
            })
          }
        }
        if (accepted.length > 0) {
          included.set(plan.page.pageId, accepted)
          continue
        }
        included.delete(plan.page.pageId)
        const usable = plan.hasContent && plan.ordered.some((block) => fitsAlone(plan, block))
        dropped.push({
          pageId: plan.page.pageId,
          title: plan.page.title,
          reason: usable ? 'budget' : 'no-usable-block',
        })
      }
    }

    let effectiveBudget = budgetChars
    greedyFill(effectiveBudget)
    let text = renderNow(dropped)
    let guard = 0
    while (text.length > budgetChars && effectiveBudget > 1 && guard < 24) {
      effectiveBudget = Math.max(1, effectiveBudget - Math.max(1, text.length - budgetChars))
      greedyFill(effectiveBudget)
      text = renderNow(dropped)
      guard += 1
    }
    // Shrinking can oscillate (dropping a block shortens the body but can
    // lengthen the 未带入 line), so the last resort trims the least valuable
    // accepted block — lowest priority within the last page that still has one —
    // until the rendered text really fits. Empty text still means "no snapshot".
    const planById = new Map<string, PagePlan>()
    for (const plan of plans) planById.set(plan.page.pageId, plan)
    let trimGuard = 0
    while (text.length > budgetChars && trimGuard < 4096) {
      trimGuard += 1
      const current = sectionsNow()
      const lastSection = current[current.length - 1]
      if (lastSection === undefined) {
        text = ''
        break
      }
      const pageId = lastSection.page.pageId
      const plan = planById.get(pageId) as PagePlan
      const accepted = included.get(pageId) ?? []
      const victim = [...plan.ordered]
        .reverse()
        .find((block) => accepted.some((entry) => entry.startLine === block.startLine))
      if (victim === undefined) {
        included.delete(pageId)
        if (!dropped.some((entry) => entry.pageId === pageId)) {
          dropped.push({ pageId, title: plan.page.title, reason: 'budget' })
        }
      } else {
        const remaining = accepted.filter((entry) => entry.startLine !== victim.startLine)
        droppedBlocks.push({ pageId, startLine: victim.startLine, endLine: victim.endLine, reason: 'budget' })
        if (remaining.some((entry) => !isStructural(entry))) included.set(pageId, remaining)
        else included.delete(pageId)
      }
      text = renderNow(dropped)
    }
  }

  const sections = sectionsNow()
  const text = renderNow(dropped)
  const chars = text.length
  const fits = chars <= budgetChars
  const sources: SnapshotSource[] = sections.map((section) => {
    const source: SnapshotSource = {
      pageId: section.page.pageId,
      contentHash: section.page.contentHash,
      title: section.page.title,
      segments: section.segments,
    }
    if (section.page.asOf !== undefined) source.asOf = section.page.asOf
    return source
  })

  const reasons = new Map<string, DroppedPage['reason']>()
  for (const entry of dropped) reasons.set(entry.pageId, entry.reason)
  const segmentMap = new Map<string, PageSegment[]>()
  for (const source of sources) segmentMap.set(source.pageId, source.segments)
  const selectedIds = new Set(sources.map((source) => source.pageId))

  const result: CompileResult = {
    text,
    chars,
    payloadHash: sha256(text),
    fits,
    overBy: fits ? 0 : chars - budgetChars,
    sources,
    dropped,
    droppedBlocks,
    missing,
  }
  if (options.report !== undefined) {
    if (options.report.libraryRevision !== corpus.revision) {
      throw new Error(
        `retrieval report belongs to library revision ${options.report.libraryRevision}, corpus is ${corpus.revision}`,
      )
    }
    result.report = cloneReport(options.report, selectedIds, reasons, segmentMap)
  }
  return result
}

export interface BuildSnapshotOptions extends CompileOptions {
  /** Stable id for tests; production passes nothing and gets a fresh uuid. */
  snapshotId?: string
}

export interface SnapshotBuild {
  /** null when nothing usable fits, so the caller skips instead of injecting. */
  snapshot: EvidenceSnapshot | null
  result: CompileResult
}

/**
 * Compile and wrap the result in the frozen snapshot DTO.
 *
 * snapshotId is generated independently of the text (design §6: "先生成独立
 * ID，避免正文自包含哈希循环"); payloadHash is the hash of the text only.
 */
export function buildSnapshot(
  corpus: CorpusSnapshot,
  pageIds: readonly string[],
  options: BuildSnapshotOptions,
): SnapshotBuild {
  const result = compileSnapshot(corpus, pageIds, options)
  if (!result.fits || result.sources.length === 0) {
    return { snapshot: null, result }
  }
  const snapshot: EvidenceSnapshot = {
    snapshotId: options.snapshotId ?? `sw_${crypto.randomUUID()}`,
    libraryRevision: corpus.revision,
    origin: options.origin,
    budgetChars: options.budgetChars,
    sources: result.sources,
    text: result.text,
    payloadHash: result.payloadHash,
    chars: result.chars,
    ...(result.report !== undefined ? { report: result.report } : {}),
  }
  for (const source of snapshot.sources) Object.freeze(source.segments)
  Object.freeze(snapshot.sources)
  if (snapshot.report !== undefined) Object.freeze(snapshot.report)
  return { snapshot: Object.freeze(snapshot), result }
}
