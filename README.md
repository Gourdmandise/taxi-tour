# Taxi SLX Monorepo

Ce dépôt est séparé en deux parties:

- `angular/` pour le frontend Angular, prêt pour Vercel
- `backend/` pour l'API Express TypeScript, prête pour Render

## Frontend

```bash
cd angular
npm install
npm start
```

Build:

```bash
cd angular
npm run build
```

## Backend

```bash
cd backend
npm install
npm run dev
```

Build:

```bash
cd backend
npm run build
```

## Variables d'environnement backend

Créer `backend/.env` à partir de `backend/.env.example`.

## Déploiement

- Vercel doit pointer sur le dossier `angular/`
- Render doit pointer sur le dossier `backend/`
- Vercel utilise `angular/vercel.json`
- Render utilise `render.yaml`
