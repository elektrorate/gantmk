import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe as AuthUnsubscribe,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { addDays, formatISO } from "date-fns";
import { auth, db, firebaseApp, isFirebaseConfigured } from "@/services/firebase/config";
import type {
  AppUser,
  CalendarEventInput,
  Course,
  CourseCalendarEvent,
  CourseInput,
  InternalNote,
  InternalNoteInput,
  SessionUser,
  UserInput,
} from "@/types";

export const DEMO_READ_ONLY_MESSAGE = "Modo demo activo: la aplicacion es solo lectura hasta configurar Firebase.";

function getConfiguredAuth() {
  if (!auth) {
    throw new Error("Firebase Auth no esta configurado.");
  }

  return auth;
}

function getConfiguredDb() {
  if (!db) {
    throw new Error("Firestore no esta configurado.");
  }

  return db;
}

function getConfiguredApp() {
  if (!firebaseApp) {
    throw new Error("Firebase App no esta configurado.");
  }

  return firebaseApp;
}

function isoNow() {
  return formatISO(new Date());
}

const demoUsers: AppUser[] = [
  {
    id: "demo-admin",
    name: "Olivia Admin",
    email: "admin@appgant.local",
    role: "admin",
    createdAt: isoNow(),
  },
  {
    id: "demo-editor",
    name: "Diego Editor",
    email: "editor@appgant.local",
    role: "editor",
    createdAt: isoNow(),
  },
];

const demoCourses: Course[] = [
  {
    id: "course-modelado-iniciacion",
    nombreCurso: "Curso de Iniciacion de Modelado",
    fechaInicio: formatISO(new Date(), { representation: "date" }),
    fechaFin: formatISO(addDays(new Date(), 27), { representation: "date" }),
    objetivoTotalAlumnos: 64,
    objetivoSemanal: [14, 14, 18, 18],
    presupuestoTotal: 300,
    presupuestoSemanal: [60, 60, 90, 90],
    alumnosRealesSemanal: [14, 14, 14, 0],
    gastoRealSemanal: [18, 28, 128, 0],
    createdAt: isoNow(),
    updatedAt: isoNow(),
    createdBy: "demo-admin",
  },
  {
    id: "course-ceramica-iniciacion",
    nombreCurso: "Curso de Iniciacion de Ceramica",
    fechaInicio: formatISO(addDays(new Date(), 2), { representation: "date" }),
    fechaFin: formatISO(addDays(new Date(), 29), { representation: "date" }),
    objetivoTotalAlumnos: 52,
    objetivoSemanal: [12, 12, 14, 14],
    presupuestoTotal: 260,
    presupuestoSemanal: [55, 55, 75, 75],
    alumnosRealesSemanal: [10, 12, 9, 0],
    gastoRealSemanal: [20, 34, 76, 0],
    createdAt: isoNow(),
    updatedAt: isoNow(),
    createdBy: "demo-admin",
  },
  {
    id: "course-torno-iniciacion",
    nombreCurso: "Curso de Iniciacion al Torno",
    fechaInicio: formatISO(addDays(new Date(), 4), { representation: "date" }),
    fechaFin: formatISO(addDays(new Date(), 31), { representation: "date" }),
    objetivoTotalAlumnos: 48,
    objetivoSemanal: [10, 12, 12, 14],
    presupuestoTotal: 240,
    presupuestoSemanal: [50, 50, 65, 75],
    alumnosRealesSemanal: [8, 11, 10, 0],
    gastoRealSemanal: [16, 29, 58, 0],
    createdAt: isoNow(),
    updatedAt: isoNow(),
    createdBy: "demo-editor",
  },
  {
    id: "course-modelado-especializacion",
    nombreCurso: "Especializacion en Modelado Editorial",
    fechaInicio: formatISO(addDays(new Date(), 1), { representation: "date" }),
    fechaFin: formatISO(addDays(new Date(), 28), { representation: "date" }),
    objetivoTotalAlumnos: 36,
    objetivoSemanal: [8, 8, 10, 10],
    presupuestoTotal: 420,
    presupuestoSemanal: [90, 90, 120, 120],
    alumnosRealesSemanal: [7, 8, 6, 0],
    gastoRealSemanal: [34, 62, 118, 0],
    createdAt: isoNow(),
    updatedAt: isoNow(),
    createdBy: "demo-admin",
  },
  {
    id: "course-escultura-especializacion",
    nombreCurso: "Especializacion en Escultura Ceramica",
    fechaInicio: formatISO(addDays(new Date(), 5), { representation: "date" }),
    fechaFin: formatISO(addDays(new Date(), 32), { representation: "date" }),
    objetivoTotalAlumnos: 32,
    objetivoSemanal: [7, 7, 9, 9],
    presupuestoTotal: 390,
    presupuestoSemanal: [80, 80, 115, 115],
    alumnosRealesSemanal: [6, 7, 7, 0],
    gastoRealSemanal: [31, 57, 102, 0],
    createdAt: isoNow(),
    updatedAt: isoNow(),
    createdBy: "demo-editor",
  },
  {
    id: "course-esmaltes-especializacion",
    nombreCurso: "Especializacion en Esmaltes y Acabados",
    fechaInicio: formatISO(addDays(new Date(), 7), { representation: "date" }),
    fechaFin: formatISO(addDays(new Date(), 34), { representation: "date" }),
    objetivoTotalAlumnos: 28,
    objetivoSemanal: [6, 6, 8, 8],
    presupuestoTotal: 360,
    presupuestoSemanal: [75, 75, 105, 105],
    alumnosRealesSemanal: [5, 6, 6, 0],
    gastoRealSemanal: [28, 49, 97, 0],
    createdAt: isoNow(),
    updatedAt: isoNow(),
    createdBy: "demo-admin",
  },
];

