import { useEffect, useState, useCallback } from "react";
import UserLayout from "../../layouts/UserLayout";
import { Search, CalendarCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReserveModal from "../../components/user/ReserveModal";
import {
  fetchParkingLocations,
  makeReservation,
} from "../../services/user/reservationService";
import { debounce } from "../../utils/debounce";

function UserParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");
  const [search, setSearch] = useState("");
  const [reservingLocation, setReservingLocation] = useState(null);

  const fetchAndSetLocations = (url, term = "") => {
    setLoading(true);
    fetchParkingLocations(url, term)
      .then((res) => {
        setLocations(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(() => toast.error("Failed to fetch locations."))
      .finally(() => setLoading(false));
  };

  const debouncedFetch = useCallback(
    debounce((value) => {
      fetchAndSetLocations("/api/parking_locations/", value);
    }, 400),
    []
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleReservationSubmit = (form) => {
    if (!form.start_time || !form.end_time) {
      toast.error("Please fill both start and end time.");
      return;
    }

    const now = new Date();
    const start = new Date(form.start_time);
    const end = new Date(form.end_time);

    if (start < now) return toast.error("Start time cannot be in the past.");
    if (end <= start) return toast.error("End time must be after start time.");

    const body = {
      parking_location: reservingLocation.id,
      start_time: form.start_time,
      end_time: form.end_time,
    };

    makeReservation(body)
      .then(() => {
        toast.success("Reservation successful!");
        setReservingLocation(null);
      })
      .catch(() => toast.error("Failed to make reservation."));
  };

  return (
    <UserLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0 gap-4">
          <h1 className="text-xl font-bold whitespace-nowrap">
            Parking Locations
          </h1>
          <div className="relative flex items-center flex-grow max-w-xs">
            <Search className="absolute left-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 border rounded w-full"
            />
          </div>
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

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => fetchAndSetLocations(prevUrl, search)}
                disabled={!prevUrl || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchAndSetLocations(nextUrl, search)}
                disabled={!nextUrl || loading}
                className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
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
