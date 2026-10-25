import { useEffect, useRef, useState } from 'react'
import type { CaptureEvent, CaptureHistoryResult, CaptureHistoryStatus, CaptureJudgmentResult, CaptureJudgmentSummary, CaptureRecordResult, CaptureStatusResult, CaptureSummary, CaptureView } from '../shared/contracts.js'
import type { MemoryWikiSource } from './source/types.js'

export const CAPTURE_LABEL: Record<CaptureView['phase'], string> = {
  queued: '等待判断', judging: '正在初判', preparing: '正在整理', verifying: '正在核验', publishing: '正在发布',
  ingested: '已沉淀', skipped: '无需沉淀', deferred: '待补证据', failed: '执行失败', needs_attention: '发布需处理',
}
const COLLECTOR = { disabled: '未启用', starting: '等待宿主服务', ready: '本地配置已就绪', blocked: '暂不可用' }
const FILTERS: Array<[CaptureHistoryStatus | '', string]> = [['', '全部'], ['processing', '处理中'], ['ingested', '已沉淀'], ['skipped', '无需沉淀'], ['deferred', '待补证据'], ['error', '异常']]
const EVENT: Record<CaptureEvent['kind'], string> = { registered: '登记原始证据', phase_changed: '阶段更新', judgment_started: '开始判定', judgment_finished: '判定返回', judgment_failed: '调用失败', judgment_interrupted: '调用结果未知', recovery_started: '恢复处理', publication_finished: '发布完成', publication_interrupted: '发布结果待核对', operation_failed: '执行异常', legacy_snapshot: '旧状态快照' }
const time = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value)) + ' · ' + Intl.DateTimeFormat().resolvedOptions().timeZone : '时间未记录'
const message = (cause: unknown) => cause instanceof Error ? cause.message : String(cause)
const ongoing = (phase: CaptureView['phase']) => ['queued', 'judging', 'preparing', 'verifying', 'publishing'].includes(phase)

function usePolling(refresh: () => void, active: boolean) {
  const callback = useRef(refresh)
  callback.current = refresh
  useEffect(() => {
    if (!active) return
    const poll = () => { if (document.visibilityState !== 'hidden') callback.current() }
    const timer = window.setInterval(poll, 3000)
    document.addEventListener('visibilitychange', poll)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', poll) }
  }, [active])
}

