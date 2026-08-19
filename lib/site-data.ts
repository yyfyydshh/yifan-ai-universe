export type ProjectIconName = "globe" | "target" | "book" | "shield" | "table" | "radio" | "pen";

export type ProjectVisualMode =
  | "evidence-orbit"
  | "routing-flow"
  | "knowledge-system"
  | "risk-gate"
  | "schema-table"
  | "broadcast-pulse"
  | "editorial-audit";

export type ProjectDemo = {
  src?: string;
  poster?: string;
  description?: string;
};

export type ProjectEvidenceStepKey = "scope" | "collect" | "audit" | "gate" | "deliver";

export type ProjectEvidenceStep = {
  key: ProjectEvidenceStepKey;
  title: string;
  details: string[];
  depth: {
    purpose: string;
    mechanism: string[];
    artifacts: Array<{ name: string; role: string }>;
    decision: string;
  };
};

export type ProjectEvidence = {
  visualKind: "global-evidence";
  evidenceStatus: string;
  title: string;
  intro: string;
  summary: Array<{ label: string; value: string }>;
  steps: ProjectEvidenceStep[];
  gates: Array<{
    value: string;
    label: string;
    prevents: string;
    verifies: string;
    fallback: string;
  }>;
  branches: { met: string; unmet: string };
  deliverables: Array<{ kind: "excel" | "markdown" | "html"; title: string }>;
  boundary: string;
};

export type CaseStudyDepth = {
  purpose: string;
  mechanism: string[];
  artifacts: Array<{ name: string; role: string }>;
  decision: string;
};

export type CaseStudyStage = {
  id: string;
  title: string;
  short: string;
  depth: CaseStudyDepth;
};

export type SalesCaseStudy = {
  visualKind: "sales-conversion";
  evidenceStatus: string;
  title: string;
  intro: string;
  demoLabel: string;
  confidentiality: string;
  dimensions: Array<{
    id: "industry" | "data" | "cadence" | "automation" | "integration";
    label: string;
    detail: string;
    reachedAt: number;
  }>;
  mqlLevels: Array<{
    level: "D" | "C" | "B" | "A";
    label: string;
  }>;
  turns: Array<{
    id: string;
    messageId: string;
    label: string;
    reply: string;
    tag: string;
    contextSummary: string;
    newFacts: string[];
    unknowns: string[];
    changeReason: string;
    mql: {
      level: "D" | "C" | "B";
      label: string;
      missingForA: string[];
    };
    outputs: Array<{
      id: "profile" | "mql" | "solution" | "materials" | "reply";
      title: string;
      value: string;
      rationale: string;
      sourceIds: string[];
      status: "ready" | "partial" | "withheld" | "draft";
      steps?: string[];
    }>;
  }>;
  humanBoundary: string;
  implementation: Array<{ title: string; detail: string; evidence: string }>;
  sources: Array<{ label: string; value: string }>;
  boundary: string;
};

export type DocsCaseStudy = {
  visualKind: "docs-routes";
  evidenceStatus: string;
  title: string;
  intro: string;
  summary: Array<{ label: string; value: string }>;
  routes: Array<{
    id: "zero" | "migration" | "maintenance";
    label: string;
    brief: string;
    stages: CaseStudyStage[];
  }>;
  acceptance: Array<{ title: string; check: string }>;
  deliverables: string[];
  sources: Array<{ label: string; value: string }>;
  boundary: string;
};

export type RegulatoryCaseStudy = {
  visualKind: "regulatory-applicability";
  evidenceStatus: string;
  title: string;
  intro: string;
  summary: Array<{ label: string; value: string }>;
  stages: CaseStudyStage[];
  axes: Array<{ label: string; question: string }>;
  guards: Array<{ label: string; reason: string }>;
  proofFields: string[];
  artifacts: Array<{ name: string; role: string }>;
  boundary: string;
};

export type TenderCaseStudy = {
  visualKind: "tender-schema-refinery";
  evidenceStatus: string;
  title: string;
  intro: string;
  summary: Array<{ label: string; value: string }>;
  inputModes: Array<{ id: "files" | "tasks"; label: string; note: string; details: string[] }>;
  fieldGroups: Array<{ id: string; label: string; range: string; fields: string[] }>;
  fieldDetails: Array<{ id: string; label: string; groupId: string; evidence: string; rule: string; blank: string }>;
  stages: CaseStudyStage[];
  checks: Array<{ label: string; detail: string }>;
  deliverables: Array<{ label: string; detail: string }>;
  boundary: string;
};

export type HotNewsCaseStudy = {
  visualKind: "hot-news-evidence-radar";
  evidenceStatus: string;
  title: string;
  intro: string;
  summary: Array<{ label: string; value: string }>;
  searchModes: Array<{ id: "fast" | "deep"; label: string; note: string; queryCount: number }>;
  stages: CaseStudyStage[];
  sourceTiers: Array<{ label: string; role: string }>;
  exclusions: Array<{ reason: string; treatment: string }>;
  outputModes: Array<{ id: "news" | "decision" | "radar" | "both"; label: string; detail: string }>;
  boundary: string;
};

export type HumanizerCaseStudy = {
  visualKind: "humanizer-voice-chamber";
  evidenceStatus: string;
  title: string;
  intro: string;
  summary: Array<{ label: string; value: string }>;
  modes: Array<{ id: "steady" | "single"; label: string; note: string; requirements: string[] }>;
  stages: CaseStudyStage[];
  locks: Array<{ id: string; label: string; protects: string }>;
  reviewers: Array<{ id: string; label: string; focus: string }>;
  deliverables: Array<{ label: string; detail: string }>;
  boundary: string;
};

export type ProjectCaseStudy =
  | ProjectEvidence
  | SalesCaseStudy
  | DocsCaseStudy
  | RegulatoryCaseStudy
  | TenderCaseStudy
  | HotNewsCaseStudy
  | HumanizerCaseStudy;

export type Project = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  category: "核心系统" | "专业 Skill" | "实验项目";
  tagline: string;
  mastFacts: {
    input: string;
    judgment: string;
    output: string;
  };
  problem: string;
  judgment: string;
  system: string[];
  reliability: string[];
  outputs: string[];
  reuse: string;
  tags: string[];
  github: string;
  orbit: "hero" | "focus" | "satellite";
  icon: ProjectIconName;
  visualMode: ProjectVisualMode;
  demo?: ProjectDemo;
  caseStudy?: ProjectCaseStudy;
};

