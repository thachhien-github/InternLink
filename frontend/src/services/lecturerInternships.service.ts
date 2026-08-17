import { apiRequest } from "../lib/apiClient";
import type { InternshipDetailDto, InternshipDto, SubmissionDto } from "../types/api";

export const lecturerInternshipsService = {
  getAll(): Promise<InternshipDto[]> {
    return apiRequest<InternshipDto[]>("/api/Lecturer/internships");
  },

  getById(id: string): Promise<InternshipDetailDto> {
    return apiRequest<InternshipDetailDto>(`/api/Lecturer/internships/${id}`);
  },

  getSubmissions(internshipId: string): Promise<SubmissionDto[]> {
    return apiRequest<SubmissionDto[]>(
      `/api/Lecturer/internships/${internshipId}/submissions`,
    );
  },

  addFeedback(
    submissionId: string,
    body: { comment: string; isPublic?: boolean; newStatus?: string },
  ) {
    return apiRequest<unknown>(`/api/Lecturer/submissions/${submissionId}/feedback`, {
      method: "POST",
      body,
    });
  },
};
