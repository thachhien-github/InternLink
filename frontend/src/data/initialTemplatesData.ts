import type { DocumentItem } from "../types/document";

export const INITIAL_TEMPLATES: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Mẫu Báo cáo Thực tập Giữa kỳ & Cuối kỳ (Chuẩn 2026)",
    category: "Báo cáo",
    fileType: "DOCX",
    fileSize: "1.4 MB",
    version: "v2.1",
    isLatest: true,
    updatedAt: "20/10/2026",
    uploader: "TS. Nguyễn Văn Hùng",
    uploaderRole: "Trưởng BM Công nghệ Phần mềm",
    downloads: 1420,
    semester: "HK I - 2026",
    major: "Kỹ thuật Phần mềm",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: true,
    description:
      "Quy chuẩn trình bày báo cáo thực tập tốt nghiệp năm học 2025-2026 dành cho sinh viên Khoa CNTT.",
    versionHistory: [
      {
        version: "v2.1",
        date: "20/10/2026",
        author: "TS. Nguyễn Văn Hùng",
        note: "Cập nhật tiêu chuẩn chấm điểm và phụ lục nhận xét",
      },
      {
        version: "v2.0",
        date: "15/08/2026",
        author: "ThS. Trần Minh Tuấn",
        note: "Bổ sung phần đánh giá kỹ năng mềm",
      },
      {
        version: "v1.0",
        date: "10/01/2025",
        author: "TS. Nguyễn Văn Hùng",
        note: "Phiên bản ban đầu",
      },
    ],
    archiveLogs: [
      {
        id: "log-1-1",
        timestamp: "2026-10-20 08:30:00",
        date: "20/10/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "TS. Nguyễn Văn Hùng",
        performedRole: "Trưởng BM Công nghệ Phần mềm",
        reason: "Ban hành mẫu chuẩn cho đợt thực tập HK I - 2026",
        note: "Đã phê duyệt và thông báo toàn khoa",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-2",
    title: "Phiếu Nhận xét & Đánh giá Sinh viên từ Doanh nghiệp (Mentor)",
    category: "Biểu mẫu",
    fileType: "PDF",
    fileSize: "320 KB",
    version: "v2.0",
    isLatest: true,
    updatedAt: "18/10/2026",
    uploader: "ThS. Phạm Thị Mai",
    uploaderRole: "Phụ trách Quan hệ Doanh nghiệp",
    downloads: 1150,
    semester: "HK I - 2026",
    major: "Tất cả ngành",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: true,
    description:
      "Mẫu đánh giá dành cho Mentor doanh nghiệp xác nhận thời gian làm việc, thái độ và năng lực sinh viên.",
    versionHistory: [
      {
        version: "v2.0",
        date: "18/10/2026",
        author: "ThS. Phạm Thị Mai",
        note: "Cập nhật thang điểm 100 và ma trận kỹ năng",
      },
      {
        version: "v1.0",
        date: "05/02/2025",
        author: "ThS. Phạm Thị Mai",
        note: "Phiên bản khởi tạo",
      },
    ],
    archiveLogs: [
      {
        id: "log-2-1",
        timestamp: "2026-10-18 09:15:00",
        date: "18/10/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "ThS. Phạm Thị Mai",
        performedRole: "Phụ trách Quan hệ Doanh nghiệp",
        reason: "Cập nhật thang điểm mới theo chỉ đạo Khoa",
        note: "Công khai cho sinh viên và doanh nghiệp tải về",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-3",
    title: "Nhật ký Thực tập Hàng tuần (Weekly Work Log)",
    category: "Nhật ký",
    fileType: "DOCX",
    fileSize: "450 KB",
    version: "v1.5",
    isLatest: true,
    updatedAt: "15/10/2026",
    uploader: "TS. Lê Hoàng Nam",
    uploaderRole: "Giảng viên Hướng dẫn",
    downloads: 980,
    semester: "HK I - 2026",
    major: "Khoa học Dữ liệu",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: false,
    description:
      "Mẫu ghi nhận công việc hàng tuần sinh viên cần gửi GVHD định kỳ qua hệ thống.",
    versionHistory: [
      {
        version: "v1.5",
        date: "15/10/2026",
        author: "TS. Lê Hoàng Nam",
        note: "Chuẩn hóa định dạng bảng mã hóa",
      },
    ],
    archiveLogs: [
      {
        id: "log-3-1",
        timestamp: "2026-10-15 14:00:00",
        date: "15/10/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "TS. Lê Hoàng Nam",
        performedRole: "Giảng viên Hướng dẫn",
        reason: "Ban hành mẫu nhật ký HK I - 2026",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-4",
    title: "Kế hoạch Tổ chức Bảo vệ Báo cáo Thực tập HK I - 2026",
    category: "Kế hoạch",
    fileType: "PDF",
    fileSize: "890 KB",
    version: "v1.0",
    isLatest: true,
    updatedAt: "10/10/2026",
    uploader: "PGS. TS. Trần Quốc Bảo",
    uploaderRole: "Trưởng Khoa CNTT",
    downloads: 850,
    semester: "HK I - 2026",
    major: "Tất cả ngành",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: false,
    description:
      "Thông báo mốc thời gian nộp báo cáo, danh sách hội đồng bảo vệ và địa điểm chấm.",
    versionHistory: [
      {
        version: "v1.0",
        date: "10/10/2026",
        author: "PGS. TS. Trần Quốc Bảo",
        note: "Ban hành chính thức",
      },
    ],
    archiveLogs: [
      {
        id: "log-4-1",
        timestamp: "2026-10-10 10:00:00",
        date: "10/10/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "PGS. TS. Trần Quốc Bảo",
        performedRole: "Trưởng Khoa CNTT",
        reason: "Công bố lịch trình bảo vệ chính thức",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-5",
    title: "Hướng dẫn Trình bày Slide Bảo vệ Thực tập Trước Hội đồng",
    category: "Hướng dẫn",
    fileType: "PPTX",
    fileSize: "3.2 MB",
    version: "v1.2",
    isLatest: true,
    updatedAt: "08/10/2026",
    uploader: "ThS. Đỗ Anh Dũng",
    uploaderRole: "Giảng viên Hướng dẫn",
    downloads: 740,
    semester: "HK I - 2026",
    major: "Tất cả ngành",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: false,
    description:
      "Template slide mẫu chuẩn nhận diện Khoa CNTT kèm hướng dẫn thuyết trình 10 phút.",
    versionHistory: [
      {
        version: "v1.2",
        date: "08/10/2026",
        author: "ThS. Đỗ Anh Dũng",
        note: "Cập nhật màu chuẩn nhận diện 2026",
      },
    ],
    archiveLogs: [
      {
        id: "log-5-1",
        timestamp: "2026-10-08 16:20:00",
        date: "08/10/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "ThS. Đỗ Anh Dũng",
        performedRole: "Giảng viên Hướng dẫn",
        reason: "Template slide chuẩn năm 2026",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-6",
    title: "Quyết định Phân công Giảng viên Hướng dẫn Thực tập 2026",
    category: "Văn bản khoa",
    fileType: "PDF",
    fileSize: "1.1 MB",
    version: "v1.0",
    isLatest: true,
    updatedAt: "01/10/2026",
    uploader: "VP Khoa CNTT",
    uploaderRole: "Văn phòng Khoa",
    downloads: 620,
    semester: "HK I - 2026",
    major: "Tất cả ngành",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: false,
    description:
      "Văn bản chính thức ban hành danh sách sinh viên và GVHD tương ứng.",
    versionHistory: [
      {
        version: "v1.0",
        date: "01/10/2026",
        author: "VP Khoa CNTT",
        note: "Ban hành lần đầu",
      },
    ],
    archiveLogs: [
      {
        id: "log-6-1",
        timestamp: "2026-10-01 09:00:00",
        date: "01/10/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "VP Khoa CNTT",
        performedRole: "Văn phòng Khoa",
        reason: "Quyết định chính thức của Trưởng khoa",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-7",
    title: "Mẫu Giấy Giới thiệu Thực tập Doanh nghiệp (Phiếu Đăng ký cũ)",
    category: "Biểu mẫu",
    fileType: "DOCX",
    fileSize: "210 KB",
    version: "v1.0",
    isLatest: false,
    updatedAt: "12/03/2024",
    uploader: "ThS. Trần Văn B",
    uploaderRole: "Cựu Trợ lý Đào tạo",
    downloads: 410,
    semester: "HK II - 2024",
    major: "Tất cả ngành",
    status: "Ngưng lưu hành",
    isPublished: false,
    isRequired: false,
    description:
      "Mẫu giấy xin thực tập tự túc chưa cập nhật nhận diện mới của trường.",
    archiveReason:
      "Đã hết hạn lưu hành HK II - 2024. Đã thay thế bằng Mẫu Giấy giới thiệu phiên bản điện tử mới có mã QR.",
    archivedAt: "15/09/2025 10:30",
    archivedBy: "TS. Nguyễn Văn Hùng",
    versionHistory: [
      {
        version: "v1.0",
        date: "12/03/2024",
        author: "ThS. Trần Văn B",
        note: "Phiên bản cũ năm 2024",
      },
    ],
    archiveLogs: [
      {
        id: "log-7-1",
        timestamp: "2024-03-12 08:00:00",
        date: "12/03/2024",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành",
        performedBy: "ThS. Trần Văn B",
        performedRole: "Cựu Trợ lý Đào tạo",
        reason: "Ban hành mẫu đăng ký HK II - 2024",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
      {
        id: "log-7-2",
        timestamp: "2025-09-15 10:30:00",
        date: "15/09/2025",
        action: "ARCHIVED",
        actionLabel: "Ngưng lưu hành & Chuyển vào Log",
        performedBy: "TS. Nguyễn Văn Hùng",
        performedRole: "Trưởng BM Công nghệ Phần mềm",
        reason:
          "Đã hết hạn lưu hành HK II - 2024. Đã thay thế bằng Mẫu Giấy giới thiệu điện tử có mã QR.",
        note: "Đã ẩn khỏi giao diện sinh viên, lưu lại log đối soát văn bản.",
        previousStatus: "Đang lưu hành",
        newStatus: "Ngưng lưu hành",
      },
    ],
  },
  {
    id: "doc-8",
    title: "Quy chế An toàn Thông tin & Bảo mật Dữ liệu Doanh nghiệp khi Thực tập",
    category: "Khác",
    fileType: "PDF",
    fileSize: "650 KB",
    version: "v1.1",
    isLatest: true,
    updatedAt: "05/09/2026",
    uploader: "TS. Vũ Minh Khoa",
    uploaderRole: "Trưởng BM An toàn Thông tin",
    downloads: 510,
    semester: "HK I - 2026",
    major: "An toàn Thông tin",
    status: "Đang lưu hành",
    isPublished: true,
    isRequired: true,
    description:
      "Cam kết NDA và quy định tuân thủ bảo mật nguồn mã cho sinh viên thực tập tại doanh nghiệp.",
    versionHistory: [
      {
        version: "v1.1",
        date: "05/09/2026",
        author: "TS. Vũ Minh Khoa",
        note: "Thêm điều khoản AI NDA",
      },
    ],
    archiveLogs: [
      {
        id: "log-8-1",
        timestamp: "2026-09-05 11:00:00",
        date: "05/09/2026",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành chính thức",
        performedBy: "TS. Vũ Minh Khoa",
        performedRole: "Trưởng BM An toàn Thông tin",
        reason: "Cập nhật điều khoản bảo mật AI và lưu hành chính thức",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
    ],
  },
  {
    id: "doc-9",
    title: "Mẫu Báo cáo Tiến độ 2 Tuần một lần (Phiên bản Thử nghiệm K19)",
    category: "Báo cáo",
    fileType: "DOCX",
    fileSize: "380 KB",
    version: "v1.0-beta",
    isLatest: false,
    updatedAt: "20/02/2025",
    uploader: "ThS. Lê Văn Nam",
    uploaderRole: "Giảng viên Hướng dẫn",
    downloads: 180,
    semester: "HK II - 2025",
    major: "Kỹ thuật Phần mềm",
    status: "Ngưng lưu hành",
    isPublished: false,
    isRequired: false,
    description:
      "Mẫu thử nghiệm báo cáo tiến độ 2 tuần/lần của K19, hiện nay đã gộp vào Nhật ký hàng tuần.",
    archiveReason:
      "Không còn áp dụng do Khoa đã thống nhất chuyển sang nộp Nhật ký hàng tuần trên hệ thống InternLink.",
    archivedAt: "01/09/2025 08:00",
    archivedBy: "PGS. TS. Trần Quốc Bảo",
    versionHistory: [
      {
        version: "v1.0-beta",
        date: "20/02/2025",
        author: "ThS. Lê Văn Nam",
        note: "Bản thử nghiệm báo cáo 2 tuần",
      },
    ],
    archiveLogs: [
      {
        id: "log-9-1",
        timestamp: "2025-02-20 14:00:00",
        date: "20/02/2025",
        action: "CIRCULATING",
        actionLabel: "Bắt đầu lưu hành thử nghiệm",
        performedBy: "ThS. Lê Văn Nam",
        performedRole: "Giảng viên Hướng dẫn",
        reason: "Thử nghiệm kỳ HK II - 2025",
        previousStatus: "Bản nháp",
        newStatus: "Đang lưu hành",
      },
      {
        id: "log-9-2",
        timestamp: "2025-09-01 08:00:00",
        date: "01/09/2025",
        action: "ARCHIVED",
        actionLabel: "Ngưng lưu hành & Chuyển vào Log",
        performedBy: "PGS. TS. Trần Quốc Bảo",
        performedRole: "Trưởng Khoa CNTT",
        reason:
          "Không còn áp dụng do Khoa đã thống nhất chuyển sang nộp Nhật ký hàng tuần trên hệ thống InternLink.",
        note: "Ẩn khỏi sinh viên, lưu log lịch sử đào tạo.",
        previousStatus: "Đang lưu hành",
        newStatus: "Ngưng lưu hành",
      },
    ],
  },
];

const STORAGE_KEY = "internlink_templates_v3";

export function loadStoredTemplates(): DocumentItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load templates from localStorage:", err);
  }
  return INITIAL_TEMPLATES;
}

export function saveStoredTemplates(templates: DocumentItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (err) {
    console.warn("Failed to save templates to localStorage:", err);
  }
}
