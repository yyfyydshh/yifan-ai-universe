# 杨逸凡 AI Capability Universe｜还原与内容边界

## 构建目标

这是一个用于求职的多页面个人作品站。首版先建立完整的信息架构、项目内容模型、空间化浏览方式和统一演示插槽；项目视频在后续拿到具体 Skill 地址、真实输入与演示方式后逐个共创。

## 参考图到实现映射

| 参考图 | 页面 / Section | 必须保留 | 代码负责 | 素材状态 |
| --- | --- | --- | --- | --- |
| `01-home.png` | `/` 首屏与证据条 | 左侧个人定位、右侧项目轨道、深色空间氛围、真实数字证据 | 所有文字、导航、按钮、指标、轨道与响应式 | 空间纹理首版为 code-native；后续可替换 raster |
| `02-project-universe.png` | `/work` | 7 个项目的层级、非规则空间构图、点击探索 | 项目节点、分类、键盘焦点、移动端列表 | 球体为 code-native；后续可换共享 `orb-core` |
| `03-sales-demo.png` | `/work/sales-copilot` 演示区 | 输入—判断—工具—证据—结果的阅读路径 | 文字、流程、状态与视频插槽 | `replace-later`：等待真实 Skill 与脚本；不伪装实时运行 |
| `04-global-opinion-xray.png` | `/work/global-opinion` | 问题、判断、系统、可靠性、产物、复用的 X-Ray 结构 | 全部事实文本、流程与证据说明 | 用户提供的最终项目视频已接入；下文工作流仍为 live code |

## 全局视觉指纹

- 深石墨背景、暖白正文、低饱和紫色作为唯一强调色。
- Display 使用中文宋体气质，正文使用无衬线，标签使用等宽字体。
- 形状以轨道、球体、细边框和开放式版面为主；避免模板化 bento 堆叠。
- 动效预算为三类：轻微漂移、Hover 聚焦、页面内淡入。所有动效只改变 `transform` 和 `opacity`，并支持 `prefers-reduced-motion`。

## 内容真实性边界

- 只使用简历、项目仓库、两篇定稿文章和用户明确确认的信息。
- Sales Copilot 演示位是静态结构预留，必须显示“共创中”，不得写“运行中”。
- 视频与项目文章不绑定。文章证明观点，视频证明项目如何工作。
- 手机号不在网页公开，只保留在 PDF 简历中；邮箱公开。
- 舆情图表若无真实数据，禁止生成百分比、曲线和覆盖数据。
- 2026 年文档站完成日期不在页面中写死，避免将未来或未确认节点当作事实。

## DemoSlot 接入契约

每个项目详情页只依赖统一的 `DemoSlot`。后续可替换为：

1. `poster`：视频封面；
2. `src`：MP4 / WebM；
3. `duration`：由真实案例演示决定；
4. `caseLabel`：真实案例、脱敏案例或模拟案例；
5. `inputSummary`：用户给 Agent 的任务；
6. `decisionSteps`：Skill 的关键判断与工具调用；
7. `resultSummary`：真实输出及其可核验位置；
8. `fallbackFrames`：无视频或 reduced-motion 时的静态分镜。

未完成项目继续保持占位；全球舆情项目已使用用户确认的最终视频和真实抽帧封面。

## 响应式策略

- Desktop：项目轨道和球体是主要探索界面。
- Mobile：改为纵向项目卡，不在小屏强行复刻轨道坐标。
- 320 / 375 / 414 / 768 px 下按钮和导航不换行；根元素使用 `overflow-x: clip`。

## 当前构建责任

构建 owner：`identity-skill` 内置 `frontend-app-builder` fallback + Hallmark custom spatial editorial contract。

允许偏差：首版不生成视频、空间背景位图与 3D 球体位图，改用已批准的 code-native / replace-later 方案。页面信息架构、层级、内容真实性和 Demo 接口不可偏离。

## v2 全站交互重构

- 生效参考版本：`references/locked/v2/`。
- 新增 anchor：`05-project-observatory-sales-copilot.png`。
- 新增 render contract：`docs/reference-production-plan-v2.md`。
- 素材 manifest：`docs/asset-split-v2.md`；当前生产用 raster 数量为 0。
- 复刻执行 brief：`docs/execution-brief-v2.md`。
- 拓扑：项目宇宙、项目观测台、Career 轨迹、思考信号、文章阅读器和能力系统均为 `section-specific`；只共享 tokens、Lucide 图标映射和小型状态 primitive。
- 最终状态在三视口截图、逐页面审查、lint/build 与 Identity 验证器完成前保持 `not verified`。

