import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/markdown-article";
import { ArticleReader } from "@/components/article-reader";
import { notes } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-config";

export function generateStaticParams() { return notes.map(note => ({ slug: note.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find(item => item.slug === slug);
  if (!note) return {};
  return buildPageMetadata({
    title: `${note.title}｜杨逸凡`,
    description: note.summary,
    pathname: `/notes/${note.slug}`,
    type: "article",
  });
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find(item => item.slug === slug);
  if (!note) notFound();
  const source = await fs.readFile(path.join(process.cwd(), "content", "notes", `${slug}.md`), "utf8");
  return (
    <main className={`article-page ${note.conclusionType === "个人随笔" ? "article-page--essay" : ""}`}>
      <Link href="/notes" className="back-link">← 返回思考</Link>
      <header><p>{note.theme} · {note.readingTime}</p><h1>{note.title}</h1><span>{note.summary}</span></header>
      <ArticleReader title={note.title}><MarkdownArticle source={source} /></ArticleReader>
      <footer>{note.conclusionType === "个人随笔" ? <Link href="/notes">返回思考 →</Link> : <><p>这篇文章记录的是当前实践与判断，不把尚未验证的设计写成既成结果。</p><Link href="/work">查看相关项目 →</Link></>}</footer>
    </main>
  );
}
