---
name: llm-wiki
description: 个人 LLM Wiki 知识库（Agent 工程 / EDA / 安全运维笔记），位于 /Volumes/PortableSSD/docs/tengjiaozhai.github.io。用于：回答 Agent 开发、上下文压缩、工具设计、意图识别、向量库、SSE、工具熔断、Agent 评测等概念问题；把新笔记摄取进 wiki；检查 wiki 断链与漂移；把对话结论沉淀成 synthesis。当用户问及 agent 工程概念、提到「我的 wiki / 我的笔记 / 知识库」、或要求 ingest / lint / query / save 时使用。跨项目可用，不要 cd 到该目录。
---

# 个人 wiki

用户的第一手技术笔记（Agent 工程、EDA、安全运维）织成的三层知识库。**你的任务是当索引员，不是当作者**：结论来自用户的笔记，你负责定位、织链、暴露冲突。

## 位置

```text
/Volumes/PortableSSD/docs/tengjiaozhai.github.io/
├── wiki/              知识层（你维护）
│   ├── index.md       先读这个定位
│   ├── log.md         操作记录
│   ├── sources/       42 页：raw 的登记页
│   ├── entities/      12 页：具体的东西
│   ├── concepts/      14 页：抽象机制
│   ├── synthesis/     5 页：跨来源对比与决策
│   └── outputs/       1 页：成品索引
├── tools/             wiki-index.mjs / wiki-lint.mjs
├── AGENTS.md          schema 权威（575 行）
└── *.md + thoughts/   raw：用户的原始笔记
```

**跨项目使用**：两个工具都用 `dirname(import.meta.url)` 定位仓库根，从任何 cwd 调用都能跑。不要 cd 过去，不要复制 wiki 到当前项目。

## 六件和标准 LLM Wiki 不同的事

照搬通用 LLM Wiki 模式会做错。以下每条都有实测依据：

1. **自有 raw 路径冻结**。自有笔记仍在根目录与 `thoughts/`；仓库现行 schema 允许 `raw/articles/` 收外部裁剪，并允许已授权的 DSH 事实采集器写 `experiences/<jobId>.md`。编码经验不放外部裁剪目录。原因是 `index.html` 的 `MD_FILES`、文件名路由与图片路径已固定，不能移动既有笔记。
2. **source 页写「发掘与分流」，不写摘要**。用户笔记本身就是结论，再写「关键收获」等于复述。source 页的四节固定为：这一篇覆盖什么（只写边界）/ 可抽出的原子（本页主要交付物）/ 与其他笔记的重叠点 / 本篇独有。
3. **raw 可改写，靠 `raw_digest` 防静默漂移**。digest 格式 `<行数>-<sha1前8位>`，口径是 `split('\n').length`（不是 `count('\n')`，两者差 1，曾导致 22 个误报）。lint 报 drift 时必须重读变化再改 digest，不许只改数字蒙过检查。
4. **wiki 不进站点**。`index.html` 的 `MD_FILES` 里没有 `wiki/`，`[[…]]` 在网页上是字面量。不要提议把 wiki 加进站点，也不要在 wiki 页里写能在站点渲染的语法。
5. **`thoughts/` 三档分层**：A 22 篇独立 source 页 / B 65 篇归 9 个簇页 / C 15 篇只登记在 `thoughts-toc.md`。C 层是无 `✅` 前缀的 17 行空草稿，不建档。
6. **禁止链到 raw 的内部小节**。`原理图与 EDIF 工作流.md` 有 290 个 h2，`index.html` 的 TOC 用 `heading-{i}`，插一节后面全漂。证据只指到「文件级 + 标题文本」。

## 五个操作