## v2.1 漂移、点击与职业信息增量

- 首页与作品页继续共享 `ProjectUniverse` 小型 primitive，但各项目使用确定性相位、轻微轨道进动与半径呼吸；项目顺序和移动端 restack 不变。
- 可见轨道是空间场参考，不再代表项目被锁死的唯一运动路径；悬停单个项目、键盘聚焦、拖动、页面隐藏或离开视口时暂停。
- 普通 pointer down/up 不捕获指针，也不抑制链接；只有移动超过 6px 后才捕获并抑制从项目节点产生的那一次 click。
- Career 仍为专属纵向轨迹，不改成卡片墙；增加的职责、指标、教育和证书全部来自用户简历。
- 本增量不需要新 raster 素材，也未改变锁定参考图的主体、来源、主色或页面结构，属于低风险 code-native 延展；受影响 section 仍需新截图证据后才能标记 `pass`。

## v3 三轴作品宇宙

- 生效参考版本：`references/locked/v3/`；首页与作品页改用新的三轴空间基线，其余三张 v2 参考原样复制并保留哈希。
- Render contract：`docs/reference-production-plan-v3.md`。
- 素材 manifest：`docs/asset-split-v3.md`；生产用 raster 数量为 0，参考图不进入运行时。
- 复刻执行 brief：`docs/execution-brief-v3.md`。
- 拓扑：`home-hero` 与 `project-universe` 各自保持 section-specific 构图，但共享一个参数化 `ProjectUniverse` 三维运动 primitive；共享仅限旋转/投影/输入状态，不共享页面定位坐标。
- 用户拖动产生新的三维方向向量；惯性衰减到巡航速度后继续沿该方向运动，不回到固定默认轨道。
- Career 以视口 42% 阅读焦点线决定 active entry；这是不改变既有几何的行为修复。
- 最终状态在新三视口截图与真实指针路径复核前保持 `not verified`。

## v4 全球舆情工作流讲解动效

- 锁定参考：`references/locked/v4/01-global-opinion-workflow-explainer.png`。
- Render contract：`docs/reference-production-plan-v4.md`；参考审查：`docs/reference-review-v4.md`。
- 素材拆分：`docs/asset-split-v4.md`；当前生产用 raster 数量为 0。
- 复刻执行 brief：`docs/execution-brief-v4.md`。

## v13 首页稳定核心星系（2026-08-17）

- 复用锁定参考：`references/locked/v3/01-home.png`。本轮不覆盖参考、不新增生成图像；用户截图作为缺陷证据，不作为新的视觉目标。
- 三秒信息：三个旗舰案例围绕同一个“可运行、可验证、可复用”的能力核心组织，而不是三颗彼此无关的大球。
- 第一焦点：三个项目的名称与语义图标；第二焦点：固定能力核心；第三焦点：标签与案例入口。轨道只负责解释关系，不成为主角。
- 作者性动作：桌面端使用三个固定扇区承接小幅三维漂移，中心锚点不移动；连接线实时指向当前项目位置，使用户拖动后仍能理解整体结构。
- 拓扑：`home-hero` section-specific。继续复用 `ProjectUniverse` 的旋转、投影与输入 primitive，但首页拥有独立锚点、幅度、比例和内容结构，不改变 `/work` 七项目球面。
- 响应式：48rem 以下取消核心、连线、巡航与拖动，回退为完整可读的三项目纵向列表；桌面与超宽屏不得出现三项目同时聚集到同一侧。
- 素材等级：`C0 code-only`。星体、核心、连接线、图标与项目说明均为 live DOM / CSS；没有把文字或能力关系烘焙进图片。
- Code-safe areas：项目名称、分类、标签和真实链接必须保持可选择、可聚焦的 DOM；拖动后普通点击仍可进入项目详情。
- Exclusion zones：项目扇区不得覆盖首页个人定位正文；视觉核心不得遮挡项目文字；任何相位下都不得留下大于三项目焦点组的无效空场。
- 回退：恢复 `.showcase-backups/yifan-ai-universe/20260817-home-core-constellation-v1/` 中的 `project-universe.tsx`、`app-globals.css` 与文档文件。
- 页面职责：该参考图只定义项目详情下文的工作流讲解动效，不定义视频内容。
- 工作流、100 / 5 / 2 质量门、条件分流、交付物与边界全部使用 live code 实现。
- 视频保持独立媒体槽；全球舆情项目已完成共创并接入用户确认的最终成片，其余项目仍为 `replace-later`。
- 在素材拆分与复刻执行 brief 的后续确认完成前，不修改详情页组件或样式。

