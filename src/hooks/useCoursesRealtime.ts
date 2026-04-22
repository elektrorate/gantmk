import { useEffect, useState } from "react";
import { subscribeToCourses } from "@/services/firebase/adapter";
import type { Course } from "@/types";

export function useCoursesRealtime() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    try {
      const unsubscribe = subscribeToCourses((nextCourses) => {
        setCourses(nextCourses);
        setLoading(false);
      });

      return unsubscribe;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar cursos.");
      setLoading(false);
    }
  }, []);

  return { courses, loading, error };
}
