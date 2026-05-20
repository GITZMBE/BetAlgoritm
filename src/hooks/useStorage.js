import { useState } from "react";

/**
 * Like useState but syncs to localStorage.
 * @param {string} key          - localStorage key
 * @param {*}      defaultValue - initial value if key not set
 */
export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = (newValue) => {
    setValue(newValue);
    try {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch {
      // storage quota exceeded or private browsing
    }
  };

  return [value, set];
}
