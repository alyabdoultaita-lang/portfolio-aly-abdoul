import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

/** Visuel Open Graph monochrome commun (site et articles). */
export function renderOgImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const fontSize = title.length > 70 ? 56 : title.length > 40 ? 68 : 84;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafaf8",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#a3a39e", borderBottom: "1px solid #2e2e2c", paddingBottom: 20 }}>
          <span>{eyebrow.toUpperCase()}</span>
          <span>{siteConfig.coordinates}</span>
        </div>
        <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1, letterSpacing: -3, maxWidth: 1050 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26 }}>
          <span style={{ fontWeight: 700, letterSpacing: -1 }}>{siteConfig.name}</span>
          <span style={{ color: "#a3a39e" }}>{footer ?? "Responsable Digital — Burkina Faso"}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
