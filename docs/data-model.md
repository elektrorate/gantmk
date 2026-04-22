# Modelo de Datos

## Tipos principales

Los tipos compartidos viven en `src/types/index.ts`.

## SessionUser

Representa al usuario autenticado dentro de la sesion activa.

Campos principales:

- `id`
- `name`
- `email`
- `role`

## Course

Es la entidad principal del negocio.

Campos mas relevantes:

- `id`
- `nombreCurso`
- `fechaInicio`
- `fechaFin`
- `objetivoTotalAlumnos`
- `objetivoSemanal`
- `presupuestoTotal`
- `presupuestoSemanal`
- `alumnosRealesSemanal`
- `gastoRealSemanal`
- `createdAt`
- `updatedAt`
- `createdBy`

## CourseCalendarEvent

Eventos vinculados al curso para poblar el calendario.

Campos:

- `id`
- `courseId`
- `date`
- `consultas`
- `alumnosCerrados`

## InternalNote

Notas o mensajes internos entre usuarios.

Campos:

- `id`
- `fromUserId`
- `toUserId`
- `message`
- `createdAt`
- `read`

## Reglas de negocio visibles

- Los cursos trabajan con una estructura semanal de 4 semanas.
- Los gantt usan arrays fijos de 4 posiciones para objetivos y valores reales.
- La home calcula progreso de alumnos y presupuesto a partir de esos arrays.
- El calendario cruza eventos reales con dias de actividad demo cuando hace falta mostrar contexto visual.
