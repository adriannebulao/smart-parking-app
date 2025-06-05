import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  fetchReservations,
  cancelReservation,
} from "../services/reservationService";
import { buildReservationUrl } from "../utils/urlBuilder";
import { sortReservations, getStatus } from "../utils/reservationUtils";

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/reservations/");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(null);

  useEffect(() => {
    loadReservations(buildReservationUrl(statusFilter, search));
  }, [statusFilter, search]);

  /**
   * Loads reservations from the API and updates state.
   * @param {string} url - The API endpoint to fetch reservations from.
   */
  const loadReservations = (url) => {
    if (!url) return;
    setLoading(true);
    fetchReservations(url)
      .then((res) => {
        const sorted = sortReservations(
          res.data.results,
          getStatus,
          statusFilter
        );
        setReservations(sorted);
        setCurrentUrl(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
      })
      .catch(() => toast.error("Failed to fetch reservations"))
      .finally(() => setLoading(false));
  };

  const cancel = (reservation) => {
    if (!reservation) return;
    cancelReservation(reservation.id)
      .then(() => {
        toast.success("Reservation cancelled.");
        loadReservations(currentUrl);
        setConfirmCancel(null);
      })
      .catch(() => toast.error("Failed to cancel reservation."));
  };

  return {
    reservations,
    loading,
    nextUrl,
    prevUrl,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    confirmCancel,
    setConfirmCancel,
    loadReservations,
    cancel,
  };
}
