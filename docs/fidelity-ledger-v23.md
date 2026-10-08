# AI Capability Universe v3 保真账本

构建 owner：Identity Skill `frontend-app-builder` fallback + Hallmark spatial editorial contract。

当前锁定基线：`references/locked/v3/`。v3 只改变首页与作品页的空间运动模型，并修复 Career 阅读焦点；项目详情、思考、文章和关于我的既有 v2 视觉证据继续有效。

## 逐 section 账本

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 参考：`references/locked/v3/01-home.png`
- 保留锚点：左侧个人定位、右侧三颗核心项目、深空能力球、真实数据入口。
- v13 变化：三项目不再自由穿越整块画布，而是由固定能力核心组织在三个独立扇区；每个项目只承接小幅 yaw / pitch / roll 投影，连接线随位置更新，拖动后继续沿用户方向巡航。
- 信息密度：大面积空球改为“小星体 + 项目说明”的开放式项目 plate，补充两项真实标签；没有增加项目事实或虚构状态。
- 响应式：48rem 以下转为静态纵向卡片，不保留巡航或拖动。
- 已核验：`references/qa/v13/home-desktop.png`、`home-ultrawide.png`、`home-mobile.png`；320、375、414、768、960、1280、1440、1920px 无水平溢出。
- 交互：拖动后中心位置不变，三个项目仍留在独立扇区；普通点击成功进入 `/work/global-opinion`，随后可正常返回首页。
- Hallmark 移除测试：去掉轨道仍能凭核心、三项目 plate 与连接关系读懂结构；轨道承担空间坐标而非装饰性信息图。

<!-- identity-section:project-universe status=not-verified -->
### project-universe — not verified

- 参考：`references/locked/v3/02-project-universe.png`
- 保留锚点：七项目层级、语义图标、中心留白、项目探索提示。
- v3 变化：七个项目分布在三维球面，不再依赖固定椭圆轨道；多条非共面经纬弧提供空间线索。
- 输入规则：二维拖动阈值 6px；水平映射 yaw、垂直映射 pitch、斜向产生受限 roll；松手惯性衰减后沿用户方向继续巡航。
- 点击修复：只有真实拖动且起点位于项目链接上时短暂抑制点击，普通点击保留真实 `href`。
- 已验证：lint、production build、七个静态项目路由和构建 HTML 链接。
- 待核验：真实指针手感、深度重叠与三视口新截图。

<!-- identity-section:project-mast status=pass -->
### project-mast — pass

- 参考：`references/locked/v3/03-sales-demo.png`
- 项目定位、标题、标签、状态、资料入口与视频预留槽保持原证据。

<!-- identity-section:sales-demo status=pass -->
### sales-demo — pass

- 参考：`references/locked/v3/03-sales-demo.png`
- 视频仍明确标注“共创中”，不伪装为已上线演示或实时 Agent。

<!-- identity-section:global-observatory status=pass -->
### global-observatory — pass

- 参考：`references/locked/v3/04-global-opinion-xray.png`
- 问题、判断、系统、可靠性、产物、复用六阶段结构未受 v3 影响。

<!-- identity-section:sales-observatory status=pass -->
### sales-observatory — pass

- 参考：`references/locked/v3/05-project-observatory-sales-copilot.png`
- sticky 观测台、六章叙事与移动静态场景未受 v3 影响。

<!-- identity-section:career-trajectory status=not-verified -->
### career-trajectory — not verified

- 参考：`references/locked/v3/01-home.png`
- 内容来源：用户简历中的职责、交付闭环、商业转化、模板治理、团队管理、培训、教育与证书。
- 修复：左侧 rail 不再依赖容易失真的 intersection ratio；以视口 42% 的固定阅读焦点线判定当前经历，滚动、resize 和 hashchange 都会更新。
- 待核验：截图所示第二段经历进入阅读焦点时，左侧 `01` 同步激活。

<!-- identity-section:notes-focus status=pass -->
### notes-focus — pass

- 观点信号与文章焦点结构未受 v3 影响。

<!-- identity-section:article-reader status=pass -->
### article-reader — pass

- 阅读进度与章节信号未受 v3 影响。

<!-- identity-section:profile-hero status=pass -->
### profile-hero — pass

- 个人简介、联系与简历入口未受 v3 影响。

<!-- identity-section:capability-system status=pass -->
### capability-system — pass

- 输入问题 → 方法 → 质量控制 → 交付沉淀的能力链未受 v3 影响。

## 全站硬门槛

