# App Gant

Aplicacion web para control de estrategia publicitaria de cursos con React, Vite, TypeScript y Firebase.

## Ejecutar en local

1. Instala dependencias:
   `npm install`
2. Crea un archivo `.env` a partir de `.env.example`.
3. Inicia el entorno local:
   `npm run dev`

## Variables de entorno

Completa estas variables para activar Firebase real:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Si faltan, la app funciona en modo demo reactivo.

## Firestore

Este repo incluye:

- `firestore.rules`
- `firestore.indexes.json`

Para desplegarlos con Firebase CLI:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Vercel

El archivo `vercel.json` deja preparada la app como SPA con rewrite hacia `index.html`.

En Vercel:

1. Importa el proyecto.
2. Configura las variables `VITE_FIREBASE_*`.
3. Usa el comando de build por defecto:
   `npm run build`

## Validacion

- `npm run lint`
- `npm run build`
