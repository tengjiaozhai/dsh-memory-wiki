import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { atomicWrite, hash, redact, under } from './files.js'
import type { CaptureJob, CapturePhase, JudgmentRequest, JudgmentAudit } from './types.js'
import type { CaptureJudgmentRecord, CaptureIssue, CaptureEvent, CaptureHistoryInput, CaptureHistoryResult, CaptureHistoryStatus, CaptureJudgmentInput, CaptureJudgmentResult, CaptureJudgmentStage, CaptureJudgmentSummary, CaptureRecordInput, CaptureRecordResult, CaptureSummary, CaptureView } from '../../shared/contracts.js'

const phases: CapturePhase[] = ['queued', 'judging', 'preparing', 'verifying', 'publishing', 'ingested', 'skipped', 'deferred', 'failed', 'needs_attention']
const statuses: Record<CaptureHistoryStatus, CapturePhase[]> = { processing: ['queued', 'judging', 'preparing', 'verifying', 'publishing'], ingested: ['ingested'], skipped: ['skipped'], deferred: ['deferred'], error: ['failed', 'needs_attention'] }
const idPattern = /^[a-f0-9]{64}$/
const object = (value: unknown): value is Record<string, any> => value !== null && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === 'string'
const integer = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text)
const date = (value: unknown) => text(value) && Number.isFinite(Date.parse(value))
const probability = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
const primitive = (value: unknown) => typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))
const terminal = ['judgment_finished', 'judgment_failed', 'judgment_interrupted']

