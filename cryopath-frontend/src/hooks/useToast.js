import { useCallback, useEffect, useRef, useState } from 'react';

export default function useToast({ durationMs = 2600 } = {}) {
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const clearToast = useCallback(() => {
    setToast(null);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), durationMs);
  }, [durationMs]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  return { toast, showToast, clearToast };
}
