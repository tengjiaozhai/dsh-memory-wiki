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
import { WorkBuddyUpstreamClient } from 'dsh-workbuddy-plus/connect'
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

console.log(JSON.stringify({ ok: true, name, inject, bundle: pkg.name }, null, 2))