## v6 Sales Copilot 销售专业助手

- 锁定参考：`references/locked/v6/01-sales-professional-assistant-workbench.png`。
- Render contract：`docs/reference-production-plan-v6-sales.md`；内容 brief：`docs/sales-case-study-v6-brief.md`。
- 参考审查：`docs/reference-review-v6-sales.md`；素材拆分：`docs/asset-split-v6-sales.md`。
- 页面以“销售专业助手”为项目身份，以“客户判断与行动建议”为具体结果。
- 旧版七阶段路由与常驻深度侧栏不再是 Sales 的主阅读结构；改为对话证据、可靠性检查和结果回溯。
- 项目视频继续独立保留为 `replace-later / 共创中`，不因本轮页面重构而生成虚构案例。

## v7 Sales Copilot 客户原话 → 助手答案

- 锁定参考：`references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`；SHA-256：`159468c8071ead462c6478438a4f2198b046f2e9f9623412092a2cbc619a1336`。
- Render contract：`docs/reference-production-plan-v7-sales.md`；内容 brief：`docs/sales-case-study-v7-brief.md`；素材拆分：`docs/asset-split-v7-sales.md`。
- v6 状态：`reference-invalidated`。三栏“原始沟通 / 可靠性检查 / 结果”被两栏“客户原话 / 销售专业助手给出的答案”替代。
- 三秒信息：销售把一段客户沟通交给助手，得到客户问题、待确认信息、下一步行动和一条可编辑追问。
- 作者性动作：点击右侧答案时，左侧只点亮支持它的原话或信息缺口；证据线只表达这一种真实引用关系。
- `C0 code-only`：参考图是 QA 目标，不是生产素材；标题、对话、答案、图标、证据线、情境切换和可靠性带全部由 React/CSS 实现。
- Topology：`section-specific`。桌面使用 42% / 58% 前后对照；移动端按“定义 → 客户原话 → 助手答案 → 可靠性边界”单列重排，不保留跨栏证据线。
- Code-safe areas：所有客户文本、答案、机制演示声明、人工确认边界和交互控件必须保持 live DOM；禁止烘焙进图片。
- Exclusion zones：证据路径不得进入客户原话或答案文本区域；选择状态不得依赖动画或仅依赖颜色。
- 独立视频槽继续位于项目介绍区，状态为 `replace-later / 共创中`，不属于本参考图，也不因本次重构生成视频。
- 当前阶段：参考图已锁定，生产实现尚未开始；在素材拆分与复刻执行 brief 确认前状态为 `not verified`。

## v7 全球舆情项目视频接入

- 用户提供的最终视频归档为 `public/videos/global-opinion-agent-demo.mp4`，保持 1920×1080、30fps、H.264 + AAC，不做二次内容改写。
- 从同一视频 2.8 秒处抽取 `public/videos/global-opinion-agent-demo-poster.jpg`，作为独立媒体封面；没有使用生成素材或替换视频事实。
- `global-opinion` 的 `ProjectDemo` 仅填写 `src` 与 `poster`，统一 `DemoSlot` 组件、16:9 容器、控制器与项目页结构不变。
- 这是已批准 `replace-later` 素材的真实来源替换，不改变主体、宽高比、焦点层级、页面拓扑或响应式行为，不触发参考图失效。
- Sales Copilot 与其余项目视频仍保持 `replace-later / 共创中`。

## v9 第二批项目证据页（2026-08-16）

