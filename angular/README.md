# Taxi SLX

Application full-stack pour Taxi SLX à Saulx-les-Chartreux, basée sur la maquette v3.

## Frontend Angular

```bash
npm install
npm start
```

Le front démarre sur `http://localhost:4200/` et envoie les formulaires vers le backend via le proxy `/api`.

## Backend

```bash
cd backend
npm install
npm run dev
```

Le backend écoute sur `http://localhost:3000`.

Créez un fichier `.env` dans `backend/` à partir de `.env.example` pour configurer les secrets SMTP ou l’adresse de réception.

## Build

```bash
npm run build
cd backend
npm run build
```

## Contenu

- Landing page sombre noir/or avec navigation fixe
- Sections services, à propos, véhicule et tarifs
- Pages contact, devis et rendez-vous connectées au backend
- Backend Express TypeScript pour recevoir et protéger les données sensibles