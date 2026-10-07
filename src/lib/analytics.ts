/**
 * Statistiques de visite : types d'événements, détection appareil / robot,
 * et agrégation pour la page /admin › Statistiques.
 * Fonctions pures (aucun accès réseau) : utilisables côté serveur et en test.
 */

export const eventTypes = [
  "pageview",
  "cv_download",
  "contact_message",
  "email_click",
  "phone_click",
  "linkedin_click",
  "outbound_click",
] as const;
export type EventType = (typeof eventTypes)[number];

/** Événements envoyables depuis le navigateur (contact_message est enregistré côté serveur). */
export const clientEventTypes: readonly EventType[] = eventTypes.filter((t) => t !== "contact_message");

export type Device = "mobile" | "tablet" | "desktop";

export interface AnalyticsEvent {
  type: EventType;
  path: string | null;
  referrer: string | null;
  target: string | null;
  device: Device | null;
  country: string | null;
  visitor: string | null;
  created_at: string;
}

const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|lighthouse|headless|curl|wget|python|axios|node-fetch|vercel/i;

export function isBot(userAgent: string | null | undefined) {
  return !userAgent || BOT_RE.test(userAgent);
}

export function detectDevice(userAgent: string): Device {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

/** Domaine d'origine sans « www. » ; null pour un accès direct ou une navigation interne. */
export function referrerDomain(referrer: string | null | undefined, ownHost?: string | null) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || (ownHost && host === ownHost.replace(/^www\./, "").toLowerCase())) return null;
    return host.slice(0, 200);
  } catch {
    return null;
  }
}

/** Chemin propre (sans paramètres), limité en longueur. */
export function cleanPath(path: unknown) {
  if (typeof path !== "string" || !path.startsWith("/")) return null;
  return (path.split(/[?#]/)[0] || "/").slice(0, 300);
}

// ---------------------------------------------------------------------------
// Agrégation
// ---------------------------------------------------------------------------

export interface DayPoint {
  day: string; // AAAA-MM-JJ
  views: number;
  visitors: number;
}

export interface Ranked {
  key: string;
  count: number;
}

export interface AnalyticsSummary {
  views: number;
  visitors: number;
  counts: Record<EventType, number>;
  days: DayPoint[];
  pages: Ranked[];
  sources: Ranked[];
  devices: Ranked[];
  countries: Ranked[];
  links: Ranked[];
}

/** Jour local (fuseau du Burkina Faso = UTC) au format AAAA-MM-JJ. */
export function dayKey(date: Date | string) {
  return new Date(date).toISOString().slice(0, 10);
}

function rank(map: Map<string, number>, limit: number): Ranked[] {
  return [...map]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, limit);
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

/** Agrège les événements (triés par date croissante) de la période [from, to], jours inclus. */
export function summarize(events: AnalyticsEvent[], from: Date, to: Date, limit = 8): AnalyticsSummary {
  const counts = Object.fromEntries(eventTypes.map((t) => [t, 0])) as Record<EventType, number>;
  const perDay = new Map<string, { views: number; visitors: Set<string> }>();
  for (let d = new Date(dayKey(from)); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    perDay.set(dayKey(d), { views: 0, visitors: new Set() });
  }

  const pages = new Map<string, number>();
  const sources = new Map<string, number>();
  const devices = new Map<string, number>();
  const countries = new Map<string, number>();
  const links = new Map<string, number>();
  // Un visiteur = une empreinte par jour : on compte les couples (jour, visiteur).
  const visitorDays = new Set<string>();
  const seenSource = new Set<string>();
  const seenDevice = new Set<string>();
  const seenCountry = new Set<string>();

  for (const e of events) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
    const day = dayKey(e.created_at);
    if (e.type !== "pageview") {
      if (e.target && e.type !== "cv_download") bump(links, e.target);
      continue;
    }
    const bucket = perDay.get(day);
    if (bucket) bucket.views++;
    if (e.path) bump(pages, e.path);

    // Source, appareil et pays : comptés une fois par visiteur et par jour.
    const who = e.visitor ? `${day}:${e.visitor}` : null;
    if (who) {
      visitorDays.add(who);
      bucket?.visitors.add(e.visitor!);
    }
    const once = (seen: Set<string>, map: Map<string, number>, key: string) => {
      if (!who) return bump(map, key);
      if (seen.has(who)) return;
      seen.add(who);
      bump(map, key);
    };
    // La source est celle de la première page vue (arrivée sur le site).
    once(seenSource, sources, e.referrer ?? "Accès direct");
    if (e.device) once(seenDevice, devices, e.device);
    if (e.country) once(seenCountry, countries, e.country);
  }

  return {
    views: counts.pageview,
    visitors: visitorDays.size,
    counts,
    days: [...perDay].map(([day, b]) => ({ day, views: b.views, visitors: b.visitors.size })),
    pages: rank(pages, limit),
    sources: rank(sources, limit),
    devices: rank(devices, 3),
    countries: rank(countries, limit),
    links: rank(links, limit),
  };
}
