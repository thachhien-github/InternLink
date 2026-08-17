import { apiRequest } from "../lib/apiClient";
import type { StudentPortalProfileDto } from "../types/api";

export const studentPortalService = {
  getMe(): Promise<StudentPortalProfileDto> {
    return apiRequest<StudentPortalProfileDto>("/api/StudentPortal/me");
  },
};
