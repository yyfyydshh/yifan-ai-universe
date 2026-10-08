export type TourStep = { title: string; copy: string; labels: string[]; note: string };
export type ProjectTourData = {
  kind: "sources" | "conversation" | "library" | "matching" | "fields" | "news" | "writing";
  heading: string;
  steps: [TourStep, TourStep, TourStep];
};

// Plain-language presentation of the existing project facts in site-data.ts.
// The diagrams show the workflow, not live records or measured outcomes.
export const projectTours: Record<string, ProjectTourData> = {
  "sales-copilot": {
    kind: "conversation", heading: "客户的一句话，怎样变成下一步行动？",
    steps: [
      { title: "从客户真实说过的话开始", copy: "读对话、纪要和客户资料，识别业务目的与数据需求。", labels: ["客户对话", "已有资料", "还没问清的事"], note: "客户没有说的内容保持未知，不把销售的猜测写成事实。" },
      { title: "边确认，边完善需求画像", copy: "把数据来源、更新频率和自动化要求理清楚，再判断适用方案。", labels: ["业务目的", "数据与频率", "自动化要求"], note: "客户每次补充，画像、MQL等级和方案路径随累计上下文刷新。" },
      { title: "带着清楚的建议，继续沟通", copy: "给出需求画像、适用方案与回复草稿，帮助销售决定接下来该问什么。", labels: ["需求画像", "适用方案", "回复建议"], note: "最终报价、承诺实施与发送回复由人完成；本页不连接实时Agent。" },
    ],
  },
  "docs-system": {
    kind: "library", heading: "一堆资料，怎样变成好用的文档站？",
    steps: [
      { title: "先整理读者要解决的问题", copy: "盘点产品资料、旧站页面和媒体，确定栏目与阅读路径。", labels: ["产品资料", "旧站页面", "图片与导航"], note: "从零搭建、旧站迁移与日常维护分别选择路径，不把所有任务塞进同一流水线。" },
      { title: "把页面接起来，再逐项检查", copy: "整理正文与图片，修复链接；在本地和真实托管环境中核对阅读体验。", labels: ["正文与图片", "导航与链接", "本地＋线上验收"], note: "格式转换成功只是中间步骤，还要检查正文完整性、媒体和关键访问路径。" },
      { title: "交付站点，也留下维护方法", copy: "保留迁移记录、检查清单和维护方法，让后续团队接得住。", labels: ["产品文档站", "迁移与维护 SOP", "检查清单"], note: "经验包已被另一条RPA产品线用于从零上线；正式发布仍需明确授权。" },
    ],
  },
  "regulatory-risk": {
    kind: "matching", heading: "一条监管消息，真的与这家公司有关吗？",
    steps: [
      { title: "先把企业和消息放到一起", copy: "读取企业画像与本轮任务导出的公开信息，明确这次判断的范围。", labels: ["企业画像", "本轮公开信息", "证据来源"], note: "只使用当前批次，避免把历史结果混进本轮判断。" },
      { title: "逐项对照，判断是否适用", copy: "对照企业情况与监管要求，区分相关、待核查和缺少依据的内容。", labels: ["对照企业情况", "核查适用条件", "定位原始证据"], note: "命中关键词不等于要求适用；处罚记录也不等于目标企业已发生同类违规。" },
      { title: "把风险、依据和下一步讲清楚", copy: "形成企业风险报告与证据清单，记录投递是准备完成、成功还是失败。", labels: ["企业风险报告", "证据清单", "投递状态"], note: "这里展示判断机制，不是实时监测，也不构成法律意见。" },
    ],
  },
  "tender-cleaner": {
    kind: "fields", heading: "一篇长公告，怎样变成能用的一行数据？",
    steps: [
      { title: "把不同格式的公告交进来", copy: "从公告正文、本地表格或已有采集任务开始，保留可核验的原始内容。", labels: ["公告正文", "本地表格", "已有采集任务"], note: "支持JSON、CSV、TSV和Excel等输入；本页样本不会上传或触发采集。" },
      { title: "找到依据，再填写29个字段", copy: "识别项目、时间和联系人，区分金额口径；没有写清的信息保持为空。", labels: ["项目与来源", "时间与金额", "主体与联系人"], note: "缺失字段不补造；单条记录异常会隔离，不拖垮其他记录。" },
      { title: "一份规范数据，一份异常说明", copy: "合并去重后输出CSV和JSON，便于筛选项目、导入系统和人工复核。", labels: ["标准 CSV", "结构化 JSON", "异常清单"], note: "固定29字段的意义是口径一致、结果可查；空值仍保留空值。" },
    ],
  },
  "hot-news-brief": {
    kind: "news", heading: "新闻很多，怎样快速抓住有依据的变化？",
    steps: [
      { title: "先定主题，再看最近七天", copy: "按主题、时间窗和目标条数检索公开新闻，把来源和日期一起留下。", labels: ["主题", "最近七日", "来源与日期"], note: "这是只读检索机制示意，不是实时新闻流或定时任务。" },
      { title: "去掉重复，也别只听一家", copy: "筛掉证据不足的条目，合并重复新闻，并平衡来源。", labels: ["核对日期", "合并重复", "平衡来源"], note: "标题、URL和日期必须来自同一记录；单个域名最多保留两条。" },
      { title: "按需要，翻看不同的快报", copy: "同一批证据可以整理成新闻清单、决策简报或选题雷达。", labels: ["新闻清单", "决策简报", "选题雷达"], note: "证据不足时减少条目或返回空结果，不为凑数补写新闻。" },
    ],
  },
  humanizer: {
    kind: "writing", heading: "让文字更自然，还能保留作者自己的声音吗？",
    steps: [
      { title: "先认识作者，再谈怎么改", copy: "阅读文学稿与作者样本，明确文本类型、文风特征和编辑边界。", labels: ["文学原稿", "作者样本", "编辑边界"], note: "仅用于文学文本；长期作者画像和单篇临时画像采用不同路径。" },
      { title: "锁住重要内容，只做必要修改", copy: "确认画像，保护人物、情节与意象，再对有依据的片段做最小编辑。", labels: ["确认文风", "锁定内容", "最小编辑"], note: "不能为了更自然而新增动机、改写剧情或改变结尾；实质漂移会阻断交付。" },
      { title: "把修改和理由，一起交给作者", copy: "另存修订稿，保留前后对照与完整性检查，让作者看见改了哪里。", labels: ["修订稿", "前后对照", "完整性审计"], note: "作者声音与内容完整性优先；启发式风险复核不是检测器分数保证。" },
    ],
  },
};
