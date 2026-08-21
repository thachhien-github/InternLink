import { useState, useEffect, useMemo } from "react";
import { Toast } from "../../../components/common/Toast";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import {
  Bell,
  Send,
  UserCheck,
  AlertTriangle,
  Info,
  Clock,
  Search,
  Plus,
  Trash2,
  Mail,
  User,
  Building2,
  Calendar,
  Paperclip,
  FileText,
  AlertCircle,
  X,
  Share2,
  Eye,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  KeyRound,
  UserCog,
  FolderSync,
  History,
  CornerDownRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapNotificationDtoToLecturerUi } from "../../../lib/portalMappers";
import { notificationService } from "../../../services/notification.service";
import { INITIAL_STUDENTS } from "../../../data/mockData";

export interface SystemNotificationItem {
  id: string;
  title: string;
  desc: string;
  type: "system" | "admin" | "deadline" | "feedback" | "enterprise" | "urgent" | "student";
  category: "Hệ thống & Admin" | "Tiến độ Deadline" | "Phản hồi SV" | "Doanh nghiệp" | "Thông báo chung";
  priority: "Thông thường" | "Quan trọng" | "Khẩn cấp";
  color: "blue" | "emerald" | "amber" | "rose" | "purple" | "slate";
  isUnread: boolean;
  time: string;
  dateIso?: string;
  sender: string;
  senderRole?: string;
  receiver: string;
  student?: string;
  studentMssv?: string;
  studentClass?: string;
  company?: string;
  content: string;
  attachments?: string[];
  systemActionType?: "ACCOUNT_PROVISION" | "ACCOUNT_UPDATE" | "SEMESTER_OPEN" | "SEMESTER_CLOSE" | "SECURITY_POLICY" | "GENERAL_ADMIN";
  feedbackStatus?: "Cần trả lời" | "Đang xử lý" | "Đã giải quyết";
  replies?: {
    id: string;
    sender: string;
    senderRole: string;
    content: string;
    time: string;
  }[];
  deadlineMeta?: {
    milestoneName: string;
    dueDate: string;
    overdueDays?: number;
    hoursLeft?: number;
    submittedCount: number;
    totalCount: number;
    status: "overdue" | "upcoming" | "completed";
  };
}

export interface ScheduledBroadcast {
  id: string;
  title: string;
  audience: string;
  scheduleTime: string;
  priority: "Thông thường" | "Quan trọng" | "Khẩn cấp";
  status: "Đã lên lịch" | "Đang chờ gửi" | "Đã gửi";
  content?: string;
  attachments?: string[];
}

