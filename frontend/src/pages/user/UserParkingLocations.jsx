import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import UserLayout from "../../layouts/UserLayout";
import { Search, CalendarCheck, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");
  const [search, setSearch] = useState("");
  const [reservingLocation, setReservingLocation] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    start_time: "",
    end_time: "",
  });

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchLocations = (url, searchTerm = "") => {
    if (!url) return;
    setLoading(true);

    let fullUrl = url;
    if (searchTerm) {
      fullUrl += fullUrl.includes("?")
        ? `&search=${encodeURIComponent(searchTerm)}`
        : `?search=${encodeURIComponent(searchTerm)}`;
    }

    api
      .get(fullUrl)
      .then((res) => {
        setLocations(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const debouncedFetch = useCallback(
    debounce((value) => {
      fetchLocations("/api/parking_locations/", value);
    }, 400),
    []
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleReserve = () => {
    if (!reservationForm.start_time || !reservationForm.end_time) {
      toast.error("Please fill both start and end time.");
      return;
    }

    const now = new Date();
    const start = new Date(reservationForm.start_time);
    const end = new Date(reservationForm.end_time);

    if (start < now) {
      toast.error("Start time cannot be in the past.");
      return;
    }
    if (end <= start) {
      toast.error("End time must be after start time.");
      return;
    }

    const requestBody = {
      parking_location: reservingLocation.id,
      start_time: reservationForm.start_time,
      end_time: reservationForm.end_time,
    };

    api
      .post("/api/reservations/", requestBody)
      .then(() => {
        toast.success("Reservation successful!");
        setReservingLocation(null);
        setReservationForm({ start_time: "", end_time: "" });
      })
      .catch(() => {
        toast.error("Failed to make reservation.");
      });
  };

  const getNowISOString = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
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

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setReservingLocation(loc);
                      setReservationForm({ start_time: "", end_time: "" });
                    }}
                    className="text-black hover:text-gray-700 flex items-center gap-1"
                  >
                    <CalendarCheck size={20} />
                    Reserve
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => fetchLocations(prevUrl, search)}
                disabled={!prevUrl || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchLocations(nextUrl, search)}
                disabled={!nextUrl || loading}
                className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {reservingLocation && (
          <Modal
            isOpen={!!reservingLocation}
            onClose={() => setReservingLocation(null)}
            footer={
              <>
                <button
                  onClick={() => setReservingLocation(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserve}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Reserve
                </button>
              </>
            }
          >
            <h2 className="text-lg font-bold mb-4">
              Reserve Parking: {reservingLocation.name}
            </h2>
            <div className="space-y-3">
              <label className="block">
                Start Time:
                <input
                  type="datetime-local"
                  value={reservationForm.start_time}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (new Date(value) < new Date()) return;
                    setReservationForm({
                      ...reservationForm,
                      start_time: value,
                      end_time:
                        reservationForm.end_time &&
                        new Date(reservationForm.end_time) <= new Date(value)
                          ? ""
                          : reservationForm.end_time,
                    });
                  }}
                  className="w-full border rounded p-2 mt-1"
                  min={getNowISOString()}
                />
              </label>
              <label className="block">
                End Time:
                <input
                  type="datetime-local"
                  value={reservationForm.end_time}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      reservationForm.start_time &&
                      new Date(value) <= new Date(reservationForm.start_time)
                    )
                      return;
                    setReservationForm({ ...reservationForm, end_time: value });
                  }}
                  className="w-full border rounded p-2 mt-1"
                  min={reservationForm.start_time || getNowISOString()}
                />
              </label>
            </div>
          </Modal>
        )}

        <ToastContainer />
      </div>
    </UserLayout>
  );
}

function Modal({ isOpen, onClose, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div>{children}</div>

        <div className="flex justify-end gap-2 mt-6">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserParkingLocations;
