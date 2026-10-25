/**
 * dsh-memory-wiki — host (server) half.
 *
 * Thin on purpose: this entry declares the Remote service, the config schema and
 * the message-source vocabulary, then hands every host fact to
 * server/dsh-adapter.ts. Retrieval and compilation stay in core/.
 */
import type { UserMessage } from '@deepseek-ai/dsh-llm'
import z from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'

import type {
  CaptureStatusInput, CaptureStatusResult, CaptureHistoryInput, CaptureHistoryResult, CaptureRecordInput, CaptureRecordResult, CaptureJudgmentInput, CaptureJudgmentResult,
  ClearOverrideInput,
  ClearResult,
  DraftResult,
  GetViewInput,
  GraphInput,
  GraphResult,
  MemoryWikiSourceMeta,
  OverrideResult,
  PrepareOverrideInput,
  ReadPageInput,
  ReadPageResult,
  ReviseDraftInput,
  SearchInput,
  SearchResult,
  SessionView,
} from '../shared/contracts.js'
import { MemoryWikiAdapter } from './dsh-adapter.js'
import { createHostCapture, captureDataRoot } from './capture/host.js'
import { COMMANDCODE_BASE_URL, DEFAULT_JEV_MODEL } from './capture/jev.js'
import type { ExperienceCapture } from './capture/experience.js'
import { CaptureJournal } from './capture/journal.js'
import { CaptureHistory } from './capture/history.js'

/**
 * Host message-source vocabulary: declares this plugin's producer kind so
 * `source.kind === 'memory-wiki'` is a durable, reload-readable fact. The
 * augmentation must target the package root and the module must also be
 * imported normally, otherwise TypeScript reports TS2664.
 */
declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    'memory-wiki': MemoryWikiSourceMeta
  }
}

/** Keeps the type import above live; producers are host user-role messages. */
export type ProducerMessage = UserMessage

/**
 * @internal — exported for wiring tests only (tests/p2-adapter, tests/p3-remote).
 * Not part of this package's public API; P4 packaging review decides whether it
 * stays exported.
 */
export { MemoryWikiAdapter } from './dsh-adapter.js'

export const name = 'memory-wiki'

export const Config = z
  .object({
    enabled: z.boolean().default(true),
    wikiRoot: z.string().default(''),
    budgetChars: z.union([z.const(4000), z.const(8000)]).default(4000),
    capture: z.object({
      enabled: z.boolean().default(false),
      judgeModel: z.string().default(DEFAULT_JEV_MODEL),
      judgeBaseURL: z.string().default(COMMANDCODE_BASE_URL),
      skillPath: z.string().default(''),
    }).default({ enabled: false, judgeModel: DEFAULT_JEV_MODEL, judgeBaseURL: COMMANDCODE_BASE_URL, skillPath: '' }),
  })
  .default({ enabled: true, wikiRoot: '', budgetChars: 4000 })

/**
 * Memory Wiki Remote service.
 *
 * Every method re-resolves the session through `ctx.sessions` and checks
 * `expectedRevision`; the client sends no identity of its own.
 */
export default class MemoryWikiService extends TypertRemoteService {
  // typert: Remote registry + generated descriptors. systemPrompt: the fixed
  // library section. sessions: the authority every call is resolved against.
  static inject: string[] = ['typert', 'systemPrompt', 'sessions']

  static Config = Config

  readonly adapter: MemoryWikiAdapter
  private capture?: ExperienceCapture
  private captureState: Pick<CaptureStatusResult, 'collector' | 'reason'> = { collector: 'disabled', reason: '自动采集未启用' }
  readonly captureHistoryReader: CaptureHistory
  private readonly journal: CaptureJournal

  resolved: { enabled: boolean, wikiRoot: string, budgetChars: 4000 | 8000 }

