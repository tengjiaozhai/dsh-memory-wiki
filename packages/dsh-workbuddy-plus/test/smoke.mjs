/**
 * 离线冒烟：验证本包在给定宿主依赖下可被 import、品牌改写补丁就位，
 * 且「按包名接线」的四处标识与 package.json 的 name 一致。
 *
 * 需要的可解析依赖（与宿主大版本一致）：
 *   @deepseek-ai/dsh-llm, @deepseek-ai/dsh-llm-pi-ai, @deepseek-ai/dsh-home-paths,
 *   @deepseek-ai/schemastery, @earendil-works/pi-ai
 *
 * 用法：node test/smoke.mjs   （退出码 0 = 通过）
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WORKBUDDY_RETRY_POLICY, WorkBuddyUpstreamClient } from 'dsh-workbuddy-plus/connect'
import {
	Config,
	apply,
	inject,
	installChatPipeline,
	name,
	rewriteBrandTokens,
} from 'dsh-workbuddy-plus'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

assert.equal(name, 'llm-workbuddy', '插件名应与上游一致，保证模型注册与设置命名空间不变')
assert.deepEqual(inject, ['llm'], 'inject 应只需要模型注册表')
assert.equal(typeof apply, 'function', 'apply 必须是函数')
assert.notEqual(Config, undefined, 'Config schema 应透出')

// 浏览器半的工厂按包名注册；宿主找不到同名工厂会报 loaded without registering。
const client = readFileSync(join(root, 'lib/connect/client.js'), 'utf8')
assert.ok(client.includes(`id: "${pkg.name}"`), `client.js 的模块 id 必须等于包名 ${pkg.name}`)
assert.ok(
	client.includes(`const BUNDLE_NAME = "${pkg.name}";`),
	`client.js 的 BUNDLE_NAME 必须等于包名 ${pkg.name}（Plugins 页按它派发配置文件页）`,
)
assert.ok(
	client.includes(`key: "${pkg.name}"`),
	`plugins.bundle.config 的 key 必须等于包名 ${pkg.name}`,
)
assert.ok(client.includes('/plugins/dsh-workbuddy-connect/'), 'HTTP 路由前缀应保持上游值（Host/浏览器两半写死）')

// CLI 随包发布，浏览器半的提示会让人跑它。
assert.equal(pkg.bin?.['dsh-workbuddy-connect'], './lib/connect/bin.js', '必须随包发布上游同名的 CLI')
readFileSync(join(root, 'lib/connect/bin.js'), 'utf8')

// 品牌改写：补丁在 import 阶段就应生效（除非显式关闭）。
const proto = WorkBuddyUpstreamClient?.prototype
assert.equal(typeof proto?.chatStream, 'function', '上游 chatStream 接缝消失，补丁无处可挂')
const patched = proto[Symbol.for('dsh-workbuddy-plus/chat-pipeline')] === true
if (process.env.WORKBUDDY_BRAND_FIX === '0') {
	assert.equal(patched, false, 'WORKBUDDY_BRAND_FIX=0 时不应打补丁')
	assert.equal(installChatPipeline(), false, '关闭时 installChatPipeline 应返回 false')
} else {
	assert.equal(patched, true, '补丁应在 import 阶段就已生效')
	assert.equal(installChatPipeline(), true, 'installChatPipeline 应幂等返回 true')
	assert.equal(
		rewriteBrandTokens('{"system":"You are DeepSeek Harness.","x":1}'),
		'{"system":"You are WorkBuddy.","x":1}',
		'品牌串应被替换',
	)
	assert.equal(rewriteBrandTokens('{"plain":true}'), '{"plain":true}', '无品牌串时原样返回')
	assert.equal(rewriteBrandTokens(undefined), undefined, '非字符串原样返回')
}

// workbuddy 路由的重试策略：PI_AI_ERROR 必须可重试，次数必须低。
// 这条断言锁定的是「一次上游 finish_reason:error 不会把 turn 直接判死」那个修复，
// 回归时（例如重跑 vendor 覆盖掉常量）会立刻红。
assert.equal(WORKBUDDY_RETRY_POLICY.mode, 'normal', '不能用 always：它忽略 maxRetries 与 retryableCodes，会无限重试')
assert.ok(
	WORKBUDDY_RETRY_POLICY.retryableCodes.includes('PI_AI_ERROR'),
	'PI_AI_ERROR 必须可重试，否则上游 finish_reason:error 会直接判死整个 turn',
)
assert.ok(
	WORKBUDDY_RETRY_POLICY.maxRetries <= 3,
	'maxRetries 必须 <=3：单次 attempt 可能烧 150s，默认 5 次会让用户等 15 分钟',
)
assert.ok(
	WORKBUDDY_RETRY_POLICY.backoff.initialDelayMs >= 1000,
	'首次退避至少 1s：默认 500ms 在网关级卡顿时重试得太急',
)
assert.ok(
	WORKBUDDY_RETRY_POLICY.backoff.jitterRatio > 0.1,
	'抖动要大于默认 0.1：多会话共享同一网关时会一起撞回同一秒',
)

// 策略必须真的接到 profile 上，而不是只存在于常量里。
const host = readFileSync(join(root, 'lib/connect/index.js'), 'utf8')
assert.ok(
	host.includes('resolveRetryPolicy(WORKBUDDY_RETRY_POLICY, "dsh-workbuddy-connect retryPolicy")'),
	'profile 构造必须使用 WORKBUDDY_RETRY_POLICY，而不是 resolveRetryPolicy(void 0, …)',
)
assert.ok(
	!host.includes('resolveRetryPolicy(void 0, "dsh-workbuddy-connect retryPolicy")'),
	'不应残留写死默认策略的旧调用',
)

console.log(JSON.stringify({ ok: true, name, inject, bundle: pkg.name }, null, 2))