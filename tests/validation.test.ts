import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { articleSchema, experienceSchema, profileSchema } from "../src/lib/validation/admin.ts";
import { safeAdminRedirect } from "../src/lib/validation/auth.ts";
import { contactSchema } from "../src/lib/validation/contact.ts";

const baseArticle = {
  title: "Titre valide",
  subtitle: null,
  slug: "titre-valide",
  excerpt: null,
  content: "<p>x</p>",
  cover_url: null,
  cover_alt: null,
  author: "Abdoul Aly TAITA",
  category_id: null,
  status: "published" as const,
  published_at: new Date().toISOString(),
  reading_time: 1,
  meta_title: null,
  meta_description: null,
};

describe("redirection après connexion", () => {
  it("accepte les chemins internes à /admin", () => {
    assert.equal(safeAdminRedirect("/admin/articles"), "/admin/articles");
    assert.equal(safeAdminRedirect("/admin/projets/abc-123"), "/admin/projets/abc-123");
  });
  it("refuse toute redirection ouverte", () => {
    for (const bad of ["https://evil.com", "//evil.com", "/admin//evil.com", "/administrateur", "/blog", "javascript:alert(1)", null, 42]) {
      assert.equal(safeAdminRedirect(bad), "/admin", String(bad));
    }
  });
});

describe("articleSchema", () => {
  it("accepte un article valide", () => {
    assert.ok(articleSchema.safeParse(baseArticle).success);
  });
  it("refuse un slug invalide", () => {
    assert.equal(articleSchema.safeParse({ ...baseArticle, slug: "Pas Un Slug" }).success, false);
  });
  it("refuse les URL javascript: / data: pour la couverture", () => {
    for (const cover_url of ["javascript:alert(1)", "data:text/html,x", "//evil.com/x.png"]) {
      assert.equal(articleSchema.safeParse({ ...baseArticle, cover_url }).success, false, cover_url);
    }
  });
  it("accepte https et chemins internes", () => {
    assert.ok(articleSchema.safeParse({ ...baseArticle, cover_url: "https://x.supabase.co/storage/v1/object/public/media/a.jpg" }).success);
    assert.ok(articleSchema.safeParse({ ...baseArticle, cover_url: "/demo/article-1.svg" }).success);
  });
  it("limite meta description à 170 caractères", () => {
    assert.equal(articleSchema.safeParse({ ...baseArticle, meta_description: "x".repeat(171) }).success, false);
  });
});

describe("experienceSchema", () => {
  const exp = {
    company: "Org", role: "Responsable", location: null, employment_type: null, start_date: "2023-01-01", end_date: "2022-01-01",
    is_current: false, description: null, responsibilities: [], achievements: [], results: [], tools: [], company_url: null,
    logo_url: null, sort_order: 0, is_visible: true,
  };
  it("refuse une date de fin antérieure au début", () => {
    assert.equal(experienceSchema.safeParse(exp).success, false);
  });
  it("accepte un poste actuel sans date de fin", () => {
    assert.ok(experienceSchema.safeParse({ ...exp, end_date: null, is_current: true }).success);
  });
});

describe("profileSchema", () => {
  it("refuse un lien LinkedIn non http(s)", () => {
    const profile = {
      full_name: "Abdoul Aly TAITA", headline: "Responsable Digital", tagline: null, short_bio: null, bio: null, location: null,
      email: null, phone: null, photo_url: null, cv_url: null, linkedin_url: "javascript:alert(1)", twitter_url: null,
      github_url: null, website_url: null, available_for_work: true, languages: [], interests: [],
    };
    assert.equal(profileSchema.safeParse(profile).success, false);
    assert.ok(profileSchema.safeParse({ ...profile, linkedin_url: "https://www.linkedin.com/in/x" }).success);
  });
});

describe("contactSchema", () => {
  it("valide un message correct", () => {
    assert.ok(contactSchema.safeParse({ name: "Awa", email: "awa@example.org", subject: "", message: "Bonjour, une mission ?" }).success);
  });
  it("refuse e-mail invalide et message trop court", () => {
    const r = contactSchema.safeParse({ name: "A", email: "pas-un-email", message: "court" });
    assert.equal(r.success, false);
    const fields = Object.keys(r.error!.flatten().fieldErrors);
    assert.deepEqual(fields.sort(), ["email", "message", "name"]);
  });
});

describe("skillSchema", () => {
  it("accepte un niveau absent (null) ou entre 0 et 100", async () => {
    const { skillSchema } = await import("../src/lib/validation/admin.ts");
    const s = { name: "Meta Ads", category_id: "3f2b8a4e-1c2d-4e5f-8a9b-0c1d2e3f4a5b", description: null, sort_order: 0, is_featured: false };
    assert.ok(skillSchema.safeParse({ ...s, level: null }).success);
    assert.ok(skillSchema.safeParse({ ...s, level: 80 }).success);
    assert.equal(skillSchema.safeParse({ ...s, level: 120 }).success, false);
  });
});

describe("groupSkillsByDomain", () => {
  it("trie par ordre, masque les domaines vides et les compétences non classées", async () => {
    const { groupSkillsByDomain } = await import("../src/lib/skills.ts");
    const cat = (id: string, sort_order: number) => ({ id, name: id, slug: id, description: null, icon: null, sort_order });
    const skill = (id: string, category_id: string | null, sort_order: number) => ({
      id, name: id, category_id, category: null, level: null, description: null, sort_order, is_featured: true,
    });
    const domains = groupSkillsByDomain(
      [cat("B", 2), cat("A", 1), cat("Vide", 3)],
      [skill("b2", "B", 2), skill("b1", "B", 1), skill("a1", "A", 1), skill("orpheline", null, 1)],
    );
    assert.deepEqual(domains.map((d) => [d.category.id, d.skills.map((s) => s.id)]), [["A", ["a1"]], ["B", ["b1", "b2"]]]);
  });
});
