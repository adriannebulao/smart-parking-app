import { useState, useEffect } from "react";

/**
 * Custom hook to manage sidebar collapse state with persistence in localStorage.
 * @param {string} key - The localStorage key to use for persistence.
 * @returns {Object} Collapse state and toggle handler.
 */
export default function useSidebarCollapse(key) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(isCollapsed));
  }, [isCollapsed, key]);

  /**
   * Toggles the collapsed state.
   */
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return { isCollapsed, toggleCollapse };
}
