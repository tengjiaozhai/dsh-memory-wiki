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
  ClearOverrideInput,
  ClearResult,
  DraftResult,
  GetViewInput,
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

    // Registered on this plugin's own context: unloading the entry removes both
    // the section and the listeners, so a disabled plugin leaves nothing behind.
    ctx.effect(() => this.adapter.installSystemSection())
    ctx.on('agent/pre-step', (payload: any, next: () => Promise<any>) => this.adapter.preStep(payload, next))
    ctx.on('session/event', (session: any, event: any) => this.adapter.observe(session, event))
  }

  /**
   * Read the current panel view for one authorized session.
   * @param input - session reference and the revision the client already shows.
   * @returns mode, draft, prepared snapshot and the current turn record.
   */
  @Remote('view')
  async getView(input: GetViewInput): Promise<SessionView> {
    return this.adapter.getView(input)
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
   * @param input - session, page id and the content hash the client saw.
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
