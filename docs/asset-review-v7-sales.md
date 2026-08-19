# 销售专业助手 v7 素材审核

## 审核结论

状态：`accepted / code-native`。

本 section 需要的 production raster 素材数量为 `0`。锁定参考图只作为构建目标与 QA 基线，不会被裁切、切片、截图或复制到页面中。

## 可见元素与来源

| 可见元素 | 来源 | 最终状态 | 检查结果 |
| --- | --- | --- | --- |
| 标题、说明、角色边界 | 用户确认 brief + 公开仓库事实 | `code-native` | 可编辑、可访问、可响应式换行 |
| 客户原话与信息缺口 | 明确标注的脱敏机制示例 | `code-native` | 不冒充真实客户记录 |
| 四项助手答案 | 公开仓库支持的能力边界 | `code-native` | 使用普通语言，不在首屏暴露内部术语 |
| 情境开关 | 机制演示 | `code-native` | 不表示真实运行状态 |
| 证据回指线 | 当前答案与来源的真实引用关系 | `code-native` SVG/CSS | 单一语义；不穿过文字 |
| 可靠性边界带 | 公开仓库的输出特点和使用边界 | `code-native` | 不使用假成功状态或 KPI |
| 语义图标 | 现有 `lucide-react` | `code-native` | 与项目既有图标系统一致 |

## 图片与媒体状态

- v7 参考图：`references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`，状态 `accepted as reference only`。
- Sales Copilot 项目视频：继续 `replace-later / 共创中`；不属于本次 section 复刻输入。
- 新生成 production 素材：none。
- 真实头像、logo、客户截图、产品截图：none；本 section 不需要，也不生成替身。

## 审核风险

- 若未来加入真实客户对话或视频，必须作为独立来源素材重新审查真实性与公开边界。
- 若实现把参考图文字烘成图片、把机制切换写成假运行状态，审核立即失效。
- 当前不存在 `blocked`、`replace-later`（section 内）或 `redesign-required` 项。
