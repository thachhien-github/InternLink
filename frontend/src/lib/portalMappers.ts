import type {
  EvaluationListItemDto,
  FeedbackDto,
  InternshipDto,
  NotificationDto,
  SubmissionDto,
  WeeklyReportDto,
} from "../types/api";
import type { Student } from "../types/student";
import type { Submission } from "../types/submission";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

function formatViDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN");
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

export function mapInternshipStatusToUi(status: string): string {
  const map: Record<string, string> = {
    NotStarted: "Chưa bắt đầu",
    InProgress: "Đúng tiến độ",
    BehindSchedule: "Quá hạn",
    AwaitingFeedback: "Chờ phản hồi",
    RequiresRevision: "Đang chỉnh sửa",
    Completed: "Hoàn thành",
    Graded: "Hoàn thành",
  };
  return map[status] ?? status;
}

export function mapSubmissionStatusToUi(status: string): string {
  const map: Record<string, string> = {
    Submitted: "Chờ duyệt",
    Reviewed: "Cần nhận xét",
    RevisionRequested: "Yêu cầu sửa",
    Approved: "Đã duyệt",
    Rejected: "Từ chối",
  };
  return map[status] ?? status;
}

export function mapUiSubmissionStatusToApi(uiStatus: string): string {
  const map: Record<string, string> = {
    "Đã duyệt": "Approved",
    "Yêu cầu sửa": "RevisionRequested",
    "Chờ duyệt": "Submitted",
    "Cần nhận xét": "Reviewed",
    "Đã nộp": "Submitted",
  };
  return map[uiStatus] ?? "Reviewed";
}

export function mapWeeklyReportStatusToUi(status: string): string {
  const map: Record<string, string> = {
    Draft: "Bản nháp",
    Submitted: "Đã nộp",
    Reviewed: "Đã xem",
    RevisionRequested: "Cần chỉnh sửa",
    Approved: "Đã hoàn thành",
  };
  return map[status] ?? status;
}

/** Lecturer review action → API WeeklyReportStatus */
export function mapUiWeeklyReportReviewStatusToApi(uiStatus: string): string {
  const map: Record<string, string> = {
    "Đã duyệt": "Approved",
    "Phê duyệt": "Approved",
    "Duyệt": "Approved",
    "Yêu cầu sửa": "RevisionRequested",
    "Cần chỉnh sửa": "RevisionRequested",
    "Đã xem": "Reviewed",
  };
  return map[uiStatus] ?? "Reviewed";
}

export function mapSubmissionTypeToUi(type: string): string {
  const map: Record<string, string> = {
    WeeklyReport: "Báo cáo tuần",
    InternshipLog: "Nhật ký thực tập",
    FinalReport: "Báo cáo cuối kỳ",
    Product: "Sản phẩm",
  };
  return map[type] ?? type;
}

/** Student SubmissionsView category → API SubmissionType. */
export function mapUiProductCategoryToSubmissionType(category: string): string {
  if (category === "User Manual") return "FinalReport";
  return "Product";
}

/** Infer UI product category from API submission metadata. */
export function mapSubmissionToProductCategory(
  type: string,
  fileName?: string | null,
): string {
  if (type === "FinalReport") return "User Manual";
  const ext = fileName?.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "zip" || ext === "rar") return "Source Code";
  if (ext === "pptx" || ext === "ppt") return "Slide";
  if (ext === "mp4" || ext === "mov") return "Video Demo";
  if (ext === "sql") return "Database Backup";
  if (ext === "pdf") return "User Manual";
  return "Source Code";
}

export function inferFileExtensionForCategory(category: string): string {
  switch (category) {
    case "Source Code":
      return "zip";
    case "Slide":
      return "pptx";
    case "Video Demo":
      return "mp4";
    case "User Manual":
      return "pdf";
    case "Database Backup":
      return "sql";
    default:
      return "bin";
  }
}

export function mapInternshipDtoToStudent(
  i: InternshipDto,
  lecturerName = "—",
): Student {
  const student = i.student;
  const company = i.company;
  const uiStatus = mapInternshipStatusToUi(i.status);
  return {
    id: i.id,
    name: student?.fullName ?? "—",
    mssv: student?.studentCode ?? "—",
    class: student?.class ?? "—",
    gpa: 0,
    company: company?.companyName ?? "Chưa có",
    position: i.position ?? "—",
    supervisor: i.supervisorName ?? "—",
    lecturer: lecturerName,
    major: student?.major ?? "—",
    status: uiStatus,
    progress: internshipStatusToProgress(i.status),
    riskFlag:
      i.status === "BehindSchedule" || i.status === "RequiresRevision",
    avatar: DEFAULT_AVATAR,
    lastReportName: "—",
    lastReportDate: "—",
    updatedAt: formatViDate(i.endDate),
    notesCount: 0,
    chatCount: 0,
  };
}

