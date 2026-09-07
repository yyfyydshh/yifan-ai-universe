import { NotesFocus } from "@/components/notes-focus";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "思考｜杨逸凡",
  description: "关于 AI 可靠性交付、能力复用与知识工程的实践判断，以及时代与人的个人随想。",
  pathname: "/notes",
});

export default function NotesPage() {
  return (
    <main className="page-shell notes-page">
      <header className="page-intro"><p className="section-label">NOTES</p><h1>方法与判断</h1><p>把项目里的判断写出来，也记录技术之外的个人随想。</p></header>
      <NotesFocus />
    </main>
  );
}
