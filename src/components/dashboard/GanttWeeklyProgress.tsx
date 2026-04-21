import clsx from "clsx";
import type { GanttWeeklyProgressProps, WeekStatus } from "@/types";

function getSegmentClass(status: WeekStatus, variant: "students" | "budget") {
  if (status === "pending") {
    return "mobile-gantt__segment is-pending";
  }

  return variant === "budget" ? "mobile-gantt__segment is-budget" : "mobile-gantt__segment is-students";
}

export function GanttWeeklyProgress({ weeks, leftMetric, rightMetric, variant = "students" }: GanttWeeklyProgressProps) {
  return (
    <article className={variant === "budget" ? "mobile-gantt is-budget" : "mobile-gantt"}>
      <div className="mobile-gantt__timeline">
        <div className="mobile-gantt__baseline" />

        <div className="mobile-gantt__labels">
          {weeks.map((week) => (
            <div key={week.label} className="mobile-gantt__label-item">
              <span className="mobile-gantt__dot" />
              <span className="mobile-gantt__stem" />
              <strong>{week.label}</strong>
            </div>
          ))}
        </div>

        <div className="mobile-gantt__segments">
          {weeks.map((week) => (
            <div
              key={week.label}
              className={clsx(getSegmentClass(week.status, variant), week.status === "current" && "is-current", "mobile-gantt__segment")}
            >
              {week.value}
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-gantt__metrics">
        <div className="mobile-gantt__metric mobile-gantt__metric--primary">
          <strong>{leftMetric.value}</strong>
          <span>{leftMetric.label}</span>
        </div>
        <div className="mobile-gantt__metric mobile-gantt__metric--secondary">
          <strong>{rightMetric.value}</strong>
          <span>{rightMetric.label}</span>
        </div>
      </div>
    </article>
  );
}
