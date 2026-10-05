import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Abdoul Aly TAITA — Responsable Digital / Marketing Digital";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ eyebrow: "Portfolio", title: "Stratégie digitale, contenus et données au service de la croissance." });
}
