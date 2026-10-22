/**
 * session-guard.ts — the session-scoped rules the panel is NOT allowed to guess.
 *
 * Every rule here exists because a review found the panel quietly inventing
 * state: a read pinned to a revision it did not own (B1), a late answer landing
 * on another session's view (B3), a selection counted from the search report
 * instead of the server draft (B8), a whole page body passed off as a fragment
 * (B9), "已提交" and "读取失败" fused into one message (B5).
 *
 * Pure functions only: no React, no transport. `RemotePanel` calls them and
 * `tests/client-session-guard.test.mjs` exercises them without a DOM.
 */
                                                                       
                                                                         
                                                       

/** The three mutations the panel can ask for. Kept next to their labels so a
 *  user-facing sentence can never name an operation the code does not perform. */
                                                                                   

export const WRITE_LABEL                                 = {
  'revise-draft': '应用改选',
  'prepare-override': '准备覆盖',
  'clear-override': '清除覆盖',
}

/**
 * B4: an unbound panel has no session to talk to.
 *
 * `null`/empty is NOT "the default session": sending `sessionId: null` to the
 * server would be a request for someone else's state.
 */
export function boundSession(sessionId                           )                      {
  return typeof sessionId === 'string' && sessionId.length > 0
}

/** B3: the session a request was launched under, captured before the await. */
                              
                            
 

export function launchScope(sessionId                           )                     {
  return boundSession(sessionId) ? { sessionId } : null
}

/**
 * B3: an answer may only reach the UI when the panel is STILL showing the
 * session that asked. Anything else is dropped, not merged.
 */
export function stillCurrent(scope             , currentSessionId                           )          {
  return boundSession(currentSessionId) && currentSessionId === scope.sessionId
}

/** B7: monotonic ids; a late search answer must not beat a newer one. */
export function nextRequestId(current        )         {
  return current + 1
}

export function isCurrentRequest(id        , latest        )          {
  return id === latest
}

/**
 * B8: what the user has selected = server draft ∪ local picks,
 * minus explicit removals.
 *
 * `picked` alone is not enough after a write (the server's draft is the
 * authority), and `report.candidates[].selected` is useless for hand selection
 * because the server writes `false` for every candidate on purpose.
 *
 * `override[id] === true`  → picked locally and not (yet) in the draft
 * `override[id] === false` → explicitly removed locally
 * absent                    → follow the server draft
 */
                                                                 

export function effectiveSelection(
  draftSelected                    ,
  override                   ,
)           {
  const out           = []
  for (const page of draftSelected) {
    if (override[page.pageId] === false) continue
    if (!out.includes(page.pageId)) out.push(page.pageId)
  }
  for (const pageId of Object.keys(override)) {
    if (override[pageId] !== true) continue
    if (!out.includes(pageId)) out.push(pageId)
  }
  return out
}

/** B8: toggling a row flips it relative to what is currently shown. */
export function toggleSelection(
  current                   ,
  pageId        ,
  selected         ,
)                    {
  const next                          = { ...current }
  next[pageId] = !selected
  return next
}

/** B6: the pages a click on 应用改选 would actually submit. */
                                       
                                                                        
                           
                                                                               
                               
                                                                           
                    
 

/**
 * B6: "应用改选（N 页）" must show the number of pages that will be sent, not
 * the number of rows the user clicked. A selected page without a
 * `contentHash` cannot be pinned, so the server could only guess which version
 * was meant — it is reported as 未冻结·不可提交 and blocks the submit.
 */
export function committableSelection(
  pageIds                   ,
  view                ,
  candidates                      ,
)                       {
  const hashes = new Map                ()
  // The search report is what the user just looked at, so it wins over an older
  // server draft; the draft fills in pages that were not part of this search.
  for (const candidate of candidates) {
    if (candidate.contentHash.length > 0) hashes.set(candidate.pageId, candidate.contentHash)
  }
  for (const page of view.draft?.selectedPages ?? []) {
    if (!hashes.has(page.pageId)) hashes.set(page.pageId, page.contentHash)
  }

  const selectedPageIds = [...pageIds]
  const committable                   = []
  const unfrozen           = []
  for (const pageId of selectedPageIds) {
    const contentHash = hashes.get(pageId)
    if (contentHash === undefined) {
      unfrozen.push(pageId)
      continue
    }
    committable.push({ pageId, contentHash })
  }
  return { selectedPageIds, committable, unfrozen }
}

/**
 * B9: fragment boundaries come from ONE place — the server's compiled preview.
 *
 * `null` means "the server did not provide boundaries for this page"; the UI
 * must say so. Falling back to `candidate.segments` or to the whole page body
 * would let the panel present a guess as evidence, and slicing/re-joining the
 * body here would be a second Markdown compiler.
 */
export function previewSegments(view                , pageId        )                       {
  const source = view.draft?.preview.sources.find((entry) => entry.pageId === pageId)
  if (source === undefined) return null
  return source.segments.map((segment) => ({ startLine: segment.startLine, endLine: segment.endLine }))
}

/** B10/B11: the stale banner's four strings, written once. */
                            
               
              
                
                
 

/**
 * B10: nothing is "正在刷新" — the code deliberately does not refresh silently,
 * the user presses the button. B11: a stale write is a WRITE, so the sentence
 * names the operation that was rejected instead of describing a read.
 */
export function staleCopy(
  error                                          ,
  operation                ,
)            {
  return {
    title: '视图已过期，这次写入被拒绝',
    hint: '视图已过期：点按钮读取服务端最新视图，确认当前选择后再操作。',
    detail:
      '面板带 revision ' +
      error.expected +
      ' 发起「' +
      WRITE_LABEL[operation] +
      '」，服务端已是 ' +
      error.actual +
      '。',
    action: '读取服务端最新视图',
  }
}

/**
 * B5: a failed READ after a committed write is not a failed write.
 *
 * These three sentences are kept apart on purpose: the write already landed,
 * and telling the user it failed would invite a duplicate submission.
 */
export function committedReadFailureCopy(operation                , message        )         {
  return (
    '写入已提交（' +
    WRITE_LABEL[operation] +
    '），读取最新视图失败：' +
    message +
    '。界面仍停在写入前的视图，请点「读取服务端最新视图」核对。'
  )
}

export function rejectedReadFailureCopy(operation                , message        )         {
  return '「' + WRITE_LABEL[operation] + '」被服务端拒绝，随后读取最新视图也失败：' + message + '。'
}

/** B5: a plain read failure (no write involved) never mentions a write. */
export function readFailureCopy(message        )         {
  return '读取服务端最新视图失败：' + message + '。面板停在已显示的 revision，不假装已更新。'
}
