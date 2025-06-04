import api from "../api";

export const fetchParkingLocations = (url, searchTerm = "") => {
  let fullUrl = url;
  if (searchTerm) {
    fullUrl += fullUrl.includes("?")
      ? `&search=${encodeURIComponent(searchTerm)}`
      : `?search=${encodeURIComponent(searchTerm)}`;
  }

  return api.get(fullUrl);
};

export const makeReservation = (payload) => {
  return api.post("/api/reservations/", payload);
};
