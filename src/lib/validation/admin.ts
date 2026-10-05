import { z } from "zod";

/** URL http(s) ou chemin interne (« /… ») ; javascript:, data:… sont refusés. */
const url = z.union([
  z.url({ protocol: /^https?$/, message: "URL invalide (https://…)" }),
  z.string().regex(/^\/(?!\/)/, "URL invalide"),
  z.null(),
]);
const slug = z
  .string()
  .min(1, "Slug requis.")
  .max(96)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Uniquement minuscules, chiffres et tirets.");

export const articleSchema = z.object({
  title: z.string().min(3, "Titre requis (3 caractères min.).").max(200),
  subtitle: z.string().max(300).nullable(),
  slug,
  excerpt: z.string().max(400).nullable(),
  content: z.string(),
  cover_url: url,
  cover_alt: z.string().max(200).nullable(),
  author: z.string().min(2).max(120),
  category_id: z.uuid().nullable(),
  status: z.enum(["draft", "published"]),
  published_at: z.iso.datetime({ offset: true }).nullable(),
  reading_time: z.number().int().min(1),
  meta_title: z.string().max(70, "70 caractères maximum.").nullable(),
  meta_description: z.string().max(170, "170 caractères maximum.").nullable(),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Titre requis.").max(200),
  slug,
  category_id: z.uuid().nullable(),
  client: z.string().max(120).nullable(),
  year: z.number().int().min(1990).max(2100).nullable(),
  cover_url: url,
  cover_alt: z.string().max(200).nullable(),
  gallery: z.array(z.string()),
  excerpt: z.string().max(300).nullable(),
  description: z.string().nullable(),
  context: z.string().nullable(),
  objectives: z.string().nullable(),
  results: z.string().nullable(),
  tools: z.array(z.string()),
  link_url: url,
  is_featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  sort_order: z.number().int(),
});

export const experienceSchema = z
  .object({
    company: z.string().min(1, "Entreprise requise.").max(160),
    role: z.string().min(1, "Poste requis.").max(160),
    location: z.string().max(120).nullable(),
    employment_type: z.string().max(60).nullable(),
    start_date: z.iso.date("Date de début requise."),
    end_date: z.iso.date().nullable(),
    is_current: z.boolean(),
    description: z.string().nullable(),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string()),
    results: z.array(z.string()),
    tools: z.array(z.string()),
    company_url: url,
    logo_url: url,
    sort_order: z.number().int(),
    is_visible: z.boolean(),
  })
  .refine((d) => !d.end_date || d.is_current || d.end_date >= d.start_date, {
    path: ["end_date"],
    message: "La date de fin doit suivre la date de début.",
  });

export const skillSchema = z.object({
  name: z.string().min(1, "Nom requis.").max(120),
  category: z.string().min(1, "Catégorie requise.").max(80),
  level: z.number().int().min(0).max(100).nullable(),
  description: z.string().max(300).nullable(),
  sort_order: z.number().int(),
  is_featured: z.boolean(),
});

export const certificationSchema = z.object({
  kind: z.enum(["certification", "formation"]),
  name: z.string().min(2, "Intitulé requis.").max(200),
  issuer: z.string().min(1, "Organisme requis.").max(160),
  issue_date: z.iso.date().nullable(),
  expiry_date: z.iso.date().nullable(),
  credential_id: z.string().max(120).nullable(),
  credential_url: url,
  sort_order: z.number().int(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(120),
  headline: z.string().min(2).max(160),
  tagline: z.string().max(240).nullable(),
  short_bio: z.string().max(600).nullable(),
  bio: z.string().max(8000).nullable(),
  location: z.string().max(120).nullable(),
  email: z.email("E-mail invalide.").nullable(),
  phone: z.string().max(40).nullable(),
  photo_url: url,
  cv_url: url,
  linkedin_url: url,
  twitter_url: url,
  github_url: url,
  website_url: url,
  available_for_work: z.boolean(),
  languages: z.array(z.string()),
  interests: z.array(z.string()),
});

export const termSchema = z.object({
  name: z.string().min(1, "Nom requis.").max(80),
  slug,
});