- 锁定参考：`references/locked/v9/01-tender-schema-refinery.png`、`02-hot-news-evidence-radar.png`、`03-humanizer-voice-chamber.png`。
- Render contract：`docs/reference-production-plan-v9-second-batch.md`；参考审查：`docs/reference-review-v9-second-batch.md`。
- 素材拆分：`docs/asset-split-v9-second-batch.md`。生产保持 `C0 code-only`，三张参考图不进入运行时。
- 独立 showcase runs：`.showcase-runs/yifan-ai-universe/{tender-cleaner,hot-news-brief,humanizer-literary}`；各自保存事实锁、参考、批准状态和 `backups/pre-v9/`。
- 受影响公共文件：`lib/site-data.ts`、`components/project-case-study.tsx`、`app/globals.css`、`app/tokens.css`。
- 新增组件：`components/tender-schema-case-study.tsx`、`components/hot-news-case-study.tsx`、`components/humanizer-case-study.tsx`。
- 回退时先恢复任一 run 的 `backups/pre-v9/` 公共文件，再删除上述三个新组件；不触碰项目仓库、既有视频和其他项目页。
- 视频仍为独立 `replace-later / 共创中` 槽位，本轮没有生成或接入演示视频。

## v8 Sales Professional Assistant 多轮转化分析

- 锁定参考：`references/locked/v8/01-sales-multi-turn-conversion-desk.png`；Render contract：`docs/reference-production-plan-v8-sales.md`。
- 生产组件：`components/sales-conversion-case-study.tsx`；旧 `sales-decision-case-study.tsx` 已被完整替代并删除。
- 数据接口：`SalesCaseStudy.visualKind = sales-conversion`，核心数据为三轮累计上下文、五类输出、MQL D / C / B 状态、需求维度与人工边界。
- 样式入口：`app/globals.css` 中 `Turn-Led Conversion State Desk · Sales Copilot v8` 区段；不新增图像资产或第三方依赖。
- 回退范围仅涉及 `components/project-case-study.tsx`、`components/sales-conversion-case-study.tsx`、`lib/site-data.ts` 与对应 v8 样式；不要触碰其他六个项目、全球舆情视频或 v9 第二批页面。
- 视频仍为独立 `replace-later / 共创中` 槽位，后续在真实案例与可公开输入确认后共创。

## v11 Humanizer 联动布局修正（2026-08-16）

- 用户反馈确认原三栏把独立编辑台插在联动的阶段导航与阶段深解之间，`references/locked/v10/02-humanizer-proposal-review.png` 对 Humanizer 拓扑失效。
- 新锁定参考：`references/locked/v11/03-humanizer-process-pair.png`；Render contract：`docs/reference-production-plan-v11-humanizer-layout.md`。
- 上层 `Process Pair` 只由 `activeStageIndex` 驱动；下层 `Editing Mechanism` 承载内容锁、编辑提案、差异裁决、复核和交付。
- 生产仍为 `C0 code-only`，不新增图片、依赖、项目事实或视频；回退文件保存在 Humanizer showcase run 的 `backups/pre-v11-layout/`。

## v11 文档站工程总览（已锁定，待实现）

- 锁定参考：`references/locked/v11/01-docs-system-blueprint.png`；SHA-256：`3AD52B7F0199E217B4C3BD87C4E02772994E8DDE18133B6A4536F73E6926C99F`。
- Render contract：`docs/reference-production-plan-v11-docs-system.md`；参考审查：`docs/reference-review-v11-docs-system.md`；素材拆分：`docs/asset-split-v11-docs-system.md`。
- 旧 `docs-three-route-console` 参考保留为历史基线；本项目的新主语义改为“完整文档站工程：技术栈、搭建链、维护带与公开核验入口”。
- 生产保持 `C0 code-only`，不生成或复制新图像资产；参考图不进入运行时。
- 专属拓扑：输入层 → 技术底座 → 站点系统 → 维护带 → 质量门 → 真实站点 URL。仅共享全局 token、图标与状态 primitive，不复用旧三路径布局。
- 真实站点 `https://www.bazhuayu.com/docs/zh/overview` 作为可点击公开证据；公开 SOP 仅说明可复用方法，不描述为生产源码。
- 视频为延后共创的项目介绍，独立于本页详细机制；本轮不生成视频。
- 参考与零素材拆分已由用户确认；复刻执行 brief 待用户确认。在该 brief 确认前不得修改 `DocsRouteCaseStudy` 或相关样式。

