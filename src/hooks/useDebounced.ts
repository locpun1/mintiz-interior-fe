import { useEffect, useRef, useState } from 'react';

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timer = useRef<any>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
