import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { buildUserManagementUrl } from "../../utils/urlBuilder";
import {
  fetchUsers,
  deactivateUser,
} from "../../services/admin/userManagementService";

/**
 * Custom hook for managing users in the admin panel.
 * Handles fetching, searching, filtering, and deactivating users.
 *
 * @returns {Object} State and actions for user management.
 */
export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "/api/admin/manage-users/?ordering=-is_active"
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Build the API URL based on current filters and search
    const url = buildUserManagementUrl(statusFilter, search);
    loadUsers(url);
  }, [statusFilter, search]);

  /**
   * Loads users from the API and updates state.
   * @param {string} url - The API endpoint to fetch users from.
   */
  const loadUsers = (url) => {
    if (!url) return;
    setLoading(true);
    fetchUsers(url)
      .then((res) => {
        setUsers(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  /**
   * Deactivates a user and refreshes the user list.
   * @param {Object} user - The user object to deactivate.
   * @param {Function} onSuccess - Optional callback on success.
   */
  const deactivate = (user, onSuccess) => {
    deactivateUser(user.id)
      .then(() => {
        toast.success(`User ${user.username} deactivated.`);
        loadUsers(currentUrl);
        if (onSuccess) onSuccess();
      })
      .catch(() => toast.error("Failed to deactivate user."));
  };

  return {
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
  };
}
