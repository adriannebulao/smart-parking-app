import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN } from "../constants";
import { ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        const decoded = jwtDecode(res.data.access);
        setIsAuthorized(
          allowedRoles.length === 0 || allowedRoles.includes(decoded.role)
        );
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(
          allowedRoles.length === 0 || allowedRoles.includes(decoded.role)
        );
      }
    } catch {
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  if (isAuthorized) return children;

  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "admin") {
        return <Navigate to="/admin" />;
      } else if (decoded.role === "user") {
        return <Navigate to="/" />;
      }
    } catch {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
    }
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
