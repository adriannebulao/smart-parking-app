import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

/**
 * Axios instance configured with base API URL and interceptors for
 * authentication and token refresh logic.
 */
const api = axios.create({
  baseURL: "",
});

/**
 * Request interceptor to attach the access token to outgoing requests.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle 401 errors by attempting token refresh.
 * If refresh fails or no refresh token is present, redirects to login.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt to refresh token if 401 error and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Remove tokens and redirect if refresh fails
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Redirects the user to the appropriate login page based on their role.
 * Defaults to /login if role cannot be determined.
 */
function redirectToLogin() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      window.location.href =
        decoded.role === "admin" ? "/admin/login" : "/login";
      return;
    } catch {
      // If decoding fails, fall through to default login
    }
  }
  window.location.href = "/login";
}

export default api;