- reduced-motion：停止巡航、惯性与空间位移，内容保持完整可读。
- 项目入口：七个项目均为真实路由，不依赖在线 Agent 或 API。
- 运动实现：仅使用原生 React、CSS、`requestAnimationFrame` 与 `transform` / `opacity`；无 Three.js/WebGL 依赖。
- 最终状态：`not verified`。代码验收通过，但缺少本轮新的浏览器截图证据，不能把受影响 section 标为 pass。
## v4 全局舆情证据工作流（2026-08-13）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 锁定参考：`references/locked/v4/01-global-opinion-workflow-explainer.png`；参考只作为语义、层级与构图基准，没有作为网页图片嵌入。
- 页面职责：该模块位于项目视频预留槽之后，只解释 Skill 的证据工作流；视频仍保持独立的“共创中”状态。
- 信息链：范围确认 → 只读采集 → 清洗与来源审计 → 正式报告质量门 → 多格式交付。
- 事实门槛：保留 `100+ 有效记录 / 5+ 来源域名 / 2+ 来源类型`，并以“若达到 / 若未达到”两个明确分支表达停止条件。
- 交付物：Excel 6 个工作表、Markdown 正式报告、HTML 离线可视化（按需）；没有添加情绪比例、商业收益或虚构客户指标。
- 交互：五个节点均可 hover、focus 与点击切换；`aria-pressed` 与可见焦点同步；默认突出正式报告质量门。
- 响应式：桌面为横向证据链和右侧交付物，48rem 以下切换为纵向证据链。320、375、414、768、960、1280、1440、1920px 均无水平溢出和标题裁切。
- 动效边界：只使用一次性淡入、路径推进、状态切换；`prefers-reduced-motion: reduce` 下动画为 `none`，信息仍完整显示。
- 兼容性：只有 `global-opinion` 消费新的 `ProjectEvidence`；Sales Copilot 等其他项目仍渲染原 `ProjectObservatory`。
- 截图：`qa/desktop/global-opinion-workflow-explainer.png`（1440×900）、`qa/ultrawide/global-opinion-workflow-explainer.png`（1920×1080）、`qa/mobile/global-opinion-workflow-explainer.png`（390×844）。
- 有意偏差：没有重复参考图中的全站导航和项目 Hero；这是用户已经明确批准的下文模块定位。移动端将水平路径变为纵向路径；这是响应式 reflow，不改变信息语义。
- 验证：ESLint、Next.js production build、真实浏览器交互、八档响应式、reduced-motion 和旧项目兼容检查全部通过。
- 联动修复：五步路径现在是右侧阶段解释器的真实控制器。01–03 显示当前检查与下一阶段，04 额外显示 `100+ / 5+ / 2+` 门槛，05 才显示 Excel / Markdown / HTML 最终交付物；右栏使用 `aria-live="polite"` 同步播报。

## v5 第一批项目证据工作台（2026-08-16）

本轮锁定基线为 `references/locked/v5/`。统一骨架只负责项目定位、三十秒摘要、阶段状态和深度解释；每个项目保留自己的判断拓扑，视频继续作为 `replace-later / 共创中` 槽位。

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 回归确认：五阶段选择器仍会同步右侧解释器；质量门模拟、停止条件与真实交付物没有被公共接口迁移破坏。
- 截图：`qa/desktop/v5-global-opinion-workflow.png`、`qa/ultrawide/v5-global-opinion-workflow.png`、`qa/mobile/v5-global-opinion-workflow.png`。

<!-- identity-section:sales-decision-routing status=pass -->
### sales-decision-routing — pass

- 独有结构：事实 / 假设 / 未知三层账本、信息充分性分支、七阶段方案路由和人工外发边界。
- 深度增量：右侧不重复左侧摘要，独立说明为什么需要、实际机制、审计产物与继续 / 停止条件。
- 联动：信息不足时锁定画像、优先级和方案；信息充分时可进入单一方案方向、核验材料与跟进草稿。
- 截图：`qa/desktop/v5-sales-decision-routing.png`、`qa/ultrawide/v5-sales-decision-routing.png`、`qa/mobile/v5-sales-decision-routing.png`。

<!-- identity-section:docs-three-route-console status=pass -->
### docs-three-route-console — pass

- 独有结构：从零搭建、旧站迁移、日常维护三条路径，各自拥有七阶段任务链，但共同经过本地验证、托管验收与发布授权。
- 证据边界：明确区分八爪鱼文档站真实经历与公开 Mintlify SOP；公开仓库不被描述为生产站源码。
- 联动：路径切换会重置对应阶段；点击媒体本地化等节点时，右侧同步显示该阶段的机制、`media-map` 证据和停止条件。
- 截图：`qa/desktop/v5-docs-three-route-console.png`、`qa/ultrawide/v5-docs-three-route-console.png`、`qa/mobile/v5-docs-three-route-console.png`。

<!-- identity-section:regulatory-applicability-desk status=pass -->
### regulatory-applicability-desk — pass

