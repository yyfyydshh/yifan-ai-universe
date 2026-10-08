# World v2 保真账本

当前锁定基线为 references/locked/world-v2。以完整卡通世界和内容框架为本轮交付；旧v23账本已另存，不继承其通过状态。

依据：44状态三视口、105手机原宽切片与独立视觉审查；受影响33项交互回归、lint、普通/静态构建、7媒体检查已实际执行。原始记录与性能限制见 world-validation.md。

主场景原生1536×1024，不宣称4K。DPR2/最大缩放会显露统一采样的细节上限；保真通过表示本次参考与构图一致，不表示无限放大清晰。

## 逐状态记录

### home — pass
<!-- identity-section:home status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：连续七区底板、成年卡通人物与奶牛猫；取消栏杆穿插。背景与演员约0.96纹素/逻辑单位，手机独立旅程；1024启动入口置于底部避免标牌。
- 证据：qa/world/final/desktop/home.png、ultrawide/home.png、mobile/home.png；独立审查对应同名状态。

### home-night — pass
<!-- identity-section:home-night status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：独立夜空、岛面着色和灯光；DOM文字保持纸面配色，夜间相机/骰子内部线条保持深色，完整手机旅程可达七区。
- 证据：qa/world/final/desktop/home-night.png、ultrawide/home-night.png、mobile/home-night.png；独立审查对应同名状态。

### home-greeting — pass
<!-- identity-section:home-greeting status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：人物挥手状态保持脚落点，鼠标悬停不显示矩形；点击反馈位于底部，资料入口独立。手机支持轻触。
- 证据：qa/world/final/desktop/home-greeting.png、ultrawide/home-greeting.png、mobile/home-greeting.png；独立审查对应同名状态。

### home-cat — pass
<!-- identity-section:home-cat status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：奶牛猫伸展、醒来、休息保持花纹和承托；反馈避开角色与标牌，手机可轻触。
- 证据：qa/world/final/desktop/home-cat.png、ultrawide/home-cat.png、mobile/home-cat.png；独立审查对应同名状态。

### voyage-work — pass
<!-- identity-section:voyage-work status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：明确第一站、前后站与进入入口；按建筑主体而非相近标牌聚焦，减少动态效果仍有手动路径。
- 证据：qa/world/final/desktop/voyage-work.png、ultrawide/voyage-work.png、mobile/voyage-work.png；独立审查对应同名状态。

### voyage-writing — pass
<!-- identity-section:voyage-writing status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：第二站内容和实际镜头均不同于工作室；未上架区域状态明确，自动漫游只在主动开启后运行。
- 证据：qa/world/final/desktop/voyage-writing.png、ultrawide/voyage-writing.png、mobile/voyage-writing.png；独立审查对应同名状态。

### directory — pass
<!-- identity-section:directory status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：七区名称、内容与可用状态明确；原生dialog、直接链接，不依赖拖动。
- 证据：qa/world/final/desktop/directory.png、ultrawide/directory.png、mobile/directory.png；独立审查对应同名状态。

### zone-preview — pass
<!-- identity-section:zone-preview status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：建筑插画与真实简介，单一进入动作；关闭/返回焦点恢复，触控目录直接进入内容。
- 证据：qa/world/final/desktop/zone-preview.png、ultrawide/zone-preview.png、mobile/zone-preview.png；独立审查对应同名状态。

### quick-profile — pass
<!-- identity-section:quick-profile status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：已确认本人角色与真实简介、经历、简历和联系路径；内容在纸面上清楚呈现。
- 证据：qa/world/final/desktop/quick-profile.png、ultrawide/quick-profile.png、mobile/quick-profile.png；独立审查对应同名状态。

### contact — pass
<!-- identity-section:contact status=pass -->

- 路径：/；参考：references/locked/world-v2/article-paper-design.png。
- 实现与核对：原联系方式和二维码，真实复制/链接动作；不把参考图片小字当内容。
- 证据：qa/world/final/desktop/contact.png、ultrawide/contact.png、mobile/contact.png；独立审查对应同名状态。

