import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const auth = () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAuthorized(false);
        setRedirectTo("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isAllowed =
          allowedRoles.length === 0 || allowedRoles.includes(decoded.role);
        setIsAuthorized(isAllowed);

        if (!isAllowed) {
          setRedirectTo(decoded.role === "admin" ? "/admin" : "/");
        }
      } catch {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthorized(false);
        setRedirectTo("/login");
      }
    };

    auth();
  }, [allowedRoles]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthorized) {
    return children;
  }

  return <Navigate to={redirectTo || "/login"} replace />;
}

export default ProtectedRoute;
