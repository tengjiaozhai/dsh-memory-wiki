# dsh-memory-wiki

把本地 LLM-Wiki 里的**已有判断**，作为冻结、带来源的证据带进 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的对话。

每轮真人输入时自动检索你的 Markdown 知识库，在字符额度内编译成一份**快照**注入模型请求；面板可看候选、图谱、额度与确切待带入文本，也可以手选覆盖下一轮。Wiki 始终是唯一权威——插件只做「检索 → 冻结 → 引用」，不写回。

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
├── packages/dsh-memory-wiki    ← 发布到 npm 的就是这个
└── packages/dsh-typert-protocol  ← 声明镜像（private），只为生成器提供类型
```

## 状态

- `0.1.0` · 只读记忆（不写回）· 单库 · 仅支持 DSH `0.2.1-rc.2`
- 已知限制见包内 README 的「已知限制」一节——那里写的是实情，不是免责声明

## 许可

MIT
