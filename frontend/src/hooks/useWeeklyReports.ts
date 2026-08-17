import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '../lib/apiClient';
import { weeklyReportService } from '../services/weeklyReport.service';
import type { WeeklyReportDto } from '../types/api';

export interface WeeklyReportData {
  id: string;
  weekNumber: number;
  title: string;
  submittedAt?: string | null;
  updatedAt?: string | null;
  status: 'draft' | 'submitted' | 'revised' | 'approved';
  lecturerComment?: string | null;
}

function mapApiStatus(status: string): WeeklyReportData['status'] {
  switch (status) {
    case 'Draft':
      return 'draft';
    case 'Submitted':
    case 'Reviewed':
      return 'submitted';
    case 'RevisionRequested':
      return 'revised';
    case 'Approved':
      return 'approved';
    default:
      return 'draft';
  }
}

function mapDto(r: WeeklyReportDto): WeeklyReportData {
  return {
    id: r.id,
    weekNumber: r.weekNumber,
    title: r.title,
    submittedAt: r.submittedAt,
    updatedAt: r.updatedAt ?? r.createdAt,
    status: mapApiStatus(r.status),
    lecturerComment: r.lecturerComment,
  };
}

interface UseWeeklyReportsState {
  reports: WeeklyReportData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useWeeklyReports = (): UseWeeklyReportsState => {
  const [reports, setReports] = useState<WeeklyReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await weeklyReportService.getMine();
      setReports(rows.map(mapDto));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(getApiErrorMessage(err)));
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { reports, loading, error, refetch };
};