function normalize(value: unknown, id: string): CaptureJob {
  if (!object(value) || value.jobId !== id || !phases.includes(value.phase) || !text(value.reason) || !strings(value.pages) || !date(value.updatedAt) || !text(value.rubricVersion) || !text(value.authorization)) throw new Error('Invalid capture journal')
  const evidence = value.evidence
  if (!object(evidence) || evidence.jobId !== id || !object(evidence.origin) || !text(evidence.origin.sessionId) || !['turn', 'turnStartSeq', 'turnEndSeq'].every(key => integer(evidence.origin[key])) || !text(evidence.requestedTask) || !text(evidence.contentHash) || !Array.isArray(evidence.events) || !strings(evidence.limitations)) throw new Error('Invalid capture evidence')
  if (!evidence.events.every((event: any) => object(event) && integer(event.seq) && text(event.kind) && text(event.text) && text(event.hash))) throw new Error('Invalid capture evidence events')
  if (value.prepared !== undefined && (!object(value.prepared) || !Array.isArray(value.prepared.files) || !value.prepared.files.every((file: any) => object(file) && text(file.path) && (file.before === null || text(file.before)) && text(file.after)) || !text(value.prepared.patchHash) || !text(value.prepared.rulesHash))) throw new Error('Invalid prepared capture')
  if (value.schemaVersion === undefined) return { ...value, schemaVersion: 2, historyCoverage: 'legacy_snapshot', events: [{ seq: 1, at: value.updatedAt, kind: 'legacy_snapshot', phase: value.phase, reason: value.reason }], judgments: [] } as unknown as CaptureJob
  if (value.schemaVersion !== 2 || !['complete', 'legacy_snapshot'].includes(value.historyCoverage) || !Array.isArray(value.events) || !Array.isArray(value.judgments) || (value.registeredAt !== undefined && !date(value.registeredAt)) || (value.historyCoverage === 'complete' && !date(value.registeredAt))) throw new Error('Unsupported capture journal format')
  const eventKinds = ['registered', 'phase_changed', 'judgment_started', ...terminal, 'recovery_started', 'publication_finished', 'publication_interrupted', 'operation_failed', 'legacy_snapshot']
  if (value.events.length === 0 || !value.events.every((event: any, index: number) => object(event) && event.seq === index + 1 && date(event.at) && eventKinds.includes(event.kind) && (event.phase === undefined || phases.includes(event.phase)) && (event.reason === undefined || text(event.reason)) && (event.stage === undefined || phases.includes(event.stage)) && (event.error === undefined || (object(event.error) && text(event.error.category) && text(event.error.message))) && (event.durationMs === undefined || (Number.isFinite(event.durationMs) && event.durationMs >= 0)))) throw new Error('Invalid capture event sequence')
  for (const event of value.events) {
    if (['registered', 'phase_changed', 'publication_finished', 'legacy_snapshot', 'operation_failed'].includes(event.kind) && (!event.phase || !text(event.reason))) throw new Error('Missing phase event data')
    if (event.kind === 'operation_failed' && (!event.stage || !event.error)) throw new Error('Missing failure details')
    if (event.kind.startsWith('judgment_') ? !text(event.judgmentId) : event.judgmentId !== undefined) throw new Error('Invalid judgment event identity')
  }
  if (value.historyCoverage === 'complete' && (value.events[0].kind !== 'registered' || value.events[0].at !== value.registeredAt)) throw new Error('Incomplete capture registration')
  const ids = new Set<string>()
  for (const judgment of value.judgments) {
    if (!object(judgment) || !text(judgment.id) || ids.has(judgment.id) || !['assessment', 'verification'].includes(judgment.stage) || !integer(judgment.attempt) || judgment.attempt < 1 || !text(judgment.model) || !text(judgment.rubricVersion) || !text(judgment.requestHash) || !text(judgment.evidenceHash) || !Array.isArray(judgment.questions)) throw new Error('Invalid judgment record')
    ids.add(judgment.id)
    if (!judgment.questions.every((question: any) => object(question) && text(question.id) && text(question.text) && ['choice', 'noul'].includes(question.type) && (question.type !== 'choice' || (Array.isArray(question.options) && question.options.every((option: any) => object(option) && text(option.value) && text(option.description)))))) throw new Error('Invalid judgment questions')
    const events = value.events.filter((event: CaptureEvent) => event.judgmentId === judgment.id)
    const starts = events.filter((event: CaptureEvent) => event.kind === 'judgment_started')
    const ends = events.filter((event: CaptureEvent) => terminal.includes(event.kind))
    if (starts.length !== 1 || ends.length > 1 || (ends[0] && ends[0].seq <= starts[0].seq)) throw new Error('Invalid judgment lifecycle')
    const end = ends[0]?.kind
    if (!end || end === 'judgment_interrupted') { if (judgment.result !== undefined) throw new Error('Unexpected judgment result') }
    else if (!object(judgment.result) || (end === 'judgment_finished' ? judgment.result.kind !== 'decision' || !Array.isArray(judgment.result.answers) || !Array.isArray(judgment.result.gateResults) || !['prepare', 'publish', 'skipped', 'deferred'].includes(judgment.result.disposition) || !text(judgment.result.reason) : judgment.result.kind !== 'error' || !object(judgment.result.error) || !text(judgment.result.error.message))) throw new Error('Invalid judgment outcome')
    const questionIds = new Set(judgment.questions.map((question: any) => question.id))
    if (questionIds.size !== judgment.questions.length) throw new Error('Duplicate judgment question')
    const result = judgment.result
    if (result?.kind === 'decision') {
      if ((judgment.stage === 'assessment' && result.disposition === 'publish') || (judgment.stage === 'verification' && result.disposition === 'prepare')) throw new Error('Invalid stage decision')
      if (!text(result.reasonCode) || (result.requestId !== undefined && !text(result.requestId))) throw new Error('Invalid judgment metadata')
      if (result.usage !== undefined && (!object(result.usage) || !['inputTokens', 'outputTokens'].every(key => result.usage[key] === null || integer(result.usage[key])))) throw new Error('Invalid judgment usage')
      if (result.answers.length !== judgment.questions.length || new Set(result.answers.map((answer: any) => answer?.id)).size !== questionIds.size) throw new Error('Invalid judgment answers')
      for (const answer of result.answers) {
        const question = judgment.questions.find((entry: any) => entry.id === answer?.id)
        if (!object(answer) || !question || question.type !== answer.type) throw new Error('Invalid judgment answer')
        if (answer.type === 'noul') { if (!probability(answer.value)) throw new Error('Invalid Noul answer') }
        else if (!text(answer.choice) || !question.options.some((option: any) => option.value === answer.choice) || !probability(answer.confidence) || !Array.isArray(answer.probabilities) || answer.probabilities.length !== question.options.length || new Set(answer.probabilities.map((entry: any) => entry?.option)).size !== question.options.length || !answer.probabilities.every((entry: any) => object(entry) && question.options.some((option: any) => option.value === entry.option) && probability(entry.probability)) || Math.abs(answer.probabilities.reduce((sum: number, entry: any) => sum + entry.probability, 0) - 1) > .01) throw new Error('Invalid Choice answer')
      }
      if (!result.gateResults.every((gate: any) => object(gate) && text(gate.id) && text(gate.description) && ['gte', 'eq'].includes(gate.operator) && primitive(gate.actual) && primitive(gate.expected) && typeof gate.passed === 'boolean' && (gate.questionId === undefined || questionIds.has(gate.questionId)) && gate.passed === (gate.operator === 'gte' ? typeof gate.actual === 'number' && typeof gate.expected === 'number' && gate.actual >= gate.expected : gate.actual === gate.expected))) throw new Error('Invalid judgment gates')
    } else if (result?.kind === 'error' && (!text(result.error.category) || (result.error.httpStatus !== undefined && !integer(result.error.httpStatus)))) throw new Error('Invalid judgment error')
  }
  if (value.events.some((event: CaptureEvent) => event.kind.startsWith('judgment_') && !ids.has(event.judgmentId ?? ''))) throw new Error('Unknown judgment event')
  const latest = [...value.events].reverse().find((event: CaptureEvent) => event.phase !== undefined)
  if (!latest || latest.phase !== value.phase || latest.reason !== value.reason || value.events.at(-1).at !== value.updatedAt) throw new Error('Capture summary differs from its events')
  return value as CaptureJob
}

