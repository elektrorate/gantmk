import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { GanttWeeklyProgress } from "@/components/dashboard/GanttWeeklyProgress";
import { CalendarModule } from "@/modules/calendar/CalendarModule";
import { useCourseRealtime } from "@/hooks/useCourseRealtime";
import { useCoursesRealtime } from "@/hooks/useCoursesRealtime";
import { useAuth } from "@/hooks/useAuth";
import { getDemoCoursesSnapshot } from "@/services/firebase/adapter";
import { isFirebaseConfigured } from "@/services/firebase/config";
import { useAppStore } from "@/store/AppStore";
import { buildBudgetWeekItems, buildStudentWeekItems, getBudgetMetrics, getCoursePeriodLabel, getStudentMetrics } from "@/utils/course";

const navigationItems = [
  { label: "Home", to: "/home" },
  { label: "Cursos", to: "/courses" },
  { label: "Gestion", to: "/course-management" },
  { label: "Reportes", to: "/reports" },
  { label: "Mensajes", to: "/messages" },
] as const;

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
  const { course, error: activeCourseError } = useCourseRealtime(activeCourseId);
  const { courses, error: coursesError } = useCoursesRealtime();
  const { user, signOutSession } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const demoCourses = useMemo(() => getDemoCoursesSnapshot(), []);

  const firstName = useMemo(() => user?.name?.split(" ")[0] ?? "Oliver", [user?.name]);
  const avatarLabel = useMemo(() => firstName.slice(0, 2).toUpperCase(), [firstName]);
  const shouldUseDemo = !isFirebaseConfigured || Boolean(coursesError) || Boolean(activeCourseError);
  const availableCourses = shouldUseDemo ? demoCourses : courses;
  const displayCourse = shouldUseDemo
    ? availableCourses.find((item) => item.id === activeCourseId) ?? availableCourses[0] ?? null
    : course ?? availableCourses.find((item) => item.id === activeCourseId) ?? availableCourses[0] ?? null;
  const studentMetrics = useMemo(() => (displayCourse ? getStudentMetrics(displayCourse) : null), [displayCourse]);
  const budgetMetrics = useMemo(() => (displayCourse ? getBudgetMetrics(displayCourse) : null), [displayCourse]);

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
          <h2>{courses.length === 0 && !shouldUseDemo ? "No hay cursos creados" : "Selecciona un curso"}</h2>
          <p>
            {courses.length === 0 && !shouldUseDemo
              ? "Crea un curso nuevo para activar el sistema y comenzar el seguimiento."
              : "La maqueta principal se mostrara cuando elijas un curso activo."}
          </p>
        </div>
      </section>
    );
  }

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
          leftMetric={studentMetrics?.[0] ?? { value: "0%", label: "Progreso de alumnos" }}
          rightMetric={studentMetrics?.[1] ?? { value: "0", label: "Alumnos restantes" }}
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
            leftMetric={budgetMetrics?.[0] ?? { value: "0%", label: "Progreso gasto" }}
            rightMetric={budgetMetrics?.[1] ?? { value: "0 €", label: "Presupuesto restante" }}
            variant="budget"
          />
        </section>
      </section>

      <CalendarModule course={displayCourse} />
    </section>
  );
}
