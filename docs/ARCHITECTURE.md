# Architecture — Portfolio Abdoul Aly TAITA

Ce document présente l'analyse du projet, les choix techniques et la structure
retenue. Il sert de référence pour faire évoluer le site.

---

## 1. Analyse du projet

| Besoin | Conséquence technique |
| --- | --- |
| Site vitrine très visuel, consulté d'abord sur mobile | Rendu serveur + pages statiques régénérées (ISR), peu de JavaScript client, animations CSS |
| Contenu entièrement administrable (blog, projets, expériences…) | Base PostgreSQL (Supabase) + back-office `/admin` protégé |
| Blog indexable (`/blog/mon-article`) | Routes dynamiques par `slug`, metadata par article, sitemap dynamique, JSON-LD `BlogPosting` |
| Publication programmée | Colonne `published_at` + politique RLS « visible si `published_at <= now()` » + revalidation périodique |
| Sécurité de l'admin | Supabase Auth (session en cookies, jeton revalidé côté serveur), `proxy.ts` + vérification serveur + Row Level Security en base |
| Déploiement Vercel | Next.js App Router, aucune dépendance serveur spécifique |
| Pas de données fictives définitives | Contenu réel du CV dans `src/content/cv.ts` (source du site local et du seed SQL) ; seuls les articles d'exemple de `src/content/demo.ts` sont fictifs, utilisés sans Supabase et signalés par un bandeau |

## 2. Architecture technique

```
┌──────────────────────────── Vercel ─────────────────────────────┐
│ Next.js 16 (App Router, React 19, TypeScript, Tailwind CSS 4)   │
│                                                                 │
│  Pages publiques (Server Components, ISR revalidate=60s)        │
│     └─ src/lib/data/*  ──► client Supabase anonyme (lecture)    │
│                                                                 │
│  /admin (Server Components dynamiques + Server Actions)         │
│     └─ client Supabase « SSR » lié aux cookies de session       │
│     └─ après chaque mutation : revalidatePath() → site à jour   │
│                                                                 │
│  proxy.ts : rafraîchit la session, redirige /admin → /login     │
└─────────────────────────────────────────────────────────────────┘
                 │                                │
          PostgreSQL + RLS                Supabase Storage
     (tables de contenu, messages)      (bucket public « media » :
                                          photos, couvertures, CV PDF)
```

