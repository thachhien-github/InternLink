/**
 * Mock data for DEMO_MODE — provides realistic sample data so the frontend
 * can run without a backend API. Every endpoint that the frontend calls is
 * mapped here.  This file is only imported when DEMO_MODE = true.
 */
import type {
  InternshipStatsDto,
  StudentDto,
  LecturerDto,
  CompanyDto,
  LecturerAssignmentItemDto,
  NotificationDto,
  LecturerDashboardStatsDto,
  LecturerWeeklyTrendDto,
  LecturerStudentListItemDto,
  InternshipDto,
  SubmissionDto,
  WeeklyReportDto,
  StudentPortalProfileDto,
  PaginatedResponse,
  UserDto,
  EvaluationListItemDto,
  WeeklyReportVersionDto,
  SubmissionAssetDto,
  FeedbackDto,
  EvaluationDetailDto,
  CompanyDetailDto,
  LecturerCompanySummaryDto,
  InternshipListItemDto,
  AssignmentHistoryItemDto,
  CompanyAllocationItemDto,
  DocumentListItemDto,
} from "../types/api";
import type { BackendSemesterDto } from "../services/adminSemesters.service";
import type { AdminNotificationCampaignDto } from "../services/adminNotifications.service";

// ─── Helper ──────────────────────────────────────────────────────────────────
function guid(seed: string): string {
  // Deterministic pseudo-GUID from a seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const hex = (v: number, n: number) =>
    Math.abs(((v + 2147483648) % (1 << (n * 4)))).toString(16).padStart(n, "0");
  return `${hex(hash, 8)}-${hex(hash + 1, 4)}-4${hex(hash + 2, 3)}-${hex(hash + 3, 4)}-${hex(hash + 4, 12)}`;
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}

// ─── Companies ───────────────────────────────────────────────────────────────
export const MOCK_COMPANIES: CompanyDto[] = [
  {
    id: guid("comp-1"),
    companyCode: "DN001",
    companyName: "FPT Software",
    address: "Tầng 8, Tòa nhà FPT, 17 Duy Tân, Cầu Giấy, Hà Nội",
    website: "https://fptsoftware.com",
    industry: "Phần mềm & Công nghệ thông tin",
    contactPerson: "Nguyễn Văn A",
    contactEmail: "contact@fpt.com",
    contactPhone: "024-12345678",
    capacity: 50,
    isActive: true,
    studentCount: 12,
    isSemesterLinked: true,
    createdAt: daysAgo(120),
  },
  {
    id: guid("comp-2"),
    companyCode: "DN002",
    companyName: "VNG Corporation",
    address: "Tầng 15-16, Ziny Building, Đường Võ Văn Kiệt, Q1, TP.HCM",
    website: "https://vng.com.vn",
    industry: "Giải trí số & Thương mại điện tử",
    contactPerson: "Trần Thị B",
    contactEmail: "hr@vng.com",
    contactPhone: "028-87654321",
    capacity: 40,
    isActive: true,
    studentCount: 8,
    isSemesterLinked: true,
    createdAt: daysAgo(100),
  },
  {
    id: guid("comp-3"),
    companyCode: "DN003",
    companyName: "Viettel Solutions",
    address: "Tầng 10, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Q10, TP.HCM",
    website: "https://viettelsolutions.vn",
    industry: "Viễn thông & Cloud Services",
    contactPerson: "Lê Văn C",
    contactEmail: "tuyendung@viettel.com",
    contactPhone: "028-11223344",
    capacity: 35,
    isActive: true,
    studentCount: 6,
    isSemesterLinked: true,
    createdAt: daysAgo(90),
  },
  {
    id: guid("comp-4"),
    companyCode: "DN004",
    companyName: "TMA Solutions",
    address: "Khu CNC, Quận 9, TP.HCM",
    website: "https://tmasolutions.com",
    industry: "Gia công phần mềm",
    contactPerson: "Phạm Minh D",
    contactEmail: "info@tma.com",
    contactPhone: "028-55667788",
    capacity: 30,
    isActive: true,
    studentCount: 5,
    isSemesterLinked: true,
    createdAt: daysAgo(80),
  },
  {
    id: guid("comp-5"),
    companyCode: "DN005",
    companyName: "axon ACTIVE",
    address: "Tầng 5, 28 Mạc Đĩnh Chi, Đakao, Q1, TP.HCM",
    website: "https://axonactive.com",
    industry: "Phát triển ứng dụng di động & Web",
    contactPerson: "Hoàng Thị E",
    contactEmail: "recruit@axonactive.com",
    contactPhone: "028-99887766",
    capacity: 25,
    isActive: true,
    studentCount: 4,
    isSemesterLinked: true,
    createdAt: daysAgo(70),
  },
];

// ─── Students ────────────────────────────────────────────────────────────────
export const MOCK_STUDENTS: StudentDto[] = [
  { id: guid("stu-1"), userId: guid("user-stu-1"), studentCode: "2180601234", fullName: "Nguyễn Minh Tuấn", class: "21CLC01", major: "Khoa học máy tính", email: "tuannm@hcmut.edu.vn", phone: "0901234567", createdAt: daysAgo(150), updatedAt: daysAgo(5) },
  { id: guid("stu-2"), userId: guid("user-stu-2"), studentCode: "2180601235", fullName: "Trần Thị Mai", class: "21CLC01", major: "Khoa học máy tính", email: "maitt@hcmut.edu.vn", phone: "0912345678", createdAt: daysAgo(150), updatedAt: daysAgo(3) },
  { id: guid("stu-3"), userId: guid("user-stu-3"), studentCode: "2180601236", fullName: "Lê Hoàng Nam", class: "21CLC02", major: "Kỹ thuật phần mềm", email: "namlh@hcmut.edu.vn", phone: "0923456789", createdAt: daysAgo(150), updatedAt: daysAgo(2) },
  { id: guid("stu-4"), userId: guid("user-stu-4"), studentCode: "2180601237", fullName: "Phạm Thu Hương", class: "21CLC02", major: "Kỹ thuật phần mềm", email: "huongpt@hcmut.edu.vn", phone: "0934567890", createdAt: daysAgo(150), updatedAt: daysAgo(1) },
  { id: guid("stu-5"), userId: guid("user-stu-5"), studentCode: "2180601238", fullName: "Đỗ Quang Hùng", class: "21CLC03", major: "Trí tuệ nhân tạo", email: "hungdq@hcmut.edu.vn", phone: "0945678901", createdAt: daysAgo(150), updatedAt: daysAgo(4) },
  { id: guid("stu-6"), userId: guid("user-stu-6"), studentCode: "2180601239", fullName: "Bùi Thanh Hằng", class: "21CLC03", major: "Trí tuệ nhân tạo", email: "hangbt@hcmut.edu.vn", phone: "0956789012", createdAt: daysAgo(145), updatedAt: daysAgo(2) },
  { id: guid("stu-7"), userId: null, studentCode: "2180601240", fullName: "Vũ Đức Đại", class: "21CLC01", major: "Khoa học máy tính", email: "daivd@hcmut.edu.vn", phone: "0967890123", createdAt: daysAgo(145), updatedAt: daysAgo(6) },
  { id: guid("stu-8"), userId: null, studentCode: "2180601241", fullName: "Ngô Thị Lan", class: "21CLC02", major: "Kỹ thuật phần mềm", email: "lannt@hcmut.edu.vn", phone: "0978901234", createdAt: daysAgo(140), updatedAt: daysAgo(7) },
];

