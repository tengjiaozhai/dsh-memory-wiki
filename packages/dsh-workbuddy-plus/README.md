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
- 状态卡片里的「Signed in as」、账号标题、额度与模型可见性仍只反映**主账号**（那是上游的浏览器半，本层没有改它）；切号本身可以在卡片上手动按（见下一节），自动切换只体现在服务端日志：

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

### 卡片上手动切号

CN 卡片（设置 → 插件 → WorkBuddy）的「账号」标题右侧有一条三档分段控件：

```
账号                        ┌────┬──────┬──────┐
                            │自动│ 主号 │ 备号 │
                            └────┴──────┴──────┘
```

- **自动**：恢复上面的策略（`failover` 或 `rotate`）。这是默认值，也是「我不管，插件自己判断」的姿势。
- **主号**：下一轮请求先打主号。主号遇到**额度用尽 / 限流 / 登录失效**时仍会切到备号——手动档只决定「谁先上」，不是「只准用谁」。注意**这三类之外不换号**：主号 5xx、网络错误会直接失败，备号不会被尝试（`SWITCHABLE_KINDS` 只含那三种）。
- **备号**：下一轮请求先打备号。备号**任何**失败都回落主号（主号是用户预期的那一个）。
- 想「只用选中的那一个、失败也不换」：设 `WORKBUDDY_ACCOUNT_MANUAL_STRICT=1`（严格档）。代价是没有兜底——主号额度用尽就直接报错；如果选中的是备号而备号当前不可用，则**一个请求都不会发出**，此时错误码是 400、message 写明「已选备用账号但它不可用（…）」，卡片上的说明也会写「严格档不会换号，本次请求没有发出」而不是「回落主账号」。
- 三档只影响**下一个请求从谁开始**，不改凭据文件、不改环境变量、不需要重启。选完立即生效，Host 返回的完整状态会替换按钮上的显示。
- 手动档是**粘性**的：一次成功不会把它悄悄改回「自动」（自动切换内部的 `noteSuccess` 会跳过手动档），只有你自己再按「自动」才恢复策略。
- **控件什么时候出现**：只要备用**槽位配置存在**（`WORKBUDDY_AUTH_FILE_2` 指了路径，或默认的 `.workbuddy-account-2.info` 存在）且 `WORKBUDDY_ACCOUNT_POLICY` 不是 `off`，路由就会挂上、控件就会出现。所以「环境变量指了路径但文件不在」是另一种情形：控件在，备号按钮禁用，悬停写「备用凭据文件不存在」——它跟「压根没配备号」看起来不同，这是刻意的（一个是你配错了路径，一个是你没配）。一个备号都没配时整条控件不渲染，不在卡片上摆一排按不动的按钮；路由没挂上（插件更新了但应用没重启）时也是整条隐身。
- **备号不可用时按钮禁用**，判定标准是「真能解析成另一个账号」：坏信封、与主号是同一个账号这两种算不可用（文件整个不存在的情形归上一条，压根不渲染），悬停会给出具体原因。以前这里只看文件在不在，于是坏文件会让按钮亮着，按下去每次静默空转。
- **按了却不兑现会说出来**：手动选备号但备号不可用时，请求仍会走主号（否则整轮报错），同时控件下面显示一行原因（Host 的 `degraded.message`）。手动选主号但主号额度用尽、由备号接住时同理。这句话只由 Host 产生，卡片不自己猜。
- **原因说的是真原因**：同样是 `degraded`，两条路径的措辞不同——「备号压根没被用上」（读不到/坏信封/同账号）与「备号用上了但上游失败」分开写，后者会带上真实类别（如 `server`、`hard_credit`），不把上游 500 说成凭据损坏。
- **禁用时说具体原因**：悬停提示取自 Host 的 `unavailableReason`（「备用凭据读不出来（…）」「备用账号与主账号是同一个账号」），只有在没给原因时才退回通用文案「没有配置备用凭据文件」。
- 状态是进程内的（`Symbol.for('dsh-workbuddy-plus/account-override')`），DSH 重启后回到「自动」。按回「自动」时池状态会一并复位，不会带着手动期间遗留的「优先备号」继续跑。

实现上分两半。Host 半是要重启才生效的（路由在启动时注册），浏览器半走 `/plugins/events` 的 bundle 热更新，改完刷新页面就能看到：

