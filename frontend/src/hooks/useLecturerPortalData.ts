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
import type { Student } from "../types/student";
import type { Submission } from "../types/submission";
import type { Enterprise } from "../types/enterprise";
import type { WeeklyReportDto } from "../types/api";

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
  const [isLoading, setIsLoading] = useState(enabled);

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const [internships, companies] = await Promise.all([
        lecturerInternshipsService.getAll(semesterId ?? undefined),
        lecturerCompaniesService.getAll(semesterId ?? undefined),
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

      // Chunk requests in small batches to stay within browser socket limit
      const chunkSize = 5;
      const submissionGroups = [];
      for (let i = 0; i < internships.length; i += chunkSize) {
        const chunk = internships.slice(i, i + chunkSize);
        const res = await Promise.all(
          chunk.map((item) =>
            lecturerInternshipsService.getSubmissions(item.id).catch(() => []),
          ),
        );
        submissionGroups.push(...res);
      }

      const weeklyGroups = [];
      for (let i = 0; i < internships.length; i += chunkSize) {
        const chunk = internships.slice(i, i + chunkSize);
        const res = await Promise.all(
          chunk.map((item) =>
            weeklyReportService.getByInternship(item.id).catch(() => []),
          ),
        );
        weeklyGroups.push(...res);
      }

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
    isLoading,
    refresh: load,
    updateSubmissionStatus,
    reviewWeeklyReport,
  };
}
