import type { ReactNode } from "react";
import { delay } from "@/lib/utils";

interface PageHeroProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}

/** En-tête commun des pages intérieures (H1 unique de la page). */
export function PageHero({ index, eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="container-x pb-16 pt-32 sm:pb-24 sm:pt-40">
      <p className="eyebrow fade-up flex justify-between border-b border-ink pb-4 text-stone">
        <span>
          <span className="text-ink">{index} / </span>
          {eyebrow}
        </span>
        <span aria-hidden="true">A.A.T</span>
      </p>
      <h1 className="display-lg mt-10 max-w-6xl">
        <span className="line-mask">
          <span style={delay(80)}>{title}</span>
        </span>
      </h1>
      {intro && (
        <div className="fade-up mt-10 max-w-2xl text-xl leading-snug text-stone sm:text-2xl" style={delay(350)}>
          {intro}
        </div>
      )}
      {children}
    </section>
  );
}
