import api from "../api";

export const getUsers = (url) => {
  return api.get(url);
};

export const deactivateUser = (userId) => {
  return api.post(`/api/admin/manage-users/${userId}/deactivate/`);
};
