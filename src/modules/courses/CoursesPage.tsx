import { useCourseRealtime } from "@/hooks/useCourseRealtime";
import { useCoursesRealtime } from "@/hooks/useCoursesRealtime";
import { useAppStore } from "@/store/AppStore";
import { CourseDashboard } from "@/components/dashboard/CourseDashboard";

export function CoursesPage() {
  const { courses, loading } = useCoursesRealtime();
  const { activeCourseId, setActiveCourseId } = useAppStore();
  const { course } = useCourseRealtime(activeCourseId);

  return (
    <section className="page-stack">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Cursos</p>
            <h2>Lista reactiva de cursos</h2>
          </div>
          <span className="status-pill">{loading ? "Sincronizando..." : `${courses.length} cursos`}</span>
        </div>

        <div className="course-list">
          {courses.map((item) => (
            <button
              key={item.id}
              className={item.id === activeCourseId ? "course-list-item is-active" : "course-list-item"}
              onClick={() => setActiveCourseId(item.id)}
            >
              <strong>{item.nombreCurso}</strong>
              <span>
                {item.fechaInicio} → {item.fechaFin}
              </span>
            </button>
          ))}
        </div>
      </article>

      <CourseDashboard course={course} />
    </section>
  );
}
