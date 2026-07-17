import { ImageResponse } from "next/og";
import { seo, siteConfig } from "@/content/site";

export const runtime = "edge";
export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0f0a1a 0%, #1a1028 50%, #0d1520 100%)",
          color: "#f5f5f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "#ff6b4a",
          }}
        >
          pushkarkathuria.com
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a1a1aa",
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Frontend Technical Lead & UI Architect · React · Design Systems
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#71717a" }}>
          Senior / Staff Frontend Engineer · Remote & Relocation
        </div>
      </div>
    ),
    { ...size },
  );
}
