import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api.config';
import type { ApiResponse } from '../types/api';

interface UseBackendDataOptions {
  skip?: boolean;
  refetchInterval?: number;
}

interface UseBackendDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useBackendData = <T,>(
  endpoint: string,
  options: UseBackendDataOptions = {}
): UseBackendDataState<T> => {
  const shouldSkip = options.skip ?? false;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!shouldSkip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (shouldSkip) return;

    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      const payload = response.data;
      if (payload.success === false) {
        throw new Error(payload.error?.title ?? 'API error');
      }
      setData((payload.data ?? null) as T | null);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint, shouldSkip]);

  useEffect(() => {
    fetchData();

    if (!shouldSkip && options.refetchInterval && options.refetchInterval > 0) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, shouldSkip, options.refetchInterval, fetchData]);

  return { data, loading, error, refetch: fetchData };
};
