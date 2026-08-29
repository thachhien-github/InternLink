import { downloadAuthenticatedFile } from "../lib/apiClient";

export const exportService = {
  /** Downloads the multi-sheet internship list Excel report for the selected semester. */
  downloadInternshipExcel(semesterId?: string) {
    const query = semesterId ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Export/internship-excel${query}`,
      `DanhSachThucTap_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },

  /** Downloads the academic internship summary report for the selected semester. */
  downloadSummaryReport(semesterId?: string) {
    const query = semesterId ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Export/summary-report${query}`,
      `BaoCaoTongKetThucTap_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },
};
