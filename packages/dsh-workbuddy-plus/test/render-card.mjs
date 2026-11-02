/**
 * 卡片渲染冒烟：把打完补丁的 client.js 当成真模块加载起来跑一遍，然后
 * 单独渲染切号控件本体。
 *
 * 两段验证，各管一件事：
 *   1. 整包加载 —— client.js 仍能被 __ModuleLoader__ 接住，apply() 仍注册两张卡片、
 *      仍注册文案表。补丁把组件树写坏了，这里就会先炸。
 *   2. 控件渲染 —— 卡片本体是折叠态（open 是内部 state，服务端渲染拿不到展开态），
 *      所以把补丁区整段取出来、用同一份 React 渲染 AccountSwitch 本身：三态文案、
 *      禁用态、非 CN 变体返回 null，都能直接断言。
 *
 * node test/render-card.mjs
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const pluginRoot = join(root, '..', '..')

/**
 * 拿到一份 react-dom/server，并保证它和 react 是同一个实例。
 *
 * react-dom 不是本包的依赖（宿主提供），所以在包目录里 require 不到；pnpm 把它
 * 装在 workspace 的 .pnpm 里，但版本号会随升级变化，写死路径会在下一次升级后
 * 变成「测试挂了但代码没错」。这里按「先正常解析、再扫 .pnpm」两步走。
 */
function loadDom() {
	const candidates = [
		() => createRequire(join(root, 'index.js')),
		() => createRequire(join(pluginRoot, 'package.json')),
	]
	for (const make of candidates) {
		const req = make()
		try {
			req.resolve('react-dom/server')
			return req
		} catch {
			// 这一层没有 react-dom，换下一层。
		}
	}
	const store = join(pluginRoot, 'node_modules', '.pnpm')
	let entries = []
	try {
		entries = readdirSync(store).filter((name) => name.startsWith('react-dom@'))
	} catch {
		entries = []
	}
	assert.ok(
		entries.length > 0,
		'找不到 react-dom：它由宿主提供，跑这个测试前请先在 workspace 里安装一次（pnpm install）',
	)
	return createRequire(join(store, entries[0], 'node_modules', 'react-dom', 'server.js'))
}

const domRequire = loadDom()
const React = domRequire('react')
const jsxRuntime = domRequire('react/jsx-runtime')
const { renderToStaticMarkup } = domRequire('react-dom/server')

/** client.js 里只认这两个模块标识符，用同一份 require 保证 React 实例一致。 */
const moduleRequire = (id) => {
	if (id === 'react') return React
	if (id === 'react/jsx-runtime') return jsxRuntime
	throw new Error('unexpected require in client bundle: ' + id)
}

const MARKER = '//#region dsh-workbuddy-plus/account-switch'
const source = readFileSync(join(root, 'lib/connect/client.js'), 'utf8')
assert.equal(source.split(MARKER).length - 1, 1, '补丁区必须恰好出现一次')

// ---- 1. 整包加载 ----
let captured
const fakeWindow = { __ModuleLoader__: { load: (record) => { captured = record } } }
new Function('window', 'require', source)(fakeWindow, moduleRequire)
assert.ok(captured, 'client.js 必须调用 __ModuleLoader__.load')
assert.equal(captured.id, 'dsh-workbuddy-plus')

const mod = captured.factory(moduleRequire)
assert.equal(mod.BUNDLE_NAME, 'dsh-workbuddy-plus')
assert.equal(typeof mod.apply, 'function')

const cards = new Map()
const effects = []
const translations = {}
const bind = (namespace) => {
	const tables = translations[namespace] ?? {}
	return (key) => {
		const hit = tables.zh?.[key] ?? tables.en?.[key]
		assert.equal(typeof hit, 'string', '缺少文案键: ' + namespace + '.' + key)
		return hit
	}
}
const ctx = {
	effect(fn, label) {
		effects.push(String(label ?? ''))
		try {
			return fn() ?? (() => {})
		} catch {
			return () => {}
		}
	},
	logger: { info() {}, warn() {}, error() {} },
	locale: {
		register(namespace, tables) {
			translations[namespace] = tables
			return () => {}
		},
		bind,
	},
	slots: {
		inject: (name, fn) => fn(),
		register(spec, component) {
			if (spec.name === 'settings.plugin.item') cards.set(spec.key, { component, spec })
			return () => {}
		},
	},
	remote: { session: {} },
	// 探测控制那一段会调 ctx.inject('remote.probe' 之类)，这里给个空实现，免得刷错误日志。
	// 探测控制那段会自己去 ctx.inject(...) 取更细的服务；服务不在时不挂载就是正确降级，
	// 这里直接返回一个空 disposer，避免刷一条无关的错误日志。
	inject() {
		return () => {}
	},
}

