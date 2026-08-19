# v4 复刻执行 brief — 全球舆情工作流讲解动效

状态：第四步素材审核完成，等待代码前确认。

## 1. 已接受的构建目标

- 锁定参考：`references/locked/v4/01-global-opinion-workflow-explainer.png`
- Render contract：`docs/reference-production-plan-v4.md`
- 参考审查：`docs/reference-review-v4.md`
- 素材清单：`docs/asset-split-v4.md`
- 参考哈希：`08C5801003749398647C1327FAED12E3ABA39D9722B498EADF42D87FA70E1CBD`

用户已重新定义该图的页面职责：它是项目详情下文的工作流讲解动效，不是视频演示。实现时不复制参考图顶部站点导航，也不重复一个新的页面 Hero；保留其证据链、质量门、交付物和视觉层级。这是用户确认后的必要上下文调整，不是视觉漂移。

## 2. 素材审核

| 素材 / 区域 | 来源 | 最终状态 | 检查结果 | 最终路径 |
| --- | --- | --- | --- | --- |
| 深空背景、规则线与纹理 | 现有 tokens / CSS | `code-native` | accepted；无需 raster | n/a |
| 五步工作流与连接路径 | React / SVG / Lucide | `code-native` | accepted；需要实时语义和响应式 reflow | n/a |
| 100 / 5 / 2 正式报告门槛 | live text | `code-native` | accepted；不得进入图片 | n/a |
| 条件分流 | live text + SVG | `code-native` | accepted；统一写“若达到 / 若未达到” | n/a |
| Excel / Markdown / HTML 交付物 | live text + Lucide | `code-native` | accepted；不制作虚假文件截图 | n/a |
| 项目演示视频与 poster | 后续共同确认案例 | `replace-later` | 未生成；当前保留明确占位 | `public/demos/global-opinion/` |

生产用新增 raster：0 个。锁定参考图只用于 QA，不裁切、不嵌入页面。

## 3. Build owner

- 主流程：`identity-skill`。
- 构建契约：`C:/Users/16934/.codex/skills/identity-skill/references/frontend-app-builder.md` fallback。
- 设计校准：Hallmark；遵循项目根目录 `design.md`、`tokens.css` 和现有 Next.js App Router 结构。
- 框架与依赖：Next.js 16、React 19、TypeScript、Lucide；不增加新依赖。

## 4. 页面顺序与职责

`Project mast → DemoSlot（项目视频，共创中）→ Evidence Workflow（本轮）→ Project actions`

- `DemoSlot` 继续独立说明“以后如何演示真实案例”。
- `Evidence Workflow` 解释“Skill 如何判断、何时停止、交付什么”。
- 两者不得合并，也不让工作流动画伪装成 Agent 实时运行。
- 本轮只替换 `/work/global-opinion` 的旧六章观测台；其余六个项目暂时保持现状。

## 5. 允许的可见文案

### 项目定位

- 标题：`全球舆情与品牌口碑分析 Skill`
- 定位：`把公开网页数据转化为可审计的产品 VOC 与事件声誉判断。`
- Section label：`EVIDENCE WORKFLOW / 证据工作流`
- Section title：`工作流与正式报告质量门`

### 30 秒摘要

- `典型输入`
- `主题、时间窗、目标数据量、市场 / 语言、竞品`
- `我的角色`
- `工作流设计、证据门槛、报告交付`
- `证据状态`
- `可运行 Skill / 私有仓库 / 只读检索`

### 五步工作流

1. `范围确认`：明确主题与时间窗；设定目标数据量；确定市场 / 语言与竞品。
2. `只读采集`：只读检索公开网页；记录检索式与参数；不生成、不篡改内容。
3. `清洗与来源审计`：去重与质量筛选；保留可追溯来源；检查来源策略覆盖。
4. `正式报告质量门`：`100+ 有效记录`、`5+ 来源域名`、`2+ 来源类型`。
5. `多格式交付`：按门槛输出并附带证据清单。

### 条件分流

- `若达到门槛：进入正式报告。`
- `若未达到门槛：仅交付数据包、覆盖缺口与续采建议。`

### 交付物与边界

- `Excel · 6 个工作表`
- `Markdown · 正式报告`
- `HTML · 离线可视化（按需）`
- `不足样本不包装成正式结论；政治、战争、军事、武器与情报主题不进入流程。`

