import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

/**
 * Retrieves the current user by decoding the JWT access token from localStorage.
 * @returns {Object|null} Decoded user object or null if not authenticated/invalid token.
 */
export function getCurrentUser() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
