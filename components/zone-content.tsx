import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getNoteHref, type Note } from "@/lib/content-index";
import { publicPath } from "@/lib/site-config";
import { getZone, type ZoneId } from "@/lib/world-data";
import "@/app/zone-content.css";

const artwork: Record<ZoneId, string> = {
  work: "/world/workshop-v2.webp",
  writing: "/world/writing.webp",
  music: "/world/music.webp",
  games: "/world/games.webp",
  films: "/world/cinema.webp",
  thoughts: "/world/thinking.webp",
  stuff: "/world/stuff.webp",
};

export function ZoneHeader({ zoneId, title, description }: { zoneId: ZoneId; title?: string; description?: string }) {
  const zone = getZone(zoneId);
  return (
    <header className="zone-content-hero">
      <div className="zone-content-intro">
        <Link href="/" className="zone-back"><ArrowLeft size={18} aria-hidden="true" />回到世界</Link>
        <h1>{title ?? zone.title}</h1>
        <p>{description ?? zone.description}</p>
      </div>
      <div className="zone-content-art" aria-hidden="true">
        <Image src={publicPath(artwork[zoneId])} alt="" width={800} height={640} sizes="(max-width: 640px) 80vw, 440px" unoptimized priority />
      </div>
    </header>
  );
}

export function NoteList({ items }: { items: Note[] }) {
  return (
    <div className="zone-note-list">
      {items.map(note => (
        <article className="zone-note" key={note.slug}>
          <div className="zone-note-meta"><span>{note.theme}</span><span>{note.readingTime}</span></div>
          <h2><Link href={getNoteHref(note)}>{note.title}<ArrowRight size={24} aria-hidden="true" /></Link></h2>
          <p>{note.summary}</p>
        </article>
      ))}
    </div>
  );
}

export function ZoneContinue({ from }: { from: "work" | "writing" | "thoughts" }) {
  const destinations = (from === "work" ? ["writing", "thoughts"] : ["work", from === "writing" ? "thoughts" : "writing"]) as ZoneId[];
  return (
    <nav className="zone-continue" aria-label="继续探索">
      <span>继续走走</span>
      {destinations.map(id => {
        const zone = getZone(id);
        return <Link key={id} href={zone.route}>{zone.title}<ArrowRight size={18} aria-hidden="true" /></Link>;
      })}
    </nav>
  );
}

export function PendingZoneContent({ zoneId }: { zoneId: "music" | "games" | "films" | "stuff" }) {
  const zone = getZone(zoneId);
  return (
    <main className="zone-content-page zone-pending-page">
      <ZoneHeader zoneId={zoneId} />
      <section className="zone-pending" aria-labelledby="pending-title">
        <p className="zone-pending-status">待更新</p>
        <h2 id="pending-title">这里的故事，还在慢慢整理。</h2>
        <p>{zone.title}暂时没有公开内容。可以先到工作室看看已经完成的项目，或去写作小屋读一篇随笔。</p>
        <div className="zone-pending-links">
          <Link className="zone-primary-link" href="/work">去工作室<ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="/writing">去写作小屋<ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
