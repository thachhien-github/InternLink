import { apiRequest, downloadAuthenticatedFile } from "../lib/apiClient";
import type {
  AssignmentHistoryItemDto,
  AutoAssignRequestDto,
  AutoAssignResultDto,
  BulkAssignRequestDto,
  BulkAssignResultDto,
  LecturerAssignmentItemDto,
} from "../types/api";

export const adminAssignmentsService = {
  bulkAssign(body: BulkAssignRequestDto): Promise<BulkAssignResultDto> {
    return apiRequest<BulkAssignResultDto>("/api/Admin/assignments", {
      method: "POST",
      body: body,
    });
  },

  getByLecturer(lecturerId: string) {
    return apiRequest<LecturerAssignmentItemDto[]>(
      `/api/Admin/assignments/by-lecturer/${lecturerId}`,
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

  downloadExport() {
    return downloadAuthenticatedFile(
      "/api/Admin/assignments/export",
      "phan-cong-huong-dan.xlsx",
    );
  },
};
