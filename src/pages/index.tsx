import useSSE from "@/hooks/useSSE";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { data, loading, startSSE } = useSSE("https://sse-demo.onrender.com/events", {
    onMessage: (event) => {
      // if (event.data === 'discoverability') {
      // }
    },
    onError: (event) => {
      console.error('SSE error:', event);
    },
    onOpen: () => {
      console.log('SSE connection opened');
    },
  });

  const getData = useCallback(() => {
    startSSE();
  }, [startSSE]);
  
  return (
    <div>
      <button onClick={getData} className="my-button" disabled={loading}>Get Data</button>
      <p>{data}</p>
    </div>
  );
}
