import { useMemo } from "react";
import { GanttWeeklyProgress } from "@/components/dashboard/GanttWeeklyProgress";
import { CalendarModule } from "@/modules/calendar/CalendarModule";
import type { Course } from "@/types";
import {
  buildBudgetWeekItems,
  buildStudentWeekItems,
  getBudgetMetrics,
  getCoursePeriodLabel,
  getStudentMetrics,
} from "@/utils/course";

export function CourseDashboard({ course }: { course: Course | null }) {
  const studentMetrics = useMemo(() => (course ? getStudentMetrics(course) : null), [course]);
  const budgetMetrics = useMemo(() => (course ? getBudgetMetrics(course) : null), [course]);

  if (!course || !studentMetrics || !budgetMetrics) {
    return (
      <section className="empty-state">
        <h2>Selecciona un curso activo</h2>
        <p>El dashboard se actualiza en tiempo real cuando eliges un curso.</p>
      </section>
    );
  }

  return (
    <section className="dashboard-grid">
      <article className="panel hero-panel">
        <div>
          <p className="eyebrow">Curso activo</p>
          <h2>{course.nombreCurso}</h2>
        </div>
        <div className="hero-metadata">
          <div>
            <span>Periodo</span>
            <strong>{getCoursePeriodLabel(course)}</strong>
          </div>
          <div>
            <span>Objetivo total</span>
            <strong>{course.objetivoTotalAlumnos} alumnos</strong>
          </div>
          <div>
            <span>Presupuesto total</span>
            <strong>{course.presupuestoTotal} €</strong>
          </div>
        </div>
      </article>

      <GanttWeeklyProgress
        sectionTitle="Objetivo de alumnos"
        highlightValue={`${course.objetivoTotalAlumnos} alumnos`}
        periodLabel={`Periodo ${getCoursePeriodLabel(course)}`}
        weeks={buildStudentWeekItems(course)}
        leftMetric={studentMetrics[0]}
        rightMetric={studentMetrics[1]}
        variant="students"
      />

      <GanttWeeklyProgress
        sectionTitle="Gasto en pauta"
        highlightValue={`${course.presupuestoTotal} €`}
        periodLabel={`Periodo ${getCoursePeriodLabel(course)}`}
        weeks={buildBudgetWeekItems(course)}
        leftMetric={budgetMetrics[0]}
        rightMetric={budgetMetrics[1]}
        variant="budget"
      />

      <CalendarModule course={course} />
    </section>
  );
}