**Trois niveaux de sécurité** pour l'administration :
1. `src/proxy.ts` redirige toute requête `/admin/*` non authentifiée vers `/admin/login`.
2. Le layout admin et **chaque Server Action** appellent `requireAdmin()` (vérifie
   l'utilisateur via `supabase.auth.getUser()` et sa présence dans la table `admins`).
3. Les politiques **RLS** PostgreSQL n'autorisent l'écriture qu'aux administrateurs,
   même si quelqu'un appelait directement l'API Supabase.

**Mode local** : si `NEXT_PUBLIC_SUPABASE_URL` n'est pas défini, la couche
`src/lib/data` renvoie le contenu du CV (`src/content/cv.ts`) et des articles
d'exemple (`src/content/demo.ts`). Le site est donc
consultable immédiatement après un `npm run dev`, et un bandeau discret indique
que les articles du blog sont des exemples.

## 3. Structure des dossiers

```
.
├── docs/ARCHITECTURE.md          ← ce document
├── supabase/
│   ├── migrations/0001_schema.sql   tables, index, triggers, RLS, storage
│   ├── migrations/0002_skill_domains.sql  domaines de compétences (skill_categories)
│   ├── migrations/0003_analytics.sql      statistiques de visite (analytics_events)
│   └── seed.sql                     contenu du CV (généré : npm run seed:generate)
├── public/demo/                  visuels de démonstration (SVG monochromes)
└── src/
    ├── proxy.ts                  protection /admin + rafraîchissement session
    ├── app/
    │   ├── layout.tsx            polices, metadata globale, JSON-LD Person
    │   ├── globals.css           design tokens + animations
    │   ├── sitemap.ts · robots.ts · opengraph-image.tsx · icon.tsx
    │   ├── (site)/               pages publiques (header + footer communs)
    │   │   ├── page.tsx                 Accueil
    │   │   ├── a-propos/                À propos
    │   │   ├── experience/              Timeline
    │   │   ├── competences/             Compétences
    │   │   ├── portfolio/ [slug]/       Projets + fiche projet
    │   │   ├── cv/                      CV imprimable + téléchargement
    │   │   ├── blog/ [slug]/            Blog + Article (+ OG image par article)
    │   │   └── contact/                 Formulaire (Server Action)
    │   └── admin/
    │       ├── login/                   Connexion
    │       └── (panel)/                 Layout protégé + sidebar
    │           ├── page.tsx             Dashboard
    │           ├── articles/ projets/ experiences/ competences/
    │           ├── certifications/ messages/ profil/ parametres/
    │           └── actions/             Server Actions par ressource
    ├── components/
    │   ├── ui/                   Button, Reveal, SplitText, Marquee, Counter…
    │   ├── layout/               Header, MobileMenu, Footer, DemoBanner
    │   ├── sections/             blocs de la page d'accueil
    │   ├── blog/ portfolio/ experience/ skills/
    │   └── admin/                formulaires, champs, éditeur riche, tableaux
    ├── content/cv.ts             contenu réel issu du CV
    ├── content/demo.ts           articles de blog d'exemple
    ├── config/site.ts            nom, URL, navigation, réseaux
    ├── lib/
    │   ├── supabase/             clients public / serveur / navigateur
    │   ├── data/                 requêtes de lecture (fallback démo)
    │   ├── auth.ts               requireAdmin()
    │   ├── validation/           schémas Zod partagés
    │   ├── seo.ts                helpers metadata + JSON-LD
    │   └── utils.ts              slugify, readingTime, formatDate, cn…
    └── types/content.ts          types métier
```

## 4. Schéma de base de données

```
admins(user_id PK → auth.users)

profiles(id, full_name, headline, tagline, bio, location, email, phone,
         photo_url, cv_url, linkedin_url, twitter_url, github_url, …, is_primary)

site_settings(key PK, value jsonb)          ← stats, SEO global, disponibilité…

experiences(id, company, role, location, start_date, end_date, is_current,
            description, responsibilities text[], achievements text[],
            results text[], tools text[], company_url, logo_url, sort_order)

skill_categories(id, name, slug UNIQUE, description, icon, sort_order)   ← domaines 01–05
skills(id, name, category_id → skill_categories, category (ancien libellé),
       level (non affiché), description, sort_order, is_featured)

project_categories(id, name, slug UNIQUE, sort_order)
projects(id, title, slug UNIQUE, category_id → project_categories,
         cover_url, gallery text[], excerpt, description, context, objectives,
         results, tools text[], link_url, client, year, is_featured,
         status draft|published, sort_order)

categories(id, name, slug UNIQUE, description)
tags(id, name, slug UNIQUE)
articles(id, title, subtitle, slug UNIQUE, excerpt, content (HTML),
         cover_url, cover_alt, author, category_id → categories,
         status draft|published, published_at, reading_time,
         meta_title, meta_description, created_at, updated_at)
article_tags(article_id → articles, tag_id → tags)  PK composite

certifications(id, kind formation|certification, name, issuer, issue_date, expiry_date,
               credential_id, credential_url, sort_order)

messages(id, name, email, subject, message, is_read, created_at)

analytics_events(id, type, path, referrer, target, device, country,
                 visitor (empreinte anonyme du jour), created_at)   ← insertion publique, lecture admin
```

- **Statut « programmé »** : `status = 'published'` et `published_at` dans le futur.
  La politique RLS publique filtre `published_at <= now()` ; les pages se
  régénèrent toutes les 60 s, l'article apparaît donc automatiquement.
- **RLS** : lecture publique des contenus publiés ; écriture réservée à
  `is_admin()` ; `messages` : insertion anonyme autorisée, lecture admin uniquement.
- Triggers `updated_at`, index sur `slug`, `status/published_at`, recherche
  plein texte (`tsvector` français) sur les articles.

## 5. Direction UI/UX

**Concept : « Éditorial monochrome ».** Le site se lit comme un magazine
d'art contemporain plutôt qu'un template SaaS.

- **Palette** : `#0A0A0A` (encre), `#FAFAF8` (papier), gris `#E8E8E5`, `#8A8A86`,
  `#2A2A2A`. Aucune couleur d'accent : le contraste vient de l'**inversion**
  noir/blanc (sections sombres, survols qui inversent les lignes).
- **Typographie** : *Inter* (police principale, graisses 400/500/600/700 ; titres géants en capitales,
  graisse 600–800) + *Instrument Serif* italique pour les accents éditoriaux
  (« digital *avec intention* ») + *JetBrains Mono* pour les méta-données
  (index `01/`, dates, coordonnées `12.37°N — 1.52°W`).
- **Grille** : 12 colonnes, filets fins (1px) comme dans la presse, numérotation
  des sections, beaucoup de blanc.
- **Images** : en couleurs légèrement adoucies (saturation 80 %, réglable via
  `--img-saturation` dans `globals.css`) pour rester cohérentes avec la charte
  noir/blanc ; elles passent en pleine couleur et zooment au survol.
- **Mouvement** : apparition par masque des lignes de titre, révélation au
  scroll (IntersectionObserver + CSS, ~1 ko de JS), bandeau défilant de
  compétences, compteurs animés, lignes inversées au survol. Tout est
  désactivé si `prefers-reduced-motion`.
- **Mobile d'abord** : titres fluides (`clamp()`), menu plein écran à grande
  typographie, zones tactiles ≥ 44px, pas de survol indispensable.
- **Admin** : même identité, mais sobre et dense (sidebar noire, tableaux à
  filets), pour rester cohérent sans distraire.

## 6. Dépendances

| Paquet | Rôle |
| --- | --- |
| `next`, `react`, `react-dom` | framework (App Router, Server Actions, ISR, next/image, next/font, next/og) |
| `tailwindcss` 4 | styles utilitaires, tokens via `@theme` |
| `@supabase/supabase-js`, `@supabase/ssr` | base de données, auth par cookies, stockage |
| `zod` | validation des formulaires (client + serveur) |
| `@tiptap/*` | éditeur de texte riche des articles (admin uniquement, chargé à la demande) |
| `sanitize-html` | nettoyage du HTML des articles avant affichage (anti-XSS) |

Volontairement **absents** : bibliothèque d'animation (CSS suffit), UI kit
(identité sur mesure), ORM (le client Supabase + RLS suffit).

## 7. Choix clés en bref

- **Server Components par défaut** → HTML complet pour Google, JS minimal.
- **ISR (60 s) + `revalidatePath` après chaque modification admin** → pages
  servies depuis le cache CDN mais toujours à jour.
- **Server Actions** plutôt qu'une API REST → moins de code, validation Zod côté
  serveur, protection CSRF native.
- **HTML stocké + nettoyé** pour les articles → rendu rapide, compatible avec
  l'éditeur riche, sûr.
- **Mode local** → le site fonctionne avec le contenu du CV avant même d'avoir créé le projet Supabase.
