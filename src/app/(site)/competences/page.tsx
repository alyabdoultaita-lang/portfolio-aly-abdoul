import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SkillGroups, groupSkills } from "@/components/skills/SkillGroups";
import { JsonLd } from "@/components/ui/JsonLd";
import { Marquee } from "@/components/ui/Marquee";
import { getSkills } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Compétences",
  description: "Compétences en marketing digital : stratégie, social media, Google Ads, analytics, Google Tag Manager, SEO, WordPress, IA générative et gestion de projet.",
  path: "/competences",
});

export default async function SkillsPage() {
  const skills = await getSkills();
  const groups = groupSkills(skills);

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
        intro={`${skills.length} compétences réparties en ${groups.length} domaines, de la stratégie à l'exécution.`}
      />

      <section aria-label="Domaines" className="border-y border-ink bg-ink py-6 text-paper">
        <Marquee items={groups.map(([c]) => c)} className="text-3xl font-semibold uppercase tracking-tighter sm:text-5xl" />
      </section>

      <section className="bg-ink pb-24 text-paper sm:pb-36" aria-label="Compétences par domaine">
        <div className="container-x pt-16">
          <SkillGroups skills={skills} dark />
          <p className="eyebrow mt-8 text-smoke">Niveaux indicatifs, auto-évalués.</p>
        </div>
      </section>
    </>
  );
}
