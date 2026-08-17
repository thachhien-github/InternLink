import { apiRequest } from "../lib/apiClient";
import type { InternshipStatsDto } from "../types/api";

export const adminDashboardService = {
  getInternshipStats(): Promise<InternshipStatsDto> {
    return apiRequest<InternshipStatsDto>("/api/Admin/internship-stats");
  },
};
