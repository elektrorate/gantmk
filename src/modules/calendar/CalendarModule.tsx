import { useMemo, useState } from "react";
import { addMonths, format, isSameMonth, subMonths } from "date-fns";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { DEMO_READ_ONLY_MESSAGE, upsertCalendarEventRecord } from "@/services/firebase/adapter";
import { isFirebaseConfigured } from "@/services/firebase/config";
import type { Course } from "@/types";
import { buildMonthGrid, findEventForDate, formatCalendarTitle, toIsoDate } from "@/utils/calendar";

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path d="m14.5 5-7 7 7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path d="m9.5 5 7 7-7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function CalendarModule({ course }: { course: Course }) {
  const [referenceDate, setReferenceDate] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 19));
  const [status, setStatus] = useState<string | null>(null);
  const { events, error } = useCalendarEvents(course.id);
  const monthDays = useMemo(() => buildMonthGrid(referenceDate), [referenceDate]);
  const selectedEvent = useMemo(() => findEventForDate(events, selectedDate), [events, selectedDate]);
  const selectedDateIso = toIsoDate(selectedDate);
  const isReadOnly = !isFirebaseConfigured;

  return (
    <article className="mobile-calendar">
      <div className="mobile-calendar__header">
        <button className="mobile-calendar__arrow" onClick={() => setReferenceDate((current) => subMonths(current, 1))} type="button">
          <ChevronLeftIcon />
        </button>
        <h3>{formatCalendarTitle(referenceDate)}</h3>
        <button className="mobile-calendar__arrow" onClick={() => setReferenceDate((current) => addMonths(current, 1))} type="button">
          <ChevronRightIcon />
        </button>
      </div>

      <div className="mobile-calendar__weekdays">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mobile-calendar__grid">
        {monthDays.map((day) => {
          const event = findEventForDate(events, day);
          const isSelected = toIsoDate(day) === toIsoDate(selectedDate);
          const hasActivity = Boolean(event);

          return (
            <button
              key={day.toISOString()}
              className={isSameMonth(day, referenceDate) ? "mobile-calendar__day" : "mobile-calendar__day is-outside"}
              data-selected={isSelected}
              data-has-event={hasActivity}
              onClick={() => setSelectedDate(day)}
              type="button"
            >
              <span>{format(day, "d")}</span>
            </button>
          );
        })}
      </div>

      <form
        key={selectedDateIso}
        className="mobile-calendar__editor"
        onSubmit={(event) => {
          event.preventDefault();
          if (isReadOnly) {
            setStatus(DEMO_READ_ONLY_MESSAGE);
            return;
          }

          const formData = new FormData(event.currentTarget);

          void upsertCalendarEventRecord({
            courseId: course.id,
            date: selectedDateIso,
            consultas: Number(formData.get("consultas") ?? 0),
            alumnosCerrados: Number(formData.get("alumnosCerrados") ?? 0),
          })
            .then(() => setStatus("Actividad guardada"))
            .catch((cause) => setStatus(cause instanceof Error ? cause.message : "No fue posible guardar la actividad."));
        }}
      >
        <div className="mobile-calendar__editor-header">
          <strong>{format(selectedDate, "dd/MM/yyyy")}</strong>
          <span>{status ?? (error ? "Modo fallback / reactivo" : isReadOnly ? DEMO_READ_ONLY_MESSAGE : "Actividad diaria")}</span>
        </div>

        <div className="mobile-calendar__editor-grid">
          <label>
            Consultas
            <input defaultValue={selectedEvent?.consultas ?? 0} disabled={isReadOnly} min={0} name="consultas" type="number" />
          </label>
          <label>
            Alumnos cerrados
            <input defaultValue={selectedEvent?.alumnosCerrados ?? 0} disabled={isReadOnly} min={0} name="alumnosCerrados" type="number" />
          </label>
        </div>

        <button className="button mobile-calendar__save" disabled={isReadOnly} type="submit">
          {isReadOnly ? "Solo lectura" : "Guardar actividad"}
        </button>
      </form>
    </article>
  );
}
