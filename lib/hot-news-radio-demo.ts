/** Fictional records only. Reserved .example URLs identify local demo originals,
 * never public news links. Dates are anchored to the displayed sample day. */
export const newsRadioSampleDay = "2026-09-30";
export type NewsChannelId = "ai" | "consumer" | "quiet";
export type NewsView = "news" | "decision" | "angle";
export type RadioNews = {
  id: string; title: string; source: string; url: string; date: string;
  story: string; original: string; summary: string; decision: string; angle: string;
};
export type NewsChannel = { id: NewsChannelId; label: string; topic: string; records: RadioNews[] };

function record(id: string, title: string, source: string, domain: string, date: string, story: string, original: string, decision: string, angle: string): RadioNews {
  return { id, title, source, url: `https://${domain}.example/news/${id}`, date, story, original, summary: original.split("。")[0] + "。", decision, angle };
}

const ai: RadioNews[] = [
  record("AI-01", "青岚文档助手开放试用", "演示来源 A · 产品公告", "product", "2026-09-29", "ai-trial", "青岚工作室开放文档助手试用，提供文档检索与引用定位功能。试用页面说明，答案应与引用段落一起核对。此记录为虚构演示原文。", "变化：文档助手开放试用。建议先用已有资料核对引用定位，暂不推断实际效率。", "给知识工作者：以“回答能否回到原文”为切口，设计一次文档助手体验。"),
  record("AI-02", "开发团队补充试用边界说明", "演示来源 A · 使用指引", "product", "2026-09-28", "ai-guide", "开发团队补充试用说明：未检索到原文时应明确提示，不能把生成内容当作原文证据。说明没有公布使用效果数据。此记录为虚构演示原文。", "变化：试用边界进一步说明。建议把“没有依据时怎样回答”纳入试用检查。", "给产品读者：用有依据与没有依据的两种提问，讲清文档助手的边界。"),
  record("AI-03", "社区分享引用核对体验", "演示来源 B · 社区记录", "community", "2026-09-27", "ai-community", "一位社区作者分享文档助手体验，逐条打开引用段落核对回答。文章是个人体验，不能代表全部用户，也没有比较不同产品的效果。此记录为虚构演示原文。", "线索：出现引用核对的使用体验。可以继续访谈使用者，不能据此判断整体口碑。", "给创作者：以一次引用核对过程为案例，展示读者怎样复核 AI 回答。"),
  record("AI-04", "文档助手试用版上线消息", "演示来源 C · 转述", "repost", "2026-09-28", "ai-trial", "这条消息转述同一次文档助手开放试用，没有增加新的事件信息。此记录为虚构演示原文。", "", ""),
  record("AI-05", "月初工具体验整理", "演示来源 B · 旧记录", "community", "2026-09-12", "ai-old", "月初的工具体验整理，已经不在本次演示的近七日窗口内。此记录为虚构演示原文。", "", ""),
  record("AI-06", "工具新版本传闻", "演示来源 C · 未标日期", "repost", "", "ai-rumor", "一条没有发布日期的新版本线索，无法确认是否为最近七日的变化。此记录为虚构演示原文。", "", ""),
  record("AI-07", "开发团队发布功能预告", "演示来源 A · 产品公告", "product", "2026-09-26", "ai-next", "开发团队发布功能预告。本次样本已有同一来源的两条更优先记录，避免让单一来源占满快报。此记录为虚构演示原文。", "", ""),
];
const consumer: RadioNews[] = [
  record("CS-01", "青岚门店开放自提预约", "演示来源 A · 门店公告", "store", "2026-09-29", "pickup", "青岚门店上线自提预约，顾客可先选择领取时段，再到店取货。公告没有提供订单量或增长数据。此记录为虚构演示原文。", "变化：门店增加自提预约。建议核对预约流程与到店交接，暂不判断销售增长。", "给消费读者：以“预约后怎样取货”为切口，记录完整自提流程。"),
  record("CS-02", "门店公布周末体验规则", "演示来源 A · 活动说明", "store", "2026-09-28", "weekend", "门店公布周末体验活动的预约与取消规则，参加者需要按说明选择时段。说明没有披露活动效果。此记录为虚构演示原文。", "变化：活动预约规则明确。建议检查用户能否轻松找到取消说明。", "给内容团队：从预约和取消两种场景，解释周末体验的参加条件。"),
  record("CS-03", "社区作者记录到店体验", "演示来源 B · 社区记录", "consumer-community", "2026-09-27", "store-experience", "社区作者记录一次到店领取体验，并描述到店后的确认步骤。材料只反映一次个人经历，不能代表所有顾客。此记录为虚构演示原文。", "线索：出现到店流程体验。可进一步收集不同顾客的反馈，不据此判断普遍满意度。", "给生活创作者：围绕一次到店领取，讲清用户实际需要做哪些动作。"),
  record("CS-04", "门店自提服务消息", "演示来源 C · 转述", "consumer-repost", "2026-09-28", "pickup", "转述同一次自提预约上线，没有新的事件信息。此记录为虚构演示原文。", "", ""),
  record("CS-05", "上月门店观察", "演示来源 B · 旧记录", "consumer-community", "2026-08-29", "old-store", "上月的门店观察，不属于近七日窗口。此记录为虚构演示原文。", "", ""),
  record("CS-06", "未标日期的活动照片", "演示来源 C · 未标日期", "consumer-repost", "", "undated-store", "活动照片没有说明发布日期，无法核对时效。此记录为虚构演示原文。", "", ""),
];
export const newsRadioChannels: NewsChannel[] = [
  { id: "ai", label: "AI 工具", topic: "AI 工具的新变化", records: ai },
  { id: "consumer", label: "新消费", topic: "门店与消费体验", records: consumer },
  { id: "quiet", label: "冷门样本", topic: "没有近期合格消息的主题", records: [
    record("QT-01", "较早的一次项目记录", "演示来源 A · 旧记录", "quiet", "2026-08-01", "quiet-old", "一条较早的项目记录，未落在本次演示的近七日窗口。此记录为虚构演示原文。", "", ""),
    record("QT-02", "没有日期的讨论线索", "演示来源 B · 未标日期", "quiet-community", "", "quiet-date", "讨论线索没有发布日期，无法确认时效。此记录为虚构演示原文。", "", ""),
  ] },
];

