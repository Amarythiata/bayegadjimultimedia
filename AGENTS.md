<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bayegadji Multimédia

Plateforme web pour un dahira au Sénégal : actualités, live vidéo/radio, médiathèque,
articles, back-office. Solo founder (Amary, PO/full-stack dev), standards de qualité
niveau grande tech mais stack volontairement simple pour un builder solo.

Cahier des charges complet : voir historique de conversation Claude (non versionné
dans ce repo). Ce fichier résume ce qu'il faut savoir pour continuer le code sans
redemander le contexte.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4 — Vercel
- Supabase : Postgres + Auth + Storage + Realtime + RLS (pas de serveur applicatif dédié)
- Radio live : Cleanfeed (captation multi-sites) → encodeur (BUTT) → AzuraCast (Icecast)
- Vidéo live : embed iframe YouTube Live / Facebook Live (pas d'infra vidéo propre)

Décision actée : pas de Spring Boot pour ce projet (anti-sur-ingénierie solo founder),
même si c'est le stack backend habituel d'Amary sur d'autres projets.

## Découpage en 3 lots (voir cahier des charges section 12)

- **Lot 1 — EN COURS** : Accueil, Direct, Actualités, socle back-office
- **Lot 2** : Médiathèque, Articles
- **Lot 3** : pages institutionnelles, calendrier, contact

## État du Lot 1

Fait (scaffold initial) :
- Epic 1 — Fondations : projet Next.js, Supabase clients (browser + server), design tokens, RLS
- Epic 2 — Accueil : hero direct conditionnel + fil actualités
- Epic 3 — Actualités : liste, filtres catégorie, recherche
- Epic 4 — Direct : statut/countdown, toggle vidéo/radio, chat live (Supabase Realtime)
- Schéma SQL complet (`supabase/migrations/0001_lot1_schema.sql`)

Reste à faire :
- Epic 4 : brancher `radio_stream_url` sur un vrai flux AzuraCast une fois déployé ;
  webhook ou polling pour `viewer_count` en temps réel
- Epic 5 — Back-office (UI à construire, RLS déjà en place) : dashboard avec les 3 KPI
  (`public.dashboard_stats`), CRUD actualités, planification d'un direct — voir maquette
  desktop "back-office administrateur" pour le layout attendu (sidebar verte, cards KPI,
  flux d'activité récente nominatif)
- `src/app/actualites/[slug]/page.tsx` — détail d'un article (n'existe pas encore)
- Lier le vrai projet Supabase (voir README.md) et régénérer les types

## Conventions du repo

- **Toujours `type`, jamais `interface`** dans `src/lib/types/database.ts` et tout ce
  qui alimente le générique `Database` de Supabase. Une `interface` référencée dans un
  type `Database` importé depuis un autre fichier casse l'inférence de surcharge de
  `postgrest-js` : `.insert()`/`.update()` retombent silencieusement sur `never[]` sans
  erreur explicite au bon endroit. Si ce bug réapparaît après un `supabase gen types`
  custom ou un refactor, c'est la première chose à vérifier.
- Tables Supabase : toujours déclarer `Relationships: []` (ou la vraie liste) sur
  chaque table, et `Views`/`Functions` sur le schéma — sinon même symptôme que ci-dessus.
- RLS : trois rôles (`visiteur`, `moderateur`, `administrateur`) via `public.profiles.role`,
  vérifiés par la fonction `public.current_user_role()`. Ne jamais faire de check de
  rôle côté client uniquement — toujours s'appuyer sur les policies RLS.
- Design tokens dans `src/app/globals.css` (`@theme inline`) : vert forêt
  (`forest-*`) pour header/sidebar/footer, or (`gold-*`) pour les CTA, rouge (`live-*`)
  réservé exclusivement au badge "EN DIRECT". Fond crème (`background`), jamais de
  blanc pur.
- Nav mobile (`BottomNav`) : l'onglet "Médias" existe déjà en `comingSoon` même si la
  Médiathèque est prévue pour le Lot 2 — décision volontaire pour ne pas faire varier
  la composition de la nav entre les lots.
- Pas de migration d'archives en masse prévue : le contenu de la médiathèque sera
  ajouté progressivement via le back-office (onboarding manuel), donc pas besoin
  d'outil d'import batch au Lot 2.

## Commandes utiles

```bash
npm run dev
npx tsc --noEmit          # doit toujours passer à zéro erreur avant de commit
npx eslint src --quiet
npx supabase db push      # applique les migrations
npx supabase gen types typescript --linked > src/lib/types/database.ts
```

