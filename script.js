const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const activityDays = {
  "2026-2": [3, 4, 12, 25],
  "2026-1": [7, 10, 18],
  "2026-3": [2, 11, 19, 24],
};

const calendarState = {
  year: 2026,
  month: 1,
  selectedDay: 19,
};

const calendarTitle = document.getElementById("calendarTitle");
const calendarWeekdays = document.getElementById("calendarWeekdays");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const filterToggle = document.getElementById("filterToggle");
const filterMenu = document.getElementById("filterMenu");
const navItems = document.querySelectorAll(".nav-item");

calendarWeekdays.innerHTML = weekdays.map((day) => `<span>${day}</span>`).join("");

function renderCalendar() {
  const firstDay = new Date(calendarState.year, calendarState.month, 1);
  const monthLabel = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const lastDayOfMonth = new Date(calendarState.year, calendarState.month + 1, 0).getDate();
  const mondayAlignedStart = (firstDay.getDay() + 6) % 7;
  const previousMonthLastDay = new Date(calendarState.year, calendarState.month, 0).getDate();
  const activityKey = `${calendarState.year}-${calendarState.month + 1}`;
  const activeDates = activityDays[activityKey] || [];

  calendarTitle.textContent = monthLabel;

  const cells = [];

  for (let i = mondayAlignedStart - 1; i >= 0; i -= 1) {
    cells.push({
      day: previousMonthLastDay - i,
      muted: true,
      selected: false,
      activity: false,
    });
  }

  for (let day = 1; day <= lastDayOfMonth; day += 1) {
    cells.push({
      day,
      muted: false,
      selected: day === calendarState.selectedDay,
      activity: activeDates.includes(day),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      day: cells.length - (mondayAlignedStart + lastDayOfMonth) + 1,
      muted: true,
      selected: false,
      activity: false,
    });
  }

  calendarGrid.innerHTML = cells
    .map(({ day, muted, selected, activity }) => {
      const classes = [
        "calendar-day",
        muted ? "is-muted" : "",
        activity ? "has-activity" : "",
        selected ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const interactive = muted ? "disabled" : "";
      const dataset = muted ? "" : `data-day="${day}"`;

      return `<button class="${classes}" ${interactive} ${dataset}>${day}</button>`;
    })
    .join("");
}

function shiftMonth(delta) {
  const nextDate = new Date(calendarState.year, calendarState.month + delta, 1);
  calendarState.year = nextDate.getFullYear();
  calendarState.month = nextDate.getMonth();
  const daysInMonth = new Date(calendarState.year, calendarState.month + 1, 0).getDate();
  calendarState.selectedDay = Math.min(calendarState.selectedDay, daysInMonth);
  renderCalendar();
}

prevMonth.addEventListener("click", () => shiftMonth(-1));
nextMonth.addEventListener("click", () => shiftMonth(1));

calendarGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button) {
    return;
  }

  calendarState.selectedDay = Number(button.dataset.day);
  renderCalendar();
});

filterToggle.addEventListener("click", () => {
  const expanded = filterToggle.getAttribute("aria-expanded") === "true";
  filterToggle.setAttribute("aria-expanded", String(!expanded));
  filterMenu.classList.toggle("is-open", !expanded);
});

filterMenu.addEventListener("click", (event) => {
  const option = event.target.closest(".dropdown-option");
  if (!option) {
    return;
  }

  document.querySelectorAll(".dropdown-option").forEach((item) => {
    item.classList.remove("is-selected");
    item.setAttribute("aria-selected", "false");
  });

  option.classList.add("is-selected");
  option.setAttribute("aria-selected", "true");
  filterToggle.querySelector("span").textContent = option.textContent;
  filterToggle.setAttribute("aria-expanded", "false");
  filterMenu.classList.remove("is-open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown-wrap")) {
    filterToggle.setAttribute("aria-expanded", "false");
    filterMenu.classList.remove("is-open");
  }
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((button) => button.classList.remove("is-active"));
    item.classList.add("is-active");
  });
});

renderCalendar();
