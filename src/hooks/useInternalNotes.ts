import { useEffect, useState } from "react";
import { subscribeToInternalNotes } from "@/services/firebase/adapter";
import type { InternalNote } from "@/types";

export function useInternalNotes(userId: string | null) {
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const unsubscribe = subscribeToInternalNotes(userId, (nextNotes) => {
        setNotes(nextNotes);
        setLoading(false);
      });

      return unsubscribe;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar las notas internas.");
      setLoading(false);
    }
  }, [userId]);

  return { notes, loading, error };
}
