# DSH Memory Wiki

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

在 DeepSeek Harness 中工作、需要浏览和查找本地 Wiki 知识的用户。

## Product Purpose

通过 Wiki 页面及其链接理解知识关系、搜索知识并查看原文；为 DSH 会话提供可追溯的知识依据。

## Operating Context

插件在 DSH 的主面板中运行，沿用宿主的导航。独立 `prototype/` 是模拟原型，不是实际插件入口。

## Capabilities and Constraints

- 当前数据模型是一份 Wiki 的页面与链接，不是多个独立图谱。
- 2026-10-24 用户确认的浏览目标：首次打开即展示整个 Wiki 的关系图，点击节点查看知识详情；搜索用于查找和定位。
- 完整图谱通过库级只读接口读取；页面正文按内容版本读取。首页与阅读不依赖会话，证据检索与手选仍属于会话。
- 自动检索按会话轮次执行；手动改选与准备覆盖只影响下一轮。浏览节点、选择依据、准备覆盖和实际带入是不同状态。
- Wiki 内容由服务端读取；客户端不自行打分或拼接作为实际带入依据的文本。
- 2026-10-24 用户选择“全景画布＋侧边浮层”，并单独授权重载记忆 Wiki 插件。界面与 Remote 合约同步实现，未以模型调用验证效果。

## Evidence on Hand

- `src/client/MemoryPanel.tsx`、`RemotePanel.tsx`：当前插件面板与会话状态。
- `src/client/memory-panel.css`：当前界面的视觉实现。
- `src/core/types.ts`、`wiki-corpus.ts`：Wiki 页面及链接数据结构。
- `src/shared/contracts.ts`：远程读取和搜索合约。
- 2026-10-24 已在 DSH 中直接查看当前面板，观察到固定三列布局与先搜索后展示的初始状态。

## Product Principles

- 先让用户看到已有知识和关系，再按需展示操作。
- 点击节点意味着阅读与探索；手动带入必须有明确动作。
- 使用渐进展开控制密度，保留搜索、阅读与上下文带入能力。
- 设计预览、代码行为和宿主实际生效分别陈述。
