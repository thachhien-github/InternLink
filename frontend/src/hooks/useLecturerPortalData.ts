import { useCallback, useEffect, useState } from "react";
import { USE_MOCK } from "../config/env";
import { getApiErrorMessage } from "../lib/apiClient";
import { mapCompanyDtoToEnterprise } from "../lib/adminMappers";
import {
  mapInternshipDtoToStudent,
  mapSubmissionDtoToRow,
} from "../lib/portalMappers";
import {
  INITIAL_ENTERPRISES,
  INITIAL_STUDENTS,
  INITIAL_SUBMISSIONS,
} from "../data/mockData";
import { lecturerCompaniesService } from "../services/lecturerCompanies.service";
import { lecturerInternshipsService } from "../services/lecturerInternships.service";
import { submissionApiService } from "../services/submissionApi.service";
import { weeklyReportService } from "../services/weeklyReport.service";
import type { Student } from "../types/student";
import type { Submission } from "../types/submission";
import type { Enterprise } from "../types/enterprise";
import type { WeeklyReportDto } from "../types/api";
import { mapUiWeeklyReportReviewStatusToApi } from "../lib/portalMappers";

export function useLecturerPortalData(
  enabled: boolean,
  lecturerName: string,
  onError?: (msg: string) => void,
) {
  const [students, setStudents] = useState<Student[]>(
    USE_MOCK ? INITIAL_STUDENTS : [],
  );
  const [submissions, setSubmissions] = useState<Submission[]>(
    USE_MOCK ? INITIAL_SUBMISSIONS : [],
  );
  const [enterprises, setEnterprises] = useState<Enterprise[]>(
    USE_MOCK ? INITIAL_ENTERPRISES : [],
  );
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReportDto[]>([]);
  const [isLoading, setIsLoading] = useState(enabled && !USE_MOCK);

  const load = useCallback(async () => {
    if (USE_MOCK || !enabled) return;
    setIsLoading(true);
    try {
      const [internships, companies] = await Promise.all([
        lecturerInternshipsService.getAll(),
        lecturerCompaniesService.getAll(),
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

      const submissionGroups = await Promise.all(
        internships.map((i) =>
          lecturerInternshipsService.getSubmissions(i.id).catch(() => []),
        ),
      );

      const weeklyGroups = await Promise.all(
        internships.map((i) =>
          weeklyReportService.getByInternship(i.id).catch(() => []),
        ),
      );

      const submissionRows = submissionGroups.flatMap((group, idx) => {
        const internshipId = internships[idx]?.id;
        const ctx = internshipId ? internshipCtx.get(internshipId) : undefined;
        return group.map((s) => mapSubmissionDtoToRow(s, ctx ?? {}));
      });

      setStudents(studentRows);
      setSubmissions(submissionRows);
      setWeeklyReports(weeklyGroups.flat());
      setEnterprises(companies.map(mapCompanyDtoToEnterprise));
    } catch (err) {
      onError?.(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, lecturerName, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const updateSubmissionStatus = useCallback(
    async (id: string, uiStatus: string, note?: string) => {
      if (USE_MOCK || !enabled) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, status: uiStatus, lecturerNote: note || s.lecturerNote }
              : s,
          ),
        );
        return;
      }
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
      if (USE_MOCK || !enabled) return;
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
    isLoading,
    refresh: load,
    updateSubmissionStatus,
    reviewWeeklyReport,
  };
}
