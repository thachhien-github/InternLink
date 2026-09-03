import { apiRequest } from "../lib/apiClient";
import type { CompanyDto } from "../types/api";

/** Read-only company list for lecturer portal (scoped to assigned students' companies). */
export const lecturerCompaniesService = {
  getAll(semesterId?: string): Promise<CompanyDto[]> {
    const params = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<CompanyDto[]>(`/api/Lecturer/companies${params}`);
  },
};

