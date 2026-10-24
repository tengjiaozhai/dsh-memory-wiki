# dsh-workbuddy-plus

把 **WorkBuddy 桌面 App 自带的模型**接进 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH），并且**自带品牌令牌改写**——网关不再把带宿主品牌串的请求判成未授权渠道。

这个包是两件东西的合体：

| 来源 | 作用 | 在本包里的形态 |
| --- | --- | --- |
| [`dsh-workbuddy-connect`](https://github.com/corrinehu/dsh-workbuddy-connect) 0.7.9（corrinehu，MIT） | WorkBuddy 登录态复用、模型目录、回环转发、provider 注册、设置卡片、Web 面板、CLI | vendor 在 [`lib/connect/`](./lib/connect/)，Host 半逐字节原样，浏览器半只改 4 处「按包名接线」的标识（见下） |
| `dsh-workbuddy-brandfix` 1.0.0（本项目自研） | 出站请求里的品牌串改写，避免网关 HTTP 400 / code 11128 | 合并进 [`index.js`](./index.js)，import 期打补丁 |

## 为什么要有它

宿主升级到 DSH `0.2.1-rc.3` 之后，桌面 profile 里那条 `dsh-workbuddy-connect@0.7.9` 被插件兼容性闸门直接跳过，模型入口整个消失：

```
dsh: skipping profile bundle "dsh-workbuddy-connect": Error: Plugin
dsh-workbuddy-connect@0.7.9 is incompatible with dsh 0.2.1-rc.3:
requirements {"@deepseek-ai/dsh-attachment":"0.2.1-rc.2", … "0.2.1-rc.2"}.
```

闸门的规则是 **先看 `engines.dsh`，没有这个字段才回落到「与 DSH 相关的 peerDependencies」**。上游没有 `engines.dsh`，而 6 个 `@deepseek-ai/dsh-*` peer 写的都是**精确版本** `0.2.1-rc.2`；`0.2.1-rc.3` 不满足精确匹配，于是整条 bundle 被跳过——不是运行时报错，是根本没挂上。

本包自己声明 `engines.dsh: ">=0.2.1-rc.2 <0.3.0-0"`（同时把 peer 也放宽成范围），所以 rc.2 / rc.3 都能挂载；上游作者不再更新时，这条链路由本仓库接管。

> 兼容性事实（2026-10-24 核查，见 `research/rc3-compat.md`）：rc.2→rc.3 之间，插件实际用到的 4 个宿主包（`dsh-llm`、`dsh-llm-pi-ai`、`dsh-home-paths`、`schemastery`）与 3 个注入服务包除 `package.json` 外逐字节相同，`resolveImageAttachmentAccess`/`resolveRetryPolicy`/`resolveDshHome`/`PiAiAdapter` 签名一字未变；浏览器半 inject 的 6 个客户端包也都还在、槽位未变。**零 API 破坏，坏的只有版本声明。**

## 结构

```
packages/dsh-workbuddy-plus/
├── index.js                 # 合并入口：vendor 上游 + 品牌改写补丁
├── index.d.ts               # 入口类型声明
├── cordis.patch.yml         # 挂载点：id llm-workbuddy → name dsh-workbuddy-plus
├── lib/connect/             # 上游 0.7.9 产物（vendor 脚本可复现）
│   ├── index.js             #   Host 半：provider / 路由 / 设置 / 目录
│   ├── client.js            #   浏览器半：模型面板、设置卡片、探测控件
│   ├── host-heartbeat-*.js  #   上游内部 chunk（UpstreamClient、凭据、目录）
│   ├── bin.js               #   CLI：doctor / status / logout
│   └── *.d.ts
├── scripts/vendor-upstream.mjs   # 从上游重新 vendor + 打 4 处改名补丁
├── test/smoke.mjs                # 离线冒烟：模块图 + 接线标识 + 补丁 + 改写
├── test/accounts.mjs             # 双账号池端到端：打桩 fetch 验证切换与轮换
├── LICENSE.upstream-dsh-workbuddy-connect   # 上游 MIT 许可（保留）
└── THIRD_PARTY_NOTICES.txt                  # 上游随包的第三方声明
```

### 浏览器半为什么必须改名（4 处）

宿主按**包名**把浏览器 bundle 接进模块图：`dsh-client-modules` 用 `registration.id`（去掉 `-client` 后缀）当工厂键，profile 里的 bundle 名当图行名——两边对不上就报 `bundle … loaded without registering`，面板整块不出现。所以 `scripts/vendor-upstream.mjs` 在 vendor 时把下面 4 处改成自己的包名（每处都断言语义出现次数，上游结构一变立刻失败）：

| 位置 | 原值用途 |
| --- | --- |
| `client.js` `id:` | `window.__ModuleLoader__.load` 的模块 id |
| `client.js` `BUNDLE_NAME` | 浏览器插件名 + Plugins 页配置文件的 key |
| `client.js` `plugins.bundle.config` 的 `key` | 配置页派发键（宿主按包名派发） |
| `index.js` 设置兜底 | 拿不到自身 entry id 时按包名找设置表单 |

HTTP 路由前缀 `/plugins/dsh-workbuddy-connect/` **刻意不动**：Host 半和浏览器半都写死它，改了反而对不上。CLI 也按上游同名发布（`dsh-workbuddy-connect`，另加一个 `dsh-workbuddy-plus` 别名），这样面板里「跑 `dsh-workbuddy-connect status`」的提示仍然有效。

### 品牌改写为什么不会再失效

旧实现是**另一个插件**：它 `require.resolve('dsh-workbuddy-connect')` 找到构建块，运行时给 `WorkBuddyUpstreamClient.prototype.chatStream` 打补丁，而且必须在 bundle 列表里排在 connect 之后才生效——顺序一错就静默失效。

合并后补丁在 `index.js` 的 **import 阶段**就完成，宿主之后才调用 `apply()`，因此不存在「先发请求、后打补丁」的窗口；补丁只挂在原型方法上：上游文件不动，热重载与重复 import 幂等（`Symbol.for('dsh-workbuddy-plus/chat-pipeline')` 守卫），关掉开关就完全回到原始行为。

改写是**整串替换**（body 已经是序列化好的 JSON 字符串），所以用户消息、工具结果里出现的同一串也会被一起改；替换前按 JSON 规则转义，品牌串里带引号也不会产出非法 body。这个取舍换来的是「永远不可能改坏 JSON 结构」。

## 安装（桌面 profile）

1. 改 `~/.dsh/profiles/desktop/package.json`：`dependencies` 里去掉 `dsh-workbuddy-connect` 与 `dsh-workbuddy-brandfix`，换成

   ```json
   "dsh-workbuddy-plus": "link:/Volumes/PortableSSD/workspace/dsh-plugin-research/plugin/packages/dsh-workbuddy-plus"
   ```

   `dsh.profile.bundles` 里同样把两条去掉，换成 `"dsh-workbuddy-plus"`。

2. 装依赖：

   ```sh
   dsh plugin --profile desktop install
   ```

3. 重启 DSH（桌面 App 退出再开）。

> 旧的两个包**必须**从 `dependencies` 与 `bundles` 里拿掉：入口 id（`llm-workbuddy`）、provider id（`workbuddy` / `workbuddy-ai`）、浏览器模块 id 都会撞车，两套同时挂载会重复注册。旧的源码目录 `local-plugins/dsh-workbuddy-brandfix` 可以留着当备份，只要不在 profile 里引用即可。

provider id、设置命名空间（`workbuddy` / `workbuddy-ai`）、路由前缀、入口 id 全部沿用上游，所以**已有的登录态、模型选择与设置不用重配**。唯一变化是 Plugins 页里那张卡片的 key 变成新包名——它本来就是按包名派发的。

## 配置

| 环境变量 | 默认 | 说明 |
| --- | --- | --- |
| `WORKBUDDY_BRAND_FIX` | 开启 | 设成 `0` 关闭品牌改写，完全回到上游行为 |
| `WORKBUDDY_BRAND_FROM` | `DeepSeek Harness` | 被替换的品牌串 |
| `WORKBUDDY_BRAND_TO` | `WorkBuddy` | 替换成的串 |
| `WORKBUDDY_AUTH_FILE_2` | `$DSH_HOME/.workbuddy-account-2.info`（存在即启用；旧名 `.workbuddy-account-b.info` 仍兼容） | 第二个 CN 账号的凭据文件；两处都没有就是单账号，行为与上游完全一致 |
| `WORKBUDDY_ACCOUNT_POLICY` | `failover` | `failover` 主号优先、失败才切；`rotate` 每个请求交替；`off` 关掉账号池 |
| `WORKBUDDY_ACCOUNT_COOLDOWN_MS` | `600000` | 切到备用账号后，这段时间内继续优先用它；窗口过了先试主号 |

模型、目录、凭据、探测等业务配置沿用上游，见其 [README](https://github.com/corrinehu/dsh-workbuddy-connect#readme)。

## 双账号：额度用完自动切

两个 CN 账号想合用额度时，配第二份凭据文件即可。**只动 CN 通道**（国际站 `WorkBuddy AI` 通道不参与，备用账号必须是 CN 站凭据）。

规则：

- **主账号遇到这三类失败才换号**：`hard_credit`（HTTP 402 / 余额不足文案）、`soft_rate`（429 限流）、`session_dead`（401 登录失效）。`server` / `not_found` / `client` 原样返回——换号只会白烧一次请求，也会掩盖真正的问题。
- **一次请求内部重试**：主账号失败后立刻用备用账号重发，成功即返回。上游 `chatStream` 在开始返回 SSE 流之前就决定成败，所以不会出现「半个回复来自 A、半个来自 B」。最多两次上游请求；会话已取消（`signal.aborted`）时不再重发。
- **两个账号都失败时，报的是主账号的原因**（比如主号额度不足、备号登录失效，你看到的是 `hard_credit`），不会被备号的 `session_dead` 带偏。
- **备用账号失败一定回落主账号**：冷却窗口内先用的是备用，如果它自己 5xx/404，会马上回去试主账号，而不是让整个窗口都失败。
- `failover` 下切过一次后，冷却窗口（默认 10 分钟）内继续优先用备用；窗口过了**下一次请求先试主账号**，只有主账号成功才真正把状态复位（不会出现「名义上回主号、实际一直用备号」）。`rotate` 是每次请求交替，且**不改动** failover 的这套状态。
- 两条路径指向同一个账号时（uid 相同或 token 相同）不会重发——切号等于没切。
- 备用账号的续期凭据写在自己的副本 `$DSH_HOME/.workbuddy-auth-2.json`，不会覆盖主号那份。主账号健康时**根本不会去读/刷新**备用凭据。
- 状态卡片、额度与模型可见性仍只反映**主账号**（那是上游的浏览器半，本层没有改它）；切换只体现在服务端日志：

  ```
  [dsh-workbuddy-plus] 主账号失败（hard_credit），已切到备用账号；600s 内优先用它
  [dsh-workbuddy-plus] 已切回主账号
  ```

准备第二份凭据：

1. 在 WorkBuddy 桌面 App 里**登录账号 B**；
2. 复制 `~/Library/Application Support/CodeBuddyExtension/Data/Public/auth/workbuddy-desktop.info` 到 **`~/.dsh/.workbuddy-account-2.info`**，`chmod 600`；
3. 回 App **登录账号 A**（主号）；
4. 重启 DSH 即可——这个路径是默认位置，**不需要设任何环境变量**（桌面 App 从 Finder 启动拿不到 shell 变量，所以默认走文件；想放别处再用 `WORKBUDDY_AUTH_FILE_2` 覆盖）。

风险与边界：

- 那份文件就是凭据（5.6+ 是加密信封，本机可解；更老版本是明文 bearer token），按密钥对待，别进版本库、别贴到聊天里。
- 备用文件里的 refresh token 属于 B。之后若又在桌面 App 里用 B 登录，App 可能让旧 refresh token 失效，备用账号会退化成 `session_dead`——重新导出一次即可。
- 凭据的 domain 只要不是 `workbuddy.ai` 及其子域就算 CN 站（与上游`regionOf` 的判定一致，空域名也算 CN）。区域不符会被上游的 region 校验直接拒绝，不会串号。
- `WORKBUDDY_AUTH_FILE_2` 指向一个不存在的文件时，插件会告警并按单账号运行，不会让主账号一起挂掉。
- 同一轮对话里主号如果 402、备用接着答完，这轮上下文仍在同一个会话里；两个账号看到的 prompt 完全相同。

### 卡片上显示两个账号的额度

上游卡片渲染的是 status 文档里的 `credits`：顶部一行合计 + 下面「按套餐」逐行。本包在 Host 侧把 `fetchCredits` 包了一层，于是**浏览器半一行都没改**，卡片就变成：

```
剩余额度  合计: 3,960
按套餐
  321026 · CodeBuddy个人版国内运营裂变包    ▓▓▓▓  1,860/1,860
  321026 · CodeBuddy个人体验版              ░░░░  0/500
  67e7a1 · enterprise                       ▓▓▓▓  2,000/2,000
```

语义：

- **顶部合计 = 两个账号相加**；任一方不限量就显示「不限量」。
- **每行前缀是该账号的显示名**（有昵称用昵称，没有就用 uid 前 6 位）——这是卡片原有渲染逻辑决定的：账号行的标签就是 `packageName` 原文，所以前缀是最省事也最不侵入的标识方式。
- 同名套餐会被上游的 `groupCreditPackages` 自动合并成一行（同一账号的多个裂变包加在一起），所以行数不会爆炸。
- 「即将过期（24h/3d/7d）」三类计数**相加**；「重置时间」沿用主账号。
- 备用账号读不到（没登录/文件坏了/解不开）时，卡片照旧只显示主账号，不会把状态页搞成错误页。
- 备用凭据通常是 WorkBuddy 5.6 的**加密信封**，所以本包带上与主账号同一套 Electron discovery 去解它（[lib/connect/at-rest.js](./lib/connect/at-rest.js)，由 vendor 脚本生成）。少了这一步会静默退回单账号——这是排查「卡片里只有一个账号」时的第一嫌疑点。
- 想关掉合并：`WORKBUDDY_ACCOUNT_CARD=off`。

两个已知边界：

- 封面上的「Signed in as {昵称}」仍然只反映**主账号**（那是上游的头部，没改）。
- 企业套餐被加上账号前缀后不再命中上游的 `packageName === "enterprise"` 特判，所以标签显示原文 `enterprise`；另外**余额为 0 的非企业套餐行会被上游过滤掉**（这是上游既有行为，对主账号也一样）。

### 主备对调

槽位文件按「第 2 个账号」命名而不是账号字母命名，因为它只是**备用槽位**：主号永远是你桌面 App 当前登录的那个，槽位里放谁由你决定。

对调主备 = 两步，不需要改配置：

```sh
# 现在主号是 B（App 登录 B）、备号是 A（槽位里是 A）
# 想反过来：把 B 的凭据写进槽位，并让 App 登录回 A
cp ~/Library/Application\ Support/CodeBuddyExtension/Data/Public/auth/workbuddy-desktop.info \
   ~/.dsh/.workbuddy-account-2.info   # 前提：此刻 App 登的是 A
```

只改槽位文件、不让 App 换号，就只是「换掉备用账号」，主号不变——这也是给两个账号对调排位的正确姿势：**先让 App 登成你要当主号的那个，再把另一个账号的文件放进槽位**。

## 验证

已经跑过的（都可复现）：

| 项 | 做法 | 结果 |
| --- | --- | --- |
| rc.3 能挂载 | App 自带 CLI + 临时 `DSH_HOME`，`dsh --profile wb3 --dump-config` | 输出 `- id: llm-workbuddy / name: dsh-workbuddy-plus`；同一位置换回 0.7.9 会打印 incompatible 并跳过 |
| rc.2 能挂载 | 同上，用 `0.2.1-rc.2` 的 CLI | 同样挂上 |
| rc.3 模块图 | `test/smoke.mjs`，依赖用 `@deepseek-ai/*@0.2.1-rc.3` | import 成功，`name/inject/apply/Config` 正常 |
| rc.2 模块图 | 同上，换 `0.2.1-rc.2` 依赖 | 通过 |
| 接线标识 | smoke 读 `client.js` 断言 `id`/`BUNDLE_NAME`/`config key` 都等于包名，且路由前缀仍是上游值 | 通过（上游改结构或改名漏改会直接失败） |
| 双账号（额度切换） | `test/accounts.mjs switch` | 通过：请求序列 `Bearer token-a → token-b`，`X-User-Id` 跟着换号，切后 `preferred=secondary` |
| 双账号（异常分支） | `double-fail` / `server` / `abort` / `same-account` / `cooldown-fallback` | 全部通过：双败报主号原因、5xx 不换号、取消后不重发、同账号不重发、冷却窗口内备号失败回落主号 |
| 双账号（轮换） | 同上，`WORKBUDDY_ACCOUNT_POLICY=rotate` | 通过：两次请求交替 `token-a / token-b` |
| 双账号（免配置路径） | 不设环境变量，把凭据放到 `$DSH_HOME/.workbuddy-account-2.info` | 通过：同样触发 `token-a → token-b` |
| 双账号（旧槽位名兼容） | 只放 `.workbuddy-account-b.info` | 通过：新文件名不存在时回落到旧名 |
| 卡片额度合并 | `test/credits.mjs`：纯函数 + 打桩计费接口 | 通过：两个账号各请求一次、合计 120、行前缀是账号显示名 |
| 卡片额度（真账号） | 用真实凭据调 `fetchCredits`（只读计费接口），且**不设** `WORKBUDDY_ELECTRON_BIN` | 通过：主号 1,960 + 备号（企业）2,000 = 合计 3,960，21 行按账号加前缀；证明 discovery 能解备用账号的加密信封 |
| 补丁时机 | 只看 import 结果 | `patchedAtImport: true`；重复调用 `installChatPipeline()` 幂等；`WORKBUDDY_BRAND_FIX=0` 时如实未打补丁 |
| 改写正确性 | 输入 `{"system":"You are DeepSeek Harness.","x":1}` | 输出 `{"system":"You are WorkBuddy.","x":1}`；无品牌串与非字符串原样返回 |
| 运行期真的起来了 | rc.3 + web bundle 的临时 profile，`GET /plugins/dsh-workbuddy-connect/status` | `200`，`"status":"signed-in"`、`"source":"desktop"`、模型列表非空；`/ai/status` 也是 `200` |
| 真实模型对话 | headless 里把默认模型指向 `workbuddy/hy3` | **未跑通**，报 `UNKNOWN: pi-ai provider "workbuddy" has no configured model "hy3"`；**同一故障用原始 `dsh-workbuddy-connect@0.7.9` 在 rc.2 上复现**，属上游在 headless 下的默认模型解析时序，不是本次合并引入 |
| 面板与品牌改写 A/B | — | **未验证**：需要在桌面 App 里发一轮真实对话（成功即说明 11128 已消失）。想对比就把 `WORKBUDDY_BRAND_FIX=0` 再发一轮，应重新拿到网关拒绝 |

### 跑离线冒烟

冒烟脚本要能解析到宿主 peer 包（`@deepseek-ai/dsh-llm` 等），所以不能直接在本仓库里跑——先搭一个装了宿主依赖的临时工程，再把本包整个放进去：

```sh
mkdir -p /tmp/wbtest && cd /tmp/wbtest
printf '{"name":"wbtest","private":true,"type":"module"}' > package.json
npm install @deepseek-ai/dsh-llm@0.2.1-rc.3 @deepseek-ai/dsh-llm-pi-ai@0.2.1-rc.3 \
  @deepseek-ai/dsh-home-paths@0.2.1-rc.3 @deepseek-ai/schemastery@3.18.5 \
  @earendil-works/pi-ai@1.3.0 @deepseek-ai/cordis@4.0.5
cp -R /path/to/packages/dsh-workbuddy-plus node_modules/dsh-workbuddy-plus
node node_modules/dsh-workbuddy-plus/test/smoke.mjs     # 退出码 0 = 通过
```

想验证 rc.2 兼容就把依赖换成 `0.2.1-rc.2`（`schemastery` 换 `3.18.4`）。

## 跟随上游

```sh
node scripts/vendor-upstream.mjs /path/to/new/dsh-workbuddy-connect
```

脚本会复制 `lib/` 产物、重打 4 处改名、并校验路由前缀没被误伤；任何一处对不上（上游改了 `id` 的写法、加了新的按包名接线的 key）都会直接报错退出，不会静默漏改。改完跑一遍 `test/smoke.mjs`。若上游改了 `chatStream` 签名，冒烟会以 `chatStream 接缝消失` 失败——品牌改写就挂在那个方法上。

## 已知边界

- 浏览器半只在「包名与 `client.js` 里 4 处标识一致」时才会被宿主接上；手工改包名而不重跑 vendor 脚本会静默不加载面板。
- 上游的更新检查、求助文案、仓库链接仍指向上游 `dsh-workbuddy-connect`（本包版本 0.8.0 高于上游 0.7.9，不会误报「有新版」）。
- 品牌改写覆盖整个请求体，见上文取舍说明。
- `engines.dsh` 用的是 `>=0.2.1-rc.2 <0.3.0-0`。按 semver 的预发布规则，它**不会**自动放行 `0.2.2-rc.1` 这类跨小版本的预发布——宿主一旦换到那个版本，需要把 `engines.dsh` 一起改（否则闸门会重新拦下，这是刻意的：宁可拦住也不要在没验证过的宿主上跑）。

## 许可

本包 MIT。`lib/connect/` 全部来自 MIT 许可的 `dsh-workbuddy-connect`（© corrinehu），许可原文见 [`LICENSE.upstream-dsh-workbuddy-connect`](./LICENSE.upstream-dsh-workbuddy-connect)，随包第三方声明见 [`THIRD_PARTY_NOTICES.txt`](./THIRD_PARTY_NOTICES.txt)。
