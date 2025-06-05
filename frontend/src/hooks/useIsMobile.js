import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the viewport is considered mobile.
 * @param {number} breakpoint - The pixel width below which is considered mobile.
 * @returns {boolean} True if the viewport is mobile-sized.
 */
export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    /**
     * Updates the isMobile state on window resize.
     */
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}
