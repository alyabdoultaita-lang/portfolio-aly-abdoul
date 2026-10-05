-- ============================================================================
-- Portfolio Abdoul Aly TAITA — schéma initial
-- À exécuter dans Supabase : SQL Editor > New query > coller > Run
-- (ou `supabase db push` avec la CLI Supabase). Le script peut être ré-exécuté.
-- ============================================================================

create extension if not exists "pgcrypto";
create schema if not exists extensions;
create extension if not exists "unaccent" schema extensions;

-- unaccent() n'est pas IMMUTABLE : wrapper requis pour la colonne générée.
create or replace function public.immutable_unaccent(text)
returns text language sql immutable parallel safe strict
set search_path = ''
as $$ select extensions.unaccent('extensions.unaccent'::regdictionary, $1) $$;

-- ---------------------------------------------------------------------------
-- Utilitaires
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Administrateurs
-- Un utilisateur Supabase Auth n'a accès à /admin que s'il figure ici.
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Profil public
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  headline text not null,
  tagline text,
  short_bio text,
  bio text,
  location text,
  email text,
  phone text,
  photo_url text,
  cv_url text,
  linkedin_url text,
  twitter_url text,
  github_url text,
  website_url text,
  available_for_work boolean not null default true,
  languages text[] not null default '{}',
  interests text[] not null default '{}',
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_single_primary on public.profiles (is_primary) where is_primary;
create or replace trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Paramètres du site (clé / valeur JSON)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create or replace trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Expériences
-- ---------------------------------------------------------------------------

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  employment_type text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  responsibilities text[] not null default '{}',
  achievements text[] not null default '{}',
  results text[] not null default '{}',
  tools text[] not null default '{}',
  company_url text,
  logo_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists experiences_order on public.experiences (sort_order, start_date desc);
create or replace trigger experiences_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Compétences
-- ---------------------------------------------------------------------------

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level int not null default 70 check (level between 0 and 100),
  description text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists skills_category on public.skills (category, sort_order);
create or replace trigger skills_updated_at before update on public.skills
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Projets
-- ---------------------------------------------------------------------------

create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.project_categories (id) on delete set null,
  client text,
  year int,
  cover_url text,
  cover_alt text,
  gallery text[] not null default '{}',
  excerpt text,
  description text,
  context text,
  objectives text,
  results text,
  tools text[] not null default '{}',
  link_url text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_status on public.projects (status, sort_order);
create or replace trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_url text,
  cover_alt text,
  author text not null default 'Abdoul Aly TAITA',
  category_id uuid references public.categories (id) on delete set null,
  -- 'published' + published_at futur = publication programmée
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  reading_time int not null default 1,
  meta_title text,
  meta_description text,
  search tsvector generated always as (
    setweight(to_tsvector('french', public.immutable_unaccent(coalesce(title, ''))), 'A') ||
    setweight(to_tsvector('french', public.immutable_unaccent(coalesce(subtitle, ''))), 'B') ||
    setweight(to_tsvector('french', public.immutable_unaccent(coalesce(excerpt, ''))), 'B') ||
    setweight(to_tsvector('french', public.immutable_unaccent(coalesce(regexp_replace(content, '<[^>]+>', ' ', 'g'), ''))), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_published on public.articles (status, published_at desc);
create index if not exists articles_search on public.articles using gin (search);
create or replace trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

create table if not exists public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (article_id, tag_id)
);
create index if not exists article_tags_tag on public.article_tags (tag_id);

-- ---------------------------------------------------------------------------
-- Certifications
-- ---------------------------------------------------------------------------

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace trigger certifications_updated_at before update on public.certifications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Messages (formulaire de contact)
-- ---------------------------------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200),
  subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 10 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_created on public.messages (created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.admins enable row level security;
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.certifications enable row level security;
alter table public.messages enable row level security;

-- admins : un utilisateur peut seulement vérifier sa propre ligne
drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins
  for select using (user_id = auth.uid());

-- Contenus librement lisibles + écriture admin
do $$
declare t text;
begin
  foreach t in array array['profiles','site_settings','skills','project_categories',
                           'categories','tags','certifications']
  loop
    execute format('drop policy if exists "%1$s_public_read" on public.%1$I;', t);
    execute format('drop policy if exists "%1$s_admin_write" on public.%1$I;', t);
    execute format('create policy "%1$s_public_read" on public.%1$I for select using (true);', t);
    execute format('create policy "%1$s_admin_write" on public.%1$I for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Expériences : visibles si is_visible
drop policy if exists "experiences_public_read" on public.experiences;
create policy "experiences_public_read" on public.experiences
  for select using (is_visible or public.is_admin());
drop policy if exists "experiences_admin_write" on public.experiences;
create policy "experiences_admin_write" on public.experiences
  for all using (public.is_admin()) with check (public.is_admin());

-- Projets : publiés seulement
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select using (status = 'published' or public.is_admin());
drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- Articles : publiés ET date de publication atteinte (gère la programmation)
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select using (
    (status = 'published' and published_at is not null and published_at <= now())
    or public.is_admin()
  );
drop policy if exists "articles_admin_write" on public.articles;
create policy "articles_admin_write" on public.articles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "article_tags_public_read" on public.article_tags;
create policy "article_tags_public_read" on public.article_tags
  for select using (true);
drop policy if exists "article_tags_admin_write" on public.article_tags;
create policy "article_tags_admin_write" on public.article_tags
  for all using (public.is_admin()) with check (public.is_admin());

-- Messages : tout le monde peut écrire, seul l'admin lit / modifie / supprime
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages
  for insert with check (is_read = false);
drop policy if exists "messages_admin_read" on public.messages;
create policy "messages_admin_read" on public.messages
  for select using (public.is_admin());
drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update" on public.messages
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "messages_admin_delete" on public.messages;
create policy "messages_admin_delete" on public.messages
  for delete using (public.is_admin());

-- ============================================================================
-- Stockage : bucket public « media » (images, CV)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml','application/pdf'])
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
