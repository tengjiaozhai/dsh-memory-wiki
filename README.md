# dsh-memory-wiki

把本地 LLM-Wiki 里的**已有判断**，作为冻结、带来源的证据带进 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的对话。

每轮真人输入时自动检索你的 Markdown 知识库，在字符额度内编译成一份**快照**注入模型请求；面板可看候选、图谱、额度与确切待带入文本，也可以手选覆盖下一轮。Wiki 始终是唯一权威。默认只读；显式启用经验采集后，可在真人任务结束时判定并摄入有证据支持的编码经验。

> 插件本体在 [`packages/dsh-memory-wiki`](./packages/dsh-memory-wiki) —— 完整说明、配置项与已知限制见那里的 [README](./packages/dsh-memory-wiki/README.md)。

## 安装

```sh
# 1) 装插件
dsh plugin --profile desktop add dsh-memory-wiki

# 2) 在 profile 的 cordis.patch.yml 里指向你的知识库
#    - id: memory-wiki
#      config:
#        enabled: true
#        wikiRoot: '/absolute/path/to/your/wiki'   # 必须填
#        budgetChars: 4000                          # 4000 或 8000
```

`wikiRoot` 指向仓库根，插件只扫 `wiki/{sources,entities,concepts,synthesis,outputs}/*.md`。

Desktop 自动采集配置位于 `~/.dsh/profiles/desktop/cordis.patch.yml`（自定义位置为 `$DSH_HOME/profiles/desktop/cordis.patch.yml`）。在现有 `memory-wiki.config` 下设置 `capture.enabled: true` 并配置模型、Skill 和独立凭据，随后重载插件，在“沉淀记录”确认本地就绪。完整 YAML、凭据路径和启用检查见 [Desktop 配置指南](./packages/dsh-memory-wiki/README.md#desktop-配置)。

配套 skill 在 [`skills/llm-wiki`](./skills/llm-wiki)（`SKILL.md` + `references/`），采集端用 `capture.skillPath` 指向它。它只随仓库分发，不进 npm 包——`packages/dsh-memory-wiki/package.json` 的 `files` 只含 `lib/` 与 `cordis.patch.yml`，从 npm 安装的用户需另行获取。

本地开发（用 `link:` 装当前工作树）：

```sh
pnpm install
pnpm typecheck && pnpm build && pnpm test
DSH_HOME=$PWD/../.dev-dsh dsh plugin --profile web add "link:$PWD/packages/dsh-memory-wiki"
```

## 为什么是 workspace 而不是单包

一个可直接发布单包更简单，但这个插件不行：DSH 的 Typert 生成器要求插件包位于 `<workspaceRoot>/packages/<pkg>`，否则**严格 codec 生成不出来**，插件的类型化 Remote 就没有入参校验。所以仓库根只放 workspace 配置，真正的包在下一层：

```text
.                          workspace 根（private，不发布）
├── packages/dsh-memory-wiki      ← 发布到 npm 的就是这个
├── packages/dsh-typert-protocol  ← 声明镜像（private），只为生成器提供类型
└── skills/llm-wiki               ← 配套 skill：ingest / query / lint 流程与页面模板
```

## 状态

- `0.1.0` · 默认只读，自动经验采集需显式启用 · 单库 · 当前按 DSH `0.2.1-rc.3` 验证
- 已知限制见包内 README 的「已知限制」一节——那里写的是实情，不是免责声明

## 许可

MIT
