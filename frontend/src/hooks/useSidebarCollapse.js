import { useState, useEffect } from "react";

export default function useSidebarCollapse(key) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(isCollapsed));
  }, [isCollapsed, key]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return { isCollapsed, toggleCollapse };
}
