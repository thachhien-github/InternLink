import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { CompanyDto, CompanyImportResultDto } from "../types/api";

export const adminCompaniesService = {
  getAll(skip = 0, take = 500): Promise<CompanyDto[]> {
    return apiRequest<CompanyDto[]>(
      `/api/Admin/companies?skip=${skip}&take=${take}`,
    );
  },

  create(body: {
    companyName: string;
    address?: string;
    website?: string;
    industry?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    capacity?: number;
  }): Promise<CompanyDto> {
    return apiRequest<CompanyDto>("/api/Admin/companies", {
      method: "POST",
      body,
    });
  },

  update(
    id: string,
    body: {
      companyName: string;
      address?: string;
      website?: string;
      industry?: string;
      contactPerson?: string;
      contactEmail?: string;
      contactPhone?: string;
      capacity?: number;
      isActive?: boolean;
    },
  ): Promise<CompanyDto> {
    return apiRequest<CompanyDto>(`/api/Admin/companies/${id}`, {
      method: "PUT",
      body,
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/Admin/companies/${id}`, {
      method: "DELETE",
    });
  },

  importExcel(file: File) {
    const form = new FormData();
    form.append("file", file);
    return apiRequest<CompanyImportResultDto>("/api/Admin/companies/import", {
      method: "POST",
      body: form,
    });
  },

  downloadImportTemplate() {
    return downloadAuthenticatedFile(
      "/api/Admin/companies/import/template",
      "company-import-template.xlsx",
    );
  },

  downloadExport() {
    return downloadAuthenticatedFile(
      "/api/Admin/companies/export",
      "danh-sach-doanh-nghiep.xlsx",
    );
  },
};
