import { useEffect, useState } from "react";
import { subscribeToUsers } from "@/services/firebase/adapter";
import type { AppUser } from "@/types";

export function useUsersRealtime() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToUsers((nextUsers) => {
        setUsers(nextUsers);
        setLoading(false);
      });

      return unsubscribe;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cargar usuarios.");
      setLoading(false);
    }
  }, []);

  return { users, loading, error };
}