| 位置 | 文件 | 作用 |
| --- | --- | --- |
| Host | `lib/account-pool.js` | `GET/POST /plugins/dsh-workbuddy-connect/account`，读写手动优先级 |
| 浏览器 | `lib/connect/client.js` 的补丁区 | 三档控件 + `useAccountSwitch` 钩子 |

浏览器半是 vendor 产物，直接手改会在下次 `node scripts/vendor-upstream.mjs` 时被整份覆盖，所以那部分由 `scripts/patch-client-account-switch.mjs` 打补丁（`npm run vendor` 已经串上了这一步）。补丁区自带 `//#region … //#endregion` 围栏，脚本每次先把围栏整段剥掉再重打，因此可以反复执行、也能随脚本升级。

补丁脚本自己也会在三种「打了但其实坏了」的情形上直接报错，而不是打出一份半成品：

- 补丁区引用的上游标识符（`noticeStyle`、`CN_CARD_VARIANT` 等）被改名或删掉 → 报「depends on upstream identifier(s) that no longer have a definition」。语法仍然合法，但渲染到那一支会抛 `ReferenceError`，属语法校验抓不到的一层；
- 收尾围栏没了 → 报「its closing `//#endregion` … is missing」。围栏的判据是「MARKER 之后第一个顶格的 `//#endregion`」：本补丁区顶格插入，上游那些 region 都缩进两格，所以不会串到别人的结尾去（删掉围栏时会一路吞掉卡片组件本体）；
- 补丁区内容被改一半 → 报「in an inconsistent state」，并把落盘前的整文件语法校验结果一起打出来。落盘走「写临时文件 + rename」，中途失败不会留下半截 `client.js`。

同一个「备号能不能用」在三处出现，名字不同是因为它们回答的问题不同，别当成同一个字段：

| 名字 | 出处 | 回答的问题 | 会变的时机 |
| --- | --- | --- | --- |
| `secondarySlot` | `accountPoolStatus()` | 槽位**配了没有**（文件在不在 / 环境变量指了没） | 文件出现或消失 |
| `secondaryUsable` | `accountPoolStatus()` | 最近一次**真解析**的结论 | 探测过、且文件大小或 mtime 没变 |
| `secondaryConfigured` | 路由 `describe` 的回参 | 备号**现在能不能用**（= `usable`） | 每次 GET 都重算（15s 缓存） |
| `available.secondary` | `GET /account` 的文档 | 同上，给浏览器看的那一份 | 每次 GET |
| `secondaryConfiguredAt(path)` | `lib/account-pool.js` | 只判「这个路径上有没有文件」 | 调用时 |

一句话：`secondarySlot` 是「你配了没」，另外几个是「能不能用」。卡片上的禁用只看 `available.secondary`；`accountPoolStatus()` 里的 `secondaryUsable` 是给日志与测试看的快照，可能是 `undefined`（还没探测或文件已变）。