const demoEvents: CourseCalendarEvent[] = [
  {
    id: "event-1",
    courseId: "course-modelado-iniciacion",
    date: formatISO(new Date(), { representation: "date" }),
    consultas: 12,
    alumnosCerrados: 3,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  },
  {
    id: "event-2",
    courseId: "course-ceramica-iniciacion",
    date: formatISO(addDays(new Date(), 2), { representation: "date" }),
    consultas: 9,
    alumnosCerrados: 2,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  },
  {
    id: "event-3",
    courseId: "course-modelado-especializacion",
    date: formatISO(addDays(new Date(), 4), { representation: "date" }),
    consultas: 7,
    alumnosCerrados: 1,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  },
  {
    id: "event-4",
    courseId: "course-esmaltes-especializacion",
    date: formatISO(addDays(new Date(), 6), { representation: "date" }),
    consultas: 11,
    alumnosCerrados: 2,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  },
];

const demoNotes: InternalNote[] = [
  {
    id: "note-1",
    fromUserId: "demo-admin",
    toUserId: "demo-editor",
    message: "Revisa el gasto de la semana 3 y ajusta creatividad.",
    createdAt: isoNow(),
    read: false,
  },
];

let demoSession: SessionUser | null = {
  id: "demo-admin",
  name: "Olivia Admin",
  email: "admin@appgant.local",
  role: "admin",
};

const userListeners = new Set<(users: AppUser[]) => void>();
const courseListeners = new Set<(courses: Course[]) => void>();
const eventListeners = new Set<(events: CourseCalendarEvent[]) => void>();
const noteListeners = new Set<(notes: InternalNote[]) => void>();
const authListeners = new Set<(user: SessionUser | null) => void>();

function assertWritableDataSource() {
  if (!isFirebaseConfigured) {
    throw new Error(DEMO_READ_ONLY_MESSAGE);
  }
}

function emitAuth() {
  authListeners.forEach((listener) => listener(demoSession));
}

