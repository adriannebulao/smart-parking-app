import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import UserCard from "../../components/admin/UserCard";
import { ToastContainer } from "react-toastify";

import SearchInput from "../../components/SearchInput";
import PaginationControls from "../../components/PaginationControls";
import UserStatusFilter from "../../components/admin/UserStatusFilter";
import LoadingScreen from "../../components/LoadingScreen";

import { useUserManagement } from "../../hooks/admin/useUserManagement";

function AdminUserManagement() {
  const {
    users,
    loading,
    nextUrl,
    prevUrl,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    fetchUsers,
    deactivate,
  } = useUserManagement();

  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  const handleDeactivate = () => {
    if (!confirmDeactivate) return;

    deactivate(confirmDeactivate, () => setConfirmDeactivate(null));
  };

  return (
    <AdminLayout>
      <div className="p-4 flex flex-col">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <UserStatusFilter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingScreen />
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

            <PaginationControls
              onPrev={() => fetchUsers(prevUrl)}
              onNext={() => fetchUsers(nextUrl)}
              hasPrev={!!prevUrl}
              hasNext={!!nextUrl}
              loading={loading}
            />
          </div>
        )}

        {/* Modal */}
        <ConfirmActionModal
          isOpen={!!confirmDeactivate}
          onClose={() => setConfirmDeactivate(null)}
          onConfirm={handleDeactivate}
          title="Confirm Deactivation"
          message={
            confirmDeactivate
              ? `Are you sure you want to deactivate user ${confirmDeactivate.username} (${confirmDeactivate.first_name} ${confirmDeactivate.last_name})?`
              : ""
          }
          confirmText="Confirm Deactivate"
        />

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}

export default AdminUserManagement;
