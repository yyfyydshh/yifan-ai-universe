import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const alt = "杨逸凡的世界：项目、文字与思考";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered from references/drafts/world-v1/share-card-source.tsx. Serving the
// reviewed local PNG keeps sharing independent of remote font services.
export default async function OpenGraphImage() {
  const image = await readFile(join(process.cwd(), "public/world/share-card.png"));
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": contentType },
  });
}
