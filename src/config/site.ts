/**
 * Configuration statique du site. Les contenus éditoriaux (bio, stats, SEO…)
 * sont gérés depuis /admin ; ici ne figurent que les éléments structurels.
 */

export const siteConfig = {
  name: "Abdoul Aly TAITA",
  /** Texte du logo dans le header. */
  shortName: "Mon espace",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "fr_FR",
  /** Coordonnées affichées dans le hero (Ouagadougou). */
  coordinates: "12.37°N — 1.52°W",
  blogPageSize: 9,
  /** Délai de régénération des pages publiques (secondes). */
  revalidate: 60,
} as const;

export const mainNav = [
  { href: "/a-propos", label: "À propos" },
  { href: "/experience", label: "Expérience" },
  { href: "/competences", label: "Compétences" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/cv", label: "CV" },
] as const;
