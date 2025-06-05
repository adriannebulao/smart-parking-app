import api from "../api";

/**
 * Fetches parking locations with optional search query.
 * @param {string} url - The base URL for the request.
 * @param {string} search - Optional search term to filter locations.
 * @returns {Promise} Axios response promise.
 */
export const fetchParkingLocations = (url, search = "") => {
  let fullUrl = url;
  if (search) {
    fullUrl += fullUrl.includes("?")
      ? `&search=${encodeURIComponent(search)}`
      : `?search=${encodeURIComponent(search)}`;
  }
  return api.get(fullUrl);
};

/**
 * Makes a reservation for a parking location.
 * @param {Object} payload - Reservation data.
 * @returns {Promise} Axios response promise.
 */
export const makeReservation = (payload) => {
  return api.post("/api/reservations/", payload);
};
