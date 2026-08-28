import { apiRequest } from "../lib/apiClient";
import type { InternshipStatsDto } from "../types/api";

export const adminDashboardService = {
  getInternshipStats(semesterId?: string): Promise<InternshipStatsDto> {
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<InternshipStatsDto>(`/api/Admin/internship-stats${qs}`);
  },
};
