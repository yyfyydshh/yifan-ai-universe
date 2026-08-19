# v5 复刻执行 brief｜第一批项目证据档案

状态：参考图和素材边界已接受；允许进入第五步高保真复刻与 QA。

## 构建基线

- Build owner：Identity Skill + 内置 `frontend-app-builder` fallback；Hallmark 负责交互和 anti-slop 审查。
- References：`references/locked/v5/01-sales-decision-routing.png`、`02-docs-three-route-console.png`、`03-regulatory-applicability-desk.png`。
- 页面顺序：Project mast → DemoSlot → 项目专属证据工作台 → Project actions。
- 现有全球舆情页面保持视觉与行为，只迁移到兼容的数据接口。
- 不新增依赖，不调用 API，不运行 Agent，不生成项目视频。

## 设计与交互锁定

- 复用 `tokens.css` 的 paper、ink、rule、accent、focus、字体和 4pt spacing。
- 每页只使用阶段聚焦、路径推进、状态切换；动画只改变 transform/opacity。
- 点击、触摸和键盘聚焦会更新当前阶段、路径、深度解释、产物与下一决策；hover 只提供预览层级，不成为唯一操作方式。
- `prefers-reduced-motion` 下立即呈现状态，取消路径位移。
- 左右区域使用同一 grid 自然等高；不通过固定高度制造空白。
- 移动端取消复杂横向路径，将当前深度解释置于所选节点之后。

## 内容与证据边界

- Sales：公开仓库只证明脱敏概要；MQL A—D、JSON 契约与子 Skill 编排显示为用户提供的项目陈述。外发仅为草稿。
- Docs：公开仓库证明通用 SOP；八爪鱼文档站经历来自简历。SOP 不得描述为生产站源码。
- Regulatory：只呈现机制字段和仓库产物，不呈现示例任务值。处罚记录不等于目标企业违法，报告不构成法律意见。
- 视频槽继续标记“共创中”，不使用工作流参考图充当视频或 poster。

## 目标写入范围

- 数据：扩展 `lib/site-data.ts` 的 case-study 判别联合与第一批项目事实。
- 组件：新增统一 case-study shell、共享阶段详情和三套专属交互组件；调整 `ProjectDetail` 的渲染路由。
- 样式：只向 `app/globals.css` 追加 v5 样式并复用现有 token；不覆盖既有全局规则。
- 证据：实现后更新 identity manifest、fidelity ledger、fresh review 和三视口截图。

## QA

- 第一批逐页实现：Sales → Docs → Regulatory；每页完成后截图并与对应 reference 对照，再进入下一页。
- 视口：1672×941、2200×1200、390×844；另检查 320、768、1280、1440、1920 无水平滚动。
- 验证鼠标、触摸、Tab/Enter/Space、ARIA 状态、reduced-motion、GitHub 动作词和视频占位。
- 运行 lint、生产构建、全路由浏览器检查和 Identity verifier。

## 允许偏差

- 参考图中文字生成瑕疵在实现中使用已核验文案修正。
- 现有项目 mast、全站导航与 DemoSlot 不在下文工作台内重复。
- 移动端允许将矩阵和轨道重排为纵向，但不得隐藏边界、产物或阻断原因。