### notebook — pass
<!-- identity-section:notebook status=pass -->

- 路径：/；参考：references/locked/world-v2/article-paper-design.png。
- 实现与核对：三篇原文章逐页预览，可按标题进入真实文章，手机保留翻页。
- 证据：qa/world/final/desktop/notebook.png、ultrawide/notebook.png、mobile/notebook.png；独立审查对应同名状态。

### dice — pass
<!-- identity-section:dice status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：明确轻量彩蛋与当前结果；按钮可触摸，不冒充游戏区域已有完整作品。
- 证据：qa/world/final/desktop/dice.png、ultrawide/dice.png、mobile/dice.png；独立审查对应同名状态。

### postcard — pass
<!-- identity-section:postcard status=pass -->

- 路径：/；参考：references/locked/world-v2/world-scene-open-design.png。
- 实现与核对：本地组合插画、预览与PNG保存；不访问相机、不上传私人照片。
- 证据：qa/world/final/desktop/postcard.png、ultrawide/postcard.png、mobile/postcard.png；独立审查对应同名状态。

### studio-hover — pass
<!-- identity-section:studio-hover status=pass -->

- 路径：/work；参考：references/locked/world-v2/studio-room-integrated-design.png。
- 实现与核对：热区对应实际物件；悬停/焦点显示基础说明，物件不漂起，手机选择后给明确进入链接。
- 证据：qa/world/final/desktop/studio-hover.png、ultrawide/studio-hover.png、mobile/studio-hover.png；独立审查对应同名状态。

### studio-computer — pass
<!-- identity-section:studio-computer status=pass -->

- 路径：/work；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：电脑打开原生窗口，七图标和完整目录共用真实项目数据；焦点隔离、Escape关闭，手机滚动底部第七项目可达。
- 证据：qa/world/final/desktop/studio-computer.png、ultrawide/studio-computer.png、mobile/studio-computer.png；独立审查对应同名状态。

### work-index — pass
<!-- identity-section:work-index status=pass -->

- 路径：/work；参考：references/locked/world-v2/studio-room-integrated-design.png。
- 实现与核对：一体房间透视与真实使用关系；七件物品有承托，电脑键鼠与椅子统一朝向。手机原生横滚，最右端可达。
- 证据：qa/world/final/desktop/work-index.png、ultrawide/work-index.png、mobile/work-index.png；独立审查对应同名状态。

### writing-index — pass
<!-- identity-section:writing-index status=pass -->

- 路径：/writing；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：个人随笔开放列表与木屋插画，原文分类清楚；手机单列自然滚动。
- 证据：qa/world/final/desktop/writing-index.png、ultrawide/writing-index.png、mobile/writing-index.png；独立审查对应同名状态。

### thoughts-index — pass
<!-- identity-section:thoughts-index status=pass -->

- 路径：/thoughts；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：技术观点与方法复盘开放列表，保留原两篇文章与旧URL。
- 证据：qa/world/final/desktop/thoughts-index.png、ultrawide/thoughts-index.png、mobile/thoughts-index.png；独立审查对应同名状态。

### waiting-music — pass
<!-- identity-section:waiting-music status=pass -->

- 路径：/music；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：对应区域插画、明确待更新状态与返回已有内容的出口；同类布局统一，但不虚构作品。
- 证据：qa/world/final/desktop/waiting-music.png、ultrawide/waiting-music.png、mobile/waiting-music.png；独立审查对应同名状态。

### waiting-games — pass
<!-- identity-section:waiting-games status=pass -->

- 路径：/games；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：对应区域插画、明确待更新状态与返回已有内容的出口；同类布局统一，但不虚构作品。
- 证据：qa/world/final/desktop/waiting-games.png、ultrawide/waiting-games.png、mobile/waiting-games.png；独立审查对应同名状态。

### waiting-films — pass
<!-- identity-section:waiting-films status=pass -->

- 路径：/films；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：对应区域插画、明确待更新状态与返回已有内容的出口；同类布局统一，但不虚构作品。
- 证据：qa/world/final/desktop/waiting-films.png、ultrawide/waiting-films.png、mobile/waiting-films.png；独立审查对应同名状态。

