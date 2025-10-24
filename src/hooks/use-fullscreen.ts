
"use client";

import { useState, useEffect } from 'react';

export function useFullscreen() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        const isLandscapeMode = window.matchMedia("(orientation: landscape)").matches;
        setIsLandscape(isLandscapeMode);
      }
    };

    checkOrientation();

    const handleResize = () => checkOrientation();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isLandscape };
}
