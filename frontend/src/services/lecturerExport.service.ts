import { downloadAuthenticatedFile } from "../lib/apiClient";

export const lecturerExportService = {
  async downloadEndOfTerm(): Promise<{ blob: Blob; filename: string }> {
    return downloadAuthenticatedFile(
      "/api/Lecturer/export/end-of-term",
      "tong-ket-cuoi-ky.xlsx",
    );
  },

  async downloadInternshipExcel(semesterId?: string): Promise<{ blob: Blob; filename: string }> {
    const query = semesterId && semesterId !== "all" ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Export/lecturer-internship-excel${query}`,
      `DanhSachThucTap_${new Date().toISOString().slice(0, 10)}.xlsx`,
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