- 独有结构：八阶段监管审阅、地域 / 主体 / 业务活动 / 时间四轴矩阵、四条报告阻断门与防重投递指纹。
- 联动：任一轴可切换匹配、待确认、不匹配；任一报告门关闭即阻断正式报告，阶段选择同步右侧深度解释。
- 事实边界：明确“监管关注不等于目标企业违法”，页面只演示判断机制，不构成法律意见或实时监测状态。
- 截图：`qa/desktop/v5-regulatory-applicability-desk.png`、`qa/ultrawide/v5-regulatory-applicability-desk.png`、`qa/mobile/v5-regulatory-applicability-desk.png`。

### v5 响应式与实现门

- 320、375、414、768、960、1280、1440、1920px 自动检查：四页 `overflow = 0`，H1 与当前模块标题均可见且未裁切。
- 标准证据视口：390×844、1672×941、2200×1200 均已生成截图。
- 交互由原生按钮、React 状态和 CSS 完成；没有在线 Agent、实时 API、伪运行进度或新增重型依赖。
- 紫色只标识当前 / 可操作状态，绿色只表示机制规则通过；所有视频位继续标记为“共创中”。

## v6 Sales Copilot 销售专业助手（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 锁定参考：`references/locked/v6/01-sales-professional-assistant-workbench.png`。
- 项目身份：`Sales Copilot / 销售专业助手`；“客户判断与行动建议”是交付结果，不再把项目定义成简报生成器。
- 主阅读路径：销售沟通 → 事实回溯 / 未知项 / 白名单检查 → 客户判断与行动建议 → 深度机制与边界。
- 联动：选择任一能力会同时更新原始沟通高亮、可靠性检查、依据路径和下方深度说明。
- 降级：信息不足时不显示评分与方案结果，只返回一条优先追问和未生成列表。
- 响应式：320、375、390、414、768、960、1280、1440、1920px 均无水平溢出；移动端按语义顺序单列重排。
- 证据：`qa/desktop/v6-sales-professional-assistant.png`、`qa/ultrawide/v6-sales-professional-assistant.png`、`qa/mobile/v6-sales-professional-assistant.png`。
- 验证：ESLint、production build、鼠标、焦点、方向键、状态切换和控制台检查全部通过。

## v9 第二批项目详情页（2026-08-16）

<!-- identity-section:tender-schema-refinery status=pass -->
### tender-schema-refinery — pass

- 双入口、29 字段合同、字段证据 / 提取规则 / 留空条件、单条异常隔离与 CSV / JSON 一致性门均来自公开仓库规则。
- 交互会同步阶段、字段依据、输入路径和右侧深度说明；没有原文证据时明确留空，不伪造公告结果。
- 证据：`qa/desktop/v9-tender-cleaner.png`、`qa/ultrawide/v9-tender-cleaner.png`、`qa/mobile/v9-tender-cleaner.png`。

<!-- identity-section:hot-news-evidence-radar status=pass -->
### hot-news-evidence-radar — pass

- 严格七日窗、快速 / 六角度深度检索、记录准入、故事去重、来源分层和四种输出都绑定到同一证据集合。
- 页面明确只读、非实时、非定时；空结果、窗口外记录与敏感主题都有可见停止或降级路径。
- 证据：`qa/desktop/v9-hot-news-brief.png`、`qa/ultrawide/v9-hot-news-brief.png`、`qa/mobile/v9-hot-news-brief.png`。

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 文学范围门、恒稳 / 单篇画像、内容锁定、最小编辑、完整性审计、四角复核和最多三轮安全返修形成作者声音保护系统。
- 启发式风险分明确不是 AI 比例或来源鉴定；原稿保留、修改稿另存，完整性失败优先阻断。
- 证据：`qa/desktop/v9-humanizer.png`、`qa/ultrawide/v9-humanizer.png`、`qa/mobile/v9-humanizer.png`。

### v9 响应式与实现门

- 320、390、768、1280、1440、1920px 共 18 次页面检查全部无水平溢出，H1 未裁切。
- 三页阶段控件均支持鼠标和方向键推进；选择状态使用 `aria-pressed`，移动端按语义顺序单列重排。
- ESLint、TypeScript 与 Next.js production build 通过，18 条静态路由生成完成。

## v7 全球舆情项目视频增量（2026-08-16）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 用户确认的最终 MP4 已替换该项目独立的 `replace-later` 视频槽；下文工作流解释器、项目文案、质量门和交付物结构均未改变。
- 视频保持原始 1920×1080、30fps、H.264 + AAC；播放器使用站点既有 16:9 媒体框与原生 controls。
- 封面来自同一最终视频 2.8 秒真实抽帧，未生成或伪造新视觉证据。
- 全球舆情以外的项目视频仍显示“共创中”，没有把一个项目的成片错误复用到其他项目。
- 证据：`qa/desktop/v7-global-opinion-video.png`、`qa/mobile/v7-global-opinion-video.png`；桌面播放、移动比例与浏览器控制台检查通过。

