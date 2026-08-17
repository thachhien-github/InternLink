import type {
  StudentProfile,
  StudentTask,
  StudentReportDeadline,
  StudentFeedback,
  StudentNotification,
} from "../types/common";

export const STUDENT_PROFILE: StudentProfile = {
  name: "Nguyễn Văn A",
  mssv: "2421160088",
  class: "C24A.TH1",
  semester: "Học kỳ I - 2026",
  major: "Kỹ thuật Phần mềm",
  company: "FPT Software",
  companyLogo:
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
  position: "Thực tập sinh Frontend (ReactJS)",
  statusBadge: "Đang thực tập",
  overallProgress: 84,
  currentGrade: 8.6,
  reportsSubmitted: 5,
  totalReports: 6,
  daysLeftForReport: 3,
  lecturerName: "Thầy Nguyễn Văn Phước",
  supervisorName: "Anh Trần Hoàng - Tech Lead Frontend",
  supervisorEmail: "hoang.tran@fpt.com",
  supervisorPhone: "0912 345 678",
  companyAddress: "Tòa nhà FPT, Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội",
  currentPhase: "Đang thực tập (5–6 tuần)",
};

export const INITIAL_STUDENT_TASKS: StudentTask[] = [
  {
    id: "st-1",
    title: "Nộp báo cáo tuần 6: Xây dựng UI & Tích hợp State Management",
    deadline: "23:59 hôm nay (15/09)",
    priority: "Cao",
    actionLabel: "Nộp ngay",
    completed: false,
    category: "Báo cáo",
  },
  {
    id: "st-2",
    title: "Upload Source Code đồ án thực tập lên Repository trường",
    deadline: "20/09/2026",
    priority: "Trung bình",
    actionLabel: "Upload",
    completed: false,
    category: "Source code",
  },
  {
    id: "st-3",
    title: "Chỉnh sửa báo cáo tuần 5 theo góp ý của Giảng viên (Thêm ERD)",
    deadline: "18/09/2026",
    priority: "Cao",
    actionLabel: "Chỉnh sửa",
    completed: false,
    category: "Sửa đổi",
  },
  {
    id: "st-4",
    title:
      "Xác nhận tiếp nhận và quy chế thực tập từ Doanh nghiệp FPT Software",
    deadline: "12/09/2026",
    priority: "Bình thường",
    actionLabel: "Đã xác nhận",
    completed: true,
    category: "Xác nhận",
  },
];

export const STUDENT_REPORT_DEADLINES: StudentReportDeadline[] = [
  {
    id: "rd-1",
    weekName: "Báo cáo tuần 4",
    deadlineDate: "08/09",
    status: "Đã hoàn thành",
    score: 8.8,
    urgent: false,
  },
  {
    id: "rd-2",
    weekName: "Báo cáo tuần 5",
    deadlineDate: "15/09",
    status: "Đã hoàn thành",
    score: 8.5,
    urgent: false,
  },
  {
    id: "rd-3",
    weekName: "Báo cáo tuần 6",
    deadlineDate: "22/09",
    status: "Sắp đến hạn",
    urgent: true,
  },
  {
    id: "rd-4",
    weekName: "Báo cáo giữa kỳ",
    deadlineDate: "28/09",
    status: "Sắp tới",
    urgent: false,
  },
  {
    id: "rd-5",
    weekName: "Báo cáo cuối kỳ",
    deadlineDate: "05/10",
    status: "Chưa tới",
    urgent: false,
  },
];

export const STUDENT_FEEDBACKS: StudentFeedback[] = [
  {
    id: "fb-1",
    senderName: "Thầy Nguyễn Văn Phước",
    senderRole: "Giảng viên",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    timeAgo: "10 phút trước",
    preview:
      "Báo cáo tuần 5 trình bày rất chi tiết. Cần bổ sung sơ đồ ERD cho module Payment trong tuần 6 tới.",
    detail:
      "Thầy đã nhận xét báo cáo tuần 5 của em. Phần tổng quan công việc và thời gian làm việc tại doanh nghiệp rất đầy đủ. Tuy nhiên để đạt điểm tối đa ở phần kiến trúc hệ thống, em cần vẽ sơ đồ quan hệ cơ sở dữ liệu (ERD) cho module Payment mà em phụ trách. Tiếp tục phát huy nhé!",
    status: "Đã phản hồi",
    reportRef: "Báo cáo tuần 5",
  },
  {
    id: "fb-2",
    senderName: "Anh Trần Hoàng - Tech Lead",
    senderRole: "Doanh nghiệp",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    timeAgo: "2 giờ trước",
    preview:
      "Xác nhận em A làm việc chủ động, hoàn thành đúng tiến độ task React UI và phối hợp tốt với team Backend.",
    detail:
      "Nguyễn Văn A có tinh thần học hỏi rất cao. Trong 2 tuần vừa qua, em đã tự chủ động học Tailwind và Zustand để hoàn thành 4 trang UI quan trọng cho dự án. Mức độ tuân thủ giờ giấc làm việc tại FPT Software đạt 100%. Đánh giá xuất sắc.",
    status: "Đánh giá tốt",
    reportRef: "Đánh giá hàng tháng DN",
  },
];

export const STUDENT_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "sn-1",
    title:
      "Biểu mẫu mới: Mẫu phiếu đánh giá doanh nghiệp đợt I 2026 đã sẵn sàng tải về.",
    timeAgo: "15 phút trước",
    unread: true,
    type: "form",
  },
  {
    id: "sn-2",
    title: "Giảng viên Nguyễn Văn Phước đã phản hồi Báo cáo tuần 5 của bạn.",
    timeAgo: "1 giờ trước",
    unread: true,
    type: "feedback",
  },
  {
    id: "sn-3",
    title:
      "Cảnh báo hạn nộp: Báo cáo tuần 6 còn 3 ngày nữa là hết hạn (23:59 - 22/09).",
    timeAgo: "3 giờ trước",
    unread: true,
    type: "deadline",
  },
  {
    id: "sn-4",
    title:
      "Doanh nghiệp FPT Software đã xác nhận tiếp nhận hồ sơ thực tập sinh.",
    timeAgo: "1 ngày trước",
    unread: false,
    type: "company",
  },
];
