/**
 * ⚠️ ARTICLES DE DÉMONSTRATION
 *
 * Seuls les articles du blog sont des exemples : ils illustrent la mise en
 * page tant qu'aucun vrai article n'existe. Ils ne sont utilisés QUE lorsque
 * Supabase n'est pas configuré, et ne sont jamais insérés en base.
 * Le reste du contenu (profil, expériences, compétences…) est réel : voir
 * src/content/cv.ts.
 */

import type { Article, Category, Tag } from "@/types/content";

export const demoCategories: Category[] = [
  { id: "demo-cat-1", name: "Stratégie", slug: "strategie", description: null },
  { id: "demo-cat-2", name: "Analytics", slug: "analytics", description: null },
  { id: "demo-cat-3", name: "IA générative", slug: "ia-generative", description: null },
];

export const demoTags: Tag[] = [
  { id: "demo-tag-1", name: "GA4", slug: "ga4" },
  { id: "demo-tag-2", name: "GTM", slug: "gtm" },
  { id: "demo-tag-3", name: "Social media", slug: "social-media" },
  { id: "demo-tag-4", name: "IA", slug: "ia" },
  { id: "demo-tag-5", name: "Afrique", slug: "afrique" },
];

const demoArticleContent = `
<p><strong>[Article de démonstration]</strong> Ce texte illustre la mise en page d'un article. Remplacez-le depuis l'administration.</p>
<h2>Pourquoi ce sujet compte</h2>
<p>Un bon article commence par poser le problème clairement. Le lecteur doit comprendre en quelques lignes ce qu'il va apprendre et pourquoi cela le concerne.</p>
<blockquote><p>La donnée n'a de valeur que si elle permet de prendre une meilleure décision.</p></blockquote>
<h2>La méthode, étape par étape</h2>
<ol><li>Définir l'objectif business.</li><li>Choisir les indicateurs qui le mesurent.</li><li>Mettre en place la collecte.</li><li>Analyser, décider, itérer.</li></ol>
<h3>Un point d'attention</h3>
<p>Les outils changent, la logique reste. Concentrez-vous sur les questions que vous voulez résoudre avant de choisir la plateforme.</p>
<ul><li>Clarté des objectifs</li><li>Qualité des données</li><li>Régularité de l'analyse</li></ul>
<h2>En résumé</h2>
<p>Terminez par une synthèse et une invitation à l'action : contact, partage, ou lecture d'un article lié.</p>
`;

const article = (
  n: number,
  title: string,
  slug: string,
  subtitle: string,
  catIndex: number,
  tagIdx: number[],
  daysAgo: number,
): Article => ({
  id: `demo-article-${n}`,
  title,
  subtitle,
  slug,
  excerpt: subtitle,
  content: demoArticleContent,
  cover_url: `/demo/article-${n}.svg`,
  cover_alt: `Illustration de démonstration : ${title}`,
  author: "Abdoul Aly TAITA",
  category_id: demoCategories[catIndex].id,
  category: demoCategories[catIndex],
  tags: tagIdx.map((i) => demoTags[i]),
  status: "published",
  published_at: new Date(Date.UTC(2026, 8, 30) - daysAgo * 86_400_000).toISOString(),
  reading_time: 4,
  meta_title: null,
  meta_description: null,
});

export const demoArticles: Article[] = [
  article(1, "Mesurer ce qui compte vraiment avec GA4", "mesurer-ce-qui-compte-avec-ga4", "Construire un plan de mesure utile avant de configurer le moindre tag.", 1, [0, 1], 3),
  article(2, "L'IA générative au service des équipes marketing", "ia-generative-equipes-marketing", "Des usages concrets pour produire mieux, sans perdre la voix de la marque.", 2, [3], 15),
  article(3, "Réseaux sociaux en Afrique de l'Ouest : ce qui change", "reseaux-sociaux-afrique-de-l-ouest", "Formats, plateformes et comportements : un état des lieux pour les marques.", 0, [2, 4], 32),
  article(4, "Structurer une stratégie digitale en 5 étapes", "structurer-une-strategie-digitale", "Une méthode simple pour passer des idées à un plan d'action mesurable.", 0, [2], 60),
];
