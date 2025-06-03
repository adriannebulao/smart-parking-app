import UserSidebar from "../components/UserSidebar";
import TopBar from "../components/TopBar";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export default function UserLayout({ children }) {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const username = token ? jwtDecode(token).username : "User";

  return (
    <div className="flex flex-col h-screen">
      <TopBar username={username} />
      <div className="flex flex-1 overflow-hidden">
        <UserSidebar />
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
