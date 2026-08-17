import { downloadAuthenticatedFile } from "../lib/apiClient";

export const lecturerExportService = {
  async downloadEndOfTerm(): Promise<{ blob: Blob; filename: string }> {
    return downloadAuthenticatedFile(
      "/api/Lecturer/export/end-of-term",
      "tong-ket-cuoi-ky.xlsx",
    );
  },
};
