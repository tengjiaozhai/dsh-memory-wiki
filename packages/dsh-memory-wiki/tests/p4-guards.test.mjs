/**
 * tests/p4-guards.test.mjs — two guards for silent contract drift.
 *
 * Why these exist: an outdated artifact and a silently narrowed result schema
 * both look fine to a human reading the panel — a client once read a stale
 * typert.remote-client.js and reported a "contract gap" that was really a
 * missing rebuild. Nothing in the repo noticed. These two tests do:
 *
 *   GUARD 1 (freshness) — the generated artifacts must not be older than any
 *   file their schema is derived from. Failure means "忘了 rebuild": run
 *   `pnpm -C packages/dsh-memory-wiki build`.
 *
 *   GUARD 2 (coverage) — for every Remote method, the keys the server actually
 *   returns must be a SUBSET of the keys the generated result schema declares.
 *   Output codecs are not enforced on the send path, so an undeclared key would
 *   be silently dropped or leaked at the wire boundary; this test makes it loud.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

const PKG_ROOT = path.join(import.meta.dirname, '..')
const LIB = path.join(PKG_ROOT, 'lib')
const FIXTURE = path.join(import.meta.dirname, 'fixtures', 'p3-library')

/** Files whose contents shape the generated artifacts. */
const SCHEMA_SOURCES = [
  'src/shared/contracts.ts',
  'src/core/types.ts',
  'src/server/index.ts',
  'src/server/dsh-adapter.ts',
]

const GENERATED = [
  'lib/typert.host.js',
  'lib/typert.remote-client.js',
]

const mtime = relative => fs.statSync(path.join(PKG_ROOT, relative)).mtimeMs

// ---------------------------------------------------------------- GUARD 1

test('GUARD 1 产物新鲜度：生成产物不得早于其来源文件（失败 = 忘了 rebuild）', () => {
  const stale = []
  for (const artifact of GENERATED) {
    const artifactAt = mtime(artifact)
    for (const source of SCHEMA_SOURCES) {
      const sourceAt = mtime(source)
      if (artifactAt < sourceAt) {
        stale.push(artifact + ' (' + new Date(artifactAt).toISOString() + ') 早于 ' + source + ' (' + new Date(sourceAt).toISOString() + ')')
      }
    }
  }
  assert.deepEqual(
    stale,
    [],
    '生成产物过期（忘了 rebuild）。请先执行 pnpm -C packages/dsh-memory-wiki build，再跑测试:\n' + stale.join('\n'),
  )
})

// ---------------------------------------------------------------- GUARD 2

const { TYPERT } = await import(pathToFileURL(path.join(LIB, 'typert.host.js')).href)
const { MemoryWikiAdapter } = await import(pathToFileURL(path.join(LIB, 'server', 'index.js')).href)

const SESSION = 'session-test-1'
const ctx = { sessions: { get: id => (id === SESSION ? { id } : undefined) } }

/** Declared top-level keys of one method's generated result schema. */
function declaredResultKeys(method) {
  const descriptor = TYPERT.invocations.find(invocation => invocation.method === method)
  assert.ok(descriptor, 'generated artifact must declare memoryWiki/' + method)
  const schema = descriptor.result.create()
  assert.ok(schema?.shape !== undefined, 'result schema must be an object schema for memoryWiki/' + method)
  return new Set(Object.keys(schema.shape))
}

/** Every distinct output the server can actually produce for one method. */
async function runtimeOutputs() {
  const outputs = new Map()
  const record = (method, label, value) => {
    const list = outputs.get(method) ?? []
    list.push({ label, keys: new Set(Object.keys(value)) })
    outputs.set(method, list)
  }

  const a = new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: FIXTURE, budgetChars: 4000 }, {
    build: () => ({
      snapshotId: 'sw_probe', libraryRevision: 'rev-1', origin: 'automatic', budgetChars: 4000,
      sources: [], text: 'probe text', payloadHash: 'hash-probe', chars: 10,
    }),
  })
  const agent = { id: SESSION, session: { id: SESSION, deriveMessages: () => [] } }

  // view: 空 / 草稿 / 待用 / 当前轮 / 错误 五个分支
  record('view', 'fresh', await a.getView({ sessionId: SESSION, expectedRevision: 1 }))
  const page = await a.readPage({ sessionId: SESSION, pageId: 'wiki/concepts/短页' })
  const drafted = await a.reviseDraft({
    sessionId: SESSION, expectedRevision: 1, query: '短页',
    selectedPages: [{ pageId: page.page.pageId, contentHash: page.page.contentHash }], budgetChars: 4000, hops: 1,
  })
  record('view', 'with-draft', await a.getView({ sessionId: SESSION, expectedRevision: drafted.revision }))
  const prepared = await a.prepareOverride({ sessionId: SESSION, expectedRevision: drafted.revision })
  record('view', 'with-prepared', await a.getView({ sessionId: SESSION, expectedRevision: prepared.revision }))
  await a.preStep({ agent, turn: 1, step: 1 }, async () => ({ kind: 'enter', messages: [{ id: 'h', role: 'user', content: [{ type: 'text', text: 'q' }], source: { kind: 'user' } }] }))
  record('view', 'with-currentTurn', await a.getView({ sessionId: SESSION, expectedRevision: prepared.revision }))
  record('view', 'error', await a.getView({ sessionId: SESSION, expectedRevision: 1 }))

  record('search', 'ok', await a.search({ sessionId: SESSION, query: '短页', hops: 1 }))
  record('search', 'error', await a.search({ sessionId: 'nope', query: 'x', hops: 1 }))

  record('readPage', 'ok', await a.readPage({ sessionId: SESSION, pageId: 'wiki/concepts/短页' }))
  record('readPage', 'error', await a.readPage({ sessionId: SESSION, pageId: 'wiki/concepts/不存在' }))

  record('reviseDraft', 'ok', drafted)
  record('reviseDraft', 'error', await a.reviseDraft({
    sessionId: SESSION, expectedRevision: 1, query: 'x', selectedPages: [], budgetChars: 4000, hops: 1,
  }))

  record('prepareOverride', 'ok', prepared)
  record('prepareOverride', 'error', await new MemoryWikiAdapter(ctx, { enabled: true, wikiRoot: FIXTURE, budgetChars: 4000 }).prepareOverride({ sessionId: SESSION, expectedRevision: 1 }))

  record('clearOverride', 'ok', await a.clearOverride({ sessionId: SESSION, expectedRevision: prepared.revision }))
  record('clearOverride', 'error', await a.clearOverride({ sessionId: 'nope', expectedRevision: 1 }))

  return outputs
}