### waiting-stuff — pass
<!-- identity-section:waiting-stuff status=pass -->

- 路径：/stuff；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：对应区域插画、明确待更新状态与返回已有内容的出口；同类布局统一，但不虚构作品。
- 证据：qa/world/final/desktop/waiting-stuff.png、ultrawide/waiting-stuff.png、mobile/waiting-stuff.png；独立审查对应同名状态。

### career — pass
<!-- identity-section:career status=pass -->

- 路径：/career；参考：references/locked/world-v2/article-paper-design.png。
- 实现与核对：真实经历与能力关系图统一纸面色彩，手机长文层级完整。
- 证据：qa/world/final/desktop/career.png、ultrawide/career.png、mobile/career.png；独立审查对应同名状态。

### profile — pass
<!-- identity-section:profile status=pass -->

- 路径：/profile；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：真实个人介绍与经历、角色肖像和联系路径，去除旧深空界面皮肤。
- 证据：qa/world/final/desktop/profile.png、ultrawide/profile.png、mobile/profile.png；独立审查对应同名状态。

### article-human-future-and-dried-fruit — pass
<!-- identity-section:article-human-future-and-dried-fruit status=pass -->

- 路径：/writing/human-future-and-dried-fruit；参考：references/locked/world-v2/article-paper-design.png。
- 实现与核对：原Markdown全文与旧URL保留；约760px纸面阅读栏，手机目录与表格可达。可靠性表格补横滑提示和最右列证据。
- 证据：qa/world/final/desktop/article-human-future-and-dried-fruit.png、ultrawide/article-human-future-and-dried-fruit.png、mobile/article-human-future-and-dried-fruit.png；独立审查对应同名状态。

### article-ai-capability-reuse — pass
<!-- identity-section:article-ai-capability-reuse status=pass -->

- 路径：/thoughts/ai-capability-reuse；参考：references/locked/world-v2/article-paper-design.png。
- 实现与核对：原Markdown全文与旧URL保留；约760px纸面阅读栏，手机目录与表格可达。可靠性表格补横滑提示和最右列证据。
- 证据：qa/world/final/desktop/article-ai-capability-reuse.png、ultrawide/article-ai-capability-reuse.png、mobile/article-ai-capability-reuse.png；独立审查对应同名状态。

### article-agent-reliability — pass
<!-- identity-section:article-agent-reliability status=pass -->

- 路径：/thoughts/agent-reliability；参考：references/locked/world-v2/article-paper-design.png。
- 实现与核对：原Markdown全文与旧URL保留；约760px纸面阅读栏，手机目录与表格可达。可靠性表格补横滑提示和最右列证据。
- 证据：qa/world/final/desktop/article-agent-reliability.png、ultrawide/article-agent-reliability.png、mobile/article-agent-reliability.png；独立审查对应同名状态。

### project-mast — pass
<!-- identity-section:project-mast status=pass -->

- 路径：/work/sales-copilot；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：真实项目标题、任务、演示与方法证据入口；不让密集技术细节抢占第一层说明。
- 证据：qa/world/final/desktop/project-mast.png、ultrawide/project-mast.png、mobile/project-mast.png；独立审查对应同名状态。

### tour-global-opinion — pass
<!-- identity-section:tour-global-opinion status=pass -->

- 路径：/work/global-opinion；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-global-opinion.png、ultrawide/tour-global-opinion.png、mobile/tour-global-opinion.png；独立审查对应同名状态。

### tour-sales-copilot — pass
<!-- identity-section:tour-sales-copilot status=pass -->

- 路径：/work/sales-copilot；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-sales-copilot.png、ultrawide/tour-sales-copilot.png、mobile/tour-sales-copilot.png；独立审查对应同名状态。

### tour-docs-system — pass
<!-- identity-section:tour-docs-system status=pass -->

- 路径：/work/docs-system；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-docs-system.png、ultrawide/tour-docs-system.png、mobile/tour-docs-system.png；独立审查对应同名状态。

