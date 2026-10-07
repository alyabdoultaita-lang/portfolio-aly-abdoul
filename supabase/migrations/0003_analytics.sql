-- ============================================================================
-- 0003 — Statistiques de visite (page /admin › Statistiques)
-- À exécuter APRÈS 0001 et 0002 (SQL Editor > New query > coller > Run).
-- Ré-exécutable sans erreur. Ne modifie aucune table existante.
--
-- Mesure respectueuse de la vie privée : pas de cookie, pas d'adresse IP
-- stockée. Un visiteur est reconnu par une empreinte anonyme (hachage
-- ip + navigateur + jour) qui change chaque jour.
-- ============================================================================

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  -- pageview | cv_download | contact_message | email_click | phone_click
  -- | linkedin_click | outbound_click
  type text not null check (type in (
    'pageview', 'cv_download', 'contact_message', 'email_click',
    'phone_click', 'linkedin_click', 'outbound_click'
  )),
  path text check (char_length(path) <= 300),
  -- domaine d'origine (ex. linkedin.com, google.com) ; null = accès direct
  referrer text check (char_length(referrer) <= 200),
  -- cible d'un clic (ex. lien externe)
  target text check (char_length(target) <= 300),
  device text check (device in ('mobile', 'tablet', 'desktop')),
  country text check (char_length(country) <= 2),
  visitor text check (char_length(visitor) <= 64),
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_created on public.analytics_events (type, created_at desc);

alter table public.analytics_events enable row level security;

-- Le site (clé publique) peut seulement AJOUTER des événements, jamais les lire.
drop policy if exists "analytics_public_insert" on public.analytics_events;
create policy "analytics_public_insert" on public.analytics_events
  for insert with check (true);

-- Seul l'administrateur peut lire et supprimer.
drop policy if exists "analytics_admin_read" on public.analytics_events;
create policy "analytics_admin_read" on public.analytics_events
  for select using (public.is_admin());
drop policy if exists "analytics_admin_delete" on public.analytics_events;
create policy "analytics_admin_delete" on public.analytics_events
  for delete using (public.is_admin());
