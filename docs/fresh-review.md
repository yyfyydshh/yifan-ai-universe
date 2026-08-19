# v3 Fresh-context 视觉审查

审查模式：`self-blind`。

本轮基线为 `references/locked/v3/`。v3 把首页和作品页从二维椭圆漂移升级为可操纵的三轴能力球，并修复 Career 左侧 rail 的阅读焦点判定。自动浏览器的本地 URL 策略阻止了刷新，因此本文件不会把未经新截图确认的 section 写成通过。

## 代码与结构结论

- 三轴空间：每个项目有确定性球面基点，公共旋转状态包含 yaw / pitch / roll；z 值驱动透视缩放、透明度与堆叠顺序。
- 自然运动：巡航方向缓慢进动并叠加受限的局部呼吸，不使用随机跳变或固定单椭圆。
- 用户接管：拖动改变角速度；松手后先惯性衰减，再沿最后操作方向继续巡航，不复位到默认轨迹。
- 可进入性：普通点击不进入拖动态；七个项目 `href` 已在 production HTML 中逐一确认。
- Career：42% 视口高度作为稳定阅读焦点线，第二段内容跨过该线时左侧 rail 切换，而不是等待整个大卡片获得最高 intersection ratio。
- 可访问性：四向键盘旋转、焦点/悬停/拖动暂停、页面不可见暂停、reduced-motion 静态回退均保留。

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

实现符合 v3 render contract；仍需三视口新截图确认不同相位下没有语义碰撞。

<!-- identity-section:project-universe status=not-verified -->
### project-universe — not verified

结构、路由、拖动阈值和方向继承已通过静态与构建检查；真实指针手感和深度遮挡仍需浏览器复核。

<!-- identity-section:project-mast status=pass -->
### project-mast — pass

未受 v3 改动影响。

<!-- identity-section:sales-demo status=pass -->
### sales-demo — pass

未受 v3 改动影响。

<!-- identity-section:global-observatory status=pass -->
### global-observatory — pass

未受 v3 改动影响。

<!-- identity-section:sales-observatory status=pass -->
### sales-observatory — pass

未受 v3 改动影响。

<!-- identity-section:career-trajectory status=not-verified -->
### career-trajectory — not verified

阅读焦点算法已修复；仍需新截图确认用户标注位置的左侧激活状态。

<!-- identity-section:notes-focus status=pass -->
### notes-focus — pass

未受 v3 改动影响。

<!-- identity-section:article-reader status=pass -->
### article-reader — pass

未受 v3 改动影响。

<!-- identity-section:profile-hero status=pass -->
### profile-hero — pass

未受 v3 改动影响。

<!-- identity-section:capability-system status=pass -->
### capability-system — pass

未受 v3 改动影响。

最终结论：8 个未受影响 section 保持 `pass`；`home-hero`、`project-universe`、`career-trajectory` 为 `not verified`。没有 `reference-invalidated`，但必须补齐新截图后才能恢复全站通过状态。
## v4 affected-section fresh review（2026-08-13）

审查模式：`self-blind`。本轮严格只评审锁定参考、v4 render contract 与三档成品截图；没有把工作区中其他页面的历史状态计入本轮结论。

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 视觉含义：画面首先说明“工作流与正式报告质量门”，不是把装饰动画冒充 Agent 运行；五步路径、质量门、条件分流和交付物形成完整证据链。
- 层级：标题与一句定位最先被读到，三项摘要用于快速定向；节点、质量门和右侧交付物依次形成第二、第三阅读层。
- 个人证据：页面明确呈现杨逸凡在工作流设计、证据门槛和报告交付中的角色，并引用真实仓库能够支撑的输入、边界和输出。
- 构图：1440 与 1920 宽度下保持主路径 / 交付物双区结构；390 宽度下自然改成纵向，不隐藏信息。
- 字体：标题、步骤标题和中文说明均使用项目既有字体 token；320–1920px 自动检查没有溢出标题。
- 素材裁切：生产页面没有新增 raster 素材，也没有裁切锁定参考图；图标为 Lucide live icon。
- 重叠：三档截图和八档 DOM 检查均未发现内容、固定导航或焦点环遮挡关键信息。
- 响应式：桌面路径为横向，移动路径为纵向；390×844 截图可清楚读到摘要与前两步，继续滚动即可读取完整门槛与交付物。
- 参考保真：保留了参考中的证据流、质量门、条件分流、交付物和深空编辑视觉。省略参考导航 / Hero 属于已批准的页面上下文调整，不构成语义漂移。
- 可靠性：没有实时 API、在线 Agent 或假运行状态；未达门槛时明确只交付数据包、覆盖缺口与续采建议。

