import { useState, useCallback } from 'react';
import apiClient from '../services/api.config';
import { AxiosError } from 'axios';

/**
 * Hook for mutations (POST, PUT, DELETE)
 * Handles loading, error states
 */

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type HttpMethod = 'post' | 'put' | 'delete';

export const useMutation = <TData, TVariables = any>(
  method: HttpMethod,
  endpoint: string | ((variables: TVariables) => string)
) => {
  const [state, setState] = useState<UseMutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables?: TVariables): Promise<TData> => {
      try {
        setState({ data: null, loading: true, error: null });

        const url =
          typeof endpoint === 'function' ? endpoint(variables!) : endpoint;

        if (import.meta.env.DEV) console.log(`📤 ${method.toUpperCase()}: ${url}`, variables);

        let response;
        if (method === 'delete') {
          response = await apiClient.delete<TData>(url);
        } else if (method === 'put') {
          response = await apiClient.put<TData>(url, variables);
        } else {
          response = await apiClient.post<TData>(url, variables);
        }

        setState({ data: response.data, loading: false, error: null });
        if (import.meta.env.DEV) console.log(`✅ Success: ${method.toUpperCase()} ${url}`, response.data);

        return response.data;
      } catch (err) {
        const error =
          err instanceof AxiosError
            ? new Error(
                err.response?.data?.message ||
                  err.message ||
                  'Unknown error'
              )
            : err instanceof Error
              ? err
              : new Error('Unknown error');

        setState({ data: null, loading: false, error });
        if (import.meta.env.DEV) console.error(`❌ Error ${method.toUpperCase()}:`, error.message);

        throw error;
      }
    },
    [method, endpoint]
  );

  return { ...state, mutate };
};
