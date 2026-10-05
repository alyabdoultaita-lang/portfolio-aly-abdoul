import "server-only";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import {
  cvCertifications,
  cvExperiences,
  cvProfile,
  cvProjectCategories,
  cvProjects,
  cvSettings,
  cvSkills,
} from "@/content/cv";
import { demoArticles, demoCategories, demoTags } from "@/content/demo";
import { getPublicClient } from "@/lib/supabase/public";
import type {
  Article,
  Category,
  Certification,
  Experience,
  Paginated,
  Profile,
  Project,
  ProjectCategory,
  SiteSettings,
  Skill,
  Tag,
} from "@/types/content";

/**
 * Couche de lecture des pages publiques.
 * - Supabase configuré  → requêtes via le client anonyme (RLS : contenus publiés).
 * - Sinon               → contenu du CV (src/content/cv.ts) + articles d'exemple (src/content/demo.ts).
 * En cas d'erreur réseau, on journalise et on renvoie une valeur vide plutôt
 * que de faire échouer la page entière.
 */

const ARTICLE_SELECT =
  "id,title,subtitle,slug,excerpt,content,cover_url,cover_alt,author,category_id,status,published_at,reading_time,meta_title,meta_description,created_at,updated_at,category:categories(id,name,slug,description),article_tags(tag:tags(id,name,slug))";
const ARTICLE_LIST_SELECT =
  "id,title,subtitle,slug,excerpt,cover_url,cover_alt,author,category_id,status,published_at,reading_time,updated_at,category:categories(id,name,slug,description),article_tags(tag:tags(id,name,slug))";
const PROJECT_SELECT = "*,category:project_categories(id,name,slug,sort_order)";

type ArticleRow = Omit<Article, "tags" | "content"> & {
  content?: string;
  article_tags?: { tag: Tag | null }[];
};

function mapArticle(row: ArticleRow): Article {
  const { article_tags, ...rest } = row;
  return {
    ...rest,
    content: rest.content ?? "",
    tags: (article_tags ?? []).map((t) => t.tag).filter((t): t is Tag => Boolean(t)),
  };
}

/** Profil minimal utilisé quand Supabase est connecté mais qu'aucun profil n'existe encore. */
const emptyProfile: Profile = {
  id: "empty",
  full_name: siteConfig.name,
  headline: "Responsable Digital / Marketing Digital",
  tagline: null,
  short_bio: null,
  bio: null,
  location: "Burkina Faso",
  email: null,
  phone: null,
  photo_url: null,
  cv_url: null,
  linkedin_url: null,
  twitter_url: null,
  github_url: null,
  website_url: null,
  available_for_work: false,
  languages: [],
  interests: [],
};

function logError(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error);
}

// ---------------------------------------------------------------------------
// Profil & paramètres
// ---------------------------------------------------------------------------

export const getProfile = cache(async (): Promise<Profile> => {
  const db = getPublicClient();
  if (!db) return cvProfile;
  const { data, error } = await db.from("profiles").select("*").eq("is_primary", true).maybeSingle();
  if (error) logError("profile", error);
  // Base connectée mais profil absent : profil neutre, jamais les données de démo.
  return (data as Profile | null) ?? emptyProfile;
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = getPublicClient();
  if (!db) return cvSettings;
  const { data, error } = await db.from("site_settings").select("key,value");
  if (error) logError("settings", error);
  const stored = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    // Pas de statistiques enregistrées → section masquée (aucun chiffre inventé).
    stats: stored.stats ?? [],
    seo: { ...cvSettings.seo, ...(stored.seo ?? {}) },
    hero: { ...cvSettings.hero, ...(stored.hero ?? {}) },
    contact_cta: { ...cvSettings.contact_cta, ...(stored.contact_cta ?? {}) },
  };
});

// ---------------------------------------------------------------------------
// Expériences, compétences, certifications
// ---------------------------------------------------------------------------

export const getExperiences = cache(async (): Promise<Experience[]> => {
  const db = getPublicClient();
  if (!db) return cvExperiences;
  const { data, error } = await db
    .from("experiences")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order")
    .order("start_date", { ascending: false });
  if (error) logError("experiences", error);
  return (data as Experience[]) ?? [];
});

export const getSkills = cache(async (): Promise<Skill[]> => {
  const db = getPublicClient();
  if (!db) return cvSkills;
  const { data, error } = await db.from("skills").select("*").order("sort_order");
  if (error) logError("skills", error);
  return (data as Skill[]) ?? [];
});

export const getCertifications = cache(async (): Promise<Certification[]> => {
  const db = getPublicClient();
  if (!db) return cvCertifications;
  const { data, error } = await db.from("certifications").select("*").order("sort_order");
  if (error) logError("certifications", error);
  return (data as Certification[]) ?? [];
});

// ---------------------------------------------------------------------------
// Projets
// ---------------------------------------------------------------------------

