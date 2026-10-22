/**
 * core/types.ts — shared, host-agnostic DTOs for the read-only core.
 *
 * Nothing here imports DSH. The only DTO that leaves this package (via the
 * typed Remote in P3) is EvidenceSnapshot / RetrievalReport; the rest are
 * internal-core types. Field names follow design/dsh-memory-wiki.md §6.
 */

/** Page categories, one per scanned directory. */
export type PageKind = 'source' | 'entity' | 'concept' | 'synthesis' | 'output'

/** Snapshot budget presets (design §2: 4,000 / 8,000 chars). */
export type BudgetChars = 4000 | 8000

/** Who decided the selection. */
export type EvidenceOrigin = 'automatic' | 'manual'

/** Retrieval relation of a candidate to the query. */
export type MatchKind = 'direct' | 'linked'

/** Why a candidate page did not make it into the snapshot. */
export type ExcludedReason = 'budget' | 'no-usable-block' | 'not-selected'

/** Which part of the page produced a link. */
export type LinkSource = 'body' | 'related'

/** Hop count for the link-graph expansion (design §4.3: default 1, UI may narrow to 0). */
export type Hops = 0 | 1

/** Scanned subdirectories of <root>/wiki. Deliberately not recursive. */
export const CONTENT_DIRS = ['sources', 'entities', 'concepts', 'synthesis', 'outputs'] as const

/** Directory -> expected frontmatter `type`. */
export const DIR_KIND: Record<string, PageKind> = {
  sources: 'source',
  entities: 'entity',
  concepts: 'concept',
  synthesis: 'synthesis',
  outputs: 'output',
}

/** These basenames are navigation, not retrievable content (design §4.2). */
export const SKIP_BASENAMES: ReadonlySet<string> = new Set(['index', 'log'])

/** Markdown block kinds the compiler treats as atomic units. */
export type BlockKind =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'table'
  | 'code'
  | 'quote'
  | 'hr'
  | 'html'

/**
 * One atomic Markdown block. startLine/endLine are 1-based line numbers in the
 * original file, including the frontmatter lines (design §5.2).
 */
export interface MarkdownBlock {
  kind: BlockKind
  /** ATX heading level, only for kind === 'heading'. */
  level?: number
  startLine: number
  endLine: number
  /** Enclosing heading trail, outermost first; entries are heading texts. */
  headingPath: string[]
  text: string
}

/** A contiguous line range inside one source page. */
export interface PageSegment {
  startLine: number
  endLine: number
}

/** Versioned reference to one page (design §6 PageRef). */
export interface PageRef {
  pageId: string
  contentHash: string
  asOf?: string
}

/** A link occurrence parsed from a page, before target resolution. */
export interface RawLink {
  target: string
  alias?: string
  /** 1-based file line of the occurrence. */
  line: number
  source: LinkSource
}

/** A resolved graph edge. */
export interface PageLink {
  from: string
  to: string
  source: LinkSource
  /** 1-based file line for body edges; undefined for `related` edges. */
  line?: number
}

/** A link whose target is not a valid page of this library. */
export interface BrokenLink {
  from: string
  target: string
  source: LinkSource
  line?: number
  reason: 'unknown-page' | 'ambiguous-case' | 'unsafe-target'
}

/** Frontmatter scalar or list-of-scalars. */
export type FrontmatterValue = string | string[]

/** Validated subset of frontmatter fields the core actually consumes. */
export interface PageMeta {
  type: PageKind
  title: string
  domain?: string
  status?: string
  confidence?: string
  asOf?: string
  tags: string[]
  aliases: string[]
  related: string[]
  /** Every parsed frontmatter key; kept for provenance, never re-parsed elsewhere. */
  extra: Record<string, FrontmatterValue>
}

/** One immutable parsed page. */
export interface WikiPage extends PageRef {
  title: string
  kind: PageKind
  /** Absolute file path of the page. */
  path: string
  meta: PageMeta
  /** Body with frontmatter removed. */
  body: string
  /** 1-based file line of the first body line. */
  bodyStartLine: number
  /** Total line count of the original file. */
  totalLines: number
  blocks: readonly MarkdownBlock[]
  rawLinks: readonly RawLink[]
}

