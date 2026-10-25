# dsh-memory-wiki

把本地 LLM-Wiki（一组互链的 Markdown 笔记）里的**已有判断**，作为**冻结、带来源**的证据带进 DeepSeek Harness 的对话。

Wiki 仍是唯一知识权威。默认做「检索 → 冻结 → 引用」；显式启用经验采集后，还会在真人轮次结束时后台判断并摄入有证据支持的编码经验。

## 它做什么

- **整库图谱浏览**：打开即显示当前 Wiki 的全部有效页面与真实链接，无需先搜索或绑定会话。点击节点读取正文、查看出链与反链；顶部搜索按页面标题或路径定位。
- **按需展开详情**：图谱是主画布，右侧阅读浮层在选中页面后出现；“上下文”入口单独容纳会话依据操作。窗口较窄时详情展开为阅读视图。
- **每轮自动带入**：真人输入开启的轮次里，按当前问题做页级检索，一跳扩展关联页，在字符额度内编译成一份快照，作为带来源的 user 消息注入模型请求。
- **可手选覆盖**：面板里挑页、看额度、看确切待带入文本，点「准备覆盖」后**下一轮**改用你的选择，只用一次。
- **三个只读工具**：`wiki_search` / `wiki_read` / `wiki_neighbors`，让模型自己翻页。
- **可回溯**：快照正文与来源版本进会话日志，重开、重放、压缩之后都能核对。

浏览页面不会改变对话依据。需要手选时，点击详情中的「选为下一轮依据」，在上下文里「应用改选」查看服务端预览，再「准备下一轮」。改选尚未应用时，准备按钮保持禁用。

库级 Remote 读取为 `memoryWiki/graph({})` 和 `memoryWiki/readPage({ pageId, contentHash? })`；读页不再接受 `sessionId`。会话的 `view/search/reviseDraft/prepareOverride/clearOverride` 仍检查会话与写入版本。前后端需要一同重载，不能混用旧的读页契约。

DSH `0.2.1-rc.3` 会缓存插件的 Typert manifest。升级已有 Remote 方法的参数时，组件/插件开关和页面刷新不会清掉后端旧缓存，需要重启 DSH 后生效；出现 `wire field "input" failed boundary validation` 时先确认前后端运行同一版契约。

## 安装

```sh
dsh plugin --profile desktop add dsh-memory-wiki
```

然后在 profile 的 `cordis.patch.yml`（或应用的插件设置）里填 `wikiRoot`：

```yaml
- id: memory-wiki
  name: 'dsh-memory-wiki'
  config:
    enabled: true
    wikiRoot: '/absolute/path/to/your/wiki'   # 必填
    budgetChars: 4000                          # 4000 或 8000
```

`wikiRoot` 指向**仓库根**，插件只扫这五个目录：`wiki/{sources,entities,concepts,synthesis,outputs}/*.md`（`index.md` / `log.md` 不进正文）。

> `wikiRoot` 留空不会报错，也不会猜路径：插件记 `skippedReason=disabled`、什么都不注入。这是刻意的——宁可明确「没配」，也不要静默用一个错误目录。

## 工作方式（一句话版）

```text
用户输入 ──预检索──> 候选页 ──额度编译──> 冻结快照 ──注入──> 模型请求
                                        └─ 存入会话日志（可回读）
```

关键取舍：

- **只在真人轮次触发**（判据是 `source.kind === 'user'`），插件注入、运行时上下文、压缩检查点都不会触发，避免自激。
- **快照在轮次内不变**：同轮多步、重试都用同一份；Wiki 后来改了也不换本轮依据。
- **手选覆盖只消费一次**，且只在它自己的 `user/message` 真正落库后算消费。

## 已知限制

写清楚比藏起来好：

| 限制 | 说明 |
|---|---|
| 当前宿主 DSH `0.2.1-rc.3` | 自动采集接入按该版本验证；DSH 公共接口仍处 pre-stable，升级需重新验证 |
| 单库 | 一个配置对应一个 Wiki 根；改 `wikiRoot` 要重载插件 |
| 默认只读 | `capture.enabled` 默认为 false；启用后只有 Jev 两阶段高置信且程序检查通过的经验可自动写入，不提供任意 `wiki_remember` |
| 输入严格、输出不严格 | 入参由生成的 strict codec 校验（多余字段拒绝）；返回值的 codec 目前是宽松的（上游生成器限制），不要据此宣称「双向严格」 |
| 压缩后补注 | 有实现，但在 `0.2.1-rc.2` 的自动压缩里没有可触发路径；只在手动 `/compact` 场景验证 |
| 不提供「provider 已读取」状态 | 面板只展示「已提交到日志」与调用进展，不声称模型一定用了它 |

## 自动沉淀编码经验

在既有配置中加入：

