# ADR 001 — La version du schéma est stockée dans la table schema_version

- Status: accepted
- Date: 2026-11-25
- Scope: framing

## Context
La couche données versionne le schéma de la base pour savoir quelles
évolutions appliquer au démarrage (v3 aujourd'hui : colonne follow_up_at).
Jusqu'ici, cette version était écrite avec `PRAGMA user_version = n`.
En production, Turso refuse cette instruction (« SQL not allowed statement ») :
l'app plantait au premier accès à la base. Le correctif est la PR #22.
Contrainte : passer de SQLite à Turso ne doit modifier que la couche données.

## Decision
La version du schéma vit dans une table `schema_version` à une seule ligne
(`id = 1`, `version`), créée et mise à jour par `src/data/db.ts`.
Les bases SQLite locales déjà versionnées reprennent leur version en lisant
`PRAGMA user_version` une seule fois, en lecture seule. Le code n'écrit
plus jamais `PRAGMA user_version`.

## Considered options
- PRAGMA user_version — rejected because Turso refuse de l'écrire, l'app plante en production.
- Un outil de migration comme Drizzle — rejected because trop lourd pour 3 versions de schéma.

## Consequences
- Le même code fonctionne en local (SQLite) et en production (Turso).
- Le changement reste limité à la couche données, comme l'exige l'architecture.
- Une table technique de plus dans la base.
- Les migrations restent écrites à la main dans `src/data/db.ts`. Si le
  nombre de versions augmente nettement, la question d'un outil de migration
  se reposera, dans un nouvel ADR.
