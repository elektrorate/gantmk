import { useEffect, useState } from "react";
import { subscribeToCalendarEvents } from "@/services/firebase/adapter";
import type { CourseCalendarEvent } from "@/types";

export function useCalendarEvents(courseId: string | null) {
  const [events, setEvents] = useState<CourseCalendarEvent[]>([]);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToCalendarEvents(courseId, (nextEvents) => {
        setEvents(nextEvents);
        setLoading(false);
      });

      return unsubscribe;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar el calendario.");
      setLoading(false);
    }
  }, [courseId]);

  return { events, loading, error };
}
