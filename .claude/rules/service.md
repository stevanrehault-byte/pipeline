---
paths:
  - "src/services/**"
---
# Couche service (src/services)

## Rôle
- Toutes les règles métier vivent ici, et seulement ici : étapes du pipeline, calcul de « qui relancer aujourd'hui », validations.

## Dépendances
- TypeScript pur : ni React, ni `next/*`, ni driver de base, ni `process.env`.
- Dépend des interfaces de `@/data` (`XRepository`), jamais d'une base précise. Aucun import depuis `src/app` ou `src/components`.

## Forme
- Fabrique `createXService(repository)` : le repository est passé en paramètre.
- Les dates passent aussi en paramètre (horloge `now`). « Aujourd'hui » se calcule en heure de Paris, pas avec l'heure de la machine.

## Tests
- Test écrit avant le code.
- Chaque règle métier a un test unitaire avec un faux repository en mémoire, jamais la vraie base.

## Comment vérifier
- `pnpm test` passe.
- Doit ne rien renvoyer :
  `grep -rnE "from \"(react|next|@/app|@/components|@libsql|better-sqlite3)" src/services`
- Chaque service a son test (doit ne rien afficher) :
  `for f in src/services/*.ts; do case $f in *.test.ts) ;; *) [ -f "${f%.ts}.test.ts" ] || echo "sans test : $f";; esac; done`