## v14 首页紧凑均匀三体纠偏（2026-08-17）

- 用户明确否决 v13 的固定能力核心与横向项目框；v13 仅保留为历史版本，不再作为当前目标。
- 当前目标恢复原有圆形项目星球，并将三颗星球收拢为共享半径、120° 等间距、共享相位的均匀旋转体。
- 拖动只改变整体相位和继续旋转的方向；单颗星球不得独立改变轨迹或聚集到同一侧。
- 回退范围仅包含 `components/project-universe.tsx`、`app/globals.css`、`design.md` 与本轮审查文档，不触碰项目路由、数据、视频或详情页。
- QA 证据保存到 `references/qa/v14/`；通过前状态保持 `not verified`。

## v15 首页四星三轴公转体（2026-08-18）

- 锁定参考：`references/locked/v15/01-home-four-project-three-axis.png`；SHA-256：`E714F311A907652152BD11C407140AB8B97167A1515BCEEE8935D4B1C6A585DB`。
- v14 三体基线因主体数量变化而失效，但保留为历史证据，不覆盖、不删除。
- 首页精选项目由三个扩为四个：全球新闻舆情分析、Sales Copilot、产品文档站 0→1、金融监管风险监测；全部读取既有 `site-data.ts`，不新增项目事实。
- 四颗星球共享同一组 yaw / pitch / roll 三维旋转状态；三条非共面轨道表达共同坐标系，深度映射到尺度、透明度与层级。
- 投影后的轻量安全距离校正只防止项目相互遮挡和越界，不改变拖动方向或整体公转关系。
- 拖动松手后沿用户给出的三维方向继续惯性旋转，衰减至 180 秒/圈巡航速度；键盘步进、暂停条件与 reduced-motion 沿用既有无障碍边界。
- 48rem 以下隐藏轨道与巡航，四项目按静态纵向列表呈现。
- Topology：`home-hero` section-specific；只改 `ProjectUniverse` 的 condensed 分支，不改变 `/work` 七项目宇宙。
- 回退范围：`components/project-universe.tsx`、`app/globals.css`、`design.md`、`.hallmark/log.json` 与 v15 QA 文档；不触碰项目路由、详情页、视频、文章或 Career。

## v16 首页左右视觉平衡（2026-08-18）

- 用户指令参考：`references/locked/v16/01-home-user-direction.png`；SHA-256：`AC678D72B6E70DAFF7CF5C531D55FE480B9B6C7C030FA750C8533E9195899758`。
- 四星三轴体继续使用 v15 的项目集合、投影、拖动、惯性与碰撞安全逻辑，只把 condensed 坐标中心从右栏 50% 调整到 58%。
- 左侧新增开放式能力 rail：需求拆解、Agent / Skill 编排、验证与复用；内容来自现有简历，不引入指标。
- 短屏桌面同步收紧价值主张、rail 与 CTA 的垂直间距，保证 1280×800 首屏完整。
- 回退范围：`app/page.tsx`、`components/project-universe.tsx`、`app/globals.css`、`design.md` 与 v16 证据文档。

## v19.3 首页真实续行轨道与运动 QA（2026-08-18）

- v19.2 的“屏幕空间力场 + 渲染位置插值”标记为历史实现；它会在真实三维投影之后再次改写坐标，使球体看似瞬移，也让可见轨道无法解释实际路径。
- 首页改用单一四元数姿态：拖动、惯性和巡航只更新这一姿态，四颗球与轨道共享同一空间真相源。
- 四条可见轨道由每颗球的当前三维位置和当前旋转轴实时计算，因此球体始终落在自己松手后将继续经过的路径上。
- 横向、纵向和 roll 权重分别收束为 `0.1 / 0.055 / 0.0025`；惯性角速度上限 `0.045 deg/ms`，无回弹衰减至 180 秒/圈巡航。
- 面部安全区不再推开项目坐标；后景球经过安全区时连续退暗，表达被人物遮挡，同时保持真实轨迹。
- 回退范围：`components/project-universe.tsx`、首页宇宙 CSS、运动 QA 脚本与 v19 证据记录；项目事实、人物素材、项目路由和作品页运动模型未改变。

## v20 首页人物中心三环公转（2026-08-18）