/** One disk authority for collection, latest cards and read-only history. Writers hold the existing job/register lock. */
export class JournalWriteError extends Error {}

export class CaptureJournal {
  private readonly liveIssues = new Map<string, CaptureIssue>()
  constructor(readonly root?: string) {}

  issue(sessionId: string): CaptureIssue | undefined {
    const current = this.liveIssues.get(sessionId)
    if (current) return { ...current }
    if (!this.root) return undefined
    try {
      const value = JSON.parse(fs.readFileSync(under(this.root, `watched/${hash(sessionId)}.json`), 'utf8'))
      if (value.sessionId !== sessionId || !object(value.lastIssue) || !date(value.lastIssue.at) || !['collecting', 'worker_lock', 'journal_write'].includes(value.lastIssue.stage) || !text(value.lastIssue.code) || !text(value.lastIssue.message)) return undefined
      return { at: value.lastIssue.at, stage: value.lastIssue.stage, code: value.lastIssue.code, message: redact(value.lastIssue.message).slice(0, 500), persisted: true, ...(integer(value.lastIssue.turnEndSeq) ? { turnEndSeq: value.lastIssue.turnEndSeq } : {}), ...(text(value.lastIssue.jobId) ? { jobId: value.lastIssue.jobId } : {}) }
    } catch { return undefined }
  }

  rememberIssue(sessionId: string, issue?: CaptureIssue): void {
    if (issue) this.liveIssues.set(sessionId, { ...issue })
    else this.liveIssues.delete(sessionId)
  }

  scan(): { jobs: CaptureJob[]; history: 'readable' | 'degraded' | 'unavailable' } {
    if (!this.root) return { jobs: [], history: 'readable' }
    let names: string[]
    try { names = fs.readdirSync(this.root) } catch (error: any) { return { jobs: [], history: error.code === 'ENOENT' ? 'readable' : 'unavailable' } }
    const jobs: CaptureJob[] = []
    let history: 'readable' | 'degraded' = 'readable'
    for (const name of names) {
      if (!/^[a-f0-9]{64}\.json$/.test(name)) { if (name.endsWith('.json')) history = 'degraded'; continue }
      try { jobs.push(this.load(name.slice(0, -5))) } catch { history = 'degraded' }
    }
    return { jobs, history }
  }

  load(id: string): CaptureJob {
    if (!this.root || !idPattern.test(id)) throw new Error('Capture record unavailable')
    return normalize(JSON.parse(fs.readFileSync(under(this.root, `${id}.json`), 'utf8')), id)
  }

