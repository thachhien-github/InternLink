import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Target,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCheck,
  GraduationCap,
} from "lucide-react";

export const StudentDetailWorkspace = ({
  student,
  enterprises = [],
  onBack,
  onChat,
  onAssignCompany,
}: {
  student: import("../../../types/student").Student & {
    internshipId?: string;
    weeklyReportCount?: string;
  };
  enterprises?: import("../../../types/enterprise").Enterprise[];
  onBack?: () => void;
  onSendComment?: (student: any) => void;
  onChat?: (student: any) => void;
  onGrade?: (student: any) => void;
  onReviewSubmission?: (student: any, title?: string) => void;
  onAssignCompany?: (companyName: string) => void;
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAssignCompanyModal, setShowAssignCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
    student.company !== "Chưa có" ? student.company : "",
  );
  const [selectedStatus, setSelectedStatus] = useState(
    student.status || "Đúng tiến độ",
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    triggerToast(`Đã cập nhật trạng thái tiến độ: "${newStatus}"`);
  };

  // 5–6 tuần tiến độ thực tập theo quy định
  const weeklyMilestones = [
    {
      week: 1,
      title: "Đăng ký đề tài, khảo sát quy trình & tiếp nhận môi trường DN",
      submitted: true,
      submittedDate: "10/08/2026",
      fileName: "Bao_Cao_Tuan_1_Khao_Sat.pdf",
      status: "Đã nộp",
    },
    {
      week: 2,
      title: "Phân tích yêu cầu, thiết kế Database (ERD) & Wireframe",
      submitted: true,
      submittedDate: "17/08/2026",
      fileName: "Bao_Cao_Tuan_2_Design_DB.pdf",
      status: "Đã nộp",
    },
    {
      week: 3,
      title: "Xây dựng Module chức năng chính & API Service",
      submitted: true,
      submittedDate: "24/08/2026",
      fileName: "Bao_Cao_Tuan_3_Module_Auth.pdf",
      status: "Đã nộp",
    },
    {
      week: 4,
      title: "Lập trình hoàn thiện Frontend & Tích hợp API Backend",
      submitted: true,
      submittedDate: "31/08/2026",
      fileName: "Bao_Cao_Tuan_4_Frontend_APIs.pdf",
      status: "Đã nộp",
    },
    {
      week: 5,
      title: "Kiểm thử hệ thống (Unit/Integration Test) & Tối ưu hiệu năng",
      submitted: true,
      submittedDate: "07/09/2026",
      fileName: "Bao_Cao_Tuan_5_Testing.pdf",
      status: "Đã nộp",
    },
    {
      week: 6,
      title: "Tổng kết, xin xác nhận của Mentor & Hoàn thiện quyển báo cáo",
      submitted: true,
      submittedDate: "14/09/2026",
      fileName: "Bao_Cao_Tuan_6_Final.pdf",
      status: "Đã nộp",
    },
  ];

  const submittedCount = weeklyMilestones.filter((m) => m.submitted).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-16 font-sans">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* HEADER BAR: Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200 shadow-xs transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại danh sách sinh viên</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="hidden sm:inline">Hồ sơ theo dõi thực tập</span>
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-md border border-blue-200">
            Học kỳ I - 2026
          </span>
        </div>
      </div>

      {/* STUDENT PROFILE HERO CARD */}
      <div className="bg-white rounded-lg p-5 md:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Avatar + Personal Profile Details */}
          <div className="flex items-start gap-4">
            <img
              src={
                student.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={student.name}
              className="w-18 h-18 rounded-lg object-cover border-2 border-blue-500 shadow-sm shrink-0"
            />
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {student.name}
                </h1>

                {/* Progress Status Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="pl-2.5 pr-7 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-md cursor-pointer outline-none transition-all appearance-none"
                  >
                    <option value="Đúng tiến độ">Đúng tiến độ</option>
                    <option value="Chờ phản hồi">Chờ phản hồi</option>
                    <option value="Chậm tiến độ">Chậm tiến độ</option>
                    <option value="Quá hạn">Quá hạn</option>
                    <option value="Hoàn thành">Hoàn thành đợt</option>
                  </select>
                  <ChevronRight className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                <span className="font-mono text-slate-800 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                  MSSV: {student.mssv}
                </span>
                <span>
                  Lớp: <strong className="text-slate-900">{student.class}</strong>
                </span>
                <span>•</span>
                <span>
                  Ngành: <strong className="text-slate-900">{student.major}</strong>
                </span>
                <span>•</span>
                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  GPA: {student.gpa || "3.5"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {student.email || `${student.mssv.toLowerCase()}@st.university.edu.vn`}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {student.phone || "0988 123 456"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  GVHD: <strong className="text-slate-800">{student.lecturer}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Direct Communication Action */}
          <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => (onChat ? onChat(student) : triggerToast(`Mở hộp thoại với ${student.name}`))}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Nhắn tin & Trao đổi</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: COMPANY INFO & PROGRESS TRACKING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: COMPANY & OVERALL PROGRESS (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* OVERALL PROGRESS CARD */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Tiến độ thực tập tổng thể</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Tỷ lệ hoàn thành:</span>
                <span className="font-bold text-blue-700 text-base font-mono">
                  {student.progress}% ({submittedCount}/12 tuần)
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${student.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                <div className="p-2.5 bg-emerald-50 rounded-md border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                    Đã nộp
                  </span>
                  <span className="font-bold text-emerald-900 text-sm font-mono">
                    {submittedCount} tuần
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Còn lại
                  </span>
                  <span className="font-bold text-slate-700 text-sm font-mono">
                    {12 - submittedCount} tuần
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY & MENTOR INFO CARD */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Nơi thực tập & Mentor</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAssignCompanyModal(true)}
                className="px-2 py-1 text-[10px] font-bold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                Gán / Đổi DN
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Doanh nghiệp
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {student.company}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Vị trí thực tập & Người hướng dẫn
                </span>
                <span className="font-bold text-slate-900 block">
                  {student.position || "Backend Developer Intern"}
                </span>
                <span className="text-blue-600 font-medium block">
                  Mentor: {student.supervisor}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Thời gian thực tập
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {student.startDate && student.endDate
                    ? `${new Date(student.startDate).toLocaleDateString("vi-VN")} → ${new Date(student.endDate).toLocaleDateString("vi-VN")}`
                    : "Theo kế hoạch học kỳ thực tập"}
                </span>
              </div>
            </div>
          </div>

          {/* QUICK DOWNLOAD ARTIFACTS */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Tài liệu tiến độ đính kèm</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => triggerToast("Đang tải file Bao_Cao_Tuan_Gan_Nhat.pdf...")}
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/70 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-bold truncate">Bao_Cao_Tuan_6.pdf</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() => triggerToast("Đang tải file Nhat_Ky_Thuc_Tap.xlsx...")}
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/70 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold truncate">Nhat_Ky_Thuc_Tap.xlsx</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() => triggerToast("Đang mở liên kết kho mã nguồn dự án...")}
                className="w-full p-2.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200/70 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold truncate">Mã nguồn (Github Repo)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED WEEKLY TIMELINE & PROGRESS (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-lg p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Tiến trình Báo cáo 12 Tuần Thực tập</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Theo dõi trạng thái nộp nhật ký và bài nộp theo từng tuần công việc của sinh viên.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-md">
                12 Tuần
              </span>
            </div>

            {/* WEEKLY TIMELINE LIST */}
            <div className="space-y-3">
              {weeklyMilestones.map((m) => (
                <div
                  key={m.week}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    m.submitted
                      ? "bg-slate-50/70 border-slate-200/80 hover:bg-slate-50"
                      : "bg-white border-dashed border-slate-200 opacity-75"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        m.submitted
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {m.submitted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : m.week}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          Tuần {m.week}: {m.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{m.submittedDate}</span>
                        {m.fileName && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-blue-600 font-semibold">{m.fileName}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span
                      className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full border ${
                        m.submitted
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {m.status}
                    </span>

                    {m.submitted && (
                      <button
                        onClick={() => triggerToast(`Đang mở xem bài nộp Tuần ${m.week}...`)}
                        className="p-1.5 bg-white hover:bg-blue-50 text-blue-600 rounded border border-slate-200 hover:border-blue-300 transition-colors"
                        title="Xem chi tiết bài nộp"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGN COMPANY MODAL */}
      {showAssignCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md w-full max-w-md p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-900">
              Gán / Đổi doanh nghiệp cho {student.name}
            </h3>
            <p className="text-xs text-slate-500">
              Chọn doanh nghiệp tiếp nhận sinh viên thực tập trong danh sách đối tác của Khoa.
            </p>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 outline-none cursor-pointer font-medium"
            >
              <option value="">— Chọn doanh nghiệp —</option>
              {enterprises.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAssignCompanyModal(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedCompany) return;
                  onAssignCompany?.(selectedCompany);
                  setShowAssignCompanyModal(false);
                  triggerToast(`Đã gán thành công doanh nghiệp ${selectedCompany}`);
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
