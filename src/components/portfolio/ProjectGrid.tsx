"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/types/content";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

/** Galerie filtrable par catégorie (filtrage côté client, instantané). */
export function ProjectGrid({ projects, categories }: { projects: Project[]; categories: ProjectCategory[] }) {
  const [active, setActive] = useState<string>("all");
  const used = categories.filter((c) => projects.some((p) => p.category_id === c.id));
  const visible = active === "all" ? projects : projects.filter((p) => p.category_id === active);

  const filters = [{ id: "all", name: "Tous", count: projects.length }, ...used.map((c) => ({ id: c.id, name: c.name, count: projects.filter((p) => p.category_id === c.id).length }))];

  return (
    <>
      <div role="group" aria-label="Filtrer par catégorie" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={active === f.id}
            onClick={() => setActive(f.id)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 text-sm transition-colors duration-300",
              active === f.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
            )}
          >
            {f.name}
            <sup className="font-mono text-[0.65rem] opacity-60">{f.count}</sup>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <div
            key={project.id}
            className="animate-[fade-up_0.8s_var(--ease-out-expo)_both]"
            style={{ animationDelay: `${(i % 3) * 80}ms` }}
          >
            <ProjectCard project={project} index={projects.indexOf(project)} priority={i < 3} />
          </div>
        ))}
      </div>
      {visible.length === 0 && <p className="mt-12 text-stone">Aucun projet dans cette catégorie.</p>}
    </>
  );
}
