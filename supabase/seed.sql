-- ============================================================================
-- Données de départ (facultatif) — à exécuter APRÈS 0001_schema.sql
-- Elles fournissent une structure à compléter depuis /admin.
-- Les textes marqués [À compléter] sont des exemples à remplacer.
-- Aucun projet, article ou expérience fictif n'est publié.
-- ============================================================================

insert into public.profiles (full_name, headline, tagline, short_bio, bio, location, available_for_work, languages, is_primary)
values (
  'Abdoul Aly TAITA',
  'Responsable Digital / Marketing Digital',
  '[À compléter] Votre phrase d''accroche.',
  '[À compléter] Présentation courte affichée sur l''accueil et le CV.',
  '[À compléter] Votre biographie complète.',
  'Ouagadougou, Burkina Faso',
  true,
  array['Français', 'Anglais'],
  true
)
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('stats', '[
    {"value": "0", "suffix": "+", "label": "Années d''expérience"},
    {"value": "0", "suffix": "+", "label": "Projets réalisés"},
    {"value": "0", "suffix": "+", "label": "Campagnes pilotées"},
    {"value": "0", "suffix": "", "label": "Plateformes maîtrisées"}
  ]'::jsonb),
  ('hero', '{"kicker": "Portfolio — Édition 2026", "statement": "Stratégie, contenus et données au service d''une croissance mesurable."}'::jsonb),
  ('contact_cta', '{"title": "Construisons quelque chose de remarquable.", "text": "Une stratégie à repenser, une campagne à lancer, une équipe à structurer ? Parlons-en."}'::jsonb),
  ('seo', '{"title": "Abdoul Aly TAITA — Responsable Digital & Marketing Digital", "description": "Portfolio d''Abdoul Aly TAITA, Responsable Digital / Marketing Digital au Burkina Faso : stratégie digitale, social media, Google Ads, analytics, SEO et IA générative.", "keywords": ["Responsable digital", "Marketing digital", "Burkina Faso"]}'::jsonb)
on conflict (key) do nothing;

-- Une compétence par catégorie demandée (niveaux à ajuster dans l'admin)
insert into public.skills (name, category, level, sort_order, is_featured) values
  ('Stratégie de marque digitale', 'Stratégie digitale', 80, 1, true),
  ('Marketing d''acquisition', 'Digital Marketing', 80, 2, true),
  ('Community management', 'Social Media', 80, 3, true),
  ('Campagnes Search & Display', 'Google Ads', 80, 4, true),
  ('Google Analytics 4', 'Analytics', 80, 5, true),
  ('Plan de taggage', 'Google Tag Manager', 80, 6, true),
  ('SEO on-page', 'SEO', 80, 7, true),
  ('Création de sites', 'WordPress', 80, 8, true),
  ('Rédaction web', 'Création de contenu', 80, 9, true),
  ('Prompting & workflows IA', 'IA générative', 80, 10, true),
  ('Gestion de projet', 'Gestion de projet', 80, 11, true);

insert into public.project_categories (name, slug, sort_order) values
  ('Social Media', 'social-media', 0),
  ('Campagnes Ads', 'campagnes-ads', 1),
  ('Sites web', 'sites-web', 2),
  ('Stratégie', 'strategie', 3)
on conflict (slug) do nothing;

insert into public.categories (name, slug) values
  ('Stratégie', 'strategie'),
  ('Social media', 'social-media'),
  ('Analytics', 'analytics'),
  ('IA générative', 'ia-generative')
on conflict (slug) do nothing;