function mapSessionUser(user: AppUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function observeAuthState(callback: (user: SessionUser | null) => void) {
  if (isFirebaseConfigured) {
    const configuredAuth = getConfiguredAuth();
    const unsubscribe: AuthUnsubscribe = onAuthStateChanged(configuredAuth, (user) => {
      if (!user) {
        callback(null);
        return;
      }

      callback({
        id: user.uid,
        name: user.displayName ?? user.email ?? "Usuario",
        email: user.email ?? "",
        role: "admin",
      });
    });

    return unsubscribe;
  }

  authListeners.add(callback);
  callback(demoSession);
  return () => authListeners.delete(callback);
}

export async function signInUser(email: string, password: string) {
  if (isFirebaseConfigured) {
    await signInWithEmailAndPassword(getConfiguredAuth(), email, password);
    return;
  }

  const existingUser = demoUsers.find((user) => user.email === email);
  demoSession = existingUser
    ? mapSessionUser(existingUser)
    : {
        id: "demo-admin",
        name: "Olivia Admin",
        email: "admin@appgant.local",
        role: "admin",
      };
  emitAuth();
}

export async function signOutUser() {
  if (isFirebaseConfigured) {
    await signOut(getConfiguredAuth());
    return;
  }

  demoSession = null;
  emitAuth();
}

export function subscribeToUsers(callback: (users: AppUser[]) => void) {
  if (isFirebaseConfigured) {
    const configuredDb = getConfiguredDb();
    return onSnapshot(query(collection(configuredDb, "users"), orderBy("createdAt", "desc")), (snapshot) => {
      callback(snapshot.docs.map((docItem) => docItem.data() as AppUser));
    });
  }

  userListeners.add(callback);
  callback([...demoUsers]);
  return () => userListeners.delete(callback);
}

export async function createUserRecord(input: UserInput & { password?: string }) {
  assertWritableDataSource();
  const configuredDb = getConfiguredDb();
  const id = doc(collection(configuredDb, "users")).id;
  const createdAt = isoNow();
  const userRecord: AppUser = { id, name: input.name, email: input.email, role: input.role, createdAt };

  if (input.password) {
    const secondaryConfig = getConfiguredApp().options;
    const { deleteApp, initializeApp: initSecondary, getApps: getSecondaryApps } = await import("firebase/app");
    const secondaryApp =
      getSecondaryApps().find((app) => app.name === "secondary-user-provisioning") ??
      initSecondary(secondaryConfig, "secondary-user-provisioning");
    const { getAuth: getSecondaryAuth } = await import("firebase/auth");
    const secondaryAuth = getSecondaryAuth(secondaryApp);
    await createUserWithEmailAndPassword(secondaryAuth, input.email, input.password);
    await deleteApp(secondaryApp);
  }

  await setDoc(doc(configuredDb, "users", id), userRecord);
}

export async function deleteUserRecord(userId: string) {
  assertWritableDataSource();
  await deleteDoc(doc(getConfiguredDb(), "users", userId));
}

export function subscribeToCourses(callback: (courses: Course[]) => void) {
  if (isFirebaseConfigured) {
    const configuredDb = getConfiguredDb();
    return onSnapshot(query(collection(configuredDb, "courses"), orderBy("createdAt", "desc")), (snapshot) => {
      callback(snapshot.docs.map((docItem) => docItem.data() as Course));
    });
  }

  courseListeners.add(callback);
  callback([...demoCourses]);
  return () => courseListeners.delete(callback);
}

export function subscribeToCourse(courseId: string, callback: (course: Course | null) => void) {
  if (isFirebaseConfigured) {
    const configuredDb = getConfiguredDb();
    const unsubscribe: Unsubscribe = onSnapshot(doc(configuredDb, "courses", courseId), (snapshot) => {
      callback(snapshot.exists() ? (snapshot.data() as Course) : null);
    });

    return unsubscribe;
  }

  const emit = () => callback(demoCourses.find((course) => course.id === courseId) ?? null);
  const listener = () => emit();
  courseListeners.add(listener);
  emit();
  return () => courseListeners.delete(listener);
}

export async function createCourseRecord(input: CourseInput) {
  assertWritableDataSource();
  const configuredDb = getConfiguredDb();
  const id = doc(collection(configuredDb, "courses")).id;
  const timestamp = isoNow();
  const course: Course = {
    ...input,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await setDoc(doc(configuredDb, "courses", id), course);
}

export async function updateCourseRecord(courseId: string, input: CourseInput) {
  const timestamp = isoNow();
  assertWritableDataSource();
  await updateDoc(doc(getConfiguredDb(), "courses", courseId), {
    ...input,
    updatedAt: timestamp,
  });
}

export async function deleteCourseRecord(courseId: string) {
  assertWritableDataSource();
  await deleteDoc(doc(getConfiguredDb(), "courses", courseId));
}

export function subscribeToCalendarEvents(courseId: string, callback: (events: CourseCalendarEvent[]) => void) {
  if (isFirebaseConfigured) {
    const configuredDb = getConfiguredDb();
    return onSnapshot(
      query(collection(configuredDb, "courseCalendarEvents"), where("courseId", "==", courseId), orderBy("date", "asc")),
      (snapshot) => {
        callback(snapshot.docs.map((docItem) => docItem.data() as CourseCalendarEvent));
      },
    );
  }

  const emit = () => callback(demoEvents.filter((event) => event.courseId === courseId));
  const listener = () => emit();
  eventListeners.add(listener);
  emit();
  return () => eventListeners.delete(listener);
}

export async function upsertCalendarEventRecord(input: CalendarEventInput) {
  assertWritableDataSource();
  const eventDocId = `${input.courseId}_${input.date}`;
  const configuredDb = getConfiguredDb();
  const timestamp = isoNow();

  const existingSnapshot = await getDoc(doc(configuredDb, "courseCalendarEvents", eventDocId));
  const existingRecord = existingSnapshot.exists() ? (existingSnapshot.data() as CourseCalendarEvent) : null;

  await setDoc(
    doc(configuredDb, "courseCalendarEvents", eventDocId),
    {
      id: eventDocId,
      ...input,
      createdAt: existingRecord?.createdAt ?? timestamp,
      updatedAt: timestamp,
    },
    { merge: true },
  );
}

export function subscribeToInternalNotes(userId: string, callback: (notes: InternalNote[]) => void) {
  if (isFirebaseConfigured) {
    const configuredDb = getConfiguredDb();
    let sentNotes: InternalNote[] = [];
    let receivedNotes: InternalNote[] = [];

    const publish = () => {
      const merged = [...sentNotes, ...receivedNotes];
      const unique = Array.from(new Map(merged.map((note) => [note.id, note])).values());
      unique.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      callback(unique);
    };

    const unsubscribeSent = onSnapshot(
      query(collection(configuredDb, "internalNotes"), where("fromUserId", "==", userId), orderBy("createdAt", "desc")),
      (snapshot) => {
        sentNotes = snapshot.docs.map((docItem) => docItem.data() as InternalNote);
        publish();
      },
    );

    const unsubscribeReceived = onSnapshot(
      query(collection(configuredDb, "internalNotes"), where("toUserId", "==", userId), orderBy("createdAt", "desc")),
      (snapshot) => {
        receivedNotes = snapshot.docs.map((docItem) => docItem.data() as InternalNote);
        publish();
      },
    );

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }

  const emit = () => {
    callback(demoNotes.filter((note) => note.fromUserId === userId || note.toUserId === userId));
  };
  const listener = () => emit();
  noteListeners.add(listener);
  emit();
  return () => noteListeners.delete(listener);
}

export async function sendInternalNoteRecord(input: InternalNoteInput) {
  assertWritableDataSource();
  const configuredDb = getConfiguredDb();
  const id = doc(collection(configuredDb, "internalNotes")).id;
  const note: InternalNote = {
    id,
    ...input,
    createdAt: isoNow(),
    read: false,
  };

  await setDoc(doc(configuredDb, "internalNotes", id), note);
}

export function getDemoCoursesSnapshot() {
  return [...demoCourses];
}

export async function seedDemoDataToFirebase() {
  if (!isFirebaseConfigured) {
    throw new Error("Cannot seed data: Firebase is not configured.");
  }

  const configuredDb = getConfiguredDb();

  // Seed Users
  for (const user of demoUsers) {
    await setDoc(doc(configuredDb, "users", user.id), user, { merge: true });
  }

  // Seed Courses
  for (const course of demoCourses) {
    await setDoc(doc(configuredDb, "courses", course.id), course, { merge: true });
  }

  // Seed Events
  for (const event of demoEvents) {
    await setDoc(doc(configuredDb, "courseCalendarEvents", event.id), event, { merge: true });
  }

  // Seed Notes
  for (const note of demoNotes) {
    await setDoc(doc(configuredDb, "internalNotes", note.id), note, { merge: true });
  }
}
