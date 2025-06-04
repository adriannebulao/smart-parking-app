import AdminLayout from "../../layouts/AdminLayout";
import ReservationCard from "../../components/ReservationCard";
import SearchInput from "../../components/SearchInput";
import ReservationStatusFilter from "../../components/ReservationStatusFilter";
import PaginationControls from "../../components/PaginationControls";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import { ToastContainer } from "react-toastify";
import { formatDateTime } from "../../utils/reservationUtils";
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
    confirmCancel,
    setConfirmCancel,
    fetchReservations,
    cancel,
  } = useReservations();

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
                onCancel={() => setConfirmCancel(resv)}
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
        <ConfirmActionModal
          isOpen={!!confirmCancel}
          onClose={() => setConfirmCancel(null)}
          onConfirm={() => cancel(confirmCancel)}
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

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminReservations;
