import AdminSidebar from "../components/admin/AdminSidebar";
import TopBar from "../components/TopBar";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export default function AdminLayout({ children }) {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const username = token ? jwtDecode(token).username : "Admin";

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
