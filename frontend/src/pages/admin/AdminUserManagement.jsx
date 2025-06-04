import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ConfirmDeactivateModal from "../../components/admin/ConfirmDeactivateModal";
import UserCard from "../../components/admin/UserCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buildUserManagementUrl } from "../../utils/urlBuilder";

import {
  getUsers,
  deactivateUser,
} from "../../services/admin/userManagementService";

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "/api/admin/manage-users/?ordering=-is_active"
  );
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = buildUserManagementUrl(statusFilter, search);
    fetchUsers(url);
  }, [statusFilter, search]);

  const fetchUsers = (url) => {
    setLoading(true);
    getUsers(url)
      .then((res) => {
        setUsers(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  const handleDeactivate = () => {
    if (!confirmDeactivate) return;

    deactivateUser(confirmDeactivate.id)
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
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by username or name"
              className="border px-3 py-2 rounded-md w-full sm:w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border px-3 py-2 rounded-md w-full sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="flex flex-col flex-grow space-y-2 overflow-auto">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDeactivate={setConfirmDeactivate}
              />
            ))}

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

        {/* Modal */}
        <ConfirmDeactivateModal
          user={confirmDeactivate}
          isOpen={!!confirmDeactivate}
          onClose={() => setConfirmDeactivate(null)}
          onConfirm={handleDeactivate}
        />

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminUserManagement;
