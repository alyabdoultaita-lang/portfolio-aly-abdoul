/**
 * Types métier partagés entre la base de données, les pages publiques et l'admin.
 * Les noms de champs suivent les colonnes SQL (snake_case) pour éviter toute
 * couche de transformation.
 */

export type PublishStatus = "draft" | "published";

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  tagline: string | null;
  short_bio: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  cv_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  website_url: string | null;
  available_for_work: boolean;
  languages: string[];
  interests: string[];
}

export interface Stat {
  value: string;
  suffix?: string;
  label: string;
}

export interface SiteSettings {
  stats: Stat[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    kicker: string;
    statement: string;
  };
  contact_cta: {
    title: string;
    text: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  responsibilities: string[];
  achievements: string[];
  results: string[];
  tools: string[];
  company_url: string | null;
  logo_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string | null;
  sort_order: number;
  is_featured: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category?: ProjectCategory | null;
  client: string | null;
  year: number | null;
  cover_url: string | null;
  cover_alt: string | null;
  gallery: string[];
  excerpt: string | null;
  description: string | null;
  context: string | null;
  objectives: string | null;
  results: string | null;
  tools: string[];
  link_url: string | null;
  is_featured: boolean;
  status: PublishStatus;
  sort_order: number;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  cover_alt: string | null;
  author: string;
  category_id: string | null;
  category?: Category | null;
  tags?: Tag[];
  status: PublishStatus;
  published_at: string | null;
  reading_time: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  sort_order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
}