const INITIAL_MOCK_NOTIFICATIONS: SystemNotificationItem[] = [
  // 1. THÔNG BÁO TỪ HỆ THỐNG / ADMIN
  {
    id: "notif-sys-1",
    title: "Mở đợt thực tập tốt nghiệp Học kỳ I - 2026 & Phân công hướng dẫn",
    desc: "Ban Chủ nhiệm Khoa CNTT đã chính thức mở đợt thực tập HK I - 2026 và phân bổ 28 sinh viên vào nhóm hướng dẫn.",
    type: "admin",
    category: "Hệ thống & Admin",
    systemActionType: "SEMESTER_OPEN",
    priority: "Quan trọng",
    color: "blue",
    isUnread: true,
    time: "08:30 - Hôm nay",
    sender: "Admin Ban Chủ nhiệm Khoa CNTT",
    senderRole: "Quản trị viên Đào tạo",
    receiver: "Giảng viên Trần Minh Huy",
    content: `Kính gửi Thầy Trần Minh Huy,

Khoa Công nghệ Thông tin thông báo chính thức mở đợt Thực tập tốt nghiệp Học kỳ I - Năm học 2026.
Chi tiết phân công và cấu hình đợt thực tập:
- Tên đợt: Thực tập tốt nghiệp HK I (2026 - 2027)
- Số lượng sinh viên phân bổ cho Thầy: 28 sinh viên (Lớp C24A.TH1 và C24A.TH2)
- Thời gian đợt: 15/08/2026 đến 30/11/2026
- Thời hạn phê duyệt kế hoạch và đề cương: 30/08/2026
- Thời hạn chấm điểm tổng kết: 25/11/2026

Thầy vui lòng kiểm tra danh sách sinh viên được phân bổ và liên hệ với các doanh nghiệp tiếp nhận để đối soát thông tin.`,
    attachments: [
      "QuyDinh_ThucTap_HK1_2026.pdf",
      "DanhSach_PhanCong_GVHD_2026.xlsx",
    ],
  },
  {
    id: "notif-sys-2",
    title: "Cấp tài khoản & Phân quyền Giảng viên Hướng dẫn Đợt 2026",
    desc: "Tài khoản SSO giảng viên đã được kích hoạt đầy đủ quyền chấm điểm, duyệt báo cáo và liên kết doanh nghiệp.",
    type: "admin",
    category: "Hệ thống & Admin",
    systemActionType: "ACCOUNT_PROVISION",
    priority: "Thông thường",
    color: "purple",
    isUnread: false,
    time: "14:15 - Hôm qua",
    sender: "Hệ thống Quản trị Tài khoản & Phân quyền (IT Admin)",
    senderRole: "Admin Kỹ thuật",
    receiver: "Giảng viên Trần Minh Huy (huy.tm@vlu.edu.vn)",
    content: `Thông báo cấp quyền tài khoản Giảng viên:
- Tài khoản: huy.tm@vlu.edu.vn
- Quyền hạn: Giảng viên Hướng dẫn chính thức (Lecturer Supervisor)
- Phân hệ truy cập:
  + Cổng Giảng viên (/lecturer)
  + Quản lý Báo cáo tuần & Chấm điểm giữa kỳ / cuối kỳ
  + Kết nối & Đánh giá Doanh nghiệp tiếp nhận
  + Phát thông báo trực tiếp cho sinh viên thuộc nhóm hướng dẫn
Tài khoản đã đồng bộ với hệ thống Microsoft Office 365 / Google Workspace của Nhà trường.`,
    attachments: ["HuongDan_SuDung_HeThong_GV.pdf"],
  },
  {
    id: "notif-sys-3",
    title: "Cập nhật chính sách bảo mật & Đồng bộ thông tin tài khoản",
    desc: "Yêu cầu bật xác thực 2 bước (2FA) và rà soát lại thông tin liên hệ phục vụ liên lạc khẩn cấp.",
    type: "system",
    category: "Hệ thống & Admin",
    systemActionType: "SECURITY_POLICY",
    priority: "Thông thường",
    color: "slate",
    isUnread: false,
    time: "25/10/2026",
    sender: "Phòng Công nghệ Thông tin & An toàn Dữ liệu",
    senderRole: "Security Center",
    receiver: "Toàn thể Cán bộ - Giảng viên",
    content: `Nhằm đảm bảo an toàn thông tin dữ liệu điểm và hồ sơ thực tập của sinh viên, hệ thống đã cập nhật chính sách bảo mật định kỳ:
1. Yêu cầu kích hoạt bảo mật 2 lớp qua ứng dụng Authenticator hoặc SMS.
2. Kiểm tra lại thông tin số điện thoại và email phụ tại mục Tài khoản.
3. Không chia sẻ phiên đăng nhập cho bên thứ ba.`,
    attachments: [],
  },
  {
    id: "notif-sys-4",
    title: "Nhắc nhở: Hệ thống sẽ đóng đợt thực tập HK I & Khóa sổ nộp điểm sau 5 ngày",
    desc: "Hạn chót nhập điểm quá trình và phê duyệt báo cáo cuối kỳ là 23:59 ngày 30/10/2026.",
    type: "admin",
    category: "Hệ thống & Admin",
    systemActionType: "SEMESTER_CLOSE",
    priority: "Khẩn cấp",
    color: "rose",
    isUnread: true,
    time: "07:45 - Hôm nay",
    sender: "Hệ thống Quản lý Đào tạo Khoa CNTT",
    senderRole: "Ban Đào tạo",
    receiver: "Giảng viên Trần Minh Huy",
    content: `Kính gửi Giảng viên,

Hệ thống ghi nhận đợt thực tập Học kỳ I - 2026 sẽ chính thức ĐÓNG và KHÓA SỔ nhập điểm vào 23:59 ngày 30/10/2026.
Đề nghị Thầy/Cô:
1. Hoàn tất việc chấm điểm 100% sinh viên thuộc nhóm hướng dẫn.
2. Kiểm tra các phiếu đánh giá từ Doanh nghiệp (đã nộp đủ hay chưa).
3. Xuất file bảng điểm cuối kỳ có chữ ký số hoặc nộp file PDF ký tên về Văn phòng Khoa.

Sau thời điểm trên, hệ thống sẽ tự động chuyển sang chế độ Lưu trữ (Archived) và không cho phép chỉnh sửa điểm.`,
    attachments: ["BienBan_KhoaSo_Diem_HK1.docx"],
  },

  // 2. TIẾN ĐỘ DEADLINE CỦA SINH VIÊN
  {
    id: "notif-dl-1",
    title: "CẢNH BÁO: Đinh Quốc Khánh quá hạn nộp Báo cáo Giữa kỳ (Trễ 4 ngày)",
    desc: "Sinh viên Đinh Quốc Khánh (MSSV: 2421160051) chưa hoàn thành nộp Báo cáo giữa kỳ theo mốc quy định.",
    type: "deadline",
    category: "Tiến độ Deadline",
    priority: "Khẩn cấp",
    color: "rose",
    isUnread: true,
    time: "09:15 - Hôm nay",
    sender: "Hệ thống Kiểm soát Tiến độ & Deadline",
    senderRole: "Auto Tracker",
    receiver: "Giảng viên Trần Minh Huy",
    student: "Đinh Quốc Khánh",
    studentMssv: "2421160051",
    studentClass: "C24A.TH1",
    company: "Viettel Group (Mentor: Lê Tuấn Vũ)",
    deadlineMeta: {
      milestoneName: "Báo cáo Giữa kỳ",
      dueDate: "24/10/2026 23:59",
      overdueDays: 4,
      submittedCount: 26,
      totalCount: 28,
      status: "overdue",
    },
    content: `Cảnh báo trễ hạn nộp bài:
- Sinh viên: Đinh Quốc Khánh (MSSV: 2421160051 - Lớp C24A.TH1)
- Doanh nghiệp thực tập: Viettel Group
- Hạng mục: Báo cáo Giữa kỳ
- Hạn chót quy định: 23:59 ngày 24/10/2026 (Đã quá hạn 4 ngày)
- Trạng thái bài nộp hiện tại: Bản nộp lần 1 bị yêu cầu chỉnh sửa do thiếu xác nhận doanh nghiệp và chưa nộp lại.

Hệ thống gợi ý Thầy gửi thông báo nhắc nhở khẩn cấp hoặc liên hệ sinh viên để hỗ trợ kịp thời.`,
    attachments: ["PhieuDanhGia_GiuaKy_Viettel.pdf"],
  },
  {
    id: "notif-dl-2",
    title: "Sắp đến hạn: Báo cáo tuần 6 sẽ kết thúc trong 24 giờ tới (Còn 3 sinh viên chưa nộp)",
    desc: "Mốc Báo cáo tuần 6 có 25/28 sinh viên đã nộp. 3 sinh viên cần hoàn tất trước 23:59 ngày mai.",
    type: "deadline",
    category: "Tiến độ Deadline",
    priority: "Quan trọng",
    color: "amber",
    isUnread: false,
    time: "11:20 - Hôm nay",
    sender: "Hệ thống Quản lý Bài nộp",
    senderRole: "Auto Monitor",
    receiver: "Giảng viên Trần Minh Huy",
    deadlineMeta: {
      milestoneName: "Báo cáo Tuần 6",
      dueDate: "26/10/2026 23:59",
      hoursLeft: 24,
      submittedCount: 25,
      totalCount: 28,
      status: "upcoming",
    },
    content: `Theo dõi tiến độ nộp Báo cáo tuần 6:
- Tổng số sinh viên: 28 sinh viên
- Đã nộp đúng hạn: 25 sinh viên (89.3%)
- Chưa nộp: 3 sinh viên:
  1. Nguyễn Minh Phúc (MSSV: 2421160046 - FPT Software)
  2. Bành Minh Tài (MSSV: 2421160008 - CMC Global)
  3. Trần Nguyễn Tiên Thy (MSSV: 2321160029 - MISA Software)
- Thời hạn chót: 23:59 ngày 26/10/2026.`,
    attachments: [],
  },

  // 3. PHẢN HỒI & THẮC MẮC TỪ SINH VIÊN
  {
    id: "notif-fb-1",
    title: "Sinh viên Trần Tuấn Anh gửi thắc mắc về tích hợp SSO và xin ý kiến đề tài",
    desc: "Em xin phép hỏi Thầy về phần sơ đồ kiến trúc Microservices và cơ chế JWT Refresh Token tại FPT.",
    type: "feedback",
    category: "Phản hồi SV",
    priority: "Thông thường",
    color: "emerald",
    isUnread: true,
    time: "15:30 - Hôm nay",
    sender: "Trần Tuấn Anh",
    senderRole: "Sinh viên Lớp C24A.TH1",
    receiver: "Giảng viên Trần Minh Huy",
    student: "Trần Tuấn Anh",
    studentMssv: "2421160043",
    studentClass: "C24A.TH1",
    company: "FPT Software (Vị trí: Fullstack Intern)",
    feedbackStatus: "Cần trả lời",
    content: `Kính gửi Thầy Minh Huy,

Trong quá trình thực hiện Báo cáo tuần 6 và chuẩn bị cho phần Demo sản phẩm tại FPT Software, nhóm em có một thắc mắc về mô hình phân tách Microservices:
1. Hiện tại dự án sử dụng API Gateway (Kong) kết hợp OAuth2 / JWT. Trong báo cáo, em có nên vẽ chi tiết luồng Refresh Token và sơ đồ DB phân tán không ạ?
2. Mentor tại công ty (anh Nguyễn Văn Hải) đã đồng ý duyệt phần Source code, nhưng đề xuất bổ sung thêm phần kiểm thử tải (Load Testing với k6). Thầy có yêu cầu bắt buộc phần này trong slide bảo vệ không ạ?

Em cảm ơn Thầy nhiều ạ!`,
    attachments: ["SoDo_KienTruc_FPT_Draft.png"],
    replies: [
      {
        id: "rep-1",
        sender: "Giảng viên Trần Minh Huy",
        senderRole: "Giảng viên Hướng dẫn",
        content:
          "Chào Tuấn Anh. Luồng Refresh Token và sơ đồ DB phân tán rất được khuyến khích đưa vào mục 3.2 của báo cáo. Phần Load Testing k6 sẽ là điểm cộng lớn khi bảo vệ trước hội đồng. Em tiếp tục phát huy nhé.",
        time: "16:00 - Hôm nay",
      },
    ],
  },
  {
    id: "notif-fb-2",
    title: "Sinh viên Bành Minh Tài đề xuất xin gia hạn nộp hồ sơ tiếp nhận doanh nghiệp",
    desc: "Doanh nghiệp CMC Global đang hoàn tất ký số đóng dấu mộc hợp đồng thực tập nên bị chậm 2 ngày.",
    type: "feedback",
    category: "Phản hồi SV",
    priority: "Quan trọng",
    color: "amber",
    isUnread: false,
    time: "10:45 - Hôm qua",
    sender: "Bành Minh Tài",
    senderRole: "Sinh viên Lớp C24A.TH1",
    receiver: "Giảng viên Trần Minh Huy",
    student: "Bành Minh Tài",
    studentMssv: "2421160008",
    studentClass: "C24A.TH1",
    company: "CMC Global (Chưa hoàn tất dấu mộc)",
    feedbackStatus: "Đang xử lý",
    content: `Dạ em chào Thầy ạ,

Em xin phép báo cáo tình hình tiếp nhận thực tập tại CMC Global. Hiện tại Phòng Nhân sự công ty đã gửi thư tiếp nhận (Offer letter) và em đã đi làm từ tuần trước. Tuy nhiên do Giám đốc nhân sự đang đi công tác nên giấy tiếp nhận thực tập có mộc đỏ của trường gửi sang dự kiến đến thứ 4 mới có chữ ký và dấu mộc chính thức.

Em xin phép Thầy cho em gia hạn thời gian nộp bản scan Phiếu tiếp nhận có mộc đỏ đến hết thứ 4 tuần này ạ. Em xin đính kèm Offer Letter trước để Thầy xem qua ạ.`,
    attachments: ["OfferLetter_CMC_Global_TaiBM.pdf"],
  },

  // 4. THÔNG BÁO TỪ DOANH NGHIỆP
  {
    id: "notif-ent-1",
    title: "Doanh nghiệp MB Bank gửi Phiếu đánh giá thực tập giữa kỳ cho Lê Đặng Quang Hậu",
    desc: "Mentor Vũ Thị Dung đánh giá sinh viên đạt 9.2/10 điểm với thái độ và kỹ năng an toàn thông tin xuất sắc.",
    type: "enterprise",
    category: "Doanh nghiệp",
    priority: "Thông thường",
    color: "emerald",
    isUnread: false,
    time: "09:30 - Hôm qua",
    sender: "Phòng Quản lý Đào tạo & Nhân tài - Ngân hàng TMCP Quân đội (MB Bank)",
    senderRole: "Doanh nghiệp Đối tác",
    receiver: "Giảng viên Trần Minh Huy",
    student: "Lê Đặng Quang Hậu",
    studentMssv: "2421010230",
    studentClass: "C24A.TH1",
    company: "MB Bank",
    content: `Kính gửi Thầy Trần Minh Huy,

Ngân hàng TMCP Quân đội (MB Bank) trân trọng gửi Thầy Phiếu đánh giá kết quả thực tập giai đoạn giữa kỳ của sinh viên Lê Đặng Quang Hậu (MSSV: 2421010230).
Sinh viên thể hiện tinh thần trách nhiệm cao, hoàn thành xuất sắc các bài kiểm thử bảo mật API cho hệ thống Mobile Banking thế hệ mới.
Điểm đánh giá chi tiết: 9.2 / 10 điểm.`,
    attachments: ["PhieuDanhGia_MBBank_LeDangQuangHau_KyTen.pdf"],
  },
];

