"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the current viewport is mobile
 * @param breakpoint The width threshold to consider as mobile (default: 768px)
 * @returns Boolean indicating if the viewport is mobile
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < breakpoint);

    // Update on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
