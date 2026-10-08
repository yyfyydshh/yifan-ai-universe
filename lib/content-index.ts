import { notes, type NoteEntry } from "@/lib/site-data";

export type NoteSection = "writing" | "thoughts";
export type Note = NoteEntry;

export function getNoteSection(note: Note): NoteSection {
  return note.section ?? (note.conclusionType === "个人随笔" ? "writing" : "thoughts");
}

export function getNoteHref(note: Note) {
  return `/${getNoteSection(note)}/${note.slug}`;
}

export function getSectionNotes(section: NoteSection) {
  return notes.filter(note => getNoteSection(note) === section);
}

export function getLegacySectionNotes(section: NoteSection) {
  return notes.filter(note => note.legacySections?.includes(section));
}

export function findNote(slug: string, section?: NoteSection) {
  return notes.find(note => note.slug === slug && (!section || getNoteSection(note) === section || note.legacySections?.includes(section)));
}
