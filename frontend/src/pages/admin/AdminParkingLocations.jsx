import react, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";

import SearchInput from "../../components/SearchInput";
import ParkingLocationCard from "../../components/admin/ParkingLocationCard";
import ParkingLocationModal from "../../components/admin/ParkingLocationModal";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import PaginationControls from "../../components/PaginationControls";

import { useParkingLocations } from "../../hooks/admin/useParkingLocations";

function AdminParkingLocations() {
  const {
    locations,
    loading,
    nextUrl,
    prevUrl,
    search,
    setSearch,
    fetchLocations,
    create,
    update,
    remove,
  } = useParkingLocations();

  const [createForm, setCreateForm] = useState({ name: "", slots: "" });
  const [editForm, setEditForm] = useState({ name: "", slots: "" });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleCreate = () => {
    create(createForm, () => {
      setCreating(false);
    });
  };

  const handleEdit = () => {
    if (!editing) return;
    update(editing.id, editForm, () => {
      setEditing(null);
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    remove(confirmDelete.id, () => {
      setConfirmDelete(null);
    });
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

        <ConfirmActionModal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete "${confirmDelete?.name}"?`}
          confirmText="Delete"
        />

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminParkingLocations;
