# App Overview

## Que es esta app

`App Gant` es una aplicacion web mobile-first para gestionar cursos y visualizar objetivos semanales de captacion, gasto publicitario y calendario operativo.

La interfaz esta pensada con una estetica tipo iPhone/iOS, limpia y muy jerarquizada, con foco en:

- progreso de alumnos por semanas
- gasto en pauta por semanas
- calendario del curso
- acceso rapido a cursos, reportes y mensajes

## Flujo principal

La experiencia principal hoy vive en la pantalla `Home`:

1. El usuario entra a la app.
2. La app carga cursos desde Firebase si esta configurado.
3. Si Firebase no responde o faltan permisos, la home usa cursos demo como fallback visual.
4. El usuario puede cambiar de curso desde el selector superior.
5. La pantalla muestra:
   - nombre del curso
   - objetivo total de alumnos
   - progreso semanal
   - gasto en pauta
   - calendario del mes

## Modulos visibles

- `Home`: dashboard principal mobile
- `Courses`: lista reactiva de cursos
- `Course Management`: alta, edicion y eliminacion de cursos
- `Reports`: exportacion y materiales descargables
- `Messages`: notas internas

## Estado actual importante

- Hay contenido demo para 6 cursos.
- El diseño esta optimizado para mobile.
- La app puede funcionar con Firebase real o con fallback demo en algunas vistas.
