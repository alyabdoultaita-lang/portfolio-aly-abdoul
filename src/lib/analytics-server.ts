import "server-only";
import { createHash } from "node:crypto";
import { cleanPath, detectDevice, isBot, referrerDomain, type EventType } from "@/lib/analytics";
import { getPublicClient } from "@/lib/supabase/public";
import { supabaseAnonKey } from "@/lib/supabase/env";

/**
 * Empreinte anonyme d'un visiteur : hachage (ip + navigateur + jour).
 * Elle change chaque jour et ne permet pas de retrouver l'adresse IP.
 */
function visitorId(ip: string, userAgent: string) {
  const salt = process.env.ANALYTICS_SALT || supabaseAnonKey;
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${salt}|${day}|${ip}|${userAgent}`).digest("hex").slice(0, 32);
}

/** Enregistre un événement. Ne lève jamais d'erreur : la mesure ne doit pas casser le site. */
export async function recordEvent(
  headers: Headers,
  event: { type: EventType; path?: unknown; referrer?: unknown; target?: unknown },
) {
  const userAgent = headers.get("user-agent") ?? "";
  if (isBot(userAgent)) return;
  const db = getPublicClient();
  if (!db) return;

  const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || headers.get("x-real-ip") || "0";
  const host = headers.get("host")?.split(":")[0] ?? null;
  const country = headers.get("x-vercel-ip-country");

  const { error } = await db.from("analytics_events").insert({
    type: event.type,
    path: cleanPath(event.path),
    referrer: referrerDomain(typeof event.referrer === "string" ? event.referrer : null, host),
    target: typeof event.target === "string" ? event.target.slice(0, 300) : null,
    device: detectDevice(userAgent),
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    visitor: visitorId(ip, userAgent),
  });
  if (error) console.error("[analytics]", error.message);
}