export const projects: Project[] = [
  {
    slug: "global-opinion",
    index: "01",
    title: "全球舆情与品牌口碑分析 Skill",
    shortTitle: "全球舆情分析",
    category: "核心系统",
    tagline: "把公开网页数据转化为可审计的产品 VOC 与事件声誉判断。",
    mastFacts: {
      input: "主题、时间窗与目标市场",
      judgment: "覆盖率与证据可验证性",
      output: "数据包、Markdown、HTML",
    },
    problem: "多来源公开网页数据难以形成统一视图，分析结论又容易脱离原始证据。",
    judgment: "舆情价值不在于生成一份长报告，而在于来源覆盖与可验证性。证据不足时应降级交付，而不是补齐一个看似完整的结论。",
    system: ["范围确认", "只读连接器检查", "清洗与来源审计", "正式报告门槛", "多格式交付"],
    reliability: ["100+ 有效记录", "5+ 来源域名", "2+ 来源类型", "不足样本降级交付"],
    outputs: ["候选预览", "六工作表 Excel 数据包", "Markdown 正式报告", "离线 HTML（按需）"],
    reuse: "采集、证据与报告骨架可迁移到行业研究、竞品监控和政策追踪。",
    tags: ["MCP", "Evidence", "Agent"],
    github: "https://github.com/yyfyydshh/global-public-opinion-analysis-skill",
    orbit: "hero",
    icon: "globe",
    visualMode: "evidence-orbit",
    demo: {
      src: "/videos/global-opinion/global-opinion-agent-demo-web-v002.mp4",
      poster: "/videos/global-opinion-agent-demo-poster.jpg",
    },
    caseStudy: {
      visualKind: "global-evidence",
      evidenceStatus: "可运行 Skill / 私有仓库 / 只读检索",
      title: "工作流与正式报告质量门",
      intro: "从分析范围到多格式交付，每一步都留下可复核的来源与停止条件。",
      summary: [
        { label: "典型输入", value: "主题、时间窗、目标数据量、市场 / 语言、竞品" },
        { label: "我的角色", value: "工作流设计、证据门槛、报告交付" },
        { label: "证据状态", value: "可运行 Skill / 私有仓库 / 只读检索" },
      ],
      steps: [
        {
          key: "scope",
          title: "范围确认",
          details: ["明确主题与时间窗", "设定目标数据量", "确定市场 / 语言与竞品"],
          depth: {
            purpose: "先把“想了解某个话题”改写成可校验的运行契约，防止主题、分析模式与数据目标在采集过程中悄悄漂移。",
            mechanism: [
              "主题同时经过规则分类与显式语义判断；任一判断为 blocked，流程都不会发起检索。",
              "规范化主题后生成 topic_hash，后续运行清单与每次采集许可必须匹配同一主题指纹。",
              "在 product_voc 与 event_reputation 两种报告模式中完成路由，并锁定时间窗、目标记录数与来源策略。",
            ],
            artifacts: [
              { name: "scope-decision.json", role: "记录 allowed / blocked、reason_codes 与 search_allowed" },
              { name: "run-manifest.json", role: "冻结 topic_hash、report_mode 与 source_policy" },
            ],
            decision: "只有范围允许、连接器就绪且来源策略已经锁定，才会生成采集许可；敏感主题在搜索前停止。",
          },
        },
        {
          key: "collect",
          title: "只读采集",
          details: ["只读检索公开网页", "记录检索式与参数", "不生成、不篡改内容"],
          depth: {
            purpose: "让每一次搜索都能回答：由谁批准、查了什么、属于哪个来源批次，以及下一次是否能够按相同条件复跑。",
            mechanism: [
              "启动前验证连接器只具备 list_platforms 与 search_platform_content 两个只读工具。",
              "每个查询批次签发 single_use 采集许可，绑定 query_hash、include_hash、batch_role 与策略版本。",
              "默认执行三批检索；首个有效批次先展示 5—10 条候选记录，用于确认相关性而不是提前下结论。",
            ],
            artifacts: [
              { name: "connector-readiness.json", role: "记录 required_tools、missing_tools 与 can_proceed" },
              { name: "collection-permit.json", role: "记录 permit_id、query_hash、batch_role 与 single_use" },
              { name: "query-log.json", role: "保留检索式、批次、时间与来源策略" },
            ],
            decision: "连接器缺失、许可校验失败或查询触发敏感范围时立即停止；候选预览只用于校准采集，不进入正式判断。",
          },
        },
        {
          key: "audit",
          title: "清洗与来源审计",
          details: ["去重与质量筛选", "保留可追溯来源", "检查来源策略覆盖"],
          depth: {
            purpose: "把“搜到一批网页”变成“哪些记录可以进入分析、哪些必须排除，而且每次排除都有理由”的证据集合。",
            mechanism: [
              "统一 URL 与域名，移除跟踪参数并合并重复记录，避免同一页面被重复计入覆盖率。",
              "按时间窗、广告与导航噪声、主题相关性和内容质量执行筛选；被排除记录仍保留原因。",
              "推断来源类型与地域，分别审计海外、中国大陆与未知来源；未知地域不会被算作海外覆盖。",
            ],
            artifacts: [
              { name: "prepared.json · raw", role: "保留进入清洗前的原始记录" },
              { name: "prepared.json · cleaned / excluded", role: "分开可用证据与带 exclusion_reason 的排除项" },
              { name: "source_audit", role: "汇总 region、domain、source_type 与 policy_compliant" },
            ],
            decision: "只有 cleaned 记录进入质量门；被排除内容可供复核但不得支持结论，来源地域未知时也不推断其覆盖归属。",
          },
        },
        {
          key: "gate",
          title: "正式报告质量门",
          details: ["检查有效记录数量", "检查来源域名覆盖", "检查来源类型覆盖"],
          depth: {
            purpose: "把“手里已有数据”与“证据足以形成正式判断”分开，避免用完整排版掩盖样本不足或来源过窄。",
            mechanism: [
              "checkGate 同时校验有效记录数、独立域名数、来源类型数与锁定的来源策略，不接受单项达标。",
              "报告生成前再次检查 scope 仍为 allowed，并验证分析 JSON 的必填模块与结构。",
              "每个 evidence_id 必须能解析到真实记录；原文引用必须在对应记录中逐字存在，且单条引用不超过 8 条。",
            ],
            artifacts: [
              { name: "prepared.json · gate", role: "记录 passed、criteria、reasons 与实际覆盖" },
              { name: "analysis.json", role: "只保存 record_id / evidence_ids 与限制项，不复制假链接" },
              { name: "report validation", role: "暴露缺失字段、无效证据 ID 与引用不匹配" },
            ],
            decision: "质量门、报告结构与证据引用全部通过才生成正式报告；否则只交付数据包、覆盖缺口和续采建议。",
          },
        },
        {
          key: "deliver",
          title: "多格式交付",
          details: ["按门槛选择交付层级", "附带证据清单", "交付即可复核"],
          depth: {
            purpose: "把完整数据追溯与管理层阅读分开：结论保持精炼，原始记录、排除项和查询过程仍能被逐层回查。",
            mechanism: [
              "正式报告中的 evidence_id 由渲染器解析回真实 URL，避免分析层自行拼接或幻觉出链接。",
              "Excel 固定生成 Summary、Raw、Cleaned、Excluded、Query Log、Dictionary 六个工作表。",
              "HTML 仅在明确请求时生成，打包为不依赖远程脚本、追踪器或外部资产的单文件页面。",
            ],
            artifacts: [
              { name: "*.xlsx", role: "六表数据包、公式、来源覆盖与质量门结果" },
              { name: "*.md", role: "product_voc 或 event_reputation 正式报告" },
              { name: "*.html", role: "按需生成的离线单文件可视化" },
            ],
            decision: "质量门未通过时不生成正式结论；作者、互动量、ASR / OCR 等源数据未提供的字段保持为空，也不声称全网覆盖或市场份额。",
          },
        },
      ],
      gates: [
        {
          value: "100+",
          label: "有效记录",
          prevents: "防止少量高情绪样本被误判为整体趋势。",
          verifies: "cleaned.length 与每条记录的有效性状态。",
          fallback: "继续补采，或仅交付样本清单与数量缺口。",
        },
        {
          value: "5+",
          label: "来源域名",
          prevents: "防止单一站点的编辑偏好主导全部结论。",
          verifies: "规范化 URL 后的独立 domain 数与来源策略合规性。",
          fallback: "定位缺失地域 / 域名，生成下一轮定向检索计划。",
        },
        {
          value: "2+",
          label: "来源类型",
          prevents: "防止把新闻转载、论坛讨论或官方信息混成一种证据。",
          verifies: "source_type 分布及各类型对应的 evidence_id。",
          fallback: "保留已有数据，但把类型偏差写入限制项并继续补采。",
        },
      ],
      branches: {
        met: "进入正式报告。",
        unmet: "仅交付数据包、覆盖缺口与续采建议。",
      },
      deliverables: [
        { kind: "excel", title: "Excel · 6 个工作表" },
        { kind: "markdown", title: "Markdown · 正式报告" },
        { kind: "html", title: "HTML · 离线可视化（按需）" },
      ],
      boundary: "不足样本不包装成正式结论；政治、战争、军事、武器与情报主题不进入流程。",
    },
  },
  {
    slug: "sales-copilot",
    index: "02",
    title: "销售专业助手",
    shortTitle: "销售专业助手",
    category: "核心系统",
    tagline: "持续分析客户对行业、目标数据与自动化要求的回答，刷新需求画像、MQL 和适用方案。",
    mastFacts: {
      input: "对话、纪要与客户资料",
      judgment: "画像、MQL 与方案路由",
      output: "JSON、行动清单、案例匹配",
    },
    problem: "客户往往用业务语言描述数据需求；行业、目标数据、更新要求与自动化程度没有被结构化，销售难以快速判断可行路径。",
    judgment: "先把行业与业务目的、数据来源与字段、更新频率、自动化程度和系统衔接拆清楚。缺少关键条件时继续确认，不把推测写成客户事实。",
    system: ["行业与业务目的", "数据来源与字段", "更新频率与交付", "自动化程度", "系统与 AI 衔接", "MQL 与方案路由"],
    reliability: ["严格 JSON 契约", "事实 / 假设 / 未知分层", "授权资料范围", "人工外发边界"],
    outputs: ["需求画像", "MQL 等级", "采集与自动化方案", "适用能力与案例资料", "回复引导建议"],
    reuse: "主 Skill 按需编排需求分析、MQL、方案路由、资料筛选与回复草稿，帮助团队形成一致的售前判断。",
    tags: ["AI Skill", "Sales", "Routing"],
    github: "https://github.com/yyfyydshh/sales-copilot-overview",
    orbit: "hero",
    icon: "target",
    visualMode: "routing-flow",
    demo: {
      src: "/videos/sales-copilot/demo-v001.mp4",
      poster: "/videos/sales-copilot/poster-v001.jpg",
    },
    caseStudy: {
      visualKind: "sales-conversion",
      evidenceStatus: "公开脱敏概要 + 用户提供的内部项目事实",
      title: "把客户的每一次回复，刷新成下一步转化判断。",
      intro: "把客户回答持续交给 Agent；每次补充行业、目标数据或自动化要求，需求画像、MQL、方案路径、适用能力和回复建议都会基于累计上下文同步刷新。",
      demoLabel: "脱敏机制示例｜固定三轮｜非实时 Agent",
      confidentiality: "为保护客户信息与商业机密，具体行业、站点、字段、数据规模及内部 Skill 规则均已隐藏。",
      dimensions: [
        { id: "industry", label: "行业与业务目的", detail: "为什么需要这些数据", reachedAt: 2 },
        { id: "data", label: "数据来源与字段", detail: "采什么、从哪里采", reachedAt: 2 },
        { id: "cadence", label: "更新频率与交付", detail: "多久更新、如何使用", reachedAt: 2 },
        { id: "automation", label: "自动化程度", detail: "哪些环节减少人工", reachedAt: 2 },
        { id: "integration", label: "系统与 AI 衔接", detail: "如何进入后续流程", reachedAt: 3 },
      ],
      mqlLevels: [
        { level: "D", label: "初步需求" },
        { level: "C", label: "需求成形" },
        { level: "B", label: "方案评估" },
        { level: "A", label: "采购确认" },
      ],
      turns: [
        {
          id: "one",
          messageId: "turn-one",
          label: "第 1 轮",
          reply: "希望持续采集公开网页中的业务数据，目前主要依靠人工整理。",
          tag: "初步需求 / 行业与目标待确认",
          contextSummary: "已识别数据采集诉求，但尚不能判断具体采集对象、自动化程度或适用方案。",
          newFacts: ["存在持续采集公开网页数据的需求", "当前主要依靠人工整理"],
          unknowns: ["行业与业务目的", "目标数据与来源", "字段与更新频率", "自动化程度", "交付方式"],
          changeReason: "这是首次输入，只能确认需求方向，不能提前补齐行业、数据范围或方案。",
          mql: {
            level: "D",
            label: "初步需求",
            missingForA: ["需求范围", "预算范围", "决策链", "数据合规边界"],
          },
          outputs: [
            {
              id: "profile",
              title: "需求画像",
              value: "仅确认公开网页数据采集诉求；行业、业务目的与数据对象仍未知。",
              rationale: "客户只说明了希望持续采集数据以及当前依靠人工，其他字段保持未知。",
              sourceIds: ["turn-one"],
              status: "partial",
            },
            {
              id: "mql",
              title: "MQL 等级与变化原因",
              value: "D · 初步需求；有明确痛点，但不足以进入方案评估。",
              rationale: "公开简化依据只确认需求存在，不公开内部权重，也不把意向补写成采购条件。",
              sourceIds: ["turn-one"],
              status: "ready",
            },
            {
              id: "solution",
              title: "数据采集与自动化方案",
              value: "暂缓具体方案；先确认行业、业务目的、目标数据与公开来源范围。",
              rationale: "采集对象和使用方式会直接改变工具、流程与交付建议，因此本轮只进入需求澄清。",
              sourceIds: ["turn-one"],
              status: "withheld",
            },
            {
              id: "materials",
              title: "适用能力与案例资料",
              value: "暂不匹配案例；待行业场景和数据对象明确后再从授权资料库筛选。",
              rationale: "缺少行业和数据对象时匹配材料容易误导，不能用泛案例填补信息缺口。",
              sourceIds: ["turn-one"],
              status: "withheld",
            },
            {
              id: "reply",
              title: "回复引导建议",
              value: "请补充所属行业、业务目的，以及希望采集的数据类型与公开来源范围。",
              rationale: "这组问题最先决定采集可行性和后续需要确认的自动化边界。",
              sourceIds: ["turn-one"],
              status: "draft",
            },
          ],
        },
        {
          id: "two",
          messageId: "turn-two",
          label: "第 2 轮",
          reply: "已补充行业与业务场景、目标数据类型、核心字段和更新频率，并希望减少重复人工操作。",
          tag: "需求轮廓 / 自动化程度待确认",
          contextSummary: "行业、数据对象和更新要求已成形，可以形成初步需求画像并进入可行性确认。",
          newFacts: ["行业与业务场景已说明", "目标数据、核心字段与更新频率已描述", "明确希望减少重复人工操作"],
          unknowns: ["预计数据规模", "来源合规边界", "交付格式", "现有系统接口", "预算与决策链"],
          changeReason: "新增行业、数据和频率信息后，需求从宽泛诉求变为可开展可行性确认的需求轮廓。",
          mql: {
            level: "C",
            label: "需求成形",
            missingForA: ["数据规模", "预算范围", "决策链", "数据合规边界"],
          },
          outputs: [
            {
              id: "profile",
              title: "需求画像",
              value: "行业场景、目标数据、核心字段和更新频率已明确；当前重点是减少人工整理。",
              rationale: "画像只汇总前两轮已经出现的需求维度，不推断未披露的规模、预算或系统情况。",
              sourceIds: ["turn-one", "turn-two"],
              status: "partial",
            },
            {
              id: "mql",
              title: "MQL 等级与变化原因",
              value: "C · 需求成形；数据对象和更新要求已可用于下一步可行性确认。",
              rationale: "相较第一轮，行业与数据要求已经补齐，但交付、系统衔接和采购条件仍不完整。",
              sourceIds: ["turn-one", "turn-two"],
              status: "ready",
            },
            {
              id: "solution",
              title: "数据采集与自动化方案",
              value: "先验证来源与字段样例，再确认更新、清洗和交付方式。",
              rationale: "当前信息足以安排样例验证，但不足以直接承诺完整自动化链路。",
              sourceIds: ["turn-one", "turn-two"],
              status: "partial",
              steps: ["来源确认", "字段样例", "更新与交付"],
            },
            {
              id: "materials",
              title: "适用能力与案例资料",
              value: "可匹配采集与结构化处理的能力说明；案例类型待来源和自动化边界确认。",
              rationale: "本轮可以说明能力方向，但案例仍需从授权资料库筛选并由销售核验。",
              sourceIds: ["turn-two"],
              status: "partial",
            },
            {
              id: "reply",
              title: "回复引导建议",
              value: "请继续确认预计数据量、交付格式，以及希望自动化到采集、清洗还是后续使用环节。",
              rationale: "数据规模和自动化边界会决定后续验证方式与方案深度。",
              sourceIds: ["turn-two"],
              status: "draft",
            },
          ],
        },
        {
          id: "three",
          messageId: "turn-three",
          label: "第 3 轮",
          reply: "希望打通采集、清洗、调度与交付，并评估与现有系统或 AI 分析环节的衔接。",
          tag: "方案评估 / 当前轮",
          contextSummary: "需求对象、自动化目标和衔接方向已逐步明确，当前可进入样例验证与方案评估。",
          newFacts: ["希望形成采集—清洗—调度—交付链路", "需要评估现有系统或 AI 分析衔接", "主动进入适用方案与授权材料评估"],
          unknowns: ["最终数据规模", "来源合规边界", "预算范围", "决策链与采购条件"],
          changeReason: "新增端到端自动化目标和系统衔接诉求后，可以从需求澄清推进到样例验证与方案评估。",
          mql: {
            level: "B",
            label: "方案评估",
            missingForA: ["预算范围", "决策链", "数据合规边界", "采购条件"],
          },
          outputs: [
            {
              id: "profile",
              title: "需求画像",
              value: "行业场景与目标数据已描述；当前人工整理，希望提高采集、清洗、调度和交付的自动化程度。",
              rationale: "画像累计前三轮事实，只呈现已经明确的行业、数据和流程目标。",
              sourceIds: ["turn-one", "turn-two", "turn-three"],
              status: "ready",
            },
            {
              id: "mql",
              title: "MQL 等级与变化原因",
              value: "B · 方案评估；需求对象与自动化目标逐步明确，并主动进入方案与衔接评估。",
              rationale: "需求已具备验证与方案讨论条件，但预算、决策链、合规边界和采购条件仍未知。",
              sourceIds: ["turn-one", "turn-two", "turn-three"],
              status: "ready",
            },
            {
              id: "solution",
              title: "数据采集与自动化方案",
              value: "围绕采集、结构化清洗、自动调度和结果交付，先用样例验证可行性，再评估落地。",
              rationale: "第三轮明确了端到端自动化和系统衔接目标，因此可以形成分阶段、可验收的推进链路。",
              sourceIds: ["turn-one", "turn-two", "turn-three"],
              status: "ready",
              steps: ["需求确认", "样例验证", "方案评估", "落地验收"],
            },
            {
              id: "materials",
              title: "适用能力与案例资料",
              value: "匹配数据采集、结构化清洗与自动化交付方向的能力说明；授权资料由销售核验后使用。",
              rationale: "材料匹配依据当前需求方向，不展示客户机密，也不把未核验案例直接外发。",
              sourceIds: ["turn-two", "turn-three"],
              status: "ready",
            },
            {
              id: "reply",
              title: "回复引导建议",
              value: "建议先核验数据来源与字段样例，再确认规模、合规边界和系统接口，随后安排方案评估。",
              rationale: "回复同时推动技术可行性与商业条件确认，但仍是供销售编辑和核验的草稿。",
              sourceIds: ["turn-two", "turn-three"],
              status: "draft",
            },
          ],
        },
      ],
      humanBoundary: "可行性确认、授权资料核验、回复外发、报价与实施承诺均由销售或业务人员完成。",
      implementation: [
        { title: "事实、假设与未知分层", detail: "从客户回答提取行业、业务目的、数据对象和自动化要求；未披露的规模、合规与采购条件继续保持未知。", evidence: "用户确认：不公开具体客户与 Skill 规则；页面只展示脱敏需求维度" },
        { title: "累计上下文刷新", detail: "每轮都读取截至当前的全部回答，统一刷新需求画像、MQL、方案、资料与回复，不把最新一句孤立处理。", evidence: "用户确认：多轮回复交互会持续刷新全部客户信息" },
        { title: "结构化输出与流程编排", detail: "主 Skill 按需组织需求分析、MQL、方案路由、资料筛选和回复草稿；严格 JSON 契约区分事实、推断与空值。", evidence: "用户提供的内部项目事实：MQL A—D、JSON 契约与子 Skill 编排" },
        { title: "授权资料与人工外发", detail: "案例和能力材料只从授权、可核验范围匹配；回复始终是草稿，报价、实施与发送由销售决定。", evidence: "公开脱敏概要：授权材料范围与人工可控边界" },
      ],
      sources: [
        { label: "公开仓库能证明", value: "脱敏输入输出、流程边界与不自动外发等概要" },
        { label: "用户确认的项目事实", value: "项目聚焦数据采集与自动化需求挖掘；MQL A—D、严格 JSON 契约与子 Skill 编排属于内部事实" },
      ],
      boundary: "这是固定、脱敏的机制演示，不连接实时 Agent。具体行业、站点、字段、数据规模和内部规则不公开；系统不自动采集、报价、承诺实施或发送回复。",
    },
  },
  {
    slug: "docs-system",
    index: "03",
    title: "八爪鱼产品文档站 0→1",
    shortTitle: "产品文档站 0→1",
    category: "核心系统",
    tagline: "将迁移、校验、发布与维护连接成可复用的知识工程闭环。",
    mastFacts: {
      input: "新站、旧站与维护任务",
      judgment: "路径选择与发布质量门",
      output: "文档站、索引与维护 SOP",
    },
    problem: "旧站、飞书和 HTML 中的资料格式不一，内容迁移后还要经过发布级验收。",
    judgment: "AI 完成格式转换不代表页面可发布；规则要能覆盖一类错误，也要为人工判断保留边界。",
    system: ["HTML → Markdown / MDX", "图片本地化", "链接迁移", "分批验收", "影响面扫描"],
    reliability: ["正文完整性", "标题层级", "媒体可用性", "内链核验", "分模块发布"],
    outputs: ["产品文档站", "迁移 SOP", "检查清单", "跨产品线经验包"],
    reuse: "经验包已由另一条 RPA 产品线使用，并支持其文档站从零上线。",
    tags: ["Knowledge", "MDX", "Ops"],
    github: "https://github.com/yyfyydshh/mintlify-docs-site-sop",
    orbit: "hero",
    icon: "book",
    visualMode: "knowledge-system",
    demo: {
      src: "/videos/docs-site/demo-v001.mp4",
      poster: "/videos/docs-site/poster-v001.jpg",
    },
    caseStudy: {
      visualKind: "docs-routes",
      evidenceStatus: "真实文档站经历 + 公开 Mintlify SOP",
      title: "三路径文档交付控制台",
      intro: "从零搭建、旧站迁移与日常维护不是同一条流水线；它们共享验收门，但输入、风险和发布动作不同。",
      summary: [
        { label: "服务对象", value: "需要建设、迁移或持续维护 Mintlify 文档站的产品团队" },
        { label: "典型输入", value: "产品资料、旧站 HTML / Markdown、媒体文件与导航需求" },
        { label: "我的角色", value: "信息架构、迁移调度、质量验收、发布维护与团队赋能" },
      ],
      routes: [
        {
          id: "zero",
          label: "从零搭建",
          brief: "先建立信息架构和 docs.json 主导航，再逐步填充可验证内容。",
          stages: [
            { id: "input", title: "目标与证据盘点", short: "确认受众、任务、产品事实来源与发布范围。", depth: { purpose: "在写页面前先定义文档要帮助谁完成什么任务。", mechanism: ["盘点官方产品资料与可引用事实。", "按用户任务划分内容优先级。", "标记缺少证据或尚未确认的产品主张。"], artifacts: [{ name: "content-inventory", role: "内容、证据来源与缺口清单" }], decision: "关键产品事实没有来源时先留空或回到业务方确认。" } },
            { id: "ia", title: "信息架构", short: "定义栏目、层级、URL 与内容边界。", depth: { purpose: "让导航结构先于页面数量稳定下来。", mechanism: ["按用户任务组织入口。", "用 docs.json 维护导航、分组和页面路径。", "为新增内容预留可持续扩展的层级。"], artifacts: [{ name: "docs.json", role: "站点导航与路由的主配置" }], decision: "导航无法解释用户路径时，不进入批量写作。" } },
            { id: "content", title: "MDX 与媒体", short: "按统一模板编写正文、组件和本地媒体。", depth: { purpose: "把内容生产约束为可维护、可复核的页面单元。", mechanism: ["建立标题、步骤、提示与示例模板。", "媒体本地化并保留可读替代文本。", "产品能力描述只使用已确认事实。"], artifacts: [{ name: "*.mdx + images", role: "可版本化正文与本地媒体" }], decision: "模板一致但内容证据不足的页面仍不能进入发布队列。" } },
            { id: "nav", title: "导航与链接", short: "检查入口、内链、锚点和孤立页面。", depth: { purpose: "确保页面不仅存在，而且能被用户找到并连续阅读。", mechanism: ["核对 docs.json 路径与文件一致。", "扫描内部链接与标题锚点。", "检查移动端导航和长标题表现。"], artifacts: [{ name: "link-audit", role: "路由、链接、锚点与孤页检查" }], decision: "出现断链或不可达页面时回到信息架构修复。" } },
            { id: "local", title: "本地验证", short: "在本地检查构建、页面、搜索与响应式。", depth: { purpose: "尽早暴露语法和结构问题，但不把本地成功当作上线完成。", mechanism: ["运行本地预览和构建。", "检查搜索索引、组件和资源路径。", "在多视口抽查核心任务链。"], artifacts: [{ name: "local-checklist", role: "本地构建与浏览器检查记录" }], decision: "本地失败直接阻断；本地通过只进入托管验收。" } },
            { id: "hosted", title: "托管验收", short: "在真实托管环境复核 URL、搜索、媒体和权限。", depth: { purpose: "验证本地环境无法证明的线上行为。", mechanism: ["检查正式域名与重定向。", "复核在线搜索、媒体加载和分享链接。", "抽查关键页面与跨页路径。"], artifacts: [{ name: "hosted-acceptance", role: "线上 URL、页面与功能验收记录" }], decision: "托管验收失败时不进入正式发布确认。" } },
            { id: "publish", title: "发布授权", short: "在获得明确授权后执行正式发布并保留确认。", depth: { purpose: "把技术可发布与业务允许发布分开。", mechanism: ["展示变更范围和验收结果。", "获得负责人的明确发布确认。", "记录发布时间、版本和回退说明。"], artifacts: [{ name: "publish-confirmation", role: "授权、版本与发布记录" }], decision: "没有授权只保留预览，不对正式站点写入。" } },
          ],
        },
        {
          id: "migration",
          label: "旧站迁移",
          brief: "保留正文、媒体、链接和结构语义，不能只做 HTML 到 MDX 的格式替换。",
          stages: [
            { id: "inventory", title: "旧站盘点", short: "建立页面、媒体、链接和优先级清单。", depth: { purpose: "先知道迁移对象和缺口，避免边转边猜。", mechanism: ["列出旧 URL、页面类型和状态。", "记录媒体与外链依赖。", "确定分批迁移与验收顺序。"], artifacts: [{ name: "migration-inventory", role: "页面与资源迁移清单" }], decision: "无法定位来源或归属的页面进入待确认队列。" } },
            { id: "mapping", title: "路由映射", short: "为旧 URL 建立新路径和重定向关系。", depth: { purpose: "避免迁移后历史链接失效。", mechanism: ["旧路径映射到新信息架构。", "识别合并、拆分和删除页面。", "为高价值入口准备重定向。"], artifacts: [{ name: "route-map", role: "旧 URL、新路径与处理方式" }], decision: "没有映射的页面不进入批量转换。" } },
            { id: "convert", title: "正文转换", short: "转换正文结构并保留标题、列表、表格和代码语义。", depth: { purpose: "让格式变化不损伤信息本身。", mechanism: ["把 HTML / Markdown 转为规范 MDX。", "修复标题层级和非语义样式。", "逐页保留正文完整性。"], artifacts: [{ name: "converted-mdx", role: "转换后的页面正文" }], decision: "正文缺段、顺序变化或关键内容丢失时退回重做。" } },
            { id: "media", title: "媒体本地化", short: "下载、重命名并验证图片等资源。", depth: { purpose: "移除对旧站临时资源地址的依赖。", mechanism: ["将远程媒体保存到项目目录。", "修复引用路径和替代文本。", "识别失效、重复或不允许迁移的素材。"], artifacts: [{ name: "media-map", role: "原媒体 URL、本地文件与使用页面" }], decision: "无法验证授权或来源的媒体保持待处理。" } },
            { id: "links", title: "链接与锚点", short: "修复内链、外链、锚点与目录。", depth: { purpose: "恢复迁移前后的阅读连续性。", mechanism: ["按路由映射替换内部链接。", "扫描失效锚点与目录。", "抽查跨页面任务链。"], artifacts: [{ name: "link-report", role: "断链、锚点与修复状态" }], decision: "关键任务链存在断点时不进入发布验收。" } },
            { id: "local", title: "本地验证", short: "验证构建、正文、媒体和导航。", depth: { purpose: "在发布前发现批量迁移造成的系统性错误。", mechanism: ["运行构建与本地预览。", "按页面类型抽样比对旧站。", "检查移动端和搜索入口。"], artifacts: [{ name: "migration-checklist", role: "批次级本地验收记录" }], decision: "本地通过不等于线上验收完成。" } },
            { id: "hosted", title: "托管验收与授权", short: "线上验证后，经明确授权分批发布。", depth: { purpose: "减少一次性迁移对正式站点的影响面。", mechanism: ["在托管环境验证路径和资源。", "按批次展示差异与验收结果。", "获得发布确认并记录回退点。"], artifacts: [{ name: "batch-release-record", role: "托管验收、授权与批次状态" }], decision: "没有托管验收或发布授权，不写入正式站点。" } },
          ],
        },
        {
          id: "maintenance",
          label: "日常维护",
          brief: "围绕影响面控制、增量修改与回归检查，让文档站持续可用。",
          stages: [
            { id: "request", title: "变更确认", short: "确认需求、证据来源、影响页面和完成标准。", depth: { purpose: "把模糊修改请求变成可验收变更。", mechanism: ["确认改动原因与目标用户。", "定位来源事实和负责人。", "列出受影响页面、导航与链接。"], artifacts: [{ name: "change-request", role: "范围、证据与验收标准" }], decision: "产品事实未确认时不直接改写正式文档。" } },
            { id: "impact", title: "影响面扫描", short: "查找相关页面、导航、链接、截图和搜索词。", depth: { purpose: "防止只修一处文字却留下跨页面矛盾。", mechanism: ["搜索相关术语和旧表述。", "检查导航、交叉链接与媒体。", "划分必须同步和可后续处理的范围。"], artifacts: [{ name: "impact-map", role: "直接与间接受影响项" }], decision: "关键影响面不清晰时先暂停修改。" } },
            { id: "edit", title: "增量修改", short: "在最小范围内更新正文、配置与媒体。", depth: { purpose: "降低日常维护对稳定页面的扰动。", mechanism: ["沿用既有页面模板。", "保留未经授权的其他内容。", "为删除、改名和路由变化记录原因。"], artifacts: [{ name: "change-set", role: "本次修改文件与说明" }], decision: "超出已确认范围的修改不顺手带入。" } },
            { id: "regression", title: "回归检查", short: "复核构建、相关页面、导航和链接。", depth: { purpose: "确认增量修改没有破坏旧能力。", mechanism: ["运行本地构建。", "检查直接页面与邻接路径。", "抽查搜索、媒体和移动端。"], artifacts: [{ name: "regression-check", role: "变更前后与关键路径结果" }], decision: "出现回归时修复后重新验证。" } },
            { id: "hosted", title: "托管复核", short: "在线检查缓存、路由和真实访问结果。", depth: { purpose: "覆盖本地无法验证的部署差异。", mechanism: ["打开正式预览 URL。", "检查线上资源和重定向。", "确认外部分享入口。"], artifacts: [{ name: "hosted-review", role: "线上访问与差异记录" }], decision: "线上结果与本地不一致时以线上问题为阻断。" } },
            { id: "publish", title: "发布授权", short: "经确认后发布，并记录版本和回退点。", depth: { purpose: "让正式写入始终有明确责任边界。", mechanism: ["汇总变更和测试结果。", "获得授权。", "记录版本、时间与回退方式。"], artifacts: [{ name: "maintenance-release", role: "授权与发布记录" }], decision: "无授权只保留变更草稿或预览。" } },
          ],
        },
      ],
      acceptance: [
        { title: "本地可预览", check: "构建、内容、媒体、导航、链接与响应式检查" },
        { title: "线上已验收", check: "托管 URL、搜索、资源、重定向与关键任务路径" },
        { title: "正式可发布", check: "线上验收通过，并获得明确的发布授权" },
      ],
      deliverables: ["信息架构", "MDX 页面", "本地媒体", "路由映射", "迁移 / 回归记录", "发布确认"],
      sources: [
        { label: "真实经历", value: "八爪鱼产品文档站的建设、迁移、审核发布与持续维护" },
        { label: "公开仓库", value: "Mintlify 文档站搭建、迁移与维护方法 SOP，不是生产站源码" },
      ],
      boundary: "本地预览不等于线上验收；线上验收不等于获得发布授权。任何正式写入或发布都需要明确确认。",
    },
  },
  {
    slug: "regulatory-risk",
    index: "04",
    title: "金融监管风险监测",
    shortTitle: "金融监管风险监测",
    category: "专业 Skill",
    tagline: "把监管公开信息与企业画像逐项匹配，判断哪些要求真正适用、证据在哪里，以及下一步应该做什么。",
    mastFacts: {
      input: "企业画像与当前任务导出",
      judgment: "四轴适用性与证据覆盖",
      output: "风险报告与证据包",
    },
    problem: "监管公告来源分散，命中关键词也不等于与目标企业真实相关。",
    judgment: "采集到处罚记录不代表目标企业已发生同类违规，适用性判断必须与证据索引同时存在。",
    system: ["任务采集", "批次隔离", "企业画像", "适用性判断", "报告投递"],
    reliability: ["当前批次隔离", "证据索引", "敏感信息检查", "交付状态区分"],
    outputs: ["企业风险报告", "证据清单", "风险分级", "投递结果"],
    reuse: "可用于市级政策筛查、金融监管监测与企业合规情报。",
    tags: ["Risk", "Evidence", "Delivery"],
    github: "https://github.com/yyfyydshh/financial-regulatory-risk-monitor",
    orbit: "focus",
    icon: "shield",
    visualMode: "risk-gate",
    demo: {
      src: "/videos/financial-regulatory-risk-monitor/demo-v002.mp4",
      poster: "/videos/financial-regulatory-risk-monitor/poster-v002.jpg",
    },
    caseStudy: {
      visualKind: "regulatory-applicability",
      evidenceStatus: "可运行 Skill / 公开仓库 / 机制演示",
      title: "企业适用性审阅台",
      intro: "监管记录先成为证据，再经过企业适用性判断；关键词命中、行业相似或处罚案例都不能直接推出目标企业违法。",
      summary: [
        { label: "服务对象", value: "需要持续审阅公开监管与处罚信息的企业团队" },
        { label: "典型输入", value: "企业画像、当前批次任务导出、交付渠道与明确确认" },
        { label: "我的角色", value: "输入门禁、全正文语义审阅、证据报告与防重投递" },
      ],
      stages: [
        { id: "input", title: "输入确认", short: "确认 API、企业画像、采集任务与投递目标。", depth: { purpose: "在访问数据前锁定企业、任务、角色和交付边界。", mechanism: ["检查 MCP endpoint 与由用户提供的 API Key。", "确认企业画像模式、内容和使用授权。", "确认任务、角色、投递渠道和收件目标。"], artifacts: [{ name: "validated-request", role: "记录确认项与缺失输入" }], decision: "任一关键输入或确认缺失时不启动本轮流程。" } },
        { id: "snapshot", title: "当前批次快照", short: "只处理本次任务导出，并冻结文件与任务身份。", depth: { purpose: "避免历史数据、重复任务或未完成导出混入当前报告。", mechanism: ["验证 task_id 唯一和任务角色明确。", "只接受 completed / exported 状态与 HTTPS 导出地址。", "记录文件大小、记录数和 sha256 快照。"], artifacts: [{ name: "run-manifest.json", role: "任务、导出文件与批次指纹" }], decision: "任务状态、文件或快照不满足要求时阻断分析。" } },
        { id: "normalize", title: "规范化与去重", short: "统一记录结构，隔离重复与无法解析项。", depth: { purpose: "让后续判断基于稳定记录，而不是来源格式差异。", mechanism: ["保留每条记录的原始索引与来源。", "按稳定字段规范化并识别重复。", "无法解析项进入未知记录而非静默丢弃。"], artifacts: [{ name: "normalized-records", role: "规范化记录、重复项与未知项" }], decision: "未知记录仍然存在时不能声称完成全量语义审阅。" } },
        { id: "review", title: "全正文语义审阅", short: "逐条阅读候选与待定记录的完整正文。", depth: { purpose: "避免只凭标题、关键词或摘要判断企业风险。", mechanism: ["每条记录必须有 reviewed 状态。", "candidate 与 pending 项必须完成 full_body 审阅。", "保留适用或不适用的理由，暴露 missing / unknown。"], artifacts: [{ name: "review-coverage", role: "逐条审阅状态、理由与覆盖缺口" }], decision: "语义审阅不完整时，报告路径被阻断。" } },
        { id: "applicability", title: "企业适用性判断", short: "把地域、主体、业务活动与时间条件组合成适用性矩阵。", depth: { purpose: "区分监管关注与目标企业是否需要行动，避免把处罚案例直接套到企业。", mechanism: ["分别判断地域管辖、适用主体、相关业务活动与生效时间。", "任一条件明确不匹配时标记排除。", "存在未知条件时保持 pending，并给出需要补证的问题。"], artifacts: [{ name: "applicability-matrix", role: "四轴状态、证据与判断理由" }], decision: "只有条件均有证据支持的记录才进入候选风险，不匹配项排除，未知项保持待定。" } },
        { id: "coverage", title: "证据覆盖", short: "确保每个判断都能回到真实记录和来源。", depth: { purpose: "让报告中的每一条风险信号可以复核，而不是停留在模型摘要。", mechanism: ["保留 record_id、来源 URL、正文片段与审阅状态。", "检查候选、待定和排除项是否都有理由。", "敏感信息按交付范围处理，不扩大暴露。"], artifacts: [{ name: "evidence-index", role: "记录、来源、判断与覆盖率映射" }], decision: "缺少记录映射或覆盖不完整时不生成正式判断。" } },
        { id: "validate", title: "报告校验", short: "检查结构、证据引用、边界声明与敏感信息。", depth: { purpose: "把分析已经完成与报告可以交付分开。", mechanism: ["校验报告必填章节和风险条目结构。", "核对引用 ID 能解析到证据索引。", "检查结论是否保留未知项、限制与非法律意见声明。"], artifacts: [{ name: "report-validation", role: "缺失字段、无效引用与边界检查" }], decision: "报告校验失败时只保留数据与问题清单，不进入投递。" } },
        { id: "delivery", title: "投递防重", short: "对报告、画像、批次和收件目标生成投递指纹。", depth: { purpose: "防止同一份报告被重复投递，同时留下可审计状态。", mechanism: ["计算报告 sha256。", "组合 channel、report_sha256、profile、task snapshots 与 destination。", "投递前检查指纹是否已存在，并区分 prepared、sent 与 failed。"], artifacts: [{ name: "delivery-fingerprint", role: "交付身份与防重状态" }], decision: "指纹重复时阻断；未确认收件目标或渠道时不投递。" } },
      ],
      axes: [
        { label: "地域", question: "监管地域与企业经营或服务范围是否相关？" },
        { label: "主体", question: "规则或处罚所指主体是否覆盖目标企业类型？" },
        { label: "业务活动", question: "涉及的产品、流程或经营活动是否真实存在？" },
        { label: "时间", question: "生效、处罚或观察窗口是否落在当前判断范围？" },
      ],
      guards: [
        { label: "全文审阅完整", reason: "仍有未审阅记录时阻断报告" },
        { label: "证据覆盖完整", reason: "判断无法回到 record_id 时阻断" },
        { label: "报告校验通过", reason: "结构、引用或边界失败时阻断" },
        { label: "投递指纹未重复", reason: "相同交付身份已存在时阻断" },
      ],
      proofFields: ["record_id", "source_url", "source_type", "full_body_reviewed", "applicability_reason", "evidence_ids"],
      artifacts: [
        { name: "run-manifest.json", role: "当前批次任务、文件与 sha256 快照" },
        { name: "evidence-index.json", role: "记录、来源、审阅和适用性覆盖" },
        { name: "enterprise-risk-report.html", role: "通过校验后生成的企业风险报告" },
        { name: "delivery-receipt.json", role: "投递指纹与 prepared / sent / failed 状态" },
      ],
      boundary: "处罚记录代表监管关注，不等于目标企业已经违法；页面展示的是判断机制，不构成法律意见，也不代表正在运行实时监测。",
    },
  },
  {
    slug: "tender-cleaner",
    index: "05",
    title: "招投标公告 29 字段清洗",
    shortTitle: "招投标 29 字段清洗",
    category: "专业 Skill",
    tagline: "把不稳定的公告正文整理为固定、可核验的业务字段。",
    mastFacts: {
      input: "公告正文或采集结果",
      judgment: "29 字段语义与未知保留",
      output: "CSV 与 JSON",
    },
    problem: "跨站公告结构不一，正文语义、联系人和时间节点难以统一提取。",
    judgment: "字段为空比补造更安全；固定输出契约与异常隔离比一次提取率更重要。",
    system: ["双路径输入", "正文语义提取", "29 字段契约", "合并去重", "异常隔离"],
    reliability: ["仅保留可核验信息", "不补造缺失字段", "API Key 不落盘", "逐条异常隔离"],
    outputs: ["标准 CSV", "结构化 JSON", "异常清单"],
    reuse: "为项目筛选、跨站合并和后续业务分析提供统一数据底座。",
    tags: ["Data", "Schema", "CLI"],
    github: "https://github.com/yyfyydshh/tender-cleaner-semantic-29field-skill",
    orbit: "focus",
    icon: "table",
    visualMode: "schema-table",
    demo: {
      src: "/videos/tender-cleaner-29field.mp4",
      poster: "/videos/tender-cleaner-29field-poster.png",
      description: "真实案例脱敏重构：展示一条数千字招投标公告如何经过正文扫描、证据定位和语义判断，汇成固定 29 字段记录；原文未披露的项目工期与招标金额保持为空。",
    },
    caseStudy: {
      visualKind: "tender-schema-refinery",
      evidenceStatus: "公开 Skill 仓库 / 规则可核验 / 机制演示",
      title: "29 个字段不是一张表，而是一份事实合同",
      intro: "这个 Skill 的能力不只是把正文塞进结构化列，而是为每个字段规定证据来源、提取边界、留空条件和批次验收方式。",
      summary: [
        { label: "典型输入", value: "本地 JSON / CSV / TSV / Excel，或用户已有八爪鱼任务" },
        { label: "我的角色", value: "字段口径设计、语义规则、异常隔离与交付验收" },
        { label: "证据状态", value: "公开仓库可核验；页面不接入真实任务与客户数据" },
      ],
      inputModes: [
        { id: "files", label: "本地文件", note: "无需 API Key，直接进入语义清洗。", details: ["支持 JSON / CSV / TSV / XLSX / XLSM / XLS", "可同时处理多个文件", "可指定 Excel 工作表"] },
        { id: "tasks", label: "已有八爪鱼任务", note: "只使用用户账户中的既有任务。", details: ["精确匹配任务名或 taskId", "运行中任务不重复启动", "成功后下载全量导出，不把 sampleData 当结果"] },
      ],
      fieldGroups: [
        { id: "identity", label: "来源与项目", range: "01–06", fields: ["原标题", "来源链接", "项目名称", "招标编号", "项目执行地址", "项目规模"] },
        { id: "scope", label: "范围与金额", range: "07–09", fields: ["招标范围", "项目工期", "招标金额"] },
        { id: "time", label: "时间与开标", range: "10–14", fields: ["获取招标文件时间", "投标截止时间", "开标时间", "开标方式", "开标地点"] },
        { id: "owner", label: "招标主体", range: "15–20", fields: ["招标人", "招标联系人", "招标电话", "招标邮箱", "招标地址", "招标单位"] },
        { id: "agent", label: "代理与结果", range: "21–29", fields: ["招标代理机构", "代理机构联系人", "代理机构电话", "代理机构邮箱", "代理机构地址", "中标人", "中标候选人", "中标金额", "中标公告时间"] },
      ],
      fieldDetails: [
        { id: "source-link", label: "来源链接", groupId: "identity", evidence: "只接受原始输入链接，或正文中明确出现的 HTTP(S) URL。", rule: "保留真实原链，不根据发布平台或标题推测详情页地址。", blank: "源数据与正文都未披露 URL 时留空，并在覆盖说明中记录。" },
        { id: "project-address", label: "项目执行地址", groupId: "identity", evidence: "交货、工程、建设、施工、实施或服务地点的原文段落。", rule: "识别地点所处语境，不能把投标递交地点误作项目地址。", blank: "仅出现开标或递交地址而无项目地点时留空。" },
        { id: "scope", label: "招标范围", groupId: "scope", evidence: "优先使用“招标范围 / 采购范围 / 招标内容 / 采购内容”所在段落。", rule: "没有显式标签时，才从“现对……进行招标/采购”提取对象。", blank: "正文未明确对象时不根据项目名称扩写。" },
        { id: "amount", label: "招标金额", groupId: "scope", evidence: "预算、最高限价、控制价或招标控制价的明确表述。", rule: "统一换算为人民币元；排除标书费、保证金、代理费和数量。", blank: "金额语境不明或只出现费用、保证金时留空。" },
        { id: "deadline", label: "投标截止时间", groupId: "time", evidence: "提交或递交投标/响应文件的截止时间，可由独立元数据补充。", rule: "保留原文时间；不以采集时间替代业务时间。", blank: "只有文件获取时间或开标日期且未声明相同时留空。" },
        { id: "tenderer", label: "招标人", groupId: "owner", evidence: "招标人/采购人联系方式段或项目业主的明确名称。", rule: "联系方式段优先，发布平台与代理机构不得回填为招标人。", blank: "只有发布单位且无法确认主体身份时留空。" },
        { id: "winner", label: "中标人", groupId: "agent", evidence: "仅中标或成交公告中明确披露的主体。", rule: "先识别公告类型，再决定结果字段是否可提取。", blank: "招标/采购公告一律不推断中标人。" },
      ],
      stages: [
        { id: "source", title: "正文优先", short: "选择最长正文作为主体，短列只补充上下文。", depth: { purpose: "避免列表标题或碎片元数据覆盖公告正文中的更明确事实。", mechanism: ["识别正文、文本、文本1/文本2等候选列。", "以最长正文为主体并保留原始索引。", "标题、编号与时间列只在正文缺少时补充。"], artifacts: [{ name: "正文选择说明", role: "记录主体列与补充列的来源" }], decision: "找不到可解释正文时不进入字段提取，记录为源数据缺口。" } },
        { id: "schema", title: "29 字段提取", short: "按固定语义口径逐字段取证，而不是自由生成。", depth: { purpose: "让跨站点公告进入同一结构，同时保留每个字段的事实边界。", mechanism: ["优先匹配显式标签及所在段落。", "结构化列不能覆盖正文中更明确的值。", "每个缺失字段保持空字符串。"], artifacts: [{ name: "29 字段行", role: "固定列序与逐字段结果" }], decision: "无原文依据的字段留空，不用常识或相似公告补齐。" } },
        { id: "amount", title: "金额与结果边界", short: "分清预算、费用、数量与公告类型。", depth: { purpose: "金额和中标结果是最容易被误识别、也最影响后续筛选的字段。", mechanism: ["仅接受预算、最高限价与控制价语境。", "统一换算为元并排除费用、保证金与数量。", "先识别公告类型，再允许写入结果字段。"], artifacts: [{ name: "字段留空原因", role: "说明金额或结果为何未提取" }], decision: "语境不足时留空；招标公告不产生中标结论。" } },
        { id: "dedupe", title: "合并去重", short: "优先按原始链接识别同一公告。", depth: { purpose: "跨站、跨文件合并时减少重复记录，同时避免把不同公告误合并。", mechanism: ["有链接时使用规范化原始链接。", "无链接时组合标题、发布时间与正文前缀。", "保留输入行数与去重后行数。"], artifacts: [{ name: "去重统计", role: "原始数量、唯一数量与匹配依据" }], decision: "匹配依据不足时保留记录，不做激进去重。" } },
        { id: "isolate", title: "异常隔离", short: "一条失败进入隔离通道，其余记录继续处理。", depth: { purpose: "批处理可靠性不能由最差的一条记录决定。", mechanism: ["逐记录捕获解析或字段异常。", "异常项保留索引、原因和可恢复上下文。", "其余记录继续完成清洗与验收。"], artifacts: [{ name: "异常清单", role: "失败记录与需要人工检查的原因" }], decision: "异常不静默丢弃，也不阻断整批；关键字段缺口在交付时披露。" } },
        { id: "verify", title: "一致性门", short: "CSV 与 JSON 同行、同列、同一批次。", depth: { purpose: "把“脚本跑完”与“数据可以交付”分开。", mechanism: ["核对 CSV 与 JSON 行数一致。", "校验固定 29 列与金额单位为元。", "输出覆盖情况和来源链接缺失原因。"], artifacts: [{ name: "验收摘要", role: "行数、列数、去重与字段覆盖" }], decision: "任一行列契约失败就停止正式交付并返回问题清单。" } },
      ],
      checks: [
        { label: "行数一致", detail: "CSV 与 JSON 来自同一去重结果。" },
        { label: "固定 29 列", detail: "列名与顺序满足字段合同。" },
        { label: "金额单位为元", detail: "数字字符串或空，不混入“万元”。" },
        { label: "密钥不落盘", detail: "API Key 仅在采集路径运行时使用。" },
      ],
      deliverables: [
        { label: "CSV", detail: "UTF-8-BOM，Excel 可直接打开。" },
        { label: "JSON", detail: "UTF-8、固定 29 字段，便于系统对接。" },
        { label: "验收说明", detail: "输入、去重、覆盖与异常缺口。" },
      ],
      boundary: "这是字段合同与质量机制演示，不代表正在采集真实任务；页面不接收、不保存 API Key，也不展示客户公告数据。",
    },
  },
  {
    slug: "hot-news-brief",
    index: "06",
    title: "热点快报 Skill",
    shortTitle: "热点快报",
    category: "专业 Skill",
    tagline: "把最近七日的公开新闻筛成来源可点开、边界可解释的证据快报。",
    mastFacts: {
      input: "主题、时窗与目标条数",
      judgment: "来源筛选与证据排序",
      output: "快报与来源清单",
    },
    problem: "公开新闻更新快、重复多、来源质量不一，人工筛选很难稳定复现。",
    judgment: "快不应以丢失来源为代价；证据不足时宁可减少条目或返回空结果。",
    system: ["主题与模式确认", "七日只读检索", "记录门槛", "去重与来源平衡", "证据绑定输出"],
    reliability: ["严格七日窗口", "标题/URL/日期同记录", "单域最多两条", "无结果不补足"],
    outputs: ["新闻清单", "决策简报", "选题雷达", "覆盖说明"],
    reuse: "可作为企业动态、行业快讯与内容选题的只读证据检索骨架。",
    tags: ["Brief", "Read-only", "Evidence"],
    github: "https://github.com/yyfyydshh/hot-news-brief-skill",
    orbit: "satellite",
    icon: "radio",
    visualMode: "broadcast-pulse",
    demo: {
      src: "/videos/hot-news-brief/demo-v003.mp4",
      poster: "/videos/hot-news-brief/poster-v003.jpg",
      description: "用户提供的《蜘蛛侠》历史案例界面复现：从主题判断、快速模式提示，到 27→11→10 的证据筛选与十条新闻交付；非实时新闻流。",
    },
    caseStudy: {
      visualKind: "hot-news-evidence-radar",
      evidenceStatus: "公开 Skill 仓库 / 只读检索 / 机制演示",
      title: "快报真正压缩的不是字数，而是证据选择成本",
      intro: "这个 Skill 把七日时间窗、记录门槛、故事去重、来源分层和输出契约放在摘要之前，让每条结论都能回到同一组可点击新闻。",
      summary: [
        { label: "典型输入", value: "主题、快速/深度检索模式、新闻/决策/选题输出" },
        { label: "我的角色", value: "检索策略、证据门槛、来源治理与输出契约" },
        { label: "证据状态", value: "公开仓库可核验；页面不是实时新闻流" },
      ],
      searchModes: [
        { id: "fast", label: "快速检索", note: "默认模式：用一批查询快速确认最近七日的合格新闻。", queryCount: 1 },
        { id: "deep", label: "深度检索", note: "仅在明确要求时使用六个不重叠角度扩展覆盖。", queryCount: 6 },
      ],
      stages: [
        { id: "intent", title: "主题与模式", short: "先确认要找什么，以及结果用于阅读、决策还是选题。", depth: { purpose: "检索角度与输出深度必须由任务目标决定，而不是先搜一堆内容再拼答案。", mechanism: ["topic 必填，默认使用 fast 与 news_list。", "decision_brief、content_radar 或 both 只在需要时启用。", "深度模式固定六个不重叠角度，不追加第七批。"], artifacts: [{ name: "检索意图", role: "主题、检索模式与输出模式" }], decision: "目标不清时先确认；被安全门拒绝的主题不进入检索。" } },
        { id: "window", title: "严格七日窗口", short: "所有候选记录必须落在 D-6 到 D0。", depth: { purpose: "“最近”如果没有可执行时间边界，就无法复核也无法稳定重复。", mechanism: ["检索固定 freshness=oneWeek。", "解析每条记录的发布日期。", "排除未来日期和七日窗口外记录。"], artifacts: [{ name: "窗口判定", role: "发布日期与保留/排除理由" }], decision: "日期无效、未来或窗口外记录全部排除。" } },
        { id: "contract", title: "记录证据门", short: "标题、HTTP(S) URL 与有效日期必须来自同一条记录。", depth: { purpose: "没有可点击原链或明确日期的内容，无法承担快报证据。", mechanism: ["检查非空标题。", "只接受 HTTP(S) 原文 URL。", "绑定同一记录中的来源与发布日期。"], artifacts: [{ name: "合格记录", role: "标题、URL、来源、日期四项合同" }], decision: "任一字段缺失就进入排除记录，不用别的记录拼接补齐。" } },
        { id: "dedupe", title: "故事去重", short: "规范链接并合并指向同一事件的重复报道。", depth: { purpose: "重复链接、镜像页和同一故事的改写会制造虚假的覆盖感。", mechanism: ["规范协议、域名、路径与追踪参数。", "先做 URL 去重，再判断近似故事。", "同一故事保留一条更适合作为证据的记录。"], artifacts: [{ name: "去重说明", role: "保留记录与被合并记录的理由" }], decision: "相似度不足时不强行合并；确属同一故事时只保留一条。" } },
        { id: "source", title: "来源分层与平衡", short: "来源质量决定它能支撑什么类型的判断。", depth: { purpose: "内容平台适合发现角度，却不应单独支撑企业高影响事实结论。", mechanism: ["决策信源、内容平台与国际信源分层。", "按相关性、来源质量、时效、影响与新颖度排序。", "最终每个域名最多保留两条。"], artifacts: [{ name: "来源构成", role: "域名、来源层级与单域数量" }], decision: "信源过于单一时减少结论强度，并在覆盖说明中披露。" } },
        { id: "select", title: "证据集合", short: "从合格候选中形成最多十条的平衡集合。", depth: { purpose: "输出模式可以不同，但新闻事实底座必须保持一致。", mechanism: ["最终新闻最多十条，不足不补。", "所有事实总结只引用入选新闻。", "同一集合同时服务清单、决策与选题输出。"], artifacts: [{ name: "最终新闻集合", role: "可点击标题、来源与日期" }], decision: "没有合格记录时返回明确空结果，不生成无证据摘要。" } },
        { id: "output", title: "证据绑定输出", short: "新闻、判断与选题共享同一组来源。", depth: { purpose: "防止摘要或建议在脱离新闻证据后继续扩写。", mechanism: ["事实短句为零到三条。", "决策简报最多三条变化、影响与动作。", "选题雷达最多三个角度、受众、标题与切口。"], artifacts: [{ name: "覆盖说明", role: "检索模式、条目数量与材料缺口" }], decision: "证据不足时减少项目；不虚构热度、指标、份额、因果或预测。" } },
      ],
      sourceTiers: [
        { label: "决策信源", role: "支持政策、企业与行业高影响事实判断。" },
        { label: "内容平台", role: "支持舆论线索与内容选题，不单独承担高影响结论。" },
        { label: "国际信源", role: "补充全球事件与跨市场视角。" },
      ],
      exclusions: [
        { reason: "窗口外或未来日期", treatment: "排除并记录日期原因" },
        { reason: "缺标题 / URL / 日期", treatment: "不进入证据集合" },
        { reason: "重复 URL 或同一故事", treatment: "保留一条代表记录" },
        { reason: "单一域名超出两条", treatment: "按排序保留前两条" },
      ],
      outputModes: [
        { id: "news", label: "新闻清单", detail: "编号、标题原链、来源与日期。" },
        { id: "decision", label: "决策简报", detail: "最多三条变化、影响对象、机会/风险与建议动作。" },
        { id: "radar", label: "选题雷达", detail: "最多三个角度、受众、建议标题与内容切口。" },
        { id: "both", label: "组合输出", detail: "决策与选题共用同一最终新闻集合。" },
      ],
      boundary: "这是只读检索与证据筛选机制演示，不是实时新闻流或定时任务；检索覆盖不代表全网完整覆盖，被拒绝主题会在搜索前停止。",
    },
  },
  {
    slug: "humanizer",
    index: "07",
    title: "文学文风自适应 Humanizer 套件",
    shortTitle: "Humanizer",
    category: "专业 Skill",
    tagline: "在作者声音与内容完整性约束下，完成最小幅度、可审计的文学编辑。",
    mastFacts: {
      input: "文本、作者样本与编辑边界",
      judgment: "文风画像与最小编辑",
      output: "修订稿、对照与风险复核",
    },
    problem: "通用改写容易抹平作者差异，也可能为追求“自然”而擅自改变剧情、意象与结尾。",
    judgment: "完整性优先于降低风险分；先确认画像和内容锁，再决定最小编辑动作。",
    system: ["文学范围门", "文风画像确认", "内容锁定", "最小编辑", "双层审计与四角复核"],
    reliability: ["恒稳/单篇分流", "画像确认门", "实质变化阻断", "最多三轮安全返修"],
    outputs: ["文风画像", "另存修改稿", "完整性审计", "启发式风险复核"],
    reuse: "把作者声音保护、内容锁定和多角色审计沉淀为可复用的文学编辑安全系统。",
    tags: ["Writing", "Routing", "Audit"],
    github: "https://github.com/yyfyydshh/humanizer-literary-suite",
    orbit: "satellite",
    icon: "pen",
    visualMode: "editorial-audit",
    demo: {
      src: "/videos/humanizer-literary-demo.mp4",
      poster: "/videos/humanizer-literary-demo-poster.png",
      description: "真实前后稿短摘录 + Agent 流程重建：用三处可对照改动说明，文学去 AI 味不是把文本磨成统一口吻，而是在内容锁定与证据边界内做最小编辑。",
    },
    caseStudy: {
      visualKind: "humanizer-voice-chamber",
      evidenceStatus: "公开 Skill 套件 / 用户确认短摘录 / 机制演示",
      title: "去 AI 味不是统一润色，而是保护作者声音的约束编辑",
      intro: "套件先判断文本范围，再确认文风画像、锁定不可改变的内容，最后只对证据指向的片段做最小编辑，并用完整性审计决定是否允许交付。",
      summary: [
        { label: "典型输入", value: "小说、散文、叙事文学或文学化非虚构" },
        { label: "我的角色", value: "画像、编辑、完整性审计与四角复核流程编排" },
        { label: "证据状态", value: "公开套件可核验；视频仅展示用户确认公开的前后稿短摘录" },
      ],
      modes: [
        { id: "steady", label: "恒稳模式", note: "为长期作者建立高置信度、可复用的文风画像。", requirements: ["至少三篇作者确认的相近代表作", "首次建立或更新后重新确认", "画像保存到当前项目"] },
        { id: "single", label: "单篇模式", note: "只从当前目标稿建立临时、低置信度画像。", requirements: ["不需要代表作样本", "画像必须展示并确认", "临时画像不保存"] },
      ],
      stages: [
        { id: "scope", title: "文学范围门", short: "先判断它是不是本套件允许处理的文学文本。", depth: { purpose: "文学去 AI 规则不适用于营销、职场、科普、学术或一般知识文本。", mechanism: ["识别小说、散文、叙事文学与文学化非虚构。", "不确定类型时先澄清用途与体裁。", "非文学文本说明边界后停止。"], artifacts: [{ name: "范围判定", role: "文本类型与允许/停止理由" }], decision: "非文学文本不进入画像与编辑阶段。" } },
        { id: "profile", title: "文风画像确认", short: "把“像作者”转成有证据、可修正的画像。", depth: { purpose: "没有确认画像，编辑就容易把作者声音替换成模型偏好的统一语气。", mechanism: ["分析视角距离、节奏、用词、对白、意象与情绪。", "列出应保护特征、模板重叠风险与修改方向。", "展示证据和置信度，等待用户明确确认。"], artifacts: [{ name: "文风画像", role: "特征、证据、置信度与修改方向" }], decision: "用户未确认或提出修正时停止改稿，先更新画像再确认。" } },
        { id: "lock", title: "内容锁定", short: "把不能因降 AI 风险而改变的内容变成硬约束。", depth: { purpose: "降低语言模板感不能凌驾于剧情、人物、情感、意象和结局。", mechanism: ["锁定人物关系、视角、时态、时间线与场景。", "锁定事件因果、对白意图、物件、意象与伏笔。", "锁定情绪曲线、结局、立场和用户指定原句。"], artifacts: [{ name: "内容锁定清单", role: "原稿中必须保持的叙事与语言事实" }], decision: "锁定项未确认或无法识别时不进入编辑。" } },
        { id: "edit", title: "最小文学编辑", short: "只处理有证据的痕迹片段，保留作者的例外与留白。", depth: { purpose: "真正的自然感来自作者自身节奏，而不是机械替换词和统一句长。", mechanism: ["依次检查解释性回声、模板脚手架、作者节奏与物件数字。", "保护有证据的短句、比喻、重复、否认、数字与意象。", "不新增背景、动机、情节、事实或象征解释。"], artifacts: [{ name: "改动记录", role: "原片段、修改片段、依据与保护项" }], decision: "没有明确证据的片段不改；可能改变锁定内容的建议直接撤销。" } },
        { id: "deterministic", title: "确定性检查", short: "先检查标题、数字、名称、原句、引号、段落与结尾。", depth: { purpose: "可机械验证的漂移应在语义审阅前被快速暴露。", mechanism: ["比较标题、数字序列和受保护名称。", "检查必要原句、中文引号配对与空文本。", "识别段落数量异常和结尾变化。"], artifacts: [{ name: "确定性检查结果", role: "逐项 PASS / FAIL 与撤销建议" }], decision: "任一硬检查失败就返回编辑阶段撤销相关改动。" } },
        { id: "semantic", title: "语义完整性审计", short: "比较原稿与改稿的叙事、情感和创作立场。", depth: { purpose: "高文本相似度也可能掩盖人物动机、视角距离或结尾余味的实质变化。", mechanism: ["逐项比较人物、关系、信息权限与时间线。", "核对事件因果、对白潜台词、意象和伏笔。", "比较情绪累积、高潮、结尾余味与创作立场。"], artifacts: [{ name: "语义审计", role: "原稿证据、改稿证据与实质变化清单" }], decision: "任何实质变化都判定 FAIL；风险分再低也不能覆盖完整性失败。" } },
        { id: "review", title: "四角独立复核", short: "四个隔离视角分别给出有位置证据的风险判断。", depth: { purpose: "单一审稿视角容易把个人偏好误当成 AI 痕迹，也容易忽略叙事损伤。", mechanism: ["文风一致性只判断是否偏离已确认画像。", "AI 语言只检查模板转折、回声、机械节奏等信号。", "叙事完整性与冷读者分别审阅内容安全和阅读感受。"], artifacts: [{ name: "四份复核意见", role: "风险分、置信度、具体位置与短证据" }], decision: "无具体证据不扣分；分歧过大时需要独立仲裁。" } },
        { id: "deliver", title: "安全返修与交付", short: "只返修证据指向片段，最多三轮，必要时主动停止。", depth: { purpose: "分数不是终点；继续降分如果伤害内容，就必须保留更安全的版本。", mechanism: ["汇总去重后的证据片段。", "每轮返修后重新运行完整性与四角复核。", "另存修改稿与审计报告，绝不覆盖原稿。"], artifacts: [{ name: "修改稿 + 审计报告", role: "模式、画像、改动、风险与完整性结论" }], decision: "风险不高于 20 且完整性通过才交付；最多三轮，伤害内容时停止并如实标记。" } },
      ],
      locks: [
        { id: "people", label: "人物与关系", protects: "人物增删、关系与行为动机" },
        { id: "voice", label: "视角与距离", protects: "叙述视角、时态、信息权限与距离" },
        { id: "timeline", label: "时间线与事件", protects: "场景顺序、事件与因果关系" },
        { id: "dialogue", label: "关键对白", protects: "表层信息、潜台词与对话意图" },
        { id: "image", label: "物件与意象", protects: "核心物件、意象系统与伏笔" },
        { id: "emotion", label: "情绪曲线", protects: "起点、累积、高潮与结尾余味" },
        { id: "ending", label: "结局与立场", protects: "结局落点、创作判断与原样保留句" },
      ],
      reviewers: [
        { id: "style", label: "文风一致性", focus: "是否仍符合已确认画像，是否被统一成平滑替代腔。" },
        { id: "language", label: "AI 语言", focus: "模板转折、解释性回声、机械节奏、伪精确与公式化结尾。" },
        { id: "integrity", label: "叙事完整性", focus: "剧情与情感是否变化，是否新造动机、对白或象征。" },
        { id: "reader", label: "冷读者", focus: "普通文学读者感受到的生成感与作者气息。" },
      ],
      deliverables: [
        { label: "另存修改稿", detail: "保留原稿；文件名自动避让覆盖。" },
        { label: "审计报告", detail: "记录模式、画像、改动、四角复核、完整性与停止原因。" },
        { label: "明确结论", detail: "通过，或因内容保护而停止且未达启发式门槛。" },
      ],
      boundary: "只处理文学文本；启发式风险分不代表真实 AI 参与比例或来源鉴定。视频仅展示用户确认公开的前后稿短摘录，不展示全文，也不宣称未提供的审计结论。",
    },
  },
];

