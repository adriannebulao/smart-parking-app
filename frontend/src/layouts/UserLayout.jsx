import { useState } from "react";
import UserSidebar from "../components/user/UserSidebar";
import TopBar from "../components/TopBar";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export default function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const username = token ? jwtDecode(token).username : "User";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        onMenuToggle={toggleSidebar}
        isSidebarOpen={sidebarOpen}
        username={username}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <UserSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

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
