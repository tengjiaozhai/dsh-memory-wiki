import fs from 'node:fs'
import path from 'node:path'
import lockfile from 'proper-lockfile'
import { atomicWrite, hash, PublicationConflict, redactRecord, safeError, under } from './files.js'
import { CaptureJournal, JournalWriteError } from './journal.js'
import type { CaptureIssue } from '../../shared/contracts.js'
import { RUBRIC_VERSION } from './types.js'
import type { Assessment, CaptureJob, CapturePhase, CaptureView, EvidenceBundle, PreparedIngest, RawEvent, Verification, WriterRoute, JudgmentRequest } from './types.js'

type CaptureSession = {
  id: string
  header?: { parentSession?: unknown; cwd?: string; origin?: string; delegationDepth?: number }
}
type Options = {
  wikiRoot: string
  dataRoot: string
  judge: { assess(evidence: EvidenceBundle, signal: AbortSignal, started: (request: JudgmentRequest) => void): Promise<Assessment>; verify(evidence: EvidenceBundle, prepared: PreparedIngest, signal: AbortSignal, started: (request: JudgmentRequest) => void): Promise<Verification> }
  ingest: { prepare(evidence: EvidenceBundle, route: WriterRoute, signal: AbortSignal): Promise<PreparedIngest>; publish(prepared: PreparedIngest, signal: AbortSignal): Promise<string[]> }
  readEvents(sessionId: string, workspace: string): Promise<readonly RawEvent[]>
  onPublishing?(active: boolean): void
  onPublished?(): void
  onError?(message: string): void
}
type Watched = { workspace: string; cursor: number; lastIssue?: CaptureIssue }
const TERMINAL: CapturePhase[] = ['ingested', 'skipped', 'deferred', 'failed', 'needs_attention']

/** Persistent per-human-turn work. It never injects or continues the parent conversation. */
export class ExperienceCapture {
  private readonly options: Options
  readonly journal: CaptureJournal
  private readonly root: string
  private readonly jobs = new Map<string, CaptureJob>()
  private readonly watched = new Map<string, Watched>()
  private readonly controller = new AbortController()
  private work: Promise<void> = Promise.resolve()
  private incoming: Promise<void> = Promise.resolve()
  private closed = false
  private writeBlocked = false
  private readonly recovering = new Set<string>()

  constructor(options: Options) {
    this.options = options
    this.root = fs.realpathSync(options.wikiRoot)
    this.journal = new CaptureJournal(options.dataRoot)
    fs.mkdirSync(options.dataRoot, { recursive: true, mode: 0o700 })
    const watchedRoot = under(options.dataRoot, 'watched')
    fs.mkdirSync(watchedRoot, { recursive: true, mode: 0o700 })
    for (const file of fs.readdirSync(watchedRoot)) {
      if (!/^[a-f0-9]{64}\.json$/.test(file)) continue
      try {
        const { sessionId, ...value } = JSON.parse(fs.readFileSync(under(watchedRoot, file), 'utf8'))
        if (typeof sessionId !== 'string' || !sessionId || file !== hash(sessionId) + '.json' || typeof value.workspace !== 'string' || !Number.isSafeInteger(value.cursor) || value.cursor < -1) throw new Error('Invalid watched session')
        this.watched.set(sessionId, { workspace: value.workspace, cursor: value.cursor, lastIssue: this.journal.issue(sessionId) })
      } catch { this.writeBlocked = true; this.options.onError?.('采集会话登记文件损坏，已停止自动处理') }
    }
    for (const job of this.journal.scan().jobs) this.jobs.set(job.jobId, job)
  }

  private save(job: CaptureJob): void {
    this.journal.save(job)
    this.jobs.set(job.jobId, job)
  }

  private phase(job: CaptureJob, phase: CapturePhase, reason: string): void {
    this.journal.append(job, { kind: 'phase_changed', phase, reason })
  }

