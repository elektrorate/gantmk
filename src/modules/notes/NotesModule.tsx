import { useState } from "react";
import { useInternalNotes } from "@/hooks/useInternalNotes";
import { useUsersRealtime } from "@/hooks/useUsersRealtime";
import { sendInternalNoteRecord } from "@/services/firebase/adapter";
import type { SessionUser } from "@/types";

export function NotesModule({ currentUser }: { currentUser: SessionUser | null }) {
  const { users } = useUsersRealtime();
  const { notes } = useInternalNotes(currentUser?.id ?? null);
  const [toUserId, setToUserId] = useState("");

  return (
    <section className="notes-layout">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Nueva nota</p>
            <h3>Mensajes internos</h3>
          </div>
        </div>
        <form
          className="stack-sm"
          onSubmit={(event) => {
            event.preventDefault();
            if (!currentUser || !toUserId) {
              return;
            }

            const formData = new FormData(event.currentTarget);
            void sendInternalNoteRecord({
              fromUserId: currentUser.id,
              toUserId,
              message: String(formData.get("message") ?? ""),
            });
            event.currentTarget.reset();
          }}
        >
          <select value={toUserId} onChange={(event) => setToUserId(event.target.value)}>
            <option value="">Selecciona destinatario</option>
            {users
              .filter((user) => user.id !== currentUser?.id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
          <textarea name="message" placeholder="Escribe una nota interna..." required rows={4} />
          <button className="button" disabled={!currentUser} type="submit">
            Enviar nota
          </button>
        </form>
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Historial</p>
            <h3>Conversación reactiva</h3>
          </div>
        </div>
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <strong>
                {note.fromUserId} → {note.toUserId}
              </strong>
              <p>{note.message}</p>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
