import { apiRequest } from "../lib/apiClient";
import type { InternshipDetailDto, InternshipDto, SubmissionDto } from "../types/api";

export const lecturerInternshipsService = {
  getAll(semesterId?: string): Promise<InternshipDto[]> {
    const params = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<InternshipDto[]>(`/api/Lecturer/internships${params}`);
  },

  getById(id: string): Promise<InternshipDetailDto> {
    return apiRequest<InternshipDetailDto>(`/api/Lecturer/internships/${id}`);
  },

  getSubmissions(internshipId: string, semesterId?: string): Promise<SubmissionDto[]> {
    const params = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<SubmissionDto[]>(
      `/api/Lecturer/internships/${internshipId}/submissions${params}`,
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

  updateStudentNotes(internshipId: string, notes: string) {
    return apiRequest<unknown>(`/api/Lecturer/internships/${internshipId}/notes`, {
      method: "PUT",
      body: { notes },
    });
  },

  bulkNotifyStudents(title: string, message: string) {
    return apiRequest<{ notifiedCount: number }>("/api/Lecturer/students/notify", {
      method: "POST",
      body: { title, message },
    });
  },
};