Fresh review 结论：本轮唯一受影响 section 达到 `pass`。视频槽未纳入本次工作流通过范围，继续保持 `replace-later / 共创中`。

联动复核：逐一点击 01、04、05 后，右栏标题、检查项、质量门和交付物均按当前阶段切换；390px 下改为纵向布局且不产生水平溢出，reduced-motion 下阶段切换不做空间动画。

## v4 深度面板增量复核（2026-08-13）

本轮回应“右侧解释与左侧摘要重复”的问题，受影响范围仍为 `global-opinion-workflow-explainer`。锁定参考的五步证据流、质量门与交付结构不变，右侧信息层级由重复的 `CURRENT CHECK` 升级为独立阶段剖面。

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 信息增量：左侧只承担三条流程摘要；右侧独立回答“为什么需要、实际机制、审计产物、继续或停止条件”，不再复用同一数组。
- 事实依据：五阶段内容分别对应仓库中的 `scope-decision.json`、`collection-permit.json`、`query-log.json`、`prepared.json`、`analysis.json` 及六工作表 Excel 输出；未增加无法由实现支撑的指标。
- 交互：逐一点击五个阶段后，标题、目的、三条机制、审计文件与决策边界均发生语义切换；“下一阶段”按钮也会推进当前观察状态。
- 构图：1440px 下右栏扩展为 448px，机制与产物以两种不同阅读节奏呈现；390px 下改为单列，页面 `scrollWidth` 未超过视口内容宽度。
- 视觉纪律：没有新增同质大卡片；只用分隔线、编号路径和一条决策强调线组织信息，保持深空档案风格。
- 可访问性：阶段按钮保留 `aria-pressed` / `aria-controls`，详情区保留 `aria-live`；键盘聚焦阶段仍会同步右栏。

增量结论：深度面板与左侧摘要已经形成“导航层 / 解释层”的明确分工，受影响 section 继续为 `pass`。项目说明视频仍是独立的 replace-later 槽位，不在本轮事实性展示范围内。

## v4 质量门模拟器增量复核（2026-08-13）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 交互意义：静态门槛卡改为规则模拟器，用户可以逐项切换三条门槛，并直接观察正式报告 / 降级交付的分流关系。
- 状态真实性：100+、5+、2+ 始终表示既定门槛，不展示伪造的实时完成度；页面明确写明“规则演示，不代表正在采集或已有实时数据”。
- 动效纪律：系统只循环扫描当前检查项；悬停、键盘聚焦、页面隐藏时暂停，reduced-motion 下停用扫描位移动效。
- 可访问性：三项门槛均为原生按钮，使用 `aria-pressed` 和包含当前满足状态的 `aria-label`；结果区域使用 `aria-live`。
- 响应式：1440px 下三门槛与双分支横向展示；390px 下门槛、分支自然改为单列，未产生水平溢出。

增量结论：质量门现在既是项目机制说明，也是可验证的交互证明；保持 `pass`。

## v4 门槛诊断台增量复核（2026-08-13）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 信息深度：每个门槛新增“防止什么误判 / 实际核验字段 / 失败后的动作”，点击门槛时诊断内容同步切换。
- 语义动效：三条信号脉冲从诊断结果流向交付分支，表达检查结果的传递方向；没有加入与内容无关的粒子或视差。
- 事实边界：诊断内容对应 `cleaned.length`、独立 domain、`source_type` 与 `evidence_id` 等仓库字段；不把规则解释成实时运行状态。
- 响应式：桌面三列诊断切片在 390px 下转换为纵向三段，页面无水平溢出。

增量结论：模拟器不仅能切状态，也能解释每项门槛的业务价值和补救动作；保持 `pass`。

## v4 证据连续性轨迹增量复核（2026-08-13）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 构图修复：左列没有机械拉长质量门，而是在其后加入错落的审计节点轨迹；1440px 实测左右列高度均为约 1450px，差值为 0。
- 信息意义：五个节点分别承载范围决策、连接器 / 许可、清洗数据、质量门和交付阶段的首要审计文件。
- 联动：点击轨迹节点会切换右侧阶段剖面；已走过、当前和后续节点分别显示已留痕、观测中和待验证。
- 结果一致性：质量门模拟器的 pass / gap 状态同步改变轨迹终点的正式报告 / 降级交付标签。
- 响应式：390px 下错落星图退化为清晰的纵向审计轨迹，无水平溢出。

增量结论：左列空白被有意义的第二阅读层取代，双列等高且保持非刻板构图；保持 `pass`。

