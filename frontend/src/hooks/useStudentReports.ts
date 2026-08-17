import { useBackendData } from './useBackendData';

/**
 * Hook for fetching student report deadlines from API
 * Replaces hardcoded STUDENT_REPORT_DEADLINES mockdata
 */

export interface StudentReportDeadline {
  id: string;
  weekName: string;
  deadlineDate: string;
  status: 'Đã hoàn thành' | 'Sắp đến hạn' | 'Sắp tới' | 'Chưa tới' | 'Quá hạn';
  score?: number;
  urgent: boolean;
}

interface UseStudentReportsState {
  reports: StudentReportDeadline[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useStudentReports = (): UseStudentReportsState => {
  // Fetch report deadlines from backend
  const { data: reports = [], loading, error, refetch } = useBackendData<StudentReportDeadline[]>(
    '/StudentPortal/reports'
  );

  return { reports, loading, error, refetch };
};
