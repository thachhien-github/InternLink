import type { Enterprise } from "../types/enterprise";
import { INITIAL_ENTERPRISES } from "../data/mockData";
import { USE_MOCK } from "../config/env";
import { adminCompaniesService } from "./adminCompanies.service";
import { mapCompanyDtoToEnterprise } from "../lib/adminMappers";

let enterprisesData: Enterprise[] = [...INITIAL_ENTERPRISES];

export const enterpriseService = {
  async getEnterprises(): Promise<Enterprise[]> {
    if (!USE_MOCK) {
      try {
        const rows = await adminCompaniesService.getAll();
        if (rows.length > 0) {
          return rows.map(mapCompanyDtoToEnterprise);
        }
      } catch (err) {
        console.warn("enterpriseService.getEnterprises API fallback:", err);
      }
    }
    return [...enterprisesData];
  },

  async addEnterprise(newEnt: Enterprise): Promise<Enterprise> {
    enterprisesData = [newEnt, ...enterprisesData];
    return newEnt;
  },

  async approveEnterprise(id: string): Promise<Enterprise | null> {
    const idx = enterprisesData.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    enterprisesData[idx] = { ...enterprisesData[idx], status: "Đã duyệt" };
    return enterprisesData[idx];
  },
};

