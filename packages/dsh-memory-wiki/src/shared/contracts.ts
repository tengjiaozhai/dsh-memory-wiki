/**
 * shared/contracts.ts — the host-facing Remote DTOs plus the producer metadata.
 *
 * No hand-written schema: strict codecs are GENERATED from these types by
 * @deepseek-ai/dsh-typert-generator (design §9.3). Core DTOs are imported, never
 * re-declared (Lead decision D3) — core/types.ts stays the single TS source.
 *
 * Every method returns a discriminated `error` field instead of throwing:
 * Rust-free, JSON-safe, and the panel can act on `overBy` / `expected+actual`
 * without parsing prose (design §8.2 / P3b brief).
 */
import type {
  BudgetChars,
  Candidate,
  EvidenceSnapshot,
  Hops,
  PageKind,
  PageLink,
  PageRef,
  PageSegment,
  RetrievalEdge,
  RetrievalReport,
} from '../core/types.js'

/** Panel presentation state (design §6 `mode`). */
export type SessionMode = 'automatic' | 'manual-ready' | 'manual-invalid'

/**
 * Machine-readable failure vocabulary. Codes are stable; fields carry the
 * numbers the caller needs to recover (no bare strings).
 */
export type RemoteError =
  | { code: 'unknown-session', sessionId: string }
  | { code: 'stale-revision', expected: number, actual: number }
  | { code: 'nothing-selected' }
  | { code: 'unknown-page', pageId: string }
  | { code: 'library-changed', expected: string, actual: string }
  | { code: 'page-version-mismatch', pageId: string, expected: string, actual: string }
  | { code: 'manual-over-budget', overBy: number, budgetChars: number, selectedChars: number }
  | { code: 'no-usable-block', pageIds: string[] }
  | { code: 'wiki-unavailable', reason: 'not-configured' | 'read-failed' }
  | { code: 'capture-unavailable' }
  | { code: 'capture-record-unavailable' }
  | { code: 'capture-invalid-query', field: 'limit' | 'cursor' | 'status' | 'event-seq' }

// ---------------------------------------------------------------- graph

/** Library browsing is independent of conversation state. */
export interface GraphInput {}

export interface GraphPage {
  pageId: string
  title: string
  kind: PageKind
  contentHash: string
  asOf?: string
}

/** Full library metadata and real links; never a retrieval candidate report. */
export interface GraphResult {
  libraryRevision: string
  pages: GraphPage[]
  edges: PageLink[]
  brokenLinks: number
  error?: RemoteError
}

// ---------------------------------------------------------------- getView

/**
 * Request of `memoryWiki/view`.
 *
 * `expectedRevision` is OPTIONAL on purpose: "the panel opened and has nothing
 * yet" and "I require exactly revision N" are different requests.
 *   - omitted  → read the current state, no staleness check (first open / after
 *                reconnect the client has no revision to send; it must not be
 *                forced to invent one).
 *   - provided → optimistic concurrency: a stale value fails with
 *                `{code:'stale-revision', expected, actual}` and changes nothing.
 * Write methods (`reviseDraft`/`prepareOverride`/`clearOverride`) keep it
 * REQUIRED: a mutation must be pinned to the state the user was looking at.
 */
export interface GetViewInput {
  /** Client-visible session reference; the server re-resolves it (never trusted). */
  sessionId: string
  /** Revision the client already shows. Omit to read the current state. */
  expectedRevision?: number
}

/** One page's compiled fragment boundary (1-based lines, frontmatter included). */
export interface DraftPreview {
  /** The exact text the panel shows. `prepareOverride` freezes THIS string. */
  text: string
  chars: number
  /** Hash of `text`; the prepared snapshot reuses it verbatim (design §5.2). */
  payloadHash: string
  fits: boolean
  overBy: number
  sources: Array<{ pageId: string, title: string, contentHash: string, segments: PageSegment[] }>
}

/** The panel's editable selection (server-owned; the client only proposes). */
export interface DraftState {
  query: string
  libraryRevision: string
  selectedPages: PageRef[]
  budgetChars: BudgetChars
  hops: Hops
  preview: DraftPreview
}

/** Per-turn record surfaced to the panel (design §6 `currentTurn`). */
export interface TurnView {
  turn: number
  phase: string
  snapshotId?: string
  payloadHash?: string
  committedSeq?: number
  reInjections: number
}

