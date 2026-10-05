/**
 * Génère supabase/seed.sql à partir du contenu réel du CV (src/content/cv.ts).
 *   npm run seed:generate
 * Le seed n'insère une table que si elle est vide : il peut être ré-exécuté
 * sans créer de doublons ni écraser ce que vous avez modifié dans /admin.
 */
import { writeFileSync } from "node:fs";
import {
  cvCertifications,
  cvExperiences,
  cvProfile,
  cvProjectCategories,
  cvProjects,
  cvSettings,
  cvSkills,
} from "../src/content/cv.ts";

type Value = string | number | boolean | null | string[] | object;

function sql(value: Value): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return value.length ? `array[${value.map((v) => sql(v)).join(", ")}]::text[]` : "'{}'::text[]";
  }
  if (typeof value === "object") return `${sql(JSON.stringify(value))}::jsonb`;
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * INSERT exécuté seulement si la table est vide. Un INSERT … VALUES classique
 * laisse PostgreSQL typer chaque valeur d'après la colonne cible (dates, tableaux).
 */
function insertIfEmpty(table: string, rows: Record<string, Value>[]) {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0]);
  const values = rows.map((r) => `      (${columns.map((c) => sql(r[c])).join(", ")})`).join(",\n");
  return `do $seed$ begin
  if not exists (select 1 from public.${table}) then
    insert into public.${table} (${columns.join(", ")}) values
${values};
  end if;
end $seed$;\n`;
}

const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]) =>
  Object.fromEntries(keys.map((k) => [k, obj[k] as Value])) as Record<string, Value>;

const profile = pick(cvProfile, [
  "full_name", "headline", "tagline", "short_bio", "bio", "location", "email", "phone", "photo_url", "cv_url",
  "linkedin_url", "twitter_url", "github_url", "website_url", "available_for_work", "languages", "interests",
]);

const settings = Object.entries(cvSettings).map(([key, value]) => `  (${sql(key)}, ${sql(value)})`).join(",\n");

const projects: Record<string, Value>[] = cvProjects.map((p) => ({
  ...pick(p, ["title", "slug", "client", "year", "cover_url", "cover_alt", "gallery", "excerpt", "description", "context", "objectives", "results", "tools", "link_url", "is_featured", "status", "sort_order"]),
  category_slug: p.category?.slug ?? null,
}));

const projectColumns = Object.keys(projects[0]).filter((k) => k !== "category_slug");

const out = `-- ============================================================================
-- Contenu de départ issu du CV — GÉNÉRÉ par scripts/generate-seed.ts
-- Ne pas modifier à la main : éditez src/content/cv.ts puis npm run seed:generate
-- À exécuter APRÈS supabase/migrations/0001_schema.sql.
-- Chaque table n'est remplie que si elle est vide (ré-exécution sans doublon).
-- ============================================================================

-- Profil
${insertIfEmpty("profiles", [{ ...profile, is_primary: true }])}
-- Paramètres (statistiques calculées à partir du CV, textes du site, SEO)
insert into public.site_settings (key, value) values
${settings}
on conflict (key) do nothing;

-- Expériences
${insertIfEmpty("experiences", cvExperiences.map((e) => pick(e, ["company", "role", "location", "employment_type", "start_date", "end_date", "is_current", "description", "responsibilities", "achievements", "results", "tools", "company_url", "logo_url", "sort_order", "is_visible"])))}
-- Compétences (niveaux non renseignés : absents du CV)
${insertIfEmpty("skills", cvSkills.map((s) => pick(s, ["name", "category", "level", "description", "sort_order", "is_featured"])))}
-- Formations et certifications
${insertIfEmpty("certifications", cvCertifications.map((c) => pick(c, ["kind", "name", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "sort_order"])))}
-- Catégories de projets
insert into public.project_categories (name, slug, sort_order) values
${cvProjectCategories.map((c) => `  (${sql(c.name)}, ${sql(c.slug)}, ${c.sort_order})`).join(",\n")}
on conflict (slug) do nothing;

-- Projets web (captures d'écran à ajouter depuis /admin)
insert into public.projects (${projectColumns.join(", ")}, category_id) values
${projects.map((p) => `  (${projectColumns.map((c) => sql(p[c])).join(", ")}, (select id from public.project_categories where slug = ${sql(p.category_slug)}))`).join(",\n")}
on conflict (slug) do nothing;

-- Catégories du blog (à adapter)
insert into public.categories (name, slug) values
  ('Stratégie digitale', 'strategie-digitale'),
  ('Social media', 'social-media'),
  ('Publicité en ligne', 'publicite-en-ligne'),
  ('Création de contenu', 'creation-de-contenu')
on conflict (slug) do nothing;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), out);
console.log("supabase/seed.sql généré.");
