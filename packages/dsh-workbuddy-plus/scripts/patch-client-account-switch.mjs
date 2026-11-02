#!/usr/bin/env node
/**
 * 给 vendor 来的浏览器半（lib/connect/client.js）打「CN 通道手动切号按钮」补丁。
 *
 * 为什么要脚本而不是直接改 client.js：client.js 是
 * \`scripts/vendor-upstream.mjs\` 的复制产物，手改会在下一次 vendor 时静默消失。
 * 所以补丁必须可重复执行，并且挂在 vendor 流程末尾。
 *
 * 幂等且可升级：每次运行先把上一版的产物（补丁区围栏 + 本补丁插入的文案键）整段剥掉，
 * 再按 EDITS 反向还原、正向重打。所以改了本文件里的文案/结构之后，重跑一次就换新，
 * 不需要手工还原 client.js。每处锚点、每根「针」都断言出现次数，落盘前还要过一遍语法。
 */
import { readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'

const MARKER = '//#region dsh-workbuddy-plus/account-switch'

/**
 * 只可能出现在补丁区里的符号：用来判断「围栏残缺、代码还留在里面」。
 *
 * 它们同时是补丁的私有名字（上游没有、我们也不会往别处放），所以出现在围栏外
 * 只可能是一种情况：上一次的 //#region 或 //#endregion 被人删了。
 */
const REGION_SYMBOLS = ['function useAccountSwitch(', 'function AccountSwitch(', 'accountSegButtonStyle', 'const ACCOUNT_ROUTE_PATH = "/plugins/dsh-workbuddy-connect/account";']

/**
 * 补丁区**引用**的上游标识符：它们在补丁区之外定义，补丁区只读不写。
 *
 * 为什么需要这一维：POSTCONDITIONS 只数「补丁区自己的字符串」，assertParsable 只验
 * 语法。上游把 `const noticeStyle = {` 改名成 `noticeStyleV2` 之后，补丁区里那句
 * `style: noticeStyle` 仍然是合法 JavaScript，语法与针全部通过，脚本打印 patched，
 * 可一旦宿主给出 degraded（手动档没兑现），卡片渲染就抛 ReferenceError ——最需要
 * 提示的那条路径整块崩掉。所以每个依赖都必须在补丁后的文件里找到定义。
 *
 * 值里放「定义形态」的正则：只认赋值/声明/函数声明，光出现名字不算（引用自己也算
 * 出现，等于没验）。
 */
const REGION_DEPS = new Map([
	['react', /(?:const|let|var)\s+react\s*=/u],
	['react_jsx_runtime', /(?:const|let|var)\s+react_jsx_runtime\s*=/u],
	['CN_CARD_VARIANT', /(?:const|let|var)\s+CN_CARD_VARIANT\s*=/u],
	['AI_CARD_VARIANT', /(?:const|let|var)\s+AI_CARD_VARIANT\s*=/u],
	['POLL_INTERVAL_MS', /(?:const|let|var)\s+POLL_INTERVAL_MS\s*=/u],
	['rowStyle$1', /(?:const|let|var)\s+rowStyle\$1\s*=/u],
	['errorStyle', /(?:const|let|var)\s+errorStyle\s*=/u],
	['noticeStyle', /(?:const|let|var)\s+noticeStyle\s*=/u],
	['quotaTitleStyle', /(?:const|let|var)\s+quotaTitleStyle\s*=/u],
])

/** n 层制表符。 */
const t = (n) => '\t'.repeat(n)

/**
 * 补丁往文案表里插入的键名。
 *
 * 这些键上游没有，只可能来自本补丁。按「键名」而不是按「整行字面量」清除，是为了
 * 让改文案也能升级补丁：只要改了 EN_COPY/ZH_COPY 里的字，反向还原就再也匹配不到
 * 上一版的 `new`，而旧字面量会原地留下，于是正向再插一份（实测会变成
 * "accountModeAuto: appears 4 time(s), expected 2"）。
 */
const LOCALE_KEYS = [
	'accountSwitchLabel',
	'accountModeAuto',
	'accountModeAutoHint',
	'accountModePrimary',
	'accountModePrimaryHint',
	'accountModeSecondary',
	'accountModeSecondaryHint',
	'accountModeSecondaryUnavailable',
	'accountUnreadable',
]

/** 按行删掉本补丁插入的文案键（值随版本变，键名不变）。 */
function stripInjectedCopy(text) {
	const pattern = new RegExp('^\\t{3}(?:' + LOCALE_KEYS.join('|') + '): "[^"\\\\]*(?:\\\\.[^"\\\\]*)*",?\\n', 'gmu')
	return text.replace(pattern, '')
}

/** 补丁区：控件、状态钩子、样式，全部插在卡片组件之前。
 * 首尾围栏都顶格，stripRegion 靠「顶格的 //#endregion」认自己的结尾。 */
const REGION = [
	MARKER,
	t(2) + '/**',
	t(2) + '* 手动优先账号的写入口。与 status/probe 同一个前缀，Host 半写死同一串。',
	t(2) + '*/',
	t(2) + 'const ACCOUNT_ROUTE_PATH = "/plugins/dsh-workbuddy-connect/account";',
	t(2) + 'const accountSegStyle = {',
	t(3) + 'display: "inline-flex",',
	t(3) + 'gap: 4,',
	t(3) + 'padding: 3,',
	t(3) + 'borderRadius: 18,',
	t(3) + 'border: "1px solid var(--dsw-alias-border-l2)",',
	t(3) + 'background: "var(--dsw-alias-bg-layer-1)"',
	t(2) + '};',
	t(2) + 'const accountSegButtonStyle = {',
	t(3) + 'boxSizing: "border-box",',
	t(3) + 'minHeight: 28,',
	t(3) + 'padding: "4px 12px",',
	t(3) + 'border: "none",',
	t(3) + 'borderRadius: 14,',
	t(3) + 'background: "transparent",',
	t(3) + 'color: "var(--dsw-alias-label-secondary)",',
	t(3) + 'font: "inherit",',
	t(3) + 'fontSize: 13,',
	t(3) + 'cursor: "pointer"',
	t(2) + '};',
	t(2) + 'const accountSegActiveStyle = {',
	t(3) + 'background: "var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.16))",',
	t(3) + 'color: "var(--dsw-alias-label-primary)",',
	t(3) + 'fontWeight: 600',
	t(2) + '};',
	t(2) + 'const accountSegDisabledStyle = {',
	t(3) + 'opacity: .45,',
	t(3) + 'cursor: "not-allowed"',
	t(2) + '};',
	t(2) + '/**',
	t(2) + '* 读/写 Host 侧的手动优先账号。',
	t(2) + '*',
	t(2) + '* 只对 CN 卡片有意义：备用账号是 CN 的凭据，国际站通道不参与双账号池。',
	t(2) + '* 每次切换后都用 Host 返回的完整文档替换本地状态，不自己拼乐观值——',
	t(2) + '* 「按下按钮」和「真的生效」必须由同一个来源回答。',
	t(2) + '*',
	t(2) + '* @param {(key: string, vars?: object) => string} t 文案函数',
	t(2) + '* @param {{ id: string }} variant 卡片变体',
	t(2) + '* @returns {{ enabled: boolean, doc: object | undefined, busy: boolean, failure: string | undefined, set: (account: string) => Promise<void> }} 控件状态',
	t(2) + '*/',
	t(2) + 'function useAccountSwitch(t, variant) {',
	t(3) + 'const enabled = variant === CN_CARD_VARIANT;',
	t(3) + 'const [doc, setDoc] = (0, react.useState)();',
	t(3) + 'const [busy, setBusy] = (0, react.useState)(false);',
	t(3) + 'const [failure, setFailure] = (0, react.useState)();',
	t(3) + 'const [hidden, setHidden] = (0, react.useState)(false);',
	t(3) + 'const busyRef = (0, react.useRef)(false);',
	t(3) + 'const load = (0, react.useCallback)(async () => {',
	t(4) + 'try {',
	t(5) + 'const response = await fetch(ACCOUNT_ROUTE_PATH, {',
	t(6) + 'headers: { accept: "application/json" },',
	t(6) + 'credentials: "same-origin"',
	t(5) + '});',
	t(5) + '/**',
	t(5) + '* 404 = 这个宿主还没挂上切号路由（插件刚更新、应用还没重启）。',
	t(5) + '* 这时整条控件隐身，而不是在卡片上留一句红字：用户没做错什么，',
	t(5) + '* 也没有任何可采取的动作。',
	t(5) + '*/',
	t(5) + 'if (response.status === 404) {',
	t(6) + 'setHidden(true);',
	t(6) + 'return;',
	t(5) + '}',
	t(5) + 'const value = await response.json().catch(() => void 0);',
	t(5) + 'if (!response.ok) throw new Error("HTTP " + response.status);',
	t(5) + 'if (typeof value !== "object" || value === null) throw new Error(t("accountUnreadable"));',
	t(5) + 'setHidden(false);',
	t(5) + 'setDoc(value);',
	t(5) + 'setFailure(void 0);',
	t(4) + '} catch (error) {',
	t(5) + 'setFailure(error instanceof Error ? error.message : String(error));',
	t(4) + '}',
	t(3) + '}, [t]);',
	t(3) + '(0, react.useEffect)(() => {',
	t(4) + 'if (enabled) load();',
	t(3) + '}, [enabled, load]);',
	t(3) + '/**',
	t(3) + '* 与卡片自己的 status 轮询同步重读一次。',
	t(3) + '*',
	t(3) + '* 只在挂载时读一次是不够的：Host 会在请求失败后写 degraded（"已选备号但',
	t(3) + '* 它不可用"）、备号文件被删/改坏时改 available，这些都发生在卡片已经挂在',
	t(3) + '* 屏幕上的时候。不轮询的话按钮会一直亮着一个早已无效的档位，用户不折叠再',
	t(3) + '* 展开就永远看不到原因。',
	t(3) + '*/',
	t(3) + '(0, react.useEffect)(() => {',
	t(4) + 'if (!enabled || hidden) return;',
	t(4) + 'const timer = window.setInterval(() => {',
	t(5) + 'if (!busyRef.current) load();',
	t(4) + '}, POLL_INTERVAL_MS);',
	t(4) + 'return () => {',
	t(5) + 'window.clearInterval(timer);',
	t(4) + '};',
	t(3) + '}, [enabled, hidden, load]);',
	t(3) + 'const set = (0, react.useCallback)(async (account) => {',
	t(4) + 'if (doc === void 0) return;',
	t(4) + 'busyRef.current = true;',
	t(4) + 'setBusy(true);',
	t(4) + 'try {',
	t(5) + 'const response = await fetch(ACCOUNT_ROUTE_PATH, {',
	t(6) + 'method: "POST",',
	t(6) + 'headers: {',
	t(7) + '"Content-Type": "application/json",',
	t(7) + '"X-WorkBuddy-Account-Key": doc.key',
	t(6) + '},',
	t(6) + 'credentials: "same-origin",',
	t(6) + 'body: JSON.stringify({ account })',
	t(5) + '});',
	t(5) + 'const value = await response.json().catch(() => void 0);',
	t(5) + 'if (!response.ok) {',
	t(6) + 'const message = typeof value === "object" && value !== null && "error" in value ? String(value["error"]) : "HTTP " + response.status;',
	t(6) + 'throw new Error(message);',
	t(5) + '}',
	t(5) + 'setDoc(value);',
	t(5) + 'setFailure(void 0);',
	t(4) + '} catch (error) {',
	t(5) + 'setFailure(error instanceof Error ? error.message : String(error));',
	t(4) + '} finally {',
	t(5) + 'busyRef.current = false;',
	t(5) + 'setBusy(false);',
	t(4) + '}',
	t(3) + '}, [doc, t]);',
	t(3) + 'return { enabled: enabled && !hidden, doc, busy, failure, set, refresh: load };',
	t(2) + '}',
	t(2) + '/** 三态切换条：自动 / 主号 / 备号。非 CN 卡片返回 null。 */',
	t(2) + 'function AccountSwitch({ t, state }) {',
	t(3) + 'if (!state.enabled) return null;',
	t(3) + 'const doc = state.doc;',
	t(3) + 'const current = doc === void 0 ? "auto" : doc.override;',
	t(3) + 'const secondaryReady = doc !== void 0 && doc.available !== void 0 && doc.available.secondary === true;',
	t(3) + '/**',
	t(3) + '* 备号为什么按不了。Host 会把具体原因写进 unavailableReason（坏信封、与主号',
	t(3) + '* 同账号各是一句不同的话），没有原因时退回通用文案——「没有配置备用凭据',
	t(3) + '* 文件」只在真的没配时才准确，坏文件说这句会把人引到错的方向。',
	t(3) + '*/',
	t(3) + 'const secondaryBlocked = secondaryReady ? void 0 : typeof doc === "object" && doc !== null && typeof doc.unavailableReason === "string" ? doc.unavailableReason : t("accountModeSecondaryUnavailable");',
	t(3) + 'const options = [',
	t(4) + '{ id: "auto", label: t("accountModeAuto"), title: t("accountModeAutoHint"), disabled: false },',
	t(4) + '{ id: "primary", label: t("accountModePrimary"), title: t("accountModePrimaryHint"), disabled: false },',
	t(4) + '{ id: "secondary", label: t("accountModeSecondary"), title: secondaryReady ? t("accountModeSecondaryHint") : secondaryBlocked, disabled: !secondaryReady }',
	t(3) + '];',
	t(3) + 'return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {',
	t(4) + 'style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },',
	t(4) + 'children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {',
	t(5) + 'role: "group",',
	t(5) + '"aria-label": t("accountSwitchLabel"),',
	t(5) + 'style: accountSegStyle,',
	t(5) + 'children: options.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {',
	t(6) + 'type: "button",',
	t(6) + 'disabled: state.busy || option.disabled || doc === void 0,',
	t(6) + '"aria-pressed": current === option.id,',
	t(6) + 'title: option.title,',
	t(6) + 'style: {',
	t(7) + '...accountSegButtonStyle,',
	t(7) + '...current === option.id ? accountSegActiveStyle : {},',
	t(7) + '...option.disabled ? accountSegDisabledStyle : {}',
	t(6) + '},',
	t(6) + 'onClick: () => {',
	t(7) + 'state.set(option.id);',
	t(6) + '},',
	t(6) + 'children: option.label',
	t(5) + '}, option.id))',
	t(4) + '}), state.failure === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {',
	t(5) + 'style: errorStyle,',
	t(5) + 'children: state.failure',
	t(4) + '}), /* 选了却没兑现的原因：Host 在手动档期间写 degraded，这里照实说一句。 */',
	t(4) + 'typeof doc === "object" && doc !== null && typeof doc.degraded === "object" && doc.degraded !== null && typeof doc.degraded.message === "string" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {',
	t(5) + 'style: noticeStyle,',
	t(5) + 'children: doc.degraded.message',
	t(4) + '}) : null]',
	t(3) + '});',
	t(2) + '}',
	'//#endregion',
	'',
].join('\n')

/** 英文文案。 */
const EN_COPY = [
	t(3) + 'accountSwitchLabel: "Preferred account",',
	t(3) + 'accountModeAuto: "Auto",',
	t(3) + 'accountModeAutoHint: "Use the configured policy (primary first, switch on quota or rate-limit failures)",',
	t(3) + 'accountModePrimary: "Primary",',
	t(3) + 'accountModePrimaryHint: "Try the primary account first; quota exhaustion, rate limits and expired sessions still switch to the backup",',
	t(3) + 'accountModeSecondary: "Backup",',
	t(3) + 'accountModeSecondaryHint: "Try the backup account first; any backup failure still falls back to the primary",',
	t(3) + 'accountModeSecondaryUnavailable: "No backup credential file is configured",',
	t(3) + 'accountUnreadable: "WorkBuddy returned an unreadable account reply",',
].join('\n')

/** 中文文案。 */
const ZH_COPY = [
	t(3) + 'accountSwitchLabel: "优先账号",',
	t(3) + 'accountModeAuto: "自动",',
	t(3) + 'accountModeAutoHint: "按配置策略走：主号优先，额度不足或限流时自动切换",',
	t(3) + 'accountModePrimary: "主号",',
	t(3) + 'accountModePrimaryHint: "这个先试主号；额度用尽 / 限流 / 登录失效时仍会切到备号",',
	t(3) + 'accountModeSecondary: "备号",',
	t(3) + 'accountModeSecondaryHint: "这个先试备号；备号失败时仍会回落主号兜底",',
	t(3) + 'accountModeSecondaryUnavailable: "没有配置备用凭据文件",',
	t(3) + 'accountUnreadable: "WorkBuddy 返回的账号数据无法识别",',
].join('\n')

/**
 * 一处替换：old 必须恰好出现 times 次。
 * @type {Array<{ why: string, old: string, new: string, times: number }>}
 */
const EDITS = [
	{
		why: '补丁区插在卡片组件之前（那里的 errorStyle / bodyStyle$1 / CN_CARD_VARIANT 都已定义）',
		old: t(2) + '/** Render WorkBuddy sign-in state and credit as one expandable card. */',
		new: REGION + t(2) + '/** Render WorkBuddy sign-in state and credit as one expandable card. */',
		times: 1,
	},
	{
		why: '卡片里挂上切号状态钩子',
		old: t(3) + 'const [tab, setTab] = (0, react.useState)("status");',
		new: [
			t(3) + 'const [tab, setTab] = (0, react.useState)("status");',
			t(3) + 'const accountSwitch = useAccountSwitch(t, variant);',
		].join('\n'),
		times: 1,
	},
	{
		why: '账号标题行右侧放切换条（AccountSwitch 对国际站卡片返回 null，同一处渲染对两张卡片都安全）',
		old: [
			t(6) + '/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {',
			t(7) + 'style: quotaTitleStyle,',
			t(7) + 'children: t("accountHeading")',
			t(6) + '}),',
		].join('\n'),
		new: [
			t(6) + '/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {',
			t(7) + 'style: rowStyle$1,',
			t(7) + 'children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {',
			t(8) + 'style: quotaTitleStyle,',
			t(8) + 'children: t("accountHeading")',
			t(7) + '}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AccountSwitch, {',
			t(8) + 't,',
			t(8) + 'state: accountSwitch',
			t(7) + '})]',
			t(6) + '}),',
		].join('\n'),
		times: 1,
	},
	{
		why: '卡片的「刷新」按钮顺手重读一次切号文档（轮询之外的手动通道）',
		// 锚点必须整块带上 if (mounted.current) setBusy(false)：单看
		// "await refresh(controller.signal);\n} finally {" 在文件里有两处（另一处是
		// refreshModels），补丁器会以「anchor 2 times」拒绝。
		old: [
			t(3) + 'const manualRefresh = async () => {',
			t(4) + 'setBusy(true);',
			t(4) + 'const controller = trackController();',
			t(4) + 'try {',
			t(5) + 'await refresh(controller.signal);',
			t(4) + '} finally {',
			t(5) + 'manualControllers.current.delete(controller);',
			t(5) + 'if (mounted.current) setBusy(false);',
			t(4) + '}',
			t(3) + '};',
		].join('\n'),
		new: [
			t(3) + 'const manualRefresh = async () => {',
			t(4) + 'setBusy(true);',
			t(4) + 'const controller = trackController();',
			t(4) + 'try {',
			t(5) + 'await refresh(controller.signal);',
			t(5) + 'await accountSwitch.refresh();',
			t(4) + '} finally {',
			t(5) + 'manualControllers.current.delete(controller);',
			t(5) + 'if (mounted.current) setBusy(false);',
			t(4) + '}',
			t(3) + '};',
		].join('\n'),
		times: 1,
	},
	{
		why: '英文文案',
		old: t(3) + 'accountHeading: "Account",',
		new: [t(3) + 'accountHeading: "Account",', EN_COPY].join('\n'),
		times: 1,
	},
	{
		why: '中文文案',
		old: t(3) + 'accountHeading: "账号",',
		new: [t(3) + 'accountHeading: "账号",', ZH_COPY].join('\n'),
		times: 1,
	},
]

/**
 * 打完补丁后必须成立的「针」：只可能来自补丁区的片段 + 应有的份数。
 *
 * 文案两根针按语言各一份：`accountModeAuto:` 只在 en 与 zh 两个文案表里各出现一次，
 * 多出来的第三份必然是一次漂移的历史副本。
 */
const POSTCONDITIONS = [
	[MARKER, 1],
	['function useAccountSwitch(', 1],
	['function AccountSwitch(', 1],
	['const accountSwitch = useAccountSwitch(t, variant);', 1],
	['state: accountSwitch', 1],
	['accountModeAuto:', 2],
	['accountModeSecondary:', 2],
	// Host 的两个「按了却不兑现 / 按不了」通道：禁用原因与降级原因。少一根针就意味着
	// 控件又会变成「按了没反应也不解释」。
	['typeof doc.unavailableReason === "string"', 1],
	['typeof doc.degraded.message === "string"', 1],
	// 文案不能承诺不存在的兜底：主号只有「额度用尽 / 限流 / 登录失效」才会换号，
	// 5xx 是不会换的（SWITCHABLE_KINDS 不含 server）。这两根针把假话钉死在 0。
	['5xx / 网络失败', 0],
	['still covers 5xx and network failures', 0],
]

/**
 * 剥掉上一次打进去的补丁区（若存在）。
 *
 * 补丁区自带 `//#region … //#endregion` 围栏，边界是显式的，不靠猜。这段代码本身
 * 会升级，所以必须能在「旧版补丁区」上直接重打，而不是只能首装。
 *
 * @param {string} text 原文件内容
 * @returns {string} 剥掉补丁区后的内容
 */
function stripRegion(text) {
	let out = text
	for (;;) {
		// 退到行首：MARKER 前面那一截制表符是上一次插入时留下的缩进，必须一起去掉，
		// 否则每跑一次就多一层缩进（补丁会「漂移」而不是幂等）。
		const raw = out.indexOf(MARKER)
		if (raw === -1) break
		const start = out.lastIndexOf('\n', raw) + 1
		// 本区的结尾 = MARKER 之后第一个**顶格**（行首无缩进）的 //#endregion。
		//
		// 为什么必须顶格：上游那些 region 全部缩进两格（		//#endregion），本补丁区
		// 则是顶格插入的。只按「往后找第一个 //#endregion」找，收尾围栏被删掉时会
		// 一路吞到别的区的结尾——中间正好躺着卡片组件本体，既不报错也删错东西
		// （实测：删掉 1245 行后会吞到 1734 行，把 WorkBuddyPluginCard 整块带走）。
		//
		// 这个判据只用本补丁区自己的写法，不依赖任何上游字面量。老版本用「吞进去的
		// 片段里有没有 function WorkBuddyPluginCard(」兜底——上游把这个函数改名，
		// 守卫就失效了。
		const nextClose = out.indexOf('\n//#endregion', raw)
		if (nextClose === -1) {
			throw new Error(
				'client.js has a partial account-switch region (its closing //#endregion, flush at column 0, is missing) — restore the file or delete the region by hand',
			)
		}
		const end = nextClose + 1
		// 连同区域后面的空行一起去掉，保持与上游原文一致。
		const after = out.slice(end + '//#endregion'.length).replace(/^\n/u, '')
		out = out.slice(0, start) + after
	}
	// 围栏可能只剩一半（MARKER 与 //#endregion 都被删、留下一截控件代码）：那时上面
	// 的循环什么也找不到，正向会当成「还没打过」再插一份，于是重复声明。这里用只可能
	// 出现在补丁区里的符号兜底，把「补丁区残缺」与「上游改结构」区分开。
	const orphans = REGION_SYMBOLS.filter((symbol) => out.includes(symbol))
	if (orphans.length > 0) {
		throw new Error(
			'client.js has leftover account-switch code outside its region (' +
				orphans.join(', ') +
				') — the //#region fence is incomplete; restore the file by hand',
		)
	}
	return out
}

/**
 * 对一份 client.js 打补丁（可重复执行，且能升级）。
 *
 * 幂等的做法是「先全量反向还原，再全量正向应用」：每处编辑都记录了 old 与 new
 * 两侧，所以第二次运行会先把上一次的产物还原成上游原文，再重新打一遍。好处是
 * 改这个脚本之后不需要修 client.js，只要重跑就得到新版补丁；坏处是每处编辑必须
 * 严格成对（new 反向替换的次数也断言），否则会在还原阶段直接失败，而不是越打越歪。
 *
 * @param {string} clientPath lib/connect/client.js 的绝对路径
 * @returns {boolean} 是否真的改了文件
 */
export function patchClientAccountSwitch(clientPath) {
	const text = readFileSync(clientPath, 'utf8')
	// 先剥掉上一次打进去的补丁区（补丁区自带 region 围栏）：这样补丁自己能升级，
	// 不必要求先手工还原 client.js。
	let next = stripInjectedCopy(stripRegion(text))

	for (const edit of [...EDITS].reverse()) {
		const found = next.split(edit.new).length - 1
		if (found === 0) {
			// new 不在文件里 ≠ 无需还原。如果 old 锚点还在，说明这一处本来就没打上
			// （上游布局变了、或者上一次只应用了一部分）——继续正向打就会重复声明。
			// 只有「old 在位且 new 不在位」才是干净的未打状态，那时才有资格继续。
			const anchor = next.split(edit.old).length - 1
			if (anchor !== edit.times) {
				throw new Error(
					'client.js: edit 「' +
						edit.why +
						'」 is in an inconsistent state (its replacement appears 0 times, its anchor ' +
						anchor +
						' times, expected ' +
						edit.times +
						') — restore the file from upstream before patching',
				)
			}
			continue
		}
		if (found !== edit.times) {
			throw new Error(
				'client.js: reverse step for 「' + edit.why + '」 matched ' + found + ' times, expected ' + edit.times + ' — the file was edited by hand, restore it first',
			)
		}
		next = next.split(edit.new).join(edit.old)
	}

	for (const edit of EDITS) {
		const found = next.split(edit.old).length - 1
		if (found !== edit.times) {
			throw new Error(
				'client.js: expected ' + edit.times + ' occurrence(s) of ' + JSON.stringify(edit.old.slice(0, 70)) + ' for 「' + edit.why + '」, found ' + found + ' — upstream layout changed, update the patch',
			)
		}
		next = next.split(edit.old).join(edit.new)
	}

	// 文件里可能已经躺着上一版补丁的一部分（有人手改过文案值、或某次只应用了一部分
	// 编辑）。那时锚点断言拦不住——old 还在、new 也在，正向插一遍就成两份。这里用只
	// 可能来自补丁区的「针」收口：每根针必须恰好出现约定次数，多一份就是漂移。
	for (const [needle, count] of POSTCONDITIONS) {
		const found = next.split(needle).length - 1
		if (found !== count) {
			throw new Error(
				'client.js: after patching, ' +
					JSON.stringify(needle) +
					' appears ' +
					found +
					' time(s), expected ' +
					count +
					' — the file already carried a drifted copy of the account-switch patch; restore it from upstream',
			)
		}
	}

	// 依赖检查放在「有没有改动」之前：上游把 noticeStyle 改名后，一份已经打过补丁的
	// client.js 会得到 next === text（没什么可做），但那一刻它已经是个一渲染 degraded
	// 就抛 ReferenceError 的文件。什么都不做地返回「already patched」等于替它背书。
	assertDepsDefined(next)
	if (next === text) return false
	// 落盘前把结果当脚本解析一遍：这个文件是浏览器 bundle 的工厂体，语法错在运行时
	// 只会表现为「卡片消失」，而脚本自己会打印 patched。宁可在这里判死。
	assertParsable(next, clientPath)
	writeAtomic(clientPath, next)
	return true
}

/**
 * 补丁区引用的上游标识符必须仍在上游有定义。
 *
 * 这是 assertParsable 抓不到的那一维：标识符消失后语法依旧合法，只有真的渲染到
 * 用到它的那一支（degraded 提示、禁用原因）才会在运行时抛 ReferenceError。
 *
 * @param {string} text 补丁后的完整文件内容
 */
function assertDepsDefined(text) {
	const missing = []
	for (const [name, pattern] of REGION_DEPS) {
		if (!pattern.test(text)) missing.push(name)
	}
	if (missing.length === 0) return
	throw new Error(
		'client.js: the account-switch region depends on upstream identifier(s) that no longer have a definition: ' +
			missing.join(', ') +
			' — upstream renamed or removed them; update REGION / the anchors, client.js left untouched',
	)
}

/**
 * 原子写入：先写同目录临时文件再 rename。
 *
 * 直接 writeFileSync 覆盖时，写入中途失败（磁盘满、进程被杀）会留下半截 client.js，
 * 浏览器半随后加载的就是一个坏 bundle——卡片直接消失。rename 在同一文件系统内是原子
 * 的，读者要么看到旧文件、要么看到完整的新文件。
 *
 * @param {string} target 目标路径
 * @param {string} content 新内容
 */
function writeAtomic(target, content) {
	const temp = target + '.patch-tmp'
	writeFileSync(temp, content)
	renameSync(temp, target)
}

/**
 * 断言一份 JavaScript 源文本语法合法。
 *
 * client.js 是 `window.__ModuleLoader__.load({...})` 表达式，不是一个可独立执行的
 * 模块；用 vm.Script 只编译不执行，跑不到 window 上，正好只验语法。
 *
 * @param {string} text 目标源文本
 * @param {string} label 出错时显示的名字
 */
function assertParsable(text, label) {
	try {
		new Script(text, { filename: label })
	} catch (error) {
		throw new Error(
			'patch result is not valid JavaScript (' +
				String(error?.message ?? error) +
				') — client.js left untouched, the card would have disappeared at runtime',
		)
	}
}

/** 直接执行时按默认路径打补丁。 */
if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const root = join(dirname(fileURLToPath(import.meta.url)), '..')
	const written = patchClientAccountSwitch(join(root, 'lib/connect/client.js'))
	process.stdout.write(written ? 'patched client.js with account switch\n' : 'client.js already patched\n')
}