写完 Host 代码要重启 DSH——路由是启动时注册的，热更新只覆盖浏览器半。文件换了但应用没重启时，卡片上的控件会自己隐身（GET 拿到 404 就整条不渲染），不会在卡片上留一句红字。

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
| 手动切号（路由） | `test/switch-ui.mjs route` | 通过：GET 给 key 与 `available`；缺 key / 错 key 写入 403；带 key 写入回吐完整文档；未知取值 400 |
| 手动切号（生效） | `switch-first` / `fallback` / `sticky` / `auto-release` | 通过：手动选备号后首个请求就是 `token-b`；备号 5xx 回落 `token-a`；连续两次都先备用（成功不改写手动档）；切回自动后立刻恢复主号优先 |
| 手动切号（备号不可用） | `unavailable` / `bad-secondary` | 通过：槽位指向不存在或坏掉的文件时 `available.secondary=false` 且带 `unavailableReason`，卡片据此禁用「备号」并给出原因 |
| 手动切号（无备号仍可请求） | `no-secondary` | 通过：槽位文件消失但状态仍停在「备号」时，请求只发一次且用主号成功，不会整轮报错 |
| 手动切号（路由自身失败） | `route-failure` | 通过：状态探针抛错时 GET/POST 都回 500 + `account-route-failed` + 真原因（宿主的 `.catch` 会把未捕获异常压成「400 + 空体」）；POST 在读文档失败时**状态一点没改**（先读文档、后写状态） |
| 手动切号（守卫层） | `guards` | 通过：伪 `Host` 403、跨站 `Origin` 403、`Origin: null` 403、`PUT` 405、非 loopback 的 `PUT` 仍 403（不泄露路由存在）、2KB body 413 且 override 未被改、响应带 `Cache-Control: no-store`、GET 文档里没有凭据 |
| 手动切号（回吐的是写入后的文档） | `route-stale-degraded` | 通过：写回响应里的 `override` 是刚按下那一档（不是写入前读到的旧值），写入前读到的 `degraded` 不带回来（Host 在写入那一刻已经清掉，带上会让卡片多挂一句作废的红字），`available` 照旧透传 |
| 手动切号（全失败也留痕） | `double-fail-manual` | 通过：手动选备号、备号 500 + 主号 402 两档全败时，最终报主号的真原因，同时写 `degraded`（`secondary-unusable` + 「已选备用账号但它这次失败（server），两档都没成功」），档位不被改写 |
| 手动切号（硬失败也留痕） | `manual-miss-hard-fail` | 通过：主号 500 不属于可切换类别、请求停在主号就早退，这条路径以前完全不写 `degraded`；现在会写 `primary-fell-back` + 真实类别，并说「本次只尝试了选中的这一档」而不是「两档都没成功」 |
| 手动切号（文案按真实档数） | `manual-miss-single-slot` | 通过：严格档只发选中的那一档，`degraded.message` 因此写「本次只尝试了选中的这一档」，不再说「两档都没成功」（那句话在严格档是讲一件没发生的事） |
| 手动切号（同档重按=清红字） | `same-slot-repress` | 通过：`degraded` 存在时再按一次当前档位，响应与服务端状态里的旧记录都清掉（语义是「我重新表个态」），档位不变 |
| 手动切号（按了却没兑现） | `secondary-degraded` / `secondary-upstream-fail` / `primary-fell-back` / `strict-unavailable` | 通过：备号不可用→落主号并说明原因；备号被用了但上游 500→说「这次失败（server）」而不是「凭据损坏」；主号 402→备号接住并记 `primary-fell-back`；严格档选备号但备号不可用→一个请求都不发、状态码 400、不声称「回落」 |
| 手动切号（接线） | `wiring` | 通过：路由 `kind/path` 正确、挂在 `effect` 里可 dispose；浏览器半的路由常量与 Host 半一致；文案不承诺 5xx 兜底；`inject` 回调里注册失败时 `onError` 必须被调用（cordis 会吞掉那层异常，调用方的 try/catch 抓不到） |
| 手动切号（飞行中改档） | `inflight-switch` | 通过：手动备号发出请求后按回自动，飞行中的成功回调**不得**把池状态写回备号——回自动后的第一个请求必须是 `token-a`。去掉 `noteSuccess` 的档位快照守卫后这条会红 |
| 手动切号（全部场景） | `node test/switch-ui.mjs all` | 通过：23 个场景逐个起子进程（池状态与手动优先是模块级单例，同进程连跑会互相污染） |
| 手动切号（真宿主 HTTP） | **一次性人工验证**（两次，2026-11-01）：rc.5 与 rc.2 各起一次真 web（临时 `DSH_HOME` + profile `wbverify` + 端口 57999），用 curl 打 `/plugins/dsh-workbuddy-connect/account` | 通过：GET 200 给 `key/override/available`；缺 key 403、错 key 403、取值非法 400、`PUT` 405、Host 非 loopback 403、Origin 非 loopback 403、5KB body 413、响应头 `Cache-Control: no-store`；带 key 写 `secondary` 后 GET 读到 `override:"secondary"`，写 `primary`/`auto` 都立即回吐新文档。另测两项：把备号文件改成坏信封后 GET 立刻给 `available.secondary=false` + `unavailableReason`（真解析，不是看文件在不在），改回去又变 true；`/plugins/events` 的 graph 帧里 `dsh-workbuddy-plus` 条目存在，按它的 `rev` 拉到的 bundle 里 `AccountSwitch` 出现 4 次、`X-WorkBuddy-Account-Key` 在——浏览器半确实带着控件上线。**没有落成脚本**（要起真宿主、造临时 home、从 `/plugins/events` 取 rev），复跑照本行描述手工做；日常回归覆盖 `test/switch-ui.mjs route`（裸服务器 + 同一个 handler），差别只在「宿主有没有把路由挂上去」 |
| 卡片渲染 | `test/render-card.mjs` | 通过：补丁后 client.js 仍能加载、`apply` 仍注册两张卡片与文案表；三档控件渲染出三态、`aria-pressed` 唯一、无备号时禁用、`busy` 时全禁用、非 CN 卡片返回 null；禁用时优先显示 Host 给的具体原因（坏信封/同账号），没给才退回通用文案；`degraded.message` 会渲染成一行说明；把卡片强制掰成展开态后，断言「账号」标题与 `role="group"` 的三档控件在同一行容器里相邻（接线被删就会红） |
| 卡片会不会自己重读 | `test/card-poll.mjs` | 通过：带一个只管 `useState/useRef/useCallback/useEffect` 的迷你 hooks 运行时驱动 `useAccountSwitch`——挂载后读一次；定时器到点再读一次（Host 侧改的 `override`/`unavailableReason`/`degraded` 能自己走到卡片上）；写入飞行期间轮询不并发发读（否则会覆盖刚按下的档位）；路由 404 时整块隐身并停掉轮询；网络失败留一句可读的 `failure` 且不清掉已知文档。三个破坏性探针（拆轮询、拆并发守卫、拆 404 分支）各自让这条测试变红 |
| 补丁器自检（坏输入） | `/tmp` 下的破坏性探针：删 MARKER、只删 MARKER 行、删收尾围栏、上游把 `WorkBuddyPluginCard` 改名、改文案值、改缩进、改 `noticeStyle`/`CN_CARD_VARIANT` 名、回退单条 edit、从上游重打 | 全部按预期：前七种直接报错（leftover region / partial region / inconsistent state / depends on upstream identifier），回退单条 edit 与从上游重打都能正常补齐且结果与原文件 **sha256 完全一致**（`24469d78…`） |
| 真 apply 接线 | `test/apply-wiring.mjs` | 通过：不喂桩 describe，直接让 `apply()` 在假 ctx 上跑，再把它注册的路由挂进真 http server 打一轮——`apply()` 确实挂上切号路由（`kind=exact`、标签含 `account preference`、`routeFailed=false`）；备号文件能解析 → `available.secondary=true`；写成坏信封 → `false` 且带原因；写回原样 → 立刻恢复可用（缓存按 size+mtime 失效，不用等 15s）；POST 带 key + 同源 Origin → 200 且响应回吐**新**档位；dispose 后注册表清空。破坏性探针：把挂路由那行关掉、把 describe 写死成「可用」，各自让这条变红 |
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

