# 编码经验自动摄入：实现与验证

2026-10-24。**实现已完成；Jev 已替换为 CommandCode，真实判定调用通过，生产场景验收待完成。** 配置方式见插件 README 的“自动沉淀编码经验”。功能默认关闭，本次没有改当前 Desktop profile 或重启应用。

## 实现取舍

- 使用 rc.3 的 `sessionQuery.readSession()` 读取原始日志，按真人 `turn/end` 登记任务；不新增对已弃用 `snapshotEvents()` 的调用。
- 独立 writer 使用宿主 `llm.stream()`，冻结原轮次路由、显式 `tools: []`，只返回受约束 JSON。程序负责暂存文件、既有 index/lint 脚本及发布。比维护子会话少一套生命周期和递归来源。
- 读取真实 Skill、operations、模板、Wiki schema 并固定哈希；source 沿用 `note`。断言保留事件 seq、原文摘录和内容哈希；修改及检查记录只从可关联的原始工具调用/返回中提取，不使用整个脏工作区的 diff 冒充本轮改动。
- Jev 首次判价值，第二次检查最终断言、出处、与旧知识关系和原始 outcome。高置信且校验通过才发布；失败终态不接受 `verified_fix`。阈值是尚未以真实中文样本校准的起点。
- Jev 通过 CommandCode `https://api.commandcode.ai/provider/v1/systemone` 调用，严格固定 `typesafe/jev-1.14.0`；SDK 的基础地址去掉末尾 `/v1` 后再拼 SDK 路径。凭据仅取 `CMD_API_KEY` 或 `memory-wiki-commandcode.key`；旧直连环境变量与 key 文件不再参与解析。远端地址只接受 HTTPS；已清理未被引用的旧直连构建文件。
- writer 看到现有内容页，最终判定包含全库标题/aliases，以及最多八个词面相关完整页和被修改页。未查看的索引项可能重复/冲突时应 defer；这不保证发现任意语义冲突。跨轮根因需证据实际进入本轮记录，缺少前轮材料时不能写成已证实修复。
- 同库发布和同任务 worker 用文件锁串行处理。发布保留被替换的 inode，再以排他创建方式安装新文件；并发外部保存导致停止并保留双方版本。期间可能短暂缺文件，本插件保持旧语料或暂停读取。成功后清理临时备份，冲突时保留；这不是跨文件原子事务。
- 发布清单先持久化；进程重启依据 before/after 内容继续，普通 I/O 错误可恢复，外部冲突进入 `needs_attention`。任务日志、证据和恢复清单均在本地数据目录，API key 单独存储。

## 验证边界

| 验证 | 结果 | 证明范围 |
|---|---|---|
| host/client TypeScript 与生产构建 | 通过 | 源码、生成 Remote 与依赖可编译 |
| 当前工作区全量测试 | 138/138 | 含现有并行界面工作的测试；不将那些改动纳入本次提交 |
| 本次提交独立树 | 构建、typecheck、138/138 测试通过 | 确保提交不依赖其他未提交界面改动 |
| Jev 受控 HTTP | 通过 | System One 请求、模型固定、类型校验 |
| 暂存/发布与恢复 | 通过 | 路径逃逸、伪造引用、证据漂移、旧判断保留、并发保存和恢复行为 |
| 真实 DSH rc.3 + 受控模型 | 通过 | 真人日志 → 两次 Jev 协议请求 → 独立无工具 writer → source/知识页/index/log → 语料刷新，任务为 ingested |
| 真实 Wiki | 84 页，lint 0 项 | 已限定更新 schema 与 Skill；没有将合成经验写入真实库 |
| 状态卡片渲染 | 通过 | Chromium 760px/390px；失败原因、展开证据、沉淀页按钮；无 page error、无横向溢出 |
| 官方 TypeSafe API | HTTP 451 | 合成输入返回“TypeSafe is not available in your region”；未验证真实 Jev 质量或可用配额 |
| 替换后的 CommandCode API | HTTP 200 | 固定 `typesafe/jev-1.14.0` 返回有效 Noul；真实 `JevJudge.assess/verify` 正常返回 deferred，未放宽阈值、未发布合成知识 |

Browser plugin 不可用，状态卡片使用已有 Playwright/Chrome 隔离验证。该检查不等同于当前 Desktop 内的完整面板验收。

## 双轴审查

### Standards

审查发现的 JSON 凭据过滤、无关工作区身份、发布检查竞态、临时读失败漏轮次、部分发布不能恢复均已修正并增加针对性检查。原文中的任意未知凭据无法仅靠格式匹配保证识别，结构化敏感字段及已知认证文件整项排除；证据不足保留候选。

### Spec

已补齐失败 outcome 限制、冻结引用原文/哈希、全库标题与 aliases 比较、轮次路由依据，以及面板证据/改动详情。writer 的无工具独立调用是对原维护 Agent 方案的具体收敛；没有引入第二条判定模型路径。

旧 TypeSafe 直连的 451 是迁移前记录，当前已由 CommandCode 替换。生产样本校准、线上 writer 效果与当前 Desktop 完整交互仍未验证，不能把接口可用或受控响应通过表述为这些项目已经通过。接口契约依据：[CommandCode Provider API](https://commandcode.ai/docs/provider)。
