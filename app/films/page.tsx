import { PendingZoneContent } from "@/components/zone-content";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "放映室｜杨逸凡的世界", description: "好故事，总能让人走得更远。观影记录与片单待更新。", pathname: "/films" });
export default function FilmsPage() { return <PendingZoneContent zoneId="films" />; }