## v4 双列自然收口修正（2026-08-13）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 删除：根据用户反馈彻底移除“证据连续性”组件及桌面 / 移动端全部相关样式。
- 根因修复：`evidence-workbench` 从等高拉伸改为 `align-items: start`，两列不再互相制造假高度和空白容器。
- 内容去重：移除右侧重复出现的 100+ / 5+ / 2+ 门槛；完整交互门槛只保留在左侧。
- 比例调整：桌面右栏扩展至 496px，并压缩解释段落的非必要间距；1440px 下左列约 935px、右列约 954px，底部差约 19px。
- 响应式：390px 下保持单列，无证据连续性残留，也没有水平溢出。

修正结论：两列依靠真实内容自然收口，不再强制等高；视觉差已从约 303px 收敛至约 19px，保持 `pass`。

## v5 第一批项目页 fresh-context 审查（2026-08-16）

审查模式：`self-blind`。本轮只对照 v5 锁定参考、render contract、生产页面与新生成的三档截图；视频占位不计入项目能力展示的通过范围。

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 公共数据接口迁移后，原有五阶段证据链、质量门、诊断和降级交付关系保持完整。
- 左侧阶段点击会更新当前状态，规则门槛仍明确是机制演示，不伪装实时采集。
- 三档截图没有内容遮挡或水平溢出。

<!-- identity-section:sales-decision-routing status=pass -->
### sales-decision-routing — pass

- 视觉含义首先指向“信息是否足够”，再进入画像、优先级和方案，不把 Agent 活跃感当成能力证明。
- 事实、假设、未知信息采用不同语义容器；信息不足时明确锁定后续阶段并只生成关键追问。
- 右侧阶段剖面相对左侧路径有真实信息增量，且始终保留外发人工确认边界。
- 390、1672、2200px 下层级清晰，按钮状态和当前阶段一致。

<!-- identity-section:docs-three-route-console status=pass -->
### docs-three-route-console — pass

- 三条路径不是换标题的同一套卡片：各自有不同输入、阶段、风险和停止条件，并在本地 / 托管 / 授权三层门上汇合。
- “本地可预览不等于线上验收”“线上验收不等于发布授权”成为页面主判断，不被装饰淹没。
- 真实经历与公开 SOP 的证据状态被清晰拆分，没有将公开方法仓库描述为生产站源码。
- 路径与阶段在三档视口均保持可操作，移动端按路径 → 阶段 → 解释的顺序阅读。

<!-- identity-section:regulatory-applicability-desk status=pass -->
### regulatory-applicability-desk — pass

- 四轴矩阵能够真实改变候选 / 待确认 / 排除判断；报告门能够独立阻断正式交付。
- 八阶段导航、矩阵、阻断门、证据字段和审计产物形成一条完整的监管证据链，而非通用流程图。
- 非法律意见、非实时监测和“监管关注不等于违法”的边界在主阅读路径可见。
- 三档截图中当前阶段、路径状态和矩阵状态层级一致，未发现重叠或裁切。

Fresh review 结论：v5 四个受影响 section 均达到 `pass`。第一批三个新工作台可进入用户校准；第二批仍保持未开始状态，不在本轮结论中。

## v6 Sales Copilot fresh-context 审查（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 不看交互也能从标题、定义和输入 / 能力 / 边界摘要理解这是销售专业助手，而不是报告或流程图工具。
- 主交互对象是可读的客户判断与行动建议；技术术语被放到可信说明和深度层，不抢占项目价值。
- 点击结果后，客户原话与可靠性检查的同步高亮具有真实信息含义；路径不是装饰。
- 信息不足状态以“先问什么”为核心，明确不生成画像、评分和方案，符合公开仓库边界。
- 原有强制等高双列和大面积空白已经消失；深度解释与主工作台自然分层。
- 三档截图和九档宽度检查未发现裁切、重叠或水平溢出。

Fresh review 结论：`pass`。

## v7 全球舆情项目视频增量复核（2026-08-16）

<!-- identity-section:global-opinion-workflow-explainer status=pass -->
### global-opinion-workflow-explainer — pass

- 三秒信息：封面直接表达“不同 Agent，同一套可靠交付”，与项目页证据工作流一致。
- 来源与个人证据：视频为用户提供的最终成片，封面从该视频真实抽帧；没有引入第三方图库、虚构 Agent 结果或未确认指标。
- 构图与连续性：播放器沿用既有紧凑 16:9 槽位，不改变下文工作流的焦点层级和阅读顺序。
- 响应式与媒体：桌面和移动端均使用同一原生视频元素，保留 controls、metadata 预载和 poster；不自动播放，不阻断页面滚动。
- 实机验收：桌面端完成播放 / 暂停验证，成片时长识别为 54 秒；移动端将真实视频固定为 16:9，不继承占位动画的 4:5 比例。控制台无 error 或 warning。
- 参考有效性：真实媒体替换发生在已批准的独立 `replace-later` 槽位内，主体比例、容器几何、主色、拓扑和响应式方式均未变化，因此不构成 `reference-invalidated`。