globalThis.fetch = async () => new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
mod.apply(ctx)

assert.deepEqual([...cards.keys()].sort(), ['workbuddy', 'workbuddy-ai'], '两张卡片都要注册')
assert.ok(effects.some((label) => label.includes('settings copy')), '文案表要注册')

const collapsed = renderToStaticMarkup(
	React.createElement(cards.get('workbuddy').component, { ...cards.get('workbuddy').spec.inject(), t: bind('settings.workbuddy') }),
)
assert.ok(collapsed.includes('aria-expanded="false"'), '卡片默认是折叠态')
assert.ok(collapsed.length > 200, '折叠态也要有内容')

// ---- 2. 控件本体 ----
const start = source.indexOf(MARKER)
const end = source.indexOf('//#endregion', start)
const region = source.slice(start + MARKER.length, end)
const sentinelCN = { id: 'workbuddy', statusPath: '/x', probePath: '/y', creditPrefix: 'WB.' }
const sentinelAI = { id: 'workbuddy-ai', statusPath: '/x/ai', probePath: '/y/ai', creditPrefix: 'WBAI.' }
// 补丁区在 bundle 里能看到的自由变量：两个样式常量与两张卡片的变体。少给一个就会
// 在渲染时抛 ReferenceError（noticeStyle 就是这么被抓出来的），所以这里按实际依赖传。
const build = new Function(
	'react',
	'react_jsx_runtime',
	'errorStyle',
	'noticeStyle',
	'CN_CARD_VARIANT',
	'AI_CARD_VARIANT',
	region + '\nreturn { useAccountSwitch, AccountSwitch };',
)
const { AccountSwitch } = build(
	React,
	jsxRuntime,
	{ color: 'red', fontSize: 12 },
	{ color: 'amber', fontSize: 12 },
	sentinelCN,
	sentinelAI,
)

const t = bind('settings.workbuddy')
const state = (over) => ({
	enabled: true,
	doc: { key: 'k', override: 'auto', updatedAt: 1, policy: 'failover', available: { primary: true, secondary: true } },
	busy: false,
	failure: undefined,
	set: () => {},
	...over,
})