// ─── Lecturers ───────────────────────────────────────────────────────────────
export const MOCK_LECTURERS: LecturerDto[] = [
  { id: guid("lec-1"), userId: guid("user-gv-1"), staffCode: "GV001", fullName: "PGS. TS Lê Phước", email: "phuoc.le@hcmut.edu.vn", phone: "0987654321", department: "Khoa CNTT", createdAt: daysAgo(365), updatedAt: daysAgo(10) },
  { id: guid("lec-2"), userId: guid("user-gv-2"), staffCode: "GV002", fullName: "TS Nguyễn Văn Minh", email: "minhnv@hcmut.edu.vn", phone: "0987654322", department: "Khoa CNTT", createdAt: daysAgo(365), updatedAt: daysAgo(8) },
  { id: guid("lec-3"), userId: guid("user-gv-3"), staffCode: "GV003", fullName: "ThS Trần Thị Bích", email: "bichtt@hcmut.edu.vn", phone: "0987654323", department: "Khoa CNTT", createdAt: daysAgo(300), updatedAt: daysAgo(12) },
];

// ─── Semesters ───────────────────────────────────────────────────────────────
export const MOCK_SEMESTERS: BackendSemesterDto[] = [
  {
    id: guid("sem-1"),
    name: "HK1 2026-2027",
    term: "Học kỳ 1",
    academicYear: "2026-2027",
    startDate: "2026-09-01",
    endDate: "2027-01-15",
    status: 1, // Active
    description: "Đợt thực tập chính khóa kỳ 1 năm học 2026-2027",
    maxStudentsPerLecturer: 15,
    studentsCount: 8,
    lecturersCount: 3,
    placedStudents: 6,
    companiesCount: 5,
    progressPercent: 42,
    currentPhase: "Đang thực tập",
    createdAt: daysAgo(30),
  },
  {
    id: guid("sem-2"),
    name: "HK2 2025-2026",
    term: "Học kỳ 2",
    academicYear: "2025-2026",
    startDate: "2026-01-20",
    endDate: "2026-06-15",
    status: 2, // Completed
    description: "Đợt thực tập kỳ 2 năm học 2025-2026 (đã hoàn thành)",
    maxStudentsPerLecturer: 15,
    studentsCount: 6,
    lecturersCount: 2,
    placedStudents: 6,
    companiesCount: 4,
    progressPercent: 100,
    currentPhase: "Đã hoàn thành",
    createdAt: daysAgo(200),
  },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export const MOCK_USERS: PaginatedResponse<UserDto> = {
  items: [
    { id: guid("user-admin"), username: "admin.demo", fullName: "Quản trị viên demo", email: "admin.demo@internlink.local", role: "SuperAdmin", isActive: true, mustChangePassword: false, createdAt: daysAgo(365) },
    { id: guid("user-gv-1"), username: "gv.demo", fullName: "PGS. TS Lê Phước", email: "phuoc.le@hcmut.edu.vn", role: "Lecturer", isActive: true, mustChangePassword: false, lastLoginAt: daysAgo(1), createdAt: daysAgo(365) },
    { id: guid("user-stu-1"), username: "sv.demo", fullName: "Nguyễn Minh Tuấn", email: "tuannm@hcmut.edu.vn", role: "Student", isActive: true, mustChangePassword: false, lastLoginAt: daysAgo(0), createdAt: daysAgo(150) },
    { id: guid("user-gv-2"), username: "gv002", fullName: "TS Nguyễn Văn Minh", email: "minhnv@hcmut.edu.vn", role: "Lecturer", isActive: true, mustChangePassword: false, createdAt: daysAgo(365) },
    { id: guid("user-gv-3"), username: "gv003", fullName: "ThS Trần Thị Bích", email: "bichtt@hcmut.edu.vn", role: "Lecturer", isActive: true, mustChangePassword: false, createdAt: daysAgo(300) },
    { id: guid("user-stu-2"), username: "2180601235", fullName: "Trần Thị Mai", email: "maitt@hcmut.edu.vn", role: "Student", isActive: true, mustChangePassword: false, createdAt: daysAgo(150) },
    { id: guid("user-stu-3"), username: "2180601236", fullName: "Lê Hoàng Nam", email: "namlh@hcmut.edu.vn", role: "Student", isActive: true, mustChangePassword: false, createdAt: daysAgo(150) },
    { id: guid("user-stu-4"), username: "2180601237", fullName: "Phạm Thu Hương", email: "huongpt@hcmut.edu.vn", role: "Student", isActive: true, mustChangePassword: false, createdAt: daysAgo(150) },
  ],
  total: 8,
  skip: 0,
  take: 200,
};

// ─── Internships ─────────────────────────────────────────────────────────────
export const MOCK_INTERNSHIPS: InternshipDto[] = [
  {
    id: guid("intern-1"), studentId: guid("stu-1"), companyId: guid("comp-1"),
    startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "Backend Developer",
    supervisorName: "Nguyễn Văn A",
    student: { id: guid("stu-1"), studentCode: "2180601234", fullName: "Nguyễn Minh Tuấn", class: "21CLC01", major: "Khoa học máy tính" },
    company: { id: guid("comp-1"), companyName: "FPT Software", industry: "Phần mềm & CNTT" },
  },
  {
    id: guid("intern-2"), studentId: guid("stu-2"), companyId: guid("comp-2"),
    startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "Frontend Developer",
    supervisorName: "Trần Thị B",
    student: { id: guid("stu-2"), studentCode: "2180601235", fullName: "Trần Thị Mai", class: "21CLC01", major: "Khoa học máy tính" },
    company: { id: guid("comp-2"), companyName: "VNG Corporation", industry: "Giải trí số" },
  },
  {
    id: guid("intern-3"), studentId: guid("stu-3"), companyId: guid("comp-3"),
    startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "DevOps Intern",
    supervisorName: "Lê Văn C",
    student: { id: guid("stu-3"), studentCode: "2180601236", fullName: "Lê Hoàng Nam", class: "21CLC02", major: "Kỹ thuật phần mềm" },
    company: { id: guid("comp-3"), companyName: "Viettel Solutions", industry: "Viễn thông" },
  },
  {
    id: guid("intern-4"), studentId: guid("stu-4"), companyId: guid("comp-4"),
    startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "Mobile Developer",
    supervisorName: "Phạm Minh D",
    student: { id: guid("stu-4"), studentCode: "2180601237", fullName: "Phạm Thu Hương", class: "21CLC02", major: "Kỹ thuật phần mềm" },
    company: { id: guid("comp-4"), companyName: "TMA Solutions", industry: "Gia công phần mềm" },
  },
  {
    id: guid("intern-5"), studentId: guid("stu-5"), companyId: guid("comp-5"),
    startDate: "2026-09-10", endDate: "2027-01-15", status: "BehindSchedule", position: "Full-stack Developer",
    supervisorName: "Hoàng Thị E",
    student: { id: guid("stu-5"), studentCode: "2180601238", fullName: "Đỗ Quang Hùng", class: "21CLC03", major: "Trí tuệ nhân tạo" },
    company: { id: guid("comp-5"), companyName: "axon ACTIVE", industry: "Phát triển ứng dụng" },
  },
  {
    id: guid("intern-6"), studentId: guid("stu-6"), companyId: guid("comp-1"),
    startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "QA Engineer",
    supervisorName: "Nguyễn Văn A",
    student: { id: guid("stu-6"), studentCode: "2180601239", fullName: "Bùi Thanh Hằng", class: "21CLC03", major: "Trí tuệ nhân tạo" },
    company: { id: guid("comp-1"), companyName: "FPT Software", industry: "Phần mềm & CNTT" },
  },
];

// ─── Assignments (Lecturer ↔ Student) ────────────────────────────────────────
export const MOCK_ASSIGNMENTS: LecturerAssignmentItemDto[] = [
  { internshipId: guid("intern-1"), lecturerId: guid("lec-1"), lecturerName: "PGS. TS Lê Phước", studentId: guid("stu-1"), studentCode: "2180601234", studentName: "Nguyễn Minh Tuấn", class: "21CLC01", major: "Khoa học máy tính", status: "InProgress", companyId: guid("comp-1"), companyName: "FPT Software", companyAssigned: true, startDate: "2026-09-10", endDate: "2027-01-15", createdAt: daysAgo(25) },
  { internshipId: guid("intern-2"), lecturerId: guid("lec-1"), lecturerName: "PGS. TS Lê Phước", studentId: guid("stu-2"), studentCode: "2180601235", studentName: "Trần Thị Mai", class: "21CLC01", major: "Khoa học máy tính", status: "InProgress", companyId: guid("comp-2"), companyName: "VNG Corporation", companyAssigned: true, startDate: "2026-09-10", endDate: "2027-01-15", createdAt: daysAgo(25) },
  { internshipId: guid("intern-3"), lecturerId: guid("lec-1"), lecturerName: "PGS. TS Lê Phước", studentId: guid("stu-3"), studentCode: "2180601236", studentName: "Lê Hoàng Nam", class: "21CLC02", major: "Kỹ thuật phần mềm", status: "InProgress", companyId: guid("comp-3"), companyName: "Viettel Solutions", companyAssigned: true, startDate: "2026-09-10", endDate: "2027-01-15", createdAt: daysAgo(25) },
  { internshipId: guid("intern-4"), lecturerId: guid("lec-2"), lecturerName: "TS Nguyễn Văn Minh", studentId: guid("stu-4"), studentCode: "2180601237", studentName: "Phạm Thu Hương", class: "21CLC02", major: "Kỹ thuật phần mềm", status: "InProgress", companyId: guid("comp-4"), companyName: "TMA Solutions", companyAssigned: true, startDate: "2026-09-10", endDate: "2027-01-15", createdAt: daysAgo(25) },
  { internshipId: guid("intern-5"), lecturerId: guid("lec-2"), lecturerName: "TS Nguyễn Văn Minh", studentId: guid("stu-5"), studentCode: "2180601238", studentName: "Đỗ Quang Hùng", class: "21CLC03", major: "Trí tuệ nhân tạo", status: "BehindSchedule", companyId: guid("comp-5"), companyName: "axon ACTIVE", companyAssigned: true, startDate: "2026-09-10", endDate: "2027-01-15", createdAt: daysAgo(25) },
  { internshipId: guid("intern-6"), lecturerId: guid("lec-3"), lecturerName: "ThS Trần Thị Bích", studentId: guid("stu-6"), studentCode: "2180601239", studentName: "Bùi Thanh Hằng", class: "21CLC03", major: "Trí tuệ nhân tạo", status: "InProgress", companyId: guid("comp-1"), companyName: "FPT Software", companyAssigned: true, startDate: "2026-09-10", endDate: "2027-01-15", createdAt: daysAgo(25) },
];

// ─── Assignment History ──────────────────────────────────────────────────────
export const MOCK_ASSIGNMENT_HISTORY: AssignmentHistoryItemDto[] = [
  { id: guid("hist-1"), lecturerName: "PGS. TS Lê Phước", studentCount: 3, timestamp: daysAgo(25), classGroups: ["21CLC01", "21CLC02"], assignedBy: "Admin" },
  { id: guid("hist-2"), lecturerName: "TS Nguyễn Văn Minh", studentCount: 2, timestamp: daysAgo(25), classGroups: ["21CLC02", "21CLC03"], assignedBy: "Admin" },
  { id: guid("hist-3"), lecturerName: "ThS Trần Thị Bích", studentCount: 1, timestamp: daysAgo(24), classGroups: ["21CLC03"], assignedBy: "Admin" },
];

// ─── Company Allocations ─────────────────────────────────────────────────────
export const MOCK_COMPANY_ALLOCATIONS: CompanyAllocationItemDto[] = MOCK_ASSIGNMENTS.map((a) => ({
  internshipId: a.internshipId,
  studentId: a.studentId,
  studentCode: a.studentCode,
  studentName: a.studentName,
  class: a.class,
  major: a.major,
  companyId: a.companyId,
  companyName: a.companyName,
  lecturerId: a.lecturerId,
  lecturerName: a.lecturerName,
  status: a.status,
  startDate: a.startDate,
  endDate: a.endDate,
}));

// ─── Internship Stats ────────────────────────────────────────────────────────
export const MOCK_INTERNSHIP_STATS: InternshipStatsDto = {
  total: 6,
  notStarted: 0,
  inProgress: 5,
  behindSchedule: 1,
  awaitingFeedback: 0,
  requiresRevision: 0,
  completed: 0,
  graded: 0,
};

// ─── Notifications ───────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: NotificationDto[] = [
  { id: guid("notif-1"), userId: guid("user-gv-1"), title: "Hệ thống đã cập nhật đợt thực tập mới", content: "Học kỳ 1 2026-2027 đã được kích hoạt. Vui lòng kiểm tra danh sách sinh viên được phân công.", isRead: false, createdAt: daysAgo(1) },
  { id: guid("notif-2"), userId: guid("user-gv-1"), title: "Báo cáo tuần mới", content: "Sinh viên Nguyễn Minh Tuấn đã nộp báo cáo tuần 3. Vui lòng xem và đánh giá.", isRead: false, createdAt: daysAgo(2) },
  { id: guid("notif-3"), userId: guid("user-gv-1"), title: "Nhắc nhở đánh giá", content: "Bạn còn 2 báo cáo tuần chưa được duyệt từ đợt thực tập hiện tại.", isRead: true, createdAt: daysAgo(3) },
  { id: guid("notif-4"), userId: guid("user-gv-1"), title: "Hệ thống", content: "Phiên bản mới của hệ thống InternLink đã được cập nhật với nhiều cải tiến mới.", isRead: true, createdAt: daysAgo(5) },
  { id: guid("notif-5"), userId: guid("user-gv-1"), title: "Lịch bảo vệ thực tập", content: "Lịch bảo vệ thực tập dự kiến vào tháng 12/2026. Vui lòng cập nhật điểm đánh giá trước đó.", isRead: true, createdAt: daysAgo(7) },
];