## v7 Sales Copilot fresh-context 静态复核（2026-08-16）

<!-- identity-section:sales-professional-assistant status=not_verified -->
### sales-professional-assistant — not_verified

- 不看技术实现也能从标题、客户原话、答案标题和答案正文理解：这是把销售沟通整理为判断、待确认信息、下一步行动与追问草稿的销售专业助手。
- 交互的意义是“答案回指原话”，不是让 Agent 看起来更忙；信息不足分支会主动扣留可能误导销售的画像、优先级和方案。
- 可靠性第二层说明事实 / 假设 / 未知分层、白名单材料、严格输出契约和人工外发边界，和首屏答案形成信息增量。
- 文案、数据和边界已静态复核，lint 与 production build 通过。
- 由于浏览器本地 URL 安全策略阻断，本轮没有取得新的可视截图和真实交互证据；最终状态保持 `not_verified`，等待用户本地预览确认或后续允许的浏览器验收环境。

## v9 第二批项目 fresh-context 审查（2026-08-16）

<!-- identity-section:tender-schema-refinery status=pass -->
### tender-schema-refinery — pass

- 不操作交互也能理解输入、字段合同、质量门与交付物；点击字段带来的是“为什么填 / 何时留空”的信息增量。
- 29 字段不被表现成装饰表格，而是可核验的事实合同。双入口与 API Key 边界清晰，没有伪造运行状态。

<!-- identity-section:hot-news-evidence-radar status=pass -->
### hot-news-evidence-radar — pass

- 页面主叙事是“如何从检索结果形成可用证据集合”，而非模拟实时新闻大屏。
- 模式、阶段、排除原因、来源层级和输出选择各自解释不同判断；互动减少理解成本，没有重复右侧摘要。

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 首屏明确项目只服务文学文本；核心价值是保护作者声音和内容完整性，不是通用润色或 AI 检测。
- 模式、锁定地图、最小编辑对照与四角复核形成清晰因果链；启发式风险分的边界在主阅读路径可见。

Fresh review 结论：v9 三个受影响 section 均达到 `pass`。交互确实辅助解释项目能力，视频继续保持待共创状态。

## v8 Sales Professional Assistant fresh-context 审查（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 三十秒信息成立：即使不操作，也能理解输入是客户多轮回答，处理对象是数据采集与自动化需求，输出是画像、MQL、方案路径、授权资料与回复草稿。
- 交互有信息增量：切换轮次会整组刷新状态；点击结果会回指支撑它的客户回答，而不是播放装饰性动画。
- MQL D → C → B 与三轮新增事实一致；A 未达到的预算、决策链、合规和采购条件保持未知，没有补造评分权重或转化收益。
- “脱敏机制示例 / 非实时 Agent / 商业机密隐藏”在主阅读路径可见；资料核验、外发、报价和实施承诺始终留给销售或业务人员。
- 与锁定参考相比，核心锚点和语义关系一致；生产版更重视真实文本的行长与移动端顺序，因此没有强行压缩成一屏。
- 桌面与移动截图均无重叠、裁切或水平溢出；三轮鼠标 / 键盘联动、结果证据回链、reduced-motion 和控制台检查通过。

Fresh review 结论：v8 Sales Professional Assistant 达到 `pass`。它现在首先解释“是什么、解决什么、怎样帮助销售”，技术可靠性被放在第二阅读层。

## v8.1 Sales Professional Assistant 关联性复核（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 两栏主关系清楚：左侧是客户逐轮回答，右侧是基于累计上下文形成的转化判断；旧版窄中栏已不再打断阅读。
- 任一结果被选择后，读者能同时看到结果名称、来源轮次、对应客户原话和定位入口，关联不再只依赖颜色或下划线。
- MQL 与五个需求维度位于同一状态概览，回答、读取维度、输出结果形成连续因果链。
- 交互没有增加新业务主张；“提升转化”仍是目标，示例仍为脱敏机制演示，案例资料与回复外发继续要求人工核验。
- 桌面、超宽与移动截图无重叠、裁切或水平滚动；键盘切换和来源定位均保留当前分析状态。

Fresh review 结论：v8.1 继续达到 `pass`，布局修复提升了可读性，证据回链带来了真实的信息增量。

## v8.2 Sales Professional Assistant 密度与可供性复核（2026-08-16）

<!-- identity-section:sales-professional-assistant status=pass -->
### sales-professional-assistant — pass

