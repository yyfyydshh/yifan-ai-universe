import { PendingZoneContent } from "@/components/zone-content";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "游戏桌｜杨逸凡的世界", description: "在游戏里，体验不同的人生。游戏记录与小实验待更新。", pathname: "/games" });
export default function GamesPage() { return <PendingZoneContent zoneId="games" />; }
