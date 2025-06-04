import {
  ChartColumn,
  MapPin,
  CalendarCheck,
  Users,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import useSidebarCollapse from "../../hooks/useSidebarCollapse";
import useIsMobile from "../../hooks/useIsMobile";

const navItems = [
  { name: "Summary", icon: ChartColumn, path: "/admin" },
  { name: "Parking Locations", icon: MapPin, path: "/admin/parking-locations" },
  { name: "Reservations", icon: CalendarCheck, path: "/admin/reservations" },
  {
    name: "User Management",
    icon: Users,
    path: "/admin/user-management",
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarCollapse(
    "adminSidebarCollapsed"
  );
  const isMobile = useIsMobile();
  const shouldCollapse = !isMobile && isCollapsed;

  return (
    <div
      className={`
        fixed md:static top-0 left-0 h-full bg-background shadow-md border-r border-gray-200
        transform transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${shouldCollapse ? "w-16" : "w-60"}
      `}
      style={{
        zIndex: isMobile ? 50 : 0,
      }}
    >
      <div className="flex-1 mt-4 space-y-2">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            to={path}
            end={path === "/user" || path === "/admin"}
            key={name}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-primary text-background hover:bg-primary/90"
                  : "hover:bg-gray-200"
              }
              ${shouldCollapse ? "justify-center" : ""}`
            }
            title={isCollapsed ? name : ""}
          >
            <Icon size={20} className="min-w-[20px]" />
            {!shouldCollapse && (
              <span className="whitespace-nowrap">{name}</span>
            )}
          </NavLink>
        ))}
      </div>

      <button
        onClick={toggleCollapse}
        className="hidden md:flex items-center justify-center gap-2 mx-4 mb-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {shouldCollapse ? (
          <ChevronsRight size={20} className="min-w-[20px]" />
        ) : (
          <>
            <ChevronsLeft size={20} className="min-w-[20px]" />
            <span>Collapse</span>
          </>
        )}
      </button>
    </div>
  );
}
