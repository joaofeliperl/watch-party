/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from "react";

function debounce(func: any, wait = 250) {
  let timeout: NodeJS.Timeout;
  function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  executedFunction.cancel = function () {
    clearTimeout(timeout);
  };
  return executedFunction;
}

function useDebounce(callback: any, delay = 1000, deps = []) {
  const debouncedCallback = useCallback(debounce(callback, delay), [
    delay,
    ...deps,
  ]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback, delay, ...deps]);

  return debouncedCallback;
}

export default useDebounce;