// ─── Admin Notification Campaigns ────────────────────────────────────────────
export const MOCK_ADMIN_NOTIFICATIONS: AdminNotificationCampaignDto[] = [
  { id: guid("camp-1"), title: "Hệ thống đã cập nhật đợt thực tập mới", content: "Học kỳ 1 2026-2027 đã được kích hoạt. Vui lòng kiểm tra danh sách sinh viên.", audience: "all", recipientCount: 11, readCount: 8, sentAt: daysAgo(1) },
  { id: guid("camp-2"), title: "Nhắc nhở nộp báo cáo tuần", content: "Sinh viên vui lòng nộp báo cáo tuần đúng hạn để tránh bị đánh giá thấp.", audience: "student", recipientCount: 8, readCount: 6, sentAt: daysAgo(3) },
  { id: guid("camp-3"), title: "Duyệt báo cáo sinh viên", content: "Giảng viên vui lòng duyệt báo cáo tuần và bài nộp sản phẩm của sinh viên.", audience: "lecturer", recipientCount: 3, readCount: 2, sentAt: daysAgo(5) },
];

// ─── Lecturer Dashboard Stats ────────────────────────────────────────────────
export const MOCK_LECTURER_DASHBOARD_STATS: LecturerDashboardStatsDto = {
  totalStudents: 3,
  assignedCompanyCount: 3,
  interningCount: 3,
  averageProgress: 55,
  pendingReviewsCount: 4,
  completedCount: 0,
  overdueReportsCount: 1,
  averageGrade: 0,
  evaluatedCount: 0,
  statusDistribution: {
    "InProgress": 2,
    "BehindSchedule": 1,
    "Completed": 0,
  },
};

