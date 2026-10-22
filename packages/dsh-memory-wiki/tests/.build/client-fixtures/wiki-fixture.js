/**
 * Fixture retrieval state, derived from the verbatim page markdown.
 *
 * Only the retrieval decisions live here (which page is direct vs linked, which
 * comparator put each page in or left it out, which preset takes which pages).
 * Every displayed value — title, kind, as-of, page hash, segment text — is
 * parsed at module load from `page-docs.ts` with core/markdown.ts and sha256, so
 * the fixture cannot drift from the text the panel shows.
 *
 * This module lives in `tests/` on purpose: the production client must not ship
 * example knowledge. It is reached only through `registerFixtureSource()` in a
 * test/dev entry, and `tests/client-seam.test.mjs` compares its DTOs with the
 * remote mapping so the two shapes cannot drift.
 */
import { parseFrontmatter, splitBlocks } from '../core/markdown.js'
             
            
                
                   
       
           
              
                
                  
                 
           
                                
                                                                                                   
import { FIXTURE_DOC_SOURCES,                       } from './page-docs.js'
import { sha256Hex } from './sha256.js'

                             
                
               
              
                          
                    
                     
                
                         
                  
              
                       
                    
                                      
 

function buildDoc(source                  )             {
  const parsed = parseFrontmatter(source.markdown)
  const lines = source.markdown.replace(/\r\n/g, '\n').split('\n')
  const value = parsed.value                           

  const segments                = source.ranges.map((range) => ({
    startLine: range.startLine,
    endLine: range.endLine,
  }))

  const title = typeof value.title === 'string' ? value.title : source.pageId
  const kind = typeof value.type === 'string' ? value.type : 'concept'
  const asOf =
    typeof value.as_of === 'string'
      ? value.as_of
      : typeof value.captured === 'string'
        ? value.captured
        : undefined
  const confidence =
    typeof value.confidence === 'string'
      ? value.confidence
      : typeof value.status === 'string'
        ? value.status
        : '未提供'

  return {
    pageId: source.pageId,
    title,
    kind,
    asOf,
    confidence,
    // Hash of exactly the bytes we ship, which are the bytes of the real file.
    contentHash: sha256Hex(source.markdown),
    taken: source.taken,
    segments,
    markdown: source.markdown,
    body: parsed.body,
    bodyStartLine: parsed.bodyStartLine,
    totalLines: parsed.totalLines,
    frontmatter: value,
  }
}

export const FIXTURE_DOCS                        = FIXTURE_DOC_SOURCES.map(buildDoc)

const DOC = new Map                    (FIXTURE_DOCS.map((entry) => [entry.pageId, entry]))

export function docById(pageId        )             {
  const found = DOC.get(pageId)
  if (found === undefined) throw new Error('fixture: unknown page ' + pageId)
  return found
}

export const PAGE_ID = {
  breaker: 'wiki/concepts/工具熔断.md',
  idempotency: 'wiki/concepts/幂等与写入恢复.md',
  cache: 'wiki/concepts/工具缓存.md',
  compaction: 'wiki/concepts/上下文压缩.md',
  notebook: 'wiki/sources/agent-开发学习笔记.md',
}         

/** Library identity = this fixture's page set + page hashes. */
export const LIBRARY_REVISION = sha256Hex(
  FIXTURE_DOCS.map((entry) => entry.pageId + ':' + entry.contentHash).join('\n'),
).slice(0, 16)

/** A fixture has exactly one revision; the remote path gets it from the host. */
export const FIXTURE_VIEW_REVISION = 1

export const QUERY = '工具连续失败怎么处理'

const EDGES                  = [
  { from: PAGE_ID.breaker, to: PAGE_ID.cache, source: 'related' },
  { from: PAGE_ID.breaker, to: PAGE_ID.idempotency, source: 'related' },
  { from: PAGE_ID.idempotency, to: PAGE_ID.compaction, source: 'related' },
  { from: PAGE_ID.breaker, to: PAGE_ID.notebook, source: 'body' },
]

                         
                
                            
                    
               
               
              
 