export function mapSubmissionDtoToRow(
  s: SubmissionDto,
  ctx: {
    studentName?: string;
    mssv?: string;
    company?: string;
    avatar?: string;
  } = {},
): Submission {
  const latestFeedback = s.feedbacks?.[s.feedbacks.length - 1];
  return {
    id: s.id,
    studentName: ctx.studentName ?? "—",
    mssv: ctx.mssv ?? "—",
    avatar: ctx.avatar ?? DEFAULT_AVATAR,
    company: ctx.company ?? "—",
    reportType: mapSubmissionTypeToUi(s.type),
    time: formatViDate(s.submittedAt).split(" ")[1] ?? "—",
    date: formatViDate(s.submittedAt).split(" ")[0] ?? "—",
    status: mapSubmissionStatusToUi(s.status),
    fileUrl: s.fileUrl ?? "#",
    fileSize: "—",
    summary: s.description ?? s.title ?? "—",
    duplicateScore: 0,
    lecturerNote: latestFeedback?.comment ?? "",
    approvedAt:
      s.status === "Approved" ? formatViDate(s.submittedAt) : undefined,
  };
}

export function mapWeeklyReportDtoToUi(r: WeeklyReportDto) {
  const uiStatus = mapWeeklyReportStatusToUi(r.status);
  const stepMap: Record<string, number> = {
    Draft: 1,
    Submitted: 2,
    Reviewed: 3,
    RevisionRequested: 3,
    Approved: 5,
  };
  return {
    id: r.id,
    internshipId: r.internshipId,
    weekNumber: r.weekNumber,
    title: r.title,
    content: r.content,
    deadline: "—",
    submittedAt: r.submittedAt ? formatViDate(r.submittedAt) : "—",
    version: "v1.0",
    status: uiStatus,
    fileName: `BaoCao_Tuan${r.weekNumber}.pdf`,
    fileSize: "—",
    feedback: r.lecturerComment ?? "",
    feedbackDate: r.updatedAt ? formatViDate(r.updatedAt).split(" ")[0] : "",
    stepIndex: stepMap[r.status] ?? 1,
  };
}

export function mapEvaluationListItemToUi(e: EvaluationListItemDto) {
  const grade = Number(e.finalGrade);
  let gradeClassification = "Khá";
  if (grade >= 9) gradeClassification = "Xuất sắc";
  else if (grade >= 8) gradeClassification = "Giỏi";
  else if (grade >= 6.5) gradeClassification = "Khá";
  else if (grade < 5) gradeClassification = "Không đạt";

  return {
    id: e.id,
    internshipId: e.internshipId,
    name: e.studentName ?? "—",
    mssv: "—",
    avatar: DEFAULT_AVATAR,
    class: "—",
    major: "—",
    company: e.companyName ?? "—",
    supervisor: "—",
    progress: e.isFinalized ? 100 : 60,
    enterpriseScore: grade,
    lecturerScore: grade,
    presentationScore: grade,
    totalScore: grade,
    status: e.isFinalized ? "Hoàn thành" : "Đang chấm",
    weeklyReportCount: "—",
    finalReportSubmitted: true,
    enterpriseFeedbackSubmitted: true,
    lecturerComments: e.evaluatedBy?.fullName
      ? `Đánh giá bởi ${e.evaluatedBy.fullName}`
      : "—",
    gradeClassification,
  };
}

export function mapNotificationDtoToStudentUi(n: NotificationDto) {
  return {
    id: n.id,
    title: n.title,
    description: n.content.slice(0, 120) + (n.content.length > 120 ? "…" : ""),
    fullContent: n.content,
    senderName: "InternLink",
    senderRole: "Hệ thống",
    dateStr: formatViDate(n.createdAt),
    timeAgo: formatViDate(n.createdAt),
    category: "Thông báo",
    priority: n.isRead ? "Thường" : "Quan trọng",
    isUnread: !n.isRead,
    relatedModule: n.link ?? "—",
    relatedTab: n.link ?? "",
    attachment: undefined as
      | { name: string; size: string; type: string }
      | undefined,
  };
}

/** UI row for Lecturer NotificationsView inbox. */
export function mapNotificationDtoToLecturerUi(n: NotificationDto) {
  const isUnread = !n.isRead;
  return {
    id: n.id,
    title: n.title,
    desc:
      n.content.slice(0, 90) + (n.content.length > 90 ? "…" : ""),
    type: isUnread ? "urgent" : "system",
    priority: isUnread ? "Quan trọng" : "Thông thường",
    color: isUnread ? "amber" : "blue",
    isUnread,
    time: formatViDate(n.createdAt),
    sender: "InternLink",
    receiver: "Giảng viên",
    content: n.content,
    attachments: [] as string[],
  };
}

function mapSubmissionFeedbackStatus(status: string): string {
  if (status === "RevisionRequested") return "Cần chỉnh sửa";
  if (status === "Approved") return "Đã hoàn thành";
  if (status === "Rejected" || status === "Reviewed") return "Đã xem";
  return "Chưa xem";
}

