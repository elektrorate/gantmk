import { useEffect, useState } from "react";
import { observeAuthState, signInUser, signOutUser } from "@/services/firebase/adapter";
import type { SessionUser } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = observeAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    setError(null);
    try {
      await signInUser(email, password);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible iniciar sesion.");
    }
  }

  async function signOutSession() {
    setError(null);
    try {
      await signOutUser();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible cerrar sesion.");
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOutSession,
  };
}
