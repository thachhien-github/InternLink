import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiClient";
import { mapCompanyDtoToEnterprise } from "../lib/adminMappers";
import {
  mapInternshipDtoToStudent,
  mapSubmissionDtoToRow,
  mapUiWeeklyReportReviewStatusToApi,
} from "../lib/portalMappers";
import { lecturerCompaniesService } from "../services/lecturerCompanies.service";
import { lecturerInternshipsService } from "../services/lecturerInternships.service";
import { submissionApiService } from "../services/submissionApi.service";
import { weeklyReportService } from "../services/weeklyReport.service";
import { lecturerDashboardService } from "../services/lecturerDashboard.service";
import type { Student } from "../types/student";
import type { Submission } from "../types/submission";
import type { Enterprise } from "../types/enterprise";
import type {
  LecturerDashboardStatsDto,
  LecturerWeeklyTrendDto,
  WeeklyReportDto,
} from "../types/api";

export function useLecturerPortalData(
  enabled: boolean,
  lecturerName: string,
  onError?: (msg: string) => void,
  semesterId?: string | null,
) {
  const [students, setStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReportDto[]>([]);
  const [dashboardStats, setDashboardStats] = useState<LecturerDashboardStatsDto | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<LecturerWeeklyTrendDto[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const [internships, companies, allSubmissions, allWeeklyReports, stats, trend] =
        await Promise.all([
          lecturerInternshipsService.getAll(semesterId ?? undefined),
          lecturerCompaniesService.getActive(semesterId ?? undefined),
          lecturerInternshipsService
            .getAllSubmissions(semesterId ?? undefined)
            .catch(() => []),
          weeklyReportService
            .getAllForLecturer(semesterId ?? undefined)
            .catch(() => []),
          lecturerDashboardService.getStats(semesterId ?? undefined),
          lecturerDashboardService.getWeeklyTrend(semesterId ?? undefined),
        ]);

      const studentRows = internships.map((i) =>
        mapInternshipDtoToStudent(i, lecturerName),
      );

      const internshipCtx = new Map(
        internships.map((i) => [
          i.id,
          {
            studentName: i.student?.fullName,
            mssv: i.student?.studentCode,
            company: i.company?.companyName,
          },
        ]),
      );

      const submissionRows = allSubmissions.map((s) => {
        const ctx = s.internshipId ? internshipCtx.get(s.internshipId) : undefined;
        return mapSubmissionDtoToRow(s, ctx ?? {
          studentName: s.internship?.student?.fullName,
          mssv: s.internship?.student?.studentCode,
          company: s.internship?.company?.companyName,
        });
      });

      setStudents(studentRows);
      setSubmissions(submissionRows);
      setWeeklyReports(allWeeklyReports);
      setEnterprises(companies.map(mapCompanyDtoToEnterprise));
      setDashboardStats(stats);
      setWeeklyTrend(trend);
    } catch (err) {
      onError?.(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, lecturerName, semesterId, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const updateSubmissionStatus = useCallback(
    async (id: string, uiStatus: string, note?: string) => {
      if (!enabled) return;
      try {
        await submissionApiService.review(id, uiStatus, note);
        await load();
      } catch (err) {
        onError?.(getApiErrorMessage(err));
      }
    },
    [enabled, load, onError],
  );

  const reviewWeeklyReport = useCallback(
    async (id: string, uiStatus: string, comment?: string) => {
      if (!enabled) return;
      try {
        await weeklyReportService.review(id, {
          status: mapUiWeeklyReportReviewStatusToApi(uiStatus),
          lecturerComment: comment?.trim() || undefined,
        });
        await load();
      } catch (err) {
        onError?.(getApiErrorMessage(err));
      }
    },
    [enabled, load, onError],
  );

  return {
    students,
    submissions,
    enterprises,
    weeklyReports,
    dashboardStats,
    weeklyTrend,
    isLoading,
    refresh: load,
    updateSubmissionStatus,
    reviewWeeklyReport,
  };
}
