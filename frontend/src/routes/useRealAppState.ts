import { useMemo } from "react";
import { useLecturerPortalData } from "../hooks/useLecturerPortalData";
import type { AuthUser } from "../contexts/AuthContext";
import type { AppState } from "./useMockAppState";

export function useRealAppState(
  role: string | null,
  isLoggedIn: boolean,
  user: AuthUser | null,
  showToast: (msg: string) => void,
): AppState {
  const lecturerName = user?.name ?? "Giảng viên";
  const lecturerPortal = useLecturerPortalData(
    role === "lecturer" && isLoggedIn,
    lecturerName,
    showToast,
  );

  const currentLecturer = user?.name ?? "Giảng viên";
  const assignedStudents = lecturerPortal.students;

  const dynamicActionItems = useMemo(() => {
    const items = [];
    const pendingWeeklyCount = lecturerPortal.weeklyReports.filter(
      (r) => r.status === "Submitted",
    ).length;
    if (pendingWeeklyCount > 0) {
      items.push({
        id: "act-weekly",
        title: `${pendingWeeklyCount} báo cáo tuần chờ duyệt`,
        subtitle: "Nhóm hướng dẫn đợt này",
        type: "review",
        buttonText: "Duyệt ngay",
      });
    }
    const pendingSubCount = lecturerPortal.submissions.filter(
      (s) => s.status === "Chờ duyệt" || s.status === "Cần nhận xét",
    ).length;
    if (pendingSubCount > 0) {
      items.push({
        id: "act-submissions",
        title: `${pendingSubCount} bài nộp sản phẩm/cuối kỳ chờ nhận xét`,
        subtitle: "Kho báo cáo & sản phẩm",
        type: "review",
        buttonText: "Xem bài nộp",
      });
    }
    const riskCount = assignedStudents.filter(
      (s) => s.riskFlag || s.status === "Quá hạn",
    ).length;
    if (riskCount > 0) {
      items.push({
        id: "act-risk",
        title: `${riskCount} sinh viên quá hạn / có nguy cơ trễ tiến độ`,
        subtitle: "Cần nhắc nhở và kiểm tra",
        type: "students",
        buttonText: "Theo dõi",
      });
    }
    if (items.length === 0) {
      items.push({
        id: "act-clean",
        title: "Tất cả tiến độ đang tốt",
        subtitle: "Không có báo cáo tồn đọng",
        type: "clean",
        buttonText: "Kiểm tra SV",
      });
    }
    return items;
  }, [
    lecturerPortal.weeklyReports,
    lecturerPortal.submissions,
    assignedStudents,
  ]);

  const stats = useMemo(() => {
    const total = assignedStudents.length;
    const interning = assignedStudents.filter(
      (s) => s.company !== "Chưa có",
    ).length;
    const pending = assignedStudents.filter(
      (s) => s.status === "Chờ phản hồi" || s.status === "Đang chỉnh sửa",
    ).length;
    const overdue = assignedStudents.filter(
      (s) => s.status === "Quá hạn" || s.riskFlag,
    ).length;
    const completed = assignedStudents.filter(
      (s) => s.status === "Hoàn thành",
    ).length;
    const avgProg =
      total > 0
        ? Math.round(
            assignedStudents.reduce((acc, s) => acc + s.progress, 0) / total,
          )
        : 0;
    return { total, interning, pending, overdue, completed, avgProg };
  }, [assignedStudents]);

  const handleUpdateSubmissionStatus = (
    id: string,
    newStatus: string,
    note?: string,
  ) => {
    void lecturerPortal.updateSubmissionStatus(id, newStatus, note);
  };

  const handleReviewWeeklyReport = (
    id: string,
    status: string,
    comment?: string,
  ) => {
    void lecturerPortal.reviewWeeklyReport(id, status, comment);
  };

  return {
    currentLecturer,
    assignedStudents,
    assignedSubmissions: lecturerPortal.submissions,
    lecturerEnterprises: lecturerPortal.enterprises,
    dynamicActionItems,
    deadlines: [
      {
        id: "dl-1",
        title: "Hạn nộp Đề cương & Kế hoạch thực tập",
        date: "Tuần 3",
        daysLeft: 5,
        type: "plan",
        required: true,
      },
      {
        id: "dl-2",
        title: "Báo cáo tiến độ thực tập giữa kỳ",
        date: "Tuần 8",
        daysLeft: 26,
        type: "midterm",
        required: true,
      },
      {
        id: "dl-3",
        title: "Nộp Báo cáo tổng kết & Sản phẩm cuối kỳ",
        date: "Tuần 15",
        daysLeft: 60,
        type: "final",
        required: true,
      },
    ],
    stats,
    weeklyReports: lecturerPortal.weeklyReports,
    handleUpdateSubmissionStatus,
    handleReviewWeeklyReport,
  };
}
