# v2 参考图审查｜项目详情能力观测台

参考草稿：`references/drafts/v2/01-project-observatory-sales-copilot.png`

- 尺寸：1586 × 992，横向 section 截图。
- SHA256：`CD1289BEA24245958AB643E5B232A0F969213DF7151DC7EF9B092B234E6AF636`
- 当前状态：`locked`，已由用户确认并写入 `references/locked/v2/05-project-observatory-sales-copilot.png`。

## 视觉意义审查

- 三秒信息：左侧六节点工作流与右侧“03 系统结构”共同说明这是一个可被观察的 Skill 处理流程。
- 主焦点：第三节点 `MQL A—D 评分`；右侧章节标题和远端索引为两个次要 anchor。
- 个人证据：节点名称全部来自 Sales Copilot 既有项目数据；可靠性提示使用既有“事实 / 假设 / 未知分层”。
- 图形语义：节点顺序是实际工作流顺序，路径表示信息传递，亮度只表示当前章节。
- 留白：顶部和节点间空域为动效与响应式裁切跑道；中缝分离观察与解释；底部承接下一章节。
- 结果：`pass`。

## 一致性审查

- 延续 v1 的深石墨、暖白、低饱和紫、中文宋体 display、等宽编号与细规则线。
- 去除旧版同尺寸卡片墙，未引入新色系、假 chrome、假 dashboard 或玻璃拟态。
- 结果：`pass`。

## 单调性审查

- 当前只生产一个 v2 anchor section，不构成跨 section 的骨架重复。
- 移除文字后，弯折工作流、激活节点、叙事列与章节索引仍能表达“滚动观察系统结构”，不依赖大标题独自撑场。
- 结果：`pass`。

## 可复刻性审查

- Archetype 为 `C0 code-only`；所有节点、线条、文字和状态可由 React、CSS、SVG / Lucide 重建。
- 参考图不会被裁切为页面背景，也不会成为生产素材。
- 左侧观测台、右侧叙事与章节索引可以独立 reflow；移动端可转为章节上方的小型静态图。
- 未烘焙实时数据、运行时间、完成率或不可复现 Agent 结果。
- 结果：`pass`。

## 低风险实现偏差

- 最终字体由项目既有字体回退链决定，字面宽度可与参考图略有差异。
- 最终连接线将使用 SVG path，曲率可以微调以保证 320—1920px 无碰撞。
- 右侧章节索引在窄桌面可收进叙事列，不改变阅读路径与含义。

## Hallmark pre-emit critique

- Philosophy 5 / Hierarchy 5 / Execution 4 / Specificity 5 / Restraint 5 / Variety 5。