// ─── Weekly Trend ────────────────────────────────────────────────────────────
export const MOCK_WEEKLY_TREND: LecturerWeeklyTrendDto[] = [
  { weekNumber: 1, label: "Tuần 1", onTimeCount: 3, lateCount: 0, missingCount: 0, totalStudents: 3, complianceRate: 100 },
  { weekNumber: 2, label: "Tuần 2", onTimeCount: 2, lateCount: 1, missingCount: 0, totalStudents: 3, complianceRate: 67 },
  { weekNumber: 3, label: "Tuần 3", onTimeCount: 2, lateCount: 0, missingCount: 1, totalStudents: 3, complianceRate: 67 },
  { weekNumber: 4, label: "Tuần 4", onTimeCount: 3, lateCount: 0, missingCount: 0, totalStudents: 3, complianceRate: 100 },
  { weekNumber: 5, label: "Tuần 5", onTimeCount: 1, lateCount: 1, missingCount: 1, totalStudents: 3, complianceRate: 33 },
];

// ─── Lecturer Students (assigned list) ───────────────────────────────────────
export const MOCK_LECTURER_STUDENTS: LecturerStudentListItemDto[] = [
  {
    studentId: guid("stu-1"), internshipId: guid("intern-1"), studentCode: "2180601234", fullName: "Nguyễn Minh Tuấn",
    email: "tuannm@hcmut.edu.vn", phone: "0901234567", class: "21CLC01", major: "Khoa học máy tính",
    companyId: guid("comp-1"), companyName: "FPT Software", position: "Backend Developer",
    internshipStatus: "InProgress", startDate: "2026-09-10", endDate: "2027-01-15",
    weeklyReportCount: 4, pendingReportCount: 0, submissionCount: 2, finalGrade: null,
    hasEvaluation: false, isEvaluationFinalized: false, progressPercent: 65,
  },
  {
    studentId: guid("stu-2"), internshipId: guid("intern-2"), studentCode: "2180601235", fullName: "Trần Thị Mai",
    email: "maitt@hcmut.edu.vn", phone: "0912345678", class: "21CLC01", major: "Khoa học máy tính",
    companyId: guid("comp-2"), companyName: "VNG Corporation", position: "Frontend Developer",
    internshipStatus: "InProgress", startDate: "2026-09-10", endDate: "2027-01-15",
    weeklyReportCount: 3, pendingReportCount: 1, submissionCount: 1, finalGrade: null,
    hasEvaluation: false, isEvaluationFinalized: false, progressPercent: 50,
  },
  {
    studentId: guid("stu-3"), internshipId: guid("intern-3"), studentCode: "2180601236", fullName: "Lê Hoàng Nam",
    email: "namlh@hcmut.edu.vn", phone: "0923456789", class: "21CLC02", major: "Kỹ thuật phần mềm",
    companyId: guid("comp-3"), companyName: "Viettel Solutions", position: "DevOps Intern",
    internshipStatus: "BehindSchedule", startDate: "2026-09-10", endDate: "2027-01-15",
    weeklyReportCount: 2, pendingReportCount: 2, submissionCount: 0, finalGrade: null,
    hasEvaluation: false, isEvaluationFinalized: false, progressPercent: 30,
  },
];