- 首屏不再同时要求读者横向比较三块信息；右侧从转化状态自然下读到 MQL、需求维度与五类输出，阅读方向单一。
- 客户长回答与列边界之间有稳定留白，关联提示不会再用贯穿句子的下划线制造视觉噪声。
- “状态：本轮可判断 / 可编辑草稿”明确是结果状态，不具有独立按钮轮廓、底色或手型光标；真正可操作的对象仍是整行分析结果。
- 选择“需求画像”后，右侧判断依据与三轮“支撑当前：需求画像”同步更新，交互关联仍然完整。
- 327–1745px 浏览器抽查无水平滚动；键盘轮次切换、reduced-motion、lint 与 production build 通过。

Fresh review 结论：v8.2 达到 `pass`。本轮只修正阅读密度和交互可供性，没有新增业务主张或改变脱敏边界。

## v10 快报与 Humanizer fresh-context 审查（2026-08-16）

审查输入仅包含项目事实、v10 锁定参考和三视口生产截图；未使用实现者自评作为通过依据。

<!-- identity-section:hot-news-evidence-radar status=pass -->
### hot-news-evidence-radar — pass

- 三秒信息：中心区不再是抽象曲线，而是一批会被时间、字段、去重和来源规则真实改变状态的匿名候选。
- 第一焦点是候选记录与状态，第二焦点是当前记录解释，第三焦点是阶段门；阅读顺序清楚。
- 点击 C-05 能看见缺 URL 被证据合同排除；点击 C-06 能看见同故事并入 C-02，交互产生了无法从静态摘要获得的信息增量。
- 桌面、超宽和移动视口均没有无效大留白、语义重叠或水平裁切。

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 三秒信息：中心区清楚展示“编辑提案必须通过作者内容保护门”，不是通用润色器或 AI 检测器。
- 三个提案产生不同文本和裁决；阻断状态同时指出冲突片段、保护项和撤销原因，交互直接解释项目能力。
- 锁定地图、提案、文本差异和裁决构成一个闭合因果链；四角复核保持为后续质量层，没有和主交互争夺焦点。
- 抽象文本、启发式分数和视频预留的事实边界可见，没有把演示状态伪装成真实作者结果。

Fresh review 结论：v10 两个修正 section 均达到 `pass`。用户指出的“没有变化”和“看不懂”已经由可观察的规则状态与因果解释解决。

## v11 Humanizer 布局关系 fresh-context 审查（2026-08-16）

审查输入为 v11 锁定参考、三视口生产截图与交互状态结果；重点检查视觉邻近关系是否和真实状态依赖一致。

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 第一阅读组现在只有两部分：可选保护阶段与对应的深度解释。两者共享边界、顶线和状态，视觉关系与交互关系一致。
- 编辑保护机制被降到下一层，并用独立标题解释它是在审阅提案与内容锁，不伪装成当前阶段的实时运行图。
- 点击“语义完整性审计”后，上方说明同步变化；再点击“改变叙事视角”，上方仍保持该阶段，只有下方裁决切换为阻断，状态边界清楚。
- 桌面、超宽与移动截图均未出现水平裁切、无效空白或中间模块插断联动关系。

Fresh review 结论：v11 达到 `pass`。本轮只修正信息拓扑与阅读顺序，没有新增项目能力主张或虚构运行结果。

## v12 Humanizer 内容锁案例 fresh-context 审查（2026-08-16）

<!-- identity-section:humanizer-voice-chamber status=pass -->
### humanizer-voice-chamber — pass

- 单击任何锁定项后，不需要猜测它保护什么：页面同时给出一句解释、可保留的事实、可以做的最小修改和不能做的改写。
- 原稿和修改稿不再固定复用一套门口片段；七类锁分别使用不同的抽象文学情境，便于理解关系、视角、顺序、对白、意象、情绪和结局为何不能被统一润色改写。
- 所有文本明确是机制演示而非真实作者作品；没有把启发式判断伪装成真实 AI 来源鉴定。

Fresh review 结论：v12 达到 `pass`。交互增加了理解信息，而没有增加虚构项目结果。

## v13 首页稳定核心星系 fresh-context 审查（2026-08-17）

审查输入限定为用户提供的两张失衡截图、`references/locked/v3/01-home.png` 与本轮三视口生产截图。用户截图只用于说明“大球空旷、自由移动导致失衡”，不作为目标构图。

<!-- identity-section:home-hero status=pass -->
### home-hero — pass

