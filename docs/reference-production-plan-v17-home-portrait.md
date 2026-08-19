# v17 首页真人身份窗口参考计划

## 当前状态

- Section：`home-hero`
- 状态：`superseded / reference-invalidated by v19 direction`
- 候选图：`references/candidates/v17/home-portrait-aperture.png`
- 候选图 SHA-256：`43935B93D9119667351A1B2605634A9E989F74B88AF92CD1FC205253BAC69806`
- 锁定图：`references/locked/v17/01-home-portrait-aperture.png`
- 锁定图 SHA-256：`43935B93D9119667351A1B2605634A9E989F74B88AF92CD1FC205253BAC69806`
- 真人来源：用户提供 `f5f9fb41a684d41929857ccd848012fd.jpg`；只允许保持真实来源使用，不生成或替换人物身份。

> 2026-08-18：用户确认改用“人物作为项目宇宙中景实体”的 v19 方向。v17 保留为历史基线，不再作为首页实现目标。

## 设计判断

- 照片不做全屏背景，也不覆盖姓名、主张、CTA 或项目轨道；它是左栏下半部的窄幅独立身份窗口。
- 竖向裁切保留人物头肩和白色建筑曲线，建筑弧线与右侧三轴轨道形成跨栏呼应。
- 照片使用深石墨 / 克制紫色调色、细边框和边缘渐隐，以适配现有深空档案主题；人物脸部保持清晰、不叠字。
- 生产默认态不照搬参考图的高亮照片：照片以约 35% 透明度、低饱和深色调作为“身份投影”；悬停或聚焦提升到约 60%；点击后在原位置完整显影，再次点击收回。该状态变化只使用 opacity、filter 与 transform，不改变布局。
- 价值主张与三段能力 rail 位于照片右侧；按钮在其下方。右侧四星三轴体继续使用 v16 的右移坐标。

## Render contract

- `THREE_SECOND_MESSAGE`：这是一个有真实人物、有方法、有项目证据的 AI 能力作品集。
- `PERSONAL_EVIDENCE`：用户本人照片 + 需求拆解 / Agent 与 Skill 编排 / 验证与复用 + 四个真实项目。
- `AUTHORED_MOVE`：白色建筑曲线与三轴轨道建立视觉连续性，真人素材作为独立媒体而不是装饰背景。
- `PRIMARY_FOCAL_POINT`：姓名；`SECONDARY_ANCHORS`：真人窗口与四星项目系统。
- `READING_PATH`：姓名 / 角色 → 真人与价值主张 → 能力 rail → CTA → 四星项目证据。
- `WHITESPACE_MAP`：照片只占左栏下半部一条窄幅；右侧仍保留公转跑道；不以填满所有空白为目标。
- `OVERLAP_LEDGER`：照片不得覆盖文字或按钮；轨道不得进入左栏人物与文字安全区；人物脸部不叠任何 UI。
- `VIEWPORT_PAYLOAD`：桌面使用竖向独立媒体；移动端改为宽幅浅景裁切，位于角色信息之后，不与四个静态项目混排。

## 素材拓扑预判

- Hero：`C2 independent-media`。
- Code layer：导航、姓名、角色、价值主张、能力 rail、CTA、四星系统、轨道和交互。
- 独立媒体：1 张用户提供真人照片。
- 运行时生成素材：0。
- 参考图只用于构图 QA，不进入生产页面。
- Topology：`home-hero` section-specific；不改变 `/work` 与其他页面。
