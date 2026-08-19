import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "杨逸凡 AI Capability Universe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", color: "#ece5da", background: "#090a10", padding: "74px 86px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", width: 720, height: 360, right: -70, top: 85, border: "1px solid rgba(160,124,232,.34)", borderRadius: "50%", transform: "rotate(-9deg)" }} />
      <div style={{ position: "absolute", width: 520, height: 260, right: 35, top: 135, border: "1px solid rgba(160,124,232,.18)", borderRadius: "50%", transform: "rotate(-9deg)" }} />
      <div style={{ position: "absolute", width: 18, height: 18, right: 330, top: 250, borderRadius: "50%", background: "#e9d5ad", boxShadow: "0 0 44px rgba(233,213,173,.7)" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25, color: "#b89ae9" }}><span>YY · 杨逸凡</span><span>AI CAPABILITY UNIVERSE</span></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.1, maxWidth: 820 }}>把业务问题，变成可验证的 AI 能力。</div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 26, color: "#b9b3aa", letterSpacing: 3 }}>AI SKILL · AGENT WORKFLOW · VIBE CODING</div>
        </div>
      </div>
    </div>,
    size,
  );
}
