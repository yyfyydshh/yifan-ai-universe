# Design — 杨逸凡 AI Capability Universe

这是全站唯一设计系统。后续页面只允许在这里声明的页面家族内变化，不得为单页另起主题。

## Genre

`atmospheric`，以 evidence-first editorial 纪律控制信息层级。深空不是装饰主题，而是“能力可以被观察”的空间隐喻。

## Macrostructure family

- Marketing：首页与作品页使用 Marquee Hero / Spatial Canvas 变体；首屏由定位和项目宇宙共同完成证明。
- App / case study：项目详情、Career 与关于我使用 Workbench 变体；每页由真实关系生成专属信息图。
- Content：思考列表与文章使用 Long Document 变体；以阅读焦点、观点信号和章节导航组织内容。

## Theme

- `--color-paper`：oklch(13% 0.015 265)
- `--color-paper-2`：oklch(16% 0.018 265)
- `--color-paper-3`：oklch(20% 0.022 267)
- `--color-ink`：oklch(91% 0.023 78)
- `--color-ink-2`：oklch(77% 0.022 78)
- `--color-rule`：oklch(32% 0.025 270)
- `--color-accent`：oklch(69% 0.12 297)
- `--color-focus`：oklch(84% 0.12 297)

紫色只表达焦点、当前状态或可操作性，每个视口不超过约 5%。绿色仅表达已通过的真实边界。

## Typography

- Display：Noto Serif SC / Source Han Serif SC / Songti SC，500，normal；只用于品牌字标、少量数字与编辑性强调。
- Project heading：Noto Sans SC / Source Han Sans SC / Microsoft YaHei UI，500，normal；项目主标题、模块标题和交互台标题统一使用无衬线中文标题角色。
- Body：Noto Sans SC / Source Han Sans SC / Microsoft YaHei，400。
- Mono：IBM Plex Mono / Cascadia Mono。
- 中文项目标题 tracking：主标题最多 -0.02em，模块标题为 -0.01em 至 0；不再用大字号高对比宋体承担产品界面层级。
- 所有标题使用 `text-wrap: balance`、`min-width: 0`、`overflow-wrap: anywhere`。
- 标题不得裁切或行数截断；Career 主标题在 960px 以上保持单行。

## Type scale

- `--text-display-xl: clamp(3.25rem, 8vw, 7rem)`
- `--text-page-title: clamp(2.75rem, 5vw, 5.25rem)`
- `--text-project-title: clamp(2.35rem, 3.6vw, 4.35rem)`
- `--text-section-title: clamp(1.55rem, 2.15vw, 2.15rem)`
- `--text-card-title: clamp(1.2rem, 1.45vw, 1.65rem)`

## Spacing

沿用 `tokens.css` 的 4pt scale。页面使用命名 token，不临时创造孤立间距。

## Motion

- 原语：path progression、state crossfade、one-time reveal；每页最多三类。
- 只动画 `transform` 和 `opacity`。
- 巡航：作品页 150 秒/圈，首页 180 秒/圈。
- 项目运行在统一三维坐标系：首页以人物胸腹为共同引力中心并使用单一斜向轨道，作品页沿用球面 yaw / pitch / roll；二者均使用透视投影且不使用逐帧随机数。
- 用户拖动产生新的三维方向向量；松手后以受限角速度和无回弹衰减继续沿该方向旋转，最终平滑汇入 180 秒/圈的巡航。无拖动的点击或键盘步进仍保留 1.2 秒观察停顿。
- 首页四项目采用“人物中心单轴公转体”：四颗项目按参考图锁定为左上、右上、左下、右下四个起始象限，并沿同一条斜向三维轨道持续运行；拖动只改变共同相位与继续巡航的方向，不允许项目换轨或混入额外 pitch / roll。轨道按深度拆成人物后景段与前景段，人物始终固定；禁止屏幕空间两两推开、人物避让改坐标和硬边界夹取。真实 Z 深度同时驱动尺度、透明度和层级，形成清晰的近大远小；进入面部安全区的项目与轨道保持真实坐标，但强制切入人物后层，由锁定 RGBA 人物素材提供自然遮挡，不允许凭空消失。
- 首页桌面版的单轴坐标中心位于右侧画布约 55% 位置，为左侧个人定位保留完整阅读区；左侧以开放式三段 rail 补充“需求拆解 → Agent / Skill 编排 → 验证与复用”，只陈述既有能力，不新增指标。
- reduced-motion：停止巡航、惯性与空间位移；状态直接呈现，最多 150ms opacity。

## Microinteractions stance

- 焦点立即显示，不动画 focus ring。
- hover 只改变层级、边框和轻微 transform，不触发 tooltip 或布局跳动。
- 拖动阈值 6px；普通点击直接进入项目，只有从项目上实际拖过阈值的那一次点击会被抑制。左右输入主要改变 yaw，上下输入主要改变 pitch，对角输入产生受限 roll。
- 当前章节和当前经历同时使用视觉状态与 ARIA 状态，不依赖动画传达含义。

