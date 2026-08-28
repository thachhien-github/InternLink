import type { Enterprise } from "../types/enterprise";
import { adminCompaniesService } from "./adminCompanies.service";
import { mapCompanyDtoToEnterprise } from "../lib/adminMappers";

export const enterpriseService = {
  async getEnterprises(): Promise<Enterprise[]> {
    const rows = await adminCompaniesService.getAll();
    return rows.map(mapCompanyDtoToEnterprise);
  },
};

