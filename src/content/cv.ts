/**
 * CONTENU RÉEL — issu du CV d'Abdoul Aly TAITA (version d'octobre 2026).
 *
 * Utilisé :
 * - comme contenu du site tant que Supabase n'est pas configuré ;
 * - pour générer `supabase/seed.sql` (npm run seed:generate), afin que la base
 *   démarre avec ces mêmes informations, modifiables ensuite depuis /admin.
 *
 * Règle : uniquement des faits présents dans le CV. Les éléments absents du CV
 * (résultats chiffrés, niveaux de compétence, dates des projets web…) sont
 * laissés vides plutôt qu'inventés.
 */

import type {
  Certification,
  Experience,
  Profile,
  Project,
  ProjectCategory,
  SiteSettings,
  Skill,
  SkillCategory,
} from "@/types/content";

export const cvProfile: Profile = {
  id: "cv-profile",
  full_name: "Abdoul Aly TAITA",
  headline: "Responsable Digital / Marketing Digital",
  tagline: "Je fais grandir la présence digitale des marques, du contenu à la publicité en ligne.",
  short_bio:
    "Responsable Digital au sein du Groupe DIACFA à Ouagadougou, j'accompagne entreprises, médias et institutions dans leur présence en ligne depuis 2021 : gestion des réseaux sociaux, publicité Meta, Google et LinkedIn Ads, création de contenus, sites web et reporting.",
  bio: [
    "Je suis Responsable Digital au sein du Groupe DIACFA, à Ouagadougou, depuis janvier 2026. Mon métier : construire et faire vivre la présence digitale des marques, de la stratégie jusqu'à la publication, en passant par la publicité en ligne et le suivi des performances.",
    "Mon parcours a commencé par l'écriture. Titulaire d'une licence en Lettres modernes de l'Université Norbert Zongo, j'ai fait mes débuts comme rédacteur web pour Digital Magazine Burkina Faso, où je rédigeais des articles sur le digital, assurais une veille sur les nouveaux outils et repérais les entrepreneurs du secteur.",
    "Je me suis ensuite spécialisé en marketing digital et community management, avec Orange Digital Center (2022) puis le programme FORCE de l'Université Numérique Cheikh Hamidou Kane (2023). Sur le terrain, j'ai été community manager pour Access International Studies, puis assistant en communication digitale chez MASSAKA SAS, pour Agribusiness TV.",
    "De décembre 2023 à janvier 2026, en tant que Social Media Manager chez Factory Business Solutions, j'ai géré l'ensemble des plateformes digitales de Conso'Mag, de l'ANAC BF et d'IRH Afrique : contenus graphiques et rédactionnels, stratégie et publicité, rapports mensuels et création de sites web.",
    "En parallèle, j'ai été l'intégrateur principal de plusieurs sites web : site d'entreprise, site vitrine industriel, restaurant et hôtel.",
  ].join("\n\n"),
  location: "Ouagadougou, Burkina Faso",
  email: "alyabdoultaita@gmail.com",
  phone: "+226 55 28 75 49",
  photo_url: "/demo/portrait.svg",
  cv_url: null,
  linkedin_url: "https://www.linkedin.com/in/alyabdoultaita/",
  twitter_url: null,
  github_url: null,
  website_url: null,
  available_for_work: true,
  languages: ["Français (très bien)", "Mooré (langue maternelle)", "Anglais (intermédiaire)"],
  interests: ["Musique", "Technologie", "Lecture"],
};

export const cvSettings: SiteSettings = {
  // Chiffres calculés à partir du CV (à mettre à jour depuis Admin › Paramètres).
  stats: [
    { value: "4", suffix: "+", label: "Années d'expérience" },
    { value: "4", suffix: "", label: "Sites web intégrés" },
    { value: "8", suffix: "", label: "Certifications" },
    { value: "14", suffix: "", label: "Outils maîtrisés" },
  ],
  seo: {
    title: "Abdoul Aly TAITA — Responsable Digital & Marketing Digital",
    description:
      "Abdoul Aly TAITA, Responsable Digital à Ouagadougou (Burkina Faso) : social media, Meta Ads, Google Ads, LinkedIn Ads, création de contenus et sites web WordPress.",
    keywords: [
      "Abdoul Aly TAITA",
      "Responsable digital",
      "Marketing digital",
      "Social media manager",
      "Community manager",
      "Ouagadougou",
      "Burkina Faso",
    ],
  },
  hero: {
    kicker: "Portfolio — 2026",
    statement: "Réseaux sociaux, publicité en ligne, contenus et sites web : le digital comme levier de croissance.",
  },
  contact_cta: {
    title: "Construisons votre présence digitale.",
    text: "Un poste à pourvoir, une stratégie à repenser, une marque à faire grandir en ligne ? Parlons-en.",
  },
};

