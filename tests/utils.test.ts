import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { csvToArray, formatPeriod, linesToArray, readingTime, slugify, stripHtml, truncate } from "../src/lib/utils.ts";

describe("slugify", () => {
  it("supprime accents, apostrophes et ponctuation", () => {
    assert.equal(slugify("Stratégie Digitale & IA"), "strategie-digitale-ia");
    assert.equal(slugify("L'IA générative au service des équipes"), "l-ia-generative-au-service-des-equipes");
    assert.equal(slugify("  --Réseaux sociaux en Afrique !--  "), "reseaux-sociaux-en-afrique");
  });
  it("renvoie une chaîne vide si rien d'exploitable", () => {
    assert.equal(slugify("!!!"), "");
  });
  it("limite la longueur à 96 caractères", () => {
    assert.ok(slugify("a".repeat(200)).length <= 96);
  });
});

describe("texte", () => {
  it("stripHtml retire les balises", () => {
    assert.equal(stripHtml("<p>Bonjour <strong>le</strong>&nbsp;monde</p>"), "Bonjour le monde");
  });
  it("readingTime ≈ 220 mots/minute, minimum 1", () => {
    assert.equal(readingTime("<p>court</p>"), 1);
    assert.equal(readingTime(`<p>${"mot ".repeat(1100)}</p>`), 5);
  });
  it("truncate coupe sur un mot et ajoute …", () => {
    assert.equal(truncate("Un texte assez long pour être coupé", 15), "Un texte assez…");
    assert.equal(truncate("court", 15), "court");
  });
  it("linesToArray et csvToArray ignorent les entrées vides", () => {
    assert.deepEqual(linesToArray("a\n\n  b \r\nc"), ["a", "b", "c"]);
    assert.deepEqual(csvToArray("GA4, GTM,, SEO "), ["GA4", "GTM", "SEO"]);
  });
});

describe("formatPeriod", () => {
  it("affiche « Aujourd'hui » pour un poste actuel", () => {
    assert.match(formatPeriod("2023-01-01", null, true), /2023 — Aujourd'hui$/);
  });
  it("affiche la date de fin sinon", () => {
    assert.match(formatPeriod("2021-03-01", "2022-12-31", false), /2021 — .*2022$/);
  });
});
