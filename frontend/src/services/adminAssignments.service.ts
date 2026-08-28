import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type {
  AssignmentHistoryItemDto,
  AutoAssignRequestDto,
  AutoAssignResultDto,
  BulkAssignRequestDto,
  BulkAssignResultDto,
  CompanyAllocationImportResultDto,
  CompanyAllocationItemDto,
  LecturerAssignmentImportResultDto,
  LecturerAssignmentItemDto,
} from "../types/api";

export const adminAssignmentsService = {
  bulkAssign(body: BulkAssignRequestDto): Promise<BulkAssignResultDto> {
    return apiRequest<BulkAssignResultDto>("/api/Admin/assignments", {
      method: "POST",
      body: body,
    });
  },

  getByLecturer(lecturerId: string, semesterId?: string) {
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<LecturerAssignmentItemDto[]>(
      `/api/Admin/assignments/by-lecturer/${lecturerId}${qs}`,
    );
  },

  unassign(body: { lecturerId: string; studentId: string }) {
    return apiRequest<null>("/api/Admin/assignments", {
      method: "DELETE",
      body,
    });
  },

  getHistory(limit = 50) {
    return apiRequest<AssignmentHistoryItemDto[]>(
      `/api/Admin/assignments/history?limit=${limit}`,
    );
  },

  autoAssign(body: AutoAssignRequestDto) {
    return apiRequest<AutoAssignResultDto>("/api/Admin/assignments/auto", {
      method: "POST",
      body: body,
    });
  },

  downloadExport(semesterId?: string) {
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Admin/assignments/export${qs}`,
      "Danh-sach-phan-cong-GVHD.xlsx",
    );
  },

  // Company Allocation
  getCompanyAllocations(semesterId?: string) {
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<CompanyAllocationItemDto[]>(
      `/api/Admin/assignments/company-allocation${qs}`,
    );
  },

  downloadCompanyAllocationTemplate() {
    return downloadAuthenticatedFile(
      "/api/Admin/assignments/company-allocation/template",
      "Mau_Import_Phan_Bo_Doanh_Nghiep.xlsx",
    );
  },

  importCompanyAllocations(file: File, semesterId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<CompanyAllocationImportResultDto>(
      `/api/Admin/assignments/company-allocation/import${qs}`,
      {
        method: "POST",
        body: formData,
      },
    );
  },

  downloadCompanyAllocationExport(semesterId?: string) {
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return downloadAuthenticatedFile(
      `/api/Admin/assignments/company-allocation/export${qs}`,
      "DanhSachPhanBoDoanhNghiep.xlsx",
    );
  },

  // Lecturer Assignment Import & Template
  downloadLecturerAssignmentTemplate() {
    return downloadAuthenticatedFile(
      "/api/Admin/assignments/template",
      "Mau_Import_Phan_Cong_Giang_Vien.xlsx",
    );
  },

  importLecturerAssignments(file: File, semesterId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequest<LecturerAssignmentImportResultDto>(
      `/api/Admin/assignments/import${qs}`,
      {
        method: "POST",
        body: formData,
      },
    );
  },
};

