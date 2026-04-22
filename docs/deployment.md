# Deployment

## Entornos principales

La app se usa hoy con:

- desarrollo local con Vite
- GitHub como repositorio remoto
- Vercel para despliegue frontend
- Firebase para auth y Firestore

## Local

Pasos base:

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows, copia `.env.example` manualmente a `.env` si hace falta.

## Variables de entorno

Estas variables habilitan Firebase real:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Firebase

Archivos incluidos:

- `firestore.rules`
- `firestore.indexes.json`

Despliegue de reglas e indices:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## GitHub

Repositorio remoto actual:

`https://github.com/elektrorate/gantmk`

## Vercel

Proyecto vinculado:

- nombre: `gantmk`
- dominio: `https://gantmk.vercel.app`

Comando de despliegue usado:

```bash
npx vercel --prod --yes
```

## Notas importantes

- `.env` no debe subirse al repo.
- `.vercel/` queda ignorado por Git.
- Si Firestore devuelve permisos insuficientes, la home puede seguir mostrando contenido demo.
