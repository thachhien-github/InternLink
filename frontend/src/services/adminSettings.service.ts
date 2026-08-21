import { apiRequest } from "../lib/apiClient";

export interface AdminFacultySettings {
  departmentName: string;
  supportEmail: string;
  phone: string;
  address: string;
  maxStudentsPerLecturer: number;
  defaultReportDeadlineDay: string;
  maxFileSizeMb: number;
  allowLateSubmission: boolean;
  autoLockSemesterEnd: boolean;
  lastUpdatedAt?: string;
}

export const adminSettingsService = {
  getSettings(): Promise<AdminFacultySettings> {
    return apiRequest<AdminFacultySettings>("/api/Admin/settings");
  },

  updateSettings(body: AdminFacultySettings): Promise<AdminFacultySettings> {
    return apiRequest<AdminFacultySettings>("/api/Admin/settings", {
      method: "PUT",
      body,
    });
  },

  resetSettings(): Promise<AdminFacultySettings> {
    return apiRequest<AdminFacultySettings>("/api/Admin/settings/reset", {
      method: "POST",
    });
  },
};
