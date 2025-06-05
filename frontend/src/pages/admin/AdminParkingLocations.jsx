import react, { useState, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";

import SearchInput from "../../components/SearchInput";
import ParkingLocationCard from "../../components/admin/ParkingLocationCard";
import ParkingLocationModal from "../../components/admin/ParkingLocationModal";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import PaginationControls from "../../components/PaginationControls";
import LoadingScreen from "../../components/LoadingScreen";

import { useParkingLocations } from "../../hooks/admin/useParkingLocations";

function AdminParkingLocations() {
  const {
    locations,
    loading,
    nextUrl,
    prevUrl,
    search,
    setSearch,
    loadParkingLocations,
    create,
    update,
    remove,
  } = useParkingLocations();

  const [createForm, setCreateForm] = useState({ name: "", slots: "" });
  const [editForm, setEditForm] = useState({ name: "", slots: "" });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const mainContentRef = useRef(null);

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
      <div ref={mainContentRef} className="p-4 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h1 className="text-xl font-bold">Parking Locations</h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark w-full sm:w-auto"
              onClick={() => {
                setCreating(true);
                setCreateForm({ name: "", slots: "" });
              }}
            >
              <Plus size={16} />
              New Location
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-auto space-y-2">
          {loading ? (
            <LoadingScreen />
          ) : (
            locations.map((loc) => (
              <ParkingLocationCard
                key={loc.id}
                loc={loc}
                onEdit={() => {
                  setEditing(loc);
                  setEditForm({ name: loc.name, slots: loc.slots });
                }}
                onDelete={() => setConfirmDelete(loc)}
              />
            ))
          )}
          <PaginationControls
            onPrev={() => {
              loadParkingLocations(prevUrl);
              mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            onNext={() => {
              loadParkingLocations(nextUrl);
              mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            hasPrev={!!prevUrl}
            hasNext={!!nextUrl}
            loading={loading}
          />
        </div>
      </div>

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
    </AdminLayout>
  );
}

export default AdminParkingLocations;
