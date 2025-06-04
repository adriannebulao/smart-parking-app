import api from "./api";

export const getParkingLocations = (url, search = "") => {
  let fullUrl = url;
  if (search) {
    fullUrl += fullUrl.includes("?")
      ? `&search=${encodeURIComponent(search)}`
      : `?search=${encodeURIComponent(search)}`;
  }
  return api.get(fullUrl);
};

export const createParkingLocation = (data) =>
  api.post("/api/parking_locations/", data);

export const updateParkingLocation = (id, data) =>
  api.put(`/api/parking_locations/${id}/`, data);

export const deleteParkingLocation = (id) =>
  api.delete(`/api/parking_locations/${id}/`);