  save(job: CaptureJob): void {
    if (!this.root) throw new Error('Capture storage not configured')
    normalize(job, job.jobId)
    try { atomicWrite(under(this.root, `${job.jobId}.json`), JSON.stringify(job)) } catch { throw new JournalWriteError('采集记录写入失败，后续处理已停止') }
  }

  append(job: CaptureJob, event: Omit<CaptureEvent, 'seq' | 'at'>): void {
    const at = new Date().toISOString()
    job.events.push({ ...event, seq: job.events.length + 1, at })
    if (event.phase !== undefined) { job.phase = event.phase; job.reason = event.reason ?? job.reason }
    job.updatedAt = at
    this.save(job)
  }

  start(job: CaptureJob, stage: CaptureJudgmentStage, request: JudgmentRequest): string {
    const id = randomUUID()
    const attempt = job.judgments.filter(value => value.stage === stage).length + 1
    job.judgments.push({ id, stage, attempt, ...request, evidenceHash: job.evidence.contentHash, rubricVersion: job.rubricVersion, ...(stage === 'verification' ? { patchHash: job.prepared?.patchHash } : {}) })
    this.append(job, { kind: 'judgment_started', judgmentId: id })
    return id
  }

  finish(job: CaptureJob, id: string, result: JudgmentAudit | { kind: 'error'; error: { category: string; message: string; httpStatus?: number } }, durationMs: number): void {
    const judgment = job.judgments.find(value => value.id === id)
    if (!judgment || job.events.some(event => event.judgmentId === id && terminal.includes(event.kind))) throw new Error('Judgment already ended')
    judgment.result = result
    this.append(job, { kind: result.kind === 'decision' ? 'judgment_finished' : 'judgment_failed', judgmentId: id, durationMs })
  }

  recover(job: CaptureJob): void {
    for (const judgment of job.judgments) if (!job.events.some(event => event.judgmentId === judgment.id && terminal.includes(event.kind))) this.append(job, { kind: 'judgment_interrupted', judgmentId: judgment.id })
    this.append(job, { kind: 'recovery_started' })
  }

  private lifecycle(job: CaptureJob, id: string): CaptureJudgmentSummary {
    const judgment = job.judgments.find(value => value.id === id)!
    const events = job.events.filter(event => event.judgmentId === id)
    const start = events.find(event => event.kind === 'judgment_started')!
    const end = events.find(event => terminal.includes(event.kind))
    const result = judgment.result
    return { id, stage: judgment.stage, attempt: judgment.attempt, model: judgment.model, state: end?.kind === 'judgment_finished' ? 'completed' : end?.kind === 'judgment_failed' ? 'failed' : end ? 'interrupted' : 'started', startedAt: start.at,
      ...(end ? { finishedAt: end.at, ...(end.durationMs === undefined ? {} : { durationMs: end.durationMs }) } : {}),
      ...(result?.kind === 'decision' ? { disposition: result.disposition, reason: redact(result.reason) } : result?.kind === 'error' ? { reason: redact(result.error.message) } : {}),
    }
  }

  private summary(job: CaptureJob): CaptureSummary {
    let task = job.evidence.requestedTask
    try {
      const content: unknown = JSON.parse(task.split('\n')[0] ?? '')
      if (Array.isArray(content)) task = content.filter(block => object(block) && block.type === 'text' && text(block.text)).map(block => block.text).join('\n')
      else if (text(content)) task = content
    } catch { /* Legacy evidence may already contain plain text. */ }
    const raw = redact(task).trim().split('\n')[0] ?? ''
    const latest = (['assessment', 'verification'] as const).flatMap(stage => { const value = job.judgments.filter(judgment => judgment.stage === stage).at(-1); return value ? [this.lifecycle(job, value.id)] : [] })
    return { jobId: job.jobId, phase: job.phase, reason: redact(job.reason), pages: [...job.pages], updatedAt: job.updatedAt, ...(job.registeredAt ? { registeredAt: job.registeredAt } : {}), historyCoverage: job.historyCoverage, origin: { sessionId: job.evidence.origin.sessionId, turn: job.evidence.origin.turn, turnStartSeq: job.evidence.origin.turnStartSeq, turnEndSeq: job.evidence.origin.turnEndSeq }, task: raw.slice(0, 120), taskTruncated: raw.length > 120, evidenceHash: job.evidence.contentHash, rubricVersion: job.rubricVersion,
      ...(job.prepared ? { rulesHash: job.prepared.rulesHash, patchHash: job.prepared.patchHash } : {}), lastEventSeq: job.events.length, ...(job.retryable ? { retryable: true } : {}), ...([...job.events].reverse().find(event => ['publication_finished', 'publication_interrupted'].includes(event.kind))?.kind === 'publication_interrupted' || (job.retryable && job.phase === 'failed') ? { publicationUncertain: true } : {}), judgments: latest }
  }

