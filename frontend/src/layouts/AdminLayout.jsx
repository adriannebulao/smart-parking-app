import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import TopBar from "../components/TopBar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen">
      <TopBar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-40 z-10 md:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