function submissionToWorkflowStep(status: string): number {
  const map: Record<string, number> = {
    Submitted: 2,
    Reviewed: 3,
    RevisionRequested: 4,
    Approved: 5,
    Rejected: 5,
  };
  return map[status] ?? 3;
}

export type StudentFeedbackUiItem = {
  id: string;
  submissionId?: string;
  reportId?: string;
  sourceType: "submission" | "weeklyReport";
  senderName: string;
  senderRole: string;
  avatar: string;
  timeAgo: string;
  dateStr: string;
  sortKey: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  detail: string;
  attachments: { name: string; size: string; type: string }[];
  currentWorkflowStep: number;
  conversation: {
    id: string;
    sender: string;
    senderName: string;
    avatar: string;
    time: string;
    text: string;
    attachments: unknown[];
  }[];
  revisions: {
    version: string;
    submissionTime: string;
    description: string;
    status: string;
    fileName: string;
    fileSize: string;
  }[];
};

export function mapFeedbackDtoToStudentUi(
  f: FeedbackDto,
  submission: SubmissionDto,
): StudentFeedbackUiItem {
  return {
    id: f.id,
    submissionId: submission.id,
    sourceType: "submission",
    senderName: f.lecturerName ?? "Giảng viên hướng dẫn",
    senderRole: "Giảng viên hướng dẫn",
    avatar: DEFAULT_AVATAR,
    timeAgo: formatViDate(f.createdAt),
    dateStr: formatViDate(f.createdAt),
    sortKey: f.createdAt,
    title: submission.title ?? mapSubmissionTypeToUi(submission.type),
    category: mapSubmissionTypeToUi(submission.type),
    priority: submission.status === "RevisionRequested" ? "Khẩn" : "Thường",
    status: mapSubmissionFeedbackStatus(submission.status),
    detail: f.comment,
    attachments: [],
    currentWorkflowStep: submissionToWorkflowStep(submission.status),
    conversation: [
      {
        id: f.id,
        sender: "lecturer",
        senderName: f.lecturerName ?? "Giảng viên",
        avatar: DEFAULT_AVATAR,
        time: formatViDate(f.createdAt),
        text: f.comment,
        attachments: [],
      },
    ],
    revisions: [
      {
        version: `v${submission.version}`,
        submissionTime: formatViDate(submission.submittedAt),
        description: submission.description ?? "Bản nộp gốc",
        status: mapSubmissionStatusToUi(submission.status),
        fileName: submission.fileName ?? "—",
        fileSize: "—",
      },
    ],
  };
}

export function mapWeeklyReportFeedbackToStudentUi(
  r: WeeklyReportDto,
  lecturerName?: string | null,
): StudentFeedbackUiItem {
  const stepMap: Record<string, number> = {
    Draft: 1,
    Submitted: 2,
    Reviewed: 3,
    RevisionRequested: 4,
    Approved: 5,
  };
  let feedbackStatus = "Chưa xem";
  if (r.status === "RevisionRequested") feedbackStatus = "Cần chỉnh sửa";
  else if (r.status === "Approved") feedbackStatus = "Đã hoàn thành";
  else if (r.status === "Reviewed") feedbackStatus = "Đã xem";

  const when = r.updatedAt ?? r.createdAt;

  return {
    id: `wr-${r.id}`,
    reportId: r.id,
    sourceType: "weeklyReport",
    senderName: lecturerName ?? "Giảng viên hướng dẫn",
    senderRole: "Giảng viên hướng dẫn",
    avatar: DEFAULT_AVATAR,
    timeAgo: formatViDate(when),
    dateStr: formatViDate(when),
    sortKey: when,
    title: r.title || `Báo cáo tuần ${r.weekNumber}`,
    category: "Báo cáo tuần",
    priority: r.status === "RevisionRequested" ? "Khẩn" : "Thường",
    status: feedbackStatus,
    detail: r.lecturerComment ?? "",
    attachments: [],
    currentWorkflowStep: stepMap[r.status] ?? 3,
    conversation: [
      {
        id: `wr-msg-${r.id}`,
        sender: "lecturer",
        senderName: lecturerName ?? "Giảng viên hướng dẫn",
        avatar: DEFAULT_AVATAR,
        time: formatViDate(when),
        text: r.lecturerComment ?? "",
        attachments: [],
      },
    ],
    revisions: [],
  };
}

export function mapStudentSubmissionToUpload(s: SubmissionDto) {
  return {
    id: s.id,
    title: s.title ?? mapSubmissionTypeToUi(s.type),
    category: mapSubmissionToProductCategory(s.type, s.fileName),
    fileType: s.fileName?.split(".").pop()?.toUpperCase() ?? "FILE",
    size: "—",
    version: `v${s.version}`,
    uploadDate: formatViDate(s.submittedAt),
    status: mapSubmissionStatusToUi(s.status),
    notes: s.description ?? "",
    fileUrl: s.fileUrl ?? "#",
  };
}