export const metrics = [
  { value: "1200+", label: "用户咨询与问题", note: "当前工作累计" },
  { value: "240+", label: "企业复杂问题", note: "深度解决" },
  { value: "8+", label: "培训 / 活动", note: "主讲并交付" },
  { value: "4600+", label: "年度客户问题", note: "上一阶段" },
];

export const notes = [
  {
    slug: "ai-capability-reuse",
    title: "从一张排版错位的小图，到另一条产品线的文档站上线",
    summary: "我如何把一次 AI 文档迁移，整理成同事可以复用的经验包。",
    theme: "能力复用",
    readingTime: "约 9 分钟",
    conclusionType: "方法复盘",
    readingDirection: "从一次问题到可复用能力",
  },
  {
    slug: "agent-reliability",
    title: "Agent 跑完了，不等于任务完成了",
    summary: "从一次舆情分析实践，到我的六个可靠性检查点。",
    theme: "可靠性交付",
    readingTime: "约 11 分钟",
    conclusionType: "边界判断",
    readingDirection: "从任务跑完到可信完成",
  },
];

export const experiences = [
  {
    period: "2025.10—至今",
    company: "深圳数阔信息技术有限公司（八爪鱼）",
    role: "软件技术支持（兼产品运营与 AI 场景建设）",
    status: "当前阶段",
    scope: ["企业客户交付", "产品运营", "AI 场景建设"],
    summary: "把一线问题继续向前推进：不仅解决当次交付，还识别可复用场景，并沉淀为 Skill、工作流、案例与教程。",
    responsibilities: [
      "负责企业客户交付、产品运营及 AI 场景建设，累计处理 1200+ 用户咨询与问题，深度解决 240+ 企业及长期团队客户的复杂问题。",
      "围绕 MCP / CLI、RPA 与知识内容建设，将共性需求组织为“测试—场景设计—案例沉淀—教程文档—推广赋能”的标准化交付闭环。",
      "兼顾客户价值、产品质量与商业转化，协同支撑高版本转化、团队版续费及新增 29 单，并推进模板治理与自动化检测。",
    ],
    progression: "客户问题 → 共性场景 → AI 能力产品化 → 团队复用",
    facts: [
      { value: "1200+", label: "用户咨询与问题" },
      { value: "240+", label: "企业及长期团队复杂问题" },
      { value: "8+", label: "企业培训及产品活动" },
      { value: "29", label: "协同支撑新增订单" },
      { value: "116+", label: "模板修复 / 修改" },
      { value: "279+", label: "单轮周期检测模板" },
    ],
  },
  {
    period: "2024.03—2025.09",
    company: "北京掌上先机网络科技有限公司",
    role: "技术支持 / 产线技术支持组负责人",
    status: "能力基座",
    scope: ["电商业财 SaaS", "SQL 数据核查", "团队支持机制"],
    summary: "从高频系统排查进入团队管理，在真实业务压力下建立问题定位、跨级协同与知识沉淀的交付底座。",
    responsibilities: [
      "负责慧经营电商业财 SaaS 的系统配置、SQL 数据核查及多平台账务问题定位，年度处理客户问题 4600+。",
      "入职一年内晋升产线技术支持组负责人，搭建三级支持机制，提升紧急问题周转效率并缩短复杂问题处理周期。",
      "沉淀 50+ 典型问题案例并组织 10+ 场内部培训，把个人排查经验转化为团队可复用的处理方法。",
    ],
    progression: "系统排查 → 三级支持 → 团队管理 → 知识复用",
    facts: [
      { value: "4600+", label: "年度客户问题" },
      { value: "1 年内", label: "晋升组负责人" },
      { value: "+30%", label: "紧急问题周转效率" },
      { value: "-20%", label: "复杂问题处理周期" },
      { value: "50+", label: "典型问题案例" },
      { value: "10+", label: "内部培训" },
      { value: "+25%", label: "团队平均处理效率" },
    ],
  },
];

export const careerFoundation = {
  overview: [
    { value: "2年+", label: "SaaS 技术支持、产品运营与团队管理经验" },
    { value: "覆盖", label: "电商业财、网页数据采集及 RPA 产品" },
    { value: "闭环", label: "需求拆解、方案设计、测试验收、文档发布与用户赋能" },
  ],
  education: {
    school: "湖南工学院",
    degree: "物联网工程｜本科",
    period: "2020.10—2024.06",
    result: "专业排名前 20%",
  },
  certificates: ["大学英语四级", "全国计算机二级", "普通话二级甲等"],
};
