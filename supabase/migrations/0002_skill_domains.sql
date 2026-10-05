-- ============================================================================
-- 0002 — Domaines de compétences (refonte de la section « Compétences »)
-- À exécuter APRÈS 0001_schema.sql (SQL Editor > New query > coller > Run).
-- Ré-exécutable sans erreur et sans doublon.
--
-- • Nouvelle table skill_categories : nom, slug, description, icône, ordre,
--   modifiables depuis /admin.
-- • skills.category_id relie chaque compétence à son domaine.
-- • Les 5 domaines et leurs compétences sont créés.
-- • AUCUNE donnée supprimée : les compétences existantes qui ne font pas
--   partie de la nouvelle liste restent en base, « non classées » (masquées
--   sur le site, visibles et réaffectables dans /admin › Compétences).
--   La colonne texte skills.category est conservée (historique).
-- ============================================================================

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  -- clé d'icône : strategy | acquisition | data | web | management (ou null)
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace trigger skill_categories_updated_at before update on public.skill_categories
  for each row execute function public.set_updated_at();

alter table public.skills
  add column if not exists category_id uuid references public.skill_categories (id) on delete set null;
alter table public.skills alter column category drop not null;
create index if not exists skills_category_id on public.skills (category_id, sort_order);

alter table public.skill_categories enable row level security;
drop policy if exists "skill_categories_public_read" on public.skill_categories;
create policy "skill_categories_public_read" on public.skill_categories
  for select using (true);
drop policy if exists "skill_categories_admin_write" on public.skill_categories;
create policy "skill_categories_admin_write" on public.skill_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Les 5 domaines (non écrasés s'ils existent déjà : vos modifications /admin sont conservées)
insert into public.skill_categories (name, slug, description, icon, sort_order) values
  ('Stratégie', 'strategie',
   'Définir le cap : positionnement, plan d''action et ligne éditoriale alignés sur les objectifs business.',
   'strategy', 1),
  ('Acquisition', 'acquisition',
   'Générer de la visibilité et des leads qualifiés grâce aux campagnes payantes et au référencement.',
   'acquisition', 2),
  ('Data & Tracking', 'data-tracking',
   'Mesurer ce qui compte : plan de taggage, suivi des conversions et tableaux de bord.',
   'data', 3),
  ('Web', 'web',
   'Concevoir et optimiser des sites performants, bien référencés et pensés pour l''utilisateur.',
   'web', 4),
  ('Management', 'management',
   'Piloter les projets, les équipes, les prestataires et les budgets jusqu''aux résultats.',
   'management', 5)
on conflict (slug) do nothing;

-- Compétences par domaine.
-- 1) Une compétence existante non classée portant le même nom est rattachée
--    au domaine (pas de doublon) ; 2) sinon elle est créée.
do $$
declare
  r record;
  cat uuid;
begin
  for r in
    select * from (values
      ('strategie',     'Stratégie digitale',          1),
      ('strategie',     'Plan marketing digital',      2),
      ('strategie',     'Social Media Strategy',       3),
      ('strategie',     'Content Strategy',            4),
      ('acquisition',   'Meta Ads',                    1),
      ('acquisition',   'Google Ads',                  2),
      ('acquisition',   'LinkedIn Ads',                3),
      ('acquisition',   'SEO',                         4),
      ('data-tracking', 'Google Analytics 4 (GA4)',    1),
      ('data-tracking', 'Google Tag Manager',          2),
      ('data-tracking', 'Looker Studio',               3),
      ('data-tracking', 'Conversion Tracking',         4),
      ('web',           'WordPress',                   1),
      ('web',           'Elementor',                   2),
      ('web',           'SEO technique',               3),
      ('web',           'UX/UI',                       4),
      ('management',    'Gestion de projet',           1),
      ('management',    'Coordination d''équipe',      2),
      ('management',    'Gestion de prestataires',     3),
      ('management',    'Reporting',                   4),
      ('management',    'Budget média',                5)
    ) as t(cat_slug, skill_name, ord)
  loop
    select id into cat from public.skill_categories where slug = r.cat_slug;
    if cat is null then continue; end if;
    if exists (select 1 from public.skills where category_id = cat and lower(name) = lower(r.skill_name)) then
      continue;
    end if;
    update public.skills
       set category_id = cat, sort_order = r.ord, is_featured = true
     where id = (select id from public.skills
                  where category_id is null and lower(name) = lower(r.skill_name)
                  order by created_at limit 1);
    if not found then
      insert into public.skills (name, category, category_id, sort_order, is_featured)
      values (r.skill_name, null, cat, r.ord, true);
    end if;
  end loop;
end $$;
