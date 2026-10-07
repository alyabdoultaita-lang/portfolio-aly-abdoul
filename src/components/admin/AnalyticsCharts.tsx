import type { DayPoint, Ranked } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("fr-FR");
export const fmt = (n: number) => nf.format(n);

function shortDate(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
}

/** Regroupe les jours par semaine au-delà de 90 points (barres lisibles). */
function bucketize(days: DayPoint[]) {
  if (days.length <= 90) return days.map((d) => ({ label: shortDate(d.day), ...d }));
  const out: (DayPoint & { label: string })[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    out.push({
      day: week[0].day,
      label: `Sem. du ${shortDate(week[0].day)}`,
      views: week.reduce((s, d) => s + d.views, 0),
      visitors: week.reduce((s, d) => s + d.visitors, 0),
    });
  }
  return out;
}

/** Barres verticales des pages vues par jour, avec info-bulle au survol. */
export function VisitsChart({ days }: { days: DayPoint[] }) {
  const points = bucketize(days);
  const max = Math.max(1, ...points.map((p) => p.views));
  const ticks = [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]];

  return (
    <figure>
      <div className="relative h-56 border-b border-ink">
        {/* Repère du maximum, discret */}
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-line" aria-hidden="true" />
        <span className="eyebrow absolute -top-2 right-0 z-[1] bg-paper pl-2 leading-none text-stone" aria-hidden="true">
          max {fmt(max)}
        </span>
        <ol className="absolute inset-0 flex items-end gap-[2px]" aria-hidden="true">
          {points.map((p) => (
            <li key={p.day} className="group relative flex h-full flex-1 items-end">
              <span
                className="block w-full rounded-t-[4px] bg-ink transition-opacity group-hover:opacity-70"
                style={{ height: p.views ? `${Math.max(2, (p.views / max) * 100)}%` : "0" }}
              />
              {/* Zone de survol plus large que la barre */}
              <span className="absolute inset-0" />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-ink bg-paper px-3 py-2 text-xs shadow-sm group-hover:block">
                <strong className="block font-semibold">{p.label}</strong>
                {fmt(p.views)} page{p.views > 1 ? "s" : ""} vue{p.views > 1 ? "s" : ""} · {fmt(p.visitors)} visiteur{p.visitors > 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="eyebrow mt-2 flex justify-between text-stone" aria-hidden="true">
        {ticks.map((t, i) => (
          <span key={i}>{t.label}</span>
        ))}
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-stone underline underline-offset-4">Voir les données en tableau</summary>
        <div className="mt-3 max-h-64 overflow-auto border border-line">
          <table className="w-full text-left">
            <thead className="eyebrow sticky top-0 bg-mist text-stone">
              <tr>
                <th className="p-2 font-normal">Période</th>
                <th className="p-2 text-right font-normal">Pages vues</th>
                <th className="p-2 text-right font-normal">Visiteurs</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={p.day} className="border-t border-line">
                  <td className="p-2">{p.label}</td>
                  <td className="p-2 text-right tabular-nums">{fmt(p.views)}</td>
                  <td className="p-2 text-right tabular-nums">{fmt(p.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/** Liste classée avec barre de proportion (pages, sources, pays…). */
export function RankedList({
  title,
  items,
  label = (k) => k,
  empty = "Aucune donnée sur la période.",
  showPercent = false,
}: {
  title: string;
  items: Ranked[];
  label?: (key: string) => string;
  empty?: string;
  showPercent?: boolean;
}) {
  const total = items.reduce((s, i) => s + i.count, 0);
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <section className="border border-line bg-paper">
      <h2 className="eyebrow border-b border-line p-4 text-stone">{title}</h2>
      {items.length === 0 ? (
        <p className="p-4 text-sm text-stone">{empty}</p>
      ) : (
        <ul className="space-y-3 p-4">
          {items.map((i) => (
            <li key={i.key} className="text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <span className="truncate" title={i.key}>
                  {label(i.key)}
                </span>
                <span className="shrink-0 tabular-nums">
                  {fmt(i.count)}
                  {showPercent && total > 0 && <span className="ml-2 text-stone">{Math.round((i.count / total) * 100)} %</span>}
                </span>
              </div>
              <div className="mt-1.5 h-1 bg-mist" aria-hidden="true">
                <div className="h-full rounded-r-[4px] bg-ink" style={{ width: `${(i.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Chiffre clé avec variation par rapport à la période précédente. */
export function StatTile({ label, value, previous, detail }: { label: string; value: number; previous?: number; detail?: string }) {
  let delta: string | null = null;
  if (previous !== undefined) {
    if (previous === 0) delta = value > 0 ? "nouveau" : null;
    else {
      const pct = Math.round(((value - previous) / previous) * 100);
      delta = `${pct > 0 ? "+" : ""}${pct} %`;
    }
  }
  return (
    <div className="bg-paper p-5 sm:p-6">
      <p className="eyebrow text-stone">{label}</p>
      <p className="mt-3 text-5xl font-semibold tracking-tighter tabular-nums">{fmt(value)}</p>
      <p className="mt-2 text-sm text-stone">
        {delta && (
          <span className={cn("mr-1 font-medium", delta.startsWith("-") ? "text-stone" : "text-ink")}>
            {delta.startsWith("-") ? "↓" : "↑"} {delta.replace(/^[+-]/, "")}
          </span>
        )}
        {delta ? "vs période précédente" : detail}
      </p>
    </div>
  );
}
