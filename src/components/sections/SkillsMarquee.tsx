import { Marquee } from "@/components/ui/Marquee";

/** Deux rubans parallèles inclinés qui défilent en sens inverse (Forest Code / Mint Fog). */
export function SkillsMarquee({ items }: { items: string[] }) {
  return (
    <section aria-label="Domaines d'expertise" className="relative mt-16 overflow-hidden py-10 sm:mt-24 sm:py-16">
      <div className="relative z-10 -mx-[5%] -rotate-2 bg-forest py-4 text-paper shadow-[0_12px_30px_-12px_rgb(6_40_30/0.45)] [--marquee-stroke:var(--color-paper)] sm:py-6">
        <Marquee items={items} className="text-2xl font-bold uppercase tracking-tight sm:text-4xl" />
      </div>
      <div
        aria-hidden="true"
        className="relative -mx-[5%] mt-3 -rotate-2 border-y-2 border-forest bg-mist py-3 text-forest [--marquee-stroke:var(--color-forest)] sm:mt-4 sm:py-4"
      >
        <Marquee items={items} reverse className="text-lg font-semibold uppercase tracking-tight sm:text-2xl" />
      </div>
    </section>
  );
}
