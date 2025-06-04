import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReservationCard from "../../components/ReservationCard";
import { buildReservationUrl } from "../../utils/urlBuilder";
import {
  sortReservations,
  getStatus,
  formatDateTime,
} from "../../utils/reservationUtils";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/reservations/");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReservations(buildReservationUrl(statusFilter, search));
  }, [statusFilter, search]);

  const fetchReservations = (url) => {
    setLoading(true);
    api
      .get(url)
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

  const handleCancel = () => {
    if (!confirmCancel) return;
    api
      .post(`/api/reservations/${confirmCancel.id}/cancel/`)
      .then(() => {
        toast.success("Reservation cancelled.");
        fetchReservations(currentUrl);
        setConfirmCancel(null);
      })
      .catch(() => toast.error("Failed to cancel reservation."));
  };

  return (
    <AdminLayout>
      <div className="p-4 h-screen flex flex-col">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Reservations</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by username or location"
              className="border px-3 py-2 rounded-md w-full sm:w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border px-3 py-2 rounded-md w-full sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <p>Loading...</p>
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {reservations.map((resv) => (
              <ReservationCard
                key={resv.id}
                resv={resv}
                onCancel={setConfirmCancel}
              />
            ))}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => fetchReservations(prevUrl)}
                disabled={!prevUrl || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchReservations(nextUrl)}
                disabled={!nextUrl || loading}
                className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {confirmCancel && (
          <Modal
            isOpen={!!confirmCancel}
            onClose={() => setConfirmCancel(null)}
            footer={
              <>
                <button
                  onClick={() => setConfirmCancel(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm Cancel
                </button>
              </>
            }
          >
            <h2 className="text-lg font-bold mb-4">Confirm Cancellation</h2>
            <p>
              Are you sure you want to cancel the reservation at{" "}
              <strong>{confirmCancel.parking_location_name}</strong> for user{" "}
              <strong>{confirmCancel.user_username}</strong> starting at{" "}
              <strong>{formatDateTime(confirmCancel.start_time)}</strong>?
            </p>
          </Modal>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminReservations;
