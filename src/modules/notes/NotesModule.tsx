import { useState } from "react";
import { useInternalNotes } from "@/hooks/useInternalNotes";
import { useUsersRealtime } from "@/hooks/useUsersRealtime";
import { DEMO_READ_ONLY_MESSAGE, sendInternalNoteRecord } from "@/services/firebase/adapter";
import { isFirebaseConfigured } from "@/services/firebase/config";
import type { SessionUser } from "@/types";

export function NotesModule({ currentUser }: { currentUser: SessionUser | null }) {
  const { users } = useUsersRealtime();
  const { notes } = useInternalNotes(currentUser?.id ?? null);
  const [toUserId, setToUserId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const isReadOnly = !isFirebaseConfigured;

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
            if (isReadOnly) {
              setStatus(DEMO_READ_ONLY_MESSAGE);
              return;
            }

            if (!currentUser || !toUserId) {
              return;
            }

            const formData = new FormData(event.currentTarget);
            void sendInternalNoteRecord({
              fromUserId: currentUser.id,
              toUserId,
              message: String(formData.get("message") ?? ""),
            })
              .then(() => {
                setStatus("Nota enviada");
                event.currentTarget.reset();
                setToUserId("");
              })
              .catch((cause) => setStatus(cause instanceof Error ? cause.message : "No fue posible enviar la nota."));
          }}
        >
          <select disabled={isReadOnly} value={toUserId} onChange={(event) => setToUserId(event.target.value)}>
            <option value="">Selecciona destinatario</option>
            {users
              .filter((user) => user.id !== currentUser?.id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
          <textarea disabled={isReadOnly} name="message" placeholder="Escribe una nota interna..." required rows={4} />
          <button className="button" disabled={!currentUser || isReadOnly} type="submit">
            {isReadOnly ? "Solo lectura" : "Enviar nota"}
          </button>
        </form>
        {status ? <span className="status-pill">{status}</span> : null}
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Historial</p>
            <h3>Conversacion reactiva</h3>
          </div>
        </div>
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <strong>
                {note.fromUserId} {"->"} {note.toUserId}
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
