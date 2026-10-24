//#region src/core/types.d.ts
/**
 * core/types.ts — shared, host-agnostic DTOs for the read-only core.
 *
 * Nothing here imports DSH. The only DTO that leaves this package (via the
 * typed Remote in P3) is EvidenceSnapshot / RetrievalReport; the rest are
 * internal-core types. Field names follow design/dsh-memory-wiki.md §6.
 */
/** Page categories, one per scanned directory. */
type PageKind = 'source' | 'entity' | 'concept' | 'synthesis' | 'output';
/** Snapshot budget presets (design §2: 4,000 / 8,000 chars). */
type BudgetChars = 4000 | 8000;
/** Who decided the selection. */
type EvidenceOrigin = 'automatic' | 'manual';
/** Retrieval relation of a candidate to the query. */
type MatchKind = 'direct' | 'linked';
/** Why a candidate page did not make it into the snapshot. */
type ExcludedReason = 'budget' | 'no-usable-block' | 'not-selected';
/** Which part of the page produced a link. */
type LinkSource = 'body' | 'related';
/** Hop count for the link-graph expansion (design §4.3: default 1, UI may narrow to 0). */
type Hops = 0 | 1;
/** A contiguous line range inside one source page. */
interface PageSegment {
  startLine: number;
  endLine: number;
}
/** Versioned reference to one page (design §6 PageRef). */
interface PageRef {
  pageId: string;
  contentHash: string;
  asOf?: string;
}
/** One retrieval candidate (design §6 RetrievalReport candidate). */
interface Candidate {
  pageId: string;
  title: string;
  contentHash: string;
  asOf?: string;
  match: MatchKind;
  /** For linked candidates: the direct hit that pulled this page in. */
  viaPageId?: string;
  selected: boolean;
  excludedReason?: ExcludedReason;
  /** 命中依据: the query terms that matched, most informative first. */
  why: readonly string[];
  /** BM25 score for direct hits; 0 for linked-only candidates. */
  score: number;
  /** 1-based ranking position among direct hits; 0 for linked candidates. */
  rank: number;
  /** Block line ranges the compiler actually used (filled in by the compiler). */
  segments?: readonly PageSegment[];
}
/** A graph edge as reported to the UI (design §6 RetrievalReport.edges). */
interface RetrievalEdge {
  from: string;
  to: string;
  source: LinkSource;
}
/** Frozen-at-retrieval candidate report; never recomputed after the fact. */
interface RetrievalReport {
  libraryRevision: string;
  query: string;
  hops: Hops;
  candidates: Candidate[];
  edges: RetrievalEdge[];
}
/** One source page inside a frozen snapshot (design §6). */
interface SnapshotSource extends PageRef {
  title: string;
  segments: PageSegment[];
}
/** The frozen evidence snapshot that the panel previews and the host submits. */
interface EvidenceSnapshot {
  snapshotId: string;
  libraryRevision: string;
  origin: EvidenceOrigin;
  /** Production values are 4000 | 8000; tests may pass smaller numbers. */
  budgetChars: number;
  sources: SnapshotSource[];
  text: string;
  payloadHash: string;
  chars: number;
  report?: RetrievalReport;
}
//#endregion
//#region src/shared/contracts.d.ts
/** Panel presentation state (design §6 `mode`). */
type SessionMode = 'automatic' | 'manual-ready' | 'manual-invalid';
/**
 * Machine-readable failure vocabulary. Codes are stable; fields carry the
 * numbers the caller needs to recover (no bare strings).
 */
