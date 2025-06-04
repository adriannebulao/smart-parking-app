import AdminLayout from "../../layouts/AdminLayout";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import ReservationCard from "../../components/ReservationCard";
import { formatDateTime } from "../../utils/reservationUtils";
import { ToastContainer } from "react-toastify";
import SearchInput from "../../components/SearchInput";
import PaginationControls from "../../components/PaginationControls";
import ReservationStatusFilter from "../../components/ReservationStatusFilter";
import { useReservations } from "../../hooks/admin/useReservations";

function AdminReservations() {
  const {
    reservations,
    loading,
    nextUrl,
    prevUrl,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    fetchReservations,
    cancel,
  } = useReservations();

  const [confirmCancel, setConfirmCancel] = useState(null);

  const handleCancel = () => {
    if (!confirmCancel) return;
    cancel(confirmCancel, () => setConfirmCancel(null));
  };

  return (
    <AdminLayout>
      <div className="p-4 h-screen flex flex-col">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Reservations</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ReservationStatusFilter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
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

            <PaginationControls
              onPrev={() => fetchReservations(prevUrl)}
              onNext={() => fetchReservations(nextUrl)}
              hasPrev={!!prevUrl}
              hasNext={!!nextUrl}
              loading={loading}
            />
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {confirmCancel && (
          <ConfirmActionModal
            isOpen={!!confirmCancel}
            onClose={() => setConfirmCancel(null)}
            onConfirm={handleCancel}
            title="Confirm Cancellation"
            message={
              confirmCancel
                ? `Are you sure you want to cancel the reservation at ${
                    confirmCancel.parking_location_name
                  } for user ${
                    confirmCancel.user_username
                  } starting at ${formatDateTime(confirmCancel.start_time)}?`
                : ""
            }
            confirmText="Confirm Cancel"
          />
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminReservations;
