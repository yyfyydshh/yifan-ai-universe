/** Deliberately fictional records, not laws, enforcement records or legal guidance. */
export type BusinessAnswer = "unknown" | "yes" | "no";
export type RegulatoryDemoState = "unknown" | "candidate" | "excluded";
export type RegulatoryDemoRecord = {
  id: string;
  kind: "notice" | "enforcement";
  label: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  body: string;
  action: string;
  status?: "effective" | "draft" | "expired";
  region?: "甲" | "乙";
  duplicateOf?: string;
};

export const regulatoryDemoRecords: readonly RegulatoryDemoRecord[] = [
  {
    id: "REG-DEMO-001", kind: "notice", label: "监管通知", title: "信息保护要求",
    summary: "地区甲 · 持牌机构 · 线上业务",
    source: "演示来源 A · 虚构通知", time: "演示期内 · 第 1 天",
    body: "这是一份为页面交互编写的虚构通知，不是真实法规。演示设定：通知面向在地区甲经营的持牌服务机构，涉及当前演示期内的线上业务，并要求核验客户信息保护流程。判断是否与目标机构相关，需要分别核对地域、主体、业务与时间。没有线上业务时，这条样本不适用；业务未知时保留待确认。仅确认适用条件，不足以断言企业存在违规。",
    action: "核验线上业务的信息保护流程，收集现有控制记录；明确负责人和跟进时间。",
  },
  {
    id: "REG-DEMO-002", kind: "enforcement", label: "处罚案例", title: "同业执法信号",
    summary: "地区甲 · 同类主体 · 线上业务",
    source: "演示来源 B · 虚构案例", time: "演示期内 · 第 2 天",
    body: "这是一份为页面交互编写的虚构处罚案例，不对应真实企业或真实处罚。演示设定：另一家地区甲持牌服务机构的线上业务出现客户信息保护问题。本案例用于提示执法关注方向。需要核对目标机构是否存在相关业务，以及其控制措施是否有可验证证据。即使地域、主体、业务与时间都能对应，也不能据此认定目标机构同样违规；处罚案例不是给目标机构新增监管义务的依据。",
    action: "对照案例检查同类业务的控制措施，记录需要补证的问题；不把他人的处罚写成本企业的违规。",
  },
];

export const regulatoryDemoProfiles: readonly { business: BusinessAnswer; label: string; name: string; fact: string }[] = [
  { business: "yes", label: "线上业务", name: "演示机构 A", fact: "有线上业务，处理客户信息。" },
  { business: "no", label: "仅线下", name: "演示机构 B", fact: "仅有线下业务，没有线上业务。" },
  { business: "unknown", label: "资料不全", name: "演示机构 C", fact: "业务资料缺失，线上业务待确认。" },
];

export function regulatoryDemoFinding(business: BusinessAnswer, record: RegulatoryDemoRecord): { state: RegulatoryDemoState; title: string; reason: string; next: string; boundary: string } {
  if (business === "unknown") return {
    state: "unknown", title: "暂不能判断",
    reason: "消息涉及线上业务，这家公司还缺业务资料。",
    next: "先确认是否有线上业务，再继续核验。",
    boundary: "信息不全时保持待定，不补写企业情况。",
  };
  if (business === "no") return {
    state: "excluded", title: "这条不适用",
    reason: "消息涉及线上业务，这家公司只有线下业务。",
    next: "保留排除理由，业务变化后再核验。",
    boundary: "只排除这条消息，不代表企业没有其他风险。",
  };
  return record.kind === "enforcement" ? {
    state: "candidate", title: "同类业务，关注信号",
    reason: "这是另一家机构的处罚，涉及同类线上业务。",
    next: "对照案例，核验自身的信息保护措施。",
    boundary: "他人的处罚不等于本企业违法，也不自动新增监管义务。",
  } : {
    state: "candidate", title: "相关，建议核验",
    reason: "地域、主体、业务与时间都能对应这份样本。",
    next: "检查信息保护流程，收集现有控制记录。",
    boundary: "条件匹配不等于企业违法，仍需核验真实证据。",
  };
}

export type RegulatoryBucket = "obligation" | "signal" | "pending" | "excluded";
export const regulatoryBuckets: readonly { id: RegulatoryBucket; label: string; explanation: string }[] = [
  { id: "obligation", label: "监管要求", explanation: "适用条件相符，继续核验控制措施。" },
  { id: "signal", label: "执法信号", explanation: "参考同业案例，不认定本企业违法。" },
  { id: "pending", label: "待核实", explanation: "缺资料或未生效，不当作当前直接义务。" },
  { id: "excluded", label: "不适用", explanation: "逐条留下排除理由。" },
];

