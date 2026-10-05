"use client";

import { useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** Convertit une date ISO en valeur pour <input type="datetime-local"> (heure locale). */
function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Sélecteur date + heure dans le fuseau du navigateur ; la valeur envoyée
 * au serveur est convertie en ISO UTC (champ caché).
 */
export function DateTimeField(props: { name: string; label: string; defaultValue?: string | null; hint?: string }) {
  // Le fuseau horaire n'est connu que dans le navigateur : rendu client uniquement.
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  if (!isClient) return <div className="h-[4.5rem]" aria-hidden="true" />;
  return <DateTimeInput {...props} />;
}

function DateTimeInput({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue?: string | null; hint?: string }) {
  const [local, setLocal] = useState(() => toLocalInput(defaultValue));
  const iso = local ? new Date(local).toISOString() : "";
  return (
    <div>
      <label htmlFor={`${name}-local`} className="eyebrow mb-2 block text-stone">
        {label}
      </label>
      <input
        id={`${name}-local`}
        type="datetime-local"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="min-h-11 w-full border border-line bg-paper px-3 outline-none focus:border-ink"
      />
      <input type="hidden" name={name} value={iso} />
      {hint && <p className="mt-1.5 text-xs text-stone">{hint}</p>}
    </div>
  );
}