type RemoteError = {
  code: 'unknown-session';
  sessionId: string;
} | {
  code: 'stale-revision';
  expected: number;
  actual: number;
} | {
  code: 'nothing-selected';
} | {
  code: 'unknown-page';
  pageId: string;
} | {
  code: 'library-changed';
  expected: string;
  actual: string;
} | {
  code: 'page-version-mismatch';
  pageId: string;
  expected: string;
  actual: string;
} | {
  code: 'manual-over-budget';
  overBy: number;
  budgetChars: number;
  selectedChars: number;
} | {
  code: 'no-usable-block';
  pageIds: string[];
};
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
interface GetViewInput {
  /** Client-visible session reference; the server re-resolves it (never trusted). */
  sessionId: string;
  /** Revision the client already shows. Omit to read the current state. */
  expectedRevision?: number;
}
/** One page's compiled fragment boundary (1-based lines, frontmatter included). */
interface DraftPreview {
  /** The exact text the panel shows. `prepareOverride` freezes THIS string. */
  text: string;
  chars: number;
  /** Hash of `text`; the prepared snapshot reuses it verbatim (design §5.2). */
  payloadHash: string;
  fits: boolean;
  overBy: number;
  sources: Array<{
    pageId: string;
    title: string;
    contentHash: string;
    segments: PageSegment[];
  }>;
}
/** The panel's editable selection (server-owned; the client only proposes). */
interface DraftState {
  query: string;
  libraryRevision: string;
  selectedPages: PageRef[];
  budgetChars: BudgetChars;
  hops: Hops;
  preview: DraftPreview;
}
/** Per-turn record surfaced to the panel (design §6 `currentTurn`). */
interface TurnView {
  turn: number;
  phase: string;
  snapshotId?: string;
  payloadHash?: string;
  committedSeq?: number;
  reInjections: number;
}
/** Response of `memoryWiki/view`. */
interface CaptureView {
  jobId: string;
  phase: 'queued' | 'judging' | 'preparing' | 'verifying' | 'publishing' | 'ingested' | 'skipped' | 'deferred' | 'failed' | 'needs_attention';
  reason: string;
  pages: string[];
  updatedAt: string;
  evidence?: Array<{
    seq: number;
    kind: string;
    text: string;
    truncated: boolean;
  }>;
  evidenceTruncated?: boolean;
  changes?: Array<{
    path: string;
    beforeHash?: string;
    afterHash: string;
  }>;
  limitations?: string[];
}
interface SessionView {
  revision: number;
  mode: SessionMode;
  budgetChars: BudgetChars;
  hops: Hops;
  draft?: DraftState;
  prepared?: EvidenceSnapshot;
  currentTurn?: TurnView;
  capture?: CaptureView;
  skippedReason?: string;
  error?: RemoteError;
}
/** Request of `memoryWiki/search` (read-only: no revision guard needed). */
interface SearchInput {
  sessionId: string;
  query: string;
  hops: Hops;
}
/** Response of `memoryWiki/search`: the frozen candidate report. */
interface SearchResult {
  revision: number;
  libraryRevision: string;
  query: string;
  hops: Hops;
  candidates: Candidate[];
  edges: RetrievalEdge[];
  error?: RemoteError;
}
/** Request of `memoryWiki/readPage`. */
interface ReadPageInput {
  sessionId: string;
  pageId: string;
  /** When present, a page whose content hash differs is rejected rather than shown. */
  contentHash?: string;
}
/** One page as read from the current library. */
interface PageDocument {
  pageId: string;
  title: string;
  kind: PageKind;
  contentHash: string;
  asOf?: string;
  /**
   * Markdown body (frontmatter removed). When `truncated` is true this is a
   * prefix cut on a line boundary — never present it as the whole page.
   */
  body: string;
  totalLines: number;
  /**
   * 1-based **file** line of the first body line (frontmatter lines included).
   * The server parses frontmatter, so this offset is derived here exactly once
   * (design §4.2); clients must never recompute it.
   */
  bodyStartLine: number;
  /** UTF-16 code units of `body` (the returned slice). */
  bodyChars: number;
  /** UTF-8 bytes of `body` (the returned slice). */
  bodyBytes: number;
  /** UTF-16 code units of the FULL body, for a "read the rest" affordance. */
  fullChars: number;
  /** True when the page body exceeded the server threshold and was cut. */
  truncated: boolean;
  /** Server threshold that produced `truncated` (UTF-16 code units). */
  limitChars: number;
}
/** Response of `memoryWiki/readPage`. */
interface ReadPageResult {
  revision: number;
  page?: PageDocument;
  error?: RemoteError;
}
/** One page the user wants in the draft, with the version they saw. */
interface DraftSelection {
  pageId: string;
  contentHash: string;
}
/** Request of `memoryWiki/reviseDraft`. */
interface ReviseDraftInput {
  sessionId: string;
  expectedRevision: number;
  query: string;
  selectedPages: DraftSelection[];
  budgetChars: BudgetChars;
  hops: Hops;
}
/** Response of `memoryWiki/reviseDraft`. */
interface DraftResult {
  revision: number;
  mode: SessionMode;
  draft?: DraftState;
  error?: RemoteError;
}
/** Request of `memoryWiki/prepareOverride`. */
interface PrepareOverrideInput {
  sessionId: string;
  expectedRevision: number;
}
/** Response of `memoryWiki/prepareOverride` (prepared ≠ applied; design §8.1). */
interface OverrideResult {
  revision: number;
  mode: SessionMode;
  prepared?: EvidenceSnapshot;
  error?: RemoteError;
}
/** Request of `memoryWiki/clearOverride`. */
interface ClearOverrideInput {
  sessionId: string;
  expectedRevision: number;
}
/** Response of `memoryWiki/clearOverride`. */
interface ClearResult {
  revision: number;
  mode: SessionMode;
  error?: RemoteError;
}
/**
 * Producer identity declared into the host's MessageSourceMap.
 * `kind` is the merge key; the rest is the provenance that must survive a cold
 * reload so an old turn never has to be re-searched to render it.
 */
interface MemoryWikiSourceMeta {
  kind: 'memory-wiki';
  snapshotId: string;
  payloadHash: string;
  libraryRevision: string;
  chars: number;
  turnStartSeq?: number;
}
//#endregion
export { CaptureView, ClearOverrideInput, ClearResult, DraftPreview, DraftResult, DraftSelection, DraftState, GetViewInput, MemoryWikiSourceMeta, OverrideResult, PageDocument, PrepareOverrideInput, ReadPageInput, ReadPageResult, RemoteError, ReviseDraftInput, SearchInput, SearchResult, SessionMode, SessionView, TurnView };