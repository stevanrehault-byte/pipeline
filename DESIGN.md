---
name: Pipeline
description: Mini CRM de prospection, habillé en tableau des départs de gare.
colors:
  primary: "#f4b400"
  primary-foreground: "#141414"
  background: "#101113"
  card: "#191b1e"
  secondary: "#24272c"
  accent: "#2f3339"
  foreground: "#f1f1ec"
  muted-foreground: "#a7abb2"
  border: "#2b2e33"
  input: "#3a3e45"
  destructive: "#ff6b62"
  success: "#b9e3c6"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.025em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.025em"
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Barlow, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  data:
    fontFamily: "Barlow, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: "0.05em"
  chip:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
    letterSpacing: "0.05em"
rounded:
  sm: "2.4px"
  md: "3.2px"
  lg: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-primary-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "rgb(244 180 0 / 0.8)"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "36px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "20px"
  status-chip-late:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.chip}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
---

# Design System: Pipeline

## Overview

**Creative North Star: "Le tableau des départs"**

Pipeline est un CRM de travail, pas une vitrine. Le monde « Départs » ne lui prête que quatre choses : une typographie de signalétique ferroviaire, une palette de quai de nuit, une densité d'affichage, et un seul geste signature (le tableau des relances du jour, prévu, pas encore construit). Tout le reste est une coque shadcn standard (préréglage base-nova, Base UI) recolorée.

Le fond est un noir mat, les panneaux sont à peine plus clairs, le texte est un blanc chaud. L'ambre est la seule couleur d'action et d'attention : bouton principal, anneau de focus, sélection de texte, statut « retard ». Les titres, boutons et puces de statut parlent en Barlow Condensed capitales, légèrement espacées, comme un panneau d'affichage ; le corps reste en Barlow, lisible et calme. Thème sombre unique : l'utilisateur prépare le soir, depuis la Thaïlande, les relances de la matinée française.

La surface livrée aujourd'hui est une page de démonstration du thème (titre, bouton, fiche contact fictive). Les règles ci-dessous décrivent ce qu'elle établit ; le tableau des départs est consigné à part comme composant prévu.

**Key Characteristics:**
- Thème sombre unique, aucune variante claire.
- Un seul accent, l'ambre, réservé à l'action et à l'attention.
- Capitales condensées pour tout ce qui s'affiche (titres, boutons, statuts) ; casse normale pour tout ce qui se lit.
- Plat : profondeur par paliers de gris et filets de 1px, jamais par ombre.
- Coins presque droits (4px au plus).
- Chiffres tabulaires pour heures, montants et téléphones.

## Colors

Un quai de gare la nuit : noirs mats en paliers serrés, un blanc chaud, et l'ambre des afficheurs comme unique signal.

### Primary
- **Ambre afficheur** (primary): bouton principal, anneau de focus (`ring`), sélection de texte, puce de statut « retard ». Le texte posé dessus est l'**Encre sur ambre** (primary-foreground), un quasi-noir. Au survol, le bouton principal passe à 80 % d'opacité.

### Secondary
- **Rouge signal atténué** (destructive): annulé, perdu, supprimé, actions destructives. En bouton, il s'affiche en texte rouge sur un fond rouge teinté (10 à 20 %), jamais en aplat plein.
- **Vert « à l'heure »** (success): statut « à l'heure ». Défini comme jeton, pas encore utilisé dans un écran livré.

### Neutral
- **Noir mat** (background): fond de page.
- **Noir panneau** (card, aussi popover): fiches, panneaux, menus.
- **Graphite** (secondary, aussi muted): bouton secondaire, zones atténuées.
- **Graphite clair** (accent): survols et éléments actifs sur panneau.
- **Blanc chaud** (foreground): tout le texte principal.
- **Gris quai** (muted-foreground): libellés, métadonnées, sous-titres. Contraste d'environ 7:1 sur le noir panneau.
- **Filet** (border): séparateurs et contours de panneaux, 1px.
- **Acier** (input): contour des champs, barre de défilement.

### Named Rules
**The One Signal Rule.** L'ambre ne sert qu'à l'action principale, au focus et au retard. Jamais en décoration, jamais en fond de section, jamais pour un titre.

**The Status Triad Rule.** Les statuts de relance ont exactement trois couleurs : ambre (retard), vert (à l'heure), rouge atténué (supprimé ou perdu). Chaque statut porte aussi son libellé en toutes lettres ; la couleur ne porte jamais seule le sens.

## Typography

**Display Font:** Barlow Condensed (500, 600, 700), repli sans-serif
**Body Font:** Barlow (400, 500, 600), repli sans-serif

**Character:** Le condensé capital donne la voix d'affichage ferroviaire ; le Barlow droit, de la même famille, garde la lecture courante douce. Deux graisses de la même famille, donc aucune collision.

### Hierarchy
- **Display** (600, 3rem, interlignage 1, capitales, approche 0.025em): titre de page.
- **Title** (600, 1.5rem, 1.25, capitales, 0.025em): titre de fiche ou de panneau.
- **Body** (400, 1rem, 1.5): texte courant.
- **Body small** (400, 0.875rem): sous-titres, libellés et valeurs de listes de définitions, en gris quai pour les libellés.
- **Data** (400, 0.875rem, chiffres tabulaires): heures, montants, téléphones.
- **Label** (500, 0.875rem, capitales, 0.05em, condensé): libellés de boutons.
- **Chip** (600, 0.875rem, capitales, 0.05em, condensé): puces de statut.

### Named Rules
**The Display/Read Split Rule.** Ce qui s'affiche (titres h1 à h3, boutons, statuts) est en Barlow Condensed capitales. Ce qui se lit (paragraphes, noms d'entreprise, valeurs, aides) reste en Barlow, casse normale. Jamais de paragraphe en capitales.

