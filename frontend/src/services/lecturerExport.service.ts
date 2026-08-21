import { downloadAuthenticatedFile } from "../lib/apiClient";

export const lecturerExportService = {
  async downloadEndOfTerm(): Promise<{ blob: Blob; filename: string }> {
    return downloadAuthenticatedFile(
      "/api/Lecturer/export/end-of-term",
      "tong-ket-cuoi-ky.xlsx",
    );
  },

  async downloadEndOfTermPdf(): Promise<{ blob: Blob; filename: string }> {
    return downloadAuthenticatedFile(
      "/api/Lecturer/export/end-of-term/pdf",
      "bang-tong-hop-cuoi-ky.pdf",
    );
  },

  async downloadStudentEvaluationPdf(
    internshipId: string,
  ): Promise<{ blob: Blob; filename: string }> {
    return downloadAuthenticatedFile(
      `/api/Lecturer/export/evaluation/${internshipId}/pdf`,
      `phieu-danh-gia-thuc-tap-${internshipId.slice(0, 8)}.pdf`,
    );
  },
};

