#!/usr/bin/env node
/**
 * 从上游 dsh-workbuddy-connect 重新 vendor 本包的 lib/connect/。
 *
 * 用法：
 *   node scripts/vendor-upstream.mjs [上游包目录]
 *   不传目录时用 ~/.dsh/profiles/desktop/node_modules/dsh-workbuddy-connect。
 *
 * 上游产物原样复制，只改「按包名接线」的标识：浏览器半注册的模块 id、BUNDLE_NAME
 * （Plugins 页按包名派发配置文件页）、配置页 key、Host 半的入口 id 兜底、CLI 报告里
 * 的包名。HTTP 路由前缀 /plugins/dsh-workbuddy-connect/ 刻意不动——Host 半和浏览器
 * 半都写死它，改了反而对不上。
 *
 * 每处替换都断言语义数量，上游一改结构就会立刻失败，而不是静默漏改。
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const ownName = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name
const upstream = process.argv[2] ?? join(homedir(), '.dsh/profiles/desktop/node_modules/dsh-workbuddy-connect')
const upstreamLib = join(upstream, 'lib')
const targetLib = join(root, 'lib/connect')

/** 需要原样复制的上游产物。 */
const FILES = ['index.js', 'client.js', 'index.d.ts', 'bin.js', 'bin.d.ts']
const CHUNK = /^host-heartbeat-.*\.js$/u

/**
 * 一处「按包名接线」的替换：old 必须恰好出现 times 次。
 * @type {Array<{ file: string, old: string, new: string, times: number, why: string }>}
 */
const EDITS = [
  {
    file: 'client.js',
    old: '\tid: "dsh-workbuddy-connect",',
    new: `\tid: "${ownName}",`,
    times: 1,
    why: '浏览器模块 id：宿主 client-modules 按包名找工厂，对不上会 loaded without registering',
  },
  {
    file: 'client.js',
    old: '\t\tconst name = "dsh-workbuddy-connect-client";',
    new: `\t\tconst name = "${ownName}-client";`,
    times: 1,
    why: '浏览器插件名',
  },
  {
    file: 'client.js',
    old: '\t\tconst BUNDLE_NAME = "dsh-workbuddy-connect";',
    new: `\t\tconst BUNDLE_NAME = "${ownName}";`,
    times: 1,
    why: 'BUNDLE_NAME 就是 Plugins 页配置文件的 key',
  },
  {
    file: 'client.js',
    old: '\t\t\t\t\tkey: "dsh-workbuddy-connect",',
    new: `\t\t\t\t\tkey: "${ownName}",`,
    times: 1,
    why: 'plugins.bundle.config 槽的 key：宿主按 bundle 包名派发',
  },
  {
    file: 'index.js',
    old: 'return descriptors.find((row) => row.ns === "dsh-workbuddy-connect")?.ns;',
    new: `return descriptors.find((row) => row.ns === "${ownName}")?.ns;`,
    times: 1,
    why: 'Host 半在拿不到自身 entry id 时按包名兜底找设置表单',
  },
  {
    file: 'bin.js',
    old: 'package: "dsh-workbuddy-connect",',
    new: `package: "${ownName}",`,
    times: 3,
    why: 'CLI 健康报告里的包名',
  },
]

mkdirSync(targetLib, { recursive: true })
const { readdirSync } = await import('node:fs')
const chunks = readdirSync(upstreamLib).filter((name) => CHUNK.test(name))
if (chunks.length !== 1) throw new Error(`expected exactly one host-heartbeat chunk, found ${chunks.length}`)

const copied = [...FILES, ...chunks]
for (const file of copied) copyFileSync(join(upstreamLib, file), join(targetLib, file))

for (const edit of EDITS) {
  const path = join(targetLib, edit.file)
  const text = readFileSync(path, 'utf8')
  const found = text.split(edit.old).length - 1
  if (found !== edit.times) {
    throw new Error(`${edit.file}: expected ${edit.times} occurrence(s) of ${JSON.stringify(edit.old.slice(0, 60))}, found ${found} — upstream layout changed, update EDITS`)
  }
  writeFileSync(path, text.split(edit.old).join(edit.new))
}

// 生成 at-rest 转出模块：上游只在内部用 atRestKeyProviderFor（没对外导出），
// 而备用账号读的同样是「WorkBuddy 5.6 加密信封」，必须带上同一套 discovery。
// 按当前的导出别名转出；上游改名就在这一步直接失败，不会静默失效。
const chunkSource = readFileSync(join(targetLib, chunks[0]), 'utf8')
const exportSection = chunkSource.slice(chunkSource.lastIndexOf('export {'))
const alias = /([A-Za-z_$][\w$]*) as atRestKeyProviderFor\b/u.exec(exportSection)
if (alias === null) {
	throw new Error('the chunk no longer exports atRestKeyProviderFor — update the at-rest shim generation')
}
writeFileSync(
	join(targetLib, 'at-rest.js'),
	[
		'// 由 scripts/vendor-upstream.mjs 生成，请勿手改。',
		'//',
		'// 上游没有对外导出 atRestKeyProviderFor，但备用账号的凭据文件也是 WorkBuddy 5.6 的',
		'// 加密信封，必须用同一套 discovery 才能解出 at-rest 密钥。这里按上游当前的导出',
		'// 别名把它转出来；上游改结构时 vendor 阶段会直接报错。',
		`export { ${alias[1]} as atRestKeyProviderFor } from './${chunks[0]}'`,
		'',
	].join('\n'),
)

// 校验：改名生效、路由前缀没被误伤。
const client = readFileSync(join(targetLib, 'client.js'), 'utf8')
const host = readFileSync(join(targetLib, 'index.js'), 'utf8')
for (const needle of [`id: "${ownName}"`, `const BUNDLE_NAME = "${ownName}";`, `key: "${ownName}"`]) {
  if (!client.includes(needle)) throw new Error(`client.js is missing ${needle}`)
}
for (const source of [client, host]) {
  if (!source.includes('/plugins/dsh-workbuddy-connect/')) throw new Error('route prefix changed unexpectedly')
}
process.stdout.write(`vendored ${copied.length} files from ${upstream} as ${ownName}\n`)
