import { tenderSample } from "./demo-samples";

// A fictional notice, shared with the existing site demo. These values are
// prepared illustrations of the repository's rules, not a live cleaning run.
export const tenderPrinterSample = tenderSample;

// Exact field names and order from scripts/tender_clean.py, checked against
// references/29-fields.md in tender-cleaner-semantic-29field-skill.
export const tenderPrinterFields = [
  "原标题", "来源链接", "项目名称", "招标编号", "项目执行地址", "项目规模",
  "招标范围", "项目工期", "招标金额", "获取招标文件时间", "投标截止时间",
  "开标时间", "开标方式", "开标地点", "招标人", "招标联系人", "招标人电话",
  "招标单位", "招标人邮箱", "招标人地址", "招标代理机构名称", "招标代理机构地址",
  "招标代理机构联系人", "招标代理机构电话", "招标代理机构邮箱", "中标人",
  "中标候选人", "中标金额", "中标公告时间",
] as const;
export type TenderPrinterField = typeof tenderPrinterFields[number];
export type TenderPrinterRow = { field: TenderPrinterField; value: string; sourceIndex: number | null; note: string };

const known: Partial<Record<TenderPrinterField, Omit<TenderPrinterRow, "field">>> = {
  原标题: { value: tenderSample.title, sourceIndex: null, note: "保留原标题。" },
  项目名称: { value: "青岚学习馆阅览室改造工程", sourceIndex: 0, note: "项目名称来自正文，去掉公告后缀。" },
  招标编号: { value: "DEMO-2026-001", sourceIndex: 0, note: "提取正文里的明确编号。" },
  项目执行地址: { value: "示例园区 A 栋", sourceIndex: 1, note: "提取项目地点，不把开标地点填进来。" },
  项目规模: { value: "改造面积约 1,200 平方米", sourceIndex: 1, note: "数量和单位一起保留。" },
  招标范围: { value: "阅览室室内装修与照明改造", sourceIndex: 2, note: "从采购或招标内容中提取。" },
  获取招标文件时间: { value: "2026 年 10 月 1 日至 10 月 7 日", sourceIndex: 3, note: "文件获取时间与投标截止时间分开记录。" },
  投标截止时间: { value: "2026 年 10 月 20 日 09:00", sourceIndex: 4, note: "按原公告记录截止日期和时间。" },
  开标时间: { value: "2026 年 10 月 20 日 09:00", sourceIndex: 4, note: "原文明说开标时间与投标截止时间相同。" },
  开标方式: { value: "线上开标", sourceIndex: 5, note: "原文明确给出的方式。" },
  招标人: { value: "青岚学习馆（虚构单位）", sourceIndex: 5, note: "招标人与代理机构分别记录。" },
  招标单位: { value: "青岚学习馆（虚构单位）", sourceIndex: 5, note: "未指定其他组织单位时，按仓库口径与招标人一致。" },
};

export const tenderPrinterRows: readonly TenderPrinterRow[] = tenderPrinterFields.map(field => {
  if (known[field]) return { field, ...known[field] } as TenderPrinterRow;
  if (field === "招标金额") return { field, value: "", sourceIndex: 3, note: "300 元是标书费，不是预算或控制价。招标金额留空。" };
  if (field === "来源链接") return { field, value: "", sourceIndex: null, note: "样本未提供原始链接，不猜测或拼造地址。" };
  if (["中标人", "中标候选人", "中标金额", "中标公告时间"].includes(field)) return { field, value: "", sourceIndex: 6, note: "这是招标公告，还没有中标结果，不推断中标人或中标金额。" };
  return { field, value: "", sourceIndex: 6, note: "原公告没有披露，保留空字段，不补写。" };
});
export const tenderPrinterFeatured: readonly TenderPrinterField[] = ["项目名称", "项目规模", "投标截止时间", "招标金额", "中标人"];
