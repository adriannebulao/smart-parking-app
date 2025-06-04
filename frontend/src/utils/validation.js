export const validateReservationTimes = (start_time, end_time) => {
  if (!start_time || !end_time) return "Please fill both start and end time.";

  const now = new Date();
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (start < now) return "Start time cannot be in the past.";
  if (end <= start) return "End time must be after start time.";

  return null;
};
