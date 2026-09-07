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

  // For lecturer/student: prefer the active semester, fall back to selectedSemesterId
  const effectiveSemesterId =
    (role === "lecturer" || role === "student")
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
    const apiStats = lecturerPortal.dashboardStats;
    return {
      total: apiStats?.totalStudents ?? total,
      interning: apiStats?.interningCount ?? interning,
      pending: apiStats?.pendingReviewsCount ?? pending,
      overdue: apiStats?.overdueReportsCount ?? overdue,
      completed: apiStats?.completedCount ?? completed,
      avgProg,
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
    if (weeks.length === 0) {
      // Generate placeholder weeks 1-10
      return Array.from({ length: 6 }, (_, i) => ({
        label: `T${i + 1}`,
        value: 0,
        target: assignedStudents.length || 0,
      }));
    }
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
      if (!selectedSemester?.startDate || !selectedSemester?.endDate) return [];
      const start = new Date(selectedSemester.startDate);
      const end = new Date(selectedSemester.endDate);
      const now = new Date();
      const fmt = (d: Date) => ({ day: String(d.getDate()), month: `Th${d.getMonth() + 1}` });
      const daysLeft = (d: Date) => {
        const diff = Math.ceil((d.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        return diff > 0 ? `Còn ${diff} ngày` : "Đã hết hạn";
      };
      const weeklyMilestones = Array.from({ length: 6 }, (_, index) => {
        const week = index + 1;
        const date = new Date(start.getTime() + week * 7 * 24 * 60 * 60 * 1000);
        return {
          id: `dl-week-${week}`,
          title: `Báo cáo tuần ${week}`,
          ...fmt(date),
          subtitle: `Tuần ${week} / 6 – ${daysLeft(date)}`,
          studentCount: assignedStudents.length,
        };
      });
      return [
        ...weeklyMilestones,
        {
          id: "dl-defense",
          title: "Bảo vệ luận án / thực tập",
          ...fmt(end),
          subtitle: `Kết thúc học kỳ – ${daysLeft(end)}`,
          studentCount: assignedStudents.length,
        },
      ];
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