## v7 Sales Copilot 销售专业助手可读性重构（2026-08-16）

<!-- identity-section:sales-professional-assistant status=not_verified -->
### sales-professional-assistant — not_verified

- 锁定参考：`references/locked/v7/01-sales-professional-assistant-answer-view-v2.png`；页面使用代码原生复刻，没有把参考图直接嵌入网页。
- 三秒信息：标题直接说明“把客户的一段话，变成销售下一步该做的事”，首屏只保留客户原话、缺失信息、四项助手答案与人工外发边界。
- 联动：默认聚焦“建议这样问”；点击或键盘聚焦任一答案时，左侧仅高亮其真实依据，并更新“为什么这样判断”。
- 降级：切换到“还缺关键信息”时，只保留“还需要确认”和“建议这样问”，明确暂不生成画像、优先级与方案方向。
- 深度分层：MQL、事实 / 假设 / 未知、JSON 契约与子 Skill 编排下沉到“它为什么可靠”，不再阻挡招聘方理解项目价值。
- 真实性：客户原话标记为脱敏机制示例；不自动发送、不代替报价、不承诺实施，不引入虚构客户、收益或运行指标。
- 代码验收：ESLint、TypeScript、Next.js production build 与 18 条静态路由生成通过。
- 待验收：应用内浏览器的本地 URL 安全策略拒绝接管 `127.0.0.1:3010`，因此 390×844、1672×941、2200×1200 截图、鼠标 / 触摸 / 键盘实机联动和视觉溢出检查未伪标为通过。

## v8 Sales Professional Assistant 多轮转化分析（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 锁定参考：`references/locked/v8/01-sales-multi-turn-conversion-desk.png`；参考只定义信息结构、层级与构图，没有嵌入运行时。
- 定位一致：页面明确说明这是面向销售与业务人员的 AI 销售专业助手，处理数据采集与自动化需求，不再使用泛化线索管理示例。
- 三轮累积：第 1、2、3 轮分别形成 D、C、B 状态；每轮读取截至当前的全部回答，需求画像、MQL、方案、授权资料和回复草稿同步刷新。
- 证据回链：点击五类结果后，只点亮真正支撑该判断的客户回答，并同步显示判断依据、相对上一轮的变化和仍待确认项。
- 保密边界：具体行业、站点、字段、数据规模和内部 Skill 规则均不展示；授权资料需销售核验，回复始终是草稿，不自动发送、报价或承诺实施。
- 参考对照：保留了左侧三轮、中央需求维度桥、右侧状态与五类结果、底部事实 / 未知 / 人工边界四个锚点；生产版将参考的压缩单屏放宽为可读的纵向工作台，这是为真实文本和移动端重排做出的有意偏差。
- 响应式：320、375、414、768、960、1280、1440、1920px 均无水平溢出；移动端按定位 → 保密说明 → 三轮回答 → 状态快照 → 可靠性说明重排。
- 交互与无障碍：鼠标、方向键、Home / End、焦点样式和 `aria-live` 状态通过；reduced-motion 下取消空间位移与过渡，内容保持完整。
- 证据截图：`references/qa/v8/sales-conversion-wide.png`、`references/qa/v8/sales-conversion-mobile.png`。
- 验证：ESLint、Next.js production build、三轮联动、证据回链、八档溢出、控制台与 reduced-motion 检查全部通过。

## v8.1 Sales Professional Assistant 布局与证据关联修复（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 桌面工作台由左 / 中 / 右三列改为回答与结果两列，删除会迫使中文标题逐字断行的窄证据栏。
- 五个需求维度进入右侧状态概览，与 MQL 轨迹并列；它们说明 Agent 当前累计读取了哪些信息，不再与客户回答和分析结果争夺主层级。
- 点击五类结果后，判断依据带同步更新结果名称和来源轮次；左侧来源轮次高亮，右侧展开对应客户原话，并提供“定位第 N 轮”回链。
- 回链只改变阅读位置，不丢失当前分析项；方向键仍可连续切换五类结果，三轮累计状态和保密边界未改变。
- 320、375、414、768、960、1280、1440、1920px 检查无水平溢出，交互标签没有换行；ESLint、production build 与浏览器控制台检查通过。
- 证据截图：`references/qa/v8/sales-conversion-desktop-v81.png`、`references/qa/v8/sales-conversion-ultrawide-v81.png`、`references/qa/v8/sales-conversion-mobile-v81.png`。

