import { WritingRoom } from "@/components/writing-room";
import { getSectionNotes } from "@/lib/content-index";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({ title: "写作小屋｜杨逸凡的世界", description: "用文字记录生活，也构建另一个世界。杨逸凡的个人随笔。", pathname: "/writing" });

export default function WritingPage() {
  return <main className="writing-room-page"><WritingRoom articles={getSectionNotes("writing")} /></main>;
}
