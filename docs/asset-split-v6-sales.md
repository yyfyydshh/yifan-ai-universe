# Sales Copilot v6 素材拆分

状态：用户已确认 `references/locked/v6/01-sales-professional-assistant-workbench.png` 并要求开发。

- Archetype：`C0 code-only`。
- Code-native：销售专业助手定义、输入 / 能力 / 边界摘要、脱敏对话、事实与未知标记、可靠性检查、七项判断与行动建议、依据路径、信息充分性切换、深度说明、来源与人工确认边界。
- Shared material：Lucide 线性图标与现有全站 tokens。
- Integrated scene：none。
- Independent media：none。
- Production raster：0。锁定参考图只用于视觉和信息合同，不进入运行时。
- Replace-later：现有 `DemoSlot` 视频接口保持“共创中”，等待真实或明确脱敏案例确认。
- Topology：`section-specific`。原始沟通 → 可靠性检查 → 客户判断与行动建议的证据回溯关系不与其他项目共享。

## 交互拆分

- 点击右侧能力项：更新当前能力、点亮对应原始沟通、点亮所需可靠性检查、更新依据路径与下方深度说明。
- 键盘方向键：在七项能力间循环移动焦点并同步内容。
- 信息不足：只保留一条最高优先级追问；画像、评分、方案、材料与行动保持“未生成”。
- 移动端：按原始沟通 → 可靠性检查 → 判断与行动建议 → 深度说明自然堆叠，不复制第二套流程。

