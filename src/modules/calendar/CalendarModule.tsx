import { useMemo, useState } from "react";
import { addMonths, format, getYear, isSameMonth, subMonths } from "date-fns";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import type { Course } from "@/types";
import { buildMonthGrid, findEventForDate, formatCalendarTitle, toIsoDate } from "@/utils/calendar";

const FALLBACK_ACTIVITY_DAYS = [3, 4, 12, 25];

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
  const { events } = useCalendarEvents(course.id);
  const monthDays = useMemo(() => buildMonthGrid(referenceDate), [referenceDate]);

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
          const useFallbackActivity = isSameMonth(day, referenceDate) && getYear(referenceDate) === 2026 && referenceDate.getMonth() === 1;
          const hasActivity = Boolean(event) || (useFallbackActivity && FALLBACK_ACTIVITY_DAYS.includes(day.getDate()));

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
    </article>
  );
}
