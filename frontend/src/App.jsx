import react, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLogin from "./pages/user/UserLogin";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminParkingLocations from "./pages/admin/AdminParkingLocations";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import UserParkingLocations from "./pages/user/UserParkingLocations";
import UserReservations from "./pages/user/UserReservations";
import UserProfile from "./pages/user/UserProfile";

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/user/parking-locations"
          element={
            <ProtectedRoute
              allowedRoles={["user"]}
              key={"user-parking-locations"}
            >
              <UserParkingLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/reservations"
          element={
            <ProtectedRoute allowedRoles={["user"]} key={"user-reservations"}>
              <UserReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]} key={"user-profile"}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} key={"admin"}>
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
              <AdminParkingLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute allowedRoles={["admin"]} key={"admin-reservations"}>
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
