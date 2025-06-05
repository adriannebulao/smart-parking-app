import api from "../api";

/**
 * Fetches the current user's profile.
 * @returns {Promise<Object>} User profile data.
 */
export const fetchUserProfile = () => {
  return api.get("/api/users/profile/");
};

/**
 * Updates the current user's profile.
 * @param {Object} data - Profile fields to update.
 * @returns {Promise<Object>} Updated profile data.
 */
export const updateUserProfile = (data) => {
  return api.patch("/api/users/profile/", data);
};
