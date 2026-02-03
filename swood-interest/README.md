# 🍽️ Swood Interest - Application de Recherche de Restaurants

Une application mobile React Native développée avec Expo qui permet de trouver et d'explorer les restaurants à proximité de votre position actuelle en utilisant l'API Overpass d'OpenStreetMap.

## 📱 Aperçu

Swood Interest est une application mobile intuitive qui vous aide à découvrir les restaurants autour de vous. L'application affiche les restaurants dans un rayon de 1 km et offre deux modes de visualisation : une carte interactive et une liste détaillée.

### ✨ Fonctionnalités principales

- 🗺️ **Vue Carte** : Visualisez tous les restaurants sur une carte interactive avec des marqueurs personnalisés
- 📋 **Vue Liste** : Parcourez les restaurants dans une liste organisée et facile à naviguer
- 📍 **Géolocalisation** : Détection automatique de votre position actuelle
- 🔍 **Détails complets** : Consultez les informations détaillées de chaque restaurant (adresse, téléphone, site web, type de cuisine)
- 📞 **Actions rapides** : Appelez directement ou obtenez des itinéraires vers le restaurant
- 💾 **Cache intelligent** : Mise en cache des données pour une expérience fluide même hors ligne
- 🔄 **Actualisation** : Rafraîchissez les données pour obtenir les restaurants les plus récents

## 🏗️ Architecture technique

### Structure du projet

```
swood-interest/
├── src/
│   ├── components/          # Composants réutilisables
│   │   └── restaurant/      # Composants spécifiques aux restaurants
│   │       ├── RestaurantHeader.tsx
│   │       ├── QuickActions.tsx
│   │       ├── InfoSection.tsx
│   │       ├── AboutSection.tsx
│   │       └── FeaturesSection.tsx
│   ├── helpers/             # Fonctions utilitaires
│   │   └── geocodingHelpers.ts  # Conversion GPS → Adresse
│   ├── navigation/          # Configuration de navigation
│   │   └── RootNavigator.tsx
│   ├── screens/             # Écrans de l'application
│   │   ├── MapScreen.tsx
│   │   ├── ListScreen.tsx
│   │   └── RestaurantDetailScreen.tsx
│   ├── services/            # Services API et stockage
│   │   ├── restaurantService.ts
│   │   └── storageService.ts
│   ├── store/               # Gestion d'état
│   │   ├── RestaurantContext.tsx
│   │   └── restaurantStore.ts
│   └── types/               # Définitions TypeScript
│       ├── restaurant.ts
│       └── navigation.ts
├── assets/                  # Images et ressources
├── App.tsx                  # Point d'entrée de l'application
└── package.json
```

### Technologies utilisées

- **Framework** : React Native 0.81.5 avec Expo SDK 54
- **Navigation** : React Navigation v7 (Bottom Tabs + Native Stack)
- **Cartes** : React Native Maps
- **Géolocalisation** : Expo Location
- **Stockage** : AsyncStorage pour la mise en cache
- **API** : Overpass API (OpenStreetMap)
- **Langage** : TypeScript 5.9
- **Gestion d'état** : Context API + Store personnalisé

## 🚀 Installation

### Prérequis

- Node.js (version 22 ou supérieure)
- npm ou yarn
- Expo CLI (installé globalement ou via npx)
- Un appareil iOS/Android ou un émulateur configuré

### Installation des dépendances

```bash
# Entrer dans le projet
cd /swood-test/swood-interest

# Verifier que vous utiliser bien node 22
nvm use

# Installer les dépendances
npm install
```

## 📲 Démarrage de l'application

### Développement

```bash
# Démarrer le serveur de développement Expo
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android

# Lancer sur le web
npm run web
```

### Scanner le QR Code

1. Lancez `npm start`
2. Installez l'application **Expo Go** sur votre téléphone
3. Scannez le QR code affiché dans le terminal
4. L'application se chargera automatiquement

## 🔧 Configuration

