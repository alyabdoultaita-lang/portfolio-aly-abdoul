import Link from "next/link";
import type { Project } from "@/types/content";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn, pad } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  priority?: boolean;
  className?: string;
  aspect?: string;
}

/** Carte projet : image monochrome, voile noir et infos révélées au survol. */
export function ProjectCard({ project, index, priority, className, aspect = "aspect-[16/10]" }: ProjectCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/portfolio/${project.slug}`} className="block focus-visible:outline-offset-4">
        <div className={cn("relative overflow-hidden bg-mist", aspect)}>
          {project.cover_url && (
            <SmartImage
              src={project.cover_url}
              alt={project.cover_alt ?? project.title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="img-tone object-cover object-top"
            />
          )}
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/55" />
          <span className="eyebrow absolute left-4 top-4 bg-paper px-2 py-1">{pad(index + 1)}</span>
          <span className="absolute right-4 top-4 flex size-12 scale-75 items-center justify-center rounded-full bg-paper opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100">
            <ArrowUpRightIcon className="size-5" />
          </span>
          {project.excerpt && (
            <p className="absolute inset-x-4 bottom-4 translate-y-4 text-lg leading-snug text-paper opacity-0 transition-all duration-700 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
              {project.excerpt}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4 border-t border-ink pt-3">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>
          <p className="eyebrow shrink-0 pt-1.5 text-stone">
            {project.category?.name}
            {project.year && ` — ${project.year}`}
          </p>
        </div>
      </Link>
    </article>
  );
}