### tour-regulatory-risk — pass
<!-- identity-section:tour-regulatory-risk status=pass -->

- 路径：/work/regulatory-risk；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-regulatory-risk.png、ultrawide/tour-regulatory-risk.png、mobile/tour-regulatory-risk.png；独立审查对应同名状态。

### tour-tender-cleaner — pass
<!-- identity-section:tour-tender-cleaner status=pass -->

- 路径：/work/tender-cleaner；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-tender-cleaner.png、ultrawide/tour-tender-cleaner.png、mobile/tour-tender-cleaner.png；独立审查对应同名状态。

### tour-hot-news-brief — pass
<!-- identity-section:tour-hot-news-brief status=pass -->

- 路径：/work/hot-news-brief；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-hot-news-brief.png、ultrawide/tour-hot-news-brief.png、mobile/tour-hot-news-brief.png；独立审查对应同名状态。

### tour-humanizer — pass
<!-- identity-section:tour-humanizer status=pass -->

- 路径：/work/humanizer；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。
- 证据：qa/world/final/desktop/tour-humanizer.png、ultrawide/tour-humanizer.png、mobile/tour-humanizer.png；独立审查对应同名状态。

### case-global-opinion — pass
<!-- identity-section:case-global-opinion status=pass -->

- 路径：/work/global-opinion；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-global-opinion.png、ultrawide/case-global-opinion.png、mobile/case-global-opinion.png；独立审查对应同名状态。

### case-sales-copilot — pass
<!-- identity-section:case-sales-copilot status=pass -->

- 路径：/work/sales-copilot；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-sales-copilot.png、ultrawide/case-sales-copilot.png、mobile/case-sales-copilot.png；独立审查对应同名状态。

### case-docs-system — pass
<!-- identity-section:case-docs-system status=pass -->

- 路径：/work/docs-system；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-docs-system.png、ultrawide/case-docs-system.png、mobile/case-docs-system.png；独立审查对应同名状态。

### case-regulatory-risk — pass
<!-- identity-section:case-regulatory-risk status=pass -->

- 路径：/work/regulatory-risk；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-regulatory-risk.png、ultrawide/case-regulatory-risk.png、mobile/case-regulatory-risk.png；独立审查对应同名状态。

### case-tender-cleaner — pass
<!-- identity-section:case-tender-cleaner status=pass -->

- 路径：/work/tender-cleaner；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-tender-cleaner.png、ultrawide/case-tender-cleaner.png、mobile/case-tender-cleaner.png；独立审查对应同名状态。

### case-hot-news-brief — pass
<!-- identity-section:case-hot-news-brief status=pass -->

- 路径：/work/hot-news-brief；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-hot-news-brief.png、ultrawide/case-hot-news-brief.png、mobile/case-hot-news-brief.png；独立审查对应同名状态。

### case-humanizer — pass
<!-- identity-section:case-humanizer status=pass -->

- 路径：/work/humanizer；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。
- 证据：qa/world/final/desktop/case-humanizer.png、ultrawide/case-humanizer.png、mobile/case-humanizer.png；独立审查对应同名状态。

### sample-sales-copilot — pass
<!-- identity-section:sample-sales-copilot status=pass -->

- 路径：/work/sales-copilot；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：三轮回答使样本画像和下一步发生可理解变化；选中反馈、边界及结果均可读。
- 证据：qa/world/final/desktop/sample-sales-copilot.png、ultrawide/sample-sales-copilot.png、mobile/sample-sales-copilot.png；独立审查对应同名状态。

### sample-tender-cleaner — pass
<!-- identity-section:sample-tender-cleaner status=pass -->

- 路径：/work/tender-cleaner；参考：references/locked/world-v2/project-interactive-design.png。
- 实现与核对：29字段、来源依据和空值规则清楚；补上下滚动提示，手机最末字段截图已独立检查。
- 证据：qa/world/final/desktop/sample-tender-cleaner.png、ultrawide/sample-tender-cleaner.png、mobile/sample-tender-cleaner.png；独立审查对应同名状态。
