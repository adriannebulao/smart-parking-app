import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  fetchReservationsApi,
  cancelReservationApi,
} from "../../services/user/reservationService";

import { sortReservations, getStatus } from "../../utils/reservationUtils";
import { buildReservationUrl } from "../../utils/urlBuilder";

export default function useUserReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/reservations/");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = buildReservationUrl(statusFilter, search);
    fetchReservations(url);
  }, [statusFilter, search]);

  const fetchReservations = async (url = "/api/reservations/") => {
    setLoading(true);
    try {
      const res = await fetchReservationsApi(url);
      const sorted = sortReservations(
        res.data.results,
        getStatus,
        statusFilter
      );
      setReservations(sorted);
      setCurrentUrl(url);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);
    } catch {
      toast.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirmCancel) return;
    try {
      await cancelReservationApi(confirmCancel.id);
      toast.success("Reservation cancelled.");
      fetchReservations(currentUrl);
      setConfirmCancel(null);
    } catch {
      toast.error("Failed to cancel reservation.");
    }
  };

  return {
    reservations,
    loading,
    nextUrl,
    prevUrl,
    statusFilter,
    search,
    confirmCancel,
    setConfirmCancel,
    setStatusFilter,
    setSearch,
    fetchReservations,
    handleCancel,
  };
}
