import * as XLSX from "xlsx";
import type { Course, CourseCalendarEvent } from "@/types";
import { buildReportRows, getTotalsRow } from "@/utils/course";

export function exportCourseReport(course: Course, events: CourseCalendarEvent[] = []) {
  const rows = [...buildReportRows(course, events), getTotalsRow(course, events)].map((row) => ({
    Semana: row.semana,
    "Objetivo alumnos": row.objetivo,
    "Alumnos reales": row.real,
    Presupuesto: row.presupuesto,
    "Gasto real": row.gasto,
    Consultas: row.consultas,
    "Alumnos cerrados": row.alumnosCerrados,
    ROI: row.roi,
    "Coste por alumno": row.costePorAlumno,
    Conversion: row.tasaConversion,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  XLSX.writeFile(workbook, `reporte-${course.nombreCurso.replace(/\s+/g, "-").toLowerCase()}.xlsx`);
}
