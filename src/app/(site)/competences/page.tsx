import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SkillDomains } from "@/components/skills/SkillDomains";
import { JsonLd } from "@/components/ui/JsonLd";
import { Marquee } from "@/components/ui/Marquee";
import { getSkillCategories, getSkills } from "@/lib/data/public";
import { groupSkillsByDomain } from "@/lib/skills";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Compétences",
  description: "Compétences en marketing digital : stratégie, social media, Google Ads, analytics, Google Tag Manager, SEO, WordPress, IA générative et gestion de projet.",
  path: "/competences",
});

export default async function SkillsPage() {
  const [skills, categories] = await Promise.all([getSkills(), getSkillCategories()]);
  const domains = groupSkillsByDomain(categories, skills);
  const count = domains.reduce((n, d) => n + d.skills.length, 0);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Compétences", path: "/competences" }])} />
      <PageHero
        index="03"
        eyebrow="Compétences"
        title={
          <>
            Savoir-faire <em className="font-serif font-normal">& outils</em>.
          </>
        }
        intro={`${count} compétences réparties en ${domains.length} domaines, de la stratégie à l'exécution.`}
      />

      <section aria-label="Domaines" className="border-y border-ink bg-ink py-6 text-paper">
        <Marquee items={domains.map((d) => d.category.name)} className="text-3xl font-semibold uppercase tracking-tighter sm:text-5xl" />
      </section>

      <section className="bg-ink pb-24 text-paper sm:pb-36" aria-label="Compétences par domaine">
        <div className="container-x pt-16">
          <SkillDomains domains={domains} dark />
        </div>
      </section>
    </>
  );
}
