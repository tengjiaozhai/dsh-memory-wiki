/**
 * tests/_build.mjs — produce real JS artifacts from src/core and from the
 * client seam before the tests import them.
 *
 * Why not tsdown: the project's build config (plugin/tsdown.config.ts) is the
 * Lead's file, and the test write scope is src/core + tests. This keeps the test
 * contract honest anyway — the tests exercise compiled JS, not a TypeScript
 * loader. When tsdown gains core entries, switch OUT_DIR to ../lib/core in one
 * place (`_load.mjs`).
 *
 * The client seam build exists because P3b moved the fixture implementation out
 * of `src/client`: the consistency test (`client-seam.test.mjs`) has to import
 * BOTH mappings (remote from src/client, fixture from tests/client-fixtures), so
 * both get stripped here into `tests/.build`. No production file is modified.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { stripTypeScriptTypes } from 'node:module'

const here = path.dirname(fileURLToPath(import.meta.url))
export const SRC_DIR = path.join(here, '..', 'src', 'core')
export const OUT_DIR = path.join(here, '.build', 'core')
export const CLIENT_SOURCE_DIR = path.join(here, '.build', 'client-source')
export const CLIENT_FIXTURES_DIR = path.join(here, '.build', 'client-fixtures')

// stripTypeScriptTypes is still flagged experimental on Node 24; the warning
// fires once per test process and would otherwise pollute every test log.
process.removeAllListeners('warning')

function isFresh(src, out) {
  try {
    return fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs
  } catch {
    return false
  }
}

function stripInto(src, out, rewrites) {
  let code = stripTypeScriptTypes(fs.readFileSync(src, 'utf8'), { mode: 'strip' })
  for (const [from, to] of rewrites) code = code.split(from).join(to)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  const tmp = `${out}.${process.pid}.tmp`
  fs.writeFileSync(tmp, code)
  fs.renameSync(tmp, out)
}

/** Strip types for every src/core/*.ts into OUT_DIR (atomic per file). */
export function build({ force = false } = {}) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const rebuilt = []
  const names = fs.readdirSync(SRC_DIR).filter((name) => name.endsWith('.ts')).sort()
  for (const name of names) {
    const src = path.join(SRC_DIR, name)
    const out = path.join(OUT_DIR, name.replace(/\.ts$/, '.js'))
    if (!force && isFresh(src, out)) continue
    stripInto(src, out, [])
    rebuilt.push(name)
  }
  return rebuilt
}

/**
 * Client seam artifacts.
 *
 * Relative specifiers are kept as-is where the two roots share an output
 * directory (`./unwrap.js`); the one runtime core import in the fixture tree is
 * rebased onto the built core (`../core/...`). Type-only imports disappear with
 * the type strip, so no `src/client` module is pulled into the test graph.
 */
const CLIENT_ARTIFACTS = [
  {
    src: path.join(here, '..', 'src', 'client', 'source', 'unwrap.ts'),
    out: path.join(CLIENT_SOURCE_DIR, 'unwrap.js'),
    rewrites: [],
  },
  {
    src: path.join(here, '..', 'src', 'client', 'source', 'remote-source.ts'),
    out: path.join(CLIENT_SOURCE_DIR, 'remote-source.js'),
    rewrites: [],
  },
  {
    src: path.join(here, 'client-fixtures', 'sha256.ts'),
    out: path.join(CLIENT_FIXTURES_DIR, 'sha256.js'),
    rewrites: [],
  },
  {
    src: path.join(here, 'client-fixtures', 'page-docs.ts'),
    out: path.join(CLIENT_FIXTURES_DIR, 'page-docs.js'),
    rewrites: [],
  },
  {
    src: path.join(here, 'client-fixtures', 'wiki-fixture.ts'),
    out: path.join(CLIENT_FIXTURES_DIR, 'wiki-fixture.js'),
    rewrites: [["'../../src/core/markdown.js'", "'../core/markdown.js'"]],
  },
  {
    src: path.join(here, 'client-fixtures', 'fixture-source.ts'),
    out: path.join(CLIENT_FIXTURES_DIR, 'fixture-source.js'),
    rewrites: [],
  },
]

export function buildClientSeam({ force = false } = {}) {
  const rebuilt = []
  for (const artifact of CLIENT_ARTIFACTS) {
    if (!force && isFresh(artifact.src, artifact.out)) continue
    stripInto(artifact.src, artifact.out, artifact.rewrites)
    rebuilt.push(path.relative(here, artifact.out))
  }
  return rebuilt
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const force = process.argv.includes('--force')
  const rebuilt = build({ force })
  const client = buildClientSeam({ force })
  console.log(`core build: ${rebuilt.length} file(s) rebuilt into ${OUT_DIR}`)
  console.log(`client seam build: ${client.length} file(s) rebuilt`)
}
