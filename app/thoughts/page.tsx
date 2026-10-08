import { NoteList, ZoneContinue, ZoneHeader } from "@/components/zone-content";
import { getSectionNotes } from "@/lib/content-index";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "思考山丘｜杨逸凡的世界", description: "记录技术观点、方法复盘，以及实践中的边界。", pathname: "/thoughts" });

export default function ThoughtsPage() {
  return <main className="zone-content-page"><ZoneHeader zoneId="thoughts" /><NoteList items={getSectionNotes("thoughts")} /><ZoneContinue from="thoughts" /></main>;
}