// ─── Weekly Reports ──────────────────────────────────────────────────────────
export const MOCK_WEEKLY_REPORTS: WeeklyReportDto[] = [
  {
    id: guid("wr-1"), internshipId: guid("intern-1"), weekNumber: 1, version: 1, title: "Báo cáo tuần 1 - Onboarding",
    content: "Tuần đầu tiên tại FPT Software, tôi đã được giới thiệu về dự án và cấu trúc mã nguồn.",
    fileName: "report-week1.pdf", fileSize: 102400, mimeType: "application/pdf",
    status: "Approved", submittedAt: daysAgo(28), lecturerComment: "Tốt, tiếp tục phát huy.",
    createdAt: daysAgo(28), updatedAt: daysAgo(27), dueDate: daysAgo(21),
  },
  {
    id: guid("wr-2"), internshipId: guid("intern-1"), weekNumber: 2, version: 1, title: "Báo cáo tuần 2 - Phát triển API",
    content: "Bắt đầu triển khai REST API cho module quản lý người dùng.",
    fileName: "report-week2.pdf", fileSize: 128000, mimeType: "application/pdf",
    status: "Approved", submittedAt: daysAgo(21), lecturerComment: "Nội dung chi tiết.",
    createdAt: daysAgo(21), updatedAt: daysAgo(20), dueDate: daysAgo(14),
  },
  {
    id: guid("wr-3"), internshipId: guid("intern-1"), weekNumber: 3, version: 1, title: "Báo cáo tuần 3 - Testing",
    content: "Viết unit test cho các API đã hoàn thành.",
    fileName: "report-week3.pdf", fileSize: 115000, mimeType: "application/pdf",
    status: "Approved", submittedAt: daysAgo(14), lecturerComment: "Đánh giá tích cực.",
    createdAt: daysAgo(14), updatedAt: daysAgo(13), dueDate: daysAgo(7),
  },
  {
    id: guid("wr-4"), internshipId: guid("intern-1"), weekNumber: 4, version: 1, title: "Báo cáo tuần 4 - Code Review",
    content: "Tham gia code review và sửa các bug từ feedback.",
    fileName: "report-week4.pdf", fileSize: 98000, mimeType: "application/pdf",
    status: "Submitted", submittedAt: daysAgo(3),
    createdAt: daysAgo(3), dueDate: new Date().toISOString(),
  },
  {
    id: guid("wr-5"), internshipId: guid("intern-2"), weekNumber: 1, version: 1, title: "Báo cáo tuần 1 - Bắt đầu thực tập tại VNG",
    content: "Giới thiệu về môi trường làm việc và dự án Zalo.",
    fileName: "wr2-week1.pdf", fileSize: 105000, mimeType: "application/pdf",
    status: "Approved", submittedAt: daysAgo(28), lecturerComment: "Nắm bắt tốt.",
    createdAt: daysAgo(28), updatedAt: daysAgo(27),
  },
  {
    id: guid("wr-6"), internshipId: guid("intern-2"), weekNumber: 2, version: 1, title: "Báo cáo tuần 2 - Phát triển UI",
    content: "Triển khai giao diện React cho trang quản lý.",
    fileName: "wr2-week2.pdf", fileSize: 130000, mimeType: "application/pdf",
    status: "Submitted", submittedAt: daysAgo(20),
    createdAt: daysAgo(20),
  },
  {
    id: guid("wr-7"), internshipId: guid("intern-3"), weekNumber: 1, version: 1, title: "Báo cáo tuần 1 - Onboarding Viettel",
    content: "Tìm hiểu về hạ tầng cloud và Kubernetes.",
    fileName: "wr3-week1.pdf", fileSize: 95000, mimeType: "application/pdf",
    status: "Approved", submittedAt: daysAgo(28), lecturerComment: "Cần bổ sung chi tiết hơn.",
    createdAt: daysAgo(28), updatedAt: daysAgo(26),
  },
  {
    id: guid("wr-3-2"), internshipId: guid("intern-3"), weekNumber: 2, version: 1, title: "Báo cáo tuần 2 - Chưa nộp",
    content: "",
    status: "Submitted", submittedAt: null,
    createdAt: daysAgo(14), dueDate: daysAgo(7),
  },
];

// ─── Submissions ─────────────────────────────────────────────────────────────
export const MOCK_SUBMISSIONS: SubmissionDto[] = [
  {
    id: guid("sub-1"), internshipId: guid("intern-1"), type: "FinalReport", status: "Submitted", version: 1,
    title: "Báo cáo thực tập cuối kỳ", description: "Báo cáo tổng hợp quá trình thực tập tại FPT Software",
    fileName: "final-report-tuan.pdf", fileSize: 2048000, submittedAt: daysAgo(2),
    assets: [{ id: guid("asset-1"), label: "Source code", fileName: "source-code.zip", fileUrl: "#", assetType: "file", fileSize: 5242880, mimeType: "application/zip", uploadedAt: daysAgo(2) } as SubmissionAssetDto],
  },
  {
    id: guid("sub-2"), internshipId: guid("intern-2"), type: "ProgressReport", status: "Reviewed", version: 1,
    title: "Báo cáo tiến độ sản phẩm", description: "Báo cáo về ứng dụng Zalo mini",
    fileName: "progress-mai.pdf", fileSize: 1536000, submittedAt: daysAgo(5),
    feedbacks: [{ id: guid("fb-1"), lecturerId: guid("lec-1"), lecturerName: "PGS. TS Lê Phước", authorRole: "Lecturer", comment: "Cần bổ sung phần demo video.", isPublic: true, createdAt: daysAgo(4) } as FeedbackDto],
  },
];

// ─── Student Portal Profile ──────────────────────────────────────────────────
export const MOCK_STUDENT_PORTAL: StudentPortalProfileDto = {
  student: MOCK_STUDENTS[0],
  internship: MOCK_INTERNSHIPS[0],
  lecturerName: "PGS. TS Lê Phước",
  progressPercent: 65,
};

// ─── Evaluation List ─────────────────────────────────────────────────────────
export const MOCK_EVALUATIONS: EvaluationListItemDto[] = [];

// ─── Company Details (for lecturer view) ─────────────────────────────────────
export const MOCK_COMPANY_DETAIL: CompanyDetailDto = {
  company: MOCK_COMPANIES[0],
  assignedStudentsCount: 2,
  totalSubmissions: 3,
  totalWeeklyReports: 5,
  pendingReviewsCount: 1,
  internships: [
    { id: guid("intern-1"), studentId: guid("stu-1"), studentName: "Nguyễn Minh Tuấn", studentCode: "2180601234", companyId: guid("comp-1"), companyName: "FPT Software", startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "Backend Developer", submissionCount: 2, createdAt: daysAgo(25) } as InternshipListItemDto,
    { id: guid("intern-6"), studentId: guid("stu-6"), studentName: "Bùi Thanh Hằng", studentCode: "2180601239", companyId: guid("comp-1"), companyName: "FPT Software", startDate: "2026-09-10", endDate: "2027-01-15", status: "InProgress", position: "QA Engineer", submissionCount: 1, createdAt: daysAgo(25) } as InternshipListItemDto,
  ],
};

