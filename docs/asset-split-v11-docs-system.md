# 第一阶段 / 素材拆分清单：文档站工程总览

Reference: `references/locked/v11/01-docs-system-blueprint.png`

交互假设：`完整搭建` 与 `便捷维护` 切换解释和当前路径；所有节点、技术栈、维护带和公共链接需要独立响应式重排；移动端为单列阅读顺序。

总判断：需要 **0 个** 图片素材。背景 / 融合场景 0 个，独立媒体 0 个。该 section 的图形、文字与动效全部在 code whitelist 内，可由 React、CSS 与简单 SVG 高保真实现。

| ID | 图片层级 | 复用范围 | 状态 | 内容与边界 | 代码覆盖 | 裁决理由 |
| --- | --- | --- | --- | --- | --- |
| none | none | none | code-native | 不使用 raster 图像、截图、logo 或生成场景 | 全部可见区域 | A：所有区域都需要实时文案、交互或响应式移动；B：线、点、网格、图标、层级与规则线都在 code whitelist；C：无图片层级 |

Code-native：

- 页面标题、owner role、说明文字、技术名、真实 URL 与公开 SOP 链接。
- 模式切换、ARIA 状态、键盘焦点、路径高亮和 reduced-motion 行为。
- 输入层、技术底座、站点系统、维护带、质量门、细线图标、连线和低对比点阵背景。
- OpenAPI、CLI、MCP 与信息架构 / 导航搜索 / 媒体响应式节点。

真实来源 / Replace-later / 风险：

- 真实生产站不使用截图；通过 `https://www.bazhuayu.com/docs/zh/overview` 直接打开，避免生成或伪造产品视觉。
- 公开 SOP 以外链形式提供，清楚标记为方法证据。
- 参考图仅是 QA 基线，不作为运行时素材。

结论：无需生成、复制或整理新的图像资产。确认后，我会进入素材审核与复刻执行 brief，仍不会在该确认之前修改页面代码。