const SPECS                  = [
  { pageId: PAGE_ID.breaker, match: 'direct', why: ['工具', '连续失败', '熔断'], score: 18.42, rank: 1 },
  { pageId: PAGE_ID.idempotency, match: 'direct', why: ['失败', '重试', '恢复'], score: 13.77, rank: 2 },
  { pageId: PAGE_ID.cache, match: 'linked', viaPageId: PAGE_ID.breaker, why: [], score: 0, rank: 0 },
  { pageId: PAGE_ID.compaction, match: 'linked', viaPageId: PAGE_ID.idempotency, why: [], score: 0, rank: 0 },
  { pageId: PAGE_ID.notebook, match: 'linked', viaPageId: PAGE_ID.breaker, why: [], score: 0, rank: 0 },
]

const AUTO_1_HOP = [PAGE_ID.breaker, PAGE_ID.idempotency, PAGE_ID.cache]
const AUTO_0_HOP = [PAGE_ID.breaker, PAGE_ID.idempotency]
const MANUAL = [PAGE_ID.breaker, PAGE_ID.idempotency, PAGE_ID.cache, PAGE_ID.compaction]

                         
                     
               
            
                          
                                                                         
 

const SELECTIONS                  = [
  {
    kind: 'auto1',
    query: QUERY,
    hops: 1,
    taken: AUTO_1_HOP,
    excluded: { [PAGE_ID.compaction]: 'budget', [PAGE_ID.notebook]: 'no-usable-block' },
  },
  {
    kind: 'auto0',
    query: QUERY,
    hops: 0,
    taken: AUTO_0_HOP,
    excluded: {
      [PAGE_ID.cache]: 'not-selected',
      [PAGE_ID.compaction]: 'not-selected',
      [PAGE_ID.notebook]: 'no-usable-block',
    },
  },
  {
    kind: 'manual',
    query: QUERY,
    hops: 1,
    taken: MANUAL,
    excluded: { [PAGE_ID.notebook]: 'not-selected' },
  },
]

function segmentsOf(pageId        )                {
  return docById(pageId).segments.map((segment) => ({
    startLine: segment.startLine,
    endLine: segment.endLine,
  }))
}

function sourcesOf(taken                   )                   {
  return taken.map((pageId) => {
    const entry = docById(pageId)
    return {
      pageId,
      contentHash: entry.contentHash,
      asOf: entry.asOf,
      title: entry.title,
      segments: segmentsOf(pageId),
    }
  })
}

/** Text of the chosen 1-based ranges, verbatim from the page markdown. */
function segmentText(pageId        , segments                        )         {
  const lines = docById(pageId).markdown.replace(/\r\n/g, '\n').split('\n')
  return segments.map((segment) => lines.slice(segment.startLine - 1, segment.endLine).join('\n')).join('\n\n')
}

/** Wrapper the core compiler emits (design §5.2), so chars/payloadHash mean the same. */
function composeText(sources                  )         {
  const blocks = sources.map((source) => {
    const ranges = source.segments.map((segment) => segment.startLine + '-' + segment.endLine).join(',')
    return (
      '[来源：' + source.pageId +
      '；资料日期：' + (source.asOf ?? '未提供') +
      '；页面哈希：' + source.contentHash.slice(0, 12) +
      '；行段：' + ranges + ']\n' +
      segmentText(source.pageId, source.segments)
    )
  })
  return '【Wiki 证据快照】\n' + blocks.join('\n\n') + '\n\n【快照结束】'
}

function reportFor(spec               )                  {
  const candidates              = SPECS.map((candidate) => {
    const selected = spec.taken.indexOf(candidate.pageId) !== -1
    const excluded = spec.excluded[candidate.pageId]
    const entry = docById(candidate.pageId)
    const item            = {
      pageId: candidate.pageId,
      title: entry.title,
      contentHash: entry.contentHash,
      asOf: entry.asOf,
      match: candidate.match,
      selected,
      why: candidate.why,
      score: candidate.score,
      rank: candidate.rank,
    }
    if (candidate.viaPageId !== undefined) item.viaPageId = candidate.viaPageId
    if (excluded !== undefined) item.excludedReason = excluded
    if (selected) item.segments = segmentsOf(candidate.pageId)
    return item
  })
  return {
    libraryRevision: LIBRARY_REVISION,
    query: spec.query,
    hops: spec.hops,
    candidates,
    edges: EDGES,
  }
}

