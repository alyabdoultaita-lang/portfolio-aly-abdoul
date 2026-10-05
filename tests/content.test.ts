import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cvCertifications, cvExperiences, cvProfile, cvProjects, cvSettings, cvSkillCategories, cvSkills } from "../src/content/cv.ts";
import { groupSkillsByDomain } from "../src/lib/skills.ts";
import { certificationSchema, experienceSchema, profileSchema, projectSchema, skillCategorySchema, skillSchema } from "../src/lib/validation/admin.ts";

describe("contenu du CV", () => {
  it("le profil passe la validation de l'admin", () => {
    const { id: _id, ...profile } = cvProfile;
    assert.ok(profileSchema.safeParse(profile).success, JSON.stringify(profileSchema.safeParse(profile).error?.issues));
  });

  it("chaque expérience, compétence, certification et projet est valide", () => {
    for (const { id: _id, ...e } of cvExperiences) assert.ok(experienceSchema.safeParse(e).success, e.role);
    // category_id local (« cv-sc-… ») : en base, c'est l'UUID du domaine.
    for (const { id: _id, category: _c, ...s } of cvSkills) assert.ok(skillSchema.safeParse({ ...s, category_id: null }).success, s.name);
    for (const { id: _id, ...c } of cvSkillCategories) assert.ok(skillCategorySchema.safeParse(c).success, c.name);
    for (const { id: _id, ...c } of cvCertifications) assert.ok(certificationSchema.safeParse(c).success, c.name);
    // category_id local (« cv-pc-web ») : en base, il est remplacé par l'UUID de la catégorie.
    for (const { id: _id, category: _c, updated_at: _u, ...p } of cvProjects) {
      assert.ok(projectSchema.safeParse({ ...p, category_id: null }).success, p.title);
    }
  });

  it("un seul poste actuel, expériences de la plus récente à la plus ancienne", () => {
    assert.equal(cvExperiences.filter((e) => e.is_current).length, 1);
    const starts = cvExperiences.map((e) => e.start_date);
    assert.deepEqual(starts, [...starts].sort().reverse());
  });

  it("aucun niveau de compétence inventé (absent du CV)", () => {
    assert.ok(cvSkills.every((s) => s.level === null));
  });

  it("les statistiques correspondent au contenu", () => {
    const stat = (label: string) => cvSettings.stats.find((s) => s.label === label)?.value;
    assert.equal(stat("Certifications"), String(cvCertifications.filter((c) => c.kind === "certification").length));
    assert.equal(stat("Sites web intégrés"), String(cvProjects.length));
  });

  it("slugs et identifiants uniques", () => {
    for (const list of [cvExperiences, cvSkills, cvSkillCategories, cvCertifications, cvProjects]) {
      const ids = list.map((x) => x.id);
      assert.equal(new Set(ids).size, ids.length);
    }
    assert.equal(new Set(cvProjects.map((p) => p.slug)).size, cvProjects.length);
  });

  it("compétences : 5 domaines dans l'ordre demandé, avec leurs compétences", () => {
    const domains = groupSkillsByDomain(cvSkillCategories, cvSkills);
    assert.deepEqual(
      domains.map((d) => `${d.category.name}: ${d.skills.map((s) => s.name).join(", ")}`),
      [
        "Stratégie: Stratégie digitale, Plan marketing digital, Social Media Strategy, Content Strategy",
        "Acquisition: Meta Ads, Google Ads, LinkedIn Ads, SEO",
        "Data & Tracking: Google Analytics 4 (GA4), Google Tag Manager, Looker Studio, Conversion Tracking",
        "Web: WordPress, Elementor, SEO technique, UX/UI",
        "Management: Gestion de projet, Coordination d'équipe, Gestion de prestataires, Reporting, Budget média",
      ],
    );
  });
});
