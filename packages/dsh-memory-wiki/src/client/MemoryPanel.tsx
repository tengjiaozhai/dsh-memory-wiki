import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { GraphPage, GraphResult } from '../shared/contracts.js'
import type { MemoryWikiSource, MemoryWikiView, PageView } from './source/index.js'
import { EvidenceGraph } from './EvidenceGraph.js'
import { MarkdownView } from './MarkdownView.js'
import { RemotePanel } from './RemotePanel.js'
import { CaptureHistory } from './CaptureHistory.js'
import { CaptureStatus } from './CaptureStatus.js'
import { Icon } from './icons.js'
import { boundSession } from './session-guard.js'

/*
 * THESIS: Browse the entire Wiki first; reading and context editing unfold on demand.
 * OWN-WORLD: DSH dark blue-gray ground, pale blue selection, fine real-link edges,
 * system sans and one compact toolbar. The host owns application navigation.
 * STORY: Open the graph, locate a page, read its original knowledge and follow links;
 * explicitly select and prepare evidence for the next conversation turn.
 * FIRST VIEWPORT: Full library canvas below a 72px search toolbar. No empty list or
 * reader column. A selected page opens a 400px right reader over the canvas.
 * FORM: Graph-overlay reading, grounded candidate 7, surface seed 03b9eae5;
 * user approved graph-overlay.png on 2026-10-24 with “使用第一种方案”.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
 * review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
 */

export type Binding = { getSnapshot(): { key: string | null }; subscribe(listener: () => void): () => void }
export type UiSession = { adapter?: { current?: Binding } }
export type SessionKey = string | null

