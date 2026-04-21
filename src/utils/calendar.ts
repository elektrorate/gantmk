import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import type { CourseCalendarEvent } from "@/types";

export function buildMonthGrid(referenceDate: Date) {
  const start = startOfWeek(startOfMonth(referenceDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(referenceDate), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

export function formatCalendarTitle(referenceDate: Date) {
  return format(referenceDate, "MMMM yyyy");
}

export function findEventForDate(events: CourseCalendarEvent[], date: Date) {
  return events.find((event) => isSameDay(new Date(event.date), date));
}

export function toIsoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
