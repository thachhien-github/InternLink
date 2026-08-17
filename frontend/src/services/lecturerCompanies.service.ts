import { apiRequest } from "../lib/apiClient";
import type { CompanyDto } from "../types/api";

/** Read-only company list for lecturer portal. */
export const lecturerCompaniesService = {
  getAll(skip = 0, take = 500): Promise<CompanyDto[]> {
    return apiRequest<CompanyDto[]>(
      `/api/Company?skip=${skip}&take=${take}`,
    );
  },
};
