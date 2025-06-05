/**
 * Determines the status of a reservation.
 * @param {Object} resv - Reservation object.
 * @returns {string} Reservation status ("cancelled", "completed", "active", "upcoming", "inactive").
 */
export const getStatus = (resv) => {
  if (resv.is_cancelled) return "cancelled";

  const now = new Date();
  const startTime = new Date(resv.start_time);
  const endTime = new Date(resv.end_time);

  if (endTime < now) return "completed";
  if (startTime <= now && now <= endTime) return "active";
  if (startTime > now) return "upcoming";

  return "inactive";
};

/**
 * Formats an ISO date string to a human-readable string.
 * @param {string} isoString - ISO date string.
 * @returns {string} Formatted date and time.
 */
export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Sorts reservations by status for the "all" filter.
 * @param {Array} list - List of reservations.
 * @param {Function} getStatus - Function to get reservation status.
 * @param {string} statusFilter - Current status filter.
 * @returns {Array} Sorted reservations.
 */
export const sortReservations = (list, getStatus, statusFilter) => {
  if (statusFilter !== "all") return list;
  const order = ["active", "upcoming", "inactive", "cancelled"];
  return [...list].sort(
    (a, b) => order.indexOf(getStatus(a)) - order.indexOf(getStatus(b))
  );
};
