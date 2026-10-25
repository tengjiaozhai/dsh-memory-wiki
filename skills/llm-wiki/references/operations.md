# 五个操作

仓库根记作 `$W` = `/Volumes/PortableSSD/docs/tengjiaozhai.github.io`。

---

## query

回答问题。

### 步骤

1. 读 `$W/wiki/index.md`。42 个 source + 12 entity + 14 concept + 5 synthesis 全在里面，按类型分组。
2. 找不到就 `rg -l '<关键词>' $W/wiki/` 全库搜。
3. 读候选页全文。**不停在「一句话定义」**，至少读到「取舍与边界」。
4. 需要具体参数、代码、原始数字时，按页内证据节的指向回溯 raw。
5. 答：结论先行 → 依据（带 `[[wiki/...]]`）→ 边界。
6. 追加 log（可选，用户没要求时不必写）：

```markdown
## [YYYY-MM-DD] query | <问题>
答依据：[[wiki/concepts/…]]、[[wiki/synthesis/…]]
缺口: <wiki 没覆盖的部分>
```

### 判断依据是否存在

| 情况 | 处理 |
|---|---|
| concept 页有明确结论 | 直接答，带引用 |
| 只有 source 页有线索 | 答 + 说明「只在 source 层，未提炼成 concept」 |
| `confidence: medium` | 答但降级表述，说明为什么是 medium |
| 有 `## 冲突` | 两方都给出，说明分歧原因 |
| 完全没有 | 明说「wiki 未覆盖」，建议该找什么资料 |

### 常见误答

- 用通用知识补 wiki 的空白。**禁止**。用户建 wiki 就是为了让答案有出处。
- 停在 index 页的标题上就开始猜内容。
- 把 `thoughts/` 的草稿当结论。15 篇 C 层是空的。

---

## ingest

处理新笔记或改动的旧笔记。

**DSH 自动经验分支**：仅在用户主动启用 capture、Wiki schema 含 `dsh-memory-wiki:auto-capture=v1` 授权且任务明确提供原始证据时使用。高置信、无冲突并通过程序校验的改动直接发布，拟改清单保存在任务记录，不逐项询问。证据由独立采集器生成在 `experiences/<jobId>.md`，本 Skill 的 writer 只读证据；source 沿用 `note`，与 jobId 同名。复用既有判断时保留正文、追加实例并补双向链接。中低置信和冲突候选不发布。普通 ingest 沿用以下确认流程。

### A. 新笔记

1. **读全**。含图的文件先读文本再单独读图。
2. 判断归属：
   - 新事实 → 建新 source 页
   - 已有内容的重复 → 只更新已有 source 页，补链接
   - 与已有结论冲突 → 准备 `## 冲突` 段
3. **先汇报，后落笔**。列三件事等确认：
   - 能抽出哪些原子（对应哪些 concept）
   - 和哪篇已有笔记重叠
   - 发现什么冲突
4. 确认后建 source 页。命名与 raw 同名（纯中文允许，必须给 `aliases`）。
5. 算 digest：

```bash
node -e '
const fs=require("fs"),crypto=require("crypto");
const b=fs.readFileSync(process.argv[1]);
console.log(b.toString("utf8").split("\n").length+"-"+crypto.createHash("sha1").update(b).digest("hex").slice(0,8));
' "$W/新笔记.md"
```

6. 扇出：更新相关 concept 页的「我的实例」「取舍与边界」；entity 页的「已知问题与判断」。逐页检查双向链接。
7. `node $W/tools/wiki-index.mjs --write`
8. 追加 log：

```markdown
## [YYYY-MM-DD] ingest | <标题>
新增 <来源页>。抽出原子：<concept 列表>。
touched: <被改页面清单>
冲突: <有则写，无则写「无」>
```

### B. 旧笔记改了

用户改了已有 raw，步骤不同：

1. **让漂移暴露**：

```bash
node $W/tools/wiki-lint.mjs --only digest
```

输出形如：

```
## raw_digest 漂移（1）
  - wiki/sources/agent-开发学习笔记.md  digest 漂移: 记 2350-9ec11c69(2350 行) / 实 2354-9a839ea4
```

2. **看改了什么**：`git -C "$W" diff <文件>`，或与备份对比。重点看**新增/修改的 `##` 标题**，那是 wiki 的锚点。
3. **判断四种情况**：

