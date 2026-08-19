# 销售专业助手 v7 复刻执行 brief

## Build owner

- `identity-skill/references/frontend-app-builder.md` fallback。
- Identity Skill 负责参考锁、素材边界、证据与最终 fidelity ledger。
- Hallmark 负责避免仪表盘堆叠、重复解释和无语义动效。

## 视觉基线

- 锁定参考：`references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`。
- 内容 brief：`docs/sales-case-study-v7-brief.md`。
- Render contract：`docs/reference-production-plan-v7-sales.md`。
- 素材 manifest：`docs/asset-split-v7-sales.md`；审核：`docs/asset-review-v7-sales.md`。

## 页面结构

1. 紧凑项目定义：销售专业助手是什么、输入什么、输出什么、不会替销售做什么。
2. 主体 42% / 58% 前后对照：客户原话与信息缺口 → 助手的四项普通语言答案。
3. 当前答案证据回指：只高亮支持它的原话或信息缺口。
4. 信息充分性情境：足够时展示完整答案；不足时只保留待确认信息和建议追问。
5. 下方第二层“它为什么可靠”：内部能力与技术机制在这里解释，不进入首屏主交互。

## 修改范围

- `components/sales-decision-case-study.tsx`：替换 Sales 专属三栏工作台组件结构与状态逻辑。
- `lib/site-data.ts`：把 Sales 数据调整为客户原话、信息缺口、四项普通语言答案、证据引用和第二层能力说明。
- `app/globals.css`：只重写/追加 Sales 专属选择器，保持全站样式和其他项目详情不变。
- `docs/*`、`qa/*`、`.hallmark/log.json`：完成后更新证据、截图和执行记录。
- 删除：none。只有在新结构不再使用时，移除上述 Sales 组件内部的无用 import、局部数据字段和对应 Sales 专属 CSS；不删除共享组件或其他页面代码。

## 设计系统锁定

- 根目录 `design.md` 与 `tokens.css` 是唯一视觉系统来源。
- 保留深石墨背景、暖色 serif、neutral sans、mono 证据标签和低饱和紫色焦点。
- 不增加主题、字体、依赖、重型动画或 raster 素材。
- 紫色只表示当前答案、可操作状态和证据关系；不表示成功。

## 交互

- 结果选择：鼠标、触摸、Tab、方向键均可切换四项答案。
- 证据回指：选择答案时同步更新左侧高亮和一句普通语言依据。
- 情境切换：`已有足够信息 / 还缺关键信息` 使用 `aria-pressed`；不足时不生成画像、优先级或方案方向。
- 动画原语：答案聚焦、证据路径、状态交叉淡入；只使用 `transform` 与 `opacity`。
- reduced-motion：取消空间位移，内容和状态完整保留。

## 响应式

- 1280px 及以上：42% / 58% 双栏与窄证据通道。
- 768–1279px：两栏收紧；证据说明靠近当前答案，不让文本被路径挤压。
- 48rem 以下：单列，取消跨栏 SVG；每项答案用“依据：……”文本回指来源。
- 320、375、414、768、960、1280、1440、1920px 不得水平滚动。

## 允许偏差

- 参考图里的图标替换为 `lucide-react` 对应语义图标。
- 参考图中的细线位置可根据真实 DOM 测量调整，但只能表达当前答案的来源引用。
- 中文文案以 v7 brief 为准；参考图生成时的微小字形误差不进入生产代码。
- 移动端不复刻跨栏连线，改用显式来源标签。

## 风险触发

- 首屏重新出现 MQL、JSON、白名单或子 Skill 术语。
- 情境开关看起来像真实 Agent 正在运行。
- 客户机制示例没有明确声明或被写成真实案例。
- 右侧答案必须点击后才出现，导致三秒信息再次失败。
- 为了等高制造大块空白，或让连线穿过正文。

## QA 目标

- 参考尺寸：1672×941；对照 `references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`。
- 超宽：2200×1200；移动：390×844。
- 功能：鼠标、触摸、键盘、focus-visible、reduced-motion、信息不足情境。
- 技术：lint、production build、浏览器 console、全路由回归。
- 证据：三视口 PNG、`docs/fidelity-ledger.md`、`docs/fresh-review.md`、Identity validator。
