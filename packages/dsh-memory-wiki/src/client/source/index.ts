/**
 * The single switch point between a registered fixture and the real Remote.
 *
 * Change SOURCE_MODE (or pass a mode to createSource) and the panel runs on the
 * other implementation; nothing else in the panel knows which one it is.
 *
 * P3b moved the fixture implementation OUT of `src/client`: the production
 * bundle must not ship example knowledge. It is therefore *injected*:
 *   - tests/dev: `registerFixtureSource(() => createFixtureSource())`
 *   - production: nothing registers, so fixture mode fails with a typed
 *     `fixture-not-bundled` error instead of quietly showing stale demo pages.
 * No fixture module is imported here — not statically, not dynamically.
 */
import { createRemoteSource } from './remote-source.js'
import { RemoteCallError } from './unwrap.js'
import type { MemoryWikiSource, RemoteClient, SourceMode } from './types.js'

/** P3b: the panel reads the host's server view. */
export const SOURCE_MODE: SourceMode = 'remote'

export const REMOTE_NOT_WIRED_REASON = 'host codec client is mounted in P3b'

/**
 * Injection point for a dev/test fixture source.
 *
 * Only a test or a dev harness should call this. It exists so the fixture path
 * stays exercisable without putting fixture data back into the production import
 * graph, and `tests/client-seam.test.mjs` uses it to compare fixture and remote
 * DTO mapping.
 */
let fixtureFactory: (() => MemoryWikiSource) | undefined

export function registerFixtureSource(factory: () => MemoryWikiSource): void {
  fixtureFactory = factory
}

/** True when a fixture source was injected (never true in production). */
export function hasRegisteredFixtureSource(): boolean {
  return fixtureFactory !== undefined
}

/**
 * Fixture mode without a registered factory.
 *
 * Fails loudly and typed on every call: a silent empty panel would look like a
 * successful load, and synthetic demo data here would be worse than an error.
 */
function unregisteredFixtureSource(reason: string): MemoryWikiSource {
  const fail = (): never => {
    throw new RemoteCallError('fixture-not-bundled', reason)
  }
  return {
    mode: 'fixture',
    async getGraph() {
      return fail()
    },
    async getView() {
      return fail()
    },
    async search() {
      return fail()
    },
    async readPage() {
      return fail()
    },
  }
}

export function createSource(mode: SourceMode = SOURCE_MODE, remote?: RemoteClient): MemoryWikiSource {
  if (mode === 'remote') return createRemoteSource(remote, REMOTE_NOT_WIRED_REASON)
  if (fixtureFactory !== undefined) return fixtureFactory()
  return unregisteredFixtureSource('no fixture source registered; production bundles none')
}

export type { MemoryWikiSource, RemoteClient, SourceMode }
export * from './types.js'
