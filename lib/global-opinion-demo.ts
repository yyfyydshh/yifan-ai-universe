// Deliberately fictional, deterministic samples. The counters describe the
// walkthrough; they are not measured results from a live Skill run.
export const opinionDemoSummary = { batches: [52, 52, 52], raw: 156, valid: 128, domains: 6, sourceTypes: 3 } as const;

export const opinionPapers = [
  { kind: "新闻", title: "售后服务调整引发讨论", source: "示例新闻站 A", daysAgo: 4, region: "欧洲" },
  { kind: "社区", title: "用户分享维修等待经历", source: "示例社区 B", daysAgo: 8, region: "北美" },
  { kind: "社交", title: "近期服务体验话题", source: "示例讨论页 C", daysAgo: 12, region: "东亚" },
  { kind: "公开网页", title: "品牌服务说明更新", source: "示例网页 D", daysAgo: 17, region: "其他地区" },
] as const;

export type OpinionEvidence = {
  id: string;
  title: string;
  deskTitle: string;
  source: string;
  kind: string;
  region: string;
  daysAgo: number;
  summary: string;
  original: string;
};

export const opinionEvidence: readonly OpinionEvidence[] = [
  {
    id: "EV-014", title: "售后咨询量上升的讨论", deskTitle: "售后咨询讨论", source: "示例新闻站 A", kind: "新闻", region: "欧洲", daysAgo: 4,
    summary: "报道描述某品牌近期售后咨询与等待时间受到关注。",
    original: "部分顾客关心售后预约的等待时间。品牌回应，将继续增加服务时段。",
  },
  {
    id: "EV-028", title: "维修等待体验反馈", deskTitle: "维修等待反馈", source: "示例社区 B", kind: "社区", region: "北美", daysAgo: 8,
    summary: "多条模拟用户反馈集中在预约和进度告知。",
    original: "预约维修后，希望更早知道预计完成时间，也想在进度变化时收到通知。门店解释比较清楚，但等待仍让人着急。",
  },
  {
    id: "EV-041", title: "服务说明页面更新", deskTitle: "服务说明更新", source: "示例网页 D", kind: "公开网页", region: "欧洲", daysAgo: 17,
    summary: "模拟品牌页面补充了售后预约与进度说明。",
    original: "服务说明新增了预约入口、进度通知与常见问题。顾客可以查看维修进度，接收预计完成时间的更新。",
  },
];
