---
paths:
  - "src/app/**"
  - "src/components/**"
---
# Couche présentation (src/app, src/components)

Lire DESIGN.md et PRODUCT.md avant tout travail d'interface.

## Dépendances
- Affiche et recueille, sans règle métier ni accès à la base.
- N'importe que depuis `@/services`. Depuis `@/data`, seuls les `import type` sont tolérés.

## Composants
- Uniquement les composants du design system : `src/components/ui` (shadcn base-nova, Base UI).
- Composant manquant : `pnpm dlx shadcn@latest add <nom>`. Pas de composant fait main qui réplique un composant shadcn.
- Après une commande shadcn, vérifier `globals.css` : polices Barlow, pas de bloc `.dark`, pas de couleurs `oklch`.

## Couleurs
- Tokens seulement : `bg-background`, `bg-card`, `bg-primary`, `text-muted-foreground`, `border-border`, `text-destructive`, `text-success`…
- Interdit : couleurs de palette Tailwind (`zinc-500`, `red-400`…), `bg-white`, `bg-black`, valeurs hex/rgb/oklch dans `className` ou `style`.
- Ambre (`primary`) réservé à l'action principale, au focus et au statut « retard ». Jamais en décoration.
- Un statut porte toujours son libellé écrit, pas seulement sa couleur.

## Typographie et formes
- Titres, boutons, puces : `font-heading`, capitales, approche. Texte courant : Barlow, casse normale.
- Heures, montants, téléphones en `tabular-nums`. Une heure affichée précise « heure de Paris ».
- Plat : pas de `shadow-*`. Rayon max `rounded-lg` (4px), jamais `rounded-full`.

## Tests
- Un test à côté du composant, avec `renderToStaticMarkup`.

## Comment vérifier
- `pnpm test` et `pnpm lint` passent.
- Aucune couleur en dur (doit ne rien renvoyer) :
  `grep -rnE "(bg|text|border|ring|fill|stroke)-(zinc|slate|gray|neutral|stone|red|orange|amber|yellow|green|emerald|blue|sky|indigo|violet|purple|pink|rose)-[0-9]|bg-white|bg-black|#[0-9a-fA-F]{3,8}\b|shadow-(sm|md|lg|xl|2xl)|rounded-(xl|2xl|3xl|full)" src/app src/components --include='*.tsx' --exclude='*.test.tsx' --exclude-dir=ui`
- Aucun import de valeur depuis la couche données (doit ne rien renvoyer) :
  `grep -rnE "^import \{.*from \"@/data" src/app src/components`
