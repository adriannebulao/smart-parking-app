import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import { Search, Pencil, Trash, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", slots: "" });
  const [editForm, setEditForm] = useState({ name: "", slots: "" });
  const [search, setSearch] = useState("");

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

  const handleCreate = () => {
    api
      .post("/api/parking_locations/", createForm)
      .then(() => {
        toast.success("Parking location created!");
        fetchLocations(currentUrl, search);
        setCreating(false);
      })
      .catch(() => toast.error("Failed to create."));
  };

  const handleEdit = () => {
    api
      .put(`/api/parking_locations/${editing.id}/`, editForm)
      .then(() => {
        toast.success("Parking location updated!");
        fetchLocations(currentUrl, search);
        setEditing(null);
      })
      .catch(() => toast.error("Failed to update."));
  };

  const handleDelete = () => {
    api
      .delete(`/api/parking_locations/${confirmDelete.id}/`)
      .then(() => {
        toast.success("Parking location deleted.");
        fetchLocations(currentUrl, search);
        setConfirmDelete(null);
      })
      .catch(() => toast.error("Failed to delete."));
  };

  return (
    <AdminLayout>
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

          <button
            onClick={() => {
              setCreating(true);
              setCreateForm({ name: "", slots: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark whitespace-nowrap"
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
              <div
                key={loc.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex-grow min-w-0">
                  <span className="font-semibold text-base truncate">
                    {loc.name}
                  </span>
                </div>

                <div className="flex items-center gap-150 flex-shrink-0">
                  <div className="text-center text-sm text-gray-600 whitespace-nowrap max-w-[6rem]">
                    {loc.available_slots} / {loc.slots} slots
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(loc);
                        setEditForm({ name: loc.name, slots: loc.slots });
                      }}
                      className="text-black hover:text-gray-700"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(loc)}
                      className="text-black hover:text-gray-700"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
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

        {/* Edit Modal */}
        {editing && (
          <Modal
            isOpen={!!editing}
            onClose={() => setEditing(null)}
            footer={
              <>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            }
          >
            <h2 className="text-lg font-bold mb-4">Edit Location</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Slots"
                value={editForm.slots}
                onChange={(e) =>
                  setEditForm({ ...editForm, slots: Number(e.target.value) })
                }
                className="w-full border rounded p-2"
              />
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <Modal
            isOpen={!!confirmDelete}
            onClose={() => setConfirmDelete(null)}
            footer={
              <>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            }
          >
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete "{confirmDelete.name}"?</p>
          </Modal>
        )}

        {/* Create Modal */}
        {creating && (
          <Modal
            isOpen={!!creating}
            onClose={() => setCreating(false)}
            footer={
              <>
                <button
                  onClick={() => setCreating(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create
                </button>
              </>
            }
          >
            <h2 className="text-lg font-bold mb-4">New Parking Location</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Slots"
                value={createForm.slots}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    slots: Number(e.target.value),
                  })
                }
                className="w-full border rounded p-2"
              />
            </div>
          </Modal>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
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

export default AdminParkingLocations;
