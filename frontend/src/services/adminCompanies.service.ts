import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { CompanyDto, CompanyImportResultDto } from "../types/api";

export const adminCompaniesService = {
  getAll(skip = 0, take = 500, semesterId?: string): Promise<CompanyDto[]> {
    const qs = semesterId && semesterId !== "all" ? `&semesterId=${semesterId}` : "";
    return apiRequest<CompanyDto[]>(
      `/api/Admin/companies?skip=${skip}&take=${take}${qs}`,
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

  /** Link / unlink a company for a semester ("ngưng liên kết" = isLinked false). */
  setSemesterLink(
    id: string,
    semesterId: string,
    isLinked: boolean,
  ): Promise<{ isLinked: boolean }> {
    return apiRequest<{ isLinked: boolean }>(
      `/api/Admin/companies/${id}/semester/${semesterId}`,
      {
        method: "PUT",
        body: { isLinked },
      },
    );
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

  /** Admin company detail: master data + hosted internships. */
  getDetail(id: string): Promise<AdminCompanyDetailDto> {
    return apiRequest<AdminCompanyDetailDto>(`/api/Admin/companies/${id}/detail`);
  },
};

/** Admin company detail payload. */
export interface AdminCompanyDetailDto {
  company: CompanyDto;
  internships: InternshipListItemDto[];
}

export interface InternshipListItemDto {
  id: string;
  studentId: string;
  studentName?: string;
  companyId?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  position?: string;
  submissionCount: number;
  createdAt: string;
}
