export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getDaysDiff(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function formatPeriodLabel(period, groupBy) {
  if (!period) return "";

  if (groupBy === "day") {
    return formatDate(period);
  }

  if (groupBy === "week") {
    const [year, weekStr] = period.split("-W");
    if (!year || !weekStr) return period;
    return `Week ${parseInt(weekStr, 10)}, ${year}`;
  }

  if (groupBy === "month") {
    const [year, month] = period.split("-");
    if (!year || !month) return period;
    const date = new Date(Number(year), Number(month) - 1);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  }

  return period;
}
