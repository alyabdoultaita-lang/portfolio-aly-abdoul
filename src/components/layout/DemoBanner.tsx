import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Mode local : signale que les articles du blog sont des exemples. */
export function DemoBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div role="note" className="fixed bottom-3 right-3 z-40 max-w-[calc(100vw-1.5rem)] border border-ink bg-paper px-3 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-ink shadow-[4px_4px_0_0_#0a0a0a] no-print">
      Mode local — articles du blog d&apos;exemple
    </div>
  );
}
