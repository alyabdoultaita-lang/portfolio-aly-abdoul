import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Article,
  Category,
  Certification,
  Experience,
  Message,
  Profile,
  Project,
  ProjectCategory,
  Skill,
  Tag,
} from "@/types/content";

/**
 * Lectures de l'administration : client authentifié → la RLS laisse voir
 * les brouillons, articles programmés et messages.
 */
async function db() {
  return createSupabaseServerClient();
}

export async function getDashboardStats() {
  const supabase = await db();
  const count = async (table: string, filter?: (q: ReturnType<typeof base>) => ReturnType<typeof base>) => {
    const q = base(table);
    const { count: c } = await (filter ? filter(q) : q);
    return c ?? 0;
  };
  const base = (table: string) => supabase.from(table).select("*", { count: "exact", head: true });
  const now = new Date().toISOString();

  const [articles, published, scheduled, drafts, projects, messages, unread, experiences, skills, certifications] = await Promise.all([
    count("articles"),
    count("articles", (q) => q.eq("status", "published").lte("published_at", now)),
    count("articles", (q) => q.eq("status", "published").gt("published_at", now)),
    count("articles", (q) => q.eq("status", "draft")),
    count("projects"),
    count("messages"),
    count("messages", (q) => q.eq("is_read", false)),
    count("experiences"),
    count("skills"),
    count("certifications"),
  ]);
  return { articles, published, scheduled, drafts, projects, messages, unread, experiences, skills, certifications };
}

export async function getUnreadCount() {
  const supabase = await db();
  const { count } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false);
  return count ?? 0;
}

export async function listArticles() {
  const supabase = await db();
  const { data } = await supabase
    .from("articles")
    .select("id,title,slug,status,published_at,updated_at,reading_time,category:categories(name)")
    .order("updated_at", { ascending: false });
  return (data ?? []) as unknown as (Pick<Article, "id" | "title" | "slug" | "status" | "published_at" | "updated_at" | "reading_time"> & {
    category: { name: string } | null;
  })[];
}

export async function getArticle(id: string) {
  const supabase = await db();
  const { data } = await supabase.from("articles")
    .select(
      "id,title,subtitle,slug,excerpt,content,cover_url,cover_alt,author,category_id,status,published_at,reading_time,meta_title,meta_description,created_at,updated_at,article_tags(tag:tags(id,name,slug))",
    ).eq("id", id).maybeSingle();
  if (!data) return null;
  const { article_tags, ...rest } = data as unknown as Article & { article_tags: { tag: Tag | null }[] };
  return { ...rest, tags: article_tags.map((t) => t.tag).filter((t): t is Tag => Boolean(t)) } as Article;
}

export async function listCategories() {
  const supabase = await db();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data ?? []) as Category[];
}

export async function listTags() {
  const supabase = await db();
  const { data } = await supabase.from("tags").select("*").order("name");
  return (data ?? []) as Tag[];
}

export async function listProjects() {
  const supabase = await db();
  const { data } = await supabase
    .from("projects")
    .select("*,category:project_categories(id,name,slug,sort_order)")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return (data ?? []) as Project[];
}

export async function getProject(id: string) {
  const supabase = await db();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data as Project | null;
}

export async function listProjectCategories() {
  const supabase = await db();
  const { data } = await supabase.from("project_categories").select("*").order("sort_order");
  return (data ?? []) as ProjectCategory[];
}

export async function listExperiences() {
  const supabase = await db();
  const { data } = await supabase.from("experiences").select("*").order("sort_order").order("start_date", { ascending: false });
  return (data ?? []) as Experience[];
}

export async function getExperience(id: string) {
  const supabase = await db();
  const { data } = await supabase.from("experiences").select("*").eq("id", id).maybeSingle();
  return data as Experience | null;
}

export async function listSkills() {
  const supabase = await db();
  const { data } = await supabase.from("skills").select("*").order("category").order("sort_order");
  return (data ?? []) as Skill[];
}

export async function listCertifications() {
  const supabase = await db();
  const { data } = await supabase.from("certifications").select("*").order("kind", { ascending: false }).order("sort_order");
  return (data ?? []) as Certification[];
}

export async function listMessages() {
  const supabase = await db();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(200);
  return (data ?? []) as Message[];
}

export async function getAdminProfile() {
  const supabase = await db();
  const { data } = await supabase.from("profiles").select("*").eq("is_primary", true).maybeSingle();
  return data as Profile | null;
}

export async function getAdminSettings() {
  const supabase = await db();
  const { data } = await supabase.from("site_settings").select("key,value");
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<string, unknown>;
}
