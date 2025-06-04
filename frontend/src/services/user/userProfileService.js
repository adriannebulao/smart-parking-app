import api from "../api";

export const fetchUserProfile = () => api.get("/api/users/profile/");
export const updateUserProfile = (data) =>
  api.patch("/api/users/profile/", data);