## CTA voice

- Primary：低饱和紫填充或紫色规则面，矩形轻圆角，动词在前。
- Secondary：细边框，透明背景。
- 按钮、导航、面包屑和主要链接保持单行。

## Per-page allowances

- 首页：四个核心项目沿同一条斜向轨道环绕锁定人物巡航；共同中心必须落在人物胸腹，后景轨道必须被人物遮挡、前景轨道必须在人物腰胸安全区穿出。允许为同一轨道增加三条同平面、不同半径的低对比回声线来强化空间包裹感，但项目只运行在中央主轨，不能重新解释为三轴或三条独立轨道。近景明显放大、远景适度缩小，但图标、分类、完整项目名和入口在全部深度下都必须可读。轨道不能成为与运动无关的装饰椭圆。
- 首页人物透明态由项目接管视觉重心：四颗球采用均衡相位，相对实体态连续放大约 15%，最右侧项目保留安全边距，主轨与回声线保持可辨；人物显现后项目回落到标准尺寸。缩放必须进入实时投影 scale，不能使用会拖慢坐标更新的独立 CSS transform transition。
- 作品页：七项目整盘拖动与语义图标。
- 项目详情：sticky 观测台、六种语义场景和紧凑视频槽。
- Career：纵向职业轨迹，不使用卡片墙。
- 思考：观点信号，不放大普通卡片。
- 文章：阅读进度与章节标记，不逐段飞入。
- 关于我：四层能力系统图，不使用能力卡片矩阵。

## What pages MUST share

- `YY 杨逸凡` wordmark、导航高度、联系入口。
- 色彩、字体、标题层级、4pt spacing 和 CTA voice。
- 细规则线、证据编号、低对比空间场。
- reduced-motion 与 focus-visible 规则。

## What pages MAY differ on

- 页面专属语义图形、密度、两栏比例和动效原语组合。
- 只有内容关系不同才允许结构不同，不能用随机视觉变化制造“丰富”。

## Responsive contract

- 320、375、414、768、960、1280、1440、1920px 无水平滚动。
- 48rem 以下所有空间交互改为单列静态内容；内容完整保留。
- image-bearing grid 使用 `minmax(0, 1fr)`。
- `html` 与 `body` 使用 `overflow-x: clip`。

## Exports

### tokens.css

以项目根目录 `tokens.css` 为唯一 CSS token 源。

### Tailwind v4

本项目不使用 Tailwind utility 组织页面；保留依赖但不建立第二份 token 真相源。

### DTCG

当前不导出独立 `tokens.json`，避免与 `tokens.css` 漂移。

### shadcn/ui

当前未使用 shadcn/ui；语义映射为 background→paper、foreground→ink、primary→accent、border→rule、ring→focus。

## 禁止项

- 假 KPI、假运行状态、假计时、未标记演示数据。
- 同尺寸卡片墙、默认 Bento、玻璃拟态、随机球体、无语义轨道。
- 自定义光标、重型 WebGL、装饰性视差。
- 斜体标题、渐变文字、仿浏览器/终端 chrome。
- 为了动效隐藏或裁切重要内容。

## v23 正式投递版收口（2026-08-19）

- 一级导航只显示页面名称；项目详情归属“作品”，文章详情归属“思考”。桌面以紫色刻度和 `aria-current` 同步表达当前位置，避免数字坐标挤占标题阅读。
- `70rem` 以下切换为“字标 + 导航按钮”的非模态面板；完整保留五个一级入口与联系入口，触控区域不小于 44px，支持 Escape 和路由切换关闭。
- 联系弹层沿用深色纸面、细规则线和克制紫色；微信二维码是唯一高亮图像，使用原始文件直出，邮箱与电话保持单行可点击。
- 首页能力闭环使用三个紫色信号点和轻连接线表达“需求拆解 → Agent / Skill 编排 → 验证与复用”，不再使用编号表格与上下边框。
- 项目标题区不增加卡片墙，在 tagline 下以三列事实轨表达“任务入口 → 关键判断 → 交付结果”；移动端自然改为纵向，禁止固定高度补空。
- 项目视频继续位于首屏叙事之后；WebVTT 只承担中文 Agent 对话、关键阶段和结果状态，不把整屏 UI 再读一遍。
- 分享图、canonical、sitemap、robots 和 Manifest 共享 `SITE_URL` 配置；正式发布不得回落到 localhost。
- v23 为 adoption closeout：既有首页单轴人物宇宙、七个项目工作台、经历轨迹和文章阅读结构不重新设计，只通过响应式、可访问性和发布门收口。
