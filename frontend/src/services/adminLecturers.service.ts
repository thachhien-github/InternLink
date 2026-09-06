import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { LecturerDto, LecturerImportResultDto } from "../types/api";

export const adminLecturersService = {
  getAll(skip = 0, take = 500, semesterId?: string): Promise<LecturerDto[]> {
    const qs = semesterId && semesterId !== "all" ? `&semesterId=${semesterId}` : "";
    return apiRequest<LecturerDto[]>(
      `/api/LecturerProfile?skip=${skip}&take=${take}${qs}`,
    );
  },

  getById(id: string): Promise<LecturerDto> {
    return apiRequest<LecturerDto>(`/api/LecturerProfile/${id}`);
  },

  create(body: {
    staffCode: string;
    fullName: string;
    email?: string;
    phone?: string;
    department?: string;
    grantAccount?: boolean;
  }): Promise<LecturerDto> {
    return apiRequest<LecturerDto>("/api/LecturerProfile", {
      method: "POST",
      body,
    });
  },

  update(
    id: string,
    body: {
      fullName: string;
      email?: string;
      phone?: string;
      department?: string;
      grantAccount?: boolean;
    },
  ): Promise<LecturerDto> {
    return apiRequest<LecturerDto>(`/api/LecturerProfile/${id}`, {
      method: "PUT",
      body,
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/LecturerProfile/${id}`, {
      method: "DELETE",
    });
  },

  importExcel(file: File, semesterId?: string) {
    const form = new FormData();
    form.append("file", file);
    const qs = semesterId && semesterId !== "all" ? `?semesterId=${semesterId}` : "";
    return apiRequest<LecturerImportResultDto>(
      `/api/LecturerProfile/import${qs}`,
      {
        method: "POST",
        body: form,
      },
    );
  },

  downloadImportTemplate() {
    return downloadAuthenticatedFile(
      "/api/LecturerProfile/import/template",
      "lecturer-import-template.xlsx",
    );
  },

  downloadExport() {
    return downloadAuthenticatedFile(
      "/api/LecturerProfile/export",
      "danh-sach-giang-vien.xlsx",
    );
  },
};
