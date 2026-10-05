import type { Metadata } from "next";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { PageHero } from "@/components/shared/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProjectCategories, getProjects } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description: "Sélection de projets en marketing digital : campagnes, social media, sites web et stratégie, avec contexte, objectifs et résultats.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [projects, categories] = await Promise.all([getProjects(), getProjectCategories()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Portfolio", path: "/portfolio" }])} />
      <PageHero
        index="04"
        eyebrow="Portfolio"
        title={
          <>
            Projets <em className="font-serif font-normal">sélectionnés</em>.
          </>
        }
        intro="Campagnes, plateformes et stratégies : chaque projet est présenté avec son contexte, ses objectifs et ses résultats."
      />
      <section className="container-x pb-24 sm:pb-36" aria-label="Projets">
        <ProjectGrid projects={projects} categories={categories} />
      </section>
    </>
  );
}
