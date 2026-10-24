import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { Candidate } from '../core/types.js'
import type { PageView } from './source/index.js'
import { BudgetBar } from './BudgetBar.js'
import { CandidateList } from './CandidateList.js'
import { EvidenceGraph } from './EvidenceGraph.js'
import { HistoryPane } from './HistoryPane.js'
import { PreviewPane } from './PreviewPane.js'
import { SourceDetail } from './SourceDetail.js'
import { RemotePanel } from './RemotePanel.js'
import { CaptureStatus } from './CaptureStatus.js'
import { MarkdownView } from './MarkdownView.js'
import type {
  BudgetOption,
  MemoryWikiSource,
  MemoryWikiView,
  SelectionKind,
} from './source/index.js'
import { RemoteCallError } from './source/unwrap.js'
import { boundSession, launchScope, stillCurrent } from './session-guard.js'

/** Host session binding: uiSession.adapter.current (getSnapshot/subscribe). */
export type Binding = {
  getSnapshot(): { key: string | null }
  subscribe(listener: () => void): () => void
}
export type UiSession = { adapter?: { current?: Binding } }
export type SessionKey = string | null

function useSessionKey(uiSession: UiSession | undefined): SessionKey {
  const binding = uiSession?.adapter?.current
  const subscribe = useCallback(
    (listener: () => void) => (binding && typeof binding.subscribe === 'function' ? binding.subscribe(listener) : () => {}),
    [binding],
  )
  const getSnapshot = useCallback(
    () => (binding && typeof binding.getSnapshot === 'function' ? binding.getSnapshot()?.key ?? null : null),
    [binding],
  )
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** B12: "when did the panel last hear from the server" must be readable, not guessed. */
const formatClock = (at: number): string => new Date(at).toLocaleTimeString('zh-CN', { hour12: false })

/** A view is only renderable for the session it was read for (B2/B3). */
type ScopedView = { session: string; view: MemoryWikiView }

/**
 * The panel knows exactly one thing about its data: `source: MemoryWikiSource`.
 * Everything below consumes DTOs from that source; no fixture module is imported
 * here (a dev source, when one is registered, is injected at the switch point).
 *
 * Session rules (client review B1–B12):
 *   - no session → no request, and a neutral 未绑定会话 state (B4);
 *   - reads never carry `expectedRevision`; the ref exists only to pin WRITES,
 *     and it is cleared whenever the session changes (B1/B2);
 *   - a view/revision is stored together with the session that produced it, so
 *     a late answer for session A can never render in session B (B2/B3);
 *   - a read whose response carries `error` never pins a write revision (B4).
 */
export function MemoryPanel(props: {
  source: MemoryWikiSource
  uiSession?: UiSession
}) {
  const sessionKey = useSessionKey(props.uiSession)
  const source = props.source
  const [budget, setBudget] = useState<BudgetOption>(4000)
  const [preset, setPreset] = useState<SelectionKind>('auto1')
  const [viewState, setViewState] = useState<ScopedView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activePageId, setActivePageId] = useState<string | null>(null)
  const [page, setPage] = useState<PageView | null>(null)
  const [capturePage, setCapturePage] = useState<PageView | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)
  const [lastReadAt, setLastReadAt] = useState<number | null>(null)
  const [readNonce, setReadNonce] = useState(0)
  /** Write pin only. Never sent on a read (B1), never fed by a dirty read (B4). */
  const revisionRef = useRef<number | undefined>(undefined)
  const sessionRef = useRef<SessionKey>(sessionKey)
  const previousSessionRef = useRef<SessionKey>(sessionKey)

  // B2: switching sessions resets every piece of local state, and drops the
  // write pin. A revision from session A must never pin a write in session B.
  useEffect(() => {
    sessionRef.current = sessionKey
    if (previousSessionRef.current === sessionKey) return
    previousSessionRef.current = sessionKey
    revisionRef.current = undefined
    setViewState(null)
    setError(null)
    setPage(null)
    setCapturePage(null)
    setPageError(null)
    setActivePageId(null)
    setLastReadAt(null)
  }, [sessionKey])

  // B4/B1: one read per (session, preset, budget, explicit re-read).
  //   - unbound session → return before calling anything;
  //   - the request carries only the session id: a read is never revision-pinned.
  useEffect(() => {
    const scope = launchScope(sessionKey)
    if (scope === null) {
      setViewState(null)
      setError(null)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const next = await source.getView({ sessionId: scope.sessionId, preset, budget })
        if (cancelled || !stillCurrent(scope, sessionRef.current)) return
        setViewState({ session: scope.sessionId, view: next })
        // B4: only a clean view may pin a write; an error response's revision is
        // displayed but never reused for the next mutation.
        if (next.error === undefined) revisionRef.current = next.revision
        setError(null)
        setLastReadAt(Date.now())
        setActivePageId((current) => current ?? next.report?.candidates[0]?.pageId ?? null)
      } catch (cause) {
        if (cancelled || !stillCurrent(scope, sessionRef.current)) return
        const code = cause instanceof RemoteCallError ? cause.code : 'unknown-error'
        const message = cause instanceof Error ? cause.message : String(cause)
        setError(code + ': ' + message)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [source, sessionKey, preset, budget, readNonce])

  // B12: `prepared` can be consumed by a turn while the panel is not looking.
  // Re-read when the window becomes visible/focused again instead of showing a
  // stale snapshot forever; the header also names the last successful read.
  useEffect(() => {
    if (sessionKey === null) return
    const reRead = (): void => {
      if (sessionRef.current === null) return
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
      setReadNonce((value) => value + 1)
    }
    window.addEventListener('focus', reRead)
    document.addEventListener('visibilitychange', reRead)
    return () => {
      window.removeEventListener('focus', reRead)
      document.removeEventListener('visibilitychange', reRead)
    }
  }, [sessionKey])

  const view = viewState !== null && viewState.session === sessionKey ? viewState.view : null

  // Two render shapes over one seam: a registered dev source still carries a
  // compiler result (P3a screenshots, reversibility), while the server view
  // carries draft/prepared DTOs. The remote mapping never fills these fields, so
  // this predicate is what routes the panel — never a mode string.
  const devView =
    view !== null &&
    view.report !== undefined &&
    view.compile !== undefined &&
    view.current !== undefined &&
    view.history !== undefined
      ? { report: view.report, compile: view.compile, current: view.current, history: view.history }
      : null

  const active = useMemo<Candidate | undefined>(
    () => view?.report?.candidates.find((candidate) => candidate.pageId === activePageId),
    [view, activePageId],
  )

  // readPage through the same seam; a changed page is reported, never swapped.
  useEffect(() => {
    const scope = launchScope(sessionKey)
    if (activePageId === null || scope === null) return
    let cancelled = false
    setPageError(null)
    void (async () => {
      try {
        const next = await source.readPage({
          pageId: activePageId,
          ...(active?.contentHash === undefined ? {} : { contentHash: active.contentHash }),
          sessionId: scope.sessionId,
        })
        if (cancelled || !stillCurrent(scope, sessionRef.current)) return
        setPage(next)
      } catch (cause) {
        if (cancelled || !stillCurrent(scope, sessionRef.current)) return
        setPage(null)
        setPageError(String(cause instanceof Error ? cause.message : cause))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [source, sessionKey, activePageId, active?.contentHash])

  /**
   * Adopt a server view handed back by a write or a re-read.
   *
   * B3: the caller passes the session the read was launched under, and a
   * mismatch is dropped here as well (second gate, cheap).
   * B4: only a clean view updates the write pin.
   */
  const applyView = useCallback((next: MemoryWikiView, requestSession: string) => {
    if (sessionRef.current !== requestSession) return
    if (next.error === undefined) revisionRef.current = next.revision
    setViewState({ session: requestSession, view: next })
    setError(null)
    setLastReadAt(Date.now())
  }, [])

  const draftPreview = view?.draft?.preview
  const over = devView !== null ? !devView.compile.fits : draftPreview !== undefined && draftPreview.fits === false
  const fitText =
    view === null
      ? '加载中'
      : over
        ? '超额'
        : devView === null && view.draft === undefined
          ? '无草稿'
          : '额度内'

  return (
    <section className="memory-wiki-panel" data-testid="mw-panel">
      <header className="memory-wiki-panel__head">
        <h2 className="memory-wiki-panel__title">记忆 Wiki · 双链依据</h2>
        <span className="memory-wiki-panel__badge" data-testid="mw-mode">
          {source.mode}
        </span>
        <span
          className={'memory-wiki-panel__badge' + (over ? ' memory-wiki-panel__badge--gold' : '')}
          data-testid="mw-fit-badge"
        >
          {fitText}
        </span>
        <div className="memory-wiki-panel__head-meta">
          <span data-testid="mw-session">会话 {sessionKey ?? '未绑定'}</span>
          {view !== null && (
            <>
              {view.libraryRevision !== undefined && (
                <span data-testid="mw-lib">库 {view.libraryRevision}</span>
              )}
              <span data-testid="mw-rev">视图 rev {view.revision}</span>
            </>
          )}
          <span data-testid="mw-last-read">
            上次读取 {lastReadAt === null ? '尚未读取' : formatClock(lastReadAt)}
          </span>
        </div>
      </header>
      {view?.capture && <CaptureStatus capture={view.capture} onOpen={pageId => {
        const session = sessionKey
        void source.readPage({ pageId, sessionId: session }).then(result => { if (sessionRef.current === session) setCapturePage(result) }, cause => { if (sessionRef.current === session) setError(String(cause)) })
      }} />}
      {capturePage && <div className="memory-wiki-panel__fault"><button type="button" onClick={() => setCapturePage(null)}>关闭经验正文</button><h3>{capturePage.title}</h3><MarkdownView source={capturePage.body} /></div>}

      {error !== null && (
        <div className="memory-wiki-panel__fault" data-testid="mw-error" role="alert">
          <strong>读取视图失败（{source.mode}）</strong>
          <p>{error}</p>
          <p className="memory-wiki-panel__excerpt-note">
            面板不展示回落数据：抓不到宿主视图时，它宁可停在已显示的 revision。
          </p>
        </div>
      )}

      {!boundSession(sessionKey) ? (
        <div className="memory-wiki-panel__fault" data-testid="mw-unbound">
          <strong>未绑定会话</strong>
          <p>本面板不向服务端发请求：先在一个会话里打开它，视图随会话绑定。</p>
        </div>
      ) : view === null ? (
        error === null ? (
          <div className="memory-wiki-panel__fault" data-testid="mw-loading">
            正在从 {source.mode} 数据源取视图…
          </div>
        ) : null
      ) : devView === null ? (
        <RemotePanel
          key={sessionKey}
          source={source}
          sessionId={sessionKey}
          view={view}
          writeRevision={revisionRef.current}
          onView={applyView}
        />
      ) : (
        <div className="memory-wiki-panel__body" data-testid="mw-dev-view">
          <div className="memory-wiki-panel__col memory-wiki-panel__col--list">
            <CandidateList
              report={devView.report}
              activePageId={activePageId}
              onSelect={setActivePageId}
            />
          </div>

          <div className="memory-wiki-panel__col memory-wiki-panel__col--center">
            <EvidenceGraph
              report={devView.report}
              activePageId={activePageId}
              onSelect={setActivePageId}
            />
            <BudgetBar
              result={devView.compile}
              budget={budget}
              selection={preset}
              onBudget={setBudget}
              onSelection={setPreset}
            />
            <PreviewPane result={devView.compile} />
          </div>

          <div className="memory-wiki-panel__col memory-wiki-panel__col--detail">
            <SourceDetail
              candidate={active}
              page={page}
              loading={pageError === null && page === null}
              error={pageError}
              segments={active?.segments ?? null}
              selected={active?.selected ?? false}
            />
            <HistoryPane current={devView.compile} pending={devView.current} history={devView.history} />
          </div>
        </div>
      )}
    </section>
  )
}