不得新增情绪比例、覆盖率、客户名称、运行计时、通过状态或商业增益。

## 6. 组件与文件范围

### 新建

- `components/project-evidence-flow.tsx`：本轮客户端交互组件；持有进入视口揭示、阶段聚焦和无障碍状态。

### 修改

- `components/project-detail.tsx`：有 `project.evidence` 时渲染新证据流；否则保留旧 `ProjectObservatory`。
- `lib/site-data.ts`：新增可选 `ProjectEvidence` 类型并只为 `global-opinion` 写入已核验事实；同步项目标题与定位。
- `app/globals.css`：新增证据工作流、质量门、交付物、移动端和 reduced-motion 样式；不删除旧观测台样式。
- `docs/fidelity-ledger.md`、`docs/fresh-review.md`、`docs/identity-evidence.json`：QA 后追加 v4 证据。

### 不修改

- `components/demo-slot.tsx` 的视频媒体逻辑和 `ProjectDemo` 视频字段。
- 其余六个项目的数据、URL 与详情结构。
- 全站导航、作品宇宙、Career、文章和关于我页面。

### 删除

- 无。

## 7. 交互与无障碍

- `IntersectionObserver` 只负责首次进入视口的揭示；不会请求 API 或运行 Agent。
- 证据路径使用 `transform: scaleX / scaleY` 推进，节点只使用 `transform` 与 `opacity` 进入。
- 默认第一焦点固定为正式报告质量门；hover、focus 和触摸选择只改变当前讲解阶段。
- 每个节点可键盘聚焦，使用 `aria-pressed` 或等价可读状态；质量门数字保持 live text。
- `prefers-reduced-motion` 下取消路径推进和空间位移，完整内容立即显示。
- 页面不可用颜色单独表达条件；“若达到 / 若未达到”文字始终可见。

## 8. 响应式基线

- 1440 / 1920px：摘要位于上方，主证据链为水平布局，质量门是唯一第一焦点，交付物位于稳定的右侧区域。
- 960 / 1280px：压缩节点说明和间距，不隐藏门槛或交付物。
- 768px 以下：改为纵向证据链，交付物置于路径之后，取消横向动画。
- 320 / 375 / 414px：无水平滚动；标题自然换行；所有可点击文字保持单行；阈值不挤压或截断。

## 9. Token 与视觉锁定

- 背景、文字、弱化文字、规则线、紫色焦点与绿色语义均只引用 `tokens.css`。
- Display / body / label 分别继续使用 `--font-display`、`--font-body`、`--font-label`。
- 新样式不得内联新的 hex / rgb / oklch 色值。
- 不新增玻璃拟态、球体、地图、情绪仪表盘、随机粒子、假浏览器 chrome 或同尺寸卡片墙。
- Hallmark pre-emit target：Philosophy 5 / Hierarchy 5 / Execution ≥4 / Specificity 5 / Restraint 5 / Variety 5。

## 10. QA 计划

1. 运行 lint 与生产构建。
2. 本地打开 `/work/global-opinion`，验证视频仍是共创占位，工作流不表现为实时 Agent。
3. 对 1672 × 941 参考图与实现 section 使用 `view_image` 并排检查。
4. 捕获 desktop 1440、ultrawide 1920、mobile 390；额外做 320 / 375 / 414 / 768 的溢出检查。
5. 检查进入视口揭示、鼠标 hover、键盘 focus、触摸选择和 reduced-motion。
6. 文案 diff：不允许遗漏 100 / 5 / 2、条件分流、交付物或主题边界。
7. 更新 fidelity ledger、fresh review、`identity-evidence.json`，运行 Identity 验证器。

在三视口截图与逐项审查完成前，v4 状态保持 `not verified`。

## 11. 允许偏差与风险触发

允许偏差：参考图的顶部导航和项目 Hero 不在该下文 section 内重复；移动端将水平路径变为纵向路径；这些都由用户重新定义的页面职责和响应式要求支持。

风险触发：若实现需要把工作流或阈值做成图片、需要虚构案例来填视频、需要删除旧组件、或真实视频改变当前页面主焦点，立即暂停并返回对应确认阶段。

## Hallmark pre-emit critique

Philosophy 5 / Hierarchy 5 / Execution 5 / Specificity 5 / Restraint 5 / Variety 5。
