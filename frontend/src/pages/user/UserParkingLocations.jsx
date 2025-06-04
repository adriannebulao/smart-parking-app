import { useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import { CalendarCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

import ReserveModal from "../../components/user/ReserveModal";
import SearchInput from "../../components/SearchInput";
import PaginationControls from "../../components/PaginationControls";

import { useParkingLocations } from "../../hooks/user/useParkingLocations";
import { useReservation } from "../../hooks/user/useReservation";

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
    useReservation();

  return (
    <UserLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0 gap-4">
          <h1 className="text-xl font-bold whitespace-nowrap">
            Parking Locations
          </h1>

          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex-grow min-w-0">
                  <span className="font-semibold text-base truncate">
                    {loc.name}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    {loc.available_slots} / {loc.slots} slots
                  </div>
                </div>

                <button
                  onClick={() => setReservingLocation(loc)}
                  className="text-black hover:text-gray-700 flex items-center gap-1"
                >
                  <CalendarCheck size={20} />
                  Reserve
                </button>
              </div>
            ))}

            <PaginationControls
              onPrev={goPrev}
              onNext={goNext}
              hasPrev={!!prevUrl}
              hasNext={!!nextUrl}
              loading={loading}
            />
          </div>
        )}

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