export const regulatoryDemoBatch: readonly RegulatoryDemoRecord[] = [
  ...regulatoryDemoRecords,
  { ...regulatoryDemoRecords[0], id: "REG-DEMO-003", label: "重复通知", duplicateOf: "REG-DEMO-001" },
  {
    id: "REG-DEMO-004", kind: "notice", label: "草案", title: "信息保护草案",
    summary: "地区甲 · 线上业务 · 尚未生效", source: "演示来源 C · 虚构草案",
    time: "演示期内 · 第 3 天", status: "draft",
    body: "这是一份固定虚构草案，不是真实法规。演示设定：拟议要求面向地区甲持牌机构的线上业务，目前尚未生效。可以跟踪后续变化，但不能把它当作现行直接监管义务；业务资料不全时还需补充企业情况。",
    action: "跟踪草案进展，待生效状态明确后重新核验。",
  },
  {
    id: "REG-DEMO-005", kind: "notice", label: "旧版", title: "旧版信息保护通知",
    summary: "地区甲 · 线上业务 · 已失效", source: "演示来源 D · 虚构旧版通知",
    time: "演示期前 · 已失效", status: "expired",
    body: "这是一份固定虚构旧版通知，不是真实法规。演示设定：它曾涉及地区甲持牌机构的线上业务，但在当前演示期已经失效。保留原文和排除理由，不把它当作当前有效要求。真实项目还需核对修订、替代与衔接规则。",
    action: "留档并核对是否有现行替代要求。",
  },
  {
    id: "REG-DEMO-006", kind: "notice", label: "异地", title: "地区乙信息保护通知",
    summary: "地区乙 · 持牌机构 · 线上业务", source: "演示来源 E · 虚构异地通知",
    time: "演示期内 · 第 4 天", region: "乙",
    body: "这是一份固定虚构通知，不是真实法规。演示设定：通知只适用于地区乙的持牌机构线上业务。本页三家企业样本均只在地区甲经营，因此地域条件不符。不能只因为标题里有信息保护，就把这条要求判给地区甲企业。",
    action: "保留地域不符的排除理由，经营区域变化后再核验。",
  },
];

export function cleanRegulatoryDemoBatch() {
  // Keep every unique record, including drafts and expired records, for the review ledger.
  return regulatoryDemoBatch.filter(record => !record.duplicateOf);
}

export function regulatoryBatchFinding(business: BusinessAnswer, record: RegulatoryDemoRecord): {
  bucket: RegulatoryBucket; reason: string; next: string;
} {
  if (record.status === "expired") return { bucket: "excluded", reason: "当前演示期已失效，不作为现行要求。", next: record.action };
  if (record.region === "乙") return { bucket: "excluded", reason: "消息仅适用于地区乙，企业只在地区甲经营。", next: record.action };
  if (business === "no") return { bucket: "excluded", reason: "涉及线上业务，企业样本仅有线下业务。", next: "保留排除理由，业务变化后重新核验。" };
  if (business === "unknown") return { bucket: "pending", reason: record.status === "draft" ? "业务资料缺失，且草案尚未生效。" : "缺少线上业务资料，暂不能判断是否相关。", next: "先确认企业业务资料，不补写缺失信息。" };
  if (record.status === "draft") return { bucket: "pending", reason: "草案尚未生效，跟踪变化，不当作当前义务。", next: record.action };
  return { bucket: record.kind === "enforcement" ? "signal" : "obligation", reason: record.kind === "enforcement" ? "同类线上业务的执法信号，不等于本企业违法。" : "地域、主体、业务和时间条件相符，仍需核验控制证据。", next: record.action };
}

export function regulatoryDemoAction(record: RegulatoryDemoRecord) {
  return record.kind === "enforcement"
    ? { owner: "合规负责人", due: "下一次例会前", deliverable: "同类业务自查记录" }
    : { owner: "信息安全负责人", due: "5 个工作日内", deliverable: "信息保护核验记录" };
}

export type RegulatoryMatchCheck = { key: string; label: string; state: "match" | "missing" | "mismatch"; detail: string };
/** Applicability only: the illustration does not calculate a risk score or legal finding. */
export function regulatoryMatchChecks(business: BusinessAnswer, record: RegulatoryDemoRecord): RegulatoryMatchCheck[] {
  return [
    { key: "region", label: "地域", state: record.region === "乙" ? "mismatch" : "match", detail: record.region === "乙" ? "消息地区乙 ≠ 企业地区甲" : "都在地区甲" },
    { key: "entity", label: "主体", state: "match", detail: "持牌主体相符" },
    { key: "business", label: "业务", state: business === "unknown" ? "missing" : business === "no" ? "mismatch" : "match", detail: business === "unknown" ? "企业业务资料缺失" : business === "no" ? "线上要求 ≠ 线下业务" : "都有线上业务" },
    { key: "time", label: "时效", state: record.status === "draft" ? "missing" : record.status === "expired" ? "mismatch" : "match", detail: record.status === "draft" ? "草案尚未生效" : record.status === "expired" ? "旧版已经失效" : "在当前演示期内" },
  ];
}
