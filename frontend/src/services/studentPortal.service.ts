import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { StudentDto, StudentPortalProfileDto } from "../types/api";

export const studentPortalService = {
  getMe(): Promise<StudentPortalProfileDto> {
    return apiRequest<StudentPortalProfileDto>("/api/StudentPortal/me");
  },

  updateMe(payload: { fullName: string; email?: string; phone?: string }): Promise<StudentDto> {
    return apiRequest<StudentDto>("/api/StudentPortal/me", {
      method: "PUT",
      body: payload,
    });
  },

  downloadCertificate() {
    return downloadAuthenticatedFile(
      "/api/StudentPortal/internship-certificate",
      "Phieu-Thuc-Tap.pdf",
    );
  },
};
