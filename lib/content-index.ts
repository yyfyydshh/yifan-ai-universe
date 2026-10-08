import { notes } from "@/lib/site-data";

export type Note = (typeof notes)[number];
export type NoteSection = "writing" | "thoughts";

export function getNoteSection(note: Note): NoteSection {
  return note.conclusionType === "个人随笔" ? "writing" : "thoughts";
}

export function getNoteHref(note: Note) {
  return `/${getNoteSection(note)}/${note.slug}`;
}

export function getSectionNotes(section: NoteSection) {
  return notes.filter(note => getNoteSection(note) === section);
}

export function findNote(slug: string, section?: NoteSection) {
  return notes.find(note => note.slug === slug && (!section || getNoteSection(note) === section));
}