function useSessionKey(uiSession: UiSession | undefined): SessionKey {
  const binding = uiSession?.adapter?.current
  const subscribe = useCallback((listener: () => void) => binding?.subscribe(listener) ?? (() => {}), [binding])
  const snapshot = useCallback(() => binding?.getSnapshot()?.key ?? null, [binding])
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

const KIND: Record<string, string> = { concept: '概念', entity: '实体', source: '来源', synthesis: '综合', output: '产出' }
const messageOf = (cause: unknown) => cause instanceof Error ? cause.message : String(cause)

/** The full library is global; only context editing belongs to a session. */
export function MemoryPanel({ source, uiSession }: { source: MemoryWikiSource; uiSession?: UiSession }) {
  const sessionKey = useSessionKey(uiSession)
  const sessionRef = useRef(sessionKey)
  sessionRef.current = sessionKey
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyJob, setHistoryJob] = useState<string | undefined>()
  const [publishedPage, setPublishedPage] = useState<{ id: string; hash?: string } | null>(null)
  const [graph, setGraph] = useState<GraphResult | null>(null)
  const [graphError, setGraphError] = useState<string | null>(null)
  const [graphBusy, setGraphBusy] = useState(true)
  const [graphNonce, setGraphNonce] = useState(0)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activePageId, setActivePageId] = useState<string | null>(null)
  const [drawer, setDrawer] = useState<'detail' | 'context' | null>(null)
  const [reset, setReset] = useState(0)
  const [pageState, setPageState] = useState<{ hash: string; page: PageView } | null>(null)
  const [pageError, setPageError] = useState<{ id: string; message: string } | null>(null)
  const [viewState, setViewState] = useState<{ session: string; view: MemoryWikiView; cleanRevision?: number } | null>(null)
  const [viewError, setViewError] = useState<string | null>(null)
  const [viewNonce, setViewNonce] = useState(0)
  const [lastReadAt, setLastReadAt] = useState<number | null>(null)
  const [pendingPage, setPendingPage] = useState<GraphPage | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    setGraphBusy(true)
    setGraphError(null)
    void source.getGraph().then((next) => {
      if (cancelled) return
      setGraph(next)
      setGraphBusy(false)
    }, (cause: unknown) => {
      if (cancelled) return
      setGraphError(messageOf(cause))
      setGraphBusy(false)
    })
    return () => { cancelled = true }
  }, [source, graphNonce])

  // Reads never carry a write revision. A late session response cannot land in another session.
  useEffect(() => {
    setPendingPage(null)
    setViewError(null)
    setLastReadAt(null)
    if (!boundSession(sessionKey)) { setViewState(null); return }
    let cancelled = false
    void source.getView({ sessionId: sessionKey }).then((next) => {
      if (cancelled || sessionRef.current !== sessionKey) return
      setViewState({ session: sessionKey, view: next, ...(next.error === undefined ? { cleanRevision: next.revision } : {}) })
      setLastReadAt(Date.now())
    }, (cause: unknown) => {
      if (!cancelled && sessionRef.current === sessionKey) setViewError(messageOf(cause))
    })
    return () => { cancelled = true }
  }, [source, sessionKey, viewNonce])

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== 'hidden' && boundSession(sessionRef.current)) setViewNonce((n) => n + 1)
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => { window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh) }
  }, [])

  const view = viewState?.session === sessionKey ? viewState.view : null
  const writeRevision = viewState?.session === sessionKey ? viewState.cleanRevision : undefined
  const applyView = useCallback((next: MemoryWikiView, requestSession: string) => {
    if (sessionRef.current !== requestSession) return
    setViewState((current) => ({ session: requestSession, view: next, cleanRevision: next.error === undefined ? next.revision : current?.session === requestSession ? current.cleanRevision : undefined }))
    setViewError(null)
    setLastReadAt(Date.now())
  }, [])
  const pageIndex = useMemo(() => new Map(graph?.pages.map((entry) => [entry.pageId, entry])), [graph])
  const active = activePageId === null ? undefined : pageIndex.get(activePageId)
  const term = query.trim().toLocaleLowerCase()
  const results = useMemo(() => term === '' ? [] : (graph?.pages ?? []).filter((entry) => entry.title.toLocaleLowerCase().includes(term) || entry.pageId.toLocaleLowerCase().includes(term)), [graph, term])
  const matches = useMemo(() => new Set(results.map((entry) => entry.pageId)), [results])
  const outgoing = useMemo(() => [...new Set(graph?.edges.filter((edge) => edge.from === activePageId).map((edge) => edge.to))], [graph, activePageId])
  const incoming = useMemo(() => [...new Set(graph?.edges.filter((edge) => edge.to === activePageId).map((edge) => edge.from))], [graph, activePageId])

  useEffect(() => {
    setPageState(null)
    setPageError(null)
    if (active === undefined) return
    let cancelled = false
    void source.readPage({ pageId: active.pageId, contentHash: active.contentHash }).then((next) => {
      if (!cancelled) setPageState({ hash: active.contentHash, page: next })
    }, (cause: unknown) => {
      if (!cancelled) setPageError({ id: active.pageId, message: messageOf(cause) })
    })
    return () => { cancelled = true }
  }, [source, graph, active?.pageId, active?.contentHash])

  const page = pageState !== null && pageState.page.pageId === active?.pageId && pageState.hash === active?.contentHash ? pageState.page : null
  const openPage = useCallback((id: string) => { setActivePageId(id); setDrawer('detail'); setSearchOpen(false) }, [])
  const clearSearch = () => { setQuery(''); setSearchOpen(false); setActivePageId(null); setDrawer(null); setReset((n) => n + 1) }
  const refreshGraph = () => { clearSearch(); setGraphNonce((n) => n + 1) }
  const close = () => { setDrawer(null); setActivePageId(null); setReset((n) => n + 1) }
  const readFailure = pageError?.id === activePageId ? pageError.message : null
  const relations: Array<[string, string[]]> = [['关联知识', outgoing], ['引用了本页', incoming]]

  return (
    <section className="memory-wiki-panel" data-testid="mw-panel" data-source={source.mode} onKeyDown={(event) => {
      if (historyOpen) return
      if (event.key === 'Escape') { setSearchOpen(false); close() }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchInput.current?.focus() }
    }}>
      <header className="memory-wiki-panel__head">
        <div className="memory-wiki-panel__brand"><Icon name="graph" /><h2>记忆 Wiki</h2><span>知识图谱</span></div>
        <div className="memory-wiki-panel__searchbox">
          <Icon name="search" />
          <input ref={searchInput} value={query} placeholder="搜索页面标题或路径" aria-label="搜索知识" data-testid="mw-browse-query"
            disabled={historyOpen} aria-expanded={searchOpen && term !== ''} aria-controls="mw-browse-results" autoComplete="off"
            onFocus={() => setSearchOpen(true)} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true) }}
            onKeyDown={(event) => { if (event.key === 'Enter' && results[0] !== undefined) openPage(results[0].pageId) }} />
          {query !== '' ? <button type="button" disabled={historyOpen} onClick={clearSearch} aria-label="清空搜索"><Icon name="close" /></button> : <kbd>⌘ K</kbd>}
          {searchOpen && term !== '' && (
            <div className="memory-wiki-panel__search-results" id="mw-browse-results" data-testid="mw-browse-results">
              <p role="status">{results.length === 0 ? '没有找到页面，试试其他标题或路径。' : results.length + ' 个匹配页面'}</p>
              {results.slice(0, 30).map((entry) => <button type="button" key={entry.pageId} onClick={() => openPage(entry.pageId)}>
                <span>{entry.title}<small>{entry.pageId}</small></span><Icon name="arrow" />
              </button>)}
              {results.length > 30 && <p>还有 {results.length - 30} 页，请缩小搜索范围。</p>}
            </div>
          )}
        </div>
        <div className="memory-wiki-panel__head-actions">
          <button type="button" aria-pressed={historyOpen} onClick={() => { setHistoryJob(undefined); setHistoryOpen(value => !value) }}>沉淀记录</button>
          <button type="button" className="memory-wiki-panel__icon" onClick={refreshGraph} aria-label="刷新知识图谱" disabled={graphBusy || historyOpen}><Icon name="refresh" /></button>
          <button type="button" disabled={historyOpen} data-testid="mw-context-toggle" aria-expanded={drawer === 'context'} aria-controls="mw-context" onClick={() => { setSearchOpen(false); setDrawer((current) => current === 'context' ? null : 'context') }}><Icon name="graph" />上下文</button>
        </div>
      </header>
      <div className="memory-wiki-panel__surfaces">
      <div className="memory-wiki-panel__workspace" aria-hidden={historyOpen || undefined} style={historyOpen ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}>
        {graph !== null && graph.pages.length > 0 && <EvidenceGraph visible={!historyOpen} graph={graph} activePageId={activePageId} onSelect={openPage} matches={matches} drawer={drawer !== null} reset={reset} />}
        {graphError !== null ? <div className="memory-wiki-panel__empty" role="alert" data-testid="mw-graph-error"><Icon name="graph" /><h3>暂时无法读取知识图谱</h3><p>{graphError}</p><button type="button" onClick={refreshGraph}>重新读取</button></div>
          : graph === null ? <div className="memory-wiki-panel__empty" role="status" data-testid="mw-loading"><Icon name="graph" /><h3>正在展开知识图谱</h3><p>读取 Wiki 页面与链接…</p></div>
          : graph.pages.length === 0 ? <div className="memory-wiki-panel__empty" data-testid="mw-graph-empty"><Icon name="graph" /><h3>Wiki 里还没有可展示的页面</h3><p>添加有效的 Markdown 知识页面后，刷新即可看到关系图。</p></div> : null}
        {graphBusy && graph !== null && <span className="memory-wiki-panel__updating" role="status">正在更新图谱…</span>}
        <span className="memory-wiki-panel__canvas-status" data-testid="mw-browse-status">{source.mode === 'fixture' ? '设计预览 · 示例内容' : !boundSession(sessionKey) ? '浏览模式 · 未绑定会话' : view === null ? '上下文未就绪' : view.prepared !== undefined ? '已准备下一轮手选依据' : '自动模式'}{graph !== null && graph.brokenLinks > 0 ? ' · ' + graph.brokenLinks + ' 个未解析链接' : ''}</span>

        {drawer === 'detail' && active !== undefined && (
          <aside className="memory-wiki-panel__drawer" aria-label="知识详情" data-testid="mw-knowledge-detail">
            <div className="memory-wiki-panel__drawer-head"><h3>{active.title}</h3><button type="button" className="memory-wiki-panel__icon" onClick={close} aria-label="关闭知识详情"><Icon name="close" /></button></div>
            <div key={active.pageId} className="memory-wiki-panel__reader">
              {publishedPage?.id === active.pageId && <p className="memory-wiki-panel__excerpt-note">{page === null ? '正在读取知识库当前页面…' : publishedPage.hash && publishedPage.hash === page.contentHash ? '当前内容与当时发布版本一致。' : '正在查看知识库当前内容；可能与当时发布版本不同。'}</p>}
              <p className="memory-wiki-panel__page-meta">{KIND[active.kind] ?? active.kind}{active.asOf === undefined ? '' : ' · ' + active.asOf}</p>
              {readFailure !== null ? <div role="alert"><p>{readFailure}</p><button type="button" onClick={() => setGraphNonce((n) => n + 1)}>刷新图谱后重读</button></div>
                : page === null ? <p role="status">正在读取页面…</p> : <><MarkdownView source={page.body} title={active.title} testId="mw-knowledge-body" />{page.truncated && <p className="memory-wiki-panel__excerpt-note">正文较长，当前展示前 {page.limitChars?.toLocaleString()} 字符。</p>}</>}
              {relations.map(([title, ids]) => (
                <section className="memory-wiki-panel__relations" key={String(title)}><h4>{title}</h4>
                  {ids.length === 0 ? <p>暂无{title === '关联知识' ? '出链' : '反链'}</p> : ids.map((id) => <button type="button" key={id} onClick={() => openPage(id)}><span>{pageIndex.get(id)?.title ?? id}</span><Icon name="arrow" /></button>)}
                </section>
              ))}
              <details className="memory-wiki-panel__page-info"><summary>页面信息</summary><p>{active.pageId}</p><p>版本 {active.contentHash.slice(0, 12)}</p></details>
            </div>
            <footer className="memory-wiki-panel__reader-footer"><button type="button" data-testid="mw-add-evidence" disabled={!boundSession(sessionKey) || view === null || writeRevision === undefined || source.reviseDraft === undefined} onClick={() => { setPendingPage({ ...active }); setDrawer('context') }}><Icon name="plus" />选为下一轮依据</button><p>{boundSession(sessionKey) ? '先选入，再在上下文中预览和准备。' : '浏览无需会话；选为依据需先打开一个会话。'}</p></footer>
          </aside>
        )}
        <aside id="mw-context" className="memory-wiki-panel__drawer memory-wiki-panel__drawer--context" aria-label="会话上下文" hidden={drawer !== 'context'}>
          {view?.capture && <CaptureStatus onHistory={() => { setHistoryJob(view.capture?.jobId); setHistoryOpen(true) }} capture={view.capture} onOpen={pageId => { setGraphNonce(n => n + 1); openPage(pageId) }} />}
          <div className="memory-wiki-panel__drawer-head"><div><h3>会话上下文</h3><p>自动检索，或为下一轮指定依据。</p></div><button type="button" className="memory-wiki-panel__icon" onClick={close} aria-label="关闭上下文"><Icon name="close" /></button></div>
          {!boundSession(sessionKey) ? <div className="memory-wiki-panel__context-note" data-testid="mw-unbound"><h4>打开一个会话后即可选择依据</h4><p>你可以继续浏览整库图谱和知识正文。</p></div>
            : view === null ? <div className="memory-wiki-panel__context-note" role={viewError === null ? 'status' : 'alert'}><p>{viewError ?? '正在读取会话状态…'}</p><button type="button" onClick={() => setViewNonce((n) => n + 1)}>重新读取</button></div>
            : <><div className="memory-wiki-panel__context-meta"><span data-testid="mw-mode">{source.mode}</span><span data-testid="mw-session">会话 {sessionKey}</span><span data-testid="mw-rev">视图 rev {view.revision}</span><span data-testid="mw-last-read">上次读取 {lastReadAt === null ? '尚未读取' : new Date(lastReadAt).toLocaleTimeString('zh-CN', { hour12: false })}</span></div>{viewError !== null && <p role="alert" data-testid="mw-error">{viewError}</p>}<RemotePanel key={sessionKey} source={source} sessionId={sessionKey} view={view} writeRevision={writeRevision} onView={applyView} pendingPage={pendingPage} /></>}
        </aside>
      </div>
      {historyOpen && <CaptureHistory key={sessionKey ?? 'unbound'} source={source} sessionId={sessionKey} initialJobId={historyJob} onBack={() => setHistoryOpen(false)} onOpen={(id, hash) => { setPublishedPage({ id, hash }); setGraphNonce(value => value + 1); setHistoryOpen(false); openPage(id) }} />}
      </div>
    </section>
  )
}
