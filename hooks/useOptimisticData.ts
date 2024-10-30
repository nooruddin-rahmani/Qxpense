import { useState, useEffect } from "react";

export function useOptimisticData<T>(
  initialData: T,
  fetchFn: () => Promise<T>,
  interval = 5000
) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const newData = await fetchFn();
        if (mounted) {
          setData(newData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch data")
          );
        }
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [fetchFn, interval]);

  return { data, error };
}
