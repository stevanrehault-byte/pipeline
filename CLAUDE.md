# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Lis INTENT.md avant tout travail.

@AGENTS.md

## Projet

Mini CRM de prospection mono-utilisateur. `INTENT.md` fixe le produit, l'architecture cible, le hors-périmètre (pas d'auth, pas de multi-utilisateur) et les critères d'acceptation.

État actuel : squelette `create-next-app` + architecture 3 couches avec un exemple vide par couche (`example-*`). shadcn installé (seul composant : `button`), thème « Départs » appliqué. `src/app/page.tsx` est une page provisoire de démonstration du thème. Pas encore de base de données.

## Commandes

Gestionnaire de paquets : pnpm (`packageManager` épinglé dans `package.json`).

```bash
pnpm dev     # serveur de dev sur http://localhost:3000
pnpm build   # build de production
pnpm start   # sert le build
pnpm lint    # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
pnpm test    # Vitest, une passe (vitest run)
pnpm test src/services/example-service.test.ts   # un seul fichier
pnpm test -t "nom du test"                        # filtrer par nom
```

- Node ≥ 22.12 requis (Vitest 5 / Vite 8). Sous Node 20, Vitest plante au démarrage et pnpm ignore le binaire natif de rolldown ; après changement de Node, `pnpm install --force`.
- Tests à côté du code (`*.test.ts(x)` dans `src/`), environnement `node`. Config : `vitest.config.mts` (en `.mts` pour éviter l'avertissement ESM de Vite ; il redéclare l'alias `@`).
- Les composants se testent avec `renderToStaticMarkup` de `react-dom/server` (pas de jsdom ni Testing Library pour l'instant).

## Stack et particularités

- Next.js 16.4 (App Router, dossier `src/app`), React 19.3, TypeScript strict. Alias `@/*` → `src/*`.
- Cette version de Next diffère des connaissances d'entraînement : consulter `node_modules/next/dist/docs/` (01-app, 03-architecture…) avant d'écrire du code Next.
- `next.config.ts` active `cacheComponents` et `partialPrefetching` : en tenir compte pour le rendu et la mise en cache des données.
- Tailwind CSS v4 chargé via un loader Turbopack (`@tailwindcss/turbopack` déclaré dans `next.config.ts`), pas via PostCSS. `globals.css` fait `@import "tailwindcss"`.
- Les types globaux de routes (ex. `LayoutProps<"/">`) sont générés par Next dans `.next/types`.
- shadcn (préréglage `base-nova`, composants sur `@base-ui/react`, pas Radix). Ajouter un composant : `pnpm dlx shadcn@latest add <nom>` → `src/components/ui`. `cn()` vient du paquet `cn` (pas clsx/tailwind-merge). Après une commande shadcn qui touche `globals.css`, vérifier que `--font-sans` pointe sur `var(--font-barlow)` et `--font-heading` sur `var(--font-barlow-condensed)` (l'init avait rendu `--font-sans` circulaire), et que shadcn n'a pas réintroduit de bloc `.dark` ni de couleurs `oklch` par défaut.
- Design : lire `DESIGN.md` (système « Départs ») et `PRODUCT.md` avant tout travail d'interface. Thème unique sombre : les couleurs sont dans `:root`, et `<html>` porte la classe `dark` pour que les variantes `dark:` de shadcn s'appliquent. Utiliser les tokens (`bg-primary`, `text-muted-foreground`…), jamais de couleurs Tailwind codées en dur. L'ambre (`primary`) est réservé à l'action et à l'attention.
- Plugin Impeccable : `.impeccable/config.json` est versionné ; `design-options.html` est la planche des trois pistes (A retenue).
- Si un changement CSS n'apparaît pas dans le build, le cache Turbopack peut être périmé : supprimer `.next` et rebuilder.
- `pnpm-workspace.yaml` bloque les scripts de build de `sharp` et `unrs-resolver` (`allowBuilds: false`).

## Architecture (INTENT.md)

Trois couches, dépendances dans un seul sens : présentation (`src/app`, `src/components`) → service (`src/services`) → données (`src/data`). Jamais d'import dans l'autre sens.
- La couche données expose une interface (ex. `ExampleRepository`) et une implémentation. Les services reçoivent le repository en paramètre (`createExampleService(repo)`), ce qui permet de les tester avec un faux repository.
- Seule la couche données accède à la base : SQLite en local, Turso en production (décision actée).
- Passer de SQLite à Turso ne doit modifier que la couche données : garder la couche service indépendante du driver.
- Les règles métier vivent dans la couche service et sont couvertes par des tests unitaires.
- UI en composants shadcn, déploiement sur Vercel.