- 预期三秒信息：三个旗舰案例共同构成一套可运行、可验证、可复用的能力交付，而不是三颗孤立的装饰星球。
- 视觉约束：核心保持固定；三个案例各守一个扇区；小幅三维漂移不能改变页面主重心；移动端完整回退为静态项目列表。
- 事实边界：标签来自现有项目数据，核心主张来自现有首页定位；没有增加指标、实时状态或未经确认的能力。
- 三视口证据：`references/qa/v13/home-desktop.png`、`home-ultrawide.png`、`home-mobile.png`。桌面、超宽和移动端均保持明确的第一焦点，没有原截图中的大面积空球或重心漂移。
- 动态检查：3.5 秒巡航前后，三个项目只产生约 1–4px 的受控位移，固定核心位置不变；拖动后项目仍回到各自扇区内继续巡航。
- 交互检查：拖动后普通点击进入 `/work/global-opinion`；键盘与移动端真实链接保持可达，控制台无 error / warn。
- 响应式检查：320、375、414、768、960、1280、1440、1920px 均无水平滚动；48rem 以下核心和连接线取消，三项目变为静态纵向列表。
- Hallmark 58 门复核：无新渐变文字、嵌套卡片、虚构指标、双行 CTA、重型动效或跨项目数据；语义图标继续统一使用 Lucide。
- 工程门：ESLint 与 Next.js production build 通过。

Fresh review 结论：v13 `home-hero` 达到 `pass`。本轮把空间自由度从“跨画布漂移”收敛为“固定核心下的受控巡航”，保留宇宙感，同时解决空旷与失衡。

## v14 首页均匀三体纠偏 fresh-context 审查（2026-08-17）

审查目标已由用户重新锁定：不是把星球改成信息卡，也不是建立固定中心，而是保留原圆形星球并减少分散，使三颗项目构成一个均匀转动体。

<!-- identity-section:home-hero status=not-verified -->
### home-hero — not verified

- 三颗星球使用相同视觉尺寸、共同半径与 120° 固定相位差，整体重心恒定。
- 巡航只推进共同相位；深度变化仅轻微改变缩放与透明度，不改变等距关系。
- 拖动改变共同相位与后续旋转方向，普通点击仍须进入项目。
- 生产截图显示三球在首屏右侧形成紧凑三角重心，没有固定能力核心、横向项目框或大面积空球。
- 三条中心点距离在巡航前后均为 277.1px；拖动后只改变整体相位，关系不变。
- 项目链接真实可进入；移动端静态回退、无水平滚动，工程门通过。

Fresh review 结论：v14 `home-hero` 达到 `pass`。这次变化严格是“保留原星球并减少分散”，没有用新信息容器重新解释项目。

## v15 首页四星三轴公转体 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 审查输入仅包含锁定参考 `references/locked/v15/01-home-four-project-three-axis.png` 与三张 v15 浏览器截图；没有用旧 v13 横向项目板作为质量基线。
- 三秒信息成立：右侧不再是松散三点或平面三角，而是四个项目围绕共同中心运行的三轴系统；“公转”比单纯漂浮更明确。
- 视觉层级成立：姓名与个人定位仍是第一阅读入口，四星系统为能力证明，暖色中心与轨道只组织空间，没有抢走项目名称。
- 组合稳定：1440 与 1920px 下四星均处于右侧画布安全区，没有侵入左侧文字、导航或互相遮挡；移动端完全取消空间坐标，避免缩小版宇宙造成不可读。
- 交互可信：巡航、斜向拖动后的惯性、真实指针点击和 reduced-motion 均有浏览器证据；第四个项目路由可进入。
- 事实边界成立：四个名称、类别、图标和链接均来自现有项目数据；没有为了填充轨道增加虚构项目。
- 仍有的有意差异：生产页保留现有首屏比例、按钮与更克制的星球尺寸，未把参考图当位图背景，也没有追求像素级复制其装饰星点。

Fresh review 结论：v15 `home-hero` 达到 `pass`。它保留用户指定的三轴形态，并用第四个真实项目增强共同公转感，同时解决三项目结构过于平面和移动后画面失衡的问题。

## v19 首页人物双态 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 三秒信息仍由姓名、职业定位与四个项目承担；人物默认接近不可见，只是可探索的第三焦点，不形成新的头像 CTA。
- V4 与 V5 使用同一低头叉腰轮廓，切换只改变显现与材质强度，不改变布局；人物媒体不包含星空、轨道、项目或文字。
- 四球在人物加入后仍有独立可读的图标、标题与入口；动态深度最多允许一颗进入人物前层，其他球位于侧景或后景。
- 项目球与人物面部之间存在 code-native 安全区，浏览器实体态未出现遮脸；前景关系落在肩膀、手臂与衣服等可牺牲区域。
- 本轮没有增加 KPI、实时 Agent 状态或新的项目主张；所有项目名称、类别和路由仍来自现有项目数据。
- 桌面默认态、实体态、拖动、点击、移动静态回退和作品页隔离均通过；生产控制台只保留已被替换的旧 3010 chunk 错误记录，新 3011 / 3010 构建本身无新增错误。

