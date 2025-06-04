import UserLayout from "../../layouts/UserLayout";
import Modal from "../../components/Modal";
import ReservationCard from "../../components/ReservationCard";
import SearchInput from "../../components/SearchInput";
import StatusFilter from "../../components/ReservationFilter";
import PaginationControls from "../../components/PaginationControls";
import LoadingScreen from "../../components/LoadingScreen";
import useUserReservations from "../../hooks/user/useUserReservations";
import { formatDateTime } from "../../utils/reservationUtils";
import { ToastContainer } from "react-toastify";

function UserReservations() {
  const {
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
  } = useUserReservations();

  return (
    <UserLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">My Reservations</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <StatusFilter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

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
