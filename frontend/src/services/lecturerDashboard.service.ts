import { apiRequest } from "../lib/apiClient";
import type {
  LecturerDashboardStatsDto,
  LecturerWeeklyTrendDto,
} from "../types/api";

function semesterQuery(semesterId?: string): string {
  return semesterId && semesterId !== "all" ? `?semesterId=${semesterId}` : "";
}

export const lecturerDashboardService = {
  getStats(semesterId?: string): Promise<LecturerDashboardStatsDto> {
    return apiRequest<LecturerDashboardStatsDto>(
      `/api/Lecturer/dashboard${semesterQuery(semesterId)}`,
    );
  },

  getWeeklyTrend(semesterId?: string): Promise<LecturerWeeklyTrendDto[]> {
    return apiRequest<LecturerWeeklyTrendDto[]>(
      `/api/Lecturer/analytics/weekly-trend${semesterQuery(semesterId)}`,
    );
  },
};