function HashValue({ label, value }: { label: string; value?: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  if (!value) return null
  return <div className="memory-wiki-panel__history-hash"><span>{label}</span><code title={value}>{value.slice(0, 16)}</code><button type="button" onClick={() => {
    void navigator.clipboard.writeText(value).then(() => { setCopied(true); setError('') }, () => setError('复制失败，可展开完整值复制'))
  }}>{copied ? '已复制' : '复制'}</button>{error && <span role="status">{error}</span>}<details><summary>完整值</summary><code>{value}</code></details></div>
}

function Judgment({ source, sessionId, jobId, lifecycle }: { source: MemoryWikiSource; sessionId: string; jobId: string; lifecycle: CaptureJudgmentSummary }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<CaptureJudgmentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setError(null)
    void source.captureJudgment({ sessionId, jobId, judgmentId: lifecycle.id }).then(value => { if (!cancelled) setResult(value) }, cause => { if (!cancelled) setError(message(cause)) })
    return () => { cancelled = true }
  }, [source, sessionId, jobId, lifecycle.id, lifecycle.state, open, nonce])
  const record = result?.judgment
  const decision = record?.result?.kind === 'decision' ? record.result : undefined
  const failed = record?.result?.kind === 'error' ? record.result.error : undefined
  return <details className="memory-wiki-panel__judgment" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>{lifecycle.stage === 'assessment' ? 'Jev 初判' : 'Jev 核验'} · 第 {lifecycle.attempt} 次 · {lifecycle.state === 'started' ? '进行中' : lifecycle.state === 'interrupted' ? '结果未知' : lifecycle.state === 'failed' ? '调用失败' : lifecycle.disposition === 'prepare' || lifecycle.disposition === 'publish' ? '通过' : lifecycle.disposition === 'skipped' ? '无需沉淀' : '待补证据'}</summary>
    {open && <div>
      <p>{lifecycle.model}</p><p>开始：{time(lifecycle.startedAt)}</p>{lifecycle.finishedAt && <p>结束：{time(lifecycle.finishedAt)}</p>}
      {lifecycle.durationMs !== undefined && <p>本地调用总耗时：{Math.round(lifecycle.durationMs)} ms（含 SDK 重试）</p>}
      {error ? <p role="alert">{error} <button type="button" onClick={() => setNonce(value => value + 1)}>重试读取</button></p> : !record ? <p role="status">正在读取判定…</p> : <>
        {lifecycle.state === 'interrupted' && <p>进程中断，此次调用结果未知；不能据此判断请求是否发出或是否产生用量。</p>}
        {failed && <p role="alert">{failed.category}{failed.httpStatus ? ' · HTTP ' + failed.httpStatus : ''}：{failed.message}</p>}
        {decision && <><p>{decision.reason} <small>（{decision.reasonCode}）</small></p>
          <p>Token：输入 {decision.usage?.inputTokens ?? '未提供'} · 输出 {decision.usage?.outputTokens ?? '未提供'}</p>
          {decision.requestId && <p>请求 ID：<code>{decision.requestId}</code></p>}
        </>}
        {record.questions.map(question => {
          const answer = decision?.answers.find(value => value.id === question.id)
          return <section key={question.id} className="memory-wiki-panel__question"><h5>{question.id}</h5><p>{question.text}</p>
            {question.options && <details><summary>候选选项</summary>{question.options.map(option => <p key={option.value}><code>{option.value}</code>：{option.description}</p>)}</details>}
            {answer?.type === 'choice' ? <><p>所选：<strong>{answer.choice}</strong> · confidence {answer.confidence.toFixed(3)}</p><p>{answer.probabilities.map(value => `${value.option} ${value.probability.toFixed(3)}`).join(' · ')}</p></> : answer?.type === 'noul' ? <p>Noul：{answer.value.toFixed(3)}</p> : <p>尚无有效答案</p>}
          </section>
        })}
        {decision && <section><h4>程序门槛</h4><p>概率是模型返回值，不代表结论正确率。</p>{decision.gateResults.map(gate => <p key={gate.id} className={gate.passed ? 'is-pass' : 'is-deferred'}>{gate.passed ? '满足' : '未满足'} · {gate.description}：{String(gate.actual)} {gate.operator === 'gte' ? '≥' : '='} {String(gate.expected)}</p>)}</section>}
        <HashValue label="请求" value={record.requestHash} />
      </>}
    </div>}
  </details>
}

