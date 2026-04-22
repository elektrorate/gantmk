import { useState } from "react";
import { useUsersRealtime } from "@/hooks/useUsersRealtime";
import { DEMO_READ_ONLY_MESSAGE, createUserRecord, deleteUserRecord } from "@/services/firebase/adapter";
import { isFirebaseConfigured } from "@/services/firebase/config";
import type { UserRole } from "@/types";

export function UsersModule() {
  const { users } = useUsersRealtime();
  const [role, setRole] = useState<UserRole>("editor");
  const [status, setStatus] = useState<string | null>(null);
  const isReadOnly = !isFirebaseConfigured;

  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Usuarios</p>
          <h3>CRUD de usuarios</h3>
        </div>
        <span className="status-pill">{status ?? `${users.length} usuarios`}</span>
      </div>

      <form
        className="stack-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (isReadOnly) {
            setStatus(DEMO_READ_ONLY_MESSAGE);
            return;
          }

          const formData = new FormData(event.currentTarget);
          void createUserRecord({
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            role,
            password: String(formData.get("password") ?? ""),
          })
            .then(() => {
              setStatus("Usuario creado");
              event.currentTarget.reset();
            })
            .catch((cause) => setStatus(cause instanceof Error ? cause.message : "No fue posible crear el usuario."));
        }}
      >
        <input disabled={isReadOnly} name="name" placeholder="Nombre" required />
        <input disabled={isReadOnly} name="email" placeholder="Email" required type="email" />
        <input disabled={isReadOnly} name="password" placeholder="Password temporal" type="password" />
        <select disabled={isReadOnly} value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="button" disabled={isReadOnly} type="submit">
          {isReadOnly ? "Solo lectura" : "Crear usuario"}
        </button>
      </form>

      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <div>
              <strong>{user.name}</strong>
              <span>
                {user.email} · {user.role}
              </span>
            </div>
            <button
              className="button button-danger"
              disabled={isReadOnly}
              onClick={() =>
                void deleteUserRecord(user.id)
                  .then(() => setStatus("Usuario eliminado"))
                  .catch((cause) => setStatus(cause instanceof Error ? cause.message : "No fue posible eliminar el usuario."))
              }
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
