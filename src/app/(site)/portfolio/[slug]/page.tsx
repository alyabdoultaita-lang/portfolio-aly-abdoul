import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Pill } from "@/components/ui/Pill";
import { SmartImage } from "@/components/ui/SmartImage";
import { getProjectBySlug, getProjects } from "@/lib/data/public";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { delay, paragraphs } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet introuvable" };
  return pageMetadata({
    title: project.title,
    description: project.excerpt ?? project.description?.slice(0, 160) ?? project.title,
    path: `/portfolio/${project.slug}`,
    image: project.cover_url?.endsWith(".svg") ? null : project.cover_url,
  });
}

function Chapter({ index, title, text }: { index: string; title: string; text: string | null }) {
  if (!text) return null;
  return (
    <section className="grid gap-4 border-t border-ink py-10 md:grid-cols-12" data-reveal>
      <h2 className="eyebrow text-stone md:col-span-4">
        <span className="text-ink">{index} / </span>
        {title}
      </h2>
      <div className="space-y-5 text-lg leading-relaxed text-graphite md:col-span-8 sm:text-xl">
        {paragraphs(text).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const others = (await getProjects()).filter((p) => p.id !== project.id).slice(0, 2);
  const meta = [
    { label: "Client", value: project.client },
    { label: "Année", value: project.year?.toString() },
    { label: "Catégorie", value: project.category?.name },
  ].filter((m) => m.value);

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${project.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.excerpt,
            dateCreated: project.year?.toString(),
            keywords: project.tools.join(", "),
          },
        ]}
      />

      <header className="container-x pt-32 sm:pt-40">
        <nav aria-label="Fil d'Ariane" className="eyebrow fade-up border-b border-ink pb-4 text-stone">
          <Link href="/portfolio" className="link-underline">
            Portfolio
          </Link>{" "}
          / <span className="text-ink">{project.title}</span>
        </nav>
        <h1 className="display-lg mt-10 max-w-6xl">
          <span className="line-mask">
            <span style={delay(80)}>{project.title}</span>
          </span>
        </h1>
        {project.excerpt && (
          <p className="fade-up mt-8 max-w-3xl font-serif text-2xl italic leading-tight sm:text-3xl" style={delay(300)}>
            {project.excerpt}
          </p>
        )}
        <dl className="fade-up mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4" style={delay(400)}>
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="eyebrow text-stone">{m.label}</dt>
              <dd className="mt-1 text-lg">{m.value}</dd>
            </div>
          ))}
          {project.link_url && (
            <div>
              <dt className="eyebrow text-stone">Lien</dt>
              <dd className="mt-1 text-lg">
                <a href={project.link_url} target="_blank" rel="noopener noreferrer" className="link-underline">
                  Voir le projet ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
      </header>

      {project.cover_url && (
        <div className="container-x mt-12">
          <div className="unveil relative aspect-[16/10] overflow-hidden bg-mist sm:aspect-[16/8]" style={delay(300)}>
            <SmartImage src={project.cover_url} alt={project.cover_alt ?? project.title} fill priority sizes="100vw" className="object-cover grayscale" />
          </div>
        </div>
      )}

      <div className="container-x py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Chapter index="01" title="Le projet" text={project.description} />
          <Chapter index="02" title="Contexte" text={project.context} />
          <Chapter index="03" title="Objectifs" text={project.objectives} />
          <Chapter index="04" title="Résultats" text={project.results} />
          {project.tools.length > 0 && (
            <section className="grid gap-4 border-t border-ink py-10 md:grid-cols-12" data-reveal>
              <h2 className="eyebrow text-stone md:col-span-4">
                <span className="text-ink">05 / </span>Outils utilisés
              </h2>
              <ul className="flex flex-wrap gap-2 md:col-span-8">
                {project.tools.map((t) => (
                  <li key={t}>
                    <Pill className="text-sm">{t}</Pill>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {project.gallery.length > 0 && (
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div key={src} className="group relative aspect-[4/3] overflow-hidden bg-mist" data-reveal>
                <SmartImage src={src} alt={`${project.title} — visuel ${i + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="img-mono object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {others.length > 0 && (
        <aside className="bg-ink py-20 text-paper sm:py-28" aria-label="Autres projets">
          <div className="container-x">
            <div className="eyebrow flex items-center justify-between border-t border-ash pt-4 text-smoke">
              <span>Autres projets</span>
              <ButtonLink href="/portfolio" variant="inverse" arrow className="min-h-10">
                Tout voir
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-12 md:grid-cols-2 [&_.border-ink]:border-ash [&_.text-stone]:text-smoke">
              {others.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} aspect="aspect-[16/10]" />
              ))}
            </div>
          </div>
        </aside>
      )}
    </article>
  );
}
