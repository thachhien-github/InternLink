import type { AuthUser } from "../contexts/AuthContext";

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

export interface WeeklyReport {
  id?: string;
  studentName?: string;
  weekNumber?: number;
  title?: string;
  content?: string;
  status?: string;
  submittedAt?: string;
  feedback?: string;
  [key: string]: unknown;
}

export interface StudentSubmission {
  id?: string;
  studentName?: string;
  title?: string;
  status?: string;
  submittedAt?: string;
  [key: string]: unknown;
}

export interface Stats {
  pendingReview?: number;
  approved?: number;
  rejected?: number;
  [key: string]: unknown;
}

export interface AppState {
  currentLecturer: string;
  assignedStudents: any[];
  assignedSubmissions: StudentSubmission[];
  dynamicActionItems: ActionItem[];
  deadlines: Deadline[];
  stats: Stats;
  weeklyReports: WeeklyReport[];
  weeklyTrendData: { label: string; value: number; target?: number }[];
  lecturerEnterprises?: any[];
  handleUpdateSubmissionStatus: (submissionId: string, status: string) => void;
  handleReviewWeeklyReport: (reportId: string, status: string, feedback: string) => void;
}