  private saveWatched(): void {
    for (const [sessionId, value] of this.watched) atomicWrite(under(this.options.dataRoot, `watched/${hash(sessionId)}.json`), JSON.stringify({ sessionId, ...value }))
  }

  get blocked(): boolean { return this.writeBlocked || this.journal.scan().history !== 'readable' }

  getIssue(sessionId: string): CaptureIssue | undefined { return this.watched.get(sessionId)?.lastIssue }

  private issue(sessionId: string, stage: CaptureIssue['stage'], error: unknown, refs: { turnEndSeq?: number; jobId?: string } = {}): void {
    const watched = this.watched.get(sessionId)
    if (!watched) return
    watched.lastIssue = { at: new Date().toISOString(), stage, code: stage, message: safeError(error).replaceAll(this.options.dataRoot, '[采集目录]'), persisted: true, ...refs }
    try { this.saveWatched() } catch { watched.lastIssue.persisted = false }
    this.journal.rememberIssue(sessionId, watched.lastIssue)
    this.options.onError?.(watched.lastIssue.message)
  }

  private judge(job: CaptureJob, stage: 'assessment', signal: AbortSignal): Promise<Assessment>
  private judge(job: CaptureJob, stage: 'verification', signal: AbortSignal): Promise<Verification>
  private async judge(job: CaptureJob, stage: 'assessment' | 'verification', signal: AbortSignal): Promise<Assessment | Verification> {
    let id: string | undefined
    const start = performance.now()
    const started = (request: JudgmentRequest) => { id = this.journal.start(job, stage, request) }
    try {
      const decision = stage === 'assessment' ? await this.options.judge.assess(job.evidence, signal, started) : await this.options.judge.verify(job.evidence, job.prepared!, signal, started)
      if (!id || !decision.audit) throw new Error('Judge did not return its recorded request and decision')
      this.journal.finish(job, id, decision.audit, decision.durationMs ?? performance.now() - start)
      return decision
    } catch (error: any) {
      if (!(error instanceof JournalWriteError) && id && !job.events.some(event => event.judgmentId === id && ['judgment_finished', 'judgment_failed', 'judgment_interrupted'].includes(event.kind))) {
        if (this.closed) this.journal.append(job, { kind: 'judgment_interrupted', judgmentId: id })
        else this.journal.finish(job, id, { kind: 'error', error: { category: typeof error?.status === 'number' ? 'http' : /Invalid|different model|recorded request/.test(safeError(error)) ? 'validation' : 'request', message: safeError(error), ...(typeof error?.status === 'number' ? { httpStatus: error.status } : {}) } }, typeof error?.durationMs === 'number' ? error.durationMs : performance.now() - start)
      }
      throw error
    }
  }

  observe(session: CaptureSession, event: RawEvent): void {
    if (this.closed || this.writeBlocked || this.journal.scan().history !== 'readable' || session.header?.origin === 'subagent' || (session.header?.delegationDepth ?? 0) > 0) return
    if (!['turn/start', 'turn/end', 'user/message'].includes(event.type)) return
    try {
      const workspace = session.header?.cwd ?? ''
      let watched = this.watched.get(session.id)
      if (!watched) {
        watched = { workspace, cursor: event.seq - 1 }
        this.watched.set(session.id, watched)
      }
      if (event.type === 'turn/end') {
        const current = watched
        this.incoming = this.incoming.then(async () => {
          const events = await this.options.readEvents(session.id, workspace)
          for (const ended of events) if (ended.type === 'turn/end' && ended.seq > current.cursor && ended.seq <= event.seq) {
            await this.register(session.id, events, ended, { ...current })
            current.cursor = ended.seq
          }
          current.cursor = Math.max(current.cursor, event.seq)
          if (current.lastIssue?.stage === 'collecting') { delete current.lastIssue; this.journal.rememberIssue(session.id) }
          this.saveWatched()
        }).catch(error => this.issue(session.id, 'collecting', error, { turnEndSeq: event.seq }))
      }
      this.saveWatched()
    }
    catch (error) { this.issue(session.id, 'journal_write', error) }
  }

