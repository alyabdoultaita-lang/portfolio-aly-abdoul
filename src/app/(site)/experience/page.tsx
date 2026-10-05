import type { Metadata } from "next";
import { Timeline } from "@/components/experience/Timeline";
import { PageHero } from "@/components/shared/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { getExperiences } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Expérience",
  description: "Parcours professionnel d'Abdoul Aly TAITA : postes, responsabilités, réalisations et résultats en marketing digital.",
  path: "/experience",
});

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Expérience", path: "/experience" }])} />
      <PageHero
        index="02"
        eyebrow="Expérience"
        title={
          <>
            Parcours <em className="font-serif font-normal">professionnel</em>.
          </>
        }
        intro="Chaque poste a été l'occasion de construire, mesurer et améliorer. Voici le détail des missions, réalisations et résultats."
      />
      <section className="container-x pb-24 sm:pb-36" aria-label="Timeline des expériences">
        {experiences.length > 0 ? <Timeline experiences={experiences} /> : <p className="text-stone">Aucune expérience publiée pour le moment.</p>}
      </section>
    </>
  );
}
