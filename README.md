# Bayegadji Multimédia — Lot 1

Scaffold Epic 1 (fondations) + Epics 2-4 (Accueil, Actualités, Direct) + schéma SQL Epic 5.

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local   # renseigner les clés Supabase
npm run dev
```

Sans variables Supabase configurées, les pages retombent automatiquement sur des
données de démonstration (voir les fonctions `mock*` dans chaque page) — tu peux
donc voir le rendu tout de suite, avant même d'avoir créé le projet Supabase.

## Étapes restantes pour rendre le Lot 1 fonctionnel

1. **Créer le projet Supabase** (supabase.com) puis :
   ```bash
   npx supabase login
   npx supabase link --project-ref <ton-project-ref>
   npx supabase db push          # applique supabase/migrations/0001_lot1_schema.sql
   npx supabase gen types typescript --linked > src/lib/types/database.ts
   ```
   La dernière commande régénère les types réels et remplace le fichier manuel
   fourni ici.

2. **Auth** : activer l'authentification par email (ou magic link) dans le
   dashboard Supabase. Le trigger `handle_new_user` crée automatiquement un
   profil avec le rôle `visiteur` à l'inscription — promouvoir manuellement
   ton propre compte en `administrateur` via l'éditeur SQL pour tester le
   back-office :
   ```sql
   update public.profiles set role = 'administrateur' where id = '<ton-uid>';
   ```

3. **AzuraCast** (radio) : déployer une instance sur un petit VPS (voir
   la doc AzuraCast pour l'installation Docker), configurer le mount point,
   puis renseigner l'URL du flux dans `NEXT_PUBLIC_RADIO_STREAM_URL` et dans
   le champ `radio_stream_url` de la ligne `live_events` correspondante.

4. **Cleanfeed** : créer un compte Studio, aucune intégration technique
   requise côté site — c'est le mix de sortie de Cleanfeed qui est routé
   vers l'encodeur (BUTT) puis vers AzuraCast en amont, indépendamment du code.

5. **Pages restantes du sprint 1-2** :
   - `src/app/actualites/[slug]/page.tsx` — détail d'un article
   - `src/app/(admin)/back-office/*` — dashboard, CRUD actualités, planification direct
     (Epic 5 ; RLS déjà en place côté base, l'UI reste à construire)

## Structure

```
src/
  app/                  routes (App Router)
    page.tsx            Accueil (Epic 2)
    actualites/          Actualités (Epic 3)
    direct/              Direct (Epic 4)
  components/
    layout/             TopNav, BottomNav
    ui/                  LiveBadge, NewsCard
    live/                LivePlayer, LiveChat, LiveCountdown
  lib/
    supabase/            clients browser + server
    types/               types générés depuis le schéma
supabase/
  migrations/
    0001_lot1_schema.sql schéma complet Lot 1 (tables, RLS, Realtime)
```
