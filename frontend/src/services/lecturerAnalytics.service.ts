import { apiRequest } from "../lib/apiClient";
import { toApiSemesterId } from "../contexts/SemesterContext";
import type {
  LecturerDashboardStatsDto,
  LecturerWeeklyTrendDto,
  LecturerGradeDistributionDto,
  LecturerCompanyStatDto,
  LecturerActivityStatsDto,
} from "../types/api";

export const lecturerAnalyticsService = {
  getStats(semesterId: string | undefined): Promise<LecturerDashboardStatsDto> {
    return apiRequest<LecturerDashboardStatsDto>(
      `/api/Lecturer/stats${toApiSemesterId(semesterId) ? `?semesterId=${toApiSemesterId(semesterId)}` : ""}`
    );
  },

  getWeeklyTrend(semesterId: string | undefined): Promise<LecturerWeeklyTrendDto[]> {
    return apiRequest<LecturerWeeklyTrendDto[]>(
      `/api/Lecturer/analytics/weekly-trend${toApiSemesterId(semesterId) ? `?semesterId=${toApiSemesterId(semesterId)}` : ""}`
    );
  },

  getGradeDistribution(semesterId: string | undefined): Promise<LecturerGradeDistributionDto> {
    return apiRequest<LecturerGradeDistributionDto>(
      `/api/Lecturer/analytics/grade-distribution${toApiSemesterId(semesterId) ? `?semesterId=${toApiSemesterId(semesterId)}` : ""}`
    );
  },

  getCompanyStats(semesterId: string | undefined): Promise<LecturerCompanyStatDto[]> {
    return apiRequest<LecturerCompanyStatDto[]>(
      `/api/Lecturer/analytics/company-stats${toApiSemesterId(semesterId) ? `?semesterId=${toApiSemesterId(semesterId)}` : ""}`
    );
  },

  getActivityStats(semesterId: string | undefined): Promise<LecturerActivityStatsDto> {
    return apiRequest<LecturerActivityStatsDto>(
      `/api/Lecturer/analytics/activity-stats${toApiSemesterId(semesterId) ? `?semesterId=${toApiSemesterId(semesterId)}` : ""}`
    );
  },
};
