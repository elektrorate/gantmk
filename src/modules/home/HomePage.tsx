import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { GanttWeeklyProgress } from "@/components/dashboard/GanttWeeklyProgress";
import { CalendarModule } from "@/modules/calendar/CalendarModule";
import { useCourseRealtime } from "@/hooks/useCourseRealtime";
import { useCoursesRealtime } from "@/hooks/useCoursesRealtime";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/AppStore";
import { buildBudgetWeekItems, buildStudentWeekItems, calculateStudentProgress, getCoursePeriodLabel } from "@/utils/course";
import type { Course } from "@/types";

const navigationItems = [
  { label: "Home", to: "/home" },
  { label: "Cursos", to: "/courses" },
  { label: "Gestion", to: "/course-management" },
  { label: "Reportes", to: "/reports" },
  { label: "Mensajes", to: "/messages" },
] as const;

const demoCourses: Course[] = [
  {
    id: "course-modelado-iniciacion",
    nombreCurso: "Curso de Iniciacion de Modelado",
    fechaInicio: "2026-04-03",
    fechaFin: "2026-05-03",
    objetivoTotalAlumnos: 64,
    objetivoSemanal: [16, 16, 16, 16],
    presupuestoTotal: 300,
    presupuestoSemanal: [75, 75, 75, 75],
    alumnosRealesSemanal: [14, 14, 14, 0],
    gastoRealSemanal: [18, 28, 128, 0],
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    createdBy: "demo",
  },
  {
    id: "course-ceramica-iniciacion",
    nombreCurso: "Curso de Iniciacion de Ceramica",
    fechaInicio: "2026-04-03",
    fechaFin: "2026-05-03",
    objetivoTotalAlumnos: 48,
    objetivoSemanal: [12, 12, 12, 12],
    presupuestoTotal: 240,
    presupuestoSemanal: [60, 60, 60, 60],
    alumnosRealesSemanal: [10, 11, 9, 0],
    gastoRealSemanal: [14, 26, 96, 0],
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    createdBy: "demo",
  },
  {
    id: "course-torno-iniciacion",
    nombreCurso: "Curso de Iniciacion al Torno",
    fechaInicio: "2026-04-03",
    fechaFin: "2026-05-03",
    objetivoTotalAlumnos: 52,
    objetivoSemanal: [13, 13, 13, 13],
    presupuestoTotal: 280,
    presupuestoSemanal: [70, 70, 70, 70],
    alumnosRealesSemanal: [11, 12, 10, 0],
    gastoRealSemanal: [16, 24, 104, 0],
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    createdBy: "demo",
  },
  {
    id: "course-modelado-especializacion",
    nombreCurso: "Especializacion en Modelado Editorial",
    fechaInicio: "2026-04-03",
    fechaFin: "2026-05-03",
    objetivoTotalAlumnos: 36,
    objetivoSemanal: [9, 9, 9, 9],
    presupuestoTotal: 340,
    presupuestoSemanal: [85, 85, 85, 85],
    alumnosRealesSemanal: [8, 7, 9, 0],
    gastoRealSemanal: [20, 34, 120, 0],
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    createdBy: "demo",
  },
  {
    id: "course-escultura-especializacion",
    nombreCurso: "Especializacion en Escultura Ceramica",
    fechaInicio: "2026-04-03",
    fechaFin: "2026-05-03",
    objetivoTotalAlumnos: 32,
    objetivoSemanal: [8, 8, 8, 8],
    presupuestoTotal: 320,
    presupuestoSemanal: [80, 80, 80, 80],
    alumnosRealesSemanal: [7, 7, 8, 0],
    gastoRealSemanal: [19, 31, 116, 0],
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    createdBy: "demo",
  },
  {
    id: "course-esmaltes-especializacion",
    nombreCurso: "Especializacion en Esmaltes y Acabados",
    fechaInicio: "2026-04-03",
    fechaFin: "2026-05-03",
    objetivoTotalAlumnos: 28,
    objetivoSemanal: [7, 7, 7, 7],
    presupuestoTotal: 260,
    presupuestoSemanal: [65, 65, 65, 65],
    alumnosRealesSemanal: [6, 7, 6, 0],
    gastoRealSemanal: [15, 22, 92, 0],
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    createdBy: "demo",
  },
];

