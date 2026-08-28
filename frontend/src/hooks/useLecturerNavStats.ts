import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";
import { lecturerCompaniesService } from "../services/lecturerCompanies.service";
import { notificationService } from "../services/notification.service";

export interface LecturerNavStats {
  studentCount: number;
  enterpriseCount: number;
  pendingReviewCount: number;
  evaluatedCount: number;
  unreadNotificationCount: number;
}

const DEFAULT_NAV_STATS: LecturerNavStats = {
  studentCount: 0,
  enterpriseCount: 0,
  pendingReviewCount: 0,
  evaluatedCount: 0,
  unreadNotificationCount: 0,
};

interface DashboardStatsDto {
  totalStudents: number;
  interningCount: number;
  pendingReviewsCount: number;
  completedCount: number;
  overdueReportsCount: number;
  averageGrade: number;
  evaluatedCount: number;
  statusDistribution: Record<string, number>;
}

export function useLecturerNavStats(enabled = true) {
  const [stats, setStats] = useState<LecturerNavStats>(DEFAULT_NAV_STATS);
  const [isLoading, setIsLoading] = useState(enabled);

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const [statsDto, notifs, companies] = await Promise.all([
        apiRequest<DashboardStatsDto>("/api/Lecturer/stats").catch(() => null),
        notificationService.getMine().catch(() => []),
        lecturerCompaniesService.getAll().catch(() => []),
      ]);

      setStats({
        studentCount: statsDto?.totalStudents ?? 0,
        enterpriseCount: Array.isArray(companies) ? companies.length : 0,
        pendingReviewCount: statsDto?.pendingReviewsCount ?? 0,
        evaluatedCount: statsDto?.evaluatedCount ?? 0,
        unreadNotificationCount: notifs.filter((n) => !n.isRead).length,
      });
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, isLoading, reload: load };
}
