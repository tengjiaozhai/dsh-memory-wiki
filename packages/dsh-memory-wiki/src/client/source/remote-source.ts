/**
 * Remote implementation of the seam.
 *
 * One place unwraps the RemoteResult (see ./unwrap.ts) and maps the server's
 * DTOs onto the panel's view model. Rules from review:
 *   - `draft.preview.text / chars` are passed through verbatim: the compiler
 *     runs on the server, the panel only displays (design §5.2).
 *   - Nothing is synthesised. A field the server does not send stays undefined
 *     and the UI says 未冻结/未提供; the client never re-assembles body text,
 *     re-counts characters or re-hashes a payload.
 *   - `PageDocument.bodyStartLine` is carried verbatim (D25). The client never
 *     derives it from frontmatter — the server parsed the file once, and a
 *     second parser here would let the two disagree silently.
 *   - No `as any` / `as unknown as`: every field is a contracts type or a core DTO.
 */
import type {
  ClearResult,
  DraftResult,
  OverrideResult,
  PageDocument,
  ReadPageResult,
  RemoteError,
  SearchResult,
  SessionView,
} from '../../shared/contracts.js'
import type { RetrievalReport } from '../../core/types.js'
import { RemoteCallError, unwrap } from './unwrap.js'
import type {
  MemoryWikiSource,
  PageView,
  ReadPageRequest,
  RemoteClient,
  ReviseRequest,
  RevisionRequest,
  SearchRequest,
  ViewRequest,
} from './types.js'

/**
 * Turn a structured business error into one readable line.
 *
 * D22: errors are fields, not exceptions. The *numbers* the user needs
 * (`expected`/`actual`, `overBy`) are rendered here verbatim — the panel then
 * adds the action hint from `error-hints.ts`.
 */
export function errorDetail(error: RemoteError): string {
  switch (error.code) {
    case 'stale-revision':
      return '面板带着 revision ' + error.expected + ' 发起写操作，服务端已是 ' + error.actual
    case 'unknown-page':
      return '页面不在当前知识库：' + error.pageId
    case 'library-changed':
      return (
        '准备之后知识库版本变了（期望 ' + error.expected.slice(0, 12) + '，实际 ' + error.actual.slice(0, 12) + '）'
      )
    case 'page-version-mismatch':
      return (
        error.pageId +
        ' 的内容已变化（期望 ' +
        error.expected.slice(0, 12) +
        '，实际 ' +
        error.actual.slice(0, 12) +
        '）'
      )
    case 'manual-over-budget':
      return (
        '超出 ' + error.overBy + ' 字符（预算 ' + error.budgetChars + '，选中 ' + error.selectedChars + '）'
      )
    case 'nothing-selected':
      return '当前没有选中任何页面'
    case 'unknown-session':
      return '会话不存在或无权访问：' + error.sessionId
    default:
      return '服务端返回未知错误'
  }
}

/** `PageDocument` → panel page. Line offsets are passed through, never derived. */
function pageView(page: PageDocument): PageView {
  return {
    pageId: page.pageId,
    title: page.title,
    kind: page.kind,
    contentHash: page.contentHash,
    ...(page.asOf === undefined ? {} : { asOf: page.asOf }),
    body: page.body,
    bodyStartLine: page.bodyStartLine,
    totalLines: page.totalLines,
    ...(page.truncated ? { truncated: true, limitChars: page.limitChars, fullChars: page.fullChars } : {}),
  }
}

export function createRemoteSource(client: RemoteClient | undefined, reason: string): MemoryWikiSource {
  const requireClient = (): RemoteClient => {
    if (client === undefined) throw new RemoteCallError('not-wired', 'remote source not wired (' + reason + ')')
    return client
  }

  return {
    mode: 'remote',

    /** `SessionView` → view model. Field-for-field, no recomputation. */
    async getView(request: ViewRequest) {
      const wired = requireClient()
      // B1 / D26: a read never carries a revision. Only writes are pinned.
      const view = unwrap<SessionView>(await wired.getView({ sessionId: request.sessionId }))
      return {
        revision: view.revision,
        mode: view.mode,
        budgetChars: view.budgetChars,
        hops: view.hops,
        draft: view.draft,
        prepared: view.prepared,
        currentTurn: view.currentTurn,
        skippedReason: view.skippedReason,
        error: view.error,
      }
    },

    /** `SearchResult` → `RetrievalReport`. Candidate/edge arrays are core DTOs. */
    async search(request: SearchRequest) {
      const result = unwrap<SearchResult>(
        await requireClient().search({
          query: request.query,
          hops: request.hops,
          ...(request.sessionId === null || request.sessionId === undefined
            ? {}
            : { sessionId: request.sessionId }),
        }),
      )
      if (result.error !== undefined) {
        throw new RemoteCallError(result.error.code, errorDetail(result.error))
      }
      const report: RetrievalReport = {
        libraryRevision: result.libraryRevision,
        query: result.query,
        hops: result.hops,
        candidates: result.candidates,
        edges: result.edges,
      }
      return report
    },

    /**
     * `PageDocument` → `PageView`.
     *
     * `bodyStartLine` arrives as a file line (D25) and is kept as-is, so the
     * segment labels in "本轮依据" and the body shown here share one coordinate
     * system. `confidence` has no home in `PageDocument`, so it stays undefined
     * and the detail pane says 未提供 rather than inventing one.
     */
    async readPage(request: ReadPageRequest) {
      const result = unwrap<ReadPageResult>(
        await requireClient().readPage({
          pageId: request.pageId,
          ...(request.contentHash === undefined ? {} : { contentHash: request.contentHash }),
          ...(request.sessionId === null || request.sessionId === undefined
            ? {}
            : { sessionId: request.sessionId }),
        }),
      )
      if (result.page === undefined) {
        const error = result.error
        if (error === undefined) {
          throw new RemoteCallError('unknown-page', 'readPage returned no page for ' + request.pageId)
        }
        throw new RemoteCallError(error.code, errorDetail(error))
      }
      return pageView(result.page)
    },

    /**
     * Replace the server-owned draft with this selection.
     *
     * The result is returned whole (including `error`): a rejected revise still
     * carries the server's new mode and revision, and swallowing that would make
     * the panel show a state the server no longer has (D22).
     */
    async reviseDraft(request: ReviseRequest): Promise<DraftResult> {
      return unwrap<DraftResult>(await requireClient().reviseDraft(request))
    },

    /** Freeze the draft for the next human turn; preparing never commits (design §8.1). */
    async prepareOverride(request: RevisionRequest): Promise<OverrideResult> {
      return unwrap<OverrideResult>(await requireClient().prepareOverride(request))
    },

    /** Drop a still-unconsumed override and return to automatic. */
    async clearOverride(request: RevisionRequest): Promise<ClearResult> {
      return unwrap<ClearResult>(await requireClient().clearOverride(request))
    },
  }
}
