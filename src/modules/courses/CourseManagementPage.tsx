import { useMemo } from "react";
import { CourseForm } from "@/modules/courses/CourseForm";
import { UsersModule } from "@/modules/users/UsersModule";
import { useCoursesRealtime } from "@/hooks/useCoursesRealtime";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_READ_ONLY_MESSAGE, deleteCourseRecord } from "@/services/firebase/adapter";
import { isFirebaseConfigured } from "@/services/firebase/config";
import { useAppStore } from "@/store/AppStore";

export function CourseManagementPage() {
  const { courses } = useCoursesRealtime();
  const { activeCourseId, setActiveCourseId } = useAppStore();
  const { user } = useAuth();
  const activeCourse = useMemo(() => courses.find((course) => course.id === activeCourseId), [activeCourseId, courses]);
  const isReadOnly = !isFirebaseConfigured;

  return (
    <section className="page-grid">
      <CourseForm course={activeCourse} currentUser={user} />

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Eliminar curso</p>
            <h3>Gestion de cursos</h3>
          </div>
          {isReadOnly ? <span className="status-pill">{DEMO_READ_ONLY_MESSAGE}</span> : null}
        </div>
        <div className="course-list">
          {courses.map((course) => (
            <div key={course.id} className="course-admin-row">
              <button className="course-list-item" onClick={() => setActiveCourseId(course.id)}>
                <strong>{course.nombreCurso}</strong>
                <span>{course.presupuestoTotal} €</span>
              </button>
              <button className="button button-danger" disabled={isReadOnly} onClick={() => void deleteCourseRecord(course.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </article>

      <UsersModule />
    </section>
  );
}
