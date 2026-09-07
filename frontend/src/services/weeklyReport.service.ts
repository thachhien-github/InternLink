import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type {
  CreateWeeklyReportRequestDto,
  FeedbackDto,
  UpdateWeeklyReportRequestDto,
  WeeklyReportDto,
} from "../types/api";

export const weeklyReportService = {
  getMine(): Promise<WeeklyReportDto[]> {
    return apiRequest<WeeklyReportDto[]>("/api/WeeklyReport/mine");
  },

  getByInternship(internshipId: string): Promise<WeeklyReportDto[]> {
    return apiRequest<WeeklyReportDto[]>(
      `/api/WeeklyReport/internship/${internshipId}`,
    );
  },

  getAllForLecturer(semesterId?: string): Promise<WeeklyReportDto[]> {
    const params = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<WeeklyReportDto[]>(`/api/Lecturer/weekly-reports${params}`);
  },

  create(body: CreateWeeklyReportRequestDto): Promise<WeeklyReportDto> {
    return apiRequest<WeeklyReportDto>("/api/WeeklyReport", {
      method: "POST",
      body,
    });
  },

  upload(params: {
    internshipId: string;
    weekNumber: number;
    title: string;
    file: File;
  }): Promise<WeeklyReportDto> {
    const form = new FormData();
    form.append("InternshipId", params.internshipId);
    form.append("WeekNumber", String(params.weekNumber));
    form.append("Title", params.title);
    form.append("File", params.file);
    return apiRequest<WeeklyReportDto>("/api/WeeklyReport/upload", {
      method: "POST",
      body: form,
    });
  },

  uploadRevision(id: string, title: string, file: File): Promise<WeeklyReportDto> {
    const form = new FormData();
    form.append("Title", title);
    form.append("File", file);
    return apiRequest<WeeklyReportDto>(`/api/WeeklyReport/${id}/upload`, {
      method: "PUT",
      body: form,
    });
  },

  download(id: string, fallbackFilename: string) {
    return downloadAuthenticatedFile(`/api/WeeklyReport/${id}/download`, fallbackFilename);
  },

  studentReply(id: string, comment: string): Promise<FeedbackDto> {
    return apiRequest<FeedbackDto>(`/api/WeeklyReport/${id}/student-reply`, {
      method: "POST",
      body: { comment },
    });
  },

  update(id: string, body: UpdateWeeklyReportRequestDto): Promise<WeeklyReportDto> {
    return apiRequest<WeeklyReportDto>(`/api/WeeklyReport/${id}`, {
      method: "PUT",
      body,
    });
  },

  submit(id: string): Promise<WeeklyReportDto> {
    return apiRequest<WeeklyReportDto>(`/api/WeeklyReport/${id}/submit`, {
      method: "POST",
    });
  },

  review(
    id: string,
    body: { status: string; lecturerComment?: string },
  ): Promise<WeeklyReportDto> {
    return apiRequest<WeeklyReportDto>(`/api/WeeklyReport/${id}/review`, {
      method: "POST",
      body,
    });
  },
};