function compile(spec               , budget              )                {
  const sources = sourcesOf(spec.taken)
  const text = composeText(sources)
  const report = reportFor(spec)
  const dropped = report.candidates
    .filter((candidate) => candidate.excludedReason !== undefined)
    .map((candidate) => ({
      pageId: candidate.pageId,
      title: candidate.title,
      reason: candidate.excludedReason ,
    }))
  return {
    text,
    chars: text.length,
    payloadHash: sha256Hex(text),
    fits: text.length <= budget,
    overBy: text.length > budget ? text.length - budget : 0,
    sources,
    dropped,
    droppedBlocks: [],
    missing: [],
    report,
  }
}

function snapshotOf(
  kind               ,
  budget              ,
  id        ,
  origin                        ,
)                   {
  const result = compile(selectionOf(kind), budget)
  return {
    snapshotId: id,
    libraryRevision: LIBRARY_REVISION,
    origin,
    budgetChars: budget,
    sources: result.sources,
    text: result.text,
    payloadHash: result.payloadHash,
    chars: result.chars,
    report: result.report,
  }
}

function selectionOf(kind               )                {
  const found = SELECTIONS.find((spec) => spec.kind === kind)
  if (found === undefined) throw new Error('fixture: unknown selection ' + kind)
  return found
}

/** Frozen history: two earlier turns, oldest last. Read-only in the panel. */
const HISTORY                     = [
  snapshotOf('auto1', 4000, 'snap-7c41e9', 'automatic'),
  snapshotOf('manual', 8000, 'snap-2ba803', 'manual'),
]

                                     
                       
                      
                                                                    
                
             
 

export function buildFixtureView(request                    )                 {
  const base = selectionOf(request.preset)
  const spec                =
    request.query === undefined && request.hops === undefined
      ? base
      : {
          ...base,
          query: request.query ?? base.query,
          hops: request.hops ?? base.hops,
          taken: filterByHops(base, request.hops ?? base.hops),
        }
  const result = compile(spec, request.budget)
  return {
    revision: FIXTURE_VIEW_REVISION,
    libraryRevision: LIBRARY_REVISION,
    report: result.report ,
    compile: result,
    current: snapshotOf(request.preset, request.budget, 'snap-9f5d31', 'automatic'),
    history: HISTORY,
  }
}

function filterByHops(spec               , hops      )                    {
  if (hops === 1) return spec.taken
  return spec.taken.filter((pageId) => {
    const found = SPECS.find((candidate) => candidate.pageId === pageId)
    return found !== undefined && found.match === 'direct'
  })
}

/** Build the core WikiPage DTO for readPage() from the frozen markdown. */
export function toWikiPage(pageId        )           {
  const entry = docById(pageId)
  const blocks = splitBlocks(entry.body, entry.bodyStartLine)
  const related = Array.isArray(entry.frontmatter.related) ? (entry.frontmatter.related            ) : []
  const tags = Array.isArray(entry.frontmatter.tags) ? (entry.frontmatter.tags            ) : []
  const aliases = Array.isArray(entry.frontmatter.aliases) ? (entry.frontmatter.aliases            ) : []
  const extra                                    = {}
  for (const [key, value] of Object.entries(entry.frontmatter)) {
    if (typeof value === 'string' || Array.isArray(value)) extra[key] = value                     
  }
  return {
    pageId: entry.pageId,
    contentHash: entry.contentHash,
    asOf: entry.asOf,
    title: entry.title,
    kind: entry.kind            ,
    path: '/Volumes/PortableSSD/docs/tengjiaozhai.github.io/' + entry.pageId,
    meta: {
      type: entry.kind            ,
      title: entry.title,
      domain: typeof entry.frontmatter.domain === 'string' ? entry.frontmatter.domain : undefined,
      status: typeof entry.frontmatter.status === 'string' ? entry.frontmatter.status : undefined,
      confidence: entry.confidence,
      asOf: entry.asOf,
      tags,
      aliases,
      related,
      extra,
    },
    body: entry.body,
    bodyStartLine: entry.bodyStartLine,
    totalLines: entry.totalLines,
    blocks,
    rawLinks: [],
  }
}

export { EDGES, SELECTIONS }
                             