const QUICK_COMPOSE_TEMPLATES = [
  {
    title: "Nhắc nhở nộp Báo cáo tuần",
    priority: "Quan trọng" as const,
    audience: "Sinh viên chưa nộp báo cáo",
    content: `Thông báo nhắc nhở nộp Báo cáo tuần:
Đề nghị các bạn sinh viên chưa hoàn tất nộp bài khẩn trương hoàn thiện và tải file báo cáo định dạng PDF lên hệ thống trước 23:59 ngày quy định.
Các trường hợp nộp muộn không có lý do chính đáng sẽ bị trừ điểm chuyên cần theo quy chế Khoa CNTT.`,
  },
  {
    title: "Triệu tập họp hướng dẫn & Rà soát tiến độ giữa kỳ",
    priority: "Thông thường" as const,
    audience: "Toàn bộ sinh viên hướng dẫn",
    content: `Thông báo họp nhóm hướng dẫn thực tập:
- Thời gian: 19:30 Thứ Sáu tuần này
- Hình thức: Trực tuyến qua Google Meet (Link: meet.google.com/abc-xyz)
- Nội dung:
  1. Rà soát tiến độ đề tài và khó khăn tại doanh nghiệp tiếp nhận.
  2. Hướng dẫn cấu trúc Báo cáo tổng kết và Slide thuyết trình.
  3. Giải đáp các thắc mắc về phiếu đánh giá doanh nghiệp.
Yêu cầu 100% sinh viên tham gia đầy đủ và đúng giờ.`,
  },
  {
    title: "CẢNH BÁO QUÁ HẠN: Yêu cầu nộp bổ sung hồ sơ khẩn",
    priority: "Khẩn cấp" as const,
    audience: "Sinh viên quá hạn",
    content: `CẢNH BÁO HẠN CHÓT:
Hệ thống ghi nhận bạn đã quá hạn nộp bài báo cáo / hồ sơ thực tập. Yêu cầu bạn liên hệ ngay với Giảng viên hướng dẫn trong ngày hôm nay và hoàn tất nộp bổ sung hồ sơ.
Nếu tiếp tục quá hạn, điểm giai đoạn này sẽ nhận mức Không Đạt (F).`,
  },
  {
    title: "Đôn đốc lấy xác nhận & Phiếu đánh giá từ Doanh nghiệp",
    priority: "Quan trọng" as const,
    audience: "Toàn bộ sinh viên hướng dẫn",
    content: `Nhắc nhở về Phiếu đánh giá Doanh nghiệp:
Hiện tại đã bước vào giai đoạn đánh giá tổng kết thực tập. Đề nghị các bạn gửi Phiếu đánh giá BM-04 cho Mentor/Cán bộ hướng dẫn tại doanh nghiệp để xin điểm và nhận xét chính thức kèm chữ ký mộc đỏ.
Hạn chót nộp bản scan lên hệ thống: 30/10/2026.`,
  },
];

