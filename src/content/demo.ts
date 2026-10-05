/**
 * ⚠️ DONNÉES DE DÉMONSTRATION
 *
 * Ces contenus ne sont utilisés QUE lorsque Supabase n'est pas configuré
 * (variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY absentes).
 * Ils servent à visualiser le design. Les entreprises, chiffres et projets
 * ci-dessous sont des EXEMPLES : remplacez-les par vos vraies informations
 * depuis /admin une fois la base connectée.
 */

import type {
  Article,
  Category,
  Certification,
  Experience,
  Profile,
  Project,
  ProjectCategory,
  SiteSettings,
  Skill,
  Tag,
} from "@/types/content";

export const demoProfile: Profile = {
  id: "demo-profile",
  full_name: "Abdoul Aly TAITA",
  headline: "Responsable Digital / Marketing Digital",
  tagline: "Je conçois des stratégies digitales qui transforment l'attention en résultats mesurables.",
  short_bio:
    "Responsable Digital basé au Burkina Faso, j'accompagne entreprises, ONG et institutions dans leur stratégie digitale : acquisition, réseaux sociaux, mesure de la performance et contenus.",
  bio: "[Démo] Rédigez ici votre biographie complète depuis l'administration (Profil).\n\nParlez de votre parcours, de votre approche du digital, des secteurs que vous connaissez et de ce qui vous anime. Ce texte apparaît sur la page À propos.\n\nVous pouvez écrire plusieurs paragraphes : chaque saut de ligne double crée un nouveau paragraphe.",
  location: "Ouagadougou, Burkina Faso",
  email: "contact@exemple.com",
  phone: null,
  photo_url: "/demo/portrait.svg",
  cv_url: null,
  linkedin_url: "https://www.linkedin.com/",
  twitter_url: null,
  github_url: null,
  website_url: null,
  available_for_work: true,
  languages: ["Français", "Anglais"],
  interests: ["Innovation", "IA générative", "Entrepreneuriat"],
};

export const demoSettings: SiteSettings = {
  stats: [
    { value: "5", suffix: "+", label: "Années d'expérience" },
    { value: "40", suffix: "+", label: "Projets réalisés" },
    { value: "120", suffix: "+", label: "Campagnes pilotées" },
    { value: "15", suffix: "", label: "Plateformes maîtrisées" },
  ],
  seo: {
    title: "Abdoul Aly TAITA — Responsable Digital & Marketing Digital",
    description:
      "Portfolio d'Abdoul Aly TAITA, Responsable Digital / Marketing Digital au Burkina Faso : stratégie digitale, social media, Google Ads, analytics, SEO et IA générative.",
    keywords: [
      "Responsable digital",
      "Marketing digital",
      "Burkina Faso",
      "Ouagadougou",
      "Social media",
      "Google Ads",
      "SEO",
    ],
  },
  hero: {
    kicker: "Portfolio — Édition 2026",
    statement: "Stratégie, contenus et données au service d'une croissance mesurable.",
  },
  contact_cta: {
    title: "Construisons quelque chose de remarquable.",
    text: "Une stratégie à repenser, une campagne à lancer, une équipe à structurer ? Parlons-en.",
  },
};

export const demoExperiences: Experience[] = [
  {
    id: "demo-exp-1",
    company: "Organisation exemple A",
    role: "Responsable Digital",
    location: "Ouagadougou",
    employment_type: "CDI",
    start_date: "2023-01-01",
    end_date: null,
    is_current: true,
    description:
      "[Démo] Pilotage de la stratégie digitale globale : présence en ligne, acquisition, contenus et mesure de la performance.",
    responsibilities: [
      "Définir et piloter la stratégie digitale annuelle",
      "Encadrer la production de contenus multicanal",
      "Gérer les budgets publicitaires Meta et Google",
    ],
    achievements: ["Mise en place d'un plan de taggage complet (GTM + GA4)", "Refonte du site institutionnel"],
    results: ["Résultat chiffré à compléter", "Résultat chiffré à compléter"],
    tools: ["Meta Business Suite", "Google Ads", "GA4", "GTM", "WordPress"],
    company_url: null,
    logo_url: null,
    sort_order: 0,
    is_visible: true,
  },
  {
    id: "demo-exp-2",
    company: "ONG exemple B",
    role: "Chargé de communication digitale",
    location: "Burkina Faso",
    employment_type: "Contrat",
    start_date: "2021-03-01",
    end_date: "2022-12-31",
    is_current: false,
    description:
      "[Démo] Communication digitale de programmes de développement : campagnes de sensibilisation, reporting et visibilité des bailleurs.",
    responsibilities: [
      "Animer les réseaux sociaux de l'organisation",
      "Produire les supports de visibilité des projets",
      "Suivre les indicateurs de performance",
    ],
    achievements: ["Lancement d'une campagne de sensibilisation nationale"],
    results: ["Résultat chiffré à compléter"],
    tools: ["Facebook", "LinkedIn", "Canva", "Mailchimp"],
    company_url: null,
    logo_url: null,
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "demo-exp-3",
    company: "Agence exemple C",
    role: "Community Manager",
    location: "Ouagadougou",
    employment_type: "Stage puis CDD",
    start_date: "2019-06-01",
    end_date: "2021-02-28",
    is_current: false,
    description: "[Démo] Gestion de communautés et création de contenus pour plusieurs marques locales.",
    responsibilities: ["Planifier les calendriers éditoriaux", "Modérer et animer les communautés"],
    achievements: ["Accompagnement de plusieurs marques clientes"],
    results: [],
    tools: ["Meta Business Suite", "Photoshop", "Hootsuite"],
    company_url: null,
    logo_url: null,
    sort_order: 2,
    is_visible: true,
  },
];