const exp = (e: Omit<Experience, "achievements" | "results" | "tools" | "company_url" | "logo_url" | "is_visible"> & Partial<Experience>): Experience => ({
  achievements: [],
  results: [],
  tools: [],
  company_url: null,
  logo_url: null,
  is_visible: true,
  ...e,
});

export const cvExperiences: Experience[] = [
  exp({
    id: "cv-exp-diacfa",
    company: "Groupe DIACFA",
    role: "Responsable Digital",
    location: "Ouagadougou",
    employment_type: null,
    start_date: "2026-01-01",
    end_date: null,
    is_current: true,
    description: null,
    responsibilities: [],
    sort_order: 0,
  }),
  exp({
    id: "cv-exp-factory",
    company: "Factory Business Solutions",
    role: "Social Media Manager",
    location: "Ouagadougou",
    employment_type: null,
    start_date: "2023-12-01",
    end_date: "2026-01-31",
    is_current: false,
    description:
      "Gestion de l'ensemble des plateformes digitales (web, YouTube, réseaux sociaux…) de Conso'Mag, de l'ANAC BF et d'IRH Afrique.",
    responsibilities: [
      "Création de contenus graphiques et rédactionnels",
      "Stratégie digitale et publicité en ligne",
      "Rapports de performance mensuels",
      "Création de sites web",
    ],
    sort_order: 1,
  }),
  exp({
    id: "cv-exp-massaka",
    company: "MASSAKA SAS — Agribusiness TV",
    role: "Assistant en communication digitale",
    location: "Ouagadougou",
    employment_type: null,
    start_date: "2023-02-01",
    end_date: "2023-10-31",
    is_current: false,
    description: "Gestion de l'ensemble des plateformes digitales d'Agribusiness TV (web, YouTube, réseaux sociaux…).",
    responsibilities: [
      "Création de contenus graphiques et rédactionnels",
      "Rapports de performance mensuels",
      "Conception et envoi de la newsletter",
    ],
    sort_order: 2,
  }),
  exp({
    id: "cv-exp-access",
    company: "Access International Studies",
    role: "Community Manager",
    location: "Ouagadougou",
    employment_type: null,
    start_date: "2022-07-01",
    end_date: "2022-12-31",
    is_current: false,
    description: null,
    responsibilities: [
      "Stratégie de marketing digital",
      "Création de contenus rédactionnels et visuels",
      "Relation client en ligne",
      "Benchmark",
      "Veille stratégique et concurrentielle",
    ],
    sort_order: 3,
  }),
  exp({
    id: "cv-exp-digital-magazine",
    company: "Digital Magazine Burkina Faso",
    role: "Rédacteur web",
    location: "Ouagadougou",
    employment_type: null,
    start_date: "2021-12-01",
    end_date: "2023-01-31",
    is_current: false,
    description: null,
    responsibilities: [
      "Rédaction d'articles sur le digital",
      "Veille sur les nouveaux outils et mises à jour du digital",
      "Repérage des entrepreneurs du secteur digital",
      "Couverture de conférences de presse",
    ],
    sort_order: 4,
  }),
];

/**
 * Compétences organisées en 5 domaines (ordre d'affichage = sort_order).
 * Même contenu que supabase/migrations/0002_skill_domains.sql.
 * Aucun niveau en pourcentage : la section met en avant les domaines maîtrisés.
 */
export const cvSkillCategories: SkillCategory[] = [
  {
    id: "cv-sc-strategie",
    name: "Stratégie",
    slug: "strategie",
    description: "Définir le cap : positionnement, plan d'action et ligne éditoriale alignés sur les objectifs business.",
    icon: "strategy",
    sort_order: 1,
  },
  {
    id: "cv-sc-acquisition",
    name: "Acquisition",
    slug: "acquisition",
    description: "Générer de la visibilité et des leads qualifiés grâce aux campagnes payantes et au référencement.",
    icon: "acquisition",
    sort_order: 2,
  },
  {
    id: "cv-sc-data-tracking",
    name: "Data & Tracking",
    slug: "data-tracking",
    description: "Mesurer ce qui compte : plan de taggage, suivi des conversions et tableaux de bord.",
    icon: "data",
    sort_order: 3,
  },
  {
    id: "cv-sc-web",
    name: "Web",
    slug: "web",
    description: "Concevoir et optimiser des sites performants, bien référencés et pensés pour l'utilisateur.",
    icon: "web",
    sort_order: 4,
  },
  {
    id: "cv-sc-management",
    name: "Management",
    slug: "management",
    description: "Piloter les projets, les équipes, les prestataires et les budgets jusqu'aux résultats.",
    icon: "management",
    sort_order: 5,
  },
];