/** Response of `memoryWiki/view`. */
export interface CaptureView {
  jobId: string
  phase: 'queued' | 'judging' | 'preparing' | 'verifying' | 'publishing' | 'ingested' | 'skipped' | 'deferred' | 'failed' | 'needs_attention'
  reason: string
  pages: string[]
  updatedAt: string
  evidence?: Array<{ seq: number; kind: string; text: string; truncated: boolean }>
  evidenceTruncated?: boolean
  changes?: Array<{ path: string; beforeHash?: string; afterHash: string }>
  limitations?: string[]
}

// ---------------------------------------------------------------- capture history

export type CaptureHistoryStatus = 'processing' | 'ingested' | 'skipped' | 'deferred' | 'error'
export type CaptureJudgmentStage = 'assessment' | 'verification'
export interface CaptureIssue {
  at: string
  stage: 'collecting' | 'worker_lock' | 'journal_write'
  code: string
  message: string
  persisted: boolean
  turnEndSeq?: number
  jobId?: string
}
export interface CaptureStatusInput { sessionId?: string }
export interface CaptureStatusResult {
  collector: 'disabled' | 'starting' | 'ready' | 'blocked'
  history: 'readable' | 'degraded' | 'unavailable'
  reasonCode: string
  reason: string
  lastIssue?: CaptureIssue
  error?: RemoteError
}
export interface CaptureHistoryInput { sessionId: string; cursor?: string; limit?: number; status?: CaptureHistoryStatus }
export interface CaptureRecordInput { sessionId: string; jobId: string; afterEventSeq?: number; limit?: number }
export interface CaptureJudgmentInput { sessionId: string; jobId: string; judgmentId: string }
export interface CaptureQuestion {
  id: string
  type: 'choice' | 'noul'
  text: string
  options?: Array<{ value: string; description: string }>
}
export type CaptureAnswer =
  | { id: string; type: 'choice'; choice: string; confidence: number; probabilities: Array<{ option: string; probability: number }> }
  | { id: string; type: 'noul'; value: number }
export interface CaptureGate {
  id: string
  questionId?: string
  description: string
  operator: 'gte' | 'eq'
  actual: string | number | boolean
  expected: string | number | boolean
  passed: boolean
}
export type CaptureDecision = {
  kind: 'decision'
  answers: CaptureAnswer[]
  gateResults: CaptureGate[]
  disposition: 'prepare' | 'publish' | 'skipped' | 'deferred'
  reasonCode: string
  reason: string
  usage?: { inputTokens: number | null; outputTokens: number | null }
  requestId?: string
} | { kind: 'error'; error: { category: string; message: string; httpStatus?: number } }
export interface CaptureJudgmentRecord {
  id: string
  stage: CaptureJudgmentStage
  attempt: number
  model: string
  rubricVersion: string
  requestHash: string
  evidenceHash: string
  patchHash?: string
  questions: CaptureQuestion[]
  result?: CaptureDecision
}
export interface CaptureEvent {
  seq: number
  at: string
  kind: 'registered' | 'phase_changed' | 'judgment_started' | 'judgment_finished' | 'judgment_failed' | 'judgment_interrupted' | 'recovery_started' | 'publication_finished' | 'publication_interrupted' | 'operation_failed' | 'legacy_snapshot'
  phase?: CaptureView['phase']
  reason?: string
  judgmentId?: string
  stage?: CaptureView['phase']
  error?: { category: string; message: string }
  durationMs?: number
}
export interface CaptureJudgmentSummary {
  id: string
  stage: CaptureJudgmentStage
  attempt: number
  model: string
  state: 'started' | 'completed' | 'failed' | 'interrupted'
  startedAt: string
  finishedAt?: string
  durationMs?: number
  disposition?: 'prepare' | 'publish' | 'skipped' | 'deferred'
  reason?: string
}
export interface CaptureSummary {
  jobId: string
  phase: CaptureView['phase']
  reason: string
  pages: string[]
  updatedAt: string
  registeredAt?: string
  historyCoverage: 'complete' | 'legacy_snapshot'
  origin: { sessionId: string; turn: number; turnStartSeq: number; turnEndSeq: number }
  task: string
  taskTruncated: boolean
  evidenceHash: string
  rubricVersion: string
  rulesHash?: string
  patchHash?: string
  lastEventSeq: number
  publicationUncertain?: boolean
  retryable?: boolean
  judgments: CaptureJudgmentSummary[]
}
export interface CaptureHistoryResult {
  items: CaptureSummary[]
  nextCursor?: string
  readCompleteness: 'complete' | 'partial'
  error?: RemoteError
}
export interface CaptureRecordResult {
  summary?: CaptureSummary
  events: CaptureEvent[]
  judgments: CaptureJudgmentSummary[]
  nextEventSeq?: number
  evidence: Array<{ seq: number; kind: string; text: string; truncated: boolean }>
  evidenceTruncated: boolean
  limitations: string[]
  changes: Array<{ path: string; beforeHash?: string; afterHash: string }>
  error?: RemoteError
}
export interface CaptureJudgmentResult {
  judgment?: CaptureJudgmentRecord
  lifecycle?: CaptureJudgmentSummary
  error?: RemoteError
}

