import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteArticle } from "@/components/note-article";
import { findNote, getNoteHref } from "@/lib/content-index";
import { notes } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-config";

// Keep published URLs working on both a Next.js server and static hosting.
export const dynamicParams = false;
export function generateStaticParams() { return notes.map(note => ({ slug: note.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = findNote(slug);
  if (!note) return {};
  return buildPageMetadata({ title: `${note.title}｜杨逸凡`, description: note.summary, pathname: getNoteHref(note), type: "article" });
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = findNote(slug);
  if (!note) notFound();
  return <NoteArticle note={note} />;
}
