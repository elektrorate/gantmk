import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

const HomePage = lazy(async () => import("@/modules/home/HomePage").then((module) => ({ default: module.HomePage })));
const CoursesPage = lazy(async () =>
  import("@/modules/courses/CoursesPage").then((module) => ({ default: module.CoursesPage })),
);
const CourseManagementPage = lazy(async () =>
  import("@/modules/courses/CourseManagementPage").then((module) => ({ default: module.CourseManagementPage })),
);
const ReportsPage = lazy(async () =>
  import("@/modules/reports/ReportsPage").then((module) => ({ default: module.ReportsPage })),
);
const NotesPage = lazy(async () => import("@/modules/notes/NotesPage").then((module) => ({ default: module.NotesPage })));

function PageLoader() {
  return (
    <section className="empty-state">
      <h2>Cargando modulo</h2>
      <p>Preparando la vista reactiva...</p>
    </section>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="course-management" element={<CourseManagementPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="messages" element={<NotesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
