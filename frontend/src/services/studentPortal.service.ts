import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type { StudentPortalProfileDto } from "../types/api";

export const studentPortalService = {
  getMe(): Promise<StudentPortalProfileDto> {
    return apiRequest<StudentPortalProfileDto>("/api/StudentPortal/me");
  },

  downloadCertificate() {
    return downloadAuthenticatedFile(
      "/api/StudentPortal/internship-certificate",
      "Phieu-Thuc-Tap.pdf",
    );
  },
};