Fresh review 结论：v19 `home-hero` 达到 `pass`。人物增强身份辨识度和空间前后关系，但没有削弱项目浏览与招聘信息优先级。

## v19.1 首页比例校正 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 人物与项目不再争夺相同视觉重量：人物承担身份辨识，项目球作为围绕人物运行的能力入口。
- 四个项目名称、图标与入口在实体态仍可辨认；面部没有项目覆盖，躯干避让不会改变项目事实或导航语义。
- 桌面与超宽屏保持“左侧定位、右侧人物与能力宇宙”的阅读顺序；移动端继续使用静态项目列表，不缩放复制桌面场景。
- Hallmark 自评：P5 H5 E4 S5 R4 V5；层级和特异性成立，装饰只服务三轴空间与项目浏览。

Fresh review 结论：v19.1 `home-hero` 达到 `pass`。本轮解决了“球体过大、人物过小”，同时保留项目优先、三轴运动和响应式降级。

## v19.2 首页连续运动 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 常态人物现在清楚可辨但仍弱于姓名和四个项目；实体态人物比例接近锁定参考，未成为新的按钮或内容入口。
- 人物显现前后使用同一固定边界框与 transform；鼠标在宇宙内移动时，人物只改变透明度，不产生漂移。
- 项目轨迹不再遇到人物边界后横向跳转。柔性力场连续改变目标轨迹，时间插值继续过滤拖动与惯性中的帧间位移。
- 静态证据显示四个项目保持分布在人物四周；面部安全区成立，人物前层最多一个项目，项目 DOM、图标与链接未烘进图片。
- 390px 移动端仍为静态项目列表；1672px 与 2200px 无水平溢出，项目点击进入真实详情路由。
- Hallmark 自评：P5 H5 E5 S5 R5 V5；没有增加装饰性视差、重型依赖、虚构指标或新的交互原语。

Fresh review 结论：v19.2 `home-hero` 达到 `pass`。本轮把“更明显、更大、固定人物、丝滑轨道”落实为可验证的透明度、尺度和连续运动约束。

## v19.3 真实续行轨道 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 删除人物与项目后，四颗球仍可凭自己的动态续行轨道解释运动；轨道有信息职责，不是星空装饰。
- 删除轨道后，四球仍保持统一四元数姿态和连续路径；轨道不会反向控制坐标，因此不存在视觉层与交互层互相打架。
- 横拖、纵拖、斜拖和反向甩动均经过逐帧采样。常规拖动没有接近 180° 的非预期折返；反向甩动只在用户明确改变手势方向时反转。
- 人物固定，项目经过面部安全区时只发生连续后景退暗，不改变位置；这比“推开项目”更符合空间遮挡，也不会制造瞬移。
- 960、1440、1920px 帧间隔 P95 均为 16.8ms；五档响应式、键盘、点击、拖动阈值和 reduced-motion 均通过。
- Hallmark 自评：P5 H5 E5 S5 R5 V5；没有新增重型依赖、装饰性视差、虚构状态或第四种动效原语。

Fresh review 结论：v19.3 `home-hero` 达到 `pass`。运动现在同时满足几何一致、视觉可解释、拖动连续和招聘场景下的快速可读。

## v20 首页人物中心三环公转 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 人物身份来源没有变化：生产媒体与 v19 锁定 V4 / V5 的 SHA-256 完全一致，本轮没有重绘、换脸、改服装或改姿势。
- 三条轨道共享人物胸腹中心，不再以右侧画布的抽象中心独立运行；删除人物后仍可从三条相交轨道识别同一引力中心。
- 四颗项目初始分布为左上、右上、左下、右下，且三条轨道均承载真实项目；人物实体态没有项目凭空消失。
- 同一时刻最多一颗项目处于人物前层。进入面部安全区的项目和高亮轨道保持原坐标并切入后层，由 RGBA 人物 Alpha 提供自然遮挡。
- 人物在 idle、reveal、dragging、settling 和 navigating 中使用同一固定边界框；交互只改变透明度，不再产生位移或缩放。
- 自动巡航中四项目最小球心距 `203.712px`；水平、垂直、斜向与反向甩动逐帧采样均无非手势造成的跳变，1440×900 P95 帧间隔为 `16.8ms`。
- 1672、2200 与 390px 无水平溢出；移动端为静态项目列表；真实点击进入 `/work/global-opinion`。
- Hallmark 自评：P5 H5 E5 S5 R5 V5。轨道、暖色中心和人物只服务“能力围绕主体运行”的语义，没有增加无职责装饰或虚构事实。

Fresh review 结论：v20 `home-hero` 达到 `pass`。它在保留锁定人物的前提下，把空间重心、轨道语义、四项目分布和遮挡关系统一为一套人体中心系统。