## v8.2 Sales Professional Assistant 阅读密度与状态语义修复（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 右侧状态区改为“轮次摘要 → MQL 轨迹 → 判断依据与需求维度 → 五类分析结果”的单向纵向节奏，取消 MQL 与依据带并排争抢宽度。
- 左侧回答栏扩大桌面安全宽度，移除长文本下划线；关联关系改由细紫线和“支撑当前：结果名称”共同表达，不只依赖颜色。
- 五类结果仍是唯一的可选择对象；行尾“本轮可判断 / 可编辑草稿”改为无边框、无底色、默认光标的“状态：…”说明，不再伪装成独立按钮。
- 真实浏览器在 327、401、745、1745px 可视宽度均无水平溢出；宽屏主列约为 461px / 721px，状态头部与 MQL 均保持单列。
- 鼠标选择结果后，结果名称、依据带和左侧支撑回答同步刷新；轮次 Home 键从第 3 轮切回第 1 轮后，状态与 MQL 同步回到 D。
- reduced-motion 下 MQL 与结果切换动画为 `none`；ESLint 与 Next.js production build 通过。

## v10 快报与 Humanizer 语义交互修正（2026-08-16）

<!-- identity-section:hot-news-evidence-radar status=pass -->
### hot-news-evidence-radar — pass

- v9 的抽象曲线无法说明候选新闻如何被筛选，已按用户反馈标记失效；v10 锁定参考为 `references/locked/v10/01-hot-news-evidence-filter.png`。
- 匿名候选记录会随严格七日窗、证据字段、故事去重、来源平衡和最终入选门改变为待检查、排除、合并或入选；点击记录后同步解释原因。
- D-8 明确作为窗口外样例；页面不展示真实新闻标题、实时状态、热度或虚构指标。
- 证据：`references/qa/v10/hot-news-desktop.png`、`references/qa/v10/hot-news-ultrawide.png`、`references/qa/v10/hot-news-mobile.png`。

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- v9 静态改稿对照无法展示保护机制，已按用户反馈标记失效；v10 锁定参考为 `references/locked/v10/02-humanizer-proposal-review.png`。
- “删解释性回声”显示允许进入完整性审计；“改变叙事视角”和“强化故事结局”分别由视角与结局锁定项阻断，文本差异、当前保护和裁决同步更新。
- 文本明确标注为抽象片段，不是真实作者作品；机制裁决不等同 AI 来源鉴定。
- 证据：`references/qa/v10/humanizer-desktop.png`、`references/qa/v10/humanizer-ultrawide.png`、`references/qa/v10/humanizer-mobile.png`。

### v10 实现门

- 320、390、768、1280、1440、1920px 共 12 次页面检查全部无水平溢出。
- 快报阶段方向键、Humanizer 阶段方向键和编辑提案 Enter 键通过；所有主要状态使用原生按钮与 `aria-pressed`。
- Hallmark 移除测试通过：删除标题后，候选状态机与提案裁决关系仍可读，不存在装饰信息图。
- ESLint、TypeScript 与 Next.js production build 通过；视频仍为明确的后续共创预留。

## v11 Humanizer 联动拓扑修正（2026-08-16）

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 保护流程与当前阶段说明共享同一个 `activeStageIndex`，现被收拢进同一带边界的语义双栏；点击任一阶段，右侧原因、机制、证据与决策同步更新。
- 编辑提案、内容锁与裁决拥有独立状态，移到联动双栏下方并以“编辑保护机制”明确分区；切换提案不会再错误改变上方当前阶段。
- 桌面与超宽视口保持左右联动，窄屏按“流程 → 当前阶段 → 独立编辑机制”自然堆叠；320、390、768、1280、1440、1920px 均无水平溢出。
- 锁定参考：`references/locked/v11/03-humanizer-process-pair.png`；证据：`references/qa/v11/humanizer-desktop.png`、`references/qa/v11/humanizer-ultrawide.png`、`references/qa/v11/humanizer-mobile.png`。
- 阶段点击与编辑提案点击的状态隔离已在生产预览验证，浏览器控制台无 error / warn；ESLint 与 Next.js production build 通过。

## v12 Humanizer 内容锁案例增量（2026-08-16）

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 人物与关系、视角与距离、时间线与事件、关键对白、物件与意象、情绪曲线、结局与立场均有一组明确标注为抽象片段的“原稿事实 → 允许最小编辑 / 阻断改写”案例。
- 选锁后，当前保护、为什么锁定、对照文本和裁决原因共同变化；切换允许或阻断编辑路径不会改变当前锁定项。
- 七个锁定项在生产浏览器逐项点测，均显示对应案例与边界；320、375、414、768px 无水平溢出，控制台无 error / warn。

## v14 首页紧凑均匀三体（2026-08-17）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- v13 的固定核心与横向项目框已被用户否决；当前恢复三个圆形项目星球。
- 结构门：桌面三球必须维持 120° 等间距和共同半径，旋转前后不得出现同侧聚集或大面积失衡。
- 交互门：点击仍进入对应项目；拖动整体后按拖动方向继续匀速旋转；48rem 以下回退为静态项目列表。
- 证据：`references/qa/v14/home-desktop.png`、`home-ultrawide.png`、`home-mobile.png`；桌面三组中心点的三条边在巡航前后均为 277.1px，验证等距关系未漂移。
- 拖动后共同相位立即改变，1.7 秒后仍沿新方向继续推进；普通点击成功进入 `/work/global-opinion`。
- 桌面、超宽和移动截图均无水平溢出；移动端轨道隐藏并回退为同宽静态项目列表。

