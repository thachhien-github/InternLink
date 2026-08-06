// Submission type definitions

export interface Submission {
  id: string;
  studentName: string;
  mssv: string;
  avatar: string;
  company: string;
  reportType: string;
  time: string;
  date: string;
  status: string;
  fileUrl: string;
  fileSize: string;
  summary: string;
  duplicateScore: number;
  lecturerNote: string;
  approvedAt?: string;
  gradeScore?: number;
}

export type SubmissionStatus =
  | 'Đã duyệt'
  | 'Chờ duyệt'
  | 'Yêu cầu sửa';
