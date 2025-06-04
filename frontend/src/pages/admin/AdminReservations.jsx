import AdminLayout from "../../layouts/AdminLayout";
import ReservationCard from "../../components/ReservationCard";
import SearchInput from "../../components/SearchInput";
import ReservationStatusFilter from "../../components/ReservationStatusFilter";
import PaginationControls from "../../components/PaginationControls";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import LoadingScreen from "../../components/LoadingScreen";
import { ToastContainer } from "react-toastify";
import { formatDateTime } from "../../utils/reservationUtils";
import { useReservations } from "../../hooks/useReservations";
import { useRef } from "react";

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

  const mainContentRef = useRef(null);

  return (
    <AdminLayout>
      <div ref={mainContentRef} className="p-4 flex flex-col">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">Reservations</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <SearchInput
              className="w-full sm:w-auto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ReservationStatusFilter
              className="w-full sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <LoadingScreen />
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {reservations.map((resv) => (
              <ReservationCard
                key={resv.id}
                resv={resv}
                onCancel={setConfirmCancel}
                showUser={true}
              />
            ))}

            <PaginationControls
              onPrev={() => {
                fetchReservations(prevUrl);
                mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              onNext={() => {
                fetchReservations(nextUrl);
                mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
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
