import { useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import ReservationCard from "../../components/ReservationCard";
import { formatDateTime } from "../../utils/reservationUtils";
import { ToastContainer } from "react-toastify";
import SearchInput from "../../components/SearchInput";
import PaginationControls from "../../components/PaginationControls";
import ReservationStatusFilter from "../../components/ReservationStatusFilter";
import { useReservations } from "../../hooks/useReservations";
import LoadingScreen from "../../components/LoadingScreen";

function UserReservations() {
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

  const handleCancel = async () => {
    if (!confirmCancel) return;
    try {
      await cancel(confirmCancel);
    } finally {
      setConfirmCancel(null);
    }
  };

  return (
    <UserLayout>
      <div className="p-4 flex flex-col h-full">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">My Reservations</h2>
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
          <div className="flex items-center justify-center flex-grow">
            <p className="text-gray-500">No reservations found.</p>
          </div>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {reservations.map((resv) => (
              <ReservationCard
                key={resv.id}
                resv={resv}
                onCancel={setConfirmCancel}
                showUser={false}
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
          onConfirm={handleCancel}
          title="Confirm Cancellation"
          message={
            confirmCancel
              ? `Are you sure you want to cancel your reservation at ${
                  confirmCancel.parking_location_name
                } starting at ${formatDateTime(confirmCancel.start_time)}?`
              : ""
          }
          confirmText="Confirm Cancel"
        />

        <ToastContainer />
      </div>
    </UserLayout>
  );
}

export default UserReservations;
