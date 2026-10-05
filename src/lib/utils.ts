/** Concatène des classes CSS en ignorant les valeurs falsy. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** « Stratégie Digitale & IA » → « strategie-digitale-ia » */
export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 96);
}

/** Supprime les balises HTML (pour extraits, temps de lecture, meta). */
export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Temps de lecture estimé en minutes (≈ 220 mots / minute). */
export function readingTime(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  // On ne retire le dernier mot que s'il a été coupé en plein milieu.
  const midWord = !/\s/.test(text[max - 1] ?? " ");
  return `${(midWord ? cut.replace(/\s+\S*$/, "") : cut).trimEnd()}…`;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" });

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export function formatYear(value: string | null | undefined) {
  return value ? String(new Date(value).getUTCFullYear()) : "";
}

export function formatMonth(value: string | null | undefined) {
  if (!value) return "";
  return monthFormatter.format(new Date(value)).replace(".", "");
}

/** « janv. 2023 — Aujourd'hui » */
export function formatPeriod(start: string, end: string | null, isCurrent: boolean) {
  return `${formatMonth(start)} — ${isCurrent || !end ? "Aujourd'hui" : formatMonth(end)}`;
}

/** Index éditorial : 1 → « 01 » */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Découpe un texte en paragraphes (double saut de ligne). */
export function paragraphs(text: string | null | undefined) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Convertit un textarea « une valeur par ligne » en tableau. */
export function linesToArray(value: string | null | undefined) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Convertit « a, b, c » en tableau. */
export function csvToArray(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function absoluteUrl(path: string, base: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Délai d'animation CSS (variable --delay) utilisable dans `style`. */
export function delay(ms: number) {
  return { "--delay": `${ms}ms` } as import("react").CSSProperties;
}