function RecordDetail({ source, sessionId, jobId, onBack, onOpen }: { source: MemoryWikiSource; sessionId: string; jobId: string; onBack(): void; onOpen(pageId: string, hash?: string): void }) {
  const [record, setRecord] = useState<CaptureRecordResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [nonce, setNonce] = useState(0)
  const live = useRef(true)
  const requestId = useRef(0)
  useEffect(() => () => { live.current = false }, [])
  const read = (afterEventSeq?: number) => {
    const request = ++requestId.current
    setBusy(true)
    void source.captureRecord({ sessionId, jobId, ...(afterEventSeq === undefined ? {} : { afterEventSeq }) }).then(next => {
      if (!live.current || request !== requestId.current) return
      setRecord(current => afterEventSeq === undefined || !current ? next : { ...next, events: [...current.events, ...next.events], judgments: [...new Map([...current.judgments, ...next.judgments].map(value => [value.id, value])).values()] })
      setError(null)
    }, cause => { if (live.current && request === requestId.current) setError(message(cause)) }).finally(() => { if (live.current && request === requestId.current) setBusy(false) })
  }
  useEffect(() => { read() }, [source, sessionId, jobId, nonce])
  usePolling(() => { if (!busy && record?.summary && ongoing(record.summary.phase)) read(record.events.at(-1)?.seq ?? 0) }, true)
  const summary = record?.summary
  return <article className="memory-wiki-panel__history-detail" aria-label="沉淀记录详情">
    <div className="memory-wiki-panel__history-detail-head"><button type="button" onClick={onBack}>返回记录列表</button><button type="button" disabled={busy} onClick={() => setNonce(value => value + 1)}>刷新详情</button></div>
    {error && <p role="alert">{error}</p>}
    {!summary ? <p role="status">{error ? '暂时无法读取这条记录。' : '正在读取记录…'}</p> : <>
      <h3>{summary.task}{summary.taskTruncated ? '…' : ''}</h3><p className={'memory-wiki-panel__history-state is-' + summary.phase}>{CAPTURE_LABEL[summary.phase]}</p><p>{summary.reason}</p>{summary.publicationUncertain && <p role="alert">发布结果待核对：可能已有部分文件写入。{summary.retryable ? '重启采集服务后将依据已核验清单恢复。' : '请先处理发布冲突，保留现场文件。'}</p>}
      <p>登记：{time(summary.registeredAt)}</p><p>原始会话轮次 {summary.origin.turn} · 证据事件 seq {summary.origin.turnStartSeq}–{summary.origin.turnEndSeq}</p>
      {summary.historyCoverage === 'legacy_snapshot' && <p className="memory-wiki-panel__history-note">旧记录：仅保留当时最新状态，阶段时间和判定答案未记录，不能还原完整历史。</p>}
      <section><h4>阶段时间线</h4><ol className="memory-wiki-panel__timeline">{record.events.map(event => <li key={event.seq}><time dateTime={event.at}>{time(event.at)}</time><strong>{EVENT[event.kind]}{event.phase ? ' · ' + CAPTURE_LABEL[event.phase] : ''}</strong>{event.reason && <p>{event.reason}</p>}{event.error && <p>错误类别：{event.error.category}{event.stage ? ' · 阶段：' + CAPTURE_LABEL[event.stage] : ''}</p>}{event.kind === 'judgment_interrupted' && <p>此次调用结果未知</p>}{event.judgmentId && record.judgments.find(value => value.id === event.judgmentId) && event.kind === 'judgment_started' && <Judgment source={source} sessionId={sessionId} jobId={jobId} lifecycle={record.judgments.find(value => value.id === event.judgmentId)!} />}</li>)}</ol>
        {record.nextEventSeq !== undefined && <button type="button" disabled={busy} onClick={() => read(record.nextEventSeq)}>加载后续事件</button>}
      </section>
      <section><h4>证据与改动</h4>{record.limitations.map((limit, index) => <p key={index}>{limit}</p>)}
        {record.evidence.map(event => <details key={event.seq}><summary>原始证据 seq {event.seq} · {event.kind}</summary><pre>{event.text}</pre>{event.truncated && <p>仅展示前 1,000 字符，完整证据保存在本地任务记录。</p>}</details>)}
        {record.evidenceTruncated && <p>仅展示前 12 条原始事件。</p>}
        {record.changes.map(change => <div key={change.path}><p><code>{change.path}</code> · {change.beforeHash ? '更新' : '新增'}</p><HashValue label="发布候选版本" value={change.afterHash} /></div>)}
        {summary.phase === 'ingested' && <div className="memory-wiki-panel__history-pages"><p>打开的是知识库当前内容，详情会标注与发布版本的差异。</p>{summary.pages.filter(page => !page.startsWith('wiki/sources/')).map(page => <button type="button" key={page} onClick={() => onOpen(page, record.changes.find(change => change.path === page || change.path === page + '.md')?.afterHash)}>{page}</button>)}</div>}
      </section>
      <details><summary>记录标识与版本</summary><p>任务 ID：<code>{summary.jobId}</code></p><p>规则版本：{summary.rubricVersion}</p><HashValue label="原始证据" value={summary.evidenceHash} /><HashValue label="Wiki 规则" value={summary.rulesHash} /><HashValue label="核验改动" value={summary.patchHash} /></details>
    </>}
  </article>
}