const skillsByDomain: Record<string, string[]> = {
  strategie: ["Stratégie digitale", "Plan marketing digital", "Social Media Strategy", "Content Strategy"],
  acquisition: ["Meta Ads", "Google Ads", "LinkedIn Ads", "SEO"],
  "data-tracking": ["Google Analytics 4 (GA4)", "Google Tag Manager", "Looker Studio", "Conversion Tracking"],
  web: ["WordPress", "Elementor", "SEO technique", "UX/UI"],
  management: ["Gestion de projet", "Coordination d'équipe", "Gestion de prestataires", "Reporting", "Budget média"],
};

export const cvSkills: Skill[] = cvSkillCategories.flatMap((cat) =>
  skillsByDomain[cat.slug].map((name, i) => ({
    id: `cv-skill-${cat.slug}-${i + 1}`,
    name,
    category_id: cat.id,
    category: null,
    level: null,
    description: null,
    sort_order: i + 1,
    is_featured: true,
  })),
);

const cert = (
  n: number,
  kind: Certification["kind"],
  name: string,
  issuer: string,
  issue_date: string | null = null,
): Certification => ({
  id: `cv-cert-${n}`,
  kind,
  name,
  issuer,
  issue_date,
  expiry_date: null,
  credential_id: null,
  credential_url: null,
  sort_order: n,
});

export const cvCertifications: Certification[] = [
  cert(1, "formation", "Marketing, Marketing digital — Programme FORCE", "Université Numérique Cheikh Hamidou Kane", "2023-01-01"),
  cert(2, "formation", "Marketing digital et community management", "Orange Digital Center", "2022-01-01"),
  cert(3, "formation", "Licence ès Lettres modernes", "Université Norbert Zongo", "2021-01-01"),
  cert(4, "certification", "Fondamentaux du marketing numérique", "Google — Atelier Numérique Africain"),
  cert(5, "certification", "L'essentiel de Google Analytics GA4", "LinkedIn Learning"),
  cert(6, "certification", "L'essentiel de Mailchimp", "LinkedIn Learning"),
  cert(7, "certification", "Développeur web : WordPress — Elementor", "Udemy"),
  cert(8, "certification", "Talking to AI: Prompt Engineering for Project Managers", "Project Management Institute (PMI)"),
  cert(9, "certification", "Constitution d'équipes et leadership dans la gestion de projets", "Microsoft — Project Management"),
  cert(10, "certification", "Engagement du gestionnaire de projet avec les parties prenantes", "Microsoft — Project Management"),
  cert(11, "certification", "English for Career Development", "Online Professional English Network (OPEN MOOC)"),
];

export const cvProjectCategories: ProjectCategory[] = [
  { id: "cv-pc-web", name: "Sites web", slug: "sites-web", sort_order: 0 },
];

const site = (
  n: number,
  slug: string,
  title: string,
  client: string,
  url: string,
  kind: string,
  is_featured = true,
): Project => ({
  id: `cv-project-${n}`,
  title,
  slug,
  category_id: cvProjectCategories[0].id,
  category: cvProjectCategories[0],
  client,
  year: null,
  cover_url: `/projects/${slug}.svg`,
  cover_alt: `Visuel provisoire du projet ${title} (capture d'écran à ajouter)`,
  gallery: [],
  excerpt: `${kind} — intégrateur principal.`,
  description: `Conception et intégration du ${kind.toLowerCase()} de ${client}, en tant qu'intégrateur principal.`,
  context: null,
  objectives: null,
  results: null,
  tools: [],
  link_url: url,
  is_featured,
  status: "published",
  sort_order: n,
});

export const cvProjects: Project[] = [
  site(1, "site-factory-business-solutions", "Factory Business Solutions", "Factory Business Solutions", "https://factorybf.com", "Site web d'entreprise"),
  site(2, "site-gcm-industrielle", "GCM Industrielle", "GCM Industrielle", "https://gcmindustrielle.com", "Site vitrine"),
  site(3, "site-restaurant-laurines", "Restaurant Laurines", "Laurines", "https://laurines.com", "Site web de restaurant"),
  site(4, "site-hotel-hacienda", "Hôtel Hacienda Ouagadougou", "Hôtel Hacienda Ouagadougou", "https://hotelhaciendaouagadougou.com/", "Site web d'hôtel"),
];
