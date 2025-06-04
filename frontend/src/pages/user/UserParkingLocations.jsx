import { useRef } from "react";
import UserLayout from "../../layouts/UserLayout";
import { CalendarCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

import ReserveModal from "../../components/user/ReserveModal";
import SearchInput from "../../components/SearchInput";
import PaginationControls from "../../components/PaginationControls";
import LoadingScreen from "../../components/LoadingScreen";

import { useParkingLocations } from "../../hooks/user/useParkingLocations";
import { useReservationForm } from "../../hooks/user/useReservationForm";

function UserParkingLocations() {
  const {
    locations,
    loading,
    nextUrl,
    prevUrl,
    search,
    setSearch,
    goNext,
    goPrev,
  } = useParkingLocations();

  const { reservingLocation, setReservingLocation, handleReservationSubmit } =
    useReservationForm();

  const mainContentRef = useRef(null);

  return (
    <UserLayout>
      <div ref={mainContentRef} className="p-4 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h1 className="text-xl font-bold">Parking Locations</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-grow overflow-auto space-y-2">
          {loading ? (
            <LoadingScreen />
          ) : (
            locations.map((loc) => (
              <div
                key={loc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg shadow border gap-2"
              >
                <div className="flex-grow min-w-0">
                  <span className="font-semibold text-base block truncate">
                    {loc.name}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    {loc.available_slots} / {loc.slots} slots
                  </div>
                </div>

                <button
                  onClick={() => setReservingLocation(loc)}
                  className="text-black hover:text-gray-700 flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <CalendarCheck size={20} />
                  Reserve
                </button>
              </div>
            ))
          )}
          <PaginationControls
            onPrev={() => {
              goPrev;
              mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            onNext={() => {
              goNext;
              mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            hasPrev={!!prevUrl}
            hasNext={!!nextUrl}
            loading={loading}
          />
        </div>

        <ReserveModal
          isOpen={!!reservingLocation}
          location={reservingLocation}
          onClose={() => setReservingLocation(null)}
          onConfirm={handleReservationSubmit}
        />

        <ToastContainer />
      </div>
    </UserLayout>
  );
}

export default UserParkingLocations;
