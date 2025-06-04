import api from "../api";

export const getReservations = (url) => {
  return api.get(url);
};

export const cancelReservation = (reservationId) => {
  return api.post(`/api/reservations/${reservationId}/cancel/`);
};
