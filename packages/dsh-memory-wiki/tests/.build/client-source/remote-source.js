                                                                                                                                                                                                                         
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
             
              
              
              
                 
               
                 
              
               
              
                                  
                                                          
import { RemoteCallError, unwrap } from './unwrap.js'
             
                   
           
                  
               
                
                  
                
              
                   

/**
 * Turn a structured business error into one readable line.
 *
 * D22: errors are fields, not exceptions. The *numbers* the user needs
 * (`expected`/`actual`, `overBy`) are rendered here verbatim — the panel then
 * adds the action hint from `error-hints.ts`.
 */
export function errorDetail(error             )         {
  switch (error.code) {
    case 'capture-unavailable': return '暂时无法读取沉淀记录，请检查本地存储后重试。'
    case 'capture-record-unavailable': return '记录不存在或不属于当前会话。'
    case 'capture-invalid-query': return '记录查询参数无效：' + error.field
    case 'wiki-unavailable':
      return error.reason === 'not-configured'
        ? '尚未设置 Wiki 路径，请在插件设置中配置 wikiRoot。'
        : '暂时无法读取 Wiki，请检查配置的目录是否可访问后重试。'
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
function pageView(page              )           {
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

export function createRemoteSource(client                          , reason        )                   {
  const requireClient = ()               => {
    if (client === undefined) throw new RemoteCallError('not-wired', 'remote source not wired (' + reason + ')')
    return client
  }

  return {
    mode: 'remote',
    async captureStatus(input                    ) {
      const result = unwrap                     (await requireClient().captureStatus(input))
      if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error))
      return result
    },
    async captureHistory(input                     ) {
      const result = unwrap                      (await requireClient().captureHistory(input))
      if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error))
      return result
    },
    async captureRecord(input                    ) {
      const result = unwrap                     (await requireClient().captureRecord(input))
      if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error))
      return result
    },
    async captureJudgment(input                      ) {
      const result = unwrap                       (await requireClient().captureJudgment(input))
      if (result.error) throw new RemoteCallError(result.error.code, errorDetail(result.error))
      return result
    },


    async getGraph() {
      const result = unwrap             (await requireClient().graph({}))
      if (result.error !== undefined) throw new RemoteCallError(result.error.code, errorDetail(result.error))
      return result
    },

    /** `SessionView` → view model. Field-for-field, no recomputation. */
    async getView(request             ) {
      const wired = requireClient()
      // B1 / D26: a read never carries a revision. Only writes are pinned.
      const view = unwrap             (await wired.getView({ sessionId: request.sessionId }))
      return {
        revision: view.revision,
        mode: view.mode,
        budgetChars: view.budgetChars,
        hops: view.hops,
        draft: view.draft,
        prepared: view.prepared,
        currentTurn: view.currentTurn,
        capture: view.capture,
        skippedReason: view.skippedReason,
        error: view.error,
      }
    },

    /** `SearchResult` → `RetrievalReport`. Candidate/edge arrays are core DTOs. */
    async search(request               ) {
      const result = unwrap              (
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
      const report                  = {
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
    async readPage(request                 ) {
      const result = unwrap                (
        await requireClient().readPage({
          pageId: request.pageId,
          ...(request.contentHash === undefined ? {} : { contentHash: request.contentHash }),
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
    async reviseDraft(request               )                       {
      return unwrap             (await requireClient().reviseDraft(request))
    },

    /** Freeze the draft for the next human turn; preparing never commits (design §8.1). */
    async prepareOverride(request                 )                          {
      return unwrap                (await requireClient().prepareOverride(request))
    },

    /** Drop a still-unconsumed override and return to automatic. */
    async clearOverride(request                 )                       {
      return unwrap             (await requireClient().clearOverride(request))
    },
  }
}