## v15 首页四星三轴公转体（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 参考：`references/locked/v15/01-home-four-project-three-axis.png`；渲染：`references/qa/v15/home-desktop.png`、`home-ultrawide.png`、`home-mobile.png`。
- 构图：生产页保持左侧个人定位与右侧空间画布；四颗真实项目星球围绕暖色中心形成上、右、左、下四向张力，三条非共面轨道明确表达共同公转坐标系。
- 差异：参考图的星球尺寸略大、姓名略靠下；生产实现保留既有站点导航与排版 token，并将星球缩至保证 1440px 与 1920px 下完整安全区的尺寸。该差异不改变阅读顺序、主体数量或交互含义。
- 运动：四星共享同一 yaw / pitch / roll 矩阵；2.4 秒巡航采样移动量分别为 1.66、15.50、12.86、14.30px，第一颗接近当前旋转轴所以位移更小，但深度与整体状态仍由同一矩阵计算。
- 拖动：一次斜向拖动松手后 1.5 秒，四星继续移动 73.70、40.71、32.23、47.75px，证明没有恢复到固定预设轨迹。
- 点击：真实指针悬停使系统暂停后点击第四颗，成功进入 `/work/regulatory-risk`；拖动阈值与普通点击语义未冲突。
- 响应式：320、375、414、768、960、1280、1440、1920px 均无水平溢出；1280×800 短屏下通过专属高度收束，标题、定位、主要 CTA、四星焦点与操作提示全部位于首屏；48rem 以下隐藏轨道与巡航，四项目按纵向静态列表完整呈现。
- 无障碍：方向键控制保留；`prefers-reduced-motion: reduce` 下 1.2 秒采样位置稳定，内容和链接仍完整可用。
- 事实：第四颗星球直接读取现有“金融监管风险监测”项目数据，不新增指标、案例状态或未经确认的主张。
- ESLint、TypeScript 与 Next.js production build 通过。

## v19 首页人物双态 × 三轴项目宇宙（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 锁定参考：`references/locked/v19/01-home-idle.png`、`02-home-reveal.png`；锁定人物：V4 Ambient 与 V5 Reveal 两张真实 RGBA 素材。
- 默认态只显示 V4 的 2.5% 环境残影；桌面精细指针进入项目画布后显示 V5，项目 hover / focus 将人物强度降到 45%，拖动时降到 8%。
- 四颗真实项目继续共享 yaw / pitch / roll；实测拖动前后四球 transform 全部变化，且 `data-plane=foreground` 同时只有一项。
- 面部安全区在实时布局阶段排斥项目中心；实体态浏览器检查未出现项目标题、强光点或前景球遮挡面部。
- 拖动后紧接的点击被抑制，正常点击进入 `/work/global-opinion`；作品页仍为 7 项、无人物媒体，跨页面逻辑未被首页资产污染。
- 移动端 390×844 回退为四张静态项目卡，人物 V4 为 12%，无水平溢出；reduced-motion 使用 V4 15% 静态态并关闭 V5 跟随。
- ESLint、TypeScript 与 Next.js production build 通过；3010 旧构建进程已替换为本次生产预览。

## v19.1 首页人物与卫星比例校正（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 人物实体态提升为右侧主视觉：宽度上限调整到 `62rem`、高度调整到画布的 `130%`，并向下校正人物中心，接近锁定参考中的人物占比。
- 四颗项目球缩至 `7.25rem–8.5rem` 的卫星尺度；图标、标题和间距同步缩放，未通过裁切或隐藏文字换取小尺寸。
- 面部与躯干使用两级动态避让；项目仍服从同一个三轴旋转矩阵，但进入人物轮廓时会被推向对应侧边，保证入口可读且不遮脸。
- 更新证据：`references/qa/v19/home-desktop-idle.png`、`home-desktop-reveal.png`、`home-ultrawide-reveal.png`、`home-mobile.png`；1672、2200 与 390px 均无水平溢出。
- ESLint、TypeScript 与 Next.js production build 通过；本轮未改项目数据、URL、拖动阈值、键盘控制或移动端静态回退。

