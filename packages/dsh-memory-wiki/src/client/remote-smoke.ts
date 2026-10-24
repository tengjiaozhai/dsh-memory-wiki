/**
 * The host's generated Typert contribution, mounted onto `remote`.
 *
 * Only two things live here now (P4 hardening, D6/D9/D13):
 *   - `mountRemoteSmoke` — the REAL production mount of the generated client;
 *   - `createLazyRemoteClient` — the seam's transport facade.
 *
 * The P3b probe (a page-global instrumentation object, one-shot view calls with
 * a revision, strict-codec experiments) is gone: it recorded the user's session
 * key into a page global, and none of it is product state.
 */
import TYPERT_REMOTE from 'dsh-memory-wiki/remote'
import type { RemoteClient } from './source/types.js'

/** Namespace method names as the generated contribution exports them. */
type NamespaceMethod =
  | 'graph'
  | 'view'
  | 'search'
  | 'readPage'
  | 'reviseDraft'
  | 'prepareOverride'
  | 'clearOverride'
type NamespaceFunction = (input: unknown) => Promise<unknown>
type Namespace = Partial<Record<NamespaceMethod, NamespaceFunction>>

type Disposer = () => Promise<void>

type RemoteService = {
  $mount(contribution: unknown): Promise<Disposer>
  [key: string]: unknown
}

/**
 * Mount the generated contribution and return a disposer bound to the fiber.
 *
 * A mount that resolves after the plugin has already unmounted is disposed
 * immediately, otherwise the namespace would leak with no owner.
 */
export function mountRemoteSmoke(remote: RemoteService): () => void {
  let closed = false
  let dispose: Disposer | undefined

  void (async () => {
    try {
      const disposer = await remote.$mount(TYPERT_REMOTE)
      if (closed) {
        try {
          await disposer()
        } catch {
          /* host already gone */
        }
        return
      }
      dispose = disposer
    } catch (cause) {
      // A failed mount must stay visible instead of looking like "no data yet".
      // The message carries no session id, page path or wiki text (D9).
      console.error('dsh-memory-wiki: remote $mount failed', cause)
    }
  })()

  return () => {
    closed = true
    if (dispose !== undefined) {
      void (async () => {
        try {
          await dispose?.()
        } catch (cause) {
          console.error('dsh-memory-wiki: remote dispose failed', cause)
        }
      })()
    }
  }
}

function isNamespace(value: unknown): value is Namespace {
  return typeof value === 'object' && value !== null
}

/**
 * Resolve the mounted namespace without the inject requirement.
 *
 * A plain `ctx.remote.memoryWiki` read throws "cannot get property
 * remote.memoryWiki without inject" — Cordis resolves service properties
 * through the dependency graph, and this facade deliberately does not declare
 * `remote.memoryWiki` (the seam is the single transport entry). `ctx.get(name,
 * false)` reads the store directly, exactly like the uiSession resolution.
 */
function readNamespace(ctx: unknown): Namespace | undefined {
  const c = ctx as {
    get?(name: string, strict?: boolean): unknown
    reflect?: { get?(name: string, strict?: boolean): unknown }
  }
  for (const name of ['remote.memoryWiki', 'memoryWiki']) {
    try {
      const value = c.get?.(name, false)
      if (isNamespace(value)) return value
    } catch {
      /* try the next name */
    }
    try {
      const value = c.reflect?.get?.(name, false)
      if (isNamespace(value)) return value
    } catch {
      /* try the next name */
    }
  }
  return undefined
}

/**
 * Lazy RemoteClient facade over the mounted namespace (for the seam).
 *
 * Read lazily on every call so a namespace that is mounted after the panel
 * registers (or remounted after a reconnect) is picked up without restarting
 * the plugin. The transport envelope is returned untouched; `unwrap()` in
 * `source/remote-source.ts` is the only place that interprets it.
 */
export function createLazyRemoteClient(ctx: unknown): RemoteClient {
  const call = (method: NamespaceMethod) => async (input: unknown): Promise<unknown> => {
    const ns = readNamespace(ctx)
    const fn = ns?.[method]
    if (typeof fn !== 'function') throw new Error('remote namespace has no ' + method + ' yet')
    return fn(input)
  }
  return {
    graph: call('graph'),
    getView: call('view'),
    search: call('search'),
    readPage: call('readPage'),
    reviseDraft: call('reviseDraft'),
    prepareOverride: call('prepareOverride'),
    clearOverride: call('clearOverride'),
  }
}
