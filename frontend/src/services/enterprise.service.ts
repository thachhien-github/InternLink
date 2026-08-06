import type { Enterprise } from '../types/enterprise';
import { INITIAL_ENTERPRISES } from '../data/mockData';

let enterprisesData: Enterprise[] = [...INITIAL_ENTERPRISES];

export const enterpriseService = {
  async getEnterprises(): Promise<Enterprise[]> {
    return [...enterprisesData];
  },

  async addEnterprise(newEnt: Enterprise): Promise<Enterprise> {
    enterprisesData = [newEnt, ...enterprisesData];
    return newEnt;
  },

  async approveEnterprise(id: string): Promise<Enterprise | null> {
    const idx = enterprisesData.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    enterprisesData[idx] = { ...enterprisesData[idx], status: 'Đã duyệt' };
    return enterprisesData[idx];
  }
};