`npm run vendor` 末尾会自动跑 `scripts/patch-client-account-switch.mjs`，把手动切号控件重新打进新的 `client.js`。上游改了卡片标题行或文案表的形状时，补丁会带着「expected 1 occurrence(s) of … / found 0 — upstream layout changed, update the patch」直接失败，而不是打出一份半成品——照这句提示改脚本里的 `EDITS` 即可。改完用 `npm run test:switch-ui`（23 个场景）、`npm run test:render` 与 `npm run test:card-poll` 复验（`npm run test:all` 一次跑完）。

## 已知边界

- 浏览器半只在「包名与 `client.js` 里 4 处标识一致」时才会被宿主接上；手工改包名而不重跑 vendor 脚本会静默不加载面板。
- 上游的更新检查、求助文案、仓库链接仍指向上游 `dsh-workbuddy-connect`（本包版本 0.8.0 高于上游 0.7.9，不会误报「有新版」）。
- 品牌改写覆盖整个请求体，见上文取舍说明。
- `engines.dsh` 用的是 `>=0.2.1-rc.2 <0.3.0-0`。按 semver 的预发布规则，它**不会**自动放行 `0.2.2-rc.1` 这类跨小版本的预发布——宿主一旦换到那个版本，需要把 `engines.dsh` 一起改（否则闸门会重新拦下，这是刻意的：宁可拦住也不要在没验证过的宿主上跑）。

## 许可

本包 MIT。`lib/connect/` 全部来自 MIT 许可的 `dsh-workbuddy-connect`（© corrinehu），许可原文见 [`LICENSE.upstream-dsh-workbuddy-connect`](./LICENSE.upstream-dsh-workbuddy-connect)，随包第三方声明见 [`THIRD_PARTY_NOTICES.txt`](./THIRD_PARTY_NOTICES.txt)。
