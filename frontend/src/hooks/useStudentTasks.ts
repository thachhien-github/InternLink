import { useBackendData } from './useBackendData';

/**
 * Hook for fetching student tasks from API
 * Replaces hardcoded INITIAL_STUDENT_TASKS mockdata
 */

export interface StudentTask {
  id: string;
  title: string;
  deadline: string;
  priority: 'Cao' | 'Trung bình' | 'Bình thường';
  actionLabel: string;
  completed: boolean;
  category: string;
}

interface UseStudentTasksState {
  tasks: StudentTask[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useStudentTasks = (): UseStudentTasksState => {
  // Fetch tasks from backend
  const { data, loading, error, refetch } = useBackendData<StudentTask[]>(
    '/StudentPortal/tasks'
  );
  const tasks = Array.isArray(data) ? data : [];

  return { tasks, loading, error, refetch };
};