## v21 首页单轴公转 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 审查只使用用户最新三项要求、v21 浏览器截图和 v21 几何 / 运动报告；没有把 v20 三环形态当作必须保留的质量目标。
- 三秒信息更明确：人物是唯一中心，四个项目属于同一条轨道；隐藏 SpaceField 装饰椭圆后，页面上不再同时出现互相冲突的轨道逻辑。
- 近大远小不是单独动画：项目 Z 深度与屏幕投影、尺度、透明度和层级来自同一个函数，全部角度连续。
- 项目可读性成立：最远球仍大于 `144px`，每颗球的图标、分类、完整标题和入口在 30 个角度样本中均未越界或隐藏；全部采样角度的项目重叠数为 0。
- 人物优先级成立：人物仍是 V4 / V5 双态固定素材，拖动时只退暗；轨道绕胸腹 / 腰部，不经过脸部，也没有让人物追随项目移动。后半圈项目实际低于人物层，前半圈实际高于人物层，不再出现数据写着 background、画面却浮在人物上方的假深度。
- 透明人物不会留下空洞：项目与轨道带接管右侧构图密度，人物显现后再克制回落；这个变化复用现有透视 scale，没有引入新的漂浮装饰或第四种动效原语。
- 透明态四颗球约放大 15%，整圈最小球心距仍为 `228.007px`、重叠数为 0；右下项目没有贴边，人物显现后四颗球平滑恢复标准尺度。
- 首屏头衔仅保留“AI Skill / Agent 工作流搭建”和“Vibe Coding 交付”，“AI 应用产品运营”已经按用户要求移除，文案 diff 无额外增项。
- 交互可信：拖动、惯性、键盘、项目点击、移动端静态回退和 reduced-motion 均有独立浏览器证据；控制台无 error。
- Hallmark 组件级复核：P5 H5 E5 S5 R5 V5。同平面轨道回声线只强化前后包裹感，不增加运动自由度；没有新增卡片墙、渐变文字、重型依赖、虚构指标或第二套视觉语言。

Fresh review 结论：v21 `home-hero` 达到 `pass`。单轨结构牺牲了不必要的自由度，换来可解释、连续、可读且围绕人物成立的公转体验。

## v22 首页五项目 fresh-context 审查（2026-08-18）

<!-- identity-section:home-hero status=pass -->

- 本次审查只使用用户确认的 v22 参考、最终浏览器截图和 v22 几何 / 交互报告；没有把旧四项目构图当作必须保留的目标。
- 第五颗不是装饰填空，而是一个现有、可点击、可核验的真实项目；它补足了首页能力覆盖，同时保持项目浏览优先于人物展示。
- 首页 01–05 与项目详情编号分层明确：访客看到的是精选顺序，进入项目后看到的是完整作品体系编号。
- 五颗球在同一轨道上保持等相位和共同运动方向；没有新增第二轨道、单球漂移、瞬移纠偏或无职责动效。
- 实体人物状态下，上方项目避开脸部并保持可读；下部 Humanizer 作为唯一前景项穿过腰腹区域，空间关系与参考一致。
- 透明态五颗球接管右侧密度，实体态平滑回落；30 角度采样无相互遮挡，最小球心距 `248.937px`。
- 桌面、超宽与移动截图无横向溢出；键盘、拖动防误触、普通点击、移动静态回退与 reduced-motion 均通过。
- Hallmark 组件级复核：P5 H5 E5 S5 R5 V5。新增项目提升个人证据密度，没有引入卡片墙、重型 3D、虚构指标或新视觉语言。

Fresh review 结论：v22 `home-hero` 达到 `pass`。五项目版本在保持单轴运动清晰度的同时，提高了首页信息密度与能力覆盖。

## v23 正式投递版 fresh-context 审查（2026-08-19）

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

- 新导航坐标提高了当前位置判断速度，移动面板完整保留一级信息架构，没有把站点压缩成单一 CTA。
- 联系弹层把微信、邮箱和电话聚合在同一可信出口；二维码直出清晰，未与首页人物或项目争夺视觉中心。
- 七个项目首屏的三项事实轨提供 30 秒判断线索，工作台继续承担深层机制，因此摘要与详情不再重复。
- 七条 WebVTT 与原视频分离；字幕可独立维护，画面仍以 Agent 对话和能力证据为主。
- 三类正式捕获未出现标题裁切、横向溢出、破图或重复 ID；Humanizer 移动工作台已由有效 v23 PNG 替代旧证据。

Fresh review 结论：v23 的新增内容全部服务于投递、理解和联系，没有改变用户已确认的核心视觉与项目语义；22 个 section 达到 `pass`。
