/**
 * The data-source seam.
 *
 * P3a bound the panel directly to `__fixtures__`; this interface is the one
 * place where the panel meets its data, so P3b only swaps the implementation.
 *
 * Rules kept here on purpose:
 *   - Method payloads are core/types DTOs (RetrievalReport / CompileResult /
 *     EvidenceSnapshot / WikiPage). No field is invented.
 *   - The containers below (MemoryWikiView) are *indexes over DTOs* for one
 *     render, not DTO variants: every field either is a DTO or is the view
 *     revision the request must echo back.
 *   - No timestamp-like or caption-like field: if a value has no DTO home it
 *     does not travel through this seam.
 */
import type {
  BudgetChars,
  CompileResult,
  EvidenceSnapshot,
  Hops,
  RetrievalReport,
  WikiPage,
} from '../../core/types.js'
import type {
  ClearResult,
  CaptureView,
  DraftResult,
  DraftSelection,
  DraftState,
  OverrideResult,
  RemoteError,
  SessionMode,
  TurnView,
} from '../../shared/contracts.js'

/** Which implementation the panel is talking to. */
export type SourceMode = 'fixture' | 'remote'

/**
 * Selection preset the panel can ask for. P3a/P3b-fixture knobs; the real
 * Remote treats server state as authority and maps these onto its own
 * draft/override state instead.
 */
export type SelectionKind = 'auto1' | 'auto0' | 'manual'

export type BudgetOption = BudgetChars

export interface ViewRequest {
  /** Authorised session the view belongs to. The client never sends a principal. */
  sessionId: string | null
  /**
   * B1 / D26: reads carry NO revision.
   *
   * A read must never be able to fail with `stale-revision` (that would let a
   * plain getView reject a draft/prepared state the server already owns), so the
   * field is absent from this type entirely. Only writes are pinned; see
   * `RevisionRequest`.
   */
  preset?: SelectionKind
  budget?: BudgetOption
}

/**
 * Everything one panel render needs, as DTOs plus the view revision.
 * `current` is the this-turn snapshot; `history` is append-only frozen snapshots.
 */
export interface MemoryWikiView {
  revision: number
  /**
   * Fixture-shaped fields (pre-P3b). They disappear once the panel is switched
   * to the server view; the remote implementation never fills them.
   */
  libraryRevision?: string
  report?: RetrievalReport
  compile?: CompileResult
  current?: EvidenceSnapshot
  history?: EvidenceSnapshot[]

  /**
   * Server-authoritative view. These are the `SessionView` fields, passed
   * through unchanged — no client-side recomputation, no synthesised values.
   */
  mode?: SessionMode
  budgetChars?: BudgetOption
  hops?: Hops
  draft?: DraftState
  prepared?: EvidenceSnapshot
  currentTurn?: TurnView
  capture?: CaptureView
  skippedReason?: string
  error?: RemoteError
}

export interface SearchRequest {
  query: string
  hops: Hops
  /** Authorised session (Remote only; the fixture has none and ignores it). */
  sessionId?: string | null
}

export interface ReadPageRequest {
  /** Canonical page id from the corpus (case preserved). */
  pageId: string
  /** Version the client expects; a changed page must be reported, not silently swapped. */
  contentHash?: string
  /** Authorised session (Remote only; the fixture has none and ignores it). */
  sessionId?: string | null
}

/**
 * One page as the panel renders it — an *index* over the two authoritative
 * shapes, never a third definition:
 *   - fixture: core `WikiPage` (fields picked below, `meta.confidence` lifted)
 *   - remote:  `PageDocument` from shared/contracts
 *
 * `bodyStartLine` is the 1-based **file** line of the first body line, carried
 * verbatim from whichever source answered (D25). The client does not count
 * frontmatter lines and does not rebase ranges: a segment printed in "本轮依据"
 * and the same segment in "整页正文" must resolve to the same file line.
 */
export type PageView = Pick<
  WikiPage,
  'pageId' | 'title' | 'kind' | 'contentHash' | 'asOf' | 'body' | 'bodyStartLine' | 'totalLines'
> & {
  /** Frontmatter `confidence`; PageDocument does not carry it, so remote pages show 未提供. */
  confidence?: string
  /** Remote only: body was cut on a line boundary (never present as the whole page). */
  truncated?: boolean
  limitChars?: number
  fullChars?: number
}

/**
 * The only surface the panel is allowed to know.
 */
/**
 * A write the panel asks the server to perform.
 *
 * `expectedRevision` is REQUIRED (D26): a mutation must be pinned to the state
 * the user was looking at. The client never replays a write with a revision it
 * did not display, which is what makes `stale-revision` meaningful.
 */
export interface RevisionRequest {
  sessionId: string
  expectedRevision: number
}

export interface ReviseRequest extends RevisionRequest {
  query: string
  selectedPages: DraftSelection[]
  budgetChars: BudgetOption
  hops: Hops
}

export interface MemoryWikiSource {
  readonly mode: SourceMode
  getView(request: ViewRequest): Promise<MemoryWikiView>
  search(request: SearchRequest): Promise<RetrievalReport>
  readPage(request: ReadPageRequest): Promise<PageView>
  /**
   * Writes are optional on the seam: the fixture has no server state and must
   * not pretend to. The panel hides the hand-selection controls when they are
   * absent instead of faking a successful write.
   */
  reviseDraft?(request: ReviseRequest): Promise<DraftResult>
  prepareOverride?(request: RevisionRequest): Promise<OverrideResult>
  clearOverride?(request: RevisionRequest): Promise<ClearResult>
}

/**
 * Shape the P3b Remote client must satisfy once the host codec is wired.
 *
 * The generated client is mounted by the host (imported inside the panel); this
 * interface is the adapter contract, deliberately smaller than the generated
 * surface so the panel never depends on transport details.
 */
/**
 * Transport contract: every method resolves the generated client's
 * `RemoteResult` envelope and is typed `unknown` on purpose — `unwrap()` is
 * the single place that decides what a failure means.
 */
export interface RemoteClient {
  /** Read path: no revision (B1). Writes use `RevisionRequest` below. */
  getView(request: { sessionId: string | null }): Promise<unknown>
  search(request: SearchRequest): Promise<unknown>
  readPage(request: ReadPageRequest): Promise<unknown>
  reviseDraft(request: ReviseRequest): Promise<unknown>
  prepareOverride(request: RevisionRequest): Promise<unknown>
  clearOverride(request: RevisionRequest): Promise<unknown>
}