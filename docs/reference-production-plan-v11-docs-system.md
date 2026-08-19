# v11 文档站工程总览：参考图与实现契约

## 事实边界

- 个人贡献：杨逸凡独立完成八爪鱼产品文档站整站从 0→1 建设并持续维护。
- 技术与方法证据：Mintlify、`docs.json`、MDX、本地资源、`mint` CLI、本地预览、Git / 托管验收与受控发布来自公开 SOP。
- 真实站点：`https://www.bazhuayu.com/docs/zh/overview` 作为可点击公开核验入口。
- 公开 SOP 是可复用方法证据，不是生产站源码。
- 不展示页面数量、访问数据、内部仓库、生产凭据、实时状态或未公开资料。

## 参考图

- 锁定图：`references/locked/v11/01-docs-system-blueprint.png`
- SHA-256：`3AD52B7F0199E217B4C3BD87C4E02772994E8DDE18133B6A4536F73E6926C99F`
- 参考 viewport：`1672 × 941`

## 三秒信息与阅读路径

1. 杨逸凡独立搭建了一个完整的真实产品文档站。
2. 站点由 Mintlify、`docs.json`、MDX、资源、预览与托管流程组成。
3. OpenAPI、CLI、MCP 是首版核心内容域。
4. 更新进入后，沿影响范围、增量修改和回归检查重新进入质量门。
5. 访客可直接访问真实文档站或公开 SOP 核验。

## 结构与拓扑

- Section ID：`docs-system-blueprint`
- Topology：`section-specific`
- 原因：输入层、技术底座、站点系统、维护带、质量门和真实 URL 形成一个专属工程坐标系；不得复用旧 `docs-routes` 的三路径布局。
- Shared：只共享 `tokens.css`、全局导航、Lucide 线性图标、小型 focus / reduced-motion primitive 与深空背景 token。

## 代码层

- 项目所有权行、标题、模式切换、技术名、节点、连线、维护带、质量门、真实 URL、公开 SOP 链接全部为 live DOM。
- `完整搭建` 与 `便捷维护` 是 button / tab 状态；点击或键盘聚焦必须同步右侧解释、当前路径与 `aria-selected`。
- 维护带不是运行进度：仅表达方法关系，不显示假百分比、假时间或运行中状态。
- 真实 URL 使用普通外链，清楚标注为公开核验入口。

## 响应式与动效

- Desktop：约 60 / 40 的连续工程蓝图与解释区。
- Mobile：按“技术栈 → 站点系统 → 维护带 → 质量门 → 真实 URL”单列重排；不缩小空间图，不绘制跨区连接线。
- 动效最多三类：模式状态淡化、当前路径推进、一次性进入揭示。
- `prefers-reduced-motion` 下没有路径位移；以静态 active line、颜色与文字状态传达关系。

## Exclusion zones

- 节点文本、技术栈标签、维护带文本、质量门、右侧说明和 URL 入口均是闭合安全区。
- 路径只能连接节点边缘，不得穿过文字、按钮或外链。

## Reference-to-build map

| 参考区域 | 语义 | 实现 owner | 媒介 / 状态 |
| --- | --- | --- | --- |
| 输入层 | 产品资料、迁移内容与动态能力事实 | `DocsSystemBlueprint` | code-native |
| 技术底座 | Mintlify、docs.json、MDX、Assets、mint CLI、Git / Hosting | `DocsSystemBlueprint` | code-native |
| 站点系统 | 产品文档站、OpenAPI、CLI、MCP、信息架构、导航搜索、媒体响应式 | `DocsSystemBlueprint` | code-native |
| 维护带 | 更新输入 → 影响范围 → 增量修改 → 回归检查 | `DocsSystemBlueprint` | code-native |
| 质量门 | 本地预览、链接检查、托管验收、受控发布 | `DocsSystemBlueprint` | code-native |
| 右侧解释 | 搭建与维护模式的深度说明 | `DocsSystemBlueprint` | code-native |
| 真实 URL / SOP | 公共核验入口 | `ProjectDetail` / `DocsSystemBlueprint` | code-native external links |

## 非允许偏差

- 不能把参考图作为背景或裁切素材。
- 不能恢复旧三路径卡片墙或具体 CLI 版本时间线。
- 不能用生成截图、公司 logo、假终端或假指标替代真实 URL 入口。
