import { ChartColumn, MapPin, CalendarCheck, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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
  return (
    <div
      className={`
        fixed md:static top-0 left-0 h-full w-60 bg-background z-20 shadow-md border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <div className="mt-4 space-y-2">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            to={path}
            key={name}
            onClick={onClose}
            className={
              "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition hover:bg-gray-200"
            }
          >
            <Icon size={20} className="min-w-[20px]" />
            <span>{name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
