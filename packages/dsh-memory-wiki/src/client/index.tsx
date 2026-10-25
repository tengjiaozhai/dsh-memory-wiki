/**
 * dsh-memory-wiki — client half entry.
 *
 * Loaded by the host module system as a classic script:
 *   window.__ModuleLoader__.load({ id: 'dsh-memory-wiki', factory })
 * and the factory's `require` resolves against the host PLATFORM_MODULES table,
 * so `react` is the host instance, never a second copy.
 *
 * Mounted surfaces: `main` (the panel) and `sidebar.panellist` (its entry).
 * Styles are one <style> element, scoped to .memory-wiki-panel, removed on
 * dispose.
 *
 * P4 hardening (D6/D9/D13): the P0b/P3b probe is gone. No page global, no
 * session key, no view-call log, no style audit — the only thing this entry
 * publishes is the panel itself.
 */
import react from 'react'
import { MemoryPanel, type UiSession } from './MemoryPanel.js'
import { createSource } from './source/index.js'
import { createLazyRemoteClient, mountRemoteSmoke } from './remote-smoke.js'

export const name = 'memory-wiki'

/** Client-side Cordis services this surface needs. `uiSession` is resolved
 * optionally: declaring it in `inject` would hang the fiber on any host that
 * does not provide it, and the panel would never mount. */
export const inject = ['slots']

const PANEL_ID = 'memory-wiki'
export const STYLE_ID = 'dsh-memory-wiki-styles'

type Ctx = {
  slots: { inject(names: string, cb: () => unknown): () => void; register(options: any, component: any): () => void }
  inject?(names: string[], cb: (ctx: Ctx) => (() => void) | void): unknown
  get?(name: string, strict?: boolean): unknown
  reflect?: { get?(name: string, strict?: boolean): unknown }
  effect?(callback: () => (() => void) | void): unknown
  logger?: { info?(msg: string): void; warn?(msg: string): void }
}

/**
 * Optional service read.
 *
 * A Cordis *service* read through the context proxy requires the dependency to
 * be declared in `inject`; an unreduced read throws or waits, which would abort
 * apply() before the panel ever registered. `ctx.get(name, strict)` reads the
 * store without the inject requirement, and `strict: false` also accepts an
 * implementation whose providing fiber is not active yet. All three paths are
 * tried in turn.
 */
function resolveService(ctx: Ctx, name: string): unknown {
  const attempts: Array<() => unknown> = [
    () => ctx.get?.(name, true),
    () => ctx.get?.(name, false),
    () => ctx.reflect?.get?.(name, false),
    () => (ctx as unknown as Record<string, unknown>)[name],
  ]
  for (const read of attempts) {
    try {
      const value = read()
      if (value !== undefined && value !== null) return value
    } catch {
      /* this path is not available on this host; try the next one */
    }
  }
  return undefined
}

function styles(): string {
  // Injected by tsdown `define` (see tsdown.config.ts): the host only loads
  // lib/client.js, so the sheet travels inside the bundle.
  return __MW_PANEL_CSS__
}

function installStyles(): () => void {
  const existing = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  existing?.remove()
  const styleEl = document.createElement('style')
  styleEl.id = STYLE_ID
  styleEl.dataset.memoryWiki = 'client'
  styleEl.textContent = styles()
  document.head.appendChild(styleEl)
  return () => {
    styleEl.remove()
  }
}

const SidebarIcon = () => react.createElement('span', { title: '记忆 Wiki', style: { fontSize: 14, lineHeight: 1 } }, '◈')

export function apply(ctx: Ctx) {
  try {
    // Resolved *inside* the slot inject callback (i.e. when the host renders the
    // panel), because services provided after this plugin's fiber activates are
    // not in the store yet at apply() time.
    const getUiSession = () => resolveService(ctx, 'uiSession')

    // The one data-source decision in the whole client half (see source/index.ts).
    const source = createSource(undefined, createLazyRemoteClient(ctx))

    // Mount the generated Typert contribution eagerly on our own fiber, so a
    // mount failure is visible instead of hiding behind "no data".
    if (typeof ctx.inject === 'function') {
      ctx.inject(['remote'], (inner: Ctx) => {
        const remote = resolveService(inner, 'remote') as Parameters<typeof mountRemoteSmoke>[0] | undefined
        if (remote === undefined) {
          console.error('dsh-memory-wiki: ctx.remote missing inside ctx.inject([remote])')
          return
        }
        return mountRemoteSmoke(remote)
      })
    } else {
      console.error('dsh-memory-wiki: ctx.inject is not available; cannot bind $mount to the fiber')
    }

    const install = () => {
      const disposeStyles = installStyles()
      const stopSlots = ctx.slots.inject('main', () =>
        ctx.slots.inject('sidebar.panellist', () => {
          const stopMain = ctx.slots.register(
            {
              name: 'main',
              key: PANEL_ID,
              inject: () => {
                const uiSession = getUiSession() as UiSession | undefined
                return { source, uiSession }
              },
            },
            MemoryPanel,
          )
          const stopIcon = ctx.slots.register(
            { name: 'sidebar.panellist', id: PANEL_ID, order: 44, label: () => '记忆 Wiki', locale: 'memory-wiki' },
            SidebarIcon,
          )
          return () => {
            stopIcon?.()
            stopMain?.()
          }
        }),
      )
      return () => {
        try {
          stopSlots?.()
        } finally {
          disposeStyles()
        }
      }
    }

    if (typeof ctx.effect === 'function') ctx.effect(install)
    else install()
  } catch (error) {
    // A silent apply() failure looks exactly like "never mounted".
    console.error('dsh-memory-wiki: apply failed', error)
    throw error
  }
}

export { MemoryPanel }