**The Tabular Rule.** Tout nombre comparé d'une ligne à l'autre (heure, montant, numéro) s'affiche en chiffres tabulaires.

## Layout

Colonne unique centrée, largeur maximale 36rem (576px), marges latérales de 24px, 64px en haut et en bas. Les blocs de page sont espacés de 32px. Sur mobile (390px), la même colonne tient sans changement : l'en-tête garde titre et bouton sur une ligne, le bouton calé en bas.

Dans une fiche : 20px de marge intérieure (16px sous l'en-tête), listes de définitions en deux colonnes (libellé auto, valeur 1fr) avec 24px entre colonnes et 8px entre lignes, boutons espacés de 8px. Rythme de base de 4px ; pas observés : 4, 8, 16, 20, 24, 32px.

Densité visée : affichage d'exploitation, serré mais aéré par les filets, pas par du vide.

## Elevation & Depth

Système plat. Aucune ombre n'est livrée. La profondeur vient de paliers de gris très rapprochés (noir mat, noir panneau, graphite, graphite clair) et de filets de 1px. Le seul halo est l'anneau de focus ambre (3px, 50 % d'opacité).

### Named Rules
**The Matte Rule.** Surfaces mates et plates au repos comme au survol. Un panneau se distingue par un palier de gris et un filet, jamais par une ombre ou un flou.

## Shapes

Coins presque droits, dérivés d'un rayon de base de 4px : 4px pour les boutons, 3.2px pour les fiches et petits boutons, 2.4px pour les puces de statut. Contours de 1px en couleur filet. Aucune forme arrondie en pilule, aucun cercle décoratif.

## Components

### Buttons
Boutons shadcn base-nova sur Base UI, recolorés ; voix d'affichage condensée.
- **Shape:** coins presque droits (rayon lg).
- **Primary:** ambre, texte encre, libellé condensé capital espacé, hauteur 32px (36px en taille lg), 10px de marge latérale, icône 16px à gauche si besoin.
- **Hover / Focus:** survol à 80 % d'opacité ; focus par contour et anneau ambre de 3px à 50 % ; enfoncement d'un pixel à l'appui ; désactivé à 50 % d'opacité.
- **Secondary:** fond graphite, texte blanc chaud ; au survol, graphite éclairci de 5 % vers le blanc.
- **Destructive:** texte rouge atténué sur fond rouge teinté.
- **Outline / Ghost / Link:** variantes shadcn disponibles, non utilisées dans un écran livré.

### Chips
Puce de statut : rectangle à coins presque droits, libellé condensé capital en graisse 600, 4px sur 8px de marge, jamais de retour à la ligne.
- **Retard** (livré): aplat ambre, texte encre. Libellé du type « RETARD 2 J ».
- **À l'heure / Supprimé** (prévus): texte vert ou rouge atténué sur fond teinté de la même couleur, d'après le spécimen choisi.

### Cards / Containers
- **Corner Style:** rayon md (3.2px).
- **Background:** noir panneau.
- **Shadow Strategy:** aucune (voir Elevation & Depth).
- **Border:** filet 1px ; un filet sépare l'en-tête de la fiche de son corps.
- **Internal Padding:** 20px, 16px sous l'en-tête.
- **Structure observée:** en-tête (titre capital + sous-titre gris, puce de statut à droite), liste de définitions en chiffres tabulaires, rangée d'actions.

### Tableau des départs (prévu, pas encore construit)
Geste signature du monde, à construire pour les relances du jour. Rien de ceci n'existe encore dans le code ; les mesures viennent du spécimen `design-options.html` (colonne A) et devront être confirmées au premier passage de documentation après construction.
- Une ligne par relance, triées par heure de Paris : heure, entreprise (contact et ville en dessous, en gris quai), puce de statut.
- L'heure est affichée en cellules de chiffres à volet (une cellule par chiffre, fente horizontale au milieu), chiffres tabulaires.
- Les volets basculent une seule fois à l'ouverture, avec un léger décalage par ligne, jamais en boucle. Aucune animation si `prefers-reduced-motion` est actif.
- Dessous, un vrai tableau sémantique (`<table>`, en-têtes de colonnes, l'heure lisible en texte par les lecteurs d'écran). Les contrôles autour (boutons, menus) restent des composants shadcn standard.

## Do's and Don'ts

### Do:
- **Do** garder un seul thème sombre : fond noir mat, texte blanc chaud, panneaux noir panneau.
- **Do** réserver l'ambre au bouton principal, au focus, à la sélection et au statut « retard ».
- **Do** mettre titres, boutons et puces de statut en Barlow Condensed capitales espacées ; le reste en Barlow.
- **Do** afficher heures, montants et numéros en chiffres tabulaires, et préciser « heure de Paris » quand une heure est montrée.
- **Do** séparer les surfaces par paliers de gris et filets de 1px.
- **Do** écrire le statut en toutes lettres dans la puce, en plus de sa couleur.

### Don't:
- **Don't** ajouter de thème clair ou de bascule clair/sombre.
- **Don't** utiliser l'ambre comme décoration, fond de section ou couleur de titre.
- **Don't** ajouter d'ombre portée ou de flou de profondeur.
- **Don't** arrondir au-delà de 4px, ni de bouton en pilule.
- **Don't** faire tourner les volets du tableau en boucle, ni les animer quand le mouvement réduit est demandé.
- **Don't** construire le tableau des départs en `div` : il reste un tableau sémantique.