  constructor(ctx: any, config: any = {}) {
    super(ctx, 'memoryWiki')
    const raw = config?.get === undefined ? config : config.get()
    this.resolved = {
      enabled: raw?.enabled ?? true,
      wikiRoot: raw?.wikiRoot ?? '',
      budgetChars: raw?.budgetChars === 8000 ? 8000 : 4000,
    }
    this.adapter = new MemoryWikiAdapter(ctx, this.resolved)
    let dataRoot: string | undefined
    let unavailable = false
    try { if (this.resolved.wikiRoot) dataRoot = captureDataRoot(this.resolved.wikiRoot) } catch { unavailable = true }
    this.journal = new CaptureJournal(dataRoot)
    this.captureHistoryReader = new CaptureHistory(this.journal, id => this.adapter.sessionError(id), () => {
      if (this.captureState.collector !== 'disabled' && (this.journal.scan().history !== 'readable' || this.capture?.blocked)) return { collector: 'blocked', reason: '采集记录异常，新的采集已停止；可读历史仍可查看' }
      return this.captureState
    }, unavailable)
    if (raw?.capture?.enabled === true) this.captureState = { collector: 'blocked', reason: '插件或 Wiki 路径未就绪' }

    // Registered on this plugin's own context: unloading the entry removes both
    // the section and the listeners, so a disabled plugin leaves nothing behind.
    ctx.effect(() => this.adapter.installSystemSection())
    ctx.on('agent/pre-step', (payload: any, next: () => Promise<any>) => this.adapter.preStep(payload, next))
    ctx.on('session/event', (session: any, event: any) => this.adapter.observe(session, event))
    if (raw?.capture?.enabled === true && this.resolved.enabled && this.resolved.wikiRoot) {
      this.captureState = { collector: 'starting', reason: '等待宿主模型与会话读取服务' }
      ctx.inject(['llm', 'sessionQuery'], (captureContext: any) => {
        try {
          this.capture = createHostCapture(captureContext, this.resolved.wikiRoot, {
            enabled: true, judgeModel: raw.capture.judgeModel ?? DEFAULT_JEV_MODEL, judgeBaseURL: raw.capture.judgeBaseURL ?? COMMANDCODE_BASE_URL, skillPath: raw.capture.skillPath ?? '',
          }, { publishing: active => this.adapter.setPublishing(active), published: () => this.adapter.refreshCorpus() })
          this.captureState = { collector: 'ready', reason: '本地采集配置已就绪；远端模型可用性以实际调用结果为准' }
          const capture = this.capture
          captureContext.on('session/event', (session: any, event: any) => capture.observe(session, event))
          captureContext.effect(() => async () => { await capture.dispose(); if (this.capture === capture) { this.capture = undefined; this.captureState = { collector: 'starting', reason: '等待宿主采集服务恢复' } } })
          void capture.recover().catch((error: Error) => captureContext.logger?.warn?.(error.message))
        }
        catch (error) {
          this.captureState = { collector: 'blocked', reason: '采集初始化失败，请检查模型凭据、skillPath 与存储配置' }
        }
      })
    }
  }

  /**
   * Read the current panel view for one authorized session.
   * @param input - session reference and the revision the client already shows.
   * @returns mode, draft, prepared snapshot and the current turn record.
   */
  @Remote('view')
  async getView(input: GetViewInput): Promise<SessionView> {
    const view = await this.adapter.getView(input)
    if (view.error) return view
    const capture = this.journal.latest(input.sessionId)
    return capture ? { ...view, capture } : view
  }

  @Remote('captureStatus')
  async captureStatus(input: CaptureStatusInput): Promise<CaptureStatusResult> {
    const result = this.captureHistoryReader.status(input)
    if (!result.error && input.sessionId) result.lastIssue = this.capture?.getIssue(input.sessionId) ?? result.lastIssue
    return result
  }

  @Remote('captureHistory')
  async captureHistory(input: CaptureHistoryInput): Promise<CaptureHistoryResult> { return this.captureHistoryReader.list(input) }

  @Remote('captureRecord')
  async captureRecord(input: CaptureRecordInput): Promise<CaptureRecordResult> { return this.captureHistoryReader.record(input) }

  @Remote('captureJudgment')
  async captureJudgment(input: CaptureJudgmentInput): Promise<CaptureJudgmentResult> { return this.captureHistoryReader.judgment(input) }

  /** Read all library page metadata and resolved links without a session. */
  @Remote('graph')
  async graph(input: GraphInput): Promise<GraphResult> {
    return this.adapter.graph(input)
  }

  /**
   * Run page-level retrieval for one session without changing any state.
   * @param input - session, question and hop count.
   * @returns candidates, edges and the library revision they were taken against.
   */
  @Remote('search')
  async search(input: SearchInput): Promise<SearchResult> {
    return this.adapter.search(input)
  }

  /**
   * Read one page of the current library, optionally pinned to a version.
   * @param input - page id and the content hash the client saw.
   * @returns the page, or a typed error when it is unknown or has changed.
   */
  @Remote('readPage')
  async readPage(input: ReadPageInput): Promise<ReadPageResult> {
    return this.adapter.readPage(input)
  }

  /**
   * Replace the server-owned draft with the user's page selection.
   * @param input - expected revision, query, selection, budget and hops.
   * @returns the new draft, or the actionable reason it could not be compiled.
   */
  @Remote('reviseDraft')
  async reviseDraft(input: ReviseDraftInput): Promise<DraftResult> {
    return this.adapter.reviseDraft(input)
  }

  /**
   * Freeze the current draft into the snapshot the next human turn will carry.
   * @param input - session and expected revision.
   * @returns the prepared snapshot, or the reason it could not be prepared.
   */
  @Remote('prepareOverride')
  async prepareOverride(input: PrepareOverrideInput): Promise<OverrideResult> {
    return this.adapter.prepareOverride(input)
  }

  /**
   * Drop a still-unconsumed prepared override and return to automatic selection.
   * @param input - session and expected revision.
   * @returns the automatic mode and the new revision.
   */
  @Remote('clearOverride')
  async clearOverride(input: ClearOverrideInput): Promise<ClearResult> {
    return this.adapter.clearOverride(input)
  }
}
