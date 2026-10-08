/** Synthetic, deterministic examples. No customer data or live model output. */
export const salesSample = {
  fileName: "示例客户资料.txt",
  title: "青芽书店 · 需求记录（虚构）",
  source: [
    "我们是一家线上书店，每周需要整理合作方提供的新书目录。",
    "目前由运营同事手动合并表格，常常遇到书名和价格列格式不一致。",
    "希望先把表格整理成统一字段，仍由同事检查后导入现有系统。",
    "还没有确认每周数据量、文件样例、预算和系统接口。",
  ],
  profile: [
    { label: "业务场景", value: "线上书店，每周整理合作方的新书目录。", evidence: "原文第 1 条", kind: "fact" },
    { label: "当前做法", value: "运营人员手动合并表格。", evidence: "原文第 2 条", kind: "fact" },
    { label: "人工边界", value: "整理后仍由同事检查，再导入现有系统。", evidence: "原文第 3 条", kind: "fact" },
    { label: "尚待了解", value: "每周数据量、文件样例、预算、系统接口均未确认。", evidence: "原文第 4 条", kind: "unknown" },
  ],
  needs: [
    { label: "已表达的需求", value: "统一书名和价格列的格式，减少重复整理。", evidence: "原文第 2、3 条", kind: "fact" },
    { label: "可讨论的方向", value: "可能适合先试做表格清洗流程，再评估系统衔接。", evidence: "根据已知需求提出的建议，需客户确认", kind: "inference" },
    { label: "暂不作判断", value: "现有信息不足以判断实施规模、成本或交付周期。", evidence: "关键条件未确认", kind: "unknown" },
  ],
  actions: [
    { label: "先拿到样例", value: "请客户提供一份不含敏感信息的目录表格，以及希望得到的结果。", evidence: "建议动作，尚未执行", kind: "inference" },
    { label: "核对验收方式", value: "确认书名、价格等字段口径，以及需要人工复核的情况。", evidence: "建议动作，尚未执行", kind: "inference" },
    { label: "再讨论衔接", value: "确认每周数据量和现有系统的导入方式后，再评估实现方案。", evidence: "建议动作，不构成报价或承诺", kind: "inference" },
  ],
} as const;

// The labels and order are the existing TenderCaseStudy.fieldGroups contract.
export const tenderFields = [
  "原标题", "来源链接", "项目名称", "招标编号", "项目执行地址", "项目规模",
  "招标范围", "项目工期", "招标金额", "获取招标文件时间", "投标截止时间",
  "开标时间", "开标方式", "开标地点", "招标人", "招标联系人", "招标电话",
  "招标邮箱", "招标地址", "招标单位", "招标代理机构", "代理机构联系人",
  "代理机构电话", "代理机构邮箱", "代理机构地址", "中标人", "中标候选人",
  "中标金额", "中标公告时间",
] as const;

export type TenderField = (typeof tenderFields)[number];

export const tenderSample = {
  fileName: "示例公告.txt",
  title: "青岚学习馆阅览室改造工程招标公告（虚构）",
  source: [
    "项目名称：青岚学习馆阅览室改造工程。招标编号：DEMO-2026-001。",
    "项目执行地址：示例园区 A 栋。改造面积约 1,200 平方米。",
    "招标范围：阅览室室内装修与照明改造。",
    "获取招标文件时间：2026 年 10 月 1 日至 10 月 7 日。标书费：300 元。",
    "投标截止时间：2026 年 10 月 20 日 09:00。开标时间同投标截止时间。",
    "开标方式：线上开标。招标人：青岚学习馆（虚构单位）。",
    "本样本未披露项目工期、预算、联系方式、代理机构和中标结果。",
  ],
} as const;

const tenderKnown: Partial<Record<TenderField, { value: string; evidence: string }>> = {
  原标题: { value: tenderSample.title, evidence: "样本标题" },
  项目名称: { value: "青岚学习馆阅览室改造工程", evidence: "原文第 1 条" },
  招标编号: { value: "DEMO-2026-001", evidence: "原文第 1 条" },
  项目执行地址: { value: "示例园区 A 栋", evidence: "原文第 2 条" },
  项目规模: { value: "改造面积约 1,200 平方米", evidence: "原文第 2 条" },
  招标范围: { value: "阅览室室内装修与照明改造", evidence: "原文第 3 条" },
  获取招标文件时间: { value: "2026 年 10 月 1 日至 10 月 7 日", evidence: "原文第 4 条" },
  投标截止时间: { value: "2026 年 10 月 20 日 09:00", evidence: "原文第 5 条" },
  开标时间: { value: "2026 年 10 月 20 日 09:00", evidence: "原文第 5 条明确说明时间相同" },
  开标方式: { value: "线上开标", evidence: "原文第 6 条" },
  招标人: { value: "青岚学习馆（虚构单位）", evidence: "原文第 6 条" },
};

function missingReason(field: TenderField): string {
  if (field === "招标金额") return "300 元是标书费，不是预算或控制价。";
  if (field === "来源链接") return "本地演示样本未提供来源链接。";
  if (["中标人", "中标候选人", "中标金额", "中标公告时间"].includes(field)) {
    return "本次为招标公告，不推断中标结果。";
  }
  return "原文未明确披露，保持为空。";
}

export const tenderSampleRows = tenderFields.map(field => ({
  field,
  value: tenderKnown[field]?.value ?? "",
  evidence: tenderKnown[field]?.evidence ?? missingReason(field),
}));

export const tenderSampleResult = Object.fromEntries(
  tenderSampleRows.map(({ field, value }) => [field, value]),
) as Record<TenderField, string>;
