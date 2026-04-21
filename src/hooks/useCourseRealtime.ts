import { useEffect, useState } from "react";
import { subscribeToCourse } from "@/services/firebase/adapter";
import type { Course } from "@/types";

export function useCourseRealtime(courseId: string | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const unsubscribe = subscribeToCourse(courseId, (nextCourse) => {
        setCourse(nextCourse);
        setLoading(false);
      });

      return unsubscribe;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar el curso activo.");
      setLoading(false);
    }
  }, [courseId]);

  return { course, loading, error };
}
