import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Candidate, RetrievalReport } from '../core/types.js'
import type { RemoteError, SessionMode } from '../shared/contracts.js'
import { reasonLabel } from './CandidateList.js'
import { EvidenceGraph } from './EvidenceGraph.js'
import { SourceDetail } from './SourceDetail.js'
import { describeBusinessError, hintFor } from './source/error-hints.js'
import { RemoteCallError } from './source/unwrap.js'
import { errorDetail } from './source/remote-source.js'
import {
  committableSelection,
  committedReadFailureCopy,
  effectiveSelection,
  isCurrentRequest,
  launchScope,
  nextRequestId,
  previewSegments,
  readFailureCopy,
  rejectedReadFailureCopy,
  staleCopy,
  stillCurrent,
  toggleSelection,
  type LaunchScope,
  type SelectionOverride,
  type WriteOperation,
} from './session-guard.js'
import type { MemoryWikiSource, MemoryWikiView, PageView } from './source/index.js'

/**
 * Server view of the panel (P3b, hardened by the client review).
 *
 * Everything shown here is a field the server sent: `SessionView.draft.preview`
 * (text/chars/fits/overBy/sources), `prepared`, `currentTurn`, `mode`,
 * `revision`. The panel never re-compiles, never re-counts characters, never
 * re-hashes a payload, never slices a page into "fragments", and never clears
 * `prepared` locally — it disappears only when the server has observed our own
 * `user/message` (D21).
 *
 * Session ownership rules this component must keep (B1–B12):
 *   - the host remounts it with `key={sessionKey}`, and every local piece of
 *     state below is session-scoped (B2);
 *   - every async answer is checked against the session it was launched under
 *     before it can reach the UI (B3);
 *   - reads never carry a revision; only writes are pinned to the revision that
 *     was displayed when the user clicked (B1 / D26);
 *   - a committed write followed by a failed read is reported as exactly that,
 *     never as a failed write (B5).
 */

const MODE_TEXT: Record<SessionMode, string> = {
  automatic: '自动',
  'manual-ready': '手选就绪',
  'manual-invalid': '手选无效',
}

const format = (value: number) => value.toLocaleString('zh-CN')

type Notice =
  | { kind: 'stale'; error: RemoteError & { code: 'stale-revision' }; operation: WriteOperation }
  | { kind: 'error'; error: RemoteError; operation: WriteOperation }

/**
 * The fields every write result carries. `draft` is present on reviseDraft and
 * (per the server) on a stale response, which is how the panel keeps showing the
 * server's own draft instead of an empty one.
 */
type WriteResult = {
  revision: number
  mode: SessionMode
  error?: RemoteError
  draft?: MemoryWikiView['draft']
}

const messageOf = (cause: unknown): string => (cause instanceof Error ? cause.message : String(cause))

/** One candidate row: picking is a separate action from opening the page. */
function PickRow(props: {
  candidate: Candidate
  picked: boolean
  active: boolean
  onToggle(pageId: string): void
  onOpen(pageId: string): void
}) {
  const { candidate, picked, active, onToggle, onOpen } = props
  const excluded = reasonLabel(candidate.excludedReason)
  return (
    <div
      className={'memory-wiki-panel__candidate' + (active ? ' is-active' : '')}
      data-testid="mw-pick-row"
      data-page-id={candidate.pageId}
      data-picked={picked ? '1' : '0'}
    >
      <div className="memory-wiki-panel__toolbar">
        <button
          type="button"
          className="memory-wiki-panel__pick-toggle"
          data-testid="mw-pick"
          aria-pressed={picked}
          onClick={() => onToggle(candidate.pageId)}
        >
          {picked ? '已选入' : '选入'}
        </button>
        <button
          type="button"
          className="memory-wiki-panel__pick-open"
          data-testid="mw-open-page"
          onClick={() => onOpen(candidate.pageId)}
        >
          {candidate.title}
        </button>
        <span className="memory-wiki-panel__chip">{candidate.match === 'direct' ? '直接' : '关联'}</span>
      </div>
      <span className="memory-wiki-panel__candidate-id">{candidate.pageId}</span>
      {candidate.why.length > 0 && (
        <span className="memory-wiki-panel__chips">
          {candidate.why.map((term) => (
            <span key={term} className="memory-wiki-panel__chip memory-wiki-panel__chip--why">
              {term}
            </span>
          ))}
        </span>
      )}
      {candidate.viaPageId !== undefined && (
        <span className="memory-wiki-panel__via">经由 {candidate.viaPageId}</span>
      )}
      {excluded !== null && (
        <span className="memory-wiki-panel__chips">
          <span
            className={'memory-wiki-panel__chip memory-wiki-panel__chip--' + candidate.excludedReason}
          >
            {excluded}
          </span>
        </span>
      )}
    </div>
  )
}

