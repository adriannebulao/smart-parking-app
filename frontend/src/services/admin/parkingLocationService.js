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
 * Creates a new parking location.
 * @param {Object} data - Parking location data.
 * @returns {Promise} Axios response promise.
 */
export const createParkingLocation = (data) =>
  api.post("/api/parking_locations/", data);

/**
 * Updates an existing parking location.
 * @param {number|string} id - Parking location ID.
 * @param {Object} data - Updated data.
 * @returns {Promise} Axios response promise.
 */
export const updateParkingLocation = (id, data) =>
  api.put(`/api/parking_locations/${id}/`, data);

/**
 * Deletes a parking location.
 * @param {number|string} id - Parking location ID.
 * @returns {Promise} Axios response promise.
 */
export const deleteParkingLocation = (id) =>
  api.delete(`/api/parking_locations/${id}/`);