/** 抽出三段按钮的**可见文字**（不是 title：hint 里也含同样的词，断言会被同义反复满足）。 */
const buttonLabels = (html) => [...html.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map((match) => match[1])

const both = renderToStaticMarkup(React.createElement(AccountSwitch, { t, state: state() }))
assert.deepEqual(buttonLabels(both), ['自动', '主号', '备号'], '三态的顺序与文字都要对')
assert.equal((both.match(/aria-pressed="true"/g) ?? []).length, 1, '必须且只有一个当前档位')
const autoPressed = both.match(/<button[^>]*aria-pressed="true"[^>]*>([^<]*)</)
assert.equal(autoPressed?.[1], '自动', 'override=auto 时「自动」要是按下态')
// 空 label 也必须被抓到：上面用的是按钮正文，清空文案后这里会变成 ['','','']。
assert.ok(buttonLabels(both).every((label) => label.length > 0), '按钮不能被渲染成空文字')

const secondaryCurrent = renderToStaticMarkup(
	React.createElement(AccountSwitch, { t, state: state({ doc: { ...state().doc, override: 'secondary' } }) }),
)
const pressed = secondaryCurrent.match(/<button[^>]*aria-pressed="true"[^>]*>([^<]*)</)
assert.equal(pressed?.[1], '备号', 'override=secondary 时「备号」要是按下态')

const notReady = renderToStaticMarkup(
	React.createElement(AccountSwitch, {
		t,
		state: state({ doc: { ...state().doc, available: { primary: true, secondary: false } } }),
	}),
)
assert.ok(/<button[^>]*disabled=""[^>]*>备号</.test(notReady), '没有备用账号时「备号」必须禁用')
assert.ok(notReady.includes('没有配置备用凭据文件'), '禁用态要在 title 里给出原因（没配备号的通用文案）')

// Host 给了具体原因（坏信封 / 与主号同账号）时，title 必须换成那一句：
// 「没有配置备用凭据文件」对坏文件是错的，会把用户引到错的方向。
const withReason = renderToStaticMarkup(
	React.createElement(AccountSwitch, {
		t,
		state: state({
			doc: {
				...state().doc,
				available: { primary: true, secondary: false },
				unavailableReason: '备用账号与主账号是同一个账号',
			},
		}),
	}),
)
assert.ok(withReason.includes('备用账号与主账号是同一个账号'), 'Host 给的具体原因要显示在 title 里')
assert.ok(!withReason.includes('没有配置备用凭据文件'), '有具体原因时不该再说「没有配置」')

// 手动档没兑现时 Host 写 degraded；卡片必须把那句话显示出来，否则「按了却没生效」是静默的。
const degraded = renderToStaticMarkup(
	React.createElement(AccountSwitch, {
		t,
		state: state({ doc: { ...state().doc, degraded: { kind: 'secondary-unusable', message: '已选备用账号但它不可用，本次请求回落主账号' } } }),
	}),
)
assert.ok(degraded.includes('已选备用账号但它不可用'), 'degraded 的原因必须渲染出来')

const busy = renderToStaticMarkup(React.createElement(AccountSwitch, { t, state: state({ busy: true }) }))
assert.equal((busy.match(/disabled=""/g) ?? []).length, 3, '写入中三态全部禁用')

const failed = renderToStaticMarkup(React.createElement(AccountSwitch, { t, state: state({ failure: 'HTTP 403' }) }))
assert.ok(failed.includes('HTTP 403'), '失败原因要显示出来')

assert.equal(renderToStaticMarkup(React.createElement(AccountSwitch, { t, state: state({ enabled: false }) })), '', '非 CN 卡片返回 null')

// ---- 3. 控件真的挂在「账号」标题右侧 ----
//
// 前两段各验证一半：整包能加载、控件自己能渲染。但它们合起来仍然不排除
// 「控件写好了却没人渲染」——补丁把接线那行删掉，前两段都还是绿的。
// 卡片默认折叠（open 是内部 state），服务端渲染看不到 body，所以这里注入一个
// useState 包装：**组件里的第一个 useState 就是 open**（跟着源码里的声明顺序），
// 把它强制成展开态，就能对真实 DOM 断言标题与控件在同一行里。
const openDecl = 'const [open, setOpen] = (0, react.useState)(false);'
const cardStart = source.indexOf('function WorkBuddyPluginCard(')
assert.ok(cardStart > 0, '找不到卡片组件')
const cardSource = source.slice(cardStart)
assert.ok(
	cardSource.indexOf(openDecl) > 0 &&
		cardSource.indexOf(openDecl) < cardSource.indexOf('(0, react.useState)(') + openDecl.length,
	'组件里的第一个 useState 必须仍是 open——展开断言依赖这个顺序，上游改了这里要同步改测试',
)

let forced = 0
const forcingReact = Object.create(React)
forcingReact.useState = (initial) => {
	const result = React.useState(initial)
	forced += 1
	// 只掰第一个（open），其余保持原样；不是 false 的初值说明顺序变了，直接失败。
	if (forced === 1) {
		assert.equal(initial, false, '第一个 useState 的初值必须是 false（open）')
		return [true, result[1]]
	}
	return result
}
let capturedExpanded
new Function('window', 'require', source)(
	{ __ModuleLoader__: { load: (record) => { capturedExpanded = record } } },
	(id) => {
		if (id === 'react') return forcingReact
		if (id === 'react/jsx-runtime') return jsxRuntime
		throw new Error('unexpected require in client bundle: ' + id)
	},
)
const expandedCards = new Map()
const expandedMod = capturedExpanded.factory((id) => {
	if (id === 'react') return forcingReact
	if (id === 'react/jsx-runtime') return jsxRuntime
	throw new Error('unexpected require in client bundle: ' + id)
})
expandedMod.apply({
	...ctx,
	slots: {
		inject: (name, fn) => fn(),
		register(spec, component) {
			if (spec.name === 'settings.plugin.item') expandedCards.set(spec.key, { component, spec })
			return () => {}
		},
	},
})
const cnCard = expandedCards.get('workbuddy')
const expanded = renderToStaticMarkup(
	React.createElement(cnCard.component, { ...cnCard.spec.inject(), t: bind('settings.workbuddy') }),
)
assert.ok(expanded.includes('aria-expanded="true"'), '这一轮必须渲染成展开态')
assert.ok(
	/<h3[^>]*>账号<\/h3><div[^>]*><div role="group"/.test(expanded),
	'三档控件必须紧跟在「账号」标题后面、同一个行容器里',
)
// 卡片自己还有别的按钮（如「刷新」），这里只认前三个：切号控件排在账号标题行里，
// 也就是卡片正文最前面。
assert.deepEqual(buttonLabels(expanded).slice(0, 3), ['自动', '主号', '备号'], '展开态正文最前面就是三档')

console.log(JSON.stringify({
	ok: true,
	cards: [...cards.keys()],
	effects: effects.length,
	collapsed: collapsed.length,
	expanded: expanded.length,
	wiring: true,
}, null, 2))

// apply() 里更新检查器挂着定时器；它属于宿主生命周期，这里跑完就退，
// 否则进程会一直等那个 interval。
process.exit(0)