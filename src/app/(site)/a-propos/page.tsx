import type { Metadata } from "next";
import { CallToAction } from "@/components/sections/HomeSections";
import { CredentialList } from "@/components/shared/CredentialList";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SmartImage } from "@/components/ui/SmartImage";
import { getCertifications, getProfile, getSettings } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from "@/lib/seo";
import { delay, paragraphs } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return pageMetadata({
    title: "À propos",
    description: profile.short_bio ?? `${profile.full_name}, ${profile.headline}.`,
    path: "/a-propos",
    image: profile.photo_url,
    type: "profile",
  });
}

export default async function AboutPage() {
  const [profile, settings, certifications] = await Promise.all([getProfile(), getSettings(), getCertifications()]);

  const facts = [
    { label: "Poste", value: profile.headline },
    { label: "Basé à", value: profile.location },
    { label: "Langues", value: profile.languages.join(", ") },
    { label: "Centres d'intérêt", value: profile.interests.join(", ") },
  ].filter((f) => f.value);

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(profile),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "À propos", path: "/a-propos" },
          ]),
        ]}
      />
      <PageHero
        index="01"
        eyebrow="À propos"
        title={
          <>
            Le digital, <em className="font-serif font-normal">avec intention</em>.
          </>
        }
        intro={profile.tagline}
      />

      <section className="container-x pb-24 sm:pb-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <figure className="lg:col-span-5">
            <div className="unveil group relative aspect-[4/5] overflow-hidden bg-mist lg:sticky lg:top-28" style={delay(200)}>
              {profile.photo_url && (
                <SmartImage
                  src={profile.photo_url}
                  alt={`Portrait de ${profile.full_name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="img-mono object-cover"
                />
              )}
            </div>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="eyebrow border-t border-ink pt-4 text-stone">Biographie</h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-graphite sm:text-xl">
              {paragraphs(profile.bio).map((p, i) => (
                <p key={i} data-reveal>
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-14 border-t border-ink">
              {facts.map((f) => (
                <div key={f.label} className="grid gap-1 border-b border-line py-5 sm:grid-cols-3" data-reveal>
                  <dt className="eyebrow pt-1 text-stone">{f.label}</dt>
                  <dd className="text-lg sm:col-span-2">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/experience" arrow>
                Voir mon parcours
              </ButtonLink>
              <ButtonLink href="/cv" variant="outline">
                Consulter mon CV
              </ButtonLink>
            </div>

            {[
              { id: "formations", title: "Formation", items: certifications.filter((c) => c.kind === "formation") },
              { id: "certifs", title: "Certifications", items: certifications.filter((c) => c.kind !== "formation") },
            ]
              .filter((group) => group.items.length > 0)
              .map((group) => (
                <section key={group.id} className="mt-20" aria-labelledby={group.id}>
                  <h2 id={group.id} className="eyebrow border-t border-ink pt-4 text-stone">
                    {group.title}
                  </h2>
                  <CredentialList items={group.items} />
                </section>
              ))}
          </div>
        </div>
      </section>

      <CallToAction settings={settings} profile={profile} />
    </>
  );
}
