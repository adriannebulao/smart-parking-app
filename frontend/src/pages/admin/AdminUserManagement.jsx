import { useState, useRef } from "react";
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
    loadUsers,
    deactivate,
  } = useUserManagement();

  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const mainContentRef = useRef(null);

  const handleDeactivate = () => {
    if (!confirmDeactivate) return;

    deactivate(confirmDeactivate, () => setConfirmDeactivate(null));
  };

  return (
    <AdminLayout>
      <div ref={mainContentRef} className="p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">Users</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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

        {/* Content Section */}
        {loading ? (
          <LoadingScreen />
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
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
              onPrev={() => {
                loadUsers(prevUrl);
                mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              onNext={() => {
                loadUsers(nextUrl);
                mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
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
