import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { LecturerDto, LecturerImportResultDto } from "../types/api";

export const adminLecturersService = {
  getAll(skip = 0, take = 500): Promise<LecturerDto[]> {
    return apiRequest<LecturerDto[]>(
      `/api/LecturerProfile?skip=${skip}&take=${take}`,
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

  importExcel(file: File) {
    const form = new FormData();
    form.append("file", file);
    return apiRequest<LecturerImportResultDto>("/api/LecturerProfile/import", {
      method: "POST",
      body: form,
    });
  },

  downloadImportTemplate() {
    return downloadAuthenticatedFile(
      "/api/LecturerProfile/import/template",
      "lecturer-import-template.xlsx",
    );
  },
};
