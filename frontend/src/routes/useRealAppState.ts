import { useMemo } from "react";
import { useLecturerPortalData } from "../hooks/useLecturerPortalData";
import { useSemester } from "../contexts/SemesterContext";
import type { AuthUser } from "../contexts/AuthContext";
import type { AppState } from "../types/appState";

export function useRealAppState(
  role: string | null,
  isLoggedIn: boolean,
  user: AuthUser | null,
  showToast: (msg: string) => void,
  semesterId?: string | null,
): AppState {
  const { selectedSemester, activeSemesterId } = useSemester();
  const lecturerName = user?.name ?? "Giảng viên";

  // Lecturers can explicitly inspect all semesters; students remain scoped to the active one.
  const effectiveSemesterId =
    role === "lecturer"
      ? (semesterId && semesterId !== "all" ? semesterId : undefined)
      : role === "student"
        ? (activeSemesterId || (semesterId && semesterId !== "all" ? semesterId : undefined))
        : semesterId;

  const lecturerPortal = useLecturerPortalData(
    role === "lecturer" && isLoggedIn,
    lecturerName,
    showToast,
    effectiveSemesterId,
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
      (s) =>
        s.sourceType !== "weeklyReport" &&
        (s.status === "Chờ duyệt" || s.status === "Cần nhận xét"),
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
    const apiStats = lecturerPortal.dashboardStats;
    return {
      total: apiStats?.totalStudents ?? total,
      interning: apiStats?.assignedCompanyCount ?? interning,
      pending: apiStats?.pendingReviewsCount ?? pending,
      overdue: apiStats?.overdueReportsCount ?? overdue,
      completed: apiStats?.completedCount ?? completed,
      avgProg: total > 0 ? avgProg : apiStats?.averageProgress ?? 0,
      statusDistribution: apiStats?.statusDistribution ?? {},
    };
  }, [assignedStudents, lecturerPortal.dashboardStats]);

  const handleUpdateSubmissionStatus = async (
    id: string,
    newStatus: string,
    note?: string,
  ) => {
    await lecturerPortal.updateSubmissionStatus(id, newStatus, note);
    await lecturerPortal.refresh();
  };

  const handleReviewWeeklyReport = (
    id: string,
    status: string,
    comment?: string,
  ) => {
    void lecturerPortal.reviewWeeklyReport(id, status, comment);
  };

  const weeklyTrendData = useMemo(() => {
    if (lecturerPortal.weeklyTrend.length > 0) {
      return lecturerPortal.weeklyTrend.map((week) => ({
        label: week.label || `Tuần ${week.weekNumber}`,
        value: week.onTimeCount,
        late: week.lateCount,
        missing: week.missingCount,
      }));
    }
    const weekMap = new Map<number, { submitted: number; approved: number }>();
    for (const r of lecturerPortal.weeklyReports) {
      const wk = r.weekNumber ?? 0;
      if (!weekMap.has(wk)) weekMap.set(wk, { submitted: 0, approved: 0 });
      const entry = weekMap.get(wk)!;
      entry.submitted++;
      if (r.status === "Approved" || r.status === "Reviewed") entry.approved++;
    }
    const weeks = Array.from(weekMap.entries()).sort((a, b) => a[0] - b[0]);
    if (weeks.length === 0) return [];
    return weeks.map(([wk, counts]) => ({
      label: `T${wk}`,
      value: counts.submitted,
      target: assignedStudents.length || 0,
    }));
  }, [assignedStudents, lecturerPortal.weeklyReports, lecturerPortal.weeklyTrend]);

  return {
    currentLecturer,
    assignedStudents,
    assignedSubmissions: lecturerPortal.submissions,
    lecturerEnterprises: lecturerPortal.enterprises,
    dynamicActionItems,
    weeklyTrendData,
    deadlines: (() => {
      const reportsWithDueDates = lecturerPortal.weeklyReports.filter(
        (report) => report.dueDate,
      );
      const fmt = (d: Date) => ({ day: String(d.getDate()), month: `Th${d.getMonth() + 1}` });
      const daysLeft = (d: Date) => {
        const diff = Math.ceil((d.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        return diff > 0 ? `Còn ${diff} ngày` : "Đã hết hạn";
      };

      if (reportsWithDueDates.length > 0) {
        return reportsWithDueDates
          .sort(
            (a, b) =>
              new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
          )
          .map((report) => {
            const dueDate = new Date(report.dueDate!);
            return {
              id: `dl-week-${report.id}`,
              title: `Báo cáo tuần ${report.weekNumber}`,
              ...fmt(dueDate),
              subtitle: `${report.status} – ${daysLeft(dueDate)}`,
              studentCount: 1,
            };
          });
      }

      if (!selectedSemester?.endDate) return [];
      const end = new Date(selectedSemester.endDate);
      return [{
        id: "dl-defense",
        title: "Bảo vệ luận án / thực tập",
        ...fmt(end),
        subtitle: `Kết thúc học kỳ – ${daysLeft(end)}`,
        studentCount: assignedStudents.length,
      }];
    })(),
    stats,
    weeklyReports: lecturerPortal.weeklyReports,
    weeklyReportPage: lecturerPortal.weeklyReportPage,
    weeklyReportQuery: lecturerPortal.weeklyReportQuery,
    queryWeeklyReports: lecturerPortal.queryWeeklyReports,
    isLecturerLoading: lecturerPortal.isLoading,
    lecturerError: lecturerPortal.error,
    handleUpdateSubmissionStatus,
    handleReviewWeeklyReport,
    refresh: lecturerPortal.refresh,
  };
}
