import { apiRequest } from "../lib/apiClient";
import type {
  CreateWeeklyReportRequestDto,
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

  create(body: CreateWeeklyReportRequestDto): Promise<WeeklyReportDto> {
    return apiRequest<WeeklyReportDto>("/api/WeeklyReport", {
      method: "POST",
      body,
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
