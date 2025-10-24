"use client";

import { useState, useEffect } from 'react';

export function useFullscreen() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check for landscape orientation
      if (typeof window !== "undefined") {
        const isLandscapeMode = window.matchMedia("(orientation: landscape)").matches;
        setIsLandscape(isLandscapeMode);
      }
    };

    checkOrientation(); // Initial check

    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  return { isLandscape };
}
