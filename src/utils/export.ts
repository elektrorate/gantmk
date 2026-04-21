import * as XLSX from "xlsx";
import type { Course } from "@/types";
import { buildReportRows, getTotalsRow } from "@/utils/course";

export function exportCourseReport(course: Course) {
  const rows = [...buildReportRows(course), getTotalsRow(course)].map((row) => ({
    Semana: row.semana,
    Objetivo: row.objetivo,
    Real: row.real,
    Gasto: row.gasto,
    Conversiones: row.conversiones,
    ROI: row.roi,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  XLSX.writeFile(workbook, `reporte-${course.nombreCurso.replace(/\s+/g, "-").toLowerCase()}.xlsx`);
}
