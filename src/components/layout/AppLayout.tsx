import { NavLink, Outlet } from "react-router-dom";
import type { NavigationItem } from "@/types";

const navigationItems: NavigationItem[] = [
  { label: "Home", to: "/home", description: "Dashboard" },
  { label: "Cursos", to: "/courses", description: "Cursos" },
  { label: "Gestion", to: "/course-management", description: "Gestion" },
  { label: "Reportes", to: "/reports", description: "Reportes" },
  { label: "Mensajes", to: "/messages", description: "Mensajes" },
];

function getBottomIcon(label: string) {
  switch (label) {
    case "Home":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-4.75v-5.5h-4.5V19.5H5a1 1 0 0 1-1-1z" fill="currentColor" />
        </svg>
      );
    case "Cursos":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor" />
        </svg>
      );
    case "Gestion":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M4 17.5V20h2.5L18.8 7.7l-2.5-2.5zm15.7-9.8a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0l-1.2 1.2 3.4 3.4z"
            fill="currentColor"
          />
        </svg>
      );
    case "Reportes":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5zm6 1.8v3.2h3.2z"
            fill="currentColor"
          />
        </svg>
      );
    case "Mensajes":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8A1.5 1.5 0 0 1 19 16.5H9.8L5.7 19a.4.4 0 0 1-.7-.3v-2.2A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="6" fill="currentColor" />
        </svg>
      );
  }
}

export function AppLayout() {
  return (
    <div className="mobile-app-shell">
      <main className="mobile-screen-content">
        <Outlet />
      </main>

      <nav className="mobile-bottom-nav" aria-label="Secundaria">
        <div className="mobile-bottom-nav__items">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) => (isActive ? "mobile-bottom-nav__item is-active" : "mobile-bottom-nav__item")}
            >
              <span className="mobile-bottom-nav__icon">{getBottomIcon(item.label)}</span>
            </NavLink>
          ))}
        </div>
        <div className="mobile-bottom-nav__bar" />
      </nav>
    </div>
  );
}
