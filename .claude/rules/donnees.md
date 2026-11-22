---
paths:
  - "src/data/**"
---
# Couche données (src/data)

## Rôle
- Seule couche qui parle à la base : SQLite en local, Turso en production. Le driver ne s'importe qu'ici.
- Lit et écrit. Aucune règle métier.

## Forme
- Par entité : une interface `XRepository` et son implémentation. Les services ne voient que l'interface.
- Renvoie des objets métier simples. Ni lignes brutes ni types du driver hors de ce dossier : passer à Turso ou à une autre base ne modifie que `src/data`.
- Aucun import depuis `@/services`, `src/app` ou `src/components`.

## Sécurité
- URL et jeton de la base dans `.env.local` (non versionné), jamais en dur dans le code.
- Requêtes toujours paramétrées. Jamais de SQL construit par concaténation.
- Tout changement de schéma ou migration : sauvegarde d'abord, et accord de Stévan.

## Tests
- Sur une base SQLite en mémoire ou un fichier temporaire. Jamais sur la base Turso de production.

## Comment vérifier
- `pnpm test` passe.
- Driver importé nulle part ailleurs (doit ne rien renvoyer) :
  `grep -rnE "@libsql|better-sqlite3" src --exclude-dir=data`
- Pas de remontée vers les autres couches (doit ne rien renvoyer) :
  `grep -rnE "from \"@/(services|app|components)" src/data`
- `git check-ignore .env.local` affiche `.env.local`.
