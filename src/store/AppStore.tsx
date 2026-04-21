import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AppStoreValue = {
  activeCourseId: string | null;
  setActiveCourseId: (courseId: string | null) => void;
};

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);
const ACTIVE_COURSE_STORAGE_KEY = "app-gant-active-course";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [activeCourseId, setActiveCourseIdState] = useState<string | null>(() => {
    return window.localStorage.getItem(ACTIVE_COURSE_STORAGE_KEY);
  });

  useEffect(() => {
    if (activeCourseId) {
      window.localStorage.setItem(ACTIVE_COURSE_STORAGE_KEY, activeCourseId);
      return;
    }

    window.localStorage.removeItem(ACTIVE_COURSE_STORAGE_KEY);
  }, [activeCourseId]);

  const value = useMemo(
    () => ({
      activeCourseId,
      setActiveCourseId: setActiveCourseIdState,
    }),
    [activeCourseId],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error("useAppStore debe usarse dentro de AppStoreProvider");
  }

  return context;
}
