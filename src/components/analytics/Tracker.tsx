"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Posé par l'admin : les visites de l'administrateur ne sont pas comptées sur ce navigateur. */
export const NO_TRACK_KEY = "aat-no-track";

function send(payload: Record<string, string | null>) {
  try {
    if (localStorage.getItem(NO_TRACK_KEY)) return;
  } catch {
    // stockage indisponible : on mesure quand même
  }
  const body = JSON.stringify(payload);
  if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

/** Type de clic à mesurer pour un lien, ou null. */
function classify(a: HTMLAnchorElement): { type: string; target: string } | null {
  const href = a.getAttribute("href") ?? "";
  if (a.dataset.track === "cv_download") return { type: "cv_download", target: href };
  if (href.startsWith("mailto:")) return { type: "email_click", target: href.slice(7).split("?")[0] };
  if (href.startsWith("tel:")) return { type: "phone_click", target: href.slice(4) };
  try {
    const url = new URL(href, location.href);
    if (url.host === location.host || !/^https?:$/.test(url.protocol)) return null;
    const target = (url.hostname.replace(/^www\./, "") + url.pathname).replace(/\/$/, "");
    if (/(^|\.)linkedin\.com$/.test(url.hostname)) return { type: "linkedin_click", target };
    return { type: "outbound_click", target };
  } catch {
    return null;
  }
}

/**
 * Mesure d'audience sans cookie : une page vue à chaque changement de page,
 * plus les clics sur le CV, l'e-mail, le téléphone, LinkedIn et les liens externes.
 */
export function Tracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    // La source (site d'origine) n'est envoyée qu'à l'arrivée sur le site.
    send({ type: "pageview", path: pathname, referrer: first.current ? document.referrer || null : null });
    first.current = false;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const event = classify(a);
      if (event) send({ ...event, path: location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

/** À placer dans l'admin : exclut ce navigateur des statistiques. */
export function NoTrack() {
  useEffect(() => {
    try {
      localStorage.setItem(NO_TRACK_KEY, "1");
    } catch {
      // ignoré
    }
  }, []);
  return null;
}
