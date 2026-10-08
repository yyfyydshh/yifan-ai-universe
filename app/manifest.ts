import type { MetadataRoute } from "next";
import { publicPath } from "@/lib/site-config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "杨逸凡的世界",
    short_name: "逸凡的世界",
    description: "杨逸凡的个人创作空间：项目、文字与思考。",
    start_url: publicPath("/"),
    display: "standalone",
    background_color: "#FFFDF5",
    theme_color: "#FFFDF5",
    lang: "zh-CN",
    icons: [
      { src: publicPath("/favicon.ico"), sizes: "16x16 24x24 32x32 48x48 64x64 128x128 256x256", type: "image/x-icon" },
      { src: publicPath("/site-icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: publicPath("/site-icon.png"), sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
