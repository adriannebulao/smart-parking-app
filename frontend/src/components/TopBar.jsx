import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import whiteLogo from "../assets/white_logo.svg";
import { getCurrentUser } from "../utils/auth";
import "../styles/index.css";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = getCurrentUser();
  const username = user?.username || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full bg-primary shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src={whiteLogo} alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-semibold text-background">
          DAVPARK ADMIN
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1 text-background hover:text-secondary focus:outline-none"
        >
          <span className="font-medium">{username}</span>
          <ChevronDown size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
