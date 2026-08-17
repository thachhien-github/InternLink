import { useBackendData } from './useBackendData';

/**
 * Hook for fetching admin students from API
 * Replaces hardcoded mockdata
 */

export interface StudentData {
  id: string;
  mssv: string;
  name: string;
  email: string;
  phone?: string;
  class: string;
  major: string;
  status: string;
  semester?: string;
  company?: string;
}

interface UseAdminStudentsState {
  students: StudentData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAdminStudents = (): UseAdminStudentsState => {
  // Fetch students from backend
  const { data: students = [], loading, error, refetch } = useBackendData<StudentData[]>(
    '/Admin/students'
  );

  return { students, loading, error, refetch };
};
