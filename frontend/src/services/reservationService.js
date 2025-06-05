import api from "./api";

/**
 * Fetches reservations from the given API endpoint.
 * @param {string} url - The API endpoint to fetch reservations from.
 * @returns {Promise<Object>} Reservations data.
 */
export const fetchReservations = (url) => {
  return api.get(url);
};

/**
 * Cancels a reservation by its ID.
 * Sends a POST request to the cancel endpoint for the reservation.
 * @param {number|string} reservationId - The ID of the reservation to cancel.
 * @returns {Promise<Object>} Cancellation response.
 */
export const cancelReservation = (reservationId) => {
  return api.post(`/api/reservations/${reservationId}/cancel/`);
};
