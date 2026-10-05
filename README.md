# Portfolio — Abdoul Aly TAITA

Portfolio personnel et blog de **Abdoul Aly TAITA**, Responsable Digital / Marketing Digital (Burkina Faso).
Identité « éditorial monochrome » : noir, blanc, gris, typographie forte, animations sobres.

**Stack** : Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL, Auth, Storage) · déploiement Vercel.

> L'architecture détaillée (choix techniques, schéma de base de données, direction UI/UX) est décrite dans
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Démarrage rapide (mode démonstration)

```bash
npm install
npm run dev
```

Ouvrez <http://localhost:3000>. Sans configuration Supabase, le site affiche le **contenu réel issu du CV**
(`src/content/cv.ts` : profil, expériences, compétences, formations, certifications, projets web) et des
**articles de blog d'exemple** (`src/content/demo.ts`), signalés par le bandeau « Mode local ».

## Connecter Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor** → collez et exécutez `supabase/migrations/0001_schema.sql`
   (tables, index, recherche plein texte, politiques RLS, bucket de stockage `media`).
   Le script peut être ré-exécuté sans erreur.
3. Exécutez `supabase/seed.sql` : il remplit la base avec le contenu du CV (profil, expériences,
   compétences, formations, certifications, projets web). Chaque table n'est remplie que si elle est vide.
   Ce fichier est généré depuis `src/content/cv.ts` par `npm run seed:generate`. Aucun article fictif n'est inséré.
4. Copiez `.env.example` en `.env.local` et renseignez :

   ```env
   NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

   *Project Settings › API Keys* : utilisez la clé **publique** (« anon » ou « publishable », `sb_publishable_…`).
   **Ne mettez jamais** la clé `service_role` / `secret` dans ces variables : l'application n'en a pas besoin,
   toutes les autorisations passent par les politiques RLS.

5. **Créer le compte administrateur** :
   - *Authentication › Users › Add user* : e-mail + mot de passe (cochez « Auto confirm user »).
   - Dans le SQL Editor, donnez-lui les droits :

     ```sql
     insert into public.admins (user_id)
     select id from auth.users where email = 'votre-email@exemple.com';
     ```

   - *Authentication › Sign In / Providers* : **désactivez les inscriptions publiques**
     (« Allow new users to sign up ») — seul l'administrateur a besoin d'un compte. Un compte non
     administrateur ne peut de toute façon rien modifier (RLS), mais inutile d'en laisser créer.

6. Relancez `npm run dev`, puis connectez-vous sur <http://localhost:3000/admin>.

## Administration (`/admin`)

| Section | Contenu |
| --- | --- |
| Dashboard | Compteurs (articles publiés / programmés / brouillons, projets, messages non lus), derniers éléments |
| Articles | Éditeur riche, slug automatique, catégories, tags, couverture, brouillon / publié / **programmé**, meta SEO avec aperçu Google |
| Projets | Galerie, catégories, contexte / objectifs / résultats, outils, mise en avant sur l'accueil |
| Expériences | Timeline : poste, entreprise, période, responsabilités, réalisations, résultats, outils |
| Compétences | Ajout / édition en ligne, niveau, catégorie, affichage sur l'accueil |
| Certifications | Intitulé, organisme, dates, lien de vérification |
| Profil | Identité, bio, coordonnées, réseaux, **photo** et **CV PDF** (upload vers Supabase Storage) |
| Messages | Messages du formulaire de contact : lu / non lu, réponse par e-mail, suppression |
| Paramètres | Statistiques de l'accueil, textes du hero et du CTA, SEO global, catégories et tags du blog |

Chaque modification régénère automatiquement les pages publiques concernées.

**Sécurité** : `src/proxy.ts` redirige les visiteurs non connectés, chaque page et Server Action vérifie
que l'utilisateur est dans la table `admins`, et les politiques RLS PostgreSQL bloquent toute écriture
non autorisée au niveau de la base.

## Déploiement sur Vercel

1. Poussez le dépôt sur GitHub puis importez-le dans Vercel (framework détecté automatiquement).
2. Ajoutez les trois variables d'environnement ci-dessus (Production + Preview).
3. Dans Supabase, *Authentication › URL Configuration* : renseignez l'URL du site.
4. Déployez. Pensez à soumettre `https://votre-domaine.com/sitemap.xml` dans Google Search Console.

## Mise en veille de Supabase (plan gratuit)

Un projet Supabase gratuit est mis en pause après 7 jours sans activité. Une tâche
planifiée Vercel (`vercel.json`) appelle chaque jour `/api/keepalive`, qui fait une
petite lecture pour garder la base active. *(Facultatif : définir `CRON_SECRET` sur
Vercel pour réserver cette route aux tâches planifiées.)*

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (utilitaires, validation, anti-redirection ouverte, cohérence du contenu du CV) |
| `npm run seed:generate` | Régénère `supabase/seed.sql` à partir de `src/content/cv.ts` |

## Personnaliser

- **Contenus** : tout passe par `/admin` une fois Supabase connecté.
- **Navigation, coordonnées GPS du hero, catégories de compétences** : `src/config/site.ts`.
- **Couleurs, typographies, animations** : tokens dans `src/app/globals.css` (`@theme`), polices dans `src/app/layout.tsx`.
- **Contenu du CV** : `src/content/cv.ts` (site sans Supabase + source du seed).
- **Articles d'exemple** : `src/content/demo.ts` (uniquement sans Supabase, jamais insérés en base).

## SEO & performance

- Metadata par page, Open Graph et cartes X/Twitter, images OG générées (site et chaque article).
- `sitemap.xml` dynamique (articles et projets publiés), `robots.txt`, URLs propres `/blog/mon-article`.
- Données structurées Schema.org : `Person`, `WebSite`, `BlogPosting`, `CreativeWork`, `BreadcrumbList`.
- Pages publiques statiques régénérées toutes les 60 s (ISR) ; les articles programmés apparaissent seuls.
- Polices auto-hébergées (`next/font`), images AVIF/WebP (`next/image`), animations CSS + un seul
  `IntersectionObserver`, éditeur riche chargé uniquement dans l'admin.
- Accessibilité : lien d'évitement, navigation clavier, focus visibles, labels, `aria-*`, respect de
  `prefers-reduced-motion`, contrastes AA.
