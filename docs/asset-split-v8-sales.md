# 第一步 / 素材拆分清单

## 【销售专业助手 · 多轮转化分析台】

交互假设：左侧三轮为可聚焦的真实控件；右侧五类输出会随轮次完整刷新并支持证据回链；移动端改为单列，所有状态和文案都需要实时更新。

总判断：需要 **0 个图片素材**；其中背景/融合场景 0 个，独立媒体 0 个。当前参考中的全部视觉都能由代码高保真实现。

| 区域 | A 轴边界 | B 轴媒介 | C 轴层级 | 状态 | 裁决理由 |
| --- | --- | --- | --- | --- | --- |
| 标题、说明与保密声明 | live-content | 标准网页排版 | 不适用 | code-native | 语义内容必须可编辑、可响应式换行 |
| 三轮需求时间线 | live-content / interactive | button、divider、dot、文字 | 不适用 | code-native | 每轮需要点击、触摸、键盘聚焦和状态切换 |
| 语义证据桥 | interactive diagram | 简单 line、icon、arrow、label | 不适用 | code-native | 需要随当前轮更新；可用 HTML / CSS / SVG 精确实现 |
| MQL D→C→B→A 轨迹 | live-data / interactive | ring、line、label | 不适用 | code-native | 等级、原因和可访问状态必须实时变化 |
| 五类输出 | live-content / interactive | row、icon、divider、button | 不适用 | code-native | 每项内容、可用状态和证据回链随轮次变化 |
| 新增事实 / 仍待确认 / 人工边界 | live-content | grid、divider、icon、文字 | 不适用 | code-native | 事实声明不能进入生成像素 |
| 背景和空间层次 | static-decor | 纯色、普通透明层、细网格 | 不适用 | code-native | 属于 code whitelist，无复杂材质或光影需求 |

## Code-native

- 全部中文文案、轮次、需求维度、MQL、状态原因与边界声明。
- 所有交互控件、焦点样式、键盘导航、ARIA 状态和 reduced-motion 处理。
- 低饱和紫色当前态、暖象牙标题、细规则线、简单背景网格。
- Lucide 标准语义图标或等价的简单 SVG 图标。
- 桌面双栏、超宽屏最大宽度和移动端单列 reflow。

## 真实来源 / Replace-later / 风险

- 本 section 不使用客户截图、客户 logo、真实对话截图或仓库 UI 截图，因此不存在伪造真实证据的风险。
- v8 参考图只作为 QA 目标，不能被裁切或直接嵌入生产页面。
- 项目上方既有视频槽继续保持 `replace-later / 案例共创中`，不属于本次交互 section 的素材预算。
- 商业机密继续通过抽象需求维度保护；具体行业、站点、字段、数据量和内部 Skill 规则不进入页面数据。

## 素材预算结论

0 个 production raster 素材。该结构与拆分模式中的“简单循环图 / 零素材页面”一致：视觉价值来自信息关系和交互状态，不需要为了显得丰富而发明装饰图片。

我会先停在这里。确认后进入素材审核；由于没有图片素材，审核将锁定“纯代码构建 + 视频槽后续替换”的执行边界，然后开始组件开发。

