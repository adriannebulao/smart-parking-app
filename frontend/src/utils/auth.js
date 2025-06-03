import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export function getCurrentUser() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