// ─── Lecturer Company Summary ────────────────────────────────────────────────
export const MOCK_LECTURER_COMPANIES: LecturerCompanySummaryDto[] = MOCK_COMPANIES.slice(0, 3).map((c) => ({
  id: c.id,
  companyCode: c.companyCode,
  companyName: c.companyName,
  industry: c.industry,
  contactPerson: c.contactPerson,
  contactEmail: c.contactEmail,
  contactPhone: c.contactPhone,
  address: c.address,
  assignedStudentsCount: c.studentCount ?? 0,
}));

// ─── Documents (empty for demo) ──────────────────────────────────────────────
export const MOCK_DOCUMENTS: DocumentListItemDto[] = [];

// ─── Weekly Report Versions (empty for demo) ─────────────────────────────────
export const MOCK_WEEKLY_REPORT_VERSIONS: WeeklyReportVersionDto[] = [];

// ══════════════════════════════════════════════════════════════════════════════
// ROUTE → MOCK DATA MAPPER
// ══════════════════════════════════════════════════════════════════════════════

type MockRouteHandler = (url: string, method: string, body?: unknown) => unknown;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const DEMO_USER_STORAGE_KEY = "internlink_demo_user";

function getCurrentDemoRole(): string {
  const username = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  if (username === "admin.demo") return "admin";
  if (username === "gv.demo") return "lecturer";
  if (username === "sv.demo") return "student";
  return "student";
}

/**
 * Match an API URL to mock data.  Returns undefined when the route is not
 * handled (which causes the caller to make a real HTTP request — useful if
 * the user later re-enables the backend).
 */