export interface SessionView {
  revision: number
  mode: SessionMode
  budgetChars: BudgetChars
  hops: Hops
  draft?: DraftState
  prepared?: EvidenceSnapshot
  currentTurn?: TurnView
  capture?: CaptureView
  skippedReason?: string
  error?: RemoteError
}

// ---------------------------------------------------------------- search

/** Request of `memoryWiki/search` (read-only: no revision guard needed). */
export interface SearchInput {
  sessionId: string
  query: string
  hops: Hops
}

/** Response of `memoryWiki/search`: the frozen candidate report. */
export interface SearchResult {
  revision: number
  libraryRevision: string
  query: string
  hops: Hops
  candidates: Candidate[]
  edges: RetrievalEdge[]
  error?: RemoteError
}

// ---------------------------------------------------------------- readPage

/** Request of `memoryWiki/readPage`. */
export interface ReadPageInput {
  pageId: string
  /** When present, a page whose content hash differs is rejected rather than shown. */
  contentHash?: string
}

/** One page as read from the current library. */
export interface PageDocument {
  pageId: string
  title: string
  kind: PageKind
  contentHash: string
  asOf?: string
  /**
   * Markdown body (frontmatter removed). When `truncated` is true this is a
   * prefix cut on a line boundary — never present it as the whole page.
   */
  body: string
  totalLines: number
  /**
   * 1-based **file** line of the first body line (frontmatter lines included).
   * The server parses frontmatter, so this offset is derived here exactly once
   * (design §4.2); clients must never recompute it.
   */
  bodyStartLine: number
  /** UTF-16 code units of `body` (the returned slice). */
  bodyChars: number
  /** UTF-8 bytes of `body` (the returned slice). */
  bodyBytes: number
  /** UTF-16 code units of the FULL body, for a "read the rest" affordance. */
  fullChars: number
  /** True when the page body exceeded the server threshold and was cut. */
  truncated: boolean
  /** Server threshold that produced `truncated` (UTF-16 code units). */
  limitChars: number
}

/** Response of `memoryWiki/readPage`. */
export interface ReadPageResult {
  page?: PageDocument
  error?: RemoteError
}

// ---------------------------------------------------------------- reviseDraft

/** One page the user wants in the draft, with the version they saw. */
export interface DraftSelection {
  pageId: string
  contentHash: string
}

/** Request of `memoryWiki/reviseDraft`. */
export interface ReviseDraftInput {
  sessionId: string
  expectedRevision: number
  query: string
  selectedPages: DraftSelection[]
  budgetChars: BudgetChars
  hops: Hops
}

/** Response of `memoryWiki/reviseDraft`. */
export interface DraftResult {
  revision: number
  mode: SessionMode
  draft?: DraftState
  error?: RemoteError
}

// ---------------------------------------------------------------- override

/** Request of `memoryWiki/prepareOverride`. */
export interface PrepareOverrideInput {
  sessionId: string
  expectedRevision: number
}

/** Response of `memoryWiki/prepareOverride` (prepared ≠ applied; design §8.1). */
export interface OverrideResult {
  revision: number
  mode: SessionMode
  prepared?: EvidenceSnapshot
  error?: RemoteError
}

/** Request of `memoryWiki/clearOverride`. */
export interface ClearOverrideInput {
  sessionId: string
  expectedRevision: number
}

/** Response of `memoryWiki/clearOverride`. */
export interface ClearResult {
  revision: number
  mode: SessionMode
  error?: RemoteError
}

// ------------------------------------------------- producer metadata

/**
 * Producer identity declared into the host's MessageSourceMap.
 * `kind` is the merge key; the rest is the provenance that must survive a cold
 * reload so an old turn never has to be re-searched to render it.
 */
export interface MemoryWikiSourceMeta {
  kind: 'memory-wiki'
  snapshotId: string
  payloadHash: string
  libraryRevision: string
  chars: number
  turnStartSeq?: number
}
