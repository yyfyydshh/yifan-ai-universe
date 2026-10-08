import { PendingZoneContent } from "@/components/zone-content";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "声音房｜杨逸凡的世界", description: "用声音收藏情绪与时光。音乐与声音作品待更新。", pathname: "/music" });
export default function MusicPage() { return <PendingZoneContent zoneId="music" />; }
