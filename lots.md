# Lots · Pipeline

Découpage de Pipeline en 5 lots, tiré d'INTENT.md. Un lot = une chose que l'utilisateur fait de bout en bout, de l'écran à la base, en respectant les 3 couches (`.claude/rules/`). Chaque lot s'appuie sur le précédent ; le lot 1 est le plus petit.

Hors périmètre, respecté partout : pas d'authentification, pas de droits, pas de multi-utilisateur. Pas de notes, de recherche, d'export, ni de modification ou suppression de contact : INTENT.md ne les demande pas.

Le critère d'INTENT « passer à une base managée ne modifie que la couche données » est transverse. Le lot 1 le pose avec l'interface `ContactRepository`, et chaque lot suivant le respecte.

## Décisions
- Étapes : À contacter → Contacté → Proposition envoyée → Gagné, avec « Perdu » à part.
- Contact : nom obligatoire, entreprise facultative. Aucun autre champ.
- Heures de relance en heure de Paris (PRODUCT.md : relances vers la France depuis la Thaïlande).
- Pas de bouton « Reporter » : reporter, c'est programmer une nouvelle relance (lot 3).
- Les contacts « Gagné » ou « Perdu » n'apparaissent pas dans le tableau du jour.

---

## Lot 1 · Ajouter un contact et le retrouver dans la liste
*INTENT : « je note mes contacts », critères 1 et 2.*

**Parcours.**
- J'ouvre Pipeline et je vois la liste de mes contacts.
- Je saisis un nom et, si je veux, une entreprise. Je valide et le contact apparaît dans la liste.
- Je relance l'app : il est toujours là.

**Critères d'acceptation.**
- [ ] Étant donné une liste vide, quand j'ajoute « Camille Martin, Boulangerie Martin », alors elle apparaît dans la liste.
- [ ] Étant donné un contact ajouté, quand je redémarre l'app, alors il est toujours dans la liste.
- [ ] Étant donné le formulaire, quand je valide sans nom, alors le contact n'est pas créé et un message dit que le nom est obligatoire.
- [ ] Étant donné aucun contact, quand j'ouvre l'app, alors un message d'état vide m'invite à en ajouter un.

## Lot 2 · Faire avancer un contact d'étape
*INTENT : « je les fais avancer d'étape en étape ».*

**Parcours.**
- Chaque contact a une étape.
- Depuis la liste, je le fais passer à l'étape suivante ou je le marque perdu.
- La liste montre l'étape de chacun.

**Critères d'acceptation.**
- [ ] Étant donné un nouveau contact, quand il est créé, alors il est à « À contacter ».
- [ ] Étant donné un contact à « Contacté », quand je le fais avancer, alors il passe à « Proposition envoyée », et ce changement persiste après redémarrage.
- [ ] Étant donné un contact à « Gagné » ou « Perdu », quand j'ouvre ses actions, alors je ne peux plus le faire avancer.
- [ ] Étant donné un contact, quand je le marque perdu, alors « Perdu » s'affiche en toutes lettres, en rouge atténué.

## Lot 3 · Programmer une relance pour un contact
*INTENT : « je sais qui relancer » suppose une date de relance par contact.*

**Parcours.**
- Sur un contact, je fixe la date et l'heure de la prochaine relance, en heure de Paris.
- La liste affiche la prochaine relance de chacun.

**Critères d'acceptation.**
- [ ] Étant donné un contact, quand je programme une relance le 25/11 à 09:30, alors la liste affiche « 25/11 · 09:30 (heure de Paris) ».
- [ ] Étant donné que je suis en Thaïlande, quand je saisis 09:30, alors la relance est enregistrée à 09:30 heure de Paris.
- [ ] Étant donné un contact qui a déjà une relance, quand j'en programme une autre, alors elle remplace l'ancienne.
- [ ] Étant donné une relance programmée, quand je redémarre l'app, alors elle est toujours là.

## Lot 4 · Voir qui relancer aujourd'hui
*INTENT : « je sais qui relancer aujourd'hui ».*

**Parcours.**
- L'accueil devient le tableau des départs : les relances du jour et celles en retard, triées par heure de Paris.
- Chaque ligne montre l'heure, le contact, son entreprise et son statut (retard ou à l'heure).

**Critères d'acceptation.**
- [ ] Étant donné des relances hier, aujourd'hui et demain, quand j'ouvre l'accueil, alors je vois celles d'hier et d'aujourd'hui, pas celle de demain.
- [ ] Étant donné une relance d'hier non faite, quand j'ouvre l'accueil, alors elle porte « RETARD 1 J » en ambre.
- [ ] Étant donné qu'il est 23:00 en Thaïlande (17:00 à Paris), quand j'ouvre l'accueil, alors « aujourd'hui » est le jour de Paris.
- [ ] Étant donné aucune relance due, quand j'ouvre l'accueil, alors un message dit qu'il n'y a personne à relancer.
- [ ] Étant donné un contact « Gagné » ou « Perdu », quand il a encore une relance, alors il n'apparaît pas dans le tableau.

## Lot 5 · Marquer une relance comme faite
*INTENT : la liste du jour doit refléter ce qui reste à faire.*

**Parcours.**
- Dans le tableau du jour, je marque une relance comme faite et elle quitte le tableau.
- Pour la suivante, je programme une nouvelle relance (lot 3).

**Critères d'acceptation.**
- [ ] Étant donné une relance du jour, quand je la marque faite, alors elle disparaît du tableau.
- [ ] Étant donné une relance faite, quand je redémarre l'app, alors elle ne revient pas.
- [ ] Étant donné une relance faite, quand je regarde le contact, alors il n'a plus de prochaine relance et je peux en programmer une.
