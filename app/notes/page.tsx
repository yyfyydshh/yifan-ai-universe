import Link from "next/link";
import { NoteList, ZoneHeader } from "@/components/zone-content";
import { notes } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "文字与思考｜杨逸凡的世界", description: "个人随笔、技术观点与方法复盘。", pathname: "/notes" });

export default function NotesPage() {
  return (
    <main className="zone-content-page">
      <ZoneHeader zoneId="thoughts" title="文字与思考" description="把项目里的判断写下来，也记录技术之外的个人随想。" />
      <nav className="zone-archive-nav" aria-label="文章分类"><Link href="/writing">写作小屋 · 个人随笔</Link><Link href="/thoughts">思考山丘 · 方法与判断</Link></nav>
      <NoteList items={notes} />
    </main>
  );
}
