# 页面模板

五类页面的 frontmatter 与正文结构。**权威是仓库 `AGENTS.md` §4**，本文只记要点与易错处。

通用：`domain` 只允许 `ai` / `eda` / `security` / `tool` / `finance` / `other`（复用站点 `CATEGORY_RULES` 的六个 slug）。日期一律 `YYYY-MM-DD`。

---

## source

一份 raw 的登记页。**交付物是「发掘与分流」，不是摘要。**

已授权的 DSH 编码经验采用 `source_type: note`、`source_file: experiences/<jobId>.md`，source 页文件名为 `<jobId>.md`，仍使用下列四节结构。原始经验由事实采集器生成，writer 不补造证据；自动摄入资格见 operations.md 的 DSH 分支。

命名与 raw 同名：`Harness学习笔记.md` → `wiki/sources/harness学习笔记.md`。

```yaml
---
type: source
title: "Harness 学习笔记：四套上下文压缩方案完整拆解"
source_file: "Harness学习笔记.md"     # 单篇用这个
source_type: note                      # note | article | thought-batch | toc | dataset
domain: ai
raw_digest: "4011-0f49259c"
lines: 4011
captured: 2026-10-19
status: verified                       # verified | unverified | superseded | partial | stale
tags: [harness, context-compression]
entities: ["wiki/entities/pi"]
concepts: ["wiki/concepts/上下文压缩"]
---
```

**簇页改用 `source_files` 数组**（不用 `source_file`）：

```yaml
source_files: ["thoughts/030_✅…md", "thoughts/032_✅…md", …]
raw_digest: "n/a"                      # 簇页不算哈希
```

lint 对两者都接受，二选一。

正文四节，顺序固定：

```markdown
## 这一篇覆盖什么        ← 3~5 条，只写边界不写内容
## 可抽出的原子          ← 表格：主题 / 去向。本页主要交付物
## 与其他笔记的重叠点     ← 同一主题哪篇也讲过，指向 synthesis 候选
## 本篇独有、别处没有的   ← 真正不可替代的部分
```

`status` 语义：`verified` 有代码/日志/数字支撑 · `unverified` 断言未证 · `superseded` 被更新材料取代（顶部加 `> ⚠️ 已被 [[…]] 取代`）· `partial` 原文残缺 · `stale` digest 已漂待重过。

---

## entity

具体的东西：框架、工具、服务、协议、机构。

命名用小写 ASCII kebab（`agentscope.md`），中文名进 `title` 与 `aliases`。

```yaml
---
type: entity
title: "AgentScope"
entity_kind: framework    # project | library | service | tool | framework | language | infra | model | org | protocol
domain: ai
aliases: [agentscope, agentscope-java]
version_of_interest: "1.x / 2.0"
tags: [agent-framework]
sources: ["wiki/sources/harness学习笔记"]
concepts: ["wiki/concepts/上下文压缩"]
---
```

正文五节：

```markdown
## 是什么 / 在我的体系里的位置
## 已知问题与判断          ← 每条必须链证据页
## 关键配置与用法
## 相关实体 / 相关概念
## 时间线                 ← 1.x → 2.0 这类改变结论的事件，带日期
```

「已知问题与判断」写成索引而非流水账：

```markdown
- **1.x 六层压缩已被 2.0 四正交策略取代** → 见 [[wiki/concepts/上下文压缩]]
  · 前提：1.x `agentscope-extensions-autocontext-memory` · 2.0 已重构 · 状态：结论已更新
```

---

## concept

抽象的机制、方法、判断。**模板为知识沉淀设计，不是为排障设计。**

```yaml
---
type: concept
title: "工具熔断"
domain: ai
aliases: [tool-circuit-breaker]
tags: [agent, reliability]
sources: ["wiki/sources/agent-开发学习笔记"]
entities: ["wiki/entities/agentscope"]
related: ["wiki/concepts/工具缓存"]
confidence: high          # high | medium | low
as_of: 2026-10-19         # 判断成立的时间点
---
```

正文六节：

```markdown
## 一句话定义
## 我目前的判断          ← 结论，含成立条件
## 关键机制              ← 拆到能复述
## 我的实例              ← 引用本仓真实代码/配置/数字
## 取舍与边界            ← 为什么不用另一种做法；什么时候失效
## 待澄清                ← 已知没吃透的点
## 证据                  ← 每条落到 raw 具体标题
```

**「取舍与边界」是本类页面最有价值的一节**。写什么：

- 为什么不用另一种做法
- 什么时候会失效
- 隐藏代价（如「熔断无法区分工具坏了和参数传错了」）
- 已知留白（配置里有字段但没接线）

「待澄清」不许留空但也不许硬编。本库 14 个 concept 页**全都有待澄清段**，每段都写了真实的未知。

---

## synthesis

跨来源分析、决策档案、事故复盘。

命名：综述用描述性 kebab；带具体事件的加日期前缀。

```yaml
---
type: synthesis
kind: comparison         # comparison | overview | decision | incident
title: "四套上下文压缩方案对比"
date: 2026-10-19
status: settled          # investigating | settled | superseded
domain: ai
tags: [context-compression]
sources: ["wiki/sources/harness学习笔记"]
concepts: ["wiki/concepts/上下文压缩"]
---
```

正文五节：

```markdown
## 问题                  ← 为什么需要这份对比
## 对比                  ← 表格或分节，每格可追证据
## 我的结论
## 适用范围              ← 什么场景用哪套
## 未定论的分歧          ← 有分歧就写，不覆盖
```

`status: investigating` 超过 30 天无更新会被 lint 报「待复核」。

---

## output

成品索引页。`output/*.html` 是冻结的图解，本类页是它们的索引。

```yaml
---
type: output
title: "output/ 图解索引"
date: 2026-10-19
output_form: html        # html | pdf | deck | doc
frozen: false            # 冻结产物为 true
domain: ai
tags: [output, visualization]
---
```

`frozen: true` 的页不因新材料而修改；若结论被推翻，在索引页加 `> ⚠️ 本页结论已被 [[…]] 修订`，**不改旧 HTML**。

---

## 结构文件

`wiki/index.md` 与 `wiki/log.md` **不带 frontmatter**，由 `AGENTS.md` §7/§8 的格式约束。lint 排除它们。

`index.md` 有两种内容：`<!-- wiki-index:auto-end -->` 之前是自动段（`wiki-index.mjs --write` 重建），之后是手写段「待建页面」「raw 摄取状态」。**重建只动自动段，手写段必须保留。**

`log.md` 条目格式硬性要求：

```markdown
## [YYYY-MM-DD] <op> | <标题>
```

- 方括号内**只允许日期**，不允许时刻或空格。需要时刻写进标题末尾：`… | 核对索引（18:11）`
- `op` 只允许 6 个值：`compile` / `ingest` / `query` / `lint` / `save` / `schema`
- 正文必须含 `新增` / `touched:` / `冲突:` 之一
- 只追加，不回改历史条目。写错了追加一条修正条目

可 grep：

```bash
grep "^## \[" $W/wiki/log.md | tail -5
grep "^## \[" $W/wiki/log.md | sed 's/^## \[[0-9-]*\] \([a-z]*\).*/\1/' | sort | uniq -c
```
