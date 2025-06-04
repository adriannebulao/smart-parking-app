import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { buildUserManagementUrl } from "../../utils/urlBuilder";
import {
  getUsers,
  deactivateUser,
} from "../../services/admin/userManagementService";

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
    const url = buildUserManagementUrl(statusFilter, search);
    fetchUsers(url);
  }, [statusFilter, search]);

  const fetchUsers = (url) => {
    if (!url) return;
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

  const deactivate = (user, onSuccess) => {
    deactivateUser(user.id)
      .then(() => {
        toast.success(`User ${user.username} deactivated.`);
        fetchUsers(currentUrl);
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
    fetchUsers,
    deactivate,
  };
}
