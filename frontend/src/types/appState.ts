import type { Submission } from "./submission";
import type { WeeklyReportDto } from "./api";

export interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  buttonText?: string;
}

export interface Deadline {
  id: string;
  title: string;
  day: string;
  month: string;
  subtitle: string;
  studentCount: number;
}

export interface Stats {
  total: number;
  interning: number;
  pending: number;
  overdue: number;
  completed: number;
  avgProg: number;
}

export interface AppState {
  currentLecturer: string;
  assignedStudents: any[];
  assignedSubmissions: Submission[];
  dynamicActionItems: ActionItem[];
  deadlines: Deadline[];
  stats: Stats;
  weeklyReports: WeeklyReportDto[];
  weeklyTrendData: { label: string; value: number; target?: number }[];
  lecturerEnterprises?: any[];
  handleUpdateSubmissionStatus: (submissionId: string, status: string) => void;
  handleReviewWeeklyReport: (reportId: string, status: string, feedback: string) => void;
}