export type RejectedNews = { news: RadioNews; reason: string };
export function curateRadioNews(records: RadioNews[]) {
  const accepted: RadioNews[] = [], rejected: RejectedNews[] = [];
  const stories = new Set<string>(), urls = new Set<string>(), domains = new Map<string, number>();
  const now = Date.parse(`${newsRadioSampleDay}T23:59:59Z`);
  for (const news of records) {
    let reason = "", domain = "";
    const date = Date.parse(`${news.date}T12:00:00Z`);
    try { const url = new URL(news.url); if (!["https:", "http:"].includes(url.protocol)) throw new Error(); domain = url.hostname; }
    catch { reason = "缺少可核对的原始链接"; }
    if (!reason && !news.title.trim()) reason = "缺少新闻标题";
    if (!reason && (!news.date || Number.isNaN(date))) reason = "没有明确的发布日期";
    if (!reason && (date > now || now - date > 7 * 86400000)) reason = "不在最近七日内";
    if (!reason && (stories.has(news.story) || urls.has(news.url))) reason = "同一消息已经留下，不重复收录";
    if (!reason && (domains.get(domain) ?? 0) >= 2) reason = "同一来源已有两条，给其他来源留位置";
    if (reason) rejected.push({ news, reason });
    else { accepted.push(news); stories.add(news.story); urls.add(news.url); domains.set(domain, (domains.get(domain) ?? 0) + 1); }
  }
  return { accepted, rejected };
}
