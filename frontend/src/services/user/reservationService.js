import api from "../api";

export async function fetchReservationsApi(url) {
  return api.get(url);
}

export async function cancelReservationApi(reservationId) {
  return api.post(`/api/reservations/${reservationId}/cancel/`);
}
