import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const media = [
  { id: "global-opinion", video: "public/videos/global-opinion/global-opinion-agent-demo-web-v002.mp4", poster: "public/videos/global-opinion-agent-demo-poster.jpg", expectedDuration: 54.634 },
  { id: "sales-copilot", video: "public/videos/sales-copilot/demo-v001.mp4", poster: "public/videos/sales-copilot/poster-v001.jpg", expectedDuration: 72 },
  { id: "docs-system", video: "public/videos/docs-site/demo-v001.mp4", poster: "public/videos/docs-site/poster-v001.jpg", expectedDuration: 24 },
  { id: "regulatory-risk", video: "public/videos/financial-regulatory-risk-monitor/demo-v002.mp4", poster: "public/videos/financial-regulatory-risk-monitor/poster-v002.jpg", expectedDuration: 78 },
  { id: "tender-cleaner", video: "public/videos/tender-cleaner-29field.mp4", poster: "public/videos/tender-cleaner-29field-poster.png", expectedDuration: 38 },
  { id: "hot-news-brief", video: "public/videos/hot-news-brief/demo-v003.mp4", poster: "public/videos/hot-news-brief/poster-v003.jpg", expectedDuration: 42 },
  { id: "humanizer", video: "public/videos/humanizer-literary-demo.mp4", poster: "public/videos/humanizer-literary-demo-poster.png", expectedDuration: 60 },
];

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const manifest = { generatedAt: new Date().toISOString(), media: [] };

for (const item of media) {
  for (const path of [item.video, item.poster]) {
    if (!existsSync(resolve(path))) throw new Error(`Missing media asset: ${path}`);
  }
  const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", resolve(item.video)], { encoding: "utf8" }));
  const video = probe.streams.find(stream => stream.codec_type === "video");
  const audio = probe.streams.find(stream => stream.codec_type === "audio");
  const duration = Number(probe.format.duration);
  if (!video || video.codec_name !== "h264") throw new Error(`${item.video} must use H.264`);
  if (video.pix_fmt !== "yuv420p") throw new Error(`${item.video} must use yuv420p`);
  if (video.width > 1920 || video.height > 1080) throw new Error(`${item.video} exceeds 1080p`);
  if (Math.abs(duration - item.expectedDuration) > 0.12) throw new Error(`${item.video} duration drifted from ${item.expectedDuration}s to ${duration}s`);
  const absoluteVideo = resolve(item.video);
  const bytes = readFileSync(absoluteVideo);
  const header = bytes.subarray(0, Math.min(bytes.length, 1024 * 1024)).toString("latin1");
  const moov = header.indexOf("moov");
  const mdat = header.indexOf("mdat");
  const faststart = moov >= 0 && (mdat < 0 || moov < mdat);
  if (item.id === "global-opinion" && !faststart) throw new Error("Global-opinion Web video is missing faststart");
  manifest.media.push({
    ...item,
    duration,
    bytes: Number(probe.format.size),
    sha256: sha256(absoluteVideo),
    codec: video.codec_name,
    pixelFormat: video.pix_fmt,
    resolution: `${video.width}x${video.height}`,
    frameRate: video.r_frame_rate,
    audioCodec: audio?.codec_name ?? null,
    faststart,
  });
}

const output = resolve("docs/media-manifest.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Verified ${manifest.media.length} videos and posters. Manifest: ${output}`);
