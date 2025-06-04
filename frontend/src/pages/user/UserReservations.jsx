import { useEffect, useState } from "react";
import api from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { XCircle } from "lucide-react";
import Modal from "../../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/reservations/");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let initialUrl = "/api/reservations/";

    if (statusFilter === "all") {
      initialUrl += search
        ? `?search=${encodeURIComponent(search)}&ordering=is_cancelled`
        : "?ordering=is_cancelled";
    } else {
      initialUrl += `?status=${encodeURIComponent(statusFilter)}`;
      if (search) initialUrl += `&search=${encodeURIComponent(search)}`;
    }

    fetchReservations(initialUrl);
  }, [statusFilter, search]);

  const getStatus = (resv) => {
    if (resv.is_cancelled) return "cancelled";

    const now = new Date();
    const startTime = new Date(resv.start_time);
    const endTime = new Date(resv.end_time);

    if (endTime < now) return "completed";
    if (startTime <= now && now <= endTime) return "active";
    if (startTime > now) return "upcoming";

    return "inactive";
  };

  const sortReservations = (list) => {
    if (statusFilter !== "all") return list;

    const order = ["active", "upcoming", "inactive", "cancelled"];

    return [...list].sort((a, b) => {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      return order.indexOf(statusA) - order.indexOf(statusB);
    });
  };

  const fetchReservations = (url = "/api/reservations/") => {
    setLoading(true);

    if (statusFilter === "all" && !url.includes("ordering=")) {
      url += url.includes("?")
        ? "&ordering=is_cancelled"
        : "?ordering=is_cancelled";
    }

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

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);

    let query = "/api/reservations/";

    if (status === "all") {
      query += search
        ? `?search=${encodeURIComponent(search)}&ordering=is_cancelled`
        : "?ordering=is_cancelled";
    } else {
      query += `?status=${encodeURIComponent(status)}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
    }

    fetchReservations(query);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    let query = "/api/reservations/";

    if (statusFilter === "all") {
      query += searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}&ordering=is_cancelled`
        : "?ordering=is_cancelled";
    } else {
      query += `?status=${encodeURIComponent(statusFilter)}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
    }

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
    <UserLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">My Reservations</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by location"
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
              const status = getStatus(resv);

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
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    {status === "cancelled" && (
                      <span className="px-3 py-1 rounded text-sm font-semibold bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    )}

                    {status === "completed" && (
                      <span className="px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}

                    {status === "active" && (
                      <span className="px-3 py-1 rounded text-sm font-semibold bg-blue-100 text-blue-800">
                        Active
                      </span>
                    )}

                    {status === "upcoming" && (
                      <span className="px-3 py-1 rounded text-sm font-semibold bg-yellow-100 text-yellow-800">
                        Upcoming
                      </span>
                    )}

                    {!resv.is_cancelled &&
                      status !== "completed" &&
                      status !== "active" && (
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
    </UserLayout>
  );
}

export default UserReservations;
