# Documentacion Interna

Esta carpeta guarda el contexto funcional y tecnico de la app para que podamos entenderla rapido sin depender solo del codigo.

## Archivos

- `app-overview.md`: explica que hace la aplicacion y cual es el flujo principal.
- `architecture.md`: resume la arquitectura del frontend, hooks, store y servicios.
- `data-model.md`: documenta las entidades principales y como se relacionan.
- `deployment.md`: contiene notas de entorno, Firebase, GitHub y Vercel.

## Uso recomendado

Cuando hagamos cambios importantes, conviene actualizar al menos uno de estos archivos:

- Si cambia la interfaz o el flujo del usuario: `app-overview.md`
- Si cambia la estructura del codigo: `architecture.md`
- Si cambia Firestore o el shape de datos: `data-model.md`
- Si cambia la forma de desplegar o configurar: `deployment.md`
