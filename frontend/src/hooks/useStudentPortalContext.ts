import { useCallback, useEffect, useMemo, useState } from "react";
import { INTERNSHIP_WEEKS } from "../config/internship";
import { getApiErrorMessage } from "../lib/apiClient";
import {
  mapInternshipStatusToUi,
  mapWeeklyReportStatusToUi,
} from "../lib/portalMappers";
import { studentPortalService } from "../services/studentPortal.service";
import { weeklyReportService } from "../services/weeklyReport.service";
import type { StudentProfile } from "../types/common";
import type { InternshipDto, StudentPortalProfileDto } from "../types/api";
import { useAuth } from "./useAuth";

const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80";

const DEFAULT_EMPTY_STUDENT_PROFILE: StudentProfile = {
  name: "Sinh viên",
  mssv: "—",
  class: "—",
  semester: "—",
  major: "—",
  company: "—",
  companyLogo: DEFAULT_LOGO,
  position: "—",
  statusBadge: "Đang tải…",
  overallProgress: 0,
  currentGrade: 0,
  reportsSubmitted: 0,
  totalReports: INTERNSHIP_WEEKS,
  daysLeftForReport: 0,
  lecturerName: "—",
  supervisorName: "—",
  supervisorEmail: "—",
  supervisorPhone: "—",
  companyAddress: "—",
  currentPhase: "Chưa bắt đầu thực tập",
};

function internshipStatusToBadge(status: string): string {
  const map: Record<string, string> = {
    NotStarted: "Chưa bắt đầu",
    InProgress: "Đang thực tập",
    BehindSchedule: "Chậm tiến độ",
    AwaitingFeedback: "Chờ phản hồi",
    RequiresRevision: "Cần chỉnh sửa",
    Completed: "Hoàn thành",
    Graded: "Đã chấm điểm",
  };
  return map[status] ?? mapInternshipStatusToUi(status);
}

function internshipStatusToProgress(status: string): number {
  const map: Record<string, number> = {
    NotStarted: 0,
    InProgress: 55,
    BehindSchedule: 25,
    AwaitingFeedback: 70,
    RequiresRevision: 40,
    Completed: 90,
    Graded: 100,
  };
  return map[status] ?? 50;
}

export function buildStudentProfileFromPortal(
  portal: StudentPortalProfileDto,
  weeklyReportCount = 0,
  approvedWeeklyCount = 0,
): StudentProfile {
  const s = portal.student;
  const i = portal.internship;
  const company = i?.company;

  return {
    name: s.fullName,
    mssv: s.studentCode,
    class: s.class ?? "—",
    semester: "Học kỳ hiện tại",
    major: s.major ?? "—",
    company: company?.companyName ?? "Chưa có doanh nghiệp",
    companyLogo: DEFAULT_LOGO,
    position: i?.position ?? "—",
    statusBadge: i ? internshipStatusToBadge(i.status) : "Chưa có hồ sơ TT",
    overallProgress: i ? internshipStatusToProgress(i.status) : 0,
    currentGrade: 0,
    reportsSubmitted: approvedWeeklyCount,
    totalReports: Math.max(weeklyReportCount, approvedWeeklyCount, INTERNSHIP_WEEKS),
    daysLeftForReport: 0,
    lecturerName: portal.lecturerName ?? "—",
    supervisorName: i?.supervisorName ?? company?.contactPerson ?? "—",
    supervisorEmail: company?.contactEmail ?? "—",
    supervisorPhone: company?.contactPhone ?? "—",
    companyAddress: company?.industry?.trim() || "—",
    currentPhase: i
      ? `${internshipStatusToBadge(i.status)}${weeklyReportCount > 0 ? ` • ${weeklyReportCount} báo cáo tuần` : ""}`
      : "Chưa bắt đầu thực tập",
  };
}

export function useStudentPortalContext() {
  const { user, isLoggedIn } = useAuth();
  const [portalData, setPortalData] = useState<StudentPortalProfileDto | null>(
    null,
  );
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [approvedWeeklyCount, setApprovedWeeklyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(isLoggedIn);
  const [error, setError] = useState<string | null>(null);
  const [internshipId, setInternshipId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const [portal, weekly] = await Promise.all([
        studentPortalService.getMe(),
        weeklyReportService.getMine().catch(() => []),
      ]);
      setPortalData(portal);
      setInternshipId(portal.internship?.id ?? weekly[0]?.internshipId ?? null);
      setWeeklyCount(weekly.length);
      setApprovedWeeklyCount(
        weekly.filter(
          (r) =>
            r.status === "Approved" ||
            mapWeeklyReportStatusToUi(r.status) === "Đã hoàn thành",
        ).length,
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  const profile: StudentProfile = useMemo(() => {
    if (portalData) {
      return buildStudentProfileFromPortal(
        portalData,
        weeklyCount,
        approvedWeeklyCount,
      );
    }
    return {
      ...DEFAULT_EMPTY_STUDENT_PROFILE,
      name: user?.name ?? "Sinh viên",
      mssv: user?.username ?? "—",
    };
  }, [portalData, weeklyCount, approvedWeeklyCount, user]);

  const internship: InternshipDto | null = portalData?.internship ?? null;

  return {
    profile,
    internship,
    internshipId,
    portalData,
    isLoading,
    error,
    refresh: load,
  };
}
