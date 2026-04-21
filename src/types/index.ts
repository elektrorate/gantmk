export type UserRole = "admin" | "editor";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Course = {
  id: string;
  nombreCurso: string;
  fechaInicio: string;
  fechaFin: string;
  objetivoTotalAlumnos: number;
  objetivoSemanal: [number, number, number, number];
  presupuestoTotal: number;
  presupuestoSemanal: [number, number, number, number];
  alumnosRealesSemanal: [number, number, number, number];
  gastoRealSemanal: [number, number, number, number];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type CourseCalendarEvent = {
  id: string;
  courseId: string;
  date: string;
  consultas: number;
  alumnosCerrados: number;
  createdAt: string;
  updatedAt: string;
};

export type InternalNote = {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type WeekStatus = "completed" | "current" | "pending";

export type WeekItem = {
  label: string;
  value: string;
  status: WeekStatus;
};

export type MetricItem = {
  value: string;
  label: string;
};

export type GanttWeeklyProgressProps = {
  sectionTitle: string;
  highlightValue: string;
  periodLabel: string;
  weeks: WeekItem[];
  leftMetric: MetricItem;
  rightMetric: MetricItem;
  variant?: "students" | "budget";
};

export type NavigationItem = {
  label: string;
  to: string;
  description: string;
};

export type ReportRow = {
  semana: string;
  objetivo: number;
  real: number;
  gasto: number;
  conversiones: number;
  roi: number;
};

export type CourseInput = Omit<Course, "id" | "createdAt" | "updatedAt">;
export type UserInput = Omit<AppUser, "id" | "createdAt">;
export type CalendarEventInput = Omit<CourseCalendarEvent, "id" | "createdAt" | "updatedAt">;
export type InternalNoteInput = Omit<InternalNote, "id" | "createdAt" | "read">;
