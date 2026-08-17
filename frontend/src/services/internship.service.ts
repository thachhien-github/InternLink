import { apiRequest } from "../lib/apiClient";
import type { InternshipStatsDto } from "../types/api";

export const internshipService = {
  getStats(): Promise<InternshipStatsDto> {
    return apiRequest<InternshipStatsDto>("/api/Internship/stats/overview");
  },
};