## v19.2 首页人物显现与连续轨道校正（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- V4 常态残影从 2.5% 提升到 12%，保持低对比但无需刻意寻找；V5 实体态维持完整显现。
- 人物媒体扩大到画布高度的 144%、宽度上限 `70rem`，并整体右移到项目宇宙中心；人物 transform 固定，不再随鼠标、拖动或 settling 状态产生位移。
- 删除项目进入脸部和躯干区域时的硬坐标吸附，改为连续椭圆力场与 54ms 时间常数的逐帧插值；拖动、惯性和自动巡航共享同一渲染位置状态，避免瞬移。
- 人物安全区与人物新位置同步；最多一颗项目进入人物前层，面部始终不作为前景穿越区域。
- 更新证据：`references/qa/v19/home-desktop-idle.png`、`home-desktop-reveal.png`、`home-ultrawide-reveal.png`、`home-mobile.png`；1672、2200 与 390px 均无水平溢出，四项目入口和 `/work/global-opinion` 路由可用。
- ESLint、TypeScript 与 Next.js production build 通过；人物与轨道修改仅作用于首页 variant，作品页未加载人物素材。

## v19.3 首页四元数续行轨道与多角度验证（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 根因修正：移除真实三维投影之后的两两推开、人物椭圆力场、硬边界夹取和首页二次位置插值；四颗球现在只由一个归一化四元数姿态决定位置。
- 轨道语义：每条 SVG 路径由对应球体的当前世界坐标与当前旋转轴计算，球体始终位于自己的续行轨道；拖动改变轴向时，轨道与球体同步重算，不再出现“球与轨道各走各的”。
- 输入与惯性：横向 / 纵向 / roll 权重为 `0.1 / 0.055 / 0.0025`，惯性上限 `0.045 deg/ms`，以无回弹曲线汇入 180 秒/圈巡航；人物容器 transform 在全部交互态保持固定。
- 轨迹对照：修复前斜拖单帧最大位移 `56.8px`、方向突变接近 `178°`、最小球心距 `16.8px`；最终 1440px 常规斜拖最大单步 `5.023px`，纵拖与惯性最小球心距 `145.422px`。反向甩动只在用户实际反向时发生方向反转。
- 帧节奏：960 / 1440 / 1920px 的中位帧间隔均为 `16.7ms`；P95 分别为 `16.8 / 16.8 / 16.8ms`，三档合计仅 2 帧超过 25ms，浏览器控制台无 error。
- 交互门：拖动项目后不误导航；普通点击进入 `/work/global-opinion`；方向键单步产生 `35.786px` 可见位移；reduced-motion 700ms 采样为 `0px`。
- 响应式：375、768、960、1440、1920px 均无水平溢出；48rem 及以下保持静态纵向项目列表。
- 证据：`references/qa/v19/motion-quaternion-v3.json`、`motion-final-960.json`、`motion-final-1920.json`、`interaction-final.json` 及三档横拖 / 纵拖 / 斜拖 / 反向姿态截图。

## v20 首页人物中心三环公转（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 锁定参考：`references/locked/v20/01-home-body-centered-concept.png`；人物媒体继承 `references/locked/v20/yifan-avatar-v4-ambient.png` 与 `yifan-avatar-v5-reveal.png`，哈希与 v19 相同。
- 构图：三条不同法向轨道的共同中心落在人物胸腹；四项目分别占据左上、右上、左下、右下，画面重心不再脱离人物。
- 运动：每个项目使用连续累计相位与绑定轨道；取消 `±180°` 相位重置，水平、垂直、斜向和反向甩动没有单帧瞬移。
- 遮挡：候选项目按实时深度选出唯一前景项；面部安全区将项目和高亮轨道重分配到人物后层，不改坐标、不隐藏入口。
- 固定人物：V4 / V5 共用同一容器与 transform，交互仅改变 opacity；人物不跟随指针和拖动漂移。
- 首帧：未完成客户端布局前使用四象限静态回退位置，避免四个真实链接短暂堆叠在中心。
- 响应式：1672×941、2200×1200 与 390×844 证据无水平溢出；48rem 以下为静态纵向项目列表。
- 性能：1440×900 中位帧间隔 `16.7ms`，P95 `16.8ms`，0 帧超过 `25ms`；巡航最小球心距 `203.712px`。
- 工程证据：`references/qa/v20/`、`references/qa/v19/motion-body-centered-v20-final.json`、ESLint、Next.js production build 与项目点击路由。