  latest(sessionId: string): CaptureView | undefined {
    const job = this.scan().jobs.filter(value => value.evidence.origin.sessionId === sessionId).sort((a, b) => b.evidence.origin.turnEndSeq - a.evidence.origin.turnEndSeq)[0]
    if (!job) return undefined
    return { jobId: job.jobId, phase: job.phase, reason: redact(job.reason), pages: [...job.pages], updatedAt: job.updatedAt, ...this.preview(job) }
  }

  private preview(job: CaptureJob) {
    return { evidence: job.evidence.events.slice(0, 12).map(event => ({ seq: event.seq, kind: event.kind, text: redact(event.text).slice(0, 1000), truncated: event.text.length > 1000 })), evidenceTruncated: job.evidence.events.length > 12, limitations: job.evidence.limitations.map(redact), changes: job.prepared?.files.map(file => ({ path: file.path, ...(file.before === null ? {} : { beforeHash: hash(file.before) }), afterHash: hash(file.after) })) ?? [] }
  }

  list(input: CaptureHistoryInput): CaptureHistoryResult {
    const empty: CaptureHistoryResult = { items: [], readCompleteness: 'complete' }
    const limit = input.limit ?? 20
    if (!integer(limit) || limit < 1 || limit > 50) return { ...empty, error: { code: 'capture-invalid-query', field: 'limit' } }
    if (input.status !== undefined && !Object.hasOwn(statuses, input.status)) return { ...empty, error: { code: 'capture-invalid-query', field: 'status' } }
    let cursor: { sessionId: string; status?: string; upper: number; seq: number; id: string } | undefined
    if (input.cursor !== undefined) {
      try {
        if (input.cursor.length > 1024) throw new Error('oversized')
        cursor = JSON.parse(Buffer.from(input.cursor, 'base64url').toString())
        if (!cursor || cursor.sessionId !== input.sessionId || cursor.status !== input.status || !integer(cursor.upper) || !integer(cursor.seq) || cursor.seq > cursor.upper || !idPattern.test(cursor.id)) throw new Error('invalid')
      } catch { return { ...empty, error: { code: 'capture-invalid-query', field: 'cursor' } } }
    }
    const scan = this.scan()
    if (scan.history === 'unavailable') return { ...empty, readCompleteness: 'partial', error: { code: 'capture-unavailable' } }
    const all = scan.jobs.filter(job => job.evidence.origin.sessionId === input.sessionId).sort((a, b) => b.evidence.origin.turnEndSeq - a.evidence.origin.turnEndSeq || b.jobId.localeCompare(a.jobId))
    const upper = cursor?.upper ?? all[0]?.evidence.origin.turnEndSeq ?? 0
    const selected = all.filter(job => job.evidence.origin.turnEndSeq <= upper && (!input.status || statuses[input.status].includes(job.phase)) && (!cursor || job.evidence.origin.turnEndSeq < cursor.seq || (job.evidence.origin.turnEndSeq === cursor.seq && job.jobId < cursor.id)))
    const page = selected.slice(0, limit)
    const last = page.at(-1)
    return { items: page.map(job => this.summary(job)), readCompleteness: scan.history === 'readable' ? 'complete' : 'partial', ...(selected.length > limit && last ? { nextCursor: Buffer.from(JSON.stringify({ sessionId: input.sessionId, ...(input.status ? { status: input.status } : {}), upper, seq: last.evidence.origin.turnEndSeq, id: last.jobId })).toString('base64url') } : {}) }
  }

