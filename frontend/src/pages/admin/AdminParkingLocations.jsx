import react, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchInput from "../../components/SearchInput";
import ParkingLocationCard from "../../components/admin/ParkingLocationCard";
import ParkingLocationModal from "../../components/admin/ParkingLocationModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import PaginationControls from "../../components/PaginationControls";

import {
  getParkingLocations,
  createParkingLocation,
  updateParkingLocation,
  deleteParkingLocation,
} from "../../services/admin/parkingLocationService";

function AdminParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");
  const [search, setSearch] = useState("");
  const [createForm, setCreateForm] = useState({ name: "", slots: "" });
  const [editForm, setEditForm] = useState({ name: "", slots: "" });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchLocations = (url, searchTerm = "") => {
    setLoading(true);
    getParkingLocations(url, searchTerm)
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
    debounce((value) => fetchLocations("/api/parking_locations/", value), 400),
    []
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search]);

  const handleCreate = () => {
    createParkingLocation(createForm)
      .then(() => {
        toast.success("Created!");
        fetchLocations(currentUrl, search);
        setCreating(false);
      })
      .catch(() => toast.error("Create failed."));
  };

  const handleEdit = () => {
    updateParkingLocation(editing.id, editForm)
      .then(() => {
        toast.success("Updated!");
        fetchLocations(currentUrl, search);
        setEditing(null);
      })
      .catch(() => toast.error("Update failed."));
  };

  const handleDelete = () => {
    deleteParkingLocation(confirmDelete.id)
      .then(() => {
        toast.success("Deleted!");
        fetchLocations(currentUrl, search);
        setConfirmDelete(null);
      })
      .catch(() => toast.error("Delete failed."));
  };

  return (
    <AdminLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-xl font-bold">Parking Locations</h1>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            onClick={() => {
              setCreating(true);
              setCreateForm({ name: "", slots: "" });
            }}
          >
            <Plus size={16} />
            New Parking Location
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {locations.map((loc) => (
              <ParkingLocationCard
                key={loc.id}
                loc={loc}
                onEdit={() => {
                  setEditing(loc);
                  setEditForm({ name: loc.name, slots: loc.slots });
                }}
                onDelete={() => setConfirmDelete(loc)}
              />
            ))}

            <PaginationControls
              onPrev={() => fetchLocations(prevUrl, search)}
              onNext={() => fetchLocations(nextUrl, search)}
              hasPrev={!!prevUrl}
              hasNext={!!nextUrl}
              loading={loading}
            />
          </div>
        )}

        <ParkingLocationModal
          isOpen={creating}
          title="New Parking Location"
          form={createForm}
          onChange={setCreateForm}
          onClose={() => setCreating(false)}
          onSubmit={handleCreate}
          isEdit={false}
        />

        <ParkingLocationModal
          isOpen={!!editing}
          title="Edit Parking Location"
          form={editForm}
          onChange={setEditForm}
          onClose={() => setEditing(null)}
          onSubmit={handleEdit}
          isEdit={true}
        />

        <ConfirmDeleteModal
          isOpen={!!confirmDelete}
          name={confirmDelete?.name}
          onClose={() => setConfirmDelete(null)}
          onDelete={handleDelete}
        />

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminParkingLocations;
