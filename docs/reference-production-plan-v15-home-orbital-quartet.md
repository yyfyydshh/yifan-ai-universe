# v15 首页四星三轴公转体参考计划

## 当前状态

- Section：`home-hero`
- 状态：`reference-locked / implementation authorized`
- 候选图：`references/candidates/v15/home-four-project-three-axis.png`
- 候选图 SHA-256：`e714f311a907652152bd11c407140ab8b97167a1515bceee8935d4b1c6a585db`
- 锁定图：`references/locked/v15/01-home-four-project-three-axis.png`
- 锁定图 SHA-256：`E714F311A907652152BD11C407140AB8B97167A1515BCEEE8935D4B1C6A585DB`
- 用户确认：2026-08-18，回复“执行”。
- 旧 v14 参考状态：`reference-invalidated`，原因是独立项目主体由 3 个增加为 4 个。

## Style fingerprint

- 沿用 `design.md`：深石墨背景、暖白高对比标题、克制紫色强调、暖色中心星、细线空间轨道。
- 保留现有导航、左侧定位文案、CTA 家族、圆形项目星球、Lucide 语义图标与首屏左右结构。
- 禁止重新引入固定能力核心、横向项目信息板、卡片墙、渐变文字或重型 WebGL。

## Section render contract

- `THREE_SECOND_MESSAGE`：四个代表项目共同围绕一个能力中心运行，首页项目宇宙具有明确三维公转关系。
- `PERSONAL_EVIDENCE`：全球舆情分析、销售专业助手、产品文档站 0→1、金融监管风险监测，均来自已存在的项目数据和详情路由。
- `AUTHORED_MOVE`：四颗圆形项目星球分布在共享的三轴球面上；拖动改变整体空间旋转方向，松手后沿新方向继续巡航。
- `PRIMARY_FOCAL_POINT`：右侧四星三轴公转体。
- `SECONDARY_ANCHORS`：左侧姓名与定位；中心暖色星。
- `READING_PATH`：姓名与定位 → 四星三轴公转体 → 进入作品宇宙。
- `WHITESPACE_MAP`：左上留白承载姓名；四星之间的空间是轨道与深度运动跑道，不允许出现与主焦点同等大的无效空场。
- `SEMANTIC_GRAPHIC`：三条交叉轨道分别表达三个旋转轴；星球位置和缩放表达球面深度；所有星球共享同一旋转矩阵，不代表四条独立任务线。
- `OVERLAP_LEDGER`：轨道线可从星球背后通过，但不得进入文字与图标安全区；项目星球之间禁止遮挡。
- `EXCLUSION_ZONES`：左侧完整文案与 CTA；每颗星球的圆形边界；顶部导航；中心暖色星周围最小呼吸区。
- `VIEWPORT_PAYLOAD`：桌面与超宽首屏完整显示四颗星球和三条轴；48rem 以下取消轨道与巡航，四项目按静态纵向列表呈现。

## Render topology

- Archetype：`C0 code-only`
- Code layer：React 项目链接、Lucide 图标、项目文字、三维投影、轨道线、拖动、惯性、键盘与 reduced-motion。
- Shared material：现有星点背景与颜色 token。
- Integrated scene：none。
- Independent media：none。
- Asset budget：0 个运行时 raster；候选参考图只用于构图和 QA，不进入生产页面。
- Topology：`section-specific`；仅首页显示四个精选项目，`/work` 仍显示完整七项目宇宙。

## Implementation boundary

- 修改：`components/project-universe.tsx`、`app/globals.css`、`design.md`、`.hallmark/log.json` 与 v15 验收文档。
- 不修改：项目数据事实、项目详情路由、视频、文章、Career 与其他页面。
- 不删除任何生产文件。

## Visual review

- Meaning：四个真实项目和三条共同旋转轴可直接辨认，没有新指标或假状态。
- Hierarchy：姓名仍是第一焦点；四星公转体为第二焦点；中心星只负责组织空间。
- Composition：四颗星球围绕共同中心形成上下左右张力，减少 v14 三角结构的平面感。
- Rebuildability：全部可由现有 React/CSS/投影算法实现，不使用参考图切片。
- Risk：候选图中的文字仅是视觉占位；生产文字必须继续来自 `site-data.ts`。