  record(input: CaptureRecordInput): CaptureRecordResult {
    const empty: CaptureRecordResult = { events: [], judgments: [], evidence: [], evidenceTruncated: false, limitations: [], changes: [] }
    const limit = input.limit ?? 50
    if (!integer(limit) || limit < 1 || limit > 100) return { ...empty, error: { code: 'capture-invalid-query', field: 'limit' } }
    if (input.afterEventSeq !== undefined && !integer(input.afterEventSeq)) return { ...empty, error: { code: 'capture-invalid-query', field: 'event-seq' } }
    let job: CaptureJob
    try { job = this.load(input.jobId); if (job.evidence.origin.sessionId !== input.sessionId) throw new Error('scope') } catch { return { ...empty, error: { code: 'capture-record-unavailable' } } }
    const remaining = job.events.filter(event => event.seq > (input.afterEventSeq ?? 0))
    const events = remaining.slice(0, limit)
    const ids = new Set(events.map(event => event.judgmentId).filter(Boolean))
    return { summary: this.summary(job), events: events.map(event => ({ seq: event.seq, at: event.at, kind: event.kind, ...(event.phase ? { phase: event.phase } : {}), ...(event.reason ? { reason: redact(event.reason) } : {}), ...(event.judgmentId ? { judgmentId: event.judgmentId } : {}), ...(event.stage ? { stage: event.stage } : {}), ...(event.error ? { error: { category: event.error.category, message: redact(event.error.message) } } : {}), ...(event.durationMs === undefined ? {} : { durationMs: event.durationMs }) })), judgments: [...ids].map(id => this.lifecycle(job, id!)), ...this.preview(job), ...(remaining.length > limit ? { nextEventSeq: events.at(-1)!.seq } : {}) }
  }

  private projectJudgment(value: CaptureJudgmentRecord): CaptureJudgmentRecord {
    const result = value.result
    return { id: value.id, stage: value.stage, attempt: value.attempt, model: value.model, rubricVersion: value.rubricVersion, requestHash: value.requestHash, evidenceHash: value.evidenceHash,
      ...(value.patchHash ? { patchHash: value.patchHash } : {}),
      questions: value.questions.map(question => ({ id: question.id, type: question.type, text: redact(question.text), ...(question.options ? { options: question.options.map(option => ({ value: option.value, description: redact(option.description) })) } : {}) })),
      ...(result ? { result: result.kind === 'error' ? { kind: 'error' as const, error: { category: result.error.category, message: redact(result.error.message), ...(result.error.httpStatus === undefined ? {} : { httpStatus: result.error.httpStatus }) } } : {
        kind: 'decision' as const, disposition: result.disposition, reason: redact(result.reason), reasonCode: result.reasonCode,
        answers: result.answers.map(answer => answer.type === 'noul' ? { id: answer.id, type: 'noul' as const, value: answer.value } : { id: answer.id, type: 'choice' as const, choice: answer.choice, confidence: answer.confidence, probabilities: answer.probabilities.map(entry => ({ option: entry.option, probability: entry.probability })) }),
        gateResults: result.gateResults.map(gate => ({ id: gate.id, description: redact(gate.description), operator: gate.operator, actual: typeof gate.actual === 'string' ? redact(gate.actual) : gate.actual, expected: typeof gate.expected === 'string' ? redact(gate.expected) : gate.expected, passed: gate.passed, ...(gate.questionId ? { questionId: gate.questionId } : {}) })),
        ...(result.usage ? { usage: { inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens } } : {}), ...(result.requestId ? { requestId: redact(result.requestId) } : {}),
      } } : {}),
    }
  }

  judgment(input: CaptureJudgmentInput): CaptureJudgmentResult {
    try {
      const job = this.load(input.jobId)
      const judgment = job.judgments.find(value => value.id === input.judgmentId)
      if (job.evidence.origin.sessionId !== input.sessionId || !judgment) throw new Error('scope')
      return { judgment: this.projectJudgment(judgment), lifecycle: this.lifecycle(job, judgment.id) }
    } catch { return { error: { code: 'capture-record-unavailable' } } }
  }
}
