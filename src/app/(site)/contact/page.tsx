import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/shared/ContactForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProfile } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contactez Abdoul Aly TAITA pour une mission, un poste ou un projet en marketing digital.",
  path: "/contact",
});

export default async function ContactPage() {
  const profile = await getProfile();
  const channels = [
    profile.email && { label: "E-mail", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { label: "Téléphone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    profile.linkedin_url && { label: "LinkedIn", value: "Voir mon profil ↗", href: profile.linkedin_url },
    profile.location && { label: "Localisation", value: profile.location },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHero
        index="07"
        eyebrow="Contact"
        title={
          <>
            Parlons de <em className="font-serif font-normal">votre projet</em>.
          </>
        }
        intro="Recrutement, mission de conseil, collaboration avec une ONG ou une entreprise : décrivez votre besoin, je vous réponds rapidement."
      />
      <section className="container-x pb-24 sm:pb-36">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="sr-only">Formulaire de contact</h2>
            <ContactForm />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow border-t border-ink pt-4 text-stone">Coordonnées</h2>
            <dl className="mt-4">
              {channels.map((c) => (
                <div key={c.label} className="border-b border-line py-5">
                  <dt className="eyebrow text-stone">{c.label}</dt>
                  <dd className="mt-1 break-words text-lg">
                    {c.href ? (
                      <a href={c.href} className="link-underline" {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {profile.available_for_work && (
              <p className="mt-8 inline-flex items-center gap-3 bg-ink px-4 py-3 text-sm text-paper">
                <span className="size-2 rounded-full bg-paper" aria-hidden="true" /> Disponible pour de nouvelles opportunités
              </p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
