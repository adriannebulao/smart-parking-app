import api from "../api";

/**
 * Fetches a list of users.
 * @param {string} url - API endpoint for fetching users.
 * @returns {Promise<Object>} Users data.
 */
export const fetchUsers = (url) => {
  return api.get(url);
};

/**
 * Deactivates a user by ID.
 * @param {number|string} userId - The user's ID.
 * @returns {Promise<Object>} Deactivation response.
 */
export const deactivateUser = (userId) => {
  return api.post(`/api/admin/manage-users/${userId}/deactivate/`);
};