- v19.3 四元数球面方案保留为历史实现；它的数学中心与人物是两个独立对象，用户拖动后会出现“球在画布旋转、人物只是叠在上面”的空间割裂。
- 当前三条轨道改为共享人物胸腹中心的固定轨道平面；四个项目使用连续相位沿绑定轨道运行，拖动改变相位速度与后续巡航方向。
- 人物媒体继续使用 v19 锁定 V4 / V5，哈希不变；本轮不生成、裁切或替换人物。
- 前景项目通过实时深度和滞后阈值选出，最多一颗；面部安全区只改变前后层，不改变项目坐标或透明度。
- 未完成客户端布局前提供四象限静态回退，避免四链接叠在中心；48rem 以下仍为静态纵向项目列表。
- 回退范围：`components/project-universe.tsx`、首页宇宙 CSS、`design.md`、`scripts/capture-home-qa.mjs`、`.hallmark/log.json` 与 v20 证据文档；不触碰 V4 / V5 生产媒体、项目数据、详情页、视频或作品页运动模型。

## v21 首页人物中心单轴公转（2026-08-18）

- 用户明确取消 v20 的三条轨道与三轴运动；v20 作为历史证据保留，不删除其参考图或 QA 文件。
- 首页四项目改为同一条斜向三维轨道；四颗球只共享一个连续相位，拖动与惯性不再修改 pitch / roll。视觉上使用中央主轨与两条同平面回声线组成轨道带，三条线不代表三条运动轴。
- 同一 Z 深度控制透视、尺度、透明度与前后层；V4 / V5 人物边界框固定且哈希不变。
- 首页 SpaceField 的两条装饰轨道被隐藏，避免真实单轨与装饰椭圆形成逻辑冲突。
- 项目球统一扩大内容安全区，所有深度下保留图标、编号 / 类别、完整标题与入口；移动端仍为静态纵向卡片。
- 回退范围仅为 `components/project-universe.tsx`、首页宇宙 CSS、`design.md`、三份首页 QA 脚本与 v21 证据文档；不触碰人物媒体、项目事实、详情页、视频或作品页球面宇宙。

## v22 首页五项目单轴宇宙（2026-08-18）

- 锁定参考：`references/locked/v22/01-home-five-project-single-orbit.png`；SHA-256：`2079C985DF127C08AC13031E9E5965F84FFE08C6FEB42A9B0C8367A3DB91FAAB`。
- v21 的人物、轨道数学、拖动惯性、透视与前后遮挡保持不变；只把首页精选从四项扩为五项，并以同轨 72° 等相位配合共同偏移避开人物安全区。
- 第五项复用现有 `humanizer` 项目与 `/work/humanizer` 路由；首页使用独立精选序号 `01–05` 并显示短标题“文学去 AI 味”，作品宇宙和详情页仍保留项目编号 `07`。
- 生产不新增媒体或依赖，V4 / V5 人物哈希不变；参考图不进入运行时。
- 回退范围：`components/project-universe.tsx`、首页 QA 脚本与 v22 证据文档；不触碰项目详情数据、人物媒体、作品页七项目宇宙或其他路由。

## v23 正式投递版收口（2026-08-19）

- 可恢复基线：`backups/release-closeout-baseline-20260819-01.zip`，包含本轮改动前的站点文本与媒体状态。
- 导航与联系回退：`components/site-header.tsx`、`app/globals.css` 和 `public/contact/wechat-qr-yang-yifan.jpg`；回退不会影响首页宇宙、作品宇宙或路由数据。
- 元数据回退：`lib/site-config.ts`、`app/layout.tsx`、各页面 metadata、sitemap、robots、Manifest 与 Open Graph 图；正式域名继续只由 `SITE_URL` 控制。
- 项目首屏回退：`lib/site-data.ts` 的 `mastFacts`、`components/project-detail.tsx` 和对应 CSS；不修改项目工作台事实。
- 视频回退：网页使用 v002，用户确认的母版保存在 `.showcase-runs/yifan-ai-universe/global-opinion/final/`；公开目录中的旧大文件已在哈希核对后移除。
- QA 与证据回退：`tests/e2e/`、`scripts/inspect-media.mjs`、v23 捕获脚本、`references/locked/v23/`、`references/qa/v23/` 与 `docs/identity-evidence.json` 均可独立撤回，不影响运行时页面。
