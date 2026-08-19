import { NotesFocus } from "@/components/notes-focus";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "思考｜杨逸凡",
  description: "关于 AI 可靠性交付、能力复用和知识工程的实践判断与方法复盘。",
  pathname: "/notes",
});

export default function NotesPage() {
  return (
    <main className="page-shell notes-page">
      <header className="page-intro"><p className="section-label">NOTES</p><h1>把项目里的判断写出来。</h1><p>不是成功学复盘，而是可被检验、也允许继续修正的实践判断。</p></header>
      <NotesFocus />
    </main>
  );
}
