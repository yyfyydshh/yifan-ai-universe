import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "杨逸凡｜AI Capability Universe",
    short_name: "杨逸凡",
    description: "AI Skill、Agent 工作流与 AI 应用交付作品集。",
    start_url: "/",
    display: "standalone",
    background_color: "#090a10",
    theme_color: "#090a10",
    lang: "zh-CN",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