function getCourseCategory(courseName: string) {
  return courseName.toLowerCase().includes("especializacion") ? "Especializacion" : "Iniciacion";
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
      <path
        d="M12 4.2a5 5 0 0 0-5 5v2.2c0 .9-.3 1.8-.9 2.5L4.8 15.5c-.3.4 0 1 .5 1h13.4c.5 0 .8-.6.5-1l-1.3-1.6a4.1 4.1 0 0 1-.9-2.5V9.2a5 5 0 0 0-5-5Zm0 15.6a2.2 2.2 0 0 0 2.1-1.6H9.9A2.2 2.2 0 0 0 12 19.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HomePage() {
  const { activeCourseId, setActiveCourseId } = useAppStore();
  const { course } = useCourseRealtime(activeCourseId);
  const { courses } = useCoursesRealtime();
  const { user, signOutSession } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = useMemo(() => user?.name?.split(" ")[0] ?? "Oliver", [user?.name]);
  const avatarLabel = useMemo(() => firstName.slice(0, 2).toUpperCase(), [firstName]);
  const availableCourses = courses.length > 0 ? courses : demoCourses;
  const displayCourse = course ?? availableCourses.find((item) => item.id === activeCourseId) ?? availableCourses[0] ?? null;

  const coursesByCategory = useMemo(() => {
    return availableCourses.reduce<Record<string, typeof availableCourses>>(
      (accumulator, item) => {
        const key = getCourseCategory(item.nombreCurso);
        accumulator[key] = [...(accumulator[key] ?? []), item];
        return accumulator;
      },
      { Iniciacion: [], Especializacion: [] },
    );
  }, [availableCourses]);

  if (!displayCourse) {
    return (
      <section className="mobile-home">
        <div className="mobile-empty-state">
          <h2>Selecciona un curso</h2>
          <p>La maqueta principal se mostrara cuando elijas un curso activo.</p>
        </div>
      </section>
    );
  }

  const progressStudents = calculateStudentProgress(displayCourse) > 0 ? "90%" : "0%";
  const remainingStudents = calculateStudentProgress(displayCourse) > 0 ? "6%" : "0%";
  const periodLabel = getCoursePeriodLabel(displayCourse);

  return (
    <section className="mobile-home">
      <div className="mobile-home__topbar">
        <div className="mobile-home__leading">
          <button className="mobile-home__icon-button" type="button">
            <span className="mobile-home__badge">5</span>
            <BellIcon />
          </button>
        </div>

        <div className="mobile-home__actions">
          <div className="mobile-home__avatar" aria-label={`Usuario ${firstName}`}>
            {avatarLabel}
          </div>

          <button
            aria-expanded={menuOpen}
            aria-label="Abrir menu"
            className="mobile-home__menu-button"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        aria-hidden={!menuOpen}
        className={menuOpen ? "mobile-home__menu-overlay is-open" : "mobile-home__menu-overlay"}
        onClick={() => setMenuOpen(false)}
      >
        <div className="mobile-home__menu-panel" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-home__menu-header">
            <strong>{user?.name ?? "Usuario"}</strong>
            <span>{user?.email ?? "sesion demo"}</span>
          </div>

          <nav className="mobile-home__menu-links" aria-label="Menu principal">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "mobile-home__menu-link is-active" : "mobile-home__menu-link")}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button className="mobile-home__menu-action" onClick={() => void signOutSession()} type="button">
            Cerrar sesion
          </button>
        </div>
      </div>

      <h1 className="mobile-home__greeting">Hi,{firstName}!</h1>

      <div className="mobile-home__filter">
        <div className="mobile-home__select-wrap">
          <select className="mobile-home__select" value={activeCourseId ?? ""} onChange={(event) => setActiveCourseId(event.target.value || null)}>
            <option value="">Ver todo</option>
            {Object.entries(coursesByCategory).map(([label, items]) => (
              <optgroup key={label} label={label}>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombreCurso}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className="mobile-home__select-icon" />
        </div>
      </div>

      <section className="mobile-home__section">
        <p className="mobile-home__course-label">{displayCourse.nombreCurso.toUpperCase()}</p>
        <p className="mobile-home__section-title">OBJETIVO</p>
        <h2 className="mobile-home__highlight">{displayCourse.objetivoTotalAlumnos} ALUMNOS</h2>
        <p className="mobile-home__period">objetivo asignado para periodo {periodLabel}</p>

        <GanttWeeklyProgress
          sectionTitle=""
          highlightValue=""
          periodLabel=""
          weeks={buildStudentWeekItems(displayCourse)}
          leftMetric={{ value: progressStudents, label: "Project completion rate" }}
          rightMetric={{ value: remainingStudents, label: "Remaining tasks" }}
          variant="students"
        />

        <section className="mobile-home__budget">
          <h3 className="mobile-home__budget-title">GASTO EN PAUTA {displayCourse.presupuestoTotal} {"\u20ac"}</h3>
          <p className="mobile-home__budget-period">Monto asignado para periodo {periodLabel}</p>

          <GanttWeeklyProgress
            sectionTitle=""
            highlightValue=""
            periodLabel=""
            weeks={buildBudgetWeekItems(displayCourse)}
            leftMetric={{ value: "", label: "" }}
            rightMetric={{ value: "", label: "" }}
            variant="budget"
          />
        </section>
      </section>

      <CalendarModule course={displayCourse} />
    </section>
  );
}
