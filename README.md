# FEFFS App 2026

Ce projet a été réalisé dans le cadre d'un projet universitaire. L'objectif est d'offrir aux festivaliers une expérience immersive et pratique pour gérer leur festival directement depuis leur smartphone.

---

## Présentation

L'application permet de consulter la programmation, de gérer un emploi du temps personnalisé, d'acheter un pass festivalier avec photo, et d'interagir avec les événements via des notifications et des enquêtes de satisfaction.

## Fonctionnalités

### Programmation & Événements
- **Consultation du programme** : Liste complète des films et projections.
- **La Quotidienne** : Affichage des événements du jour (ateliers/rencontres).
- **Programme personnalisé** : Sélection de séances favorites pour construire son propre planning.
- **Export Calendrier** : Ajout des séances directement dans le calendrier interne du téléphone.

### Pass Festivalier
- **Achat de pass** : Formulaire complet pour commander son pass (fictif).
- **Intégration Caméra** : Prise de photo en direct ou sélection dans la galerie pour personnaliser le pass.
- **Pass Numérique** : Affichage du pass avec photo et QR Code pour validation au Village Fantastique.

### Interaction & Feedback
- **Scanner QR Code** : Lecteur intégré pour scanner les codes affichés en salle.
- **Enquêtes de satisfaction** : Formulaires dynamiques pour donner son avis après une projection.
- **Notifications Push** : Rappels de séances (30 min avant) et alertes en cas de changement de planning.

### Infos Pratiques
- **Cartes interactives** : Localisation des cinémas et lieux du festival (Star, Odyssée, Village Fantastique, etc.).
- **Thèmes visuels** : Support complet du mode clair et du mode sombre (Theming).
- **Multimédia** : Intégration de bandes-annonces vidéo pour les films.

---

## Technologies utilisées

- **Framework** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Navigation** : Expo Router 
- **Animations** : React Native Reanimated
- **Capteurs & Natif** : 
  - `expo-camera` (Appareil photo)
  - `expo-notifications` (Push notifications)
  - `expo-calendar` (Calendrier système)
  - `expo-linking` (Cartes et liens externes)

---

## Accessibilité

L'application a été conçue pour être inclusive :
- **Lecteurs d'écran** : Utilisation rigoureuse des propriétés `accessible`, `accessibilityLabel` et `accessibilityRole` sur tous les composants interactifs.
- **Contrastes** : Couleurs adaptées pour une lisibilité optimale en mode clair et sombre.
- **Navigation** : Structure logique facilitant le parcours pour les utilisateurs malvoyants.

---

## Installation et Démarrage

### Prérequis
- Node.js (LTS)
- Expo Go sur votre smartphone ou un émulateur (Android Studio / Xcode)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-compte/feffs-app.git
   cd feffs-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le projet**
   ```bash
   npx expo start
   ```

Scannez le QR Code affiché dans le terminal avec l'application **Expo Go** pour tester sur votre appareil.
