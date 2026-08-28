import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { StudentDto, StudentImportResultDto } from "../types/api";

export const adminStudentsService = {
  getAll(skip = 0, take = 500): Promise<StudentDto[]> {
    return apiRequest<StudentDto[]>(
      `/api/Admin/students?skip=${skip}&take=${take}`,
    );
  },

  getById(id: string): Promise<StudentDto> {
    return apiRequest<StudentDto>(`/api/Admin/students/${id}`);
  },

  create(body: {
    studentCode: string;
    fullName: string;
    class?: string;
    major?: string;
    email?: string;
    phone?: string;
    grantAccount?: boolean;
  }): Promise<StudentDto> {
    return apiRequest<StudentDto>("/api/Admin/students", {
      method: "POST",
      body,
    });
  },

  update(
    id: string,
    body: {
      fullName: string;
      class?: string;
      major?: string;
      email?: string;
      phone?: string;
      grantAccount?: boolean;
    },
  ): Promise<StudentDto> {
    return apiRequest<StudentDto>(`/api/Admin/students/${id}`, {
      method: "PUT",
      body,
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/Admin/students/${id}`, {
      method: "DELETE",
    });
  },

  importExcel(file: File, semesterId?: string) {
    const form = new FormData();
    form.append("file", file);
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<StudentImportResultDto>(`/api/Admin/students/import${qs}`, {
      method: "POST",
      body: form,
    });
  },

  downloadImportTemplate() {
    return downloadAuthenticatedFile(
      "/api/Admin/students/import/template",
      "student-import-template.xlsx",
    );
  },
};
