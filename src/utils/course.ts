import { differenceInCalendarDays, format, isAfter, isBefore, parseISO } from "date-fns";
import type { Course, MetricItem, ReportRow, WeekItem, WeekStatus } from "@/types";

const WEEK_LABELS = ["1 sem.", "2 sem.", "3 sem.", "4 sem."] as const;

export function sumNumbers(values: readonly number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function calculateStudentProgress(course: Course) {
  if (course.objetivoTotalAlumnos <= 0) {
    return 0;
  }

  return (sumNumbers(course.alumnosRealesSemanal) / course.objetivoTotalAlumnos) * 100;
}

export function calculateBudgetProgress(course: Course) {
  if (course.presupuestoTotal <= 0) {
    return 0;
  }

  return (sumNumbers(course.gastoRealSemanal) / course.presupuestoTotal) * 100;
}

export function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function getCurrentWeekIndex(course: Course, referenceDate = new Date()) {
  const start = parseISO(course.fechaInicio);
  const end = parseISO(course.fechaFin);

  if (isBefore(referenceDate, start)) {
    return 0;
  }

  if (isAfter(referenceDate, end)) {
    return 3;
  }

  const totalDays = Math.max(differenceInCalendarDays(end, start) + 1, 1);
  const elapsedDays = Math.max(differenceInCalendarDays(referenceDate, start), 0);
  const progress = elapsedDays / totalDays;

  return Math.min(3, Math.floor(progress * 4));
}

export function buildWeekStatuses(course: Course, referenceDate = new Date()): WeekStatus[] {
  const currentWeek = getCurrentWeekIndex(course, referenceDate);

  return WEEK_LABELS.map((_, index) => {
    if (index < currentWeek) {
      return "completed";
    }

    if (index === currentWeek) {
      return "current";
    }

    return "pending";
  });
}

export function buildStudentWeekItems(course: Course) {
  const statuses = buildWeekStatuses(course);

  return WEEK_LABELS.map<WeekItem>((label, index) => ({
    label,
    value: `${course.alumnosRealesSemanal[index]} alum.`,
    status: statuses[index] ?? "pending",
  }));
}

export function buildBudgetWeekItems(course: Course) {
  const statuses = buildWeekStatuses(course);

  return WEEK_LABELS.map<WeekItem>((label, index) => ({
    label,
    value: `${course.gastoRealSemanal[index]} \u20ac`,
    status: statuses[index] ?? "pending",
  }));
}

export function getCoursePeriodLabel(course: Course) {
  return `${format(parseISO(course.fechaInicio), "dd/MM/yy")} / ${format(parseISO(course.fechaFin), "dd/MM/yy")}`;
}

export function getStudentMetrics(course: Course): [MetricItem, MetricItem] {
  return [
    {
      value: `${Math.round(clampPercentage(calculateStudentProgress(course)))}%`,
      label: "Progreso de alumnos",
    },
    {
      value: `${Math.max(course.objetivoTotalAlumnos - sumNumbers(course.alumnosRealesSemanal), 0)}`,
      label: "Alumnos restantes",
    },
  ];
}

export function getBudgetMetrics(course: Course): [MetricItem, MetricItem] {
  return [
    {
      value: `${Math.round(clampPercentage(calculateBudgetProgress(course)))}%`,
      label: "Progreso gasto",
    },
    {
      value: `${Math.max(course.presupuestoTotal - sumNumbers(course.gastoRealSemanal), 0)} \u20ac`,
      label: "Presupuesto restante",
    },
  ];
}

export function buildReportRows(course: Course): ReportRow[] {
  return course.objetivoSemanal.map((objetivo, index) => {
    const real = course.alumnosRealesSemanal[index] ?? 0;
    const gasto = course.gastoRealSemanal[index] ?? 0;

    return {
      semana: `Semana ${index + 1}`,
      objetivo,
      real,
      gasto,
      conversiones: real,
      roi: gasto > 0 ? Number((real / gasto).toFixed(2)) : 0,
    };
  });
}

export function getTotalsRow(course: Course): ReportRow {
  const rows = buildReportRows(course);

  return {
    semana: "Total",
    objetivo: sumNumbers(course.objetivoSemanal),
    real: sumNumbers(course.alumnosRealesSemanal),
    gasto: sumNumbers(course.gastoRealSemanal),
    conversiones: rows.reduce((total, row) => total + row.conversiones, 0),
    roi:
      sumNumbers(course.gastoRealSemanal) > 0
        ? Number((sumNumbers(course.alumnosRealesSemanal) / sumNumbers(course.gastoRealSemanal)).toFixed(2))
        : 0,
  };
}

export function toCourseFormValues(course?: Course) {
  return {
    nombreCurso: course?.nombreCurso ?? "",
    fechaInicio: course?.fechaInicio ?? "",
    fechaFin: course?.fechaFin ?? "",
    objetivoTotalAlumnos: course?.objetivoTotalAlumnos ?? 64,
    objetivoSemanal: course?.objetivoSemanal ?? [16, 16, 16, 16],
    presupuestoTotal: course?.presupuestoTotal ?? 300,
    presupuestoSemanal: course?.presupuestoSemanal ?? [75, 75, 75, 75],
    alumnosRealesSemanal: course?.alumnosRealesSemanal ?? [14, 14, 14, 0],
    gastoRealSemanal: course?.gastoRealSemanal ?? [18, 28, 128, 0],
  };
}
