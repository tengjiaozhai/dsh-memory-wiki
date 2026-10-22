# dsh-memory-wiki

把本地 LLM-Wiki（一组互链的 Markdown 笔记）里的**已有判断**，作为**冻结、带来源**的证据带进 DeepSeek Harness 的对话。

它不新建一座记忆库，也不改你的 Wiki：Wiki 仍是唯一权威，插件只做「检索 → 冻结 → 引用」。

## 它做什么

- **每轮自动带入**：真人输入开启的轮次里，按当前问题做页级检索，一跳扩展关联页，在字符额度内编译成一份快照，作为带来源的 user 消息注入模型请求。
- **可手选覆盖**：面板里挑页、看额度、看确切待带入文本，点「准备覆盖」后**下一轮**改用你的选择，只用一次。
- **三个只读工具**：`wiki_search` / `wiki_read` / `wiki_neighbors`，让模型自己翻页。
- **可回溯**：快照正文与来源版本进会话日志，重开、重放、压缩之后都能核对。

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
| 只支持 DSH `0.2.1-rc.2` | `engines.dsh` 钉死；DSH 公共接口仍处 pre-stable，升级需重新验证 |
| 单库 | 一个配置对应一个 Wiki 根；改 `wikiRoot` 要重载插件 |
| 只读 | 不写回 Wiki，不提供 `wiki_remember`；写回是后续设计 |
| 输入严格、输出不严格 | 入参由生成的 strict codec 校验（多余字段拒绝）；返回值的 codec 目前是宽松的（上游生成器限制），不要据此宣称「双向严格」 |
| 压缩后补注 | 有实现，但在 `0.2.1-rc.2` 的自动压缩里没有可触发路径；只在手动 `/compact` 场景验证 |
| 不提供「provider 已读取」状态 | 面板只展示「已提交到日志」与调用进展，不声称模型一定用了它 |

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
