import { useEffect, useState } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import { XCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/Modal";

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/admin/manage-users/");
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchUsers = (url = "/api/admin/manage-users/") => {
    setLoading(true);
    api
      .get(url)
      .then((res) => {
        setUsers(res.data.results);
        setCurrentUrl(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
      })
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(currentUrl);
  }, []);

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);

    let query = `/api/admin/manage-users/?search=${encodeURIComponent(search)}`;

    if (status === "active") {
      query += `&is_active=true`;
    } else if (status === "deactivated") {
      query += `&is_active=false`;
    }

    fetchUsers(query);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    let query = `/api/admin/manage-users/?search=${encodeURIComponent(
      searchTerm
    )}`;

    if (statusFilter === "active") {
      query += `&is_active=true`;
    } else if (statusFilter === "deactivated") {
      query += `&is_active=false`;
    }

    fetchUsers(query);
  };

  const handleDeactivate = () => {
    if (!confirmDeactivate) return;

    api
      .post(`/api/admin/manage-users/${confirmDeactivate.id}/deactivate/`)
      .then(() => {
        toast.success(`User ${confirmDeactivate.username} deactivated.`);
        fetchUsers(currentUrl);
        setConfirmDeactivate(null);
      })
      .catch(() => toast.error("Failed to deactivate user."));
  };

  return (
    <AdminLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by username or name"
              className="border px-3 py-2 rounded-md w-full sm:w-72"
              value={search}
              onChange={handleSearchChange}
            />
            <select
              className="border px-3 py-2 rounded-md w-full sm:w-48"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {users.map((user) => {
              const status = user.is_active ? "Active" : "Deactivated";

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow border"
                >
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-lg truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      @{user.username}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status}
                    </span>

                    {user.is_active && (
                      <button
                        onClick={() => setConfirmDeactivate(user)}
                        title="Deactivate User"
                        className="flex items-center gap-1 text-black hover:text-gray-700"
                      >
                        <XCircle size={20} />
                        <span>Deactivate</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => fetchUsers(prevUrl)}
                disabled={!prevUrl || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchUsers(nextUrl)}
                disabled={!nextUrl || loading}
                className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {confirmDeactivate && (
          <Modal
            isOpen={!!confirmDeactivate}
            onClose={() => setConfirmDeactivate(null)}
            footer={
              <>
                <button
                  onClick={() => setConfirmDeactivate(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm Deactivate
                </button>
              </>
            }
          >
            <h2 className="text-lg font-bold mb-4">Confirm Deactivation</h2>
            <p>
              Are you sure you want to deactivate user{" "}
              <strong>{confirmDeactivate.username}</strong> (
              {confirmDeactivate.first_name} {confirmDeactivate.last_name})?
            </p>
          </Modal>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminUserManagement;