export type CorpusIssueCode =
  | 'missing-dir'
  | 'unreadable-file'
  | 'escaped-root'
  | 'missing-frontmatter'
  | 'malformed-frontmatter'
  | 'missing-type'
  | 'type-mismatch'
  | 'missing-title'
  | 'nested-dir-ignored'

export interface CorpusIssue {
  code: CorpusIssueCode
  /** Canonical page id when the file parsed far enough to have one. */
  pageId?: string
  path?: string
  message: string
}

export interface CorpusStats {
  /** .md files considered inside the five content dirs. */
  scanned: number
  /** Pages that passed metadata validation. */
  valid: number
  /** Pages rejected by metadata validation. */
  invalid: number
  /** Non-.md files, index/log pages and nested directories. */
  skipped: number
}

/**
 * One immutable library view. Every search, read and compile for a single
 * query/round takes exactly this object; nothing re-reads the disk behind it.
 */
export interface CorpusSnapshot {
  readonly root: string
  readonly revision: string
  readonly pages: ReadonlyMap<string, WikiPage>
  /** Sorted canonical page ids (case preserved). */
  readonly pageIds: readonly string[]
  readonly edges: readonly PageLink[]
  readonly brokenLinks: readonly BrokenLink[]
  readonly issues: readonly CorpusIssue[]
  readonly stats: CorpusStats
}

/** One retrieval candidate (design §6 RetrievalReport candidate). */
export interface Candidate {
  pageId: string
  title: string
  contentHash: string
  asOf?: string
  match: MatchKind
  /** For linked candidates: the direct hit that pulled this page in. */
  viaPageId?: string
  selected: boolean
  excludedReason?: ExcludedReason
  /** 命中依据: the query terms that matched, most informative first. */
  why: readonly string[]
  /** BM25 score for direct hits; 0 for linked-only candidates. */
  score: number
  /** 1-based ranking position among direct hits; 0 for linked candidates. */
  rank: number
  /** Block line ranges the compiler actually used (filled in by the compiler). */
  segments?: readonly PageSegment[]
}

/** A graph edge as reported to the UI (design §6 RetrievalReport.edges). */
export interface RetrievalEdge {
  from: string
  to: string
  source: LinkSource
}

/** Frozen-at-retrieval candidate report; never recomputed after the fact. */
export interface RetrievalReport {
  libraryRevision: string
  query: string
  hops: Hops
  candidates: Candidate[]
  edges: RetrievalEdge[]
}

/** One source page inside a frozen snapshot (design §6). */
export interface SnapshotSource extends PageRef {
  title: string
  segments: PageSegment[]
}

/** The frozen evidence snapshot that the panel previews and the host submits. */
export interface EvidenceSnapshot {
  snapshotId: string
  libraryRevision: string
  origin: EvidenceOrigin
  /** Production values are 4000 | 8000; tests may pass smaller numbers. */
  budgetChars: number
  sources: SnapshotSource[]
  text: string
  payloadHash: string
  chars: number
  report?: RetrievalReport
}

/** A page the compiler wanted but could not take. */
export interface DroppedPage {
  pageId: string
  title?: string
  reason: ExcludedReason
}

/** One block that could not fit the budget. */
export interface DroppedBlock {
  pageId: string
  startLine: number
  endLine: number
  reason: 'budget'
}

/** Result of compiling one selection with one budget. */
export interface CompileResult {
  text: string
  /** text.length — UTF-16 code units, same as the prototype (design §5.2). */
  chars: number
  payloadHash: string
  fits: boolean
  /** chars - budgetChars when negative-enough; 0 when it fits. */
  overBy: number
  sources: SnapshotSource[]
  dropped: DroppedPage[]
  droppedBlocks: DroppedBlock[]
  /** Requested page ids that are not valid pages of this corpus. */
  missing: string[]
  /** Report with selected/excludedReason/segments filled in, when one was passed. */
  report?: RetrievalReport
}
