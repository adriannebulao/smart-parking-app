import { useEffect, useState } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import { Pencil, Trash } from "lucide-react";

function AdminParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");

  const fetchLocations = (url) => {
    if (!url) return;
    setLoading(true);
    api
      .get(url)
      .then((response) => {
        setLocations(response.data.results);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);
        setCurrentUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching parking locations:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLocations(currentUrl);
  }, []);

  return (
    <AdminLayout>
      <div className="p-4 h-screen flex flex-col">
        <h1 className="text-xl font-bold mb-4 flex-shrink-0">
          Parking Locations
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow border"
              >
                <span className="font-semibold text-base">{loc.name}</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {loc.available_slots} / {loc.slots} slots
                </span>
                <div className="flex gap-2">
                  <button className="text-black hover:text-gray-700">
                    <Pencil size={20} />
                  </button>
                  <button className="text-black hover:text-gray-700">
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => fetchLocations(prevUrl)}
                disabled={!prevUrl || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchLocations(nextUrl)}
                disabled={!nextUrl || loading}
                className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminParkingLocations;