## v21 首页人物中心单轴公转（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 用户锁定纠偏：取消首页三轴 / 三环，四项目只沿一条斜向三维轨道围绕固定人物运行；三条可见线只是同一平面的主轨与回声线，不承载独立运动；作品页七项目球面宇宙不受影响。
- 空间真相：四颗球只共享一个连续相位，项目间相位不因拖动、惯性或巡航改变；没有屏幕空间推开、换轨、位置夹取或 pitch / roll 混入。
- 透视：同一 Z 值驱动投影、尺度、透明度和层级；后半圈球在人物下层、前半圈球在人物上层，不再用“只选一颗前景”的旧规则或数量配额改写真实深度。
- 内容：30 个角度 × 4 项检查中，图标、编号 / 类别、完整短标题和“查看项目”全部可见且位于球体边界内；没有行数截断、入口裁切或星球相互重叠，最终生产构建最小球心距为 `228.007px`。
- 人物：V4 / V5 SHA-256 与 v19 / v20 相同；30 个角度采样中人物边界框零位移，轨道整体下移到胸腹与腰部，避免项目经过面部。
- 透明态密度：V5 未显现时四颗球采用接近等距的均衡相位并连续放大约 15%，生产截图球体宽度约为 `169.568–218.577px`；最右侧项目保留安全边距，同平面轨道带同时提高基线可见度。人物完全显现时项目平滑回到标准尺度，不改变轨迹与深度层。
- 首屏文案：按用户确认移除“AI 应用产品运营”，保留“AI Skill / Agent 工作流搭建”和“Vibe Coding 交付”；未新增任何替代头衔。
- 运动：1440×900 中位帧间隔 `16.7ms`、P95 `16.8ms`、0 帧超过 `25ms`；水平、垂直、斜向与反向甩动均沿同一相位继续惯性。
- 交互：方向键产生 `95.835px` 可见步进；拖动项目后不误导航；普通点击进入 `/work/global-opinion`；reduced-motion 700ms 位移为 `0px`。
- 响应式：375、768、960、1440、1920px 均无水平溢出；48rem 以下保持静态纵向项目列表。
- 证据：`references/qa/v21/`、`docs/reference-production-plan-v21-home-single-orbit.md`、ESLint 与 Next.js production build。

## v22 首页五项目单轴宇宙（2026-08-18）

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 首页精选从四项扩为五项；新增第五项复用既有 `humanizer` 数据、Pen 图标和 `/work/humanizer` 路由，没有复制项目事实。
- 首页编号采用独立的 `01–05` 展示序列；作品宇宙和详情页仍使用项目自身编号，两个信息层级互不污染。
- 五颗球以 72° 等相位共享单一连续相位；人物安全区通过共同相位偏移和轨道纵向构图实现，没有给单颗球增加独立轨迹或屏幕空间推开。
- 30 个角度采样中项目重叠最大值为 `0`、最小球心距 `248.937px`、前景同时最多 `1` 颗；五条项目路由唯一，Humanizer 路由存在。
- 项目内容检查覆盖图标、首页编号 / 类别、完整标题与入口，全部位于球体内；人物边界框在 30 个角度中保持固定。
- 375、768、960、1440、1920px 均无水平溢出；移动端为五张静态纵向项目卡，reduced-motion 700ms 位移为 `0px`。
- 1440×900 帧节奏中位数 `16.7ms`、P95 `16.8ms`、0 帧超过 25ms；巡航和拖动浏览器控制台无 error。
- 证据：`references/qa/v22/`、`docs/reference-production-plan-v22-home-five-project-single-orbit.md`、ESLint 与 Next.js production build。

## v23 正式投递版保真账本（2026-08-19）

<!-- identity-section:home-idle status=pass -->
<!-- identity-section:home-reveal status=pass -->
<!-- identity-section:work-universe status=pass -->
<!-- identity-section:career-trajectory status=pass -->
<!-- identity-section:notes-signal status=pass -->
<!-- identity-section:article-reliability status=pass -->
<!-- identity-section:profile-capability-system status=pass -->
<!-- identity-section:responsive-navigation status=pass -->
<!-- identity-section:project-global-opinion-mast status=pass -->
<!-- identity-section:project-global-opinion-workbench status=pass -->
<!-- identity-section:project-sales-copilot-mast status=pass -->
<!-- identity-section:project-sales-copilot-workbench status=pass -->
<!-- identity-section:project-docs-site-mast status=pass -->
<!-- identity-section:project-docs-site-workbench status=pass -->
<!-- identity-section:project-regulatory-risk-mast status=pass -->
<!-- identity-section:project-regulatory-risk-workbench status=pass -->
<!-- identity-section:project-tender-cleaner-mast status=pass -->
<!-- identity-section:project-tender-cleaner-workbench status=pass -->
<!-- identity-section:project-hot-news-brief-mast status=pass -->
<!-- identity-section:project-hot-news-brief-workbench status=pass -->
<!-- identity-section:project-humanizer-mast status=pass -->
<!-- identity-section:project-humanizer-workbench status=pass -->

- 22 个 section 全部引用 v23 adoption reference，并具备 `1672×941`、`2200×1200`、`390×844` 三类独立捕获。
- 响应式导航、联系弹层、七条项目事实轨、七个无字幕视频和七个工作台状态均有自动化与目视证据。
- Hallmark 复核：保留个人证据优先的深空体系，没有新增卡片墙、玻璃拟态、渐变标题、伪浏览器外壳或无职责动效。
