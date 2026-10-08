import { NoteList, ZoneContinue, ZoneHeader } from "@/components/zone-content";
import { getSectionNotes } from "@/lib/content-index";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "写作小屋｜杨逸凡的世界", description: "用文字记录生活，也构建另一个世界。杨逸凡的个人随笔。", pathname: "/writing" });

export default function WritingPage() {
  return <main className="zone-content-page"><ZoneHeader zoneId="writing" /><NoteList items={getSectionNotes("writing")} /><ZoneContinue from="writing" /></main>;
}
