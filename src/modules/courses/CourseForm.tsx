import { useState } from "react";
import { DEMO_READ_ONLY_MESSAGE, createCourseRecord, updateCourseRecord } from "@/services/firebase/adapter";
import { isFirebaseConfigured } from "@/services/firebase/config";
import { toCourseFormValues } from "@/utils/course";
import type { Course, CourseInput, SessionUser } from "@/types";

function parseWeekArray(formData: FormData, prefix: string): [number, number, number, number] {
  return [0, 1, 2, 3].map((index) => Number(formData.get(`${prefix}${index}`) ?? 0)) as [number, number, number, number];
}

export function CourseForm({
  course,
  currentUser,
  onSaved,
}: {
  course?: Course;
  currentUser: SessionUser | null;
  onSaved?: () => void;
}) {
  const initialValues = toCourseFormValues(course);
  const [status, setStatus] = useState<string | null>(null);
  const isReadOnly = !isFirebaseConfigured;

  async function handleSubmit(formData: FormData) {
    if (isReadOnly) {
      setStatus(DEMO_READ_ONLY_MESSAGE);
      return;
    }

    const payload: CourseInput = {
      nombreCurso: String(formData.get("nombreCurso") ?? ""),
      fechaInicio: String(formData.get("fechaInicio") ?? ""),
      fechaFin: String(formData.get("fechaFin") ?? ""),
      objetivoTotalAlumnos: Number(formData.get("objetivoTotalAlumnos") ?? 0),
      objetivoSemanal: parseWeekArray(formData, "objetivoSemanal"),
      presupuestoTotal: Number(formData.get("presupuestoTotal") ?? 0),
      presupuestoSemanal: parseWeekArray(formData, "presupuestoSemanal"),
      alumnosRealesSemanal: parseWeekArray(formData, "alumnosRealesSemanal"),
      gastoRealSemanal: parseWeekArray(formData, "gastoRealSemanal"),
      createdBy: course?.createdBy ?? currentUser?.id ?? "anonymous",
    };

    try {
      if (course) {
        await updateCourseRecord(course.id, payload);
        setStatus("Curso actualizado");
      } else {
        await createCourseRecord(payload);
        setStatus("Curso creado");
      }

      onSaved?.();
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "No fue posible guardar el curso.");
    }
  }

  return (
    <form
      className="panel form-panel"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(new FormData(event.currentTarget));
      }}
    >
      <div className="panel-header">
        <div>
          <p className="eyebrow">{course ? "Editar curso" : "Nuevo curso"}</p>
          <h3>{course ? course.nombreCurso : "Crear curso"}</h3>
        </div>
        {status ? <span className="status-pill">{status}</span> : null}
      </div>

      <label>
        Nombre del curso
        <input defaultValue={initialValues.nombreCurso} disabled={isReadOnly} name="nombreCurso" required />
      </label>

      <div className="grid-two">
        <label>
          Fecha inicio
          <input defaultValue={initialValues.fechaInicio} disabled={isReadOnly} name="fechaInicio" required type="date" />
        </label>
        <label>
          Fecha fin
          <input defaultValue={initialValues.fechaFin} disabled={isReadOnly} name="fechaFin" required type="date" />
        </label>
      </div>

      <div className="grid-two">
        <label>
          Objetivo total alumnos
          <input defaultValue={initialValues.objetivoTotalAlumnos} disabled={isReadOnly} min={0} name="objetivoTotalAlumnos" required type="number" />
        </label>
        <label>
          Presupuesto total
          <input defaultValue={initialValues.presupuestoTotal} disabled={isReadOnly} min={0} name="presupuestoTotal" required type="number" />
        </label>
      </div>

      <div className="weeks-form-grid">
        <fieldset>
          <legend>Objetivo semanal</legend>
          {initialValues.objetivoSemanal.map((value, index) => (
            <input key={`objetivo-${index}`} defaultValue={value} disabled={isReadOnly} min={0} name={`objetivoSemanal${index}`} type="number" />
          ))}
        </fieldset>
        <fieldset>
          <legend>Presupuesto semanal</legend>
          {initialValues.presupuestoSemanal.map((value, index) => (
            <input key={`presupuesto-${index}`} defaultValue={value} disabled={isReadOnly} min={0} name={`presupuestoSemanal${index}`} type="number" />
          ))}
        </fieldset>
        <fieldset>
          <legend>Alumnos reales</legend>
          {initialValues.alumnosRealesSemanal.map((value, index) => (
            <input key={`alumnos-${index}`} defaultValue={value} disabled={isReadOnly} min={0} name={`alumnosRealesSemanal${index}`} type="number" />
          ))}
        </fieldset>
        <fieldset>
          <legend>Gasto real</legend>
          {initialValues.gastoRealSemanal.map((value, index) => (
            <input key={`gasto-${index}`} defaultValue={value} disabled={isReadOnly} min={0} name={`gastoRealSemanal${index}`} type="number" />
          ))}
        </fieldset>
      </div>

      <button className="button" disabled={isReadOnly} type="submit">
        {isReadOnly ? "Solo lectura" : course ? "Guardar cambios" : "Crear curso"}
      </button>
    </form>
  );
}