export function RemotePanel(props: {
  source: MemoryWikiSource
  /** Always bound: the unbound state is rendered by MemoryPanel (B4). */
  sessionId: string
  view: MemoryWikiView
  /** Last revision that arrived through a CLEAN read; writes are pinned to it (B4). */
  writeRevision: number | undefined
  /** B3: the callee must hand back the session the read was launched under. */
  onView(next: MemoryWikiView, requestSession: string): void
}) {
  const { source, sessionId, view, writeRevision, onView } = props
  const [override, setOverride] = useState<SelectionOverride>({})
  const [query, setQuery] = useState(view.draft?.query ?? '')
  const [report, setReport] = useState<RetrievalReport | null>(null)
  const [searchState, setSearchState] = useState<'idle' | 'busy' | 'failed' | 'done'>('idle')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [writeError, setWriteError] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [activePageId, setActivePageId] = useState<string | null>(null)
  const [page, setPage] = useState<PageView | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  /** B3: the only session this component's answers may land on. */
  const sessionRef = useRef(sessionId)
  const previousSessionRef = useRef(sessionId)
  const searchIdRef = useRef(0)
  const reloadIdRef = useRef(0)

  useEffect(() => {
    sessionRef.current = sessionId
  }, [sessionId])

  // B2: the host remounts this component with key={sessionKey}; this second
  // reset keeps the guarantee even if a caller forgets the key. Without it a
  // cross-session revision could silently apply A's selection to B.
  useEffect(() => {
    if (previousSessionRef.current === sessionId) return
    previousSessionRef.current = sessionId
    setOverride({})
    setReport(null)
    setQuery('')
    setSearchState('idle')
    setSearchError(null)
    setNotice(null)
    setWriteError(null)
    setRefreshError(null)
    setActivePageId(null)
    setPage(null)
    setPageError(null)
  }, [sessionId])

  const revision = view.revision
  // Adopt the server's own query whenever it produced a new revision: the
  // server is the only authority on what was accepted.
  useEffect(() => {
    if (view.draft === undefined) return
    setQuery(view.draft.query)
  }, [revision, view.draft])

  const candidates = report?.candidates ?? []

  // B8: selection = server draft ∪ local picks (minus explicit removals).
  const draftSelected = view.draft?.selectedPages ?? []
  const selection = useMemo(
    () => committableSelection(effectiveSelection(draftSelected, override), view, candidates),
    [draftSelected, override, view, candidates],
  )
  const selectedIds = useMemo(() => new Set(selection.selectedPageIds), [selection])

  // B6: the hash a page would be submitted with, or undefined = 未冻结.
  // Depends on the two STATE objects (not on the arrays derived from them), so
  // the readPage effect below does not restart on every render.
  const hashOf = useMemo(() => {
    const map = new Map<string, string>()
    for (const candidate of report?.candidates ?? []) map.set(candidate.pageId, candidate.contentHash)
    for (const pageRef of view.draft?.selectedPages ?? []) {
      if (!map.has(pageRef.pageId)) map.set(pageRef.pageId, pageRef.contentHash)
    }
    return map
  }, [report, view.draft])
  const activeHash = activePageId === null ? undefined : hashOf.get(activePageId)

  const activeCandidate = useMemo<Candidate | undefined>(
    () => candidates.find((candidate) => candidate.pageId === activePageId),
    [candidates, activePageId],
  )

  /** B9: boundaries come from the compiled preview — nowhere else. */
  const segments = activePageId === null ? null : previewSegments(view, activePageId)

  // readPage through the seam, pinned to the hash the server listed.
  useEffect(() => {
    if (activePageId === null) return
    const scope = launchScope(sessionId)
    if (scope === null) return
    let cancelled = false
    setPageError(null)
    setPage(null)
    const contentHash = activeHash
    void (async () => {
      try {
        const next = await source.readPage({
          pageId: activePageId,
          ...(contentHash === undefined ? {} : { contentHash }),
          sessionId: scope.sessionId,
        })
        if (cancelled || !stillCurrent(scope, sessionRef.current)) return
        setPage(next)
      } catch (cause) {
        if (cancelled || !stillCurrent(scope, sessionRef.current)) return
        setPage(null)
        const code = cause instanceof RemoteCallError ? cause.code + ': ' : ''
        setPageError(code + messageOf(cause))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [source, sessionId, activePageId, activeHash])

  /** The one read path. B1: no revision is ever attached to a read. */
  const readView = useCallback(
    (scope: LaunchScope): Promise<MemoryWikiView> => source.getView({ sessionId: scope.sessionId }),
    [source],
  )

  /**
   * B5: adopt what the write already told us, then re-read separately.
   *
   * The server returns the post-write state; a stale response even carries the
   * current view. Adopting those fields keeps `prepared`/`draft` on screen
   * (the "server has a prepared override, the panel says 未准备" failure).
   * A failure of the FOLLOW-UP READ is reported with its own sentence.
   */
  const adoptWrite = (result: WriteResult): MemoryWikiView => {
    const next: MemoryWikiView = { ...view, revision: result.revision, mode: result.mode }
    if (result.draft !== undefined) next.draft = result.draft
    // B4: an error response's revision is displayed, never pinned for writes —
    // applyView() in MemoryPanel only pins clean views.
    if (result.error === undefined) delete next.error
    else next.error = result.error
    return next
  }

  const reload = async (scope: LaunchScope, operation: WriteOperation, committed: boolean): Promise<void> => {
    const id = nextRequestId(reloadIdRef.current)
    reloadIdRef.current = id
    try {
      const next = await readView(scope)
      if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return
      setRefreshError(null)
      onView(next, scope.sessionId)
    } catch (cause) {
      if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return
      setRefreshError(
        committed
          ? committedReadFailureCopy(operation, messageOf(cause))
          : rejectedReadFailureCopy(operation, messageOf(cause)),
      )
    }
  }

  const performWrite = async (
    operation: WriteOperation,
    call: (scope: LaunchScope, expectedRevision: number) => Promise<WriteResult>,
  ): Promise<void> => {
    const scope = launchScope(sessionId)
    if (scope === null || writeRevision === undefined) return
    setBusy(true)
    setNotice(null)
    setWriteError(null)
    setRefreshError(null)
    let result: WriteResult
    try {
      // B5: ONLY the write lives inside this capture. A failure here is a write
      // failure; a failure of the read below is a different sentence.
      result = await call(scope, writeRevision)
    } catch (cause) {
      setBusy(false)
      if (!stillCurrent(scope, sessionRef.current)) return
      const code = cause instanceof RemoteCallError ? cause.code + ': ' : ''
      setWriteError(code + messageOf(cause))
      return
    }
    setBusy(false)
    if (!stillCurrent(scope, sessionRef.current)) return

    onView(adoptWrite(result), scope.sessionId)
    if (result.error !== undefined) {
      setNotice(
        result.error.code === 'stale-revision'
          ? { kind: 'stale', error: result.error, operation }
          : { kind: 'error', error: result.error, operation },
      )
    } else {
      setNotice(null)
    }
    await reload(scope, operation, result.error === undefined)
  }

  /** Reading the server's current view is a READ: never pinned, always reported as a read. */
  const refreshView = async (): Promise<void> => {
    const scope = launchScope(sessionId)
    if (scope === null) return
    const id = nextRequestId(reloadIdRef.current)
    reloadIdRef.current = id
    try {
      const next = await readView(scope)
      if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return
      setNotice(null)
      setRefreshError(null)
      onView(next, scope.sessionId)
    } catch (cause) {
      if (!isCurrentRequest(id, reloadIdRef.current) || !stillCurrent(scope, sessionRef.current)) return
      setRefreshError(readFailureCopy(messageOf(cause)))
    }
  }

  const budgetChars = view.budgetChars
  const hops = view.hops
  const searching = searchState === 'busy'
  const locked = busy || searching
  const canWrite = source.reviseDraft !== undefined && writeRevision !== undefined
  const canRevise = canWrite && !locked && budgetChars !== undefined && hops !== undefined && selection.unfrozen.length === 0
  const canSearch = hops !== undefined && !locked

  const revise = (): Promise<void> => {
    const reviseDraft = source.reviseDraft
    if (reviseDraft === undefined || !canRevise || budgetChars === undefined || hops === undefined) {
      return Promise.resolve()
    }
    return performWrite(
      'revise-draft',
      (scope, expectedRevision) =>
        reviseDraft({
          sessionId: scope.sessionId,
          expectedRevision,
          query,
          selectedPages: selection.committable,
          budgetChars,
          hops,
        }),
    )
  }

  const prepare = (): Promise<void> => {
    const prepareOverride = source.prepareOverride
    if (prepareOverride === undefined || !canWrite || locked) return Promise.resolve()
    return performWrite('prepare-override', (scope, expectedRevision) =>
      prepareOverride({ sessionId: scope.sessionId, expectedRevision }),
    )
  }

  const clear = (): Promise<void> => {
    const clearOverride = source.clearOverride
    if (clearOverride === undefined || !canWrite || locked) return Promise.resolve()
    return performWrite('clear-override', (scope, expectedRevision) =>
      clearOverride({ sessionId: scope.sessionId, expectedRevision }),
    )
  }

  /**
   * B7: a search gets a monotonic id; a late answer from an older query is
   * dropped. The search also locks the panel while it runs.
   */
  const search = async (): Promise<void> => {
    const scope = launchScope(sessionId)
    if (scope === null || hops === undefined || locked) return
    const id = nextRequestId(searchIdRef.current)
    searchIdRef.current = id
    setSearchState('busy')
    setSearchError(null)
    try {
      const next = await source.search({ query, hops, sessionId: scope.sessionId })
      if (!isCurrentRequest(id, searchIdRef.current) || !stillCurrent(scope, sessionRef.current)) return
      setReport(next)
      setSearchState('done')
      setActivePageId((current) => current ?? next.candidates[0]?.pageId ?? null)
    } catch (cause) {
      if (!isCurrentRequest(id, searchIdRef.current) || !stillCurrent(scope, sessionRef.current)) return
      setReport(null)
      setSearchState('failed')
      setSearchError(messageOf(cause))
    }
  }

  const toggle = (pageId: string): void => {
    const selected = selectedIds.has(pageId)
    setOverride((current) => toggleSelection(current, pageId, selected))
  }

  const draft = view.draft
  const preview = draft?.preview
  const mode: SessionMode = view.mode ?? 'automatic'
  const stale = notice?.kind === 'stale' ? staleCopy(notice.error, notice.operation) : null

  return (
    <div className="memory-wiki-panel__body" data-testid="mw-server-view" data-server-mode={mode}>
      <div className="memory-wiki-panel__col memory-wiki-panel__col--list">
        <div className="memory-wiki-panel__section-head">
          <span>手选候选</span>
          <span data-testid="mw-search-status">
            {searching
              ? '检索中…'
              : searchState === 'done'
                ? '已检索'
                : searchState === 'failed'
                  ? '检索失败'
                  : '未检索'}
          </span>
        </div>
        <div className="memory-wiki-panel__toolbar">
          <input
            className="memory-wiki-panel__query"
            data-testid="mw-query"
            value={query}
            placeholder="本轮问题（交给服务端检索）"
            aria-label="检索问题"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" data-testid="mw-search" disabled={!canSearch} onClick={() => void search()}>
            检索
          </button>
        </div>
        {searchError !== null && (
          <p className="memory-wiki-panel__over" role="alert" data-testid="mw-search-error">
            {searchError}
          </p>
        )}
        {report === null ? (
          <p className="memory-wiki-panel__excerpt-note" data-testid="mw-candidates-empty">
            候选来自服务端 search：不检索就没有候选，也不在客户端本地打分。
          </p>
        ) : (
          <div className="memory-wiki-panel__scroll" data-testid="mw-pick-list">
            <div className="memory-wiki-panel__section-head">
              <span>候选</span>
              <span data-testid="mw-cand-counts">
                直接 {report.candidates.filter((entry) => entry.match === 'direct').length} / 关联{' '}
                {report.candidates.filter((entry) => entry.match === 'linked').length} · 手选{' '}
                {selection.selectedPageIds.length}
              </span>
            </div>
            {report.candidates.map((candidate) => (
              <PickRow
                key={candidate.pageId}
                candidate={candidate}
                picked={selectedIds.has(candidate.pageId)}
                active={candidate.pageId === activePageId}
                onToggle={toggle}
                onOpen={setActivePageId}
              />
            ))}
          </div>
        )}
      </div>

      <div className="memory-wiki-panel__col memory-wiki-panel__col--center">
        {report !== null && (
          <EvidenceGraph
            report={report}
            activePageId={activePageId}
            onSelect={setActivePageId}
            selectedPageIds={selection.selectedPageIds}
          />
        )}
        <div className="memory-wiki-panel__server" data-testid="mw-server-status">
          <div className="memory-wiki-panel__section-head">
            <span data-testid="mw-server-mode">mode {MODE_TEXT[mode]}</span>
            <span data-testid="mw-server-rev">revision {view.revision}</span>
          </div>
          <div className="memory-wiki-panel__chips">
            <span className="memory-wiki-panel__chip" data-testid="mw-server-budget">
              额度 {budgetChars === undefined ? '未提供' : format(budgetChars)}
            </span>
            <span className="memory-wiki-panel__chip" data-testid="mw-server-hops">
              跳数 {hops === undefined ? '未提供' : hops}
            </span>
            <span className="memory-wiki-panel__chip" data-testid="mw-skipped">
              跳过原因 {view.skippedReason ?? '未提供'}
            </span>
          </div>
          {stale !== null && (
            <div className="memory-wiki-panel__stale" role="alert" data-testid="mw-stale">
              <strong>{stale.title}</strong>
              <p>{stale.hint}</p>
              <p data-testid="mw-stale-detail">{stale.detail}</p>
              <button type="button" data-testid="mw-stale-refresh" onClick={() => void refreshView()}>
                {stale.action}
              </button>
            </div>
          )}
          {notice?.kind === 'error' && (
            <p className="memory-wiki-panel__over" role="alert" data-testid="mw-write-error">
              {hintFor(notice.error.code, '操作被服务端拒绝')}（{errorDetail(notice.error)}）
            </p>
          )}
          {writeError !== null && (
            <p className="memory-wiki-panel__over" role="alert" data-testid="mw-write-transport-error">
              写调用失败：{writeError}
            </p>
          )}
          {refreshError !== null && (
            <p className="memory-wiki-panel__over" role="alert" data-testid="mw-refresh-error">
              {refreshError}
              <button type="button" data-testid="mw-refresh-retry" onClick={() => void refreshView()}>
                读取服务端最新视图
              </button>
            </p>
          )}
          {view.error !== undefined && notice === null && writeError === null && refreshError === null && (
            <p className="memory-wiki-panel__over" role="alert" data-testid="mw-server-error">
              {describeBusinessError(view.error)}（{errorDetail(view.error)}）
            </p>
          )}

          <div className="memory-wiki-panel__toolbar" data-testid="mw-write-actions">
            <button
              type="button"
              data-testid="mw-revise"
              disabled={!canRevise}
              aria-busy={busy}
              onClick={() => void revise()}
            >
              应用改选（{selection.committable.length} 页）
            </button>
            <button
              type="button"
              data-testid="mw-prepare"
              disabled={!canWrite || locked || draft === undefined}
              onClick={() => void prepare()}
            >
              准备覆盖
            </button>
            <button type="button" data-testid="mw-clear" disabled={!canWrite || locked} onClick={() => void clear()}>
              清除覆盖
            </button>
          </div>
          <p className="memory-wiki-panel__excerpt-note" data-testid="mw-write-note">
            改选无改动时服务端不会清除已准备的覆盖（幂等）；写入只提交带 contentHash 的页。
          </p>
          {selection.unfrozen.length > 0 && (
            <p className="memory-wiki-panel__over" role="alert" data-testid="mw-unfrozen">
              未冻结·不可提交（{selection.unfrozen.length} 页）：{selection.unfrozen.join('、')} —— 没有服务端
              contentHash，先重新检索或取消选入；本面板不会替你猜版本。
            </p>
          )}

          {preview === undefined || draft === undefined ? (
            <p className="memory-wiki-panel__excerpt-note" data-testid="mw-draft-none">
              服务端还没有草稿：选中候选后「应用改选」才会生成（草稿不等于注入）。
            </p>
          ) : (
            <div data-testid="mw-draft">
              <div className="memory-wiki-panel__section-head">
                <span>草稿预览 = 服务端编译结果</span>
                <span data-testid="mw-draft-facts">
                  {format(preview.chars)} / {format(draft.budgetChars)} 字符 · {preview.sources.length} 页 ·{' '}
                  {preview.fits ? '额度内' : '超额 ' + format(preview.overBy)}
                </span>
              </div>
              <p className="memory-wiki-panel__chips">
                <span className="memory-wiki-panel__chip" data-testid="mw-draft-hash">
                  已冻结哈希 {preview.payloadHash.slice(0, 12)}
                </span>
              </p>
              <pre className="memory-wiki-panel__pre" data-testid="mw-draft-preview-text">
                {preview.text}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="memory-wiki-panel__col memory-wiki-panel__col--detail">
        <SourceDetail
          candidate={activeCandidate}
          page={page}
          loading={pageError === null && page === null && activePageId !== null}
          error={pageError}
          segments={segments}
          selected={activePageId !== null && selectedIds.has(activePageId)}
        />
        <div className="memory-wiki-panel__hist" data-testid="mw-server-evidence">
          <h4 className="memory-wiki-panel__subhead">手选选入（{selection.selectedPageIds.length} 页）</h4>
          {selection.selectedPageIds.length === 0 ? (
            <p className="memory-wiki-panel__excerpt-note">未选入任何页；自动模式不受影响。</p>
          ) : (
            selection.selectedPageIds.map((pageId) => {
              const contentHash = hashOf.get(pageId)
              return (
                <div key={pageId} className="memory-wiki-panel__hist-row" data-testid="mw-picked">
                  <strong>{pageId}</strong>
                  <div className="memory-wiki-panel__hist-facts">
                    {contentHash === undefined ? (
                      <span data-testid="mw-picked-unfrozen">未冻结·不可提交</span>
                    ) : (
                      <span data-testid="mw-picked-hash">{contentHash.slice(0, 12)}</span>
                    )}
                  </div>
                </div>
              )
            })
          )}

          <h4 className="memory-wiki-panel__subhead">
            已准备覆盖<span className="memory-wiki-panel__readonly">本面板只读</span>
          </h4>
          {view.prepared === undefined ? (
            <p className="memory-wiki-panel__excerpt-note" data-testid="mw-prepared-none">
              未准备：prepareOverride 之后才有快照，且只被下一轮提交消费一次。
            </p>
          ) : (
            <div className="memory-wiki-panel__hist-row" data-testid="mw-prepared">
              <strong>
                {view.prepared.origin === 'manual' ? '手选' : '自动'} · {view.prepared.snapshotId}
              </strong>
              <div className="memory-wiki-panel__hist-facts">
                <span>{format(view.prepared.chars)} 字符</span>
                <span>{view.prepared.sources.length} 页</span>
                <span data-testid="mw-prepared-hash">hash {view.prepared.payloadHash.slice(0, 12)}</span>
                <span>lib {view.prepared.libraryRevision}</span>
              </div>
              <p className="memory-wiki-panel__excerpt-note">
                已准备 ≠ 已注入：只有本插件自己的 user/message 落地后服务端才会清掉它。
              </p>
            </div>
          )}

          <h4 className="memory-wiki-panel__subhead">
            本轮轮次<span className="memory-wiki-panel__readonly">本面板只读</span>
          </h4>
          {view.currentTurn === undefined ? (
            <p className="memory-wiki-panel__excerpt-note" data-testid="mw-current-turn-none">
              本会话还没有记录到轮次。
            </p>
          ) : (
            <div className="memory-wiki-panel__hist-row" data-testid="mw-current-turn">
              <strong>
                第 {view.currentTurn.turn} 轮 · {view.currentTurn.phase}
              </strong>
              <div className="memory-wiki-panel__hist-facts">
                <span>{view.currentTurn.snapshotId ?? '无 snapshotId'}</span>
                <span>{view.currentTurn.payloadHash?.slice(0, 12) ?? '无 hash'}</span>
                <span>补注 {view.currentTurn.reInjections}</span>
                {view.currentTurn.committedSeq !== undefined && (
                  <span>seq {view.currentTurn.committedSeq}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