  private async register(sessionId: string, raw: readonly RawEvent[], end: RawEvent, watched: Watched): Promise<void> {
    if (end.seq <= watched.cursor) return
    const turn = Number(end.data?.turn)
    const start = [...raw].reverse().find(event => event.type === 'turn/start' && event.data?.turn === turn && event.seq < end.seq)
    if (!start) throw new Error('Completed turn has no original turn/start event')
    const headerEvent = [...raw].reverse().find(event => event.type === 'request/header' && event.seq < end.seq)
    const header = headerEvent?.data?.header?.config
    const responseSource = [...raw].reverse().find(event => event.type === 'assistant/message' && event.seq > start.seq && event.seq < end.seq)?.data?.message?.source
    // The host may reuse an unchanged header. A response from this turn must
    // confirm its route before we reuse header parameters across turns.
    const routeConfirmed = (headerEvent?.seq ?? -1) > start.seq || (responseSource?.kind === 'model' && responseSource.provider === header?.provider && responseSource.model === header?.model)
    const route: WriterRoute | undefined = routeConfirmed && header?.provider && header?.model
      ? { provider: header.provider, model: header.model, ...(header.reasoningEffort ? { reasoningEffort: header.reasoningEffort } : {}) }
      : undefined
    const previousEnd = [...raw].reverse().find(event => event.type === 'turn/end' && event.seq < start.seq)?.seq ?? -1
    const human = raw.filter(event => event.type === 'user/message' && event.data?.source?.kind === 'user' && event.seq > previousEnd && event.seq <= end.seq)
    if (human.length === 0) { watched.cursor = end.seq; return }
    const jobId = hash(JSON.stringify([this.root, watched.workspace, sessionId, start.seq, end.seq]))
    const release = await lockfile.lock(this.options.dataRoot, { lockfilePath: under(this.options.dataRoot, 'register.lock'), stale: 60_000, retries: { retries: 30, minTimeout: 50, maxTimeout: 200 } })
    try {
      const existing = under(this.options.dataRoot, jobId + '.json')
      if (fs.existsSync(existing)) this.jobs.set(jobId, this.journal.load(jobId))
      if (!this.jobs.has(jobId)) {
        const events = raw.filter(event => event.seq >= Math.min(start.seq, human[0]!.seq) && event.seq <= end.seq && ['user/message', 'assistant/message', 'tool/call', 'tool/result', 'assistant/attempt', 'workspace/changes', 'turn/end'].includes(event.type))
          .filter(event => event.type !== 'user/message' || event.data?.source?.kind === 'user')
          .map(event => {
            const sensitiveFile = /["'\s/](?:\.env(?:\.[\w-]+)?|[^/"'\s]*\.(?:pem|key)|(?:auth|credentials?|secrets?|tokens?)\.(?:json|ya?ml|toml|ini))(?=["'\s/]|$)/i.test(JSON.stringify(event.data))
            const text = sensitiveFile ? '[Sensitive-file event omitted]' : JSON.stringify(redactRecord(event.data))
            return { seq: event.seq, kind: event.type, text, hash: hash(text) }
          })
        const requestedTask = human.map(event => JSON.stringify(redactRecord(event.data.content))).join('\n')
        const limitations: string[] = []
        if (events.some(event => event.text === '[Sensitive-file event omitted]')) limitations.push('涉及凭据文件的事件已省略')
        if (JSON.stringify(events).length > 150_000) limitations.push('本轮证据超出判定额度，需缩小取证范围')
        const changes: NonNullable<EvidenceBundle['changes']> = []
        const checks: NonNullable<EvidenceBundle['checks']> = []
        const calls = new Map<string, { seq: number; data: any }>()
        for (const event of events) {
          if (event.text === '[Sensitive-file event omitted]') continue
          let data: any
          try { data = JSON.parse(event.text) } catch { continue }
          if (event.kind === 'tool/call') calls.set(`${data.step}:${data.callId}`, { seq: event.seq, data })
          if (event.kind !== 'tool/result') continue
          const call = calls.get(`${data.step}:${data.message?.toolCallId}`)
          if (!call) continue
          let args: any
          try { args = JSON.parse(call.data.arguments) } catch { continue }
          if (call.data.name === 'bash' && typeof args.command === 'string') checks.push({ callRef: call.seq, evidenceRef: event.seq, command: args.command, output: event.text, isError: data.message?.isError === true })
          const filePath = args.path ?? args.file_path
          if (['write_file', 'edit_file'].includes(call.data.name) && typeof filePath === 'string' && data.message?.isError !== true) changes.push({ path: filePath, evidenceRef: event.seq, detail: event.text, attribution: 'tool-recorded' })
        }
        const base = { jobId, origin: { sessionId, turn, turnStartSeq: start.seq, turnEndSeq: end.seq }, outcome: String(end.data?.reason?.kind ?? 'unknown'), workspaceIdentity: hash(watched.workspace), requestedTask, events, changes, checks, limitations }
        const evidence = { ...base, contentHash: hash(JSON.stringify(base)) }
        const at = new Date().toISOString()
        const job: CaptureJob = { schemaVersion: 2, registeredAt: at, historyCoverage: 'complete', events: [{ seq: 1, at, kind: 'registered', phase: 'queued', reason: '已登记本轮原始证据' }], judgments: [], jobId, evidence, ...(route ? { route } : {}), phase: 'queued', reason: '已登记本轮原始证据', pages: [], updatedAt: at, rubricVersion: RUBRIC_VERSION, authorization: 'capture.enabled:v1; high-confidence coding evidence only' }
        this.save(job)
        this.schedule(job)
      }
      watched.cursor = end.seq
    }
    finally { await release() }
  }

  private schedule(job: CaptureJob): void {
    this.work = this.work.then(() => this.process(job)).catch(error => { this.writeBlocked = true; this.issue(job.evidence.origin.sessionId, 'journal_write', error, { jobId: job.jobId }) })
  }

  private async process(job: CaptureJob): Promise<void> {
    if (this.closed || this.writeBlocked || this.journal.scan().history !== 'readable' || (TERMINAL.includes(job.phase) && !(job.phase === 'failed' && job.retryable))) return
    let compromised = false
    let release: () => Promise<void>
    try {
      release = await lockfile.lock(this.options.dataRoot, { lockfilePath: under(this.options.dataRoot, `${job.jobId}.worker.lock`), stale: 240_000,
        retries: { retries: 20, minTimeout: 100, maxTimeout: 500 }, onCompromised: () => { compromised = true } })
    } catch (error) { this.issue(job.evidence.origin.sessionId, 'worker_lock', error, { jobId: job.jobId }); return }
    const signal = AbortSignal.any([this.controller.signal, AbortSignal.timeout(180_000)])
    try {
      Object.assign(job, this.journal.load(job.jobId))
      if (this.recovering.has(job.jobId) && job.phase === 'publishing') this.journal.append(job, { kind: 'publication_interrupted', reason: '上次发布的结束记录缺失，实际结果待依据发布清单核对' })
      if (job.phase === 'failed' && job.retryable && job.prepared && job.verifiedPatchHash === job.prepared.patchHash) this.phase(job, 'publishing', '恢复已核验的发布清单')
      if (TERMINAL.includes(job.phase)) return
      if (this.recovering.delete(job.jobId)) this.journal.recover(job)
      if (this.journal.scan().jobs.some(other => other.jobId !== job.jobId && other.prepared && (other.phase === 'needs_attention' || other.retryable))) {
        this.phase(job, 'deferred', '该知识库有尚未恢复的发布，请先处理原任务记录')
        return
      }
      if (job.phase !== 'publishing') {
        if (job.evidence.limitations.some(limit => limit.includes('超出'))) { this.phase(job, 'deferred', job.evidence.limitations.join('；')); return }
        this.phase(job, 'judging', 'Jev 正在判断经验价值')
        const assessment = await this.judge(job, 'assessment', signal)
        job.model = assessment.model
        if (assessment.disposition !== 'prepare') { this.phase(job, assessment.disposition, assessment.reason); return }
        if (!job.route) throw new Error('No complete writer route was recorded for this turn')
        this.phase(job, 'preparing', '按 llm-wiki 整理暂存页面')
        job.prepared = await this.options.ingest.prepare(job.evidence, job.route, signal)
        this.phase(job, 'verifying', 'Jev 正在核验最终断言')
        const verification = await this.judge(job, 'verification', signal)
        job.model = verification.model
        if (verification.disposition !== 'publish') { this.phase(job, verification.disposition, verification.reason); return }
        job.verifiedPatchHash = job.prepared.patchHash
        this.phase(job, 'publishing', '最终改动已核验，正在发布')
      }
      if (!job.prepared || job.verifiedPatchHash !== job.prepared.patchHash) throw new Error('Publishing journal lacks an approved patch')
      if (compromised) throw new Error('Capture worker lock was lost')
      this.options.onPublishing?.(true)
      job.pages = await this.options.ingest.publish(job.prepared, signal)
      this.options.onPublished?.()
      this.journal.append(job, { kind: 'publication_finished', phase: 'ingested', reason: '已沉淀并刷新知识库' })
      this.options.onPublishing?.(false)
    }
    catch (error) {
      if (error instanceof JournalWriteError) throw error
      if (this.closed) { if (job.phase === 'publishing') this.journal.append(job, { kind: 'publication_interrupted', reason: '应用停止，发布结果待恢复核对' }); else this.save(job); return }
      const publicationUnknown = job.phase === 'publishing' && (!(error instanceof PublicationConflict) || error.partial)
      job.retryable = job.phase === 'publishing' && !(error instanceof PublicationConflict)
      if (error instanceof PublicationConflict && !error.partial) {
        this.journal.append(job, { kind: 'operation_failed', phase: 'deferred', stage: job.phase, reason: safeError(error), error: { category: 'publication_conflict', message: safeError(error) } })
        this.options.onPublishing?.(false)
      }
      else this.journal.append(job, { kind: 'operation_failed', phase: error instanceof PublicationConflict ? 'needs_attention' : 'failed', stage: job.phase, reason: safeError(error), error: { category: error instanceof PublicationConflict ? 'publication_conflict' : job.phase === 'publishing' ? 'publication' : job.phase === 'preparing' ? 'writer_or_validation' : 'judgment', message: safeError(error) } })
      if (publicationUnknown) this.journal.append(job, { kind: 'publication_interrupted', reason: '发布未完整结束，可能已有文件写入；实际结果待依据已核验清单核对' })
    }
    finally { await release() }
  }

  async recover(): Promise<void> {
    if (this.blocked) return
    if ([...this.jobs.values()].some(job => job.prepared && (job.phase === 'publishing' || job.phase === 'needs_attention' || job.retryable))) this.options.onPublishing?.(true)
    for (const [sessionId, watched] of this.watched) {
      try {
        const events = await this.options.readEvents(sessionId, watched.workspace)
        for (const event of events) if (event.type === 'turn/end' && event.seq > watched.cursor) await this.register(sessionId, events, event, watched)
        this.saveWatched()
      }
      catch (error) { this.issue(sessionId, 'collecting', error) }
    }
    for (const job of this.jobs.values()) {
      if (!TERMINAL.includes(job.phase) || (job.phase === 'failed' && job.retryable)) { this.recovering.add(job.jobId); this.schedule(job) }
    }
  }

  getCapture(sessionId: string): CaptureView | undefined { return this.journal.latest(sessionId) }

  async whenIdle(): Promise<void> { await this.incoming; await this.work }

  async dispose(): Promise<void> {
    this.closed = true
    this.controller.abort()
    await this.incoming
    await this.work
  }
}
