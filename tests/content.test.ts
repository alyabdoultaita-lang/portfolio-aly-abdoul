import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cvCertifications, cvExperiences, cvProfile, cvProjects, cvSettings, cvSkills } from "../src/content/cv.ts";
import { certificationSchema, experienceSchema, profileSchema, projectSchema, skillSchema } from "../src/lib/validation/admin.ts";

describe("contenu du CV", () => {
  it("le profil passe la validation de l'admin", () => {
    const { id: _id, ...profile } = cvProfile;
    assert.ok(profileSchema.safeParse(profile).success, JSON.stringify(profileSchema.safeParse(profile).error?.issues));
  });

  it("chaque expérience, compétence, certification et projet est valide", () => {
    for (const { id: _id, ...e } of cvExperiences) assert.ok(experienceSchema.safeParse(e).success, e.role);
    for (const { id: _id, ...s } of cvSkills) assert.ok(skillSchema.safeParse(s).success, s.name);
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
    for (const list of [cvExperiences, cvSkills, cvCertifications, cvProjects]) {
      const ids = list.map((x) => x.id);
      assert.equal(new Set(ids).size, ids.length);
    }
    assert.equal(new Set(cvProjects.map((p) => p.slug)).size, cvProjects.length);
  });
});