export const getProjectCategories = cache(async (): Promise<ProjectCategory[]> => {
  const db = getPublicClient();
  if (!db) return cvProjectCategories;
  const { data, error } = await db.from("project_categories").select("*").order("sort_order");
  if (error) logError("project_categories", error);
  return (data as ProjectCategory[]) ?? [];
});

export const getProjects = cache(async (opts: { featured?: boolean; limit?: number } = {}): Promise<Project[]> => {
  const db = getPublicClient();
  if (!db) {
    const list = opts.featured ? cvProjects.filter((p) => p.is_featured) : cvProjects;
    return opts.limit ? list.slice(0, opts.limit) : list;
  }
  let query = db.from("projects").select(PROJECT_SELECT).eq("status", "published").order("sort_order");
  if (opts.featured) query = query.eq("is_featured", true);
  if (opts.limit) query = query.limit(opts.limit);
  const { data, error } = await query;
  if (error) logError("projects", error);
  return (data as Project[]) ?? [];
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const db = getPublicClient();
  if (!db) return cvProjects.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) logError("project", error);
  return (data as Project | null) ?? null;
});

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const getBlogCategories = cache(async (): Promise<Category[]> => {
  const db = getPublicClient();
  if (!db) return demoCategories;
  const { data, error } = await db.from("categories").select("*").order("name");
  if (error) logError("categories", error);
  return (data as Category[]) ?? [];
});

export const getTags = cache(async (): Promise<Tag[]> => {
  const db = getPublicClient();
  if (!db) return demoTags;
  const { data, error } = await db.from("tags").select("*").order("name");
  if (error) logError("tags", error);
  return (data as Tag[]) ?? [];
});

export interface ArticleQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  category?: string;
  tag?: string;
}

function filterDemoArticles({ q, category, tag }: ArticleQuery) {
  const needle = q?.toLowerCase();
  return demoArticles.filter(
    (a) =>
      (!category || a.category?.slug === category) &&
      (!tag || a.tags?.some((t) => t.slug === tag)) &&
      (!needle || `${a.title} ${a.subtitle} ${a.excerpt}`.toLowerCase().includes(needle)),
  );
}

export async function getArticles(query: ArticleQuery = {}): Promise<Paginated<Article>> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = query.pageSize ?? siteConfig.blogPageSize;
  const from = (page - 1) * pageSize;
  const db = getPublicClient();

  if (!db) {
    const all = filterDemoArticles(query);
    return { items: all.slice(from, from + pageSize), total: all.length, page, pageCount: Math.max(1, Math.ceil(all.length / pageSize)) };
  }

  let req = db
    .from("articles")
    .select(ARTICLE_LIST_SELECT, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (query.q) {
    // L'index est sans accents (immutable_unaccent) : on normalise aussi la requête.
    const q = query.q.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    req = req.textSearch("search", q, { type: "websearch", config: "french" });
  }
  if (query.tag) {
    const tags = await getTags();
    const tag = tags.find((t) => t.slug === query.tag);
    if (!tag) return { items: [], total: 0, page, pageCount: 1 };
    const { data: links } = await db.from("article_tags").select("article_id").eq("tag_id", tag.id);
    req = req.in("id", (links ?? []).map((l) => l.article_id));
  }
  if (query.category) {
    const categories = await getBlogCategories();
    const cat = categories.find((c) => c.slug === query.category);
    if (!cat) return { items: [], total: 0, page, pageCount: 1 };
    req = req.eq("category_id", cat.id);
  }

  const { data, error, count } = await req;
  if (error) logError("articles", error);
  const total = count ?? 0;
  return {
    items: ((data ?? []) as unknown as ArticleRow[]).map(mapArticle),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const db = getPublicClient();
  if (!db) return demoArticles.find((a) => a.slug === slug) ?? null;
  const { data, error } = await db
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) logError("article", error);
  return data ? mapArticle(data as unknown as ArticleRow) : null;
});

/** Articles similaires : même catégorie ou tags communs, puis les plus récents. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const { items } = await getArticles({ pageSize: 24 });
  const tagIds = new Set(article.tags?.map((t) => t.id));
  return items
    .filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      score:
        (a.category_id && a.category_id === article.category_id ? 2 : 0) +
        (a.tags?.filter((t) => tagIds.has(t.id)).length ?? 0),
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(({ a }) => a);
}

/** Toutes les URLs indexables (sitemap). */
export async function getSitemapEntries() {
  const db = getPublicClient();
  if (!db) {
    return {
      articles: demoArticles.map((a) => ({ slug: a.slug, updated_at: a.published_at })),
      projects: cvProjects.map((p) => ({ slug: p.slug, updated_at: null as string | null })),
    };
  }
  const [articles, projects] = await Promise.all([
    db
      .from("articles")
      .select("slug,updated_at")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString()),
    db.from("projects").select("slug,updated_at").eq("status", "published"),
  ]);
  return {
    articles: (articles.data ?? []) as { slug: string; updated_at: string | null }[],
    projects: (projects.data ?? []) as { slug: string; updated_at: string | null }[],
  };
}