### Permissions requises

L'application nécessite les permissions suivantes :

- **Localisation** : Pour détecter votre position et trouver les restaurants à proximité

### Variables d'environnement

Aucune variable d'environnement n'est requise. L'application utilise l'API Overpass publique.

## 📖 Guide d'utilisation

### 1. Premier lancement

Au premier lancement, l'application vous demandera l'autorisation d'accéder à votre localisation. Acceptez pour permettre à l'application de trouver les restaurants autour de vous.

### 2. Navigation

#### Vue Carte 🗺️

- Visualisez tous les restaurants sur une carte interactive
- Appuyez sur un marqueur pour voir le nom du restaurant
- Appuyez sur le callout pour accéder aux détails complets

#### Vue Liste 📋

- Parcourez tous les restaurants dans une liste
- Chaque carte affiche le nom, le type de cuisine et la distance
- Appuyez sur une carte pour voir les détails

### 3. Page de détails

Sur la page de détails d'un restaurant, vous pouvez :

- 📞 **Appeler** : Lance l'application téléphone avec le numéro
- 🧭 **Itinéraire** : Ouvre l'application de cartes avec l'itinéraire
- 🌐 **Site web** : Ouvre le navigateur avec le site du restaurant
- 📍 **Voir l'adresse complète** : Grâce au reverse geocoding
- 🍴 **Type de cuisine** : Voir le type de cuisine proposé
- 📊 **Coordonnées GPS** : Latitude et longitude exactes

### 4. Rafraîchissement des données

- Tirez vers le bas dans la vue liste pour actualiser
- Les données sont mises en cache pour 5 minutes
- L'application vérifie automatiquement si vous avez changé de position

## 🔄 Fonctionnement du cache

L'application implémente un système de cache intelligent :

1. **Cache mémoire** : Les données sont stockées dans le store pendant 5 minutes
2. **Cache persistant** : Les données sont sauvegardées dans AsyncStorage
3. **Vérification de position** : Le cache est invalidé si vous vous déplacez
4. **Mode hors ligne** : Les données en cache sont utilisées si l'API est indisponible

## 🌐 API Overpass

L'application utilise l'API Overpass d'OpenStreetMap pour récupérer les données des restaurants :

- **Endpoint** : `https://overpass.kumi.systems/api/interpreter`
- **Rayon de recherche** : 1000 mètres (1 km)
- **Retry automatique** : 3 tentatives en cas d'erreur 503
- **Timeout** : 25 secondes

### Exemple de requête

```overpassql
[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:1000,latitude,longitude);
  way["amenity"="restaurant"](around:1000,latitude,longitude);
);
out body;
```

## 🎨 Personnalisation

### Changer le rayon de recherche

Dans `src/store/RestaurantContext.tsx`, ligne 56 :

```typescript
const radius = 1000; // Modifier cette valeur (en mètres)
```

### Modifier la durée du cache

Dans `src/store/restaurantStore.ts` :

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (modifier cette valeur)
```

### Thème et couleurs

Les couleurs principales sont définies dans chaque écran. Pour un thème cohérent :

- **Carte** : `#4CAF50` (vert)
- **Liste** : `#2196F3` (bleu)
- **Actions** : `#007AFF` (bleu iOS)

## 🐛 Dépannage

### L'application ne trouve pas de restaurants

1. Vérifiez que la permission de localisation est accordée
2. Assurez-vous d'avoir une connexion Internet
3. Vérifiez que vous êtes dans une zone avec des restaurants
4. Essayez d'augmenter le rayon de recherche

### Erreur 503 (Service Unavailable)

L'API Overpass peut être temporairement surchargée. L'application réessaie automatiquement 3 fois. Si le problème persiste, attendez quelques minutes.

### Les détails ne s'affichent pas

Certains restaurants dans OpenStreetMap peuvent avoir des données incomplètes. Ceci est normal et dépend de la qualité des données OSM.

## 📝 Licence

Ce projet est à usage privé.
