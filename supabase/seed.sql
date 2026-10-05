-- ============================================================================
-- Contenu de départ issu du CV — GÉNÉRÉ par scripts/generate-seed.ts
-- Ne pas modifier à la main : éditez src/content/cv.ts puis npm run seed:generate
-- À exécuter APRÈS supabase/migrations/0001_schema.sql.
-- Chaque table n'est remplie que si elle est vide (ré-exécution sans doublon).
-- ============================================================================

-- Profil
do $seed$ begin
  if not exists (select 1 from public.profiles) then
    insert into public.profiles (full_name, headline, tagline, short_bio, bio, location, email, phone, photo_url, cv_url, linkedin_url, twitter_url, github_url, website_url, available_for_work, languages, interests, is_primary) values
      ('Abdoul Aly TAITA', 'Responsable Digital / Marketing Digital', 'Je fais grandir la présence digitale des marques, du contenu à la publicité en ligne.', 'Responsable Digital au sein du Groupe DIACFA à Ouagadougou, j''accompagne entreprises, médias et institutions dans leur présence en ligne depuis 2021 : gestion des réseaux sociaux, publicité Meta, Google et LinkedIn Ads, création de contenus, sites web et reporting.', 'Je suis Responsable Digital au sein du Groupe DIACFA, à Ouagadougou, depuis janvier 2026. Mon métier : construire et faire vivre la présence digitale des marques, de la stratégie jusqu''à la publication, en passant par la publicité en ligne et le suivi des performances.

Mon parcours a commencé par l''écriture. Titulaire d''une licence en Lettres modernes de l''Université Norbert Zongo, j''ai fait mes débuts comme rédacteur web pour Digital Magazine Burkina Faso, où je rédigeais des articles sur le digital, assurais une veille sur les nouveaux outils et repérais les entrepreneurs du secteur.

Je me suis ensuite spécialisé en marketing digital et community management, avec Orange Digital Center (2022) puis le programme FORCE de l''Université Numérique Cheikh Hamidou Kane (2023). Sur le terrain, j''ai été community manager pour Access International Studies, puis assistant en communication digitale chez MASSAKA SAS, pour Agribusiness TV.

De décembre 2023 à janvier 2026, en tant que Social Media Manager chez Factory Business Solutions, j''ai géré l''ensemble des plateformes digitales de Conso''Mag, de l''ANAC BF et d''IRH Afrique : contenus graphiques et rédactionnels, stratégie et publicité, rapports mensuels et création de sites web.

En parallèle, j''ai été l''intégrateur principal de plusieurs sites web : site d''entreprise, site vitrine industriel, restaurant et hôtel.', 'Ouagadougou, Burkina Faso', 'alytaita77@gmail.com', '+226 55 28 75 49', '/demo/portrait.svg', null, 'https://www.linkedin.com/in/alyabdoultaita/', null, null, null, true, array['Français (très bien)', 'Mooré (langue maternelle)', 'Anglais (intermédiaire)']::text[], array['Musique', 'Technologie', 'Lecture']::text[], true);
  end if;
end $seed$;

-- Paramètres (statistiques calculées à partir du CV, textes du site, SEO)
insert into public.site_settings (key, value) values
  ('stats', '[{"value":"4","suffix":"+","label":"Années d''expérience"},{"value":"4","suffix":"","label":"Sites web intégrés"},{"value":"8","suffix":"","label":"Certifications"},{"value":"14","suffix":"","label":"Outils maîtrisés"}]'::jsonb),
  ('seo', '{"title":"Abdoul Aly TAITA — Responsable Digital & Marketing Digital","description":"Abdoul Aly TAITA, Responsable Digital à Ouagadougou (Burkina Faso) : social media, Meta Ads, Google Ads, LinkedIn Ads, création de contenus et sites web WordPress.","keywords":["Abdoul Aly TAITA","Responsable digital","Marketing digital","Social media manager","Community manager","Ouagadougou","Burkina Faso"]}'::jsonb),
  ('hero', '{"kicker":"Portfolio — 2026","statement":"Réseaux sociaux, publicité en ligne, contenus et sites web : le digital comme levier de croissance."}'::jsonb),
  ('contact_cta', '{"title":"Construisons votre présence digitale.","text":"Un poste à pourvoir, une stratégie à repenser, une marque à faire grandir en ligne ? Parlons-en."}'::jsonb)
on conflict (key) do nothing;

-- Expériences
do $seed$ begin
  if not exists (select 1 from public.experiences) then
    insert into public.experiences (company, role, location, employment_type, start_date, end_date, is_current, description, responsibilities, achievements, results, tools, company_url, logo_url, sort_order, is_visible) values
      ('Groupe DIACFA', 'Responsable Digital', 'Ouagadougou', null, '2026-01-01', null, true, null, '{}'::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, null, 0, true),
      ('Factory Business Solutions', 'Social Media Manager', 'Ouagadougou', null, '2023-12-01', '2026-01-31', false, 'Gestion de l''ensemble des plateformes digitales (web, YouTube, réseaux sociaux…) de Conso''Mag, de l''ANAC BF et d''IRH Afrique.', array['Création de contenus graphiques et rédactionnels', 'Stratégie digitale et publicité en ligne', 'Rapports de performance mensuels', 'Création de sites web']::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, null, 1, true),
      ('MASSAKA SAS — Agribusiness TV', 'Assistant en communication digitale', 'Ouagadougou', null, '2023-02-01', '2023-10-31', false, 'Gestion de l''ensemble des plateformes digitales d''Agribusiness TV (web, YouTube, réseaux sociaux…).', array['Création de contenus graphiques et rédactionnels', 'Rapports de performance mensuels', 'Conception et envoi de la newsletter']::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, null, 2, true),
      ('Access International Studies', 'Community Manager', 'Ouagadougou', null, '2022-07-01', '2022-12-31', false, null, array['Stratégie de marketing digital', 'Création de contenus rédactionnels et visuels', 'Relation client en ligne', 'Benchmark', 'Veille stratégique et concurrentielle']::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, null, 3, true),
      ('Digital Magazine Burkina Faso', 'Rédacteur web', 'Ouagadougou', null, '2021-12-01', '2023-01-31', false, null, array['Rédaction d''articles sur le digital', 'Veille sur les nouveaux outils et mises à jour du digital', 'Repérage des entrepreneurs du secteur digital', 'Couverture de conférences de presse']::text[], '{}'::text[], '{}'::text[], '{}'::text[], null, null, 4, true);
  end if;
end $seed$;

-- Compétences (niveaux non renseignés : absents du CV)
do $seed$ begin
  if not exists (select 1 from public.skills) then
    insert into public.skills (name, category, level, description, sort_order, is_featured) values
      ('Stratégie de marketing digital', 'Stratégie digitale', null, null, 1, true),
      ('Benchmark et veille concurrentielle', 'Stratégie digitale', null, null, 2, false),
      ('Reporting mensuel de performance', 'Digital Marketing', null, null, 3, true),
      ('Emailing et newsletter (Mailchimp)', 'Digital Marketing', null, null, 4, false),
      ('Community management', 'Social Media', null, null, 5, true),
      ('Meta Business Suite', 'Social Media', null, null, 6, false),
      ('Hootsuite', 'Social Media', null, null, 7, false),
      ('Meta Ads', 'Social Media', null, null, 8, true),
      ('LinkedIn Ads', 'Social Media', null, null, 9, false),
      ('Google Ads', 'Google Ads', null, null, 10, true),
      ('Google Analytics (GA4)', 'Analytics', null, null, 11, true),
      ('Google Tag Manager', 'Google Tag Manager', null, null, 12, false),
      ('Création et gestion de sites WordPress', 'WordPress', null, null, 13, true),
      ('Elementor', 'WordPress', null, null, 14, false),
      ('SEO', 'SEO', null, null, 15, false),
      ('Rédaction web', 'Création de contenu', null, null, 16, true),
      ('Canva', 'Création de contenu', null, null, 17, false),
      ('Photoshop', 'Création de contenu', null, null, 18, false),
      ('Premiere Pro', 'Création de contenu', null, null, 19, false),
      ('CapCut', 'Création de contenu', null, null, 20, false),
      ('Photographie', 'Création de contenu', null, null, 21, false),
      ('Prompt engineering', 'IA générative', null, null, 22, true),
      ('Gestion de projet et leadership d''équipe', 'Gestion de projet', null, null, 23, true),
      ('Engagement des parties prenantes', 'Gestion de projet', null, null, 24, false),
      ('Google Drive et Dropbox', 'Gestion de projet', null, null, 25, false);
  end if;
end $seed$;

-- Formations et certifications
do $seed$ begin
  if not exists (select 1 from public.certifications) then
    insert into public.certifications (kind, name, issuer, issue_date, expiry_date, credential_id, credential_url, sort_order) values
      ('formation', 'Marketing, Marketing digital — Programme FORCE', 'Université Numérique Cheikh Hamidou Kane', '2023-01-01', null, null, null, 1),
      ('formation', 'Marketing digital et community management', 'Orange Digital Center', '2022-01-01', null, null, null, 2),
      ('formation', 'Licence ès Lettres modernes', 'Université Norbert Zongo', '2021-01-01', null, null, null, 3),
      ('certification', 'Fondamentaux du marketing numérique', 'Google — Atelier Numérique Africain', null, null, null, null, 4),
      ('certification', 'L''essentiel de Google Analytics GA4', 'LinkedIn Learning', null, null, null, null, 5),
      ('certification', 'L''essentiel de Mailchimp', 'LinkedIn Learning', null, null, null, null, 6),
      ('certification', 'Développeur web : WordPress — Elementor', 'Udemy', null, null, null, null, 7),
      ('certification', 'Talking to AI: Prompt Engineering for Project Managers', 'Project Management Institute (PMI)', null, null, null, null, 8),
      ('certification', 'Constitution d''équipes et leadership dans la gestion de projets', 'Microsoft — Project Management', null, null, null, null, 9),
      ('certification', 'Engagement du gestionnaire de projet avec les parties prenantes', 'Microsoft — Project Management', null, null, null, null, 10),
      ('certification', 'English for Career Development', 'Online Professional English Network (OPEN MOOC)', null, null, null, null, 11);
  end if;
end $seed$;

-- Catégories de projets
insert into public.project_categories (name, slug, sort_order) values
  ('Sites web', 'sites-web', 0)
on conflict (slug) do nothing;

-- Projets web (captures d'écran à ajouter depuis /admin)
insert into public.projects (title, slug, client, year, cover_url, cover_alt, gallery, excerpt, description, context, objectives, results, tools, link_url, is_featured, status, sort_order, category_id) values
  ('Factory Business Solutions', 'site-factory-business-solutions', 'Factory Business Solutions', null, '/projects/site-factory-business-solutions.svg', 'Visuel provisoire du projet Factory Business Solutions (capture d''écran à ajouter)', '{}'::text[], 'Site web d''entreprise — intégrateur principal.', 'Conception et intégration du site web d''entreprise de Factory Business Solutions, en tant qu''intégrateur principal.', null, null, null, '{}'::text[], 'https://factorybf.com', true, 'published', 1, (select id from public.project_categories where slug = 'sites-web')),
  ('GCM Industrielle', 'site-gcm-industrielle', 'GCM Industrielle', null, '/projects/site-gcm-industrielle.svg', 'Visuel provisoire du projet GCM Industrielle (capture d''écran à ajouter)', '{}'::text[], 'Site vitrine — intégrateur principal.', 'Conception et intégration du site vitrine de GCM Industrielle, en tant qu''intégrateur principal.', null, null, null, '{}'::text[], 'https://gcmindustrielle.com', true, 'published', 2, (select id from public.project_categories where slug = 'sites-web')),
  ('Restaurant Laurines', 'site-restaurant-laurines', 'Laurines', null, '/projects/site-restaurant-laurines.svg', 'Visuel provisoire du projet Restaurant Laurines (capture d''écran à ajouter)', '{}'::text[], 'Site web de restaurant — intégrateur principal.', 'Conception et intégration du site web de restaurant de Laurines, en tant qu''intégrateur principal.', null, null, null, '{}'::text[], 'https://laurines.com', true, 'published', 3, (select id from public.project_categories where slug = 'sites-web')),
  ('Hôtel Hacienda Ouagadougou', 'site-hotel-hacienda', 'Hôtel Hacienda Ouagadougou', null, '/projects/site-hotel-hacienda.svg', 'Visuel provisoire du projet Hôtel Hacienda Ouagadougou (capture d''écran à ajouter)', '{}'::text[], 'Site web d''hôtel — intégrateur principal.', 'Conception et intégration du site web d''hôtel de Hôtel Hacienda Ouagadougou, en tant qu''intégrateur principal.', null, null, null, '{}'::text[], 'https://hotelhaciendaouagadougou.com/', true, 'published', 4, (select id from public.project_categories where slug = 'sites-web'))
on conflict (slug) do nothing;

-- Catégories du blog (à adapter)
insert into public.categories (name, slug) values
  ('Stratégie digitale', 'strategie-digitale'),
  ('Social media', 'social-media'),
  ('Publicité en ligne', 'publicite-en-ligne'),
  ('Création de contenu', 'creation-de-contenu')
on conflict (slug) do nothing;
