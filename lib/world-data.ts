export type ZoneId = "work" | "writing" | "music" | "games" | "films" | "thoughts" | "stuff";
export type Zone = {
  id: ZoneId; title: string; english: string; description: string; route: string;
  status: "open" | "coming"; asset: string; position: [number, number]; size: number; signPosition: [number, number];
};

// Coordinates belong to one 1600×1120 world. Buildings and signs share the terrain camera.
export const zones: Zone[] = [
  { id: "work", title: "工作室", english: "WORKSHOP", description: "把想法变成作品。这里有我搭建的 AI 工作流、产品实验和技术实践。", route: "/work", status: "open", asset: "workshop-v2", position: [170, 320], size: 340, signPosition: [345, 355] },
  { id: "writing", title: "写作小屋", english: "WRITING", description: "用文字记录生活，也构建另一个世界。收藏那些值得慢慢读的时刻。", route: "/writing", status: "open", asset: "writing", position: [390, 80], size: 330, signPosition: [550, 345] },
  { id: "music", title: "声音房", english: "MUSIC", description: "用声音收藏情绪与时光。音乐与声音作品正在整理，暂未上架。", route: "/music", status: "coming", asset: "music", position: [905, 100], size: 330, signPosition: [1070, 363] },
  { id: "games", title: "游戏桌", english: "GAMES", description: "在游戏里，体验不同的人生。游戏记录与小实验正在整理，暂未上架。", route: "/games", status: "coming", asset: "games", position: [1200, 250], size: 315, signPosition: [1360, 500] },
  { id: "films", title: "放映室", english: "CINEMA", description: "好故事，总能让人走得更远。观影记录与片单正在整理，暂未上架。", route: "/films", status: "coming", asset: "cinema", position: [965, 470], size: 290, signPosition: [1160, 714] },
  { id: "thoughts", title: "思考山丘", english: "THINKING", description: "在这里，和自己对话。记录技术观点、方法复盘，以及实践中的边界。", route: "/thoughts", status: "open", asset: "thinking", position: [190, 670], size: 330, signPosition: [340, 890] },
  { id: "stuff", title: "杂物间", english: "STUFF ROOM", description: "一些没分类的东西，也很珍贵。小收藏与日常记录正在整理，暂未上架。", route: "/stuff", status: "coming", asset: "stuff", position: [1205, 580], size: 310, signPosition: [1360, 825] },
];
export const getZone = (id: ZoneId) => zones.find(zone => zone.id === id)!;

export const worldObjects = [
  { id: "client-folder", zoneId: "work", asset: "folder-v2", position: [230, 510], size: 90, interaction: "drag-to-computer", route: "/work/sales-copilot", previewKey: "sales" },
] as const;

export const worldSize = { width: 1600, height: 1120 };

