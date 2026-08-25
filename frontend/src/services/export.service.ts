import { downloadAuthenticatedFile } from "../lib/apiClient";

export const exportService = {
  /**
   * Downloads the complete institutional multi-sheet internship Excel report (C23 template).
   */
  downloadInternshipExcel(semesterId?: string) {
    const query = semesterId ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Export/internship-excel${query}`,
      `DanhSachThucTap_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },

  /**
   * Downloads the official academic summary report (C22A template).
   */
  downloadSummaryReport(semesterId?: string) {
    const query = semesterId ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Export/summary-report${query}`,
      `BaoCaoTongKetThucTap_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },
};
