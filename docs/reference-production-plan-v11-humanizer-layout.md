# v11 Humanizer 语义布局修正契约

日期：2026-08-16

## 触发原因

用户在生产预览中指出：左侧保护流程与右侧阶段解释由同一个 `activeStageIndex` 驱动，语义上属于一个联动单元；原三栏把独立的编辑提案台插在两者之间，破坏了阅读因果。原 `references/locked/v10/02-humanizer-proposal-review.png` 因此只对 Humanizer 拓扑失效；交互事实、视觉语言与其他项目不受影响。

## 锁定参考

- `references/locked/v11/03-humanizer-process-pair.png`
- Showcase 参考源：`.showcase-runs/yifan-ai-universe/humanizer-literary/ui/reference/v11/humanizer-process-pair.png`
- Render mode：`C0 code-only`，不新增运行时图片或第三方依赖。

## Meaning contract

- THREE_SECOND_MESSAGE：先沿保护流程选择阶段，并在同一视觉单元内理解该阶段为什么存在、如何执行及何时停止；随后再进入独立的编辑保护机制演示。
- PERSONAL_EVIDENCE：八阶段 Humanizer 保护流程、内容锁、编辑提案、完整性审计与四角复核均来自已锁定项目事实。
- AUTHORED_MOVE：把“流程导航＋阶段深解”组合为上层 Process Pair；把“内容锁＋提案裁决＋复核交付”组合为下层 Editing Mechanism。
- PRIMARY_FOCAL_POINT：上层当前阶段标题与对应深度说明。
- SECONDARY_ANCHORS：左侧当前阶段；下层当前编辑裁决。
- READING_PATH：阶段导航 → 阶段深解 → 独立机制演示 → 边界说明。
- WHITESPACE_MAP：上层两列自然等高；下层随真实内容增长，不使用固定高度或装饰填充。
- SEMANTIC_GRAPHIC：左侧阶段选择只更新右侧 `StageDepthPanel`；下层锁与提案选择只更新编辑对照、裁决与保护项。
- OVERLAP_LEDGER：none。
- EXCLUSION_ZONES：阶段联动区不得显示下层提案状态；编辑演示区不得伪装成当前流程运行状态。
- VIEWPORT_PAYLOAD：desktop/ultrawide 上层双列、下层满宽；68rem 以下阶段导航与深解顺序堆叠；48rem 以下所有控制单列且内容完整。

## Reference-to-build map

- Code layer：`HumanizerVoiceChamber` 的阶段状态、内容锁、提案裁决、复核和交付；`StageDepthPanel` 继续复用共享内容组件。
- Shared material：none。
- Integrated scene：none。
- Independent media：none。
- Topology：`section-specific`；Humanizer 的流程联动与编辑保护台不能复用其他项目详情页的两栏工作台定位。
- Allowed deviation：移动端将联动双列改为阶段列表后接阶段解释；不改变文案、状态逻辑、色彩和组件家族。
- Risk trigger：若右侧再次消费 `activeProposal` / `activeLock`，或下层编辑台被插回阶段导航与阶段深解之间，则判为语义回归。

## 实现范围

- `components/humanizer-case-study.tsx`：重组 DOM 拓扑，移除跨区 `case-live-state`。
- `app/globals.css`：新增 Process Pair、Editing Mechanism 分区及响应式规则；沿用 `tokens.css`。
- 不修改 `lib/site-data.ts`，不修改项目事实，不影响其他六个项目。

## 验收

- 点击/聚焦左侧任一阶段，右侧标题、目的、机制、证据与决策同步更新。
- 切换下层提案时，只更新内容锁、原稿/拟稿与机制裁决，不改变上层阶段。
- 320、390、768、1280、1440、1920px 无水平溢出；触摸、键盘和 reduced-motion 内容完整。
