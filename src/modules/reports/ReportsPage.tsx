import { useMemo } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCourseRealtime } from "@/hooks/useCourseRealtime";
import { useAppStore } from "@/store/AppStore";
import { exportCourseReport } from "@/utils/export";
import { buildReportRows, getTotalsRow } from "@/utils/course";

const downloadMaterials = [
  { id: "excel", label: "Excel", helper: "Datos completos", tone: "is-active" },
  { id: "pdf", label: "PDF", helper: "Resumen visual", tone: "" },
  { id: "csv", label: "CSV", helper: "Datos planos", tone: "" },
  { id: "kit", label: "Kit", helper: "Material del curso", tone: "" },
] as const;

function MaterialIcon({ type }: { type: (typeof downloadMaterials)[number]["id"] }) {
  switch (type) {
    case "excel":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z" fill="currentColor" opacity="0.18" />
          <path d="M10 9.2 11.8 12 10 14.8h1.8l.9-1.5.9 1.5h1.9L13.7 12l1.8-2.8h-1.8l-.9 1.5-.9-1.5Z" fill="currentColor" />
        </svg>
      );
    case "pdf":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z" fill="currentColor" opacity="0.18" />
          <path d="M9.2 15V9.1h2.3c1.3 0 2.1.7 2.1 1.8s-.9 1.8-2.1 1.8h-.9V15Zm1.4-3.4h.7c.5 0 .9-.2.9-.7s-.4-.7-.9-.7h-.7Z" fill="currentColor" />
        </svg>
      );
    case "csv":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="14" rx="2.5" fill="currentColor" opacity="0.18" />
          <path d="M7.8 10.2h8.4M7.8 13h8.4M7.8 15.8h5.8M10.8 8v9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M12 4.5c1.6 2 3.7 3.7 6.2 4.7v4.2c0 3.4-2.4 5.6-6.2 6.9-3.8-1.3-6.2-3.5-6.2-6.9V9.2C8.3 8.2 10.4 6.5 12 4.5Z"
            fill="currentColor"
            opacity="0.18"
          />
          <path d="M9.4 12.4 11 14l3.8-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        </svg>
      );
  }
}

export function ReportsPage() {
  const { activeCourseId } = useAppStore();
  const { course } = useCourseRealtime(activeCourseId);
  const { events } = useCalendarEvents(activeCourseId);
  const rows = useMemo(() => (course ? [...buildReportRows(course, events), getTotalsRow(course, events)] : []), [course, events]);

  return (
    <section className="page-stack">
      <article className="panel reports-panel">
        <div className="reports-panel__header">
          <div>
            <p className="eyebrow">Reportes</p>
            <h2>Exportacion a Excel</h2>
          </div>

          <button className="button reports-panel__export" disabled={!course} onClick={() => course && exportCourseReport(course, events)}>
            Exportar .xlsx
          </button>
        </div>

        <div className="reports-panel__materials" aria-label="Tipos de material">
          {downloadMaterials.map((material) => (
            <button
              key={material.id}
              className={material.tone ? `reports-material-card ${material.tone}` : "reports-material-card"}
              disabled={material.id !== "excel" || !course}
              onClick={() => material.id === "excel" && course && exportCourseReport(course, events)}
              type="button"
            >
              <span className="reports-material-card__icon">
                <MaterialIcon type={material.id} />
              </span>
              <strong>{material.label}</strong>
              <span>{material.helper}</span>
            </button>
          ))}
        </div>

        <div className="table-wrap reports-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Semana</th>
                <th>Objetivo</th>
                <th>Real</th>
                <th>Presupuesto</th>
                <th>Gasto</th>
                <th>Consultas</th>
                <th>Cerrados</th>
                <th>ROI</th>
                <th>CPA</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.semana}>
                  <td>{row.semana}</td>
                  <td>{row.objetivo}</td>
                  <td>{row.real}</td>
                  <td>{row.presupuesto}</td>
                  <td>{row.gasto}</td>
                  <td>{row.consultas}</td>
                  <td>{row.alumnosCerrados}</td>
                  <td>{row.roi}</td>
                  <td>{row.costePorAlumno}</td>
                  <td>{row.tasaConversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
