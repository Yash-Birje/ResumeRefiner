import { useEffect, useState, useRef } from 'react';
import { AUTO_SAVE_DELAY } from '../utils/constants';

/**
 * Custom hook for auto-saving data with debounce
 * @param {object} data - Data to auto-save
 * @param {function} saveFunction - Function to call for saving
 * @param {number} delay - Debounce delay in ms (default from constants)
 * @returns {{isSaving: boolean, lastSaved: Date|null, error: string|null}}
 */
export const useAutoSave = (data, saveFunction, delay = AUTO_SAVE_DELAY) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      setError(null);

      try {
        await saveFunction(data);
        setLastSaved(new Date());
      } catch (err) {
        setError('Auto-save failed');
        console.error('Auto-save error:', err);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    // Cleanup timeout on unmount or data change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay]);

  return { isSaving, lastSaved, error };
};

export default useAutoSave;
