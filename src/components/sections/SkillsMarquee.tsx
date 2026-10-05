import { Marquee } from "@/components/ui/Marquee";

export function SkillsMarquee({ items }: { items: string[] }) {
  return (
    <section aria-label="Domaines d'expertise" className="mt-16 border-y border-ink bg-ink py-5 text-paper sm:mt-24 sm:py-7">
      <Marquee items={items} className="text-2xl font-semibold uppercase tracking-tighter sm:text-4xl" />
    </section>
  );
}
