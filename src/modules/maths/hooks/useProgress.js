import { useState, useEffect } from 'react';

export const useProgress = (key, initialValue = 0) => {
  const [progress, setProgress] = useState(() => {
    try {
      const item = window.localStorage.getItem(`math11_progress_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(`math11_progress_${key}`, JSON.stringify(progress));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [key, progress]);

  return [progress, setProgress];
};