| 情况 | 判据 | 处理 |
|---|---|---|
| 新主题 | 新 h2 在 wiki 找不到对应 concept | source 页「可抽出的原子」加一行；够格就建 concept |
| 补充已有主题 | 与现有 concept 同题 | 更新那页的「我的实例」或「关键机制」 |
| 推翻旧结论 | 与现有页「我目前的判断」冲突 | 加 `## 冲突`，不覆盖 |
| 纯润色 | 无新信息 | 只重算 digest，wiki 不动 |

4. 改完重算 digest，写进 `raw_digest` 与 `lines`。
5. `node $W/tools/wiki-index.mjs --write`（若增删页面）
6. `node $W/tools/wiki-lint.mjs` 应回到 0 项。
7. 追加 log。

**关键禁令**：不许只把 digest 数字改成新值来消掉告警。那会把「待重过」变成「假装已重过」，检查就废了。

### C. 已知盲区

- **簇页用 `source_files` 数组，不算哈希**，只检查文件存在性。所以 `thoughts/` 单篇被改不会报 drift。要查得自己算：

```bash
node -e '
const fs=require("fs"),crypto=require("crypto");
for (const f of fs.readdirSync(process.argv[1]+"/thoughts").filter(x=>x.endsWith(".md"))) {
  const b=fs.readFileSync(process.argv[1]+"/thoughts/"+f);
  console.log(f.slice(0,3), b.toString("utf8").split("\n").length, crypto.createHash("sha1").update(b).digest("hex").slice(0,8));
}' "$W" | head -20
```

- **`output/` 的 16 个 HTML 图解完全不检查**。源笔记更新后图解可能过时，lint 不报，需要人记。

---

## lint

健康检查。**只读，不改任何文件**。

```bash
node $W/tools/wiki-lint.mjs                 # 全量
node $W/tools/wiki-lint.mjs --only digest   # 只看一类
```

六个维度：断链 / 孤儿页 / frontmatter / raw_digest 漂移 / 重复概念 / 过期。

### 已知假阳性

- 不区分正文与代码块，模板里的占位 `[[wiki/…]]` 会被当断链。
- 表格内的 `\|` 转义：已在 `linksOf()` 里先还原成 `|` 再匹配。若不还原，`thoughts-toc.md` 会误报 87 处断链。
- grep 类检查不带 `-w` 会被子串命中（`auth` ⊂ `OAuth`）。

命中必须人工复核才能写进报告。**不要为了「检查通过」给 `index.md`/`log.md` 加 frontmatter**，那是结构文件。

### 输出后

按影响排序报告，人类选定后逐项修。一次 lint 记一条 log。

---

## save

把对话产出沉淀成 wiki 页。

### 判定类型

| 内容性质 | 去处 | 命名 |
|---|---|---|
| 跨来源对比、决策判据、持续演进的分析 | `wiki/synthesis/` | 描述性 kebab；事故类加日期前缀 |
| 某一刻的方案快照、交付草案 | `wiki/outputs/` | `YYYY-MM-DD-<slug>.md`，`frozen: true` |
| 单一机制的新认识 | `wiki/concepts/`（优先更新既有页） | 概念名 |

**不要过早冻结活知识**。还有争议、还会变的进 synthesis，不进 outputs。

### 步骤

1. 判定类型与命名。
2. 写页。正文只放成品与依据，**不复述整段对话**。
3. 建链接：成品引用的每页都要在正文或 frontmatter 出现；回头给被引用的页加一条指回本页的链接 —— 单向引用是孤儿来源。
4. `node $W/tools/wiki-index.mjs --write`
5. 追加 log `## [YYYY-MM-DD] save | <标题>`。

---

## compile

**已退役**。首批建库用过一次（2026-10-19，产出 74 页）。只在用户要求批量补某个域时重启用。

流程（`AGENTS.md` §6.1）：

1. 扫 raw 的 h2 清单，用 `rg '^## '` 而不是猜，产出「主题 → 出现篇章」矩阵
2. 按出现次数 ≥2 裁 concept 名单
3. 写 concept：验收标准是**至少 3 个断言能落到 ≥2 篇 raw 的具体标题**
4. 反向补 sources
5. 写 synthesis
6. 生成 index
7. 追加 log `## [YYYY-MM-DD] compile | <批次名>`

下一个候选批次是 `eda` 域：`原理图与 EDIF 工作流.md`（2478 行 / 290 个 h2）目前只有 source 页骨架，一条内容原子都没抽。
