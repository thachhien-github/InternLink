export interface ApiErrorBody {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorBody;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  expiresAt: string;
  role: string;
  mustChangePassword: boolean;
}

export interface CurrentUserDto {
  id: string;
  username: string;
  fullName?: string | null;
  email?: string | null;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  token: string;
  newPassword: string;
}

export interface StudentDto {
  id: string;
  userId?: string | null;
  studentCode: string;
  fullName: string;
  class?: string | null;
  major?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface LecturerDto {
  id: string;
  userId?: string | null;
  staffCode: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  department?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CompanyDto {
  id: string;
  companyName: string;
  address?: string | null;
  website?: string | null;
  industry?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  capacity?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UserDto {
  id: string;
  username: string;
  fullName?: string | null;
  email?: string | null;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  linkedStudentCode?: string | null;
  linkedStaffCode?: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
  totalPages?: number;
  currentPage?: number;
}

export interface BulkAssignRequestDto {
  lecturerId: string;
  studentIds: string[];
}

export interface BulkAssignResultDto {
  assignedCount: number;
  createdCount: number;
  updatedCount: number;
  failedCount: number;
  errors: { studentId: string; message: string }[];
}

export interface LecturerAssignmentItemDto {
  internshipId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  class?: string | null;
  major?: string | null;
  status: string;
  companyId: string;
  companyName?: string | null;
  companyAssigned: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}

export interface AssignmentHistoryItemDto {
  id: string;
  lecturerName: string;
  studentCount: number;
  timestamp: string;
  classGroups: string[];
  assignedBy: string;
}

export interface AutoAssignRequestDto {
  strategy: "department" | "even";
}

export interface AutoAssignResultDto {
  totalAssigned: number;
  totalFailed: number;
  lecturersUsed: number;
}

export interface StudentPortalProfileDto {
  student: StudentDto;
  internship?: InternshipDto | null;
  lecturerName?: string | null;
}

// --- Portal DTOs (Lecturer / Student) ---

export interface StudentSummaryDto {
  id: string;
  studentCode: string;
  fullName: string;
  class?: string | null;
  major?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface CompanySummaryDto {
  id: string;
  companyName: string;
  industry?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export interface InternshipDto {
  id: string;
  studentId: string;
  companyId: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  position?: string | null;
  supervisorName?: string | null;
  notes?: string | null;
  student?: StudentSummaryDto | null;
  company?: CompanySummaryDto | null;
}

export interface InternshipDetailDto extends InternshipDto {
  submissions?: SubmissionDto[];
}

export interface FeedbackDto {
  id: string;
  submissionId: string;
  lecturerId?: string | null;
  lecturerName?: string | null;
  comment: string;
  isPublic: boolean;
  createdAt: string;
}

export interface SubmissionDto {
  id: string;
  internshipId: string;
  type: string;
  status: string;
  version: number;
  title?: string | null;
  description?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  submittedAt: string;
  feedbacks?: FeedbackDto[];
}

export interface WeeklyReportDto {
  id: string;
  internshipId: string;
  weekNumber: number;
  title: string;
  content: string;
  status: string;
  submittedAt?: string | null;
  lecturerComment?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateWeeklyReportRequestDto {
  internshipId: string;
  weekNumber: number;
  title: string;
  content: string;
}

export interface UpdateWeeklyReportRequestDto {
  title?: string;
  content?: string;
}

export interface UpdateEvaluationRequestDto {
  technicalScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  initiativeScore?: number;
  comments?: string;
  strengths?: string;
  areasForImprovement?: string;
  isFinalized?: boolean;
}

export interface CreateEvaluationRequestDto {
  internshipId: string;
  technicalScore: number;
  communicationScore: number;
  teamworkScore: number;
  initiativeScore: number;
  comments?: string;
  strengths?: string;
  areasForImprovement?: string;
  isFinalized?: boolean;
}

export interface CreateSubmissionRequestDto {
  internshipId: string;
  type: string;
  title?: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface ResubmitSubmissionRequestDto {
  title?: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface TestEmailRequestDto {
  toEmail: string;
  fullName?: string;
  role?: "Student" | "Lecturer";
}

export interface CreateFeedbackRequestDto {
  comment: string;
  isPublic?: boolean;
  newStatus?: string;
}

export interface UpdateSubmissionStatusRequestDto {
  status: string;
}

export interface EvaluationListItemDto {
  id: string;
  internshipId: string;
  studentName?: string | null;
  companyName?: string | null;
  finalGrade: number;
  evaluatedAt: string;
  isFinalized: boolean;
  evaluatedBy?: { id: string; fullName?: string | null; email?: string | null } | null;
}

export interface EvaluationDetailDto {
  id: string;
  internshipId: string;
  technicalScore: number;
  communicationScore: number;
  teamworkScore: number;
  initiativeScore: number;
  finalGrade: number;
  comments?: string | null;
  strengths?: string | null;
  areasForImprovement?: string | null;
  evaluatedAt: string;
  updatedAt?: string | null;
  isFinalized: boolean;
  evaluatedBy?: { id: string; fullName?: string | null; email?: string | null } | null;
  internship?: {
    id: string;
    studentName?: string | null;
    companyName?: string | null;
    position?: string | null;
    status: string;
  } | null;
}

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  content: string;
  link?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface InternshipStatsDto {
  total: number;
  notStarted: number;
  inProgress: number;
  behindSchedule: number;
  awaitingFeedback: number;
  requiresRevision: number;
  completed: number;
  graded: number;
}

export interface DocumentListItemDto {
  id: string;
  internshipId: string;
  title: string;
  description?: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  category?: string | null;
  isRequired: boolean;
  uploadedBy?: { id: string; fullName?: string | null; email?: string | null } | null;
}

export interface DocumentDetailDto extends DocumentListItemDto {
  filePath: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface StudentImportResultDto {
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedDuplicateCount: number;
  emailSentCount: number;
  emailFailedCount: number;
  defaultPassword: string;
  createdStudents: StudentDto[];
}

export interface LecturerImportResultDto {
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedDuplicateCount: number;
  emailSentCount: number;
  emailFailedCount: number;
  defaultPassword: string;
  createdLecturers: LecturerDto[];
}

export interface CompanyImportResultDto {
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedDuplicateCount: number;
  createdCompanies: CompanyDto[];
}
