import { useBackendData } from './useBackendData';

/**
 * Hook for fetching evaluations/feedback from API
 * Replaces hardcoded STUDENT_FEEDBACK mockdata
 */

export interface EvaluationData {
  id: string;
  title: string;
  from: string;
  date: string;
  rating?: number;
  content?: string;
  type: 'Đánh giá' | 'Phản hồi' | 'Nhận xét';
  status?: string;
}

interface UseEvaluationsState {
  evaluations: EvaluationData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useEvaluations = (studentId?: string): UseEvaluationsState => {
  // Fetch evaluations from backend
  // If studentId provided, fetch for that student, otherwise fetch current user's evaluations
  const endpoint = studentId 
    ? `/Evaluation/by-student/${studentId}` 
    : '/Evaluation/mine';
    
  const { data: evaluations = [], loading, error, refetch } = useBackendData<EvaluationData[]>(
    endpoint
  );

  return { evaluations, loading, error, refetch };
};
