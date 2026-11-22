# Intention · Pipeline

## Produit
Un mini CRM de prospection pour une seule personne.
Je note mes contacts, je les fais avancer d'étape en étape, je sais qui relancer aujourd'hui.

## Architecture
Une architecture en 3 couches : présentation, service, données.
Seule la couche données parle à la base.
Une base légère compatible SQLite en local, Turso en production.
Les règles métier ont des tests unitaires.

## Contraintes
Next.js, composants shadcn, déploiement sur Vercel.
Un seul utilisateur.

## Hors périmètre
Pas d'authentification, pas de gestion de droits, pas de multi-utilisateur.

## Critères d'acceptation
- J'ajoute un contact, il apparaît dans la liste.
- Après redémarrage de l'app, mes contacts sont toujours là.
- Passer à une base managée ne modifie que la couche données.
