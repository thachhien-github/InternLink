import { useState, useMemo } from "react";
import {
  INITIAL_STUDENTS,
  INITIAL_ENTERPRISES,
  INITIAL_SUBMISSIONS,
  INITIAL_ACTION_ITEMS,
  INITIAL_DEADLINES,
} from "../data/mockData";
import type { Student } from "../types/student";
import type { Enterprise } from "../types/enterprise";
import type { Submission } from "../types/submission";
import type { ActionItem, Deadline } from "../types/common";
import type { WeeklyReportDto } from "../types/api";

export interface AppState {
  currentLecturer: string;
  assignedStudents: Student[];
  assignedSubmissions: Submission[];
  lecturerEnterprises: Enterprise[];
  dynamicActionItems: ActionItem[];
  deadlines: Deadline[];
  stats: {
    total: number;
    interning: number;
    pending: number;
    overdue: number;
    completed: number;
    avgProg: number;
  };
  weeklyReports: WeeklyReportDto[];
  handleUpdateSubmissionStatus: (
    id: string,
    newStatus: string,
    note?: string,
  ) => void;
  handleReviewWeeklyReport: (
    id: string,
    status: string,
    comment?: string,
  ) => void;
}

export function useMockAppState(): AppState {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [enterprises] = useState<Enterprise[]>(INITIAL_ENTERPRISES);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const currentLecturer = "Thầy Phước";

  const assignedStudents = useMemo(() => {
    return students.filter((s) => s.lecturer === currentLecturer);
  }, [students, currentLecturer]);

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

  const assignedSubmissions = useMemo(() => {
    const mssvSet = new Set(assignedStudents.map((s) => s.mssv));
    return submissions.filter((sub) => mssvSet.has(sub.mssv));
  }, [submissions, assignedStudents]);

  const handleUpdateSubmissionStatus = (
    id: string,
    newStatus: string,
    note?: string,
  ) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: newStatus, lecturerNote: note || s.lecturerNote }
          : s,
      ),
    );
  };

  const handleReviewWeeklyReport = (
    _id: string,
    _status: string,
    _comment?: string,
  ) => {
    // Mock mode no-op
  };

  return {
    currentLecturer,
    assignedStudents,
    assignedSubmissions,
    lecturerEnterprises: enterprises,
    dynamicActionItems: INITIAL_ACTION_ITEMS,
    deadlines: INITIAL_DEADLINES,
    stats,
    weeklyReports: [],
    handleUpdateSubmissionStatus,
    handleReviewWeeklyReport,
  };
}
