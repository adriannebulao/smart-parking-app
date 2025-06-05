/**
 * Validates reservation start and end times.
 * @param {string} start_time - ISO string for start time.
 * @param {string} end_time - ISO string for end time.
 * @returns {string|null} Error message or null if valid.
 */
export const validateReservationTimes = (start_time, end_time) => {
  if (!start_time || !end_time) return "Please fill both start and end time.";

  const now = new Date();
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (start < now) return "Start time cannot be in the past.";
  if (end <= start) return "End time must be after start time.";

  return null;
};

/**
 * Returns valid groupBy options based on the selected range.
 * @param {string} groupedRange - The selected range ("week", "month", "year").
 * @returns {string[]} Array of valid groupBy options.
 */
export const getValidGroupByOptions = (groupedRange) => {
  switch (groupedRange) {
    case "week":
      return ["day"];
    case "month":
      return ["day", "week"];
    case "year":
      return ["day", "week", "month"];
    default:
      return [];
  }
};
