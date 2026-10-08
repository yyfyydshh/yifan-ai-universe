import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleReader } from "@/components/article-reader";
import { MarkdownArticle } from "@/components/markdown-article";
import { getNoteSection, type Note } from "@/lib/content-index";
import { getZone } from "@/lib/world-data";

export async function NoteArticle({ note }: { note: Note }) {
  const section = getNoteSection(note);
  const zone = getZone(section);
  const source = await fs.readFile(path.join(process.cwd(), "content", "notes", `${note.slug}.md`), "utf8");
  return (
    <main className={`article-page ${section === "writing" ? "article-page--essay" : ""}`}>
      <Link href={zone.route} className="back-link"><ArrowLeft size={18} aria-hidden="true" />返回{zone.title}</Link>
      <header><p>{note.theme} · {note.readingTime}</p><h1>{note.title}</h1><span>{note.summary}</span></header>
      <ArticleReader title={note.title}><MarkdownArticle source={source} /></ArticleReader>
      <footer>
        {section === "thoughts" && <p>这篇文章记录的是当前实践与判断，不把尚未验证的设计写成既成结果。</p>}
        <Link href={zone.route}>返回{zone.title}<ArrowRight size={18} aria-hidden="true" /></Link>
        {section === "thoughts" && <Link href="/work">查看相关项目<ArrowRight size={18} aria-hidden="true" /></Link>}
      </footer>
    </main>
  );
}
