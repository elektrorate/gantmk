import { useState } from "react";
import { useUsersRealtime } from "@/hooks/useUsersRealtime";
import { createUserRecord, deleteUserRecord } from "@/services/firebase/adapter";
import type { UserRole } from "@/types";

export function UsersModule() {
  const { users } = useUsersRealtime();
  const [role, setRole] = useState<UserRole>("editor");

  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Usuarios</p>
          <h3>CRUD de usuarios</h3>
        </div>
        <span className="status-pill">{users.length} usuarios</span>
      </div>

      <form
        className="stack-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          void createUserRecord({
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            role,
            password: String(formData.get("password") ?? ""),
          });
          event.currentTarget.reset();
        }}
      >
        <input name="name" placeholder="Nombre" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password temporal" type="password" />
        <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="button" type="submit">
          Crear usuario
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
            <button className="button button-danger" onClick={() => void deleteUserRecord(user.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
