import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { DocumentDetailDto, DocumentListItemDto } from "../types/api";

export const documentService = {
  getAll(skip = 0, take = 200): Promise<DocumentListItemDto[]> {
    return apiRequest<DocumentListItemDto[]>(
      `/api/Document?skip=${skip}&take=${take}`,
    );
  },

  getByInternship(
    internshipId: string,
    skip = 0,
    take = 200,
  ): Promise<DocumentListItemDto[]> {
    return apiRequest<DocumentListItemDto[]>(
      `/api/Document/internship/${internshipId}?skip=${skip}&take=${take}`,
    );
  },

  uploadSimple(params: {
    internshipId: string;
    files: File[];
  }): Promise<{ count: number; documents: DocumentDetailDto[] }> {
    const form = new FormData();
    form.append("InternshipId", params.internshipId);
    params.files.forEach((f) => form.append("Files", f));
    return apiRequest<{ count: number; documents: DocumentDetailDto[] }>("/api/Document/upload", {
      method: "POST",
      body: form,
    });
  },



  update(
    id: string,
    body: {
      title?: string;
      description?: string;
      category?: string;
      isRequired?: boolean;
    },
  ): Promise<DocumentDetailDto> {
    return apiRequest<DocumentDetailDto>(`/api/Document/${id}`, {
      method: "PUT",
      body,
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/Document/${id}`, { method: "DELETE" });
  },

  download(id: string, fallbackFilename: string) {
    return downloadAuthenticatedFile(
      `/api/Document/${id}/download`,
      fallbackFilename,
    );
  },
};
