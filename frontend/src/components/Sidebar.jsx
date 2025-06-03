import { Home, MapPin, CalendarCheck, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", icon: Home, path: "/admin" },
  { name: "Parking Locations", icon: MapPin, path: "/admin/parking-locations" },
  { name: "Reservations", icon: CalendarCheck, path: "/admin/reservations" },
  { name: "User Management", icon: Users, path: "/admin/user-management" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-full w-60 bg-background shadow-md border-r border-gray-200 flex flex-col justify-between transition-all duration-300">
      <div className="mt-4 space-y-2">
        {navItems.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              to={path}
              key={name}
              className={
                "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition " +
                (isActive
                  ? "border-l-4 bg-primary text-background hover:bg-primary/80"
                  : "hover:bg-gray-200")
              }
            >
              <Icon size={20} className="min-w-[20px]" />
              <span className="text-nowrap">{name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
