import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteArticle } from "@/components/note-article";
import { findNote, getNoteHref, getSectionNotes } from "@/lib/content-index";
import { buildPageMetadata } from "@/lib/site-config";

export const dynamicParams = false;
export function generateStaticParams() { return getSectionNotes("thoughts").map(note => ({ slug: note.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = findNote(slug, "thoughts");
  if (!note) return {};
  return buildPageMetadata({ title: `${note.title}｜杨逸凡`, description: note.summary, pathname: getNoteHref(note), type: "article" });
}

export default async function ThoughtArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = findNote(slug, "thoughts");
  if (!note) notFound();
  return <NoteArticle note={note} />;
}
