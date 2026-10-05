import type { ReactNode } from "react";
import Link from "next/link";
import type { Article, Experience, Project, Skill, SiteSettings, Profile } from "@/types/content";
import { ArticleRow } from "@/components/blog/ArticleCard";
import { ExperienceList } from "@/components/experience/ExperienceList";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SkillGroups } from "@/components/skills/SkillGroups";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn, delay } from "@/lib/utils";

function MoreLink({ href, children, dark }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", dark ? "text-paper" : "text-ink")}>
      <span className="link-underline">{children}</span>
      <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function HomeExperience({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null;
  return (
    <section className="container-x pb-24 sm:pb-36" aria-label="Expériences principales">
      <SectionHeader
        index="02"
        eyebrow="Expériences"
        title={
          <>
            Un parcours construit <em className="font-serif font-normal">sur le terrain</em>.
          </>
        }
        aside={<MoreLink href="/experience">Timeline complète</MoreLink>}
      />
      <ExperienceList experiences={experiences.slice(0, 4)} />
    </section>
  );
}

export function HomeProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="bg-ink py-24 text-paper sm:py-36" aria-label="Projets sélectionnés">
      <div className="container-x">
        <SectionHeader
          dark
          index="03"
          eyebrow="Projets sélectionnés"
          title={
            <>
              Des idées devenues <em className="font-serif font-normal">résultats</em>.
            </>
          }
          aside={<MoreLink href="/portfolio" dark>Tout le portfolio</MoreLink>}
        />
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 [&_.border-ink]:border-ash [&_.text-stone]:text-smoke">
          {projects.slice(0, 4).map((project, i) => (
            <div key={project.id} data-reveal style={delay((i % 2) * 120)} className={cn(i % 2 === 1 && "md:mt-24")}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSkills({ skills }: { skills: Skill[] }) {
  const featured = skills.filter((s) => s.is_featured);
  const list = featured.length >= 6 ? featured : skills;
  if (list.length === 0) return null;
  return (
    <section className="container-x py-24 sm:py-36" aria-label="Compétences">
      <SectionHeader
        index="04"
        eyebrow="Compétences"
        title={
          <>
            La boîte à outils <em className="font-serif font-normal">d&apos;un digital complet</em>.
          </>
        }
        aside={<MoreLink href="/competences">Toutes les compétences</MoreLink>}
      />
      <SkillGroups skills={list} showLevels={false} />
    </section>
  );
}

export function HomeArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="container-x pb-24 sm:pb-36" aria-label="Derniers articles">
      <SectionHeader
        index="05"
        eyebrow="Journal"
        title={
          <>
            Notes, analyses <em className="font-serif font-normal">et convictions</em>.
          </>
        }
        aside={<MoreLink href="/blog">Tous les articles</MoreLink>}
      />
      <ul className="border-t border-ink">
        {articles.map((article, i) => (
          <ArticleRow key={article.id} article={article} index={i} />
        ))}
      </ul>
    </section>
  );
}

export function CallToAction({ settings, profile }: { settings: SiteSettings; profile: Profile }) {
  return (
    <section className="grain relative overflow-hidden border-t border-ink bg-paper py-24 sm:py-40" aria-labelledby="cta-title">
      <div className="container-x relative">
        <p className="eyebrow text-stone" data-reveal="fade">
          <span className="text-ink">06 / </span>Contact
        </p>
        <h2 id="cta-title" className="display-lg mt-8 max-w-6xl" data-reveal>
          {settings.contact_cta.title}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="text-xl leading-snug text-stone md:col-span-6" data-reveal>
            {settings.contact_cta.text}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end" data-reveal>
            <ButtonLink href="/contact" arrow>
              Démarrer un projet
            </ButtonLink>
            {profile.email && (
              <ButtonLink href={`mailto:${profile.email}`} variant="outline">
                {profile.email}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
