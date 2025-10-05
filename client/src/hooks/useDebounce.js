// src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value.
 * @param {any} value The value to debounce (e.g., a search term).
 * @param {number} delay The delay in milliseconds to wait before updating.
 * @returns {any} The debounced value.
 */
function useDebounce(value, delay) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function that gets called on every re-render BEFORE the new timer is set.
    // It clears the previous timer, effectively resetting the delay.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if the value or delay changes

  return debouncedValue;
}

export default useDebounce;