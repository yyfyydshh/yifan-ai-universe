import { StudioRoom } from "@/components/studio-room";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "工作室｜杨逸凡的世界",
  description: "把想法变成作品。杨逸凡的 AI 工作流、产品实验和技术实践。",
  pathname: "/work",
});

export default function WorkPage() {
  return (
    <main className="studio-room-page workshop-page">
      <StudioRoom />
    </main>
  );
}
