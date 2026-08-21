import { apiRequest } from "../lib/apiClient";
import type { CompanyDto } from "../types/api";

/** Read-only company list for lecturer portal (scoped to assigned students' companies). */
export const lecturerCompaniesService = {
  getAll(): Promise<CompanyDto[]> {
    return apiRequest<CompanyDto[]>("/api/Lecturer/companies");
  },
};

