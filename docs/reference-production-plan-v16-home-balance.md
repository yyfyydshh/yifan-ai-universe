# v16 首页左右视觉平衡参考计划

## 来源锁定

- 用户指令截图：`references/locked/v16/01-home-user-direction.png`
- SHA-256：`AC678D72B6E70DAFF7CF5C531D55FE480B9B6C7C030FA750C8533E9195899758`
- 用户明确要求：整个三轴体向右移动；左侧补充真实信息，降低首页空旷感。
- v15 四星三轴结构继续有效；v16 只改变其页面中心位置和左栏信息密度。

## Render contract

- `THREE_SECOND_MESSAGE`：左侧说明杨逸凡怎样把问题变成可交付能力，右侧四个项目作为三轴证明系统。
- `PERSONAL_EVIDENCE`：需求拆解、Agent / Skill 编排、验证与复用，均来自既有简历与能力系统。
- `AUTHORED_MOVE`：用一条开放式三段能力 rail 补密度，不用三张卡片；四星坐标中心从右栏 50% 移至约 58%。
- `PRIMARY_FOCAL_POINT`：姓名与定位；`SECONDARY_ANCHORS`：能力 rail 与四星三轴体。
- `READING_PATH`：姓名 → 角色 → 价值主张 → 三段交付闭环 → CTA；右侧四星同步提供项目证据。
- `WHITESPACE_MAP`：左下仍保留操作呼吸区；右侧空白成为星球公转跑道，不在中央形成无效空洞。
- `OVERLAP_LEDGER`：rail 不与 CTA 重叠；三轴体不侵入左侧文字；短屏完整显示主 CTA 与四星焦点。
- `VIEWPORT_PAYLOAD`：桌面补充 rail；移动端 rail 保持三列紧凑呈现，项目仍按纵向静态列表。

## 素材与实现边界

- Archetype：`C0 code-only`；运行时 raster 预算为 0。
- 参考截图只用于记录用户指令，不进入生产页面。
- 修改：`app/page.tsx`、`components/project-universe.tsx`、`app/globals.css`、`design.md` 与 v16 QA 文档。
- 不修改项目事实、路由、详情页、视频、文章、Career 或 `/work` 七项目宇宙。
- Topology：`home-hero` section-specific。