| 操作 | 何时用 | 详见 |
|---|---|---|
| **query** | 用户问概念、要决策依据、想不起某件事的结论 | [references/operations.md](references/operations.md#query) |
| **ingest** | 用户写了新笔记，或改了旧笔记 | [references/operations.md](references/operations.md#ingest) |
| **lint** | 定期体检、怀疑有断链或漂移 | [references/operations.md](references/operations.md#lint) |
| **save** | 对话产出了有沉淀价值的对比或结论 | [references/operations.md](references/operations.md#save) |
| **compile** | 已退役（首批建库用过），只在用户要求批量补域时重启用 | [references/operations.md](references/operations.md#compile) |

页面模板见 [references/page-templates.md](references/page-templates.md)。**从零建库**（新仓搭骨架、脚本职责、第一批怎么灌）见 [references/bootstrap.md](references/bootstrap.md)。完整 schema 见仓库 `AGENTS.md`，**以它为准**，本 skill 只记差异和流程。

## 工具

```bash
node /Volumes/PortableSSD/docs/tengjiaozhai.github.io/tools/wiki-lint.mjs
node /Volumes/PortableSSD/docs/tengjiaozhai.github.io/tools/wiki-lint.mjs --only digest
node /Volumes/PortableSSD/docs/tengjiaozhai.github.io/tools/wiki-index.mjs          # 干跑
node /Volumes/PortableSSD/docs/tengjiaozhai.github.io/tools/wiki-index.mjs --write  # 落盘
```

`--only` 可选值：`broken` `orphan` `frontmatter` `digest` `dup` `stale`。

lint **不重建** index，两件事分开。lint 只读，绝不自动改文件。

## 八条硬规则

1. **双链用 vault 全路径 + 别名**：`[[wiki/concepts/工具熔断|工具熔断]]`。frontmatter 里的 `sources`/`concepts`/`entities` 填不带方括号的路径。
2. **每页至少一条出站链接**。无页可链时写 `## 待链接` 列应建页面名，不许留空。
3. **一个概念只有一页权威**。新建前先 `grep` index 与 `concepts/`，能容纳就更新，不建平行页。
4. **冲突不覆盖**。新材料与旧结论矛盾 → 加 `## 冲突` 段，写清观点 A / 观点 B / 分歧原因 / 能定论的验证方式。旧结论代表当时的真实判断，抹掉就看不出演进。
5. **证据可追溯**。任何事实性断言落到 raw 的具体标题，写不出就标 `confidence: low` 或进「待澄清」。
6. **区分观察 / 推断 / 已证实**。不确定写「疑似」「推断」，不许写成陈述句。
7. **不链 raw 内部小节**，只指「文件 + 标题文本」。
8. **不擅自 git commit**。用户明确说「提交/推送」才动。

## 别做的事

- **别 cd 到 wiki 目录**。用绝对路径读写，当前项目的代码和 wiki 互不干扰。
- **别把 wiki 内容复制到当前项目**。要引用就写绝对路径或双链，复制会立刻过时。
- **别为了「完整」补页**。14 个 concept / 42 个 source 这个比例是对的：source 是入口，concept 是出口。造两句话的 concept 页是退化。
- **别把 raw 的推理链搬进 wiki**。concept 的价值在「一句话定义 + 我的判断 + 取舍边界」，搬论证只是复制。
- **raw 分类按实际 `AGENTS.md`**：既有笔记不搬迁；外部裁剪与 DSH 编码原始证据分别按 schema 的目录及写权处理。
- **别动 `index.html` 和 `MD_FILES`**。

## 回答时的口径

```text
结论先行 → 依据（带 [[wiki/...]] 引用）→ 边界（什么时候不适用）
```

- 读 `wiki/index.md` 定位，再读具体页全文，不停在摘要。需要细节才回溯 raw。
- wiki 未覆盖就直说「wiki 未覆盖，该找什么资料」，**不要拿常识补**。
- `confidence: medium` 的内容在答案里降级表述。本库目前只有 `幂等与写入恢复` 一页是 medium。
- 有 `## 冲突` 的页必须把两方都给出来。
- 答案有沉淀价值时，**提议**存成 synthesis，不擅自写。