export function CaptureHistory({ source, sessionId, initialJobId, onBack, onOpen }: { source: MemoryWikiSource; sessionId: string | null; initialJobId?: string; onBack(): void; onOpen(pageId: string, hash?: string): void }) {
  const [status, setStatus] = useState<CaptureStatusResult | null>(null)
  const [list, setList] = useState<CaptureHistoryResult | null>(null)
  const [selected, setSelected] = useState(initialJobId ?? null)
  const [filter, setFilter] = useState<CaptureHistoryStatus | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [updates, setUpdates] = useState(false)
  const [nonce, setNonce] = useState(0)
  const live = useRef(true)
  const requestId = useRef(0)
  useEffect(() => () => { live.current = false }, [])
  const read = (cursor?: string, poll = false) => {
    const request = ++requestId.current
    if (!poll) setBusy(true)
    void Promise.all([source.captureStatus(sessionId ? { sessionId } : {}), sessionId ? source.captureHistory({ sessionId, ...(filter ? { status: filter } : {}), ...(cursor ? { cursor } : {}) }) : Promise.resolve(null)]).then(([state, next]) => {
      if (!live.current || request !== requestId.current) return
      setStatus(state)
      setError(null)
      if (poll && list) {
        if (JSON.stringify(next?.items) !== JSON.stringify(list.items.slice(0, 20))) setUpdates(true)
      } else { setList(current => cursor && current && next ? { ...next, items: [...current.items, ...next.items] } : next); setUpdates(false) }
    }, cause => { if (live.current && request === requestId.current) setError(message(cause)) }).finally(() => { if (live.current && request === requestId.current) setBusy(false) })
  }
  useEffect(() => { setList(null); setUpdates(false) }, [source, sessionId, filter])
  useEffect(() => { read() }, [source, sessionId, filter, nonce])
  usePolling(() => { if (!busy) read(undefined, true) }, true)
  return <div className="memory-wiki-panel__history" data-testid="mw-capture-history">
    <header className="memory-wiki-panel__history-head"><div><h2>沉淀记录</h2><p>原始证据 → Jev 初判 → 核验 → 发布</p></div><button type="button" onClick={onBack}>返回图谱</button></header>
    <div className="memory-wiki-panel__history-availability" aria-live="polite"><p>自动采集：<strong>{status ? COLLECTOR[status.collector] : '正在读取状态'}</strong></p>{status && <p>{status.reason}</p>}{status?.history !== undefined && status.history !== 'readable' && <p role="alert">{status.history === 'degraded' ? '部分历史记录无法读取，以下内容可能不完整。' : '历史存储暂不可读取。'}</p>}
      {status?.lastIssue && <p role="alert">{time(status.lastIssue.at)} · {status.lastIssue.stage === 'collecting' ? '取证失败，未进入 Jev' : '采集运行异常'}：{status.lastIssue.message}{!status.lastIssue.persisted && '（尚未持久化）'}</p>}
    </div>
    {!sessionId ? <p className="memory-wiki-panel__history-note">在宿主打开一个会话后，可查看该会话的沉淀历史。</p> : <>
      <div className="memory-wiki-panel__history-toolbar"><label>状态 <select value={filter} onChange={event => { setFilter(event.target.value as CaptureHistoryStatus | ''); setSelected(null) }}>{FILTERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><span>当前会话 <code>{sessionId}</code></span><button type="button" disabled={busy} onClick={() => setNonce(value => value + 1)}>刷新记录</button></div>
      {error && <p role="alert">{error}</p>}{updates && <p role="status">有更新，<button type="button" onClick={() => setNonce(value => value + 1)}>刷新记录</button></p>}
      {list?.readCompleteness === 'partial' && <p role="alert">本次历史查询不完整，部分记录未能读取。</p>}
      <div className={'memory-wiki-panel__history-layout' + (selected ? ' has-selection' : '')}>
        <div className="memory-wiki-panel__history-list" aria-label="沉淀记录列表">
          {list === null ? <p role="status">{error ? '历史暂不可读取。' : '正在读取历史…'}</p> : list.items.length === 0 ? <p>尚无本会话采集记录。{status?.collector === 'disabled' ? '自动采集当前未启用。' : ''}</p> : list.items.map(item => <button type="button" key={item.jobId} aria-pressed={selected === item.jobId} onClick={() => setSelected(item.jobId)}><time dateTime={item.registeredAt}>{time(item.registeredAt)}</time><strong>{item.task}{item.taskTruncated ? '…' : ''}</strong><span className={'is-' + item.phase}>{CAPTURE_LABEL[item.phase]} · 第 {item.origin.turn} 轮</span><small>{item.publicationUncertain ? '发布结果待核对 · ' : ''}{item.reason}</small></button>)}
          {list?.nextCursor && <button type="button" disabled={busy} onClick={() => read(list.nextCursor)}>加载更多</button>}
        </div>
        {selected ? <RecordDetail key={selected} source={source} sessionId={sessionId} jobId={selected} onBack={() => setSelected(null)} onOpen={onOpen} /> : <div className="memory-wiki-panel__history-placeholder">选择一条记录，查看阶段时间线、判定条件和原始证据。</div>}
      </div>
    </>}
  </div>
}