const skill = (
  id: number,
  name: string,
  category: string,
  level: number,
  is_featured = false,
): Skill => ({ id: `demo-skill-${id}`, name, category, level, description: null, sort_order: id, is_featured });

export const demoSkills: Skill[] = [
  skill(1, "Stratégie de marque digitale", "Stratégie digitale", 90, true),
  skill(2, "Plan de communication", "Stratégie digitale", 85),
  skill(3, "Marketing d'acquisition", "Digital Marketing", 88, true),
  skill(4, "Emailing & automation", "Digital Marketing", 75),
  skill(5, "Meta Ads", "Social Media", 90, true),
  skill(6, "Community management", "Social Media", 92),
  skill(7, "LinkedIn & TikTok", "Social Media", 80),
  skill(8, "Campagnes Search & Display", "Google Ads", 82, true),
  skill(9, "Google Analytics 4", "Analytics", 85, true),
  skill(10, "Looker Studio", "Analytics", 78),
  skill(11, "Plan de taggage & conversions", "Google Tag Manager", 80, true),
  skill(12, "SEO on-page & technique", "SEO", 78, true),
  skill(13, "Création & gestion de sites", "WordPress", 85, true),
  skill(14, "Rédaction web", "Création de contenu", 88),
  skill(15, "Design graphique (Canva, Photoshop)", "Création de contenu", 80, true),
  skill(16, "Prompting & workflows IA", "IA générative", 85, true),
  skill(17, "Génération d'images & vidéos", "IA générative", 75),
  skill(18, "Gestion de projet agile", "Gestion de projet", 82, true),
  skill(19, "Coordination d'équipes", "Gestion de projet", 80),
];

export const demoProjectCategories: ProjectCategory[] = [
  { id: "demo-pc-1", name: "Social Media", slug: "social-media", sort_order: 0 },
  { id: "demo-pc-2", name: "Campagnes Ads", slug: "campagnes-ads", sort_order: 1 },
  { id: "demo-pc-3", name: "Sites web", slug: "sites-web", sort_order: 2 },
  { id: "demo-pc-4", name: "Stratégie", slug: "strategie", sort_order: 3 },
];

const project = (
  n: number,
  title: string,
  slug: string,
  catIndex: number,
  excerpt: string,
  tools: string[],
  is_featured = false,
): Project => ({
  id: `demo-project-${n}`,
  title,
  slug,
  category_id: demoProjectCategories[catIndex].id,
  category: demoProjectCategories[catIndex],
  client: "Client exemple",
  year: 2026 - (n % 3),
  cover_url: `/demo/project-${n}.svg`,
  cover_alt: `Visuel de démonstration du projet ${title}`,
  gallery: [],
  excerpt,
  description:
    "[Démo] Décrivez ici le projet en quelques paragraphes : le besoin, votre rôle, la démarche suivie et les livrables.",
  context: "[Démo] Contexte du projet : organisation, marché, situation de départ.",
  objectives: "[Démo] Objectifs fixés : notoriété, acquisition, conversion, engagement…",
  results: "[Démo] Résultats obtenus : indiquez vos vrais chiffres (portée, leads, ventes, ROAS…).",
  tools,
  link_url: null,
  is_featured,
  status: "published",
  sort_order: n,
});

export const demoProjects: Project[] = [
  project(1, "Lancement de marque", "lancement-de-marque", 3, "Stratégie de lancement 360° pour une nouvelle marque.", ["Meta Ads", "Canva", "GA4"], true),
  project(2, "Campagne de sensibilisation", "campagne-de-sensibilisation", 0, "Campagne social media pour un programme de développement.", ["Facebook", "TikTok", "CapCut"], true),
  project(3, "Refonte de site institutionnel", "refonte-site-institutionnel", 2, "Nouveau site WordPress rapide et optimisé SEO.", ["WordPress", "Elementor", "Search Console"], true),
  project(4, "Acquisition Google Ads", "acquisition-google-ads", 1, "Campagnes Search et Performance Max orientées conversion.", ["Google Ads", "GTM", "GA4"], true),
  project(5, "Tableau de bord marketing", "tableau-de-bord-marketing", 3, "Reporting unifié des performances digitales.", ["Looker Studio", "GA4", "Sheets"]),
  project(6, "Contenus assistés par IA", "contenus-assistes-par-ia", 0, "Workflow de production de contenus avec l'IA générative.", ["ChatGPT", "Claude", "Midjourney"]),
];

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

export const demoCertifications: Certification[] = [
  {
    id: "demo-cert-1",
    name: "Certification exemple — Google Ads",
    issuer: "Google",
    issue_date: "2024-01-01",
    expiry_date: null,
    credential_id: null,
    credential_url: null,
    sort_order: 0,
  },
  {
    id: "demo-cert-2",
    name: "Certification exemple — Analytics",
    issuer: "Google",
    issue_date: "2023-06-01",
    expiry_date: null,
    credential_id: null,
    credential_url: null,
    sort_order: 1,
  },
];
