import { downloadCsv } from "./exportCsv";
import type { AdminDashboardStats } from "../hooks/useAdminDashboardStats";

export function exportAdminDashboardReport(stats: AdminDashboardStats): string {
  const exportedAt = new Date();
  const filename = `Bao_cao_tong_quan_${exportedAt
    .toISOString()
    .slice(0, 16)
    .replace("T", "_")
    .replace(":", "")}.csv`;

  const rows: Array<Array<string | number | null | undefined>> = [
    ["BÁO CÁO TỔNG QUAN HỆ THỐNG"],
    ["Ngày xuất", exportedAt.toLocaleString("vi-VN")],
    [],
    ["CHỈ SỐ TỔNG QUAN"],
    ["Giảng viên", stats.lecturerCount],
    ["GV đang hướng dẫn SV", stats.lecturersWithStudents],
    ["Sinh viên", stats.studentCount],
    ["SV đã cấp tài khoản", stats.activeStudents],
    ["SV chưa cấp tài khoản", stats.pendingStudentAccounts],
    ["GV chưa kích hoạt tài khoản", stats.pendingLecturerAccounts],
    ["Doanh nghiệp", stats.companyCount],
    ["DN đang hợp tác", stats.activeCompanies],
    ["Đợt thực tập (tổng)", stats.internshipTotal],
    ["Đợt đang thực hiện", stats.internshipInProgress],
    [],
    ["TRẠNG THÁI THỰC TẬP"],
    ["Chưa bắt đầu", stats.internshipStats.notStarted],
    ["Đang thực hiện", stats.internshipStats.inProgress],
    ["Chậm tiến độ", stats.internshipStats.behindSchedule],
    ["Chờ phản hồi", stats.internshipStats.awaitingFeedback],
    ["Cần chỉnh sửa", stats.internshipStats.requiresRevision],
    ["Hoàn thành", stats.internshipStats.completed],
    ["Đã chấm điểm", stats.internshipStats.graded],
    [],
    ["PHÂN CÔNG GIẢNG VIÊN"],
    ["SV đã phân công", stats.assignedStudents],
    ["SV chưa phân công", stats.unassignedStudents],
    ["TB SV / GV", stats.avgStudentsPerLecturer],
    [],
    ["PHÂN BỔ TẢI GVHD"],
    ...stats.workloadBreakdown.map((item) => [
      item.category,
      item.count,
      `${item.percent}%`,
    ]),
    [],
    ["HẠNG MỤC CHỜ XỬ LÝ"],
    ...stats.actionItems.map((item) => [item.title, item.subtitle]),
  ];

  downloadCsv(filename, ["Mục", "Giá trị"], rows);
  return filename;
}
