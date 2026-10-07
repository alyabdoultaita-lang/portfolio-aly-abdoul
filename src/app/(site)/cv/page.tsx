import type { ReactNode } from "react";
import type { Metadata } from "next";
import { CredentialList } from "@/components/shared/CredentialList";
import { PrintButton } from "@/components/shared/PrintButton";
import { ButtonLink } from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCertifications, getExperiences, getProfile, getSkillCategories, getSkills } from "@/lib/data/public";
import { groupSkillsByDomain } from "@/lib/skills";
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from "@/lib/seo";
import { formatPeriod } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "CV",
  description: "CV d'Abdoul Aly TAITA, Responsable Digital / Marketing Digital : expériences, compétences et certifications. Version PDF téléchargeable.",
  path: "/cv",
});

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-ink py-8 md:grid-cols-12 print:break-inside-avoid-page">
      <h2 className="eyebrow pt-1 text-stone md:col-span-3">{title}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

export default async function CvPage() {
  const [profile, experiences, skills, skillCategories, certifications] = await Promise.all([
    getProfile(),
    getExperiences(),
    getSkills(),
    getSkillCategories(),
    getCertifications(),
  ]);

  const formations = certifications.filter((c) => c.kind === "formation");
  const certificationsOnly = certifications.filter((c) => c.kind !== "formation");

  return (
    <>
      <JsonLd data={[personJsonLd(profile), breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "CV", path: "/cv" }])]} />
      <div className="container-x print-tight pb-24 pt-32 sm:pb-36 sm:pt-40">
        {/* Actions */}
        <div className="no-print fade-up mb-12 flex flex-col gap-3 border-b border-ink pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow text-stone">
            <span className="text-ink">06 / </span>Curriculum vitae
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {profile.cv_url ? (
              <ButtonLink href={profile.cv_url} data-track="cv_download">
                <span className="flex items-center gap-3">
                  Télécharger le CV (PDF) <DownloadIcon className="size-4" />
                </span>
              </ButtonLink>
            ) : (
              <p className="self-center text-sm text-stone">PDF à ajouter depuis Admin › Profil</p>
            )}
            <PrintButton />
          </div>
        </div>

        <article className="mx-auto max-w-5xl">
          <header className="pb-10">
            <h1 className="display-lg uppercase">{profile.full_name}</h1>
            <p className="mt-4 font-serif text-2xl italic sm:text-3xl">{profile.headline}</p>
            <ul className="eyebrow mt-6 flex flex-wrap gap-x-6 gap-y-2 text-stone">
              {profile.location && <li>{profile.location}</li>}
              {profile.email && (
                <li>
                  <a href={`mailto:${profile.email}`} className="link-underline text-ink">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.phone && <li>{profile.phone}</li>}
              {profile.linkedin_url && (
                <li>
                  <a href={profile.linkedin_url} className="link-underline text-ink" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </header>

          {profile.short_bio && (
            <CvSection title="Profil">
              <p className="text-lg leading-relaxed">{profile.short_bio}</p>
            </CvSection>
          )}

          <CvSection title="Expérience">
            <ol className="space-y-8">
              {experiences.map((exp) => (
                <li key={exp.id} className="print:break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {exp.role} <span className="font-serif font-normal italic">— {exp.company}</span>
                    </h3>
                    <span className="eyebrow text-stone">{formatPeriod(exp.start_date, exp.end_date, exp.is_current)}</span>
                  </div>
                  {exp.description && <p className="mt-2 text-graphite">{exp.description}</p>}
                  {[...exp.responsibilities, ...exp.achievements, ...exp.results].length > 0 && (
                    <ul className="mt-3 list-[square] space-y-1 pl-5 text-graphite">
                      {[...exp.responsibilities, ...exp.achievements, ...exp.results].map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                  {exp.tools.length > 0 && <p className="mt-2 font-mono text-xs text-stone">{exp.tools.join(" · ")}</p>}
                </li>
              ))}
            </ol>
          </CvSection>

          <CvSection title="Compétences">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {groupSkillsByDomain(skillCategories, skills).map(({ category: { name: category }, skills: items }) => {
                // Évite « Google Ads — Google Ads » quand la compétence porte le nom de sa catégorie.
                const names = items.map((s) => s.name).filter((n) => n.toLowerCase() !== category.toLowerCase());
                return (
                  <div key={category}>
                    <dt className="font-semibold">{category}</dt>
                    {names.length > 0 && <dd className="text-graphite">{names.join(", ")}</dd>}
                  </div>
                );
              })}
            </dl>
          </CvSection>

          {formations.length > 0 && (
            <CvSection title="Formation">
              <CredentialList items={formations} compact />
            </CvSection>
          )}

          {certificationsOnly.length > 0 && (
            <CvSection title="Certifications">
              <CredentialList items={certificationsOnly} compact />
            </CvSection>
          )}

          {profile.languages.length > 0 && (
            <CvSection title="Langues">
              <p className="text-lg">{profile.languages.join(" · ")}</p>
            </CvSection>
          )}
        </article>
      </div>
    </>
  );
}
