import { useEffect, useState } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import { XCircle } from "lucide-react";
import Modal from "../../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/reservations/");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const sortReservations = (list) => {
    if (statusFilter !== "all") return list;

    const order = ["active", "upcoming", "inactive", "cancelled"];

    const getStatus = (resv) => {
      if (resv.is_cancelled) return "cancelled";
      if (resv.is_active) return "active";

      const now = new Date();
      const startTime = new Date(resv.start_time);
      if (startTime > now) return "upcoming";

      return "inactive";
    };

    return [...list].sort((a, b) => {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      return order.indexOf(statusA) - order.indexOf(statusB);
    });
  };

  const fetchReservations = (url = "/api/reservations/") => {
    setLoading(true);
    api
      .get(url)
      .then((res) => {
        const sorted = sortReservations(res.data.results);
        setReservations(sorted);
        setCurrentUrl(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
      })
      .catch(() => toast.error("Failed to fetch reservations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations(currentUrl);
  }, []);

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    const query =
      status === "all"
        ? `/api/reservations/?search=${search}`
        : `/api/reservations/?status=${status}&search=${search}`;
    fetchReservations(query);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    const query =
      statusFilter === "all"
        ? `/api/reservations/?search=${searchTerm}`
        : `/api/reservations/?status=${statusFilter}&search=${searchTerm}`;
    fetchReservations(query);
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

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Reservations</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by username or location"
              className="border px-3 py-2 rounded-md w-full sm:w-72"
              value={search}
              onChange={handleSearchChange}
            />
            <select
              className="border px-3 py-2 rounded-md w-full sm:w-48"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {reservations.map((resv) => {
              const status = resv.is_cancelled ? "Cancelled" : null;

              return (
                <div
                  key={resv.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow border"
                >
                  <div className="flex-grow min-w-0 space-y-1">
                    <p className="font-semibold text-base truncate">
                      {resv.parking_location_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Start: {formatDateTime(resv.start_time)}
                    </p>
                    <p className="text-sm text-gray-600">
                      End: {formatDateTime(resv.end_time)}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      User: {resv.user_username}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    {status === "Cancelled" && (
                      <span className="px-3 py-1 rounded text-sm font-semibold bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    )}

                    {!resv.is_cancelled && (
                      <button
                        onClick={() => setConfirmCancel(resv)}
                        title="Cancel Reservation"
                        className="flex items-center gap-1 text-black hover:text-gray-700"
                      >
                        <XCircle size={20} />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

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
