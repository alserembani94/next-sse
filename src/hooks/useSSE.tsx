import { useState, useCallback } from 'react';

interface UseSSEOptions {
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onOpen?: (event: Event) => void;
}

function useSSE(url: string, options: UseSSEOptions = {}) {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startSSE = useCallback(() => {
    setLoading(true);
    setError(null);

    const eventSource = new EventSource(url, );

    eventSource.onmessage = (event: MessageEvent) => {
      if (event.data === 'anomalies') {
        eventSource.close();
      }
      setData((prev) => prev + event.data);
      options.onMessage?.(event);
    };

    eventSource.onerror = (event: Event) => {
      setError('SSE connection error');
      setLoading(false);
      options.onError?.(event);
      eventSource.close();
    };

    eventSource.onopen = (event: Event) => {
      options.onOpen?.(event);
    };

    return () => {
      eventSource.close();
      setLoading(false);
    };
  }, [url, options]);

  const stopSSE = useCallback(() => {
    setLoading(false);
  }, []);

  return { data, loading, error, startSSE, stopSSE };
}

export default useSSE;