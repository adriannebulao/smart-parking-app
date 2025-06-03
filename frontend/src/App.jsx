import react, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/user/UserLogin";
import Register from "./pages/user/Register";
import Home from "./pages/user/Home";
import NotFound from "./pages/user/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminParkingLocations from "./pages/admin/AdminParkingLocations";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import LoadingScreen from "./components/LoadingScreen";

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["user"]} key={"user"}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} key={"admin"}>
              <Suspense fallback={<LoadingScreen />} />
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parking-locations"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
              key={"admin-parking-locations"}
            >
              <Suspense fallback={<LoadingScreen />} />

              <AdminParkingLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute allowedRoles={["admin"]} key={"admin-reservations"}>
              <Suspense fallback={<LoadingScreen />} />

              <AdminReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
              key={"admin-user-management"}
            >
              {" "}
              <Suspense fallback={<LoadingScreen />} />
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