export function resolveMockData(url: string, method: string, body?: unknown): unknown | undefined {
  const u = url.toLowerCase();
  const m = method.toUpperCase();

  // ─── Admin Semester Portal ───────────────────────────────────────────
  if (u.includes("/api/admin/semesters") && m === "GET") return MOCK_SEMESTERS;
  if (u.includes("/api/semesters/current")) return MOCK_SEMESTERS[0];

  // ─── Admin Dashboard ─────────────────────────────────────────────────
  if (u.includes("/api/admin/internship-stats")) return MOCK_INTERNSHIP_STATS;

  // ─── Admin Students ──────────────────────────────────────────────────
  if (u.match(/\/api\/admin\/students\/import/)) {
    return { totalRows: 0, successCount: 0, failedCount: 0, errors: [], createdStudents: [], skippedDuplicateCount: 0, emailSentCount: 0, emailFailedCount: 0, defaultPassword: "Demo123!" };
  }
  if (u.match(/\/api\/admin\/students\/import\/template/)) return null; // download
  if (u.match(/\/api\/admin\/students\/[^/]+$/) && m === "GET" && !u.includes("import")) {
    const id = u.split("/").filter(Boolean).pop();
    return MOCK_STUDENTS.find((s) => s.id === id) ?? MOCK_STUDENTS[0];
  }
  if (u.includes("/api/admin/students")) return MOCK_STUDENTS;

  // ─── Admin Lecturers ─────────────────────────────────────────────────
  if (u.match(/\/api\/lecturerprofile\/import/)) {
    return { totalRows: 0, successCount: 0, failedCount: 0, errors: [], createdLecturers: [], skippedDuplicateCount: 0, emailSentCount: 0, emailFailedCount: 0, defaultPassword: "Demo123!" };
  }
  if (u.match(/\/api\/lecturerprofile\/import\/template/)) return null;
  if (u.match(/\/api\/lecturerprofile\/export/)) return null;
  if (u.match(/\/api\/lecturerprofile\/[^/]+$/) && m === "GET" && !u.includes("import") && !u.includes("export")) {
    const id = u.split("/").filter(Boolean).pop();
    return MOCK_LECTURERS.find((l) => l.id === id) ?? MOCK_LECTURERS[0];
  }
  if (u.includes("/api/lecturerprofile")) return MOCK_LECTURERS;

  // ─── Admin Companies ─────────────────────────────────────────────────
  if (u.match(/\/api\/admin\/companies\/import/)) {
    return { totalRows: 0, successCount: 0, createdCount: 0, updatedCount: 0, failedCount: 0, skippedDuplicateCount: 0, createdCompanies: [], updatedCompanies: [], errors: [] };
  }
  if (u.match(/\/api\/admin\/companies\/import\/template/)) return null;
  if (u.match(/\/api\/admin\/companies\/export/)) return null;
  if (u.match(/\/api\/admin\/companies\/[^/]+\/detail/)) {
    return MOCK_COMPANY_DETAIL;
  }
  if (u.match(/\/api\/admin\/companies\/[^/]+\/semester\//) && m === "PUT") {
    return { isLinked: true };
  }
  if (u.match(/\/api\/admin\/companies\/[^/]+$/) && m === "GET" && !u.includes("import") && !u.includes("export") && !u.includes("detail") && !u.includes("semester")) {
    return MOCK_COMPANIES[0];
  }
  if (u.includes("/api/admin/companies")) return MOCK_COMPANIES;

  // ─── Admin Users ─────────────────────────────────────────────────────
  if (u.match(/\/api\/admin\/users\/[^/]+\/reset-password/) && m === "POST") {
    return { userId: "mock", username: "mock", emailSent: true };
  }
  if (u.includes("/api/admin/users")) return MOCK_USERS;

  // ─── Admin Assignments ───────────────────────────────────────────────
  if (u.match(/\/api\/admin\/assignments\/auto/) && m === "POST") {
    return { totalAssigned: 0, totalFailed: 0, lecturersUsed: 0 };
  }
  if (u.match(/\/api\/admin\/assignments\/company-allocation\/import/)) {
    return { totalRows: 0, successCount: 0, failedCount: 0, errors: [], updatedAllocations: [] };
  }
  if (u.match(/\/api\/admin\/assignments\/company-allocation\/template/)) return null;
  if (u.match(/\/api\/admin\/assignments\/company-allocation\/export/)) return null;
  if (u.match(/\/api\/admin\/assignments\/company-allocation/)) return MOCK_COMPANY_ALLOCATIONS;
  if (u.match(/\/api\/admin\/assignments\/template/)) return null;
  if (u.match(/\/api\/admin\/assignments\/import/)) {
    return { totalRows: 0, successCount: 0, failedCount: 0, errors: [] };
  }
  if (u.match(/\/api\/admin\/assignments\/export/)) return null;
  if (u.match(/\/api\/admin\/assignments\/history/)) return MOCK_ASSIGNMENT_HISTORY;
  if (u.match(/\/api\/admin\/assignments\/by-lecturer\//)) {
    const lecturerId = u.split("/by-lecturer/")[1]?.split("?")[0];
    return MOCK_ASSIGNMENTS.filter((a) => a.lecturerId === lecturerId);
  }
  if (u.match(/\/api\/admin\/assignments/) && m === "POST" && !u.includes("auto") && !u.includes("import")) {
    return { assignedCount: 0, createdCount: 0, updatedCount: 0, failedCount: 0, errors: [] };
  }
  if (u.match(/\/api\/admin\/assignments/) && m === "DELETE") return null;
  if (u.includes("/api/admin/assignments")) return MOCK_ASSIGNMENTS;

  // ─── Admin Notifications ─────────────────────────────────────────────
  if (u.match(/\/api\/admin\/notifications\/broadcast/) && m === "POST") {
    return { recipientCount: 11, sentAt: new Date().toISOString() };
  }
  if (u.match(/\/api\/admin\/notifications\/campaign/) && m === "DELETE") return undefined;
  if (u.includes("/api/admin/notifications")) return MOCK_ADMIN_NOTIFICATIONS;

  // ─── Notifications (shared) ──────────────────────────────────────────
  if (u.includes("/api/notification/unread-count")) return 2;
  if (u.match(/\/api\/notification\/mark-all-read/) && m === "POST") return 2;
  if (u.match(/\/api\/notification\/mark-read\//) && m === "POST") return undefined;
  if (u.includes("/api/notification/mine")) return MOCK_NOTIFICATIONS;

  // ─── Lecturer Routes ─────────────────────────────────────────────────
  if (u.includes("/api/lecturer/dashboard")) return MOCK_LECTURER_DASHBOARD_STATS;
  if (u.includes("/api/lecturer/analytics/weekly-trend")) return MOCK_WEEKLY_TREND;
  if (u.includes("/api/lecturer/students") && !u.includes("submissions") && !u.includes("notify") && !u.includes("remind")) {
    if (u.includes("/notify") && m === "POST") return { notifiedCount: 3 };
    return MOCK_LECTURER_STUDENTS.filter((s) => {
      // In demo mode for lecturer, only return students assigned to lecturer 1
      return MOCK_ASSIGNMENTS.some((a) => a.studentId === s.studentId && a.lecturerId === guid("lec-1"));
    });
  }
  if (u.match(/\/api\/lecturer\/students\/[^/]+\/remind/) && m === "POST") {
    return { message: "Đã nhắc nhở sinh viên." };
  }
  if (u.match(/\/api\/lecturer\/students\/notify/) && m === "POST") return { notifiedCount: 3 };

  if (u.includes("/api/lecturer/internships") && !u.includes("submissions") && !u.includes("notes")) {
    // Check if it's getAllSubmissions
    return MOCK_INTERNSHIPS.filter((i) =>
      MOCK_ASSIGNMENTS.some((a) => a.internshipId === i.id && a.lecturerId === guid("lec-1")),
    );
  }
  if (u.match(/\/api\/lecturer\/internships\/[^/]+\/submissions/)) return MOCK_SUBMISSIONS;
  if (u.match(/\/api\/lecturer\/internships\/[^/]+\/notes/) && m === "PUT") return undefined;
  if (u.match(/\/api\/lecturer\/internships\/[^/]+$/) && m === "GET") {
    const id = u.split("/").filter(Boolean).pop();
    const internship = MOCK_INTERNSHIPS.find((i) => i.id === id) ?? MOCK_INTERNSHIPS[0];
    return { ...internship, submissions: MOCK_SUBMISSIONS.filter((s) => s.internshipId === internship.id) };
  }

  if (u.includes("/api/lecturer/submissions") && !u.includes("download-zip")) {
    return MOCK_SUBMISSIONS.filter((s) =>
      MOCK_INTERNSHIPS.some((i) => i.id === s.internshipId &&
        MOCK_ASSIGNMENTS.some((a) => a.internshipId === i.id && a.lecturerId === guid("lec-1")),
      ),
    );
  }
  if (u.match(/\/api\/lecturer\/submissions\/download-zip/) && m === "POST") return null;

  if (u.includes("/api/lecturer/weekly-reports")) return {
    items: MOCK_WEEKLY_REPORTS.filter((r) => {
      return MOCK_INTERNSHIPS.some((i) => i.id === r.internshipId &&
        MOCK_ASSIGNMENTS.some((a) => a.internshipId === i.id && a.lecturerId === guid("lec-1")));
    }),
    total: 4, skip: 0, take: 20,
  };

  if (u.includes("/api/lecturer/companies")) return MOCK_LECTURER_COMPANIES;
  if (u.match(/\/api\/lecturer\/enterprises\/[^/]+/)) return MOCK_COMPANY_DETAIL;
  if (u.match(/\/api\/lecturer\/evaluations\/[^/]+\/defense/) && m === "PUT") {
    return { ...MOCK_EVALUATIONS[0], defenseStatus: "Scheduled" } as unknown as EvaluationDetailDto;
  }

  // ─── Student Routes ──────────────────────────────────────────────────
  if (u.includes("/api/studentportal/me") && m === "GET") return MOCK_STUDENT_PORTAL;
  if (u.includes("/api/studentportal/me") && m === "PUT") return MOCK_STUDENTS[0];
  if (u.match(/\/api\/studentportal\/internship-certificate/)) return null; // download

  if (u.match(/\/api\/student\/[^/]+$/)) {
    return MOCK_STUDENTS.find((s) => s.id === u.split("/").filter(Boolean).pop()) ?? MOCK_STUDENTS[0];
  }

  // ─── Weekly Reports ──────────────────────────────────────────────────
  if (u.match(/\/api\/weeklyreport\/mine/)) {
    return MOCK_WEEKLY_REPORTS.filter((r) =>
      MOCK_INTERNSHIPS.some((i) => i.id === r.internshipId && i.studentId === guid("stu-1")),
    );
  }
  if (u.match(/\/api\/weeklyreport\/internship\//)) {
    const internshipId = u.split("/internship/")[1]?.split("?")[0];
    return MOCK_WEEKLY_REPORTS.filter((r) => r.internshipId === internshipId);
  }
  if (u.match(/\/api\/weeklyreport\/versions\/[^/]+\/download/)) return null;
  if (u.match(/\/api\/weeklyreport\/[^/]+\/versions/)) return MOCK_WEEKLY_REPORT_VERSIONS;
  if (u.match(/\/api\/weeklyreport\/[^/]+\/download/)) return null;
  if (u.match(/\/api\/weeklyreport\/[^/]+\/student-reply/) && m === "POST") {
    return { id: guid("fb-stu-1"), comment: "Đã phản hồi", authorRole: "Student", createdAt: new Date().toISOString() } as unknown as FeedbackDto;
  }
  if (u.match(/\/api\/weeklyreport\/[^/]+\/feedback\/read/) && m === "POST") return undefined;
  if (u.match(/\/api\/weeklyreport\/[^/]+\/submit/) && m === "POST") {
    return { ...MOCK_WEEKLY_REPORTS[3], status: "Submitted" };
  }
  if (u.match(/\/api\/weeklyreport\/[^/]+\/review/) && m === "POST") {
    return { ...MOCK_WEEKLY_REPORTS[0], status: "Approved" };
  }
  if (u.match(/\/api\/weeklyreport\/[^/]+$/) && m === "PUT") {
    const id = u.split("/").filter(Boolean).pop();
    const report = MOCK_WEEKLY_REPORTS.find((r) => r.id === id) ?? MOCK_WEEKLY_REPORTS[0];
    return report;
  }
  if (u.match(/\/api\/weeklyreport\/[^/]+$/) && m === "GET") {
    const id = u.split("/").filter(Boolean).pop();
    return MOCK_WEEKLY_REPORTS.find((r) => r.id === id) ?? MOCK_WEEKLY_REPORTS[0];
  }
  if (u.includes("/api/weeklyreport") && m === "POST") {
    return { id: guid("wr-new"), weekNumber: 5, title: "Báo cáo mới", content: "", status: "Draft", createdAt: new Date().toISOString() } as WeeklyReportDto;
  }
  if (u.match(/\/api\/weeklyreport\/upload/) && m === "POST") {
    return MOCK_WEEKLY_REPORTS[0];
  }

  // ─── Submissions ─────────────────────────────────────────────────────
  if (u.match(/\/api\/submission\/mine/)) {
    return MOCK_SUBMISSIONS.filter((s) =>
      MOCK_INTERNSHIPS.some((i) => i.id === s.internshipId && i.studentId === guid("stu-1")),
    );
  }
  if (u.match(/\/api\/submission\/internship\//)) {
    const internshipId = u.split("/internship/")[1]?.split("?")[0];
    return MOCK_SUBMISSIONS.filter((s) => s.internshipId === internshipId);
  }
  if (u.match(/\/api\/submission\/[^/]+\/assets\/[^/]+\/download/)) return null;
  if (u.match(/\/api\/submission\/[^/]+\/download/)) return null;
  if (u.match(/\/api\/submission\/[^/]+\/student-reply/) && m === "POST") {
    return { ...MOCK_SUBMISSIONS[0], feedbacks: [...(MOCK_SUBMISSIONS[0].feedbacks ?? []), { id: guid("fb-stu-sub"), comment: "Đã phản hồi", authorRole: "Student", createdAt: new Date().toISOString() } as FeedbackDto] };
  }
  if (u.match(/\/api\/submission\/[^/]+\/feedback\/read/) && m === "POST") return undefined;
  if (u.match(/\/api\/submission\/[^/]+\/feedback/) && m === "POST") {
    return MOCK_SUBMISSIONS[0];
  }
  if (u.match(/\/api\/submission\/[^/]+\/status/) && m === "PATCH") {
    return { ...MOCK_SUBMISSIONS[0], status: body && typeof body === "object" ? (body as { status?: string }).status : "Reviewed" };
  }
  if (u.match(/\/api\/submission\/[^/]+\/resubmit-upload/) && m === "POST") {
    return { ...MOCK_SUBMISSIONS[0], version: 2, status: "Submitted" };
  }
  if (u.match(/\/api\/submission\/[^/]+\/resubmit/) && m === "POST") {
    return { ...MOCK_SUBMISSIONS[0], version: 2 };
  }
  if (u.match(/\/api\/submission\/[^/]+$/) && m === "GET") {
    const id = u.split("/").filter(Boolean).pop();
    return MOCK_SUBMISSIONS.find((s) => s.id === id) ?? MOCK_SUBMISSIONS[0];
  }
  if (u.includes("/api/submission") && m === "POST") {
    return { id: guid("sub-new"), type: "FinalReport", status: "Submitted", version: 1, submittedAt: new Date().toISOString() } as SubmissionDto;
  }

  // ─── Evaluation ──────────────────────────────────────────────────────
  if (u.match(/\/api\/evaluation\/internship\/[^/]+/)) {
    return null; // No evaluations yet
  }
  if (u.match(/\/api\/evaluation\/[^/]+\/finalize/) && m === "POST") {
    return { ...MOCK_EVALUATIONS[0], isFinalized: true } as unknown as EvaluationDetailDto;
  }
  if (u.match(/\/api\/evaluation\/[^/]+$/) && m === "GET") {
    return MOCK_EVALUATIONS[0] as unknown as EvaluationDetailDto;
  }
  if (u.match(/\/api\/evaluation\/[^/]+$/) && m === "PUT") {
    return { ...MOCK_EVALUATIONS[0], technicalScore: 8 } as unknown as EvaluationDetailDto;
  }
  if (u.includes("/api/evaluation") && m === "POST") {
    const b = body as Record<string, unknown> | undefined;
    return { id: guid("eval-new"), internshipId: b?.internshipId, technicalScore: b?.technicalScore ?? 8, communicationScore: b?.communicationScore ?? 8, teamworkScore: b?.teamworkScore ?? 8, initiativeScore: b?.initiativeScore ?? 8, finalGrade: 8, isFinalized: false, defenseStatus: "NotScheduled", createdAt: new Date().toISOString() } as unknown as EvaluationDetailDto;
  }
  if (u.includes("/api/evaluation")) return MOCK_EVALUATIONS;

  // ─── Company (active) ────────────────────────────────────────────────
  if (u.includes("/api/company/active")) return MOCK_COMPANIES.filter((c) => c.isActive);

  // ─── Lecturer Profile (get by id) ────────────────────────────────────
  if (u.match(/\/api\/lecturer\/[^/]+$/) && m === "GET" && !u.includes("internships") && !u.includes("students") && !u.includes("companies") && !u.includes("submissions") && !u.includes("weekly-reports") && !u.includes("notifications") && !u.includes("evaluations")) {
    return MOCK_LECTURERS[0];
  }

  // ─── Lecturer Notifications ──────────────────────────────────────────
  if (u.includes("/api/lecturer/notifications")) return MOCK_NOTIFICATIONS;

  // ─── Lecturer Account ────────────────────────────────────────────────
  if (u.match(/\/api\/lecturer\/account/)) {
    return MOCK_LECTURERS[0];
  }

  // ─── Student Notifications ───────────────────────────────────────────
  if (u.includes("/api/student/notifications")) return MOCK_NOTIFICATIONS;

  // ─── Fallback: semesters for non-admin ────────────────────────────────
  if (u.includes("/api/semesters")) return MOCK_SEMESTERS;

  // Return undefined to signal "not mocked" — let the real fetch happen
  return undefined;
}
