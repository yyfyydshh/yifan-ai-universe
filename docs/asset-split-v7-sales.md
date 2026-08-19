# 销售专业助手 v7 素材拆分清单

## 交互假设

客户原话、信息缺口、四项答案、情境开关和证据回指都需要独立点击、键盘聚焦、状态更新和移动端重排，因此必须保持 live DOM。参考图中的全部视觉核心都在 code whitelist 内。

## 总判断

需要 `0` 个图片素材：背景/融合场景 `0` 个，独立媒体 `0` 个。参考图只作为复刻和 QA 基线，不会被裁切、截图或烘焙进生产页面。

## 三轴裁决

| 区域 | A 轴：边界 | B 轴：媒介 | C 轴：图片层级 | 状态 | 裁决理由 |
| --- | --- | --- | --- | --- | --- |
| 项目标题与定义 | live-content | 标准网页排版 | none | `code-native` | 语义内容必须可编辑、可访问并流体换行 |
| “已有足够信息 / 还缺关键信息” | live control | button、border、状态色 | none | `code-native` | 需要点击、键盘操作与 ARIA 状态 |
| 客户原话与信息缺口 | live-content | text、row、icon、underline | none | `code-native` | 当前答案需要独立回指不同来源片段 |
| 四项助手答案 | live-content + interactive result | list/button、divider、icon | none | `code-native` | 每项需要独立聚焦、更新解释并支持键盘导航 |
| 证据回指路径 | semantic graphic | 简单 SVG line/arrow | none | `code-native` | 唯一含义是当前答案引用的原话或信息缺口；移动端改为来源标签 |
| “为什么这样判断” | live-content | text、border、opacity state | none | `code-native` | 解释随当前答案变化，不能进入固定图片 |
| 可靠性边界带 | live-content | icon、label、rule | none | `code-native` | 四条边界均为可读事实说明，不是装饰图标墙 |
| 深色空间表面 | static-decor | 纯色、轻微透明层 | none | `code-native` | 无复杂纹理、摄影、3D 或不可规则复现材质 |

## Reference-to-build map

- Reference：`references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`
- Code layer：眉题、标题、定义、角色边界、情境开关、客户原话、信息缺口、四项答案、答案解释、证据线、可靠性带、全部焦点与 reduced-motion 状态。
- Shared material：none。
- Integrated scene：none。
- Independent media：none。
- Identity/source asset：公开仓库链接继续由项目页现有外部入口承载；本 section 不展示 logo、客户身份或事实截图。
- Must preserve：标题优先级；42/58 前后对照；完整四项答案；单一证据回指；底部四条人工可控边界。
- Allowed deviation：参考图中的图标可替换为现有 `lucide-react` 语义图标；桌面证据线在窄屏改为答案下方的来源标签。
- Risk trigger：若新增真实客户截图、真实对话或产品视频，应作为独立来源素材重新审查，不得直接融入当前 code-only 参考。

## Asset manifest

当前 section 没有 raster asset 条目。项目页已有视频槽不属于本 section；它继续维持 `replace-later`，待用户与 Codex 确认可公开案例后单独共创。

## 复刻执行 brief 草案

- Build owner：Identity Skill 内置 `references/frontend-app-builder.md` fallback。
- 修改范围：`components/sales-decision-case-study.tsx`、`lib/site-data.ts` 中 Sales 数据、`app/globals.css` 中 Sales 专属样式；必要时只增加 Sales 专属小类型，不改其他项目详情组件。
- 视觉系统：完全服从根目录 `design.md` 与 `tokens.css`；不创建新主题或新字体。
- 动效：答案聚焦、证据回指、情境交叉淡入三类；只动画 `transform` / `opacity`。
- 响应式：桌面 42/58 双栏；48rem 以下单列，取消跨栏路径；320px 起无水平滚动。
- QA：1672×941 对照锁定参考；另检查 2200×1200 与 390×844；补充 320、375、414、768px 溢出与键盘测试。
- 禁止：假运行状态、MQL/JSON 首屏术语、可靠性中间栏、把示例冒充真实客户、自动发送暗示。
