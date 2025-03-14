"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Gets the current media query media query match on initial
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Create listener function
    const listener = () => {
      setMatches(media.matches);
    };

    // Add listener
    media.addEventListener("change", listener);

    // Clean up
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [matches, query]);

  return matches;
}