```yaml
capture:
  enabled: true
  judgeModel: typesafe/jev-1.14.0
  judgeBaseURL: https://api.commandcode.ai/provider/v1
  skillPath: /absolute/path/to/llm-wiki/SKILL.md
```

服务端从 `CMD_API_KEY` 或 `$DSH_HOME/credentials/memory-wiki-commandcode.key` 读取 CommandCode key；本地凭据文件应为 `0600`，不要放进插件配置或 Git。Jev 通过 CommandCode 的 `/provider/v1/systemone` 调用，仍使用 TypeSafe System One 协议和 SDK。`judgeBaseURL` 填含 `/v1` 的完整 API 根，程序处理 SDK 的路径拼接。生成笔记使用原轮次已解析的普通 LLM provider/model，写作调用没有工具权限。

原直连配置应改为上述模型 ID 和地址；项目不再读取 `TYPESAFE_API_KEY`、`TYPESAFE_BASE_URL` 或旧 TypeSafe key 文件，也不回退到旧服务。当前只接受 `typesafe/jev-1.14.0`；其他版本或别名需先调整固定版本并重新校准。远端地址要求 HTTPS，本机受控验证可用 loopback HTTP。

目标 Wiki 必须按自己的 `AGENTS.md` 显式允许自动经验来源，含 `<!-- dsh-memory-wiki:auto-capture=v1 -->` 标记。来源写到 `experiences/<jobId>.md`，source 沿用 `note`；真实 Skill、operations、模板与 schema 每次读取并记录版本。默认安装不会获得写权限。启用后的高置信任务不逐条请求确认，中低置信或冲突保留候选。

处理顺序：真人 `turn/end` → 冻结 raw events → Jev 判断价值 → 按 Skill 准备暂存页 → 固定 index/lint 检查与第二次 Jev 断言验证 → 串行发布 → 刷新检索。失败工具结果保留；助手自述不视为修复验证。面板的“会话上下文”显示本轮状态和沉淀页面，可直接进入对应的完整记录。

任务与恢复清单保存在 `$DSH_HOME/storages/memory-wiki-auto-capture/<库哈希>/`，不保存 API key。重复终态、重启和同库并发用稳定 jobId 与文件锁处理；既有页面保留正文并补实例，发布前发现外部修改则停止，避免覆盖。发布是可恢复的逐文件替换，不是跨文件原子事务。

当前验证边界：CommandCode 的固定版本模型真实请求已返回 HTTP 200，实际 `JevJudge` 的两阶段调用也成功完成。合成样本未达到高置信条件，按设计保留候选，没有写入真实 Wiki；尚未完成生产样本校准及真实经验自动沉淀验收。网络/API 错误会显示失败，不会换模型或把未验证内容写入 Wiki。自动采集默认关闭；查看历史不会启用采集或调用模型。

### 查看沉淀记录

顶栏 **沉淀记录** 打开当前会话历史：按状态筛选、分页加载，再展开任务的阶段时间线和每次 Jev 判定。每次记录分别保留初判／核验结果、当次问题与答案、实际门槛、固定模型版本、UTC 时间、本地 SDK 调用耗时及服务返回的 token 用量；null 用量显示“未提供”。概率不代表结论正确率。

初判通过、核验通过和发布成功分别显示；中断调用为“结果未知”，发布结束记录缺失为“发布结果待核对”。旧任务仅显示旧状态快照，不补造历史。原始证据预览最多 12 条、每条 1,000 字符，完整记录保留在本地；列表不返回整段会话。

采集关闭时仍可查历史。界面分别显示未启用、等待宿主、本地就绪和不可用；“就绪”不表示远端 Jev 已通过探活。当前本机已认证 Desktop 按宿主会话存在性与 job 归属限制查询，不提供多用户 ACL 或全会话枚举。查看其他会话先在宿主切换会话。

历史读取通过 `captureStatus/captureHistory/captureRecord/captureJudgment` 四个只读 Remote 完成，不恢复任务、不调用模型、不写 Wiki。返回图谱保留原实例、相机和选中页面。从历史打开沉淀页时读取当前 Wiki 内容，并标注与发布版本的差异。

接口依据：[CommandCode Provider API](https://commandcode.ai/docs/provider)。

## 开发

这个仓库是 **pnpm workspace**，插件本体在 `packages/dsh-memory-wiki`。

为什么不是一个单包：DSH 的 Typert 生成器要求插件包位于 `<workspaceRoot>/packages/<pkg>`，否则严格 codec 生成不出来。所以仓库根只放 workspace 配置，真正的包在下一层。

```sh
pnpm install
pnpm typecheck     # host + client 两份，都必须绿
pnpm build         # 产出 lib/（client 强制单文件，不许有 chunk）
pnpm test          # node --test，跑构建产物
```

`packages/dsh-typert-protocol` 是**声明镜像**（`private`），只为生成器提供类型；运行时用的是 npm 上的真包。

## 许可

MIT
