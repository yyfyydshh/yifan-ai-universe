import { PendingZoneContent } from "@/components/zone-content";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "杂物间｜杨逸凡的世界", description: "一些没分类的东西，也很珍贵。小收藏与日常记录待更新。", pathname: "/stuff" });
export default function StuffPage() { return <PendingZoneContent zoneId="stuff" />; }
