import { NotesModule } from "@/modules/notes/NotesModule";
import { useAuth } from "@/hooks/useAuth";

export function NotesPage() {
  const { user } = useAuth();

  return <NotesModule currentUser={user} />;
}