test('GUARD 2 schema 覆盖：运行时不得返回未声明的键（否则类型比运行时窄）', async () => {
  const outputs = await runtimeOutputs()
  const declared = Object.fromEntries(TYPERT.invocations.map(i => [i.method, declaredResultKeys(i.method)]))
  assert.deepEqual(Object.keys(declared).sort(), ['clearOverride', 'prepareOverride', 'readPage', 'reviseDraft', 'search', 'view'])

  const violations = []
  for (const [method, cases] of outputs) {
    for (const { label, keys } of cases) {
      const extra = [...keys].filter(key => !declared[method].has(key))
      if (extra.length > 0) {
        violations.push('memoryWiki/' + method + ' (' + label + ') 返回了未声明的键: ' + extra.join(', ') + ' —— 请在 src/shared/contracts.ts 补类型，不要靠 output 侧 additionalProperties 放过')
      }
    }
  }
  assert.deepEqual(violations, [], '运行时比声明宽：\n' + violations.join('\n'))
})

test('GUARD 2 view 的可选键确实被声明（draft/prepared/currentTurn）', () => {
  const keys = declaredResultKeys('view')
  for (const optionalKey of ['draft', 'prepared', 'currentTurn', 'skippedReason', 'error']) {
    assert.ok(keys.has(optionalKey), 'view result schema must declare ' + optionalKey)
  }
  assert.ok(keys.has('budgetChars') && keys.has('hops'), 'view result schema must declare budgetChars/hops')
})

// ---------------------------------------------------------------- GUARD 3

/** Client-side JS files that may exist under lib/ (everything else is a chunk). */
const ALLOWED_CLIENT_FILES = new Set(['client.js'])

/** Server-side prefixes that are loaded by Node, where chunking is fine. */
const NODE_SIDE_PREFIXES = ['server/', 'shared/']
const NODE_SIDE_FILES = new Set(['typert.host.js', 'typert.remote-client.js'])

function listLibJs(relative = 'lib', accumulator = []) {
  for (const entry of fs.readdirSync(path.join(PKG_ROOT, relative), { withFileTypes: true })) {
    const next = relative + '/' + entry.name
    if (entry.isDirectory()) listLibJs(next, accumulator)
    else if (entry.name.endsWith('.js')) accumulator.push(next)
  }
  return accumulator
}

test('GUARD 3 客户端必须是单文件：lib/ 下不得出现 client 之外的 chunk', () => {
  const violations = []
  for (const file of listLibJs()) {
    const relative = file.replace(/^lib\//, '')
    if (ALLOWED_CLIENT_FILES.has(relative)) continue
    if (NODE_SIDE_FILES.has(relative)) continue
    if (NODE_SIDE_PREFIXES.some(prefix => relative.startsWith(prefix))) continue
    violations.push(file)
  }
  assert.deepEqual(
    violations,
    [],
    '宿主没有相对文件解析（__ModuleLoader__ 的 require 只认平台种子表），客户端 chunk 在 activate 期必然 import failed，' +
      '而编译期看不出来。请在 client 构建项加 outputOptions: { inlineDynamicImports: true }，不要新增 chunk：\n' +
      violations.join('\n'),
  )
})

test('GUARD 3 单文件：lib/client.js 内不得 require 相对路径', () => {
  const code = fs.readFileSync(path.join(LIB, 'client.js'), 'utf8')
  const hits = code.match(/require\("\.\//g) ?? []
  assert.equal(
    hits.length,
    0,
    'lib/client.js 出现 ' + hits.length + ' 处 require("./…")：宿主没有相对文件解析器，这行在运行时就是 import failed。' +
      '请用 outputOptions: { inlineDynamicImports: true } 把依赖内联进单文件。',
  )
})

test('GUARD 3 打包清单：lib/ 根层只允许 client.js 与 typert 产物，没有 chunk 条目', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'))
  const files = manifest.files ?? []
  assert.ok(files.includes('lib/client.js'), 'client 必须来自 lib/client.js')
  // 根层 .js 条目 = client + 两份 typert 产物；出现任何别的 .js 都等于承认了 chunk
  const rootJs = files.filter(entry => /^lib\/[^/]+\.js$/.test(entry)).sort()
  assert.deepEqual(rootJs, ['lib/client.js', 'lib/typert.host.js', 'lib/typert.remote-client.js'],
    'client 侧只允许 lib/client.js；真要 chunk 必须先改宿主契约（__ModuleLoader__ 无相对文件解析），而不是往 files 里加')
})