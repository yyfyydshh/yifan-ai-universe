# 销售专业助手 v8 参考图生成计划

## 参考状态

- v7 参考：`references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`
- 状态：`reference-invalidated`，原因是单轮“客户原话 → 助手答案”不足以表达多轮累计刷新。
- v8 候选目标：`references/candidates/v8/01-sales-multi-turn-conversion-desk.png`
- 用户确认后锁定目标：`references/locked/v8/01-sales-multi-turn-conversion-desk.png`
- 参考图只用于构图与 QA，不进入 production 资产。

## Style fingerprint

- 深石墨近黑背景，沿用 AI Capability Universe 的证据档案世界。
- 暖象牙 serif 承担标题与关键判断；中性 sans 承担客户原话和解释；mono 仅用于轮次、MQL 与证据状态。
- 直角或极低圆角、1px 规则线、无玻璃拟态、无渐变光球、无假浏览器 chrome。
- 低饱和紫色只表示当前轮、当前结果与证据回链；绿色不表示演示通过。
- 一张主工作台，一个主要视觉焦点，不建立卡片墙。

## Render contract

- `THREE_SECOND_MESSAGE`：客户每补充一次回答，销售判断就基于累计上下文刷新一次。
- `PERSONAL_EVIDENCE`：行业与业务目的、目标数据、自动化程度、MQL、采集与自动化方案、授权资料、回复引导；MQL/JSON/子 Skill 明确为用户确认的内部项目事实。
- `AUTHORED_MOVE`：轮次时间线直接控制整套转化状态；选择任一结果，会回指支撑它的客户原话。
- `PRIMARY_FOCAL_POINT`：第三轮后的 MQL B 转化状态快照。
- `SECONDARY_ANCHORS`：三轮脱敏需求摘要；D→C→B→A 轨迹；行业、数据和自动化维度；新增事实与未知项。
- `READING_PATH`：标题 → 第三轮客户回答 → 当前 B 状态 → 五类输出 → 未知项和人工边界。
- `WHITESPACE_MAP`：轮次轨与结果快照之间只保留状态变化桥所需空间；没有用于撑高的空白。
- `SEMANTIC_GRAPHIC`：轮次进度和 MQL 状态线表示累计上下文与等级变化；所有连线都有信息关系。
- `OVERLAP_LEDGER`：none。
- `EXCLUSION_ZONES`：客户原话、五类输出、机制示例声明、A 未达到原因和人工外发边界必须完整可读。
- `VIEWPORT_PAYLOAD`：桌面看见标题、三轮轨、当前快照、MQL 与五类结果；移动端依次看见标题、轮次选择、当前回复、当前快照、证据与未知项。
- `Archetype`：`C0 code-only`。
- `Topology`：`section-specific`，只用于销售专业助手。

## 桌面构图

1. 顶部为紧凑标题与“脱敏机制示例｜固定三轮｜非实时 Agent”。
2. 主体为约 38% / 62% 的时间线与转化快照：
   - 左侧三轮纵向累计回答，第 3 轮激活；较早轮保持清晰但安静。
   - 中间窄桥显示累计上下文进入当前快照。
   - 右侧顶部显示 MQL `D → C → B → A`，B 激活、A 标记未达到原因。
   - 右侧主体完整显示需求画像、MQL、采集与自动化方案、适用能力/案例和回复引导，不要求点击后才知道项目价值。
3. 底部显示“本轮新增事实 / 仍待确认 / 人工边界”，不显示假 KPI 或成功动画。

## 移动重排

- 单列顺序：标题 → 轮次选择 → 当前客户回答 → MQL → 五类当前结果 → 新增事实 / 未知项 → 人工边界。
- 不绘制跨栏连线；每个结果用“依据：第 X 轮第 Y 句”回链。
- 不复制三套完整工作流，只渲染当前轮的完整快照。

## 生成与验收

- 只生成一张横向 section-level 参考图，不生成长页面、海报或多屏拼贴。
- 生成后进行视觉意义、一致性、单调性和可实施性四向审查。
- 参考图中的文案可作为构图占位，最终文字与状态全部由 React / CSS 渲染。
- 未经用户确认，不复制到 `references/locked/v8/`，不开始生产组件修改。
