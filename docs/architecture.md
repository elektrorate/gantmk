# Arquitectura

## Stack

- React
- Vite
- TypeScript
- React Router
- Firebase
- date-fns
- xlsx

## Estructura general

La app esta organizada principalmente dentro de `src/`:

- `components/`: piezas reutilizables de UI
- `modules/`: vistas o modulos por seccion
- `hooks/`: acceso reactivo a datos y auth
- `services/firebase/`: configuracion y adapter hacia Firebase
- `store/`: estado global sencillo
- `utils/`: funciones auxiliares de negocio
- `types/`: tipos compartidos

## Flujo tecnico

### Routing

`src/App.tsx` monta las rutas principales usando `react-router-dom`.

### Layout

`src/components/layout/AppLayout.tsx` contiene el shell mobile y el navbar inferior.

### Home

`src/modules/home/HomePage.tsx` es la pantalla principal y concentra:

- saludo superior
- selector de cursos
- menu superior desplegable
- gantt semanal de alumnos
- gantt semanal de presupuesto
- calendario

### Estado global

`src/store/AppStore.tsx` guarda el `activeCourseId` y lo persiste en `localStorage`.

### Datos

Los hooks como `useCoursesRealtime`, `useCourseRealtime`, `useCalendarEvents` y `useAuth` abstraen el acceso a Firebase.

### Fallback demo

Si no hay datos remotos disponibles en la home, se cargan cursos demo locales para no romper la maqueta ni dejar la app vacia.

## Estilos

Toda la capa visual principal esta centralizada en `src/styles.css`.

Hoy ese archivo contiene:

- variables visuales
- layout mobile
- dashboard home
- calendario
- navbar
- estilos auxiliares de paneles internos