export const NotificationsView = () => {
  // Main Tab Navigation
  const [activeTab, setActiveTab] = useState<
    "all" | "system" | "deadline" | "feedback" | "broadcast"
  >("all");

  const [notifications, setNotifications] = useState<SystemNotificationItem[]>(() => {
    if (!USE_MOCK) return [];
    try {
      const saved = localStorage.getItem("lecturer_notifications_v2");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MOCK_NOTIFICATIONS;
  });

  const [selectedNotif, setSelectedNotif] = useState<SystemNotificationItem | null>(
    () => notifications[0] || null,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("Tất cả");
  const [filterReadStatus, setFilterReadStatus] = useState("Tất cả");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Scheduled broadcasts
  const [scheduledList, setScheduledList] = useState<ScheduledBroadcast[]>([
    {
      id: "s1",
      title: "Nhắc nhở nộp Báo cáo Tuần 6 đợt HK I - 2026",
      audience: "Toàn bộ sinh viên Lớp C24A.TH1 (28 SV)",
      scheduleTime: "08:00 - 02/11/2026",
      priority: "Quan trọng",
      status: "Đã lên lịch",
      content: "Nhắc nhở nộp báo cáo tuần 6 trước 23:59.",
    },
    {
      id: "s2",
      title: "Yêu cầu doanh nghiệp xác nhận phiếu đánh giá cuối đợt",
      audience: "6 Doanh nghiệp hợp tác",
      scheduleTime: "09:00 - 05/11/2026",
      priority: "Khẩn cấp",
      status: "Đang chờ gửi",
      content: "Kính gửi quý Doanh nghiệp, đề nghị hoàn tất phiếu đánh giá.",
    },
  ]);

  // Reply state in active notification
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Compose modal state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTitle, setComposeTitle] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeAudience, setComposeAudience] = useState("Toàn bộ sinh viên hướng dẫn (28 SV)");
  const [composeSpecificStudent, setComposeSpecificStudent] = useState("");
  const [composePriority, setComposePriority] = useState<"Thông thường" | "Quan trọng" | "Khẩn cấp">("Thông thường");
  const [composeCategory, setComposeCategory] = useState<"Tiến độ Deadline" | "Phản hồi SV" | "Thông báo chung">("Thông báo chung");
  const [isScheduledOption, setIsScheduledOption] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [newFileName, setNewFileName] = useState("");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lecturer_notifications_v2", JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Load from API if not mock
  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await notificationService.getMine();
        if (cancelled) return;
        const mapped = rows.map((n): SystemNotificationItem => {
          const base = mapNotificationDtoToLecturerUi(n);
          return {
            id: base.id,
            title: base.title,
            desc: base.desc,
            type: base.type as any,
            category: "Hệ thống & Admin",
            priority: base.priority as any,
            color: base.color as any,
            isUnread: base.isUnread,
            time: base.time,
            sender: base.sender,
            receiver: base.receiver,
            content: base.content,
            attachments: base.attachments,
          };
        });
        setNotifications(mapped);
        setSelectedNotif(mapped[0] || null);
      } catch (err) {
        if (!cancelled) showToast(getApiErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        // Tab Category filtering
        if (activeTab === "system") {
          if (item.category !== "Hệ thống & Admin") return false;
        } else if (activeTab === "deadline") {
          if (item.category !== "Tiến độ Deadline") return false;
        } else if (activeTab === "feedback") {
          if (item.category !== "Phản hồi SV") return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.desc.toLowerCase().includes(q);
          const matchSender = item.sender.toLowerCase().includes(q);
          const matchStudent = item.student?.toLowerCase().includes(q);
          const matchMssv = item.studentMssv?.toLowerCase().includes(q);
          const matchCompany = item.company?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSender && !matchStudent && !matchMssv && !matchCompany) {
            return false;
          }
        }

        // Priority filter
        if (filterPriority !== "Tất cả" && item.priority !== filterPriority) {
          return false;
        }

        // Read status filter
        if (filterReadStatus === "Chưa đọc" && !item.isUnread) return false;
        if (filterReadStatus === "Đã đọc" && item.isUnread) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") return a.id.localeCompare(b.id);
        return b.id.localeCompare(a.id);
      });
  }, [notifications, activeTab, searchQuery, filterPriority, filterReadStatus, sortBy]);

  // Keep selected notification synchronized
  useEffect(() => {
    if (selectedNotif) {
      const found = notifications.find((n) => n.id === selectedNotif.id);
      if (found) {
        setSelectedNotif(found);
      } else if (filteredNotifications.length > 0) {
        setSelectedNotif(filteredNotifications[0]);
      } else {
        setSelectedNotif(null);
      }
    } else if (filteredNotifications.length > 0) {
      setSelectedNotif(filteredNotifications[0]);
    }
  }, [notifications, filteredNotifications]);

  // Counts for KPIs & Tabs
  const counts = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.isUnread).length;
    const system = notifications.filter((n) => n.category === "Hệ thống & Admin").length;
    const systemUnread = notifications.filter((n) => n.category === "Hệ thống & Admin" && n.isUnread).length;
    const deadline = notifications.filter((n) => n.category === "Tiến độ Deadline").length;
    const deadlineUrgent = notifications.filter((n) => n.category === "Tiến độ Deadline" && n.priority === "Khẩn cấp").length;
    const feedback = notifications.filter((n) => n.category === "Phản hồi SV").length;
    const feedbackPending = notifications.filter((n) => n.category === "Phản hồi SV" && n.feedbackStatus === "Cần trả lời").length;
    const urgent = notifications.filter((n) => n.priority === "Khẩn cấp").length;

    return {
      total,
      unread,
      system,
      systemUnread,
      deadline,
      deadlineUrgent,
      feedback,
      feedbackPending,
      urgent,
    };
  }, [notifications]);

  // Handlers
  const handleToggleRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = notifications.find((n) => n.id === id);
    if (!target) return;

    if (!USE_MOCK && target.isUnread) {
      try {
        await notificationService.markRead(id);
      } catch (err) {
        showToast(getApiErrorMessage(err));
        return;
      }
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: !n.isUnread } : n)),
    );
  };

  const handleMarkAllRead = async () => {
    if (!USE_MOCK) {
      try {
        await notificationService.markAllRead();
      } catch (err) {
        showToast(getApiErrorMessage(err));
        return;
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    showToast("Đã đánh dấu tất cả thông báo là đã đọc.");
  };

  const handleDeleteNotif = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    if (selectedNotif?.id === id) {
      setSelectedNotif(updated[0] || null);
    }
    showToast("Đã xóa thông báo khỏi danh sách.");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotif || !replyText.trim()) return;

    setIsSendingReply(true);
    setTimeout(() => {
      const newReply = {
        id: `rep-${Date.now()}`,
        sender: "Giảng viên Trần Minh Huy",
        senderRole: "Giảng viên Hướng dẫn",
        content: replyText.trim(),
        time: "Vừa xong",
      };

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedNotif.id
            ? {
                ...n,
                feedbackStatus: "Đã giải quyết",
                replies: [...(n.replies || []), newReply],
              }
            : n,
        ),
      );

      setReplyText("");
      setIsSendingReply(false);
      showToast(`Đã gửi câu trả lời tới ${selectedNotif.student || selectedNotif.sender}!`);
    }, 300);
  };

  const handleQuickComposeWithPreset = (template: typeof QUICK_COMPOSE_TEMPLATES[0]) => {
    setComposeTitle(template.title);
    setComposePriority(template.priority);
    setComposeAudience(template.audience);
    setComposeContent(template.content);
    setComposeOpen(true);
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTitle.trim() || !composeContent.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo!");
      return;
    }

    const finalAudience =
      composeAudience === "Theo sinh viên cụ thể" && composeSpecificStudent
        ? `Sinh viên: ${composeSpecificStudent}`
        : composeAudience;

    if (isScheduledOption) {
      const newScheduled: ScheduledBroadcast = {
        id: `sched_${Date.now()}`,
        title: composeTitle.trim(),
        audience: finalAudience,
        scheduleTime: scheduledDate || "08:00 - Ngày mai",
        priority: composePriority,
        status: "Đã lên lịch",
        content: composeContent.trim(),
        attachments: [...attachedFiles],
      };
      setScheduledList([newScheduled, ...scheduledList]);
      showToast(`Đã lên lịch phát thông báo tự động cho ${finalAudience}!`);
    } else {
      const newNotifItem: SystemNotificationItem = {
        id: `notif_sent_${Date.now()}`,
        title: composeTitle.trim(),
        desc: composeContent.trim().substring(0, 90) + "...",
        type: composePriority === "Khẩn cấp" ? "urgent" : "student",
        category: composeCategory,
        priority: composePriority,
        color:
          composePriority === "Khẩn cấp"
            ? "rose"
            : composePriority === "Quan trọng"
              ? "amber"
              : "blue",
        isUnread: false,
        time: "Vừa xong",
        sender: "Giảng viên Trần Minh Huy",
        receiver: finalAudience,
        content: composeContent.trim(),
        attachments: [...attachedFiles],
      };

      setNotifications([newNotifItem, ...notifications]);
      setSelectedNotif(newNotifItem);
      showToast(`Đã phát thông báo thành công tới: ${finalAudience}`);
    }

    // Reset Form
    setComposeOpen(false);
    setComposeTitle("");
    setComposeContent("");
    setAttachedFiles([]);
    setIsScheduledOption(false);
    setScheduledDate("");
  };

  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    setAttachedFiles([...attachedFiles, newFileName.trim()]);
    setNewFileName("");
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto animate-in fade-in duration-200 pb-12 font-sans min-w-0 overflow-hidden">
      {/* Toast Alert */}
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      {/* 1. PAGE HEADER */}
      <PageHeader
        icon={Bell}
        title="Trung tâm Thông báo & Trao đổi Giảng viên"
        subtitle="Theo dõi thông báo từ Khoa/Admin, giám sát tiến độ deadline của sinh viên, trao đổi giải đáp thắc mắc và tạo thông báo phát tới sinh viên."
        actions={[
          {
            label: "Tạo thông báo cho SV",
            icon: Plus,
            onClick: () => setComposeOpen(true),
            variant: "primary",
          },
          {
            label: "Cảnh báo Deadline trễ hạn",
            icon: AlertTriangle,
            onClick: () => {
              setActiveTab("deadline");
              handleQuickComposeWithPreset(QUICK_COMPOSE_TEMPLATES[0]);
            },
            variant: "secondary",
          },
          {
            label: "Đánh dấu tất cả đã đọc",
            icon: CheckCircle2,
            onClick: handleMarkAllRead,
            variant: "secondary",
          },
        ]}
      />

      {/* 2. 4 CORE KPI METRICS */}
      <KpiGrid>
        <KpiCard
          tone="blue"
          title="Thông báo Hệ thống & Admin"
          value={counts.system}
          unit={`(${counts.systemUnread} chưa đọc)`}
          icon={ShieldCheck}
          footer="Cấp TK, Mở/Đóng đợt, Quy chế Khoa"
          onClick={() => setActiveTab("system")}
        />
        <KpiCard
          tone="rose"
          title="Tiến độ Deadline SV"
          value={counts.deadline}
          unit="cảnh báo"
          icon={Clock}
          footer={`${counts.deadlineUrgent} mốc khẩn cấp / quá hạn`}
          onClick={() => setActiveTab("deadline")}
        />
        <KpiCard
          tone="emerald"
          title="Phản hồi từ Sinh viên"
          value={counts.feedback}
          unit="câu hỏi"
          icon={MessageSquare}
          footer={`${counts.feedbackPending} câu hỏi đang chờ trả lời`}
          onClick={() => setActiveTab("feedback")}
        />
        <KpiCard
          tone="amber"
          title="Thông báo đã phát cho SV"
          value={28}
          unit="SV tiếp nhận"
          icon={Send}
          footer={`${scheduledList.length} thông báo đã lên lịch`}
          onClick={() => setActiveTab("broadcast")}
        />
      </KpiGrid>

      {/* 3. MAIN NAVIGATION TABS (5 Clear Views) */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Tất cả thông báo</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`px-3.5 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "system"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Hệ thống &amp; Admin Khoa</span>
            {counts.systemUnread > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {counts.systemUnread} mới
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("deadline")}
            className={`px-3.5 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "deadline"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100"
            }`}
          >
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Tiến độ Deadline SV</span>
            {counts.deadlineUrgent > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-700 text-white">
                {counts.deadlineUrgent} trễ
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-3.5 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "feedback"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Phản hồi &amp; Thắc mắc từ SV</span>
            {counts.feedbackPending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                {counts.feedbackPending} chờ
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`px-3.5 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "broadcast"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Send className="w-4 h-4 text-indigo-400" />
            <span>Đã gửi &amp; Lên lịch</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              {scheduledList.length}
            </span>
          </button>
        </div>

        {/* Quick compose trigger */}
        <button
          onClick={() => setComposeOpen(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tạo thông báo mới</span>
        </button>
      </div>

      {/* CONDITIONAL SUB-PANELS BASED ON ACTIVE TAB */}
      {activeTab === "deadline" && (
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-lg p-4 space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h3 className="font-bold text-rose-900 text-sm">
                  Theo dõi Tiến độ Deadline &amp; Cảnh báo Nộp bài Sinh viên
                </h3>
                <p className="text-xs text-rose-700">
                  Hệ thống tự động quét các mốc bài nộp: Báo cáo tuần, Giữa kỳ, Phiếu đánh giá Doanh nghiệp và Báo cáo cuối kỳ.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleQuickComposeWithPreset(QUICK_COMPOSE_TEMPLATES[0])}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1 self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi cảnh báo cho tất cả SV trễ hạn</span>
            </button>
          </div>

          {/* Quick deadline milestone bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3 rounded-md border border-rose-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Báo cáo Giữa kỳ (Đã qua)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  1 SV quá hạn
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Đinh Quốc Khánh (Trễ 4 ngày)</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[93%]" />
              </div>
              <p className="text-[10px] text-slate-400 text-right">Đã nộp: 27/28 SV (96%)</p>
            </div>

            <div className="bg-white p-3 rounded-md border border-amber-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Báo cáo Tuần 6 (Đang diễn ra)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  Còn 24 giờ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Còn 3 SV chưa nộp báo cáo tuần</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[89%]" />
              </div>
              <p className="text-[10px] text-slate-400 text-right">Đã nộp: 25/28 SV (89%)</p>
            </div>

            <div className="bg-white p-3 rounded-md border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Báo cáo Tổng kết &amp; Đánh giá DN</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  Hạn 30/10
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Đang trong giai đoạn thu thập chữ ký</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[45%]" />
              </div>
              <p className="text-[10px] text-slate-400 text-right">Đã nhận: 12/28 SV (42%)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "system" && (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-4 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <h3 className="font-bold text-blue-900 text-sm">
              Thông báo Hệ thống, Phân quyền &amp; Quản trị Đợt thực tập
            </h3>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Các thông báo hành chính quan trọng từ Ban Chủ nhiệm Khoa CNTT, Quản trị viên IT và Cổng Đào tạo về: 
            <strong> Cấp tài khoản mới</strong>, <strong>Cập nhật thông tin tài khoản</strong>, <strong>Mở đợt thực tập HK I - 2026</strong>, 
            <strong> Hạn khóa sổ nộp điểm</strong> và <strong>Cập nhật biểu mẫu quy chuẩn</strong>.
          </p>
        </div>
      )}

      {/* 4. SEARCH AND SYNCHRONIZED FILTERS BAR */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
              Tìm kiếm &amp; Lọc thông báo ({filteredNotifications.length} kết quả)
            </h2>
          </div>

          {(searchQuery || filterPriority !== "Tất cả" || filterReadStatus !== "Tất cả" || sortBy !== "newest") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterPriority("Tất cả");
                setFilterReadStatus("Tất cả");
                setSortBy("newest");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, MSSV, tên sinh viên, công ty..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Tất cả mức ưu tiên</option>
              <option value="Khẩn cấp">Mức: Khẩn cấp</option>
              <option value="Quan trọng">Mức: Quan trọng</option>
              <option value="Thông thường">Mức: Thông thường</option>
            </select>
          </div>

          {/* Read status filter */}
          <div>
            <select
              value={filterReadStatus}
              onChange={(e) => setFilterReadStatus(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="Tất cả">Trạng thái đọc</option>
              <option value="Chưa đọc">Chưa đọc (Mới)</option>
              <option value="Đã đọc">Đã đọc</option>
            </select>
          </div>

          {/* Sort order */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-800 text-[11px]"
            >
              <option value="newest">Thứ tự: Mới nhất</option>
              <option value="oldest">Thứ tự: Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. CORE 2-COLUMN LAYOUT: INBOX LIST (5 cols) + DETAIL READER & RESPONSE (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: NOTIFICATION LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Danh sách ({filteredNotifications.length})
            </span>
            {counts.unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-blue-600 hover:underline font-bold"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">
                Không tìm thấy thông báo nào
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Không có thông báo phù hợp với bộ lọc hiện tại. Thử chọn danh mục khác hoặc xóa từ khóa tìm kiếm.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterPriority("Tất cả");
                  setFilterReadStatus("Tất cả");
                  setActiveTab("all");
                }}
                className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-md hover:bg-blue-100"
              >
                Xem tất cả thông báo
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredNotifications.map((notif) => {
                const isSelected = selectedNotif?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setSelectedNotif(notif);
                      if (notif.isUnread) handleToggleRead(notif.id);
                    }}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer relative space-y-2 ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-400 shadow-xs ring-1 ring-blue-300"
                        : notif.isUnread
                          ? "bg-white border-blue-200 shadow-2xs font-medium hover:border-blue-300"
                          : "bg-white border-slate-200/80 opacity-95 hover:opacity-100 hover:border-slate-300"
                    }`}
                  >
                    {/* Unread dot */}
                    {notif.isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute top-3.5 right-3.5 animate-pulse" />
                    )}

                    <div className="flex items-start gap-2.5 pr-4">
                      {/* Priority Icon */}
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 font-bold ${
                          notif.category === "Hệ thống & Admin"
                            ? "bg-blue-100 text-blue-700"
                            : notif.category === "Tiến độ Deadline"
                              ? "bg-rose-100 text-rose-700"
                              : notif.category === "Phản hồi SV"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {notif.category === "Hệ thống & Admin" ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : notif.category === "Tiến độ Deadline" ? (
                          <Clock className="w-4 h-4" />
                        ) : notif.category === "Phản hồi SV" ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : notif.type === "enterprise" ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                              notif.category === "Hệ thống & Admin"
                                ? "bg-blue-100 text-blue-800"
                                : notif.category === "Tiến độ Deadline"
                                  ? "bg-rose-100 text-rose-800"
                                  : notif.category === "Phản hồi SV"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {notif.category}
                          </span>

                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              notif.priority === "Khẩn cấp"
                                ? "bg-rose-600 text-white"
                                : notif.priority === "Quan trọng"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {notif.priority}
                          </span>

                          <span className="text-[10px] text-slate-400 font-medium ml-auto">
                            {notif.time}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                          {notif.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                          {notif.desc}
                        </p>

                        {/* Additional Sub-Meta for Deadline or Feedback */}
                        {notif.deadlineMeta && (
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                            <Clock className="w-3 h-3 text-rose-600" />
                            <span>Mốc: {notif.deadlineMeta.milestoneName}</span>
                            {notif.deadlineMeta.overdueDays ? (
                              <span className="text-rose-900 bg-rose-200 px-1.5 py-0.2 rounded">
                                Trễ {notif.deadlineMeta.overdueDays} ngày
                              </span>
                            ) : (
                              <span>Hạn: {notif.deadlineMeta.dueDate}</span>
                            )}
                          </div>
                        )}

                        {notif.student && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-600">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>
                              SV: <strong>{notif.student}</strong> ({notif.studentMssv || "Lớp C24A.TH1"})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[10px] text-slate-500">
                      <span className="truncate font-semibold text-slate-600">
                        Từ: {notif.senderRole || notif.sender}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleToggleRead(notif.id, e)}
                          className="hover:text-blue-600 transition-colors font-bold"
                        >
                          {notif.isUnread ? "Đánh dấu đã đọc" : "Chưa đọc"}
                        </button>
                        <button
                          onClick={(e) => handleDeleteNotif(notif.id, e)}
                          className="hover:text-rose-600 transition-colors"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: NOTIFICATION DETAIL & INTERACTIVE RESPONSE (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedNotif ? (
            <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-5">
              {/* DETAIL HEADER */}
              <div className="pb-4 border-b border-slate-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        selectedNotif.category === "Hệ thống & Admin"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : selectedNotif.category === "Tiến độ Deadline"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : selectedNotif.category === "Phản hồi SV"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {selectedNotif.category}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        selectedNotif.priority === "Khẩn cấp"
                          ? "bg-rose-600 text-white"
                          : selectedNotif.priority === "Quan trọng"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      Ưu tiên: {selectedNotif.priority}
                    </span>

                    <span className="text-xs text-slate-400 font-semibold">
                      {selectedNotif.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleRead(selectedNotif.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{selectedNotif.isUnread ? "Đánh dấu đã đọc" : "Chưa đọc"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNotif(selectedNotif.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-md transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedNotif.title}
                </h2>

                {/* METADATA GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-md border border-slate-200/80 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Người gửi:
                    </span>
                    <span className="text-slate-900 font-bold">
                      {selectedNotif.sender} {selectedNotif.senderRole ? `(${selectedNotif.senderRole})` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Đối tượng nhận:
                    </span>
                    <span className="text-blue-700 font-bold">
                      {selectedNotif.receiver}
                    </span>
                  </div>

                  {selectedNotif.student && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Sinh viên liên quan:
                      </span>
                      <span className="text-slate-800 font-bold">
                        {selectedNotif.student} {selectedNotif.studentMssv ? `- MSSV: ${selectedNotif.studentMssv}` : ""}
                      </span>
                    </div>
                  )}

                  {selectedNotif.company && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Doanh nghiệp tiếp nhận:
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {selectedNotif.company}
                      </span>
                    </div>
                  )}

                  {selectedNotif.deadlineMeta && (
                    <div className="md:col-span-2 bg-rose-50 p-2 rounded border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Mốc hạn: {selectedNotif.deadlineMeta.milestoneName}</span>
                      </div>
                      <span>
                        Hạn chót: {selectedNotif.deadlineMeta.dueDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* NOTIFICATION CONTENT BODY */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nội dung thông báo
                </h4>
                <div className="p-4 bg-slate-50/90 rounded-md border border-slate-200 text-slate-800 text-xs leading-relaxed whitespace-pre-line font-medium">
                  {selectedNotif.content}
                </div>
              </div>

              {/* ATTACHMENTS */}
              {selectedNotif.attachments && selectedNotif.attachments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    Tài liệu đính kèm ({selectedNotif.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotif.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-blue-50/90 border border-blue-200 rounded-md flex items-center gap-2 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
                        onClick={() => showToast(`Đang tải xuống tài liệu: ${file}`)}
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REPLY HISTORY (FOR STUDENT FEEDBACK / INQUIRIES) */}
              {selectedNotif.replies && selectedNotif.replies.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-600" />
                    Lịch sử phản hồi &amp; Trao đổi ({selectedNotif.replies.length})
                  </h4>
                  <div className="space-y-2.5">
                    {selectedNotif.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3 bg-emerald-50/60 rounded-md border border-emerald-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">{rep.sender}</span>
                          <span className="text-[10px] text-emerald-700 font-medium">{rep.time}</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION / DIRECT REPLY SECTION */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {/* Form to directly reply to Student Feedback or Inquiries */}
                {selectedNotif.category === "Phản hồi SV" ? (
                  <form onSubmit={handleSendReply} className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Trả lời trực tiếp cho sinh viên {selectedNotif.student || selectedNotif.sender}:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập nội dung giải đáp thắc mắc hoặc hướng dẫn cho sinh viên..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <span>Gợi ý mẫu:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyText(
                              "Thầy đồng ý với đề xuất của em. Em tiến hành theo phương án đã trình bày nhé.",
                            )
                          }
                          className="text-blue-600 hover:underline"
                        >
                          Đồng ý
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyText(
                              "Em bổ sung thêm chữ ký xác nhận của Doanh nghiệp và nộp lại trước ngày quy định nhé.",
                            )
                          }
                          className="text-blue-600 hover:underline"
                        >
                          Yêu cầu bổ sung
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingReply}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSendingReply ? "Đang gửi..." : "Gửi câu trả lời"}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setComposeAudience(
                            selectedNotif.student
                              ? `Sinh viên: ${selectedNotif.student}`
                              : selectedNotif.receiver,
                          );
                          setComposeTitle(`Phản hồi: ${selectedNotif.title}`);
                          setComposeOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        <span>Tạo thông báo phản hồi</span>
                      </button>

                      {selectedNotif.deadlineMeta && (
                        <button
                          onClick={() =>
                            handleQuickComposeWithPreset(QUICK_COMPOSE_TEMPLATES[0])
                          }
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 transition-colors flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Gửi nhắc nhở deadline</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => showToast("Đã sao chép liên kết thông báo vào clipboard.")}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-slate-200 text-center text-slate-400 space-y-2">
              <Mail className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-sm">Chọn một thông báo từ danh sách bên trái để đọc chi tiết.</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. SCHEDULED & BROADCAST MANAGEMENT SECTION */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Danh sách Thông báo đã lên lịch phát tự động cho Sinh viên
              </h3>
              <p className="text-xs text-slate-500">
                Các thông báo được hẹn giờ tự động gửi tới ứng dụng sinh viên theo tiến độ học kỳ.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsScheduledOption(true);
              setComposeOpen(true);
            }}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-md hover:bg-blue-100 flex items-center gap-1 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch gửi thông báo mới</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Tiêu đề thông báo</th>
                <th className="p-3">Đối tượng sinh viên / DN nhận</th>
                <th className="p-3">Thời gian phát sóng</th>
                <th className="p-3">Mức ưu tiên</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {scheduledList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{item.title}</td>
                  <td className="p-3 text-blue-700 font-semibold">{item.audience}</td>
                  <td className="p-3 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.scheduleTime}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.priority === "Khẩn cấp"
                          ? "bg-rose-100 text-rose-700"
                          : item.priority === "Quan trọng"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full border border-blue-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setScheduledList(scheduledList.filter((s) => s.id !== item.id));
                          showToast("Đã hủy lịch phát thông báo.");
                        }}
                        className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                        title="Hủy lịch phát này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. MODAL: COMPOSE NOTIFICATION FOR STUDENTS */}
      {composeOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBroadcast}
            className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Tạo &amp; Phát Thông báo cho Sinh viên
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Gửi trực tiếp tới cổng sinh viên hoặc lên lịch tự động theo đợt thực tập.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Mẫu soạn nhanh theo tình huống:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {QUICK_COMPOSE_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setComposeTitle(tmpl.title);
                      setComposePriority(tmpl.priority);
                      setComposeAudience(tmpl.audience);
                      setComposeContent(tmpl.content);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-md font-semibold text-[11px] whitespace-nowrap transition-all text-slate-700"
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nhắc nhở nộp báo cáo tuần 6 đợt HK I - 2026..."
                  value={composeTitle}
                  onChange={(e) => setComposeTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Audience selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Đối tượng nhận *
                  </label>
                  <select
                    value={composeAudience}
                    onChange={(e) => setComposeAudience(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    <option value="Toàn bộ sinh viên hướng dẫn (28 SV)">
                      Toàn bộ sinh viên HD (28 SV)
                    </option>
                    <option value="Lớp C24A.TH1 (Nhóm 1)">
                      Theo Lớp C24A.TH1
                    </option>
                    <option value="Sinh viên chưa nộp báo cáo">
                      Sinh viên đang trễ hạn báo cáo
                    </option>
                    <option value="Sinh viên thực tập tại FPT Software">
                      Nhóm thực tập FPT Software
                    </option>
                    <option value="Sinh viên thực tập tại Viettel Group">
                      Nhóm thực tập Viettel
                    </option>
                    <option value="Theo sinh viên cụ thể">
                      Chọn sinh viên cụ thể
                    </option>
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mức độ ưu tiên *
                  </label>
                  <select
                    value={composePriority}
                    onChange={(e) => setComposePriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    <option value="Thông thường">Thông thường</option>
                    <option value="Quan trọng">Quan trọng</option>
                    <option value="Khẩn cấp">Khẩn cấp (Cảnh báo đỏ)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phân loại thông báo
                  </label>
                  <select
                    value={composeCategory}
                    onChange={(e) => setComposeCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    <option value="Thông báo chung">Thông báo chung</option>
                    <option value="Tiến độ Deadline">Tiến độ Deadline</option>
                    <option value="Phản hồi SV">Phản hồi &amp; Họp nhóm</option>
                  </select>
                </div>
              </div>

              {/* If specific student chosen */}
              {composeAudience === "Theo sinh viên cụ thể" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Chọn sinh viên nhận thông báo *
                  </label>
                  <select
                    value={composeSpecificStudent}
                    onChange={(e) => setComposeSpecificStudent(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-semibold text-slate-900"
                  >
                    <option value="">-- Chọn sinh viên trong danh sách 28 SV --</option>
                    {INITIAL_STUDENTS.slice(0, 15).map((sv) => (
                      <option key={sv.id} value={`${sv.name} (${sv.mssv} - ${sv.company})`}>
                        {sv.name} (MSSV: {sv.mssv}) - {sv.company}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Content textarea */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết thông báo *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Nhập nội dung thông báo gửi tới sinh viên..."
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 leading-relaxed"
                />
              </div>

              {/* Attachment manager */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Tài liệu đính kèm (Biểu mẫu / File PDF):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="VD: Mau_Slide_BaoVe_2026.pptx..."
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 font-bold rounded-md text-slate-800 text-xs"
                  >
                    Đính kèm
                  </button>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {attachedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-blue-900 font-bold text-[11px] flex items-center gap-1.5"
                      >
                        <FileText className="w-3 h-3 text-blue-600" />
                        {file}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="hover:text-rose-600 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Scheduled Option */}
              <div className="p-3 bg-blue-50/70 rounded-md border border-blue-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-900 text-xs">
                  <input
                    type="checkbox"
                    checked={isScheduledOption}
                    onChange={(e) => setIsScheduledOption(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Lên lịch phát thông báo tự động (Scheduled Broadcast)</span>
                </label>

                {isScheduledOption && (
                  <div className="pt-2 animate-in fade-in">
                    <label className="block font-bold text-slate-700 mb-1">
                      Thời gian phát sóng dự kiến:
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 08:00 - 02/11/2026"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-medium text-slate-800"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  showToast("Đã lưu bản nháp thông báo.");
                  setComposeOpen(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs"
              >
                Lưu nháp
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isScheduledOption ? "Lên lịch phát thông báo" : "Phát thông báo ngay"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export { AccountView } from "./AccountView";
