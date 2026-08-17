import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import {
  ArrowLeft,
  MessageSquare,
  FileEdit,
  GraduationCap,
  Download,
  Building2,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  ExternalLink,
  History,
  Eye,
  CheckSquare,
  Square,
  Award,
  FileCode,
  FileSpreadsheet,
  FileCheck,
  Mail,
  Phone,
  Target,
} from "lucide-react";
export const StudentDetailWorkspace = ({
  student,
  enterprises = [],
  onBack,
  onSendComment,
  onChat,
  onGrade,
  onReviewSubmission,
  onAssignCompany,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAssignCompanyModal, setShowAssignCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
    student.company !== "Chưa có" ? student.company : "",
  );
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      title: "\u0110\u0103ng k\xFD doanh nghi\u1EC7p",
      done: true,
      date: "01/08/2026",
    },
    {
      id: 2,
      title: "N\u1ED9p k\u1EBF ho\u1EA1ch th\u1EF1c t\u1EADp",
      done: true,
      date: "10/08/2026",
    },
    {
      id: 3,
      title: "B\xE1o c\xE1o tu\u1EA7n 1: Kh\u1EA3o s\xE1t d\u1EF1 \xE1n",
      done: true,
      date: "18/08/2026",
    },
    {
      id: 4,
      title: "B\xE1o c\xE1o tu\u1EA7n 2: Thi\u1EBFt k\u1EBF API",
      done: true,
      date: "25/08/2026",
    },
    {
      id: 5,
      title: "B\xE1o c\xE1o tu\u1EA7n 3: L\u1EADp tr\xECnh Auth",
      done: false,
      date: "02/09/2026",
    },
    {
      id: 6,
      title: "\u0110\xE1nh gi\xE1 ti\u1EBFn \u0111\u1ED9 gi\u1EEFa k\u1EF3",
      done: false,
      date: "20/09/2026",
    },
    {
      id: 7,
      title: "B\xE1o c\xE1o cu\u1ED1i k\u1EF3 & Kh\xF3a lu\u1EADn",
      done: false,
      date: "15/11/2026",
    },
  ]);
  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const renderStatusChip = (status) => {
    switch (status) {
      case "\u0110\xFAng ti\u1EBFn \u0111\u1ED9":
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đúng tiến độ
          </span>
        );
      case "Ch\u1EADm ti\u1EBFn \u0111\u1ED9":
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Chậm tiến độ
          </span>
        );
      case "Ch\u1EDD ph\u1EA3n h\u1ED3i":
        return (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            Chờ phản hồi
          </span>
        );
      case "Qu\xE1 h\u1EA1n":
        return (
          <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Quá hạn
          </span>
        );
      case "Ho\xE0n th\xE0nh":
        return (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-full">
            {status}
          </span>
        );
    }
  };
  const submissions = [
    {
      id: "sub-3",
      title:
        "B\xE1o c\xE1o tu\u1EA7n 3: L\u1EADp tr\xECnh Module Auth & Microservices",
      type: "B\xE1o c\xE1o tu\u1EA7n",
      version: "v2.1",
      date: "2 gi\u1EDD tr\u01B0\u1EDBc (02/09/2026)",
      status: "Ch\u1EDD ph\u1EA3n h\u1ED3i",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
      score: "8.5 / 10",
      files: [
        {
          name: "Bao_Cao_Tuan_3_Nguyen_Van_A.pdf",
          size: "1.8 MB",
          icon: FileText,
        },
        { name: "source_code_auth_v2.zip", size: "14.2 MB", icon: FileCode },
      ],
      description:
        "\u0110\xE3 ho\xE0n th\xE0nh thi\u1EBFt k\u1EBF DB cho Auth, c\xE0i \u0111\u1EB7t JWT Refresh Token v\xE0 test API th\xE0nh c\xF4ng tr\xEAn Postman.",
    },
    {
      id: "sub-2",
      title:
        "B\xE1o c\xE1o tu\u1EA7n 2: Thi\u1EBFt k\u1EBF C\u01A1 s\u1EDF d\u1EEF li\u1EC7u & Ki\u1EBFn tr\xFAc API",
      type: "B\xE1o c\xE1o tu\u1EA7n",
      version: "v1.0",
      date: "25/08/2026",
      status: "\u0110\xE3 \u0111\u1EA1t",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      score: "9.0 / 10",
      files: [
        {
          name: "Bao_Cao_Tuan_2_Design_DB.pdf",
          size: "2.4 MB",
          icon: FileText,
        },
      ],
      description:
        "N\u1ED9p s\u01A1 \u0111\u1ED3 ERD, t\xE0i li\u1EC7u OpenAPI Specification v\xE0 nh\u1EADt k\xFD tu\u1EA7n 2.",
    },
    {
      id: "sub-1",
      title:
        "K\u1EBF ho\u1EA1ch Th\u1EF1c t\u1EADp Chi ti\u1EBFt & \u0110\u1EC1 c\u01B0\u01A1ng C\xF4ng vi\u1EC7c",
      type: "K\u1EBF ho\u1EA1ch TT",
      version: "v1.0",
      date: "10/08/2026",
      status: "\u0110\xE3 duy\u1EC7t",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      score: "A",
      files: [
        {
          name: "Ke_Hoach_Thuc_Tap_Chi_Tiet.docx",
          size: "320 KB",
          icon: FileText,
        },
      ],
      description:
        "K\u1EBF ho\u1EA1ch l\xE0m vi\u1EC7c 12 tu\u1EA7n t\u1EA1i FPT Software d\u01B0\u1EDBi s\u1EF1 h\u01B0\u1EDBng d\u1EABn c\u1EE7a Mentor Nguy\u1EC5n V\u0103n H\u1EA3i.",
    },
  ];
  const discussions = [
    {
      id: "d-1",
      author: "TS. Ph\u1EA1m Minh Anh",
      role: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      time: "10:15 H\xF4m nay",
      content:
        "Em b\u1ED5 sung th\xEAm s\u01A1 \u0111\u1ED3 lu\u1ED3ng d\u1EEF li\u1EC7u Sequence Diagram cho ph\u1EA7n Refresh Token trong b\xE1o c\xE1o tu\u1EA7n 3 nh\xE9. Code test \u0111\xE3 \u1ED5n r\u1ED3i.",
      attachments: [],
    },
    {
      id: "d-2",
      author: student.name,
      role: "Sinh vi\xEAn th\u1EF1c t\u1EADp",
      avatar: student.avatar,
      time: "11:30 H\xF4m nay",
      content:
        "D\u1EA1 v\xE2ng \u1EA1! Em \u0111\xE3 v\u1EBD b\u1ED5 sung Sequence Diagram v\xE0o b\u1EA3n v2.1 v\xE0 v\u1EEBa c\u1EADp nh\u1EADt l\u1EA1i t\u1EC7p PDF tr\xEAn h\u1EC7 th\u1ED1ng. Th\u1EA7y xem gi\xFAp em \u1EA1.",
      attachments: ["Sequence_Diagram_OAuth2.png (450 KB)"],
    },
    {
      id: "d-3",
      author: "Nguy\u1EC5n V\u0103n H\u1EA3i",
      role: "Mentor Doanh nghi\u1EC7p (FPT)",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      time: "14:20 H\xF4m qua",
      content:
        "Sinh vi\xEAn Nguy\u1EC5n V\u0103n A l\xE0m vi\u1EC7c r\u1EA5t ch\u1EE7 \u0111\u1ED9ng, tu\u1EA7n qua \u0111\xE3 ho\xE0n th\xE0nh t\u1ED1t 100% Jira tickets nh\xF3m backend \u0111\u01B0\u1EE3c giao.",
      attachments: [],
    },
  ];
  const [selectedStatus, setSelectedStatus] = useState(
    student.status || "\u0110\xFAng ti\u1EBFn \u0111\u1ED9",
  );
  const [submissionFilter, setSubmissionFilter] = useState("all");
  const [showQuickGradeModal, setShowQuickGradeModal] = useState(false);
  const [processScoreInput, setProcessScoreInput] = useState("8.5");
  const [reportScoreInput, setReportScoreInput] = useState("9.0");
  const [lecturerNotesInput, setLecturerNotesInput] = useState(
    "Sinh vi\xEAn th\u1EF1c t\u1EADp nghi\xEAm t\xFAc, l\xE0m vi\u1EC7c t\u1ED1t v\u1EDBi \u0111\u1ED9i ng\u0169 doanh nghi\u1EC7p.",
  );
  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    triggerToast(
      `\u0110\xE3 c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i sinh vi\xEAn th\xE0nh "${newStatus}"`,
    );
  };
  const handleSaveQuickGrade = (e) => {
    e.preventDefault();
    triggerToast(
      `\u0110\xE3 l\u01B0u \u0111i\u1EC3m: Qu\xE1 tr\xECnh ${processScoreInput} \u2022 B\xE1o c\xE1o ${reportScoreInput}`,
    );
    setShowQuickGradeModal(false);
  };
  const handleSendDiscussionReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    triggerToast("\u0110\xE3 g\u1EEDi ph\u1EA3n h\u1ED3i th\xE0nh c\xF4ng");
    setReplyText("");
  };
  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* HEADER BAR: Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200/80 shadow-2xs transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại danh sách sinh viên</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Không gian làm việc quản lý thực tập
          </span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200">
            Học kỳ I - 2026
          </span>
        </div>
      </div>

      {/* STUDENT HEADER CARD */}
      <div className="bg-white rounded-lg p-5 md:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left: Avatar + Details */}
          <div className="flex items-start gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-lg object-cover border border-slate-200 shadow-xs shrink-0"
            />
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  {student.name}
                </h1>

                {/* Interactive Status Selector */}
                <div className="relative inline-flex items-center">
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="pl-3 pr-7 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="Đúng tiến độ">Đúng tiến độ</option>
                    <option value="Chờ phản hồi">Chờ phản hồi</option>
                    <option value="Chậm tiến độ">Chậm tiến độ</option>
                    <option value="Quá hạn">Quá hạn</option>
                    <option value="Hoàn thành">Hoàn thành đợt</option>
                  </select>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                <span className="font-mono text-slate-700 font-bold bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                  MSSV: {student.mssv}
                </span>
                <span>
                  Lớp:{" "}
                  <strong className="text-slate-900 font-semibold">
                    {student.class}
                  </strong>
                </span>
                <span>
                  Ngành:{" "}
                  <strong className="text-slate-900 font-semibold">
                    {student.major}
                  </strong>
                </span>
                <span className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-bold text-[11px]">
                  GPA: {student.gpa} / 4.0
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 pt-0.5">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {student.email || "student@university.edu.vn"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {student.phone || "0988 123 456"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  GVHD:{" "}
                  <strong className="text-slate-800 font-semibold">
                    {student.lecturer}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <button
              onClick={() => onChat(student)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center gap-2 border border-slate-200/60"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Trao đổi</span>
            </button>

            <button
              onClick={() => onSendComment(student)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center gap-2 border border-slate-200/60"
            >
              <FileEdit className="w-4 h-4 text-amber-600" />
              <span>Nhận xét</span>
            </button>

            <button
              onClick={() =>
                onGrade ? onGrade(student) : setShowQuickGradeModal(true)
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-2 shadow-xs"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Chấm điểm</span>
            </button>

            <button
              onClick={() =>
                triggerToast(
                  "\u0110\xE3 b\u1EAFt \u0111\u1EA7u t\u1EA3i xu\u1ED1ng to\xE0n b\u1ED9 h\u1ED3 s\u01A1 Zip c\u1EE7a sinh vi\xEAn",
                )
              }
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200/80"
              title="Tải toàn bộ hồ sơ (.zip)"
            >
              <Download className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* TOP 4 KPI CARDS */}
      <KpiGrid>
        <KpiCard
          tone="blue"
          title="Tiến độ thực tập"
          value={`${student.progress}%`}
          icon={Target}
          footer={
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-700">
                Tuần 6/12
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1d4ed8] h-full rounded-full"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
          }
        />
        <KpiCard
          tone="sky"
          title="Bài đã nộp"
          value="5"
          unit="/ 6"
          icon={FileCheck}
          footer="Mới nhất: Báo cáo tuần 3 · 83% đã xong"
        />
        <KpiCard
          tone="amber"
          title="Lần phản hồi"
          value="12"
          unit="lượt"
          icon={MessageSquare}
          footer="2 GV & Mentor · Cập nhật 2 giờ trước"
        />
        <KpiCard
          tone="emerald"
          title="Điểm hiện tại"
          value="8.8"
          unit="/ 10"
          icon={Award}
          footer="Loại Giỏi · QT: 8.5 · BC: 9.0"
        />
      </KpiGrid>

      {/* MAIN 2-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT COLUMN: Main Working Area (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* SECTION 1: Thông tin thực tập */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Thông tin thực tập doanh nghiệp
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignCompanyModal(true)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-[#1d4ed8] text-white hover:bg-blue-700 cursor-pointer"
                >
                  Gán doanh nghiệp
                </button>
                <a
                  href="https://fpt-software.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Doanh nghiệp tiếp nhận
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {student.company}
                </span>
                <span className="text-slate-500 block">
                  Lĩnh vực: Phát triển phần mềm & Cloud
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Vị trí & Mentor phụ trách
                </span>
                <span className="font-bold text-slate-900 block">
                  {student.position || "Backend Developer Intern"}
                </span>
                <span className="text-blue-600 font-semibold block">
                  Mentor: {student.supervisor} (Lead Tech)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Thời gian thực tập
                </span>
                <span className="font-bold text-slate-800 block">
                  01/08/2026 → 30/11/2026
                </span>
                <span className="text-slate-500 block">
                  Tổng thời lượng: 12 tuần
                </span>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-md border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                  Trạng thái thời gian
                </span>
                <span className="font-bold text-emerald-800 text-sm block">
                  Còn 42 ngày thực tập
                </span>
                <span className="text-emerald-700 text-[11px] block">
                  Đã hoàn thành 50% tổng thời gian đợt
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Timeline thực tập (Vertical Visual Timeline) */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Lịch trình & Tiến độ thực tập
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                8 Mốc công việc
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Event 1 */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Đăng ký doanh nghiệp thực tập
                    </h4>
                    <p className="text-slate-500">
                      Đã được Khoa & GVHD phê duyệt hồ sơ tiếp nhận
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                      01/08/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Nộp kế hoạch thực tập chi tiết
                    </h4>
                    <p className="text-slate-500">
                      Đã thông qua đợt duyệt đề cương 12 tuần
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                      10/08/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Báo cáo tuần 1: Tìm hiểu hệ thống
                    </h4>
                    <p className="text-slate-500">
                      Điểm: 9.0 • Nhận xét tốt từ mentor FPT
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                      18/08/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Báo cáo tuần 2: Thiết kế DB & API
                    </h4>
                    <p className="text-slate-500">
                      Điểm: 8.8 • Đã cập nhật lại ERD
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                      25/08/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 5 (Current active) */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-100">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs bg-blue-50/60 p-3 rounded-md border border-blue-100">
                  <div>
                    <h4 className="font-bold text-blue-900">
                      Báo cáo tuần 3: Module Auth (Đang xử lý)
                    </h4>
                    <p className="text-blue-700 font-medium">
                      Đã nộp v2.1 • Đang chờ giảng viên phê duyệt cuối
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded text-[10px]">
                      Mới nhất
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 6 */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  6
                </div>
                <div className="flex items-center justify-between text-xs opacity-60">
                  <div>
                    <h4 className="font-bold text-slate-800">
                      Đánh giá tiến độ giữa kỳ
                    </h4>
                    <p className="text-slate-500">
                      Hạn chót nộp phiếu nhận xét doanh nghiệp
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[10px]">
                      20/09/2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 7 */}
              <div className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold ring-4 ring-white">
                  7
                </div>
                <div className="flex items-center justify-between text-xs opacity-60">
                  <div>
                    <h4 className="font-bold text-slate-800">
                      Nộp Báo cáo cuối kỳ & Khóa luận
                    </h4>
                    <p className="text-slate-500">
                      Tổng hợp mã nguồn, nhật ký & báo cáo hoàn chỉnh
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[10px]">
                      15/11/2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Danh sách bài nộp (GitHub PR style cards) */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Danh sách bài nộp & Sản phẩm (3 bài)
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Sắp xếp theo mới nhất
              </span>
            </div>

            {/* Submission Cards */}
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-slate-50/80 hover:bg-slate-100/60 rounded-lg border border-slate-200/80 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded">
                          {sub.type}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {sub.title}
                        </h4>
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          {sub.version}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${sub.statusColor}`}
                      >
                        {sub.status}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {sub.date}
                      </p>
                    </div>
                  </div>

                  {/* Attached Files */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {sub.files.map((file, fIdx) => (
                      <div
                        key={fIdx}
                        onClick={() =>
                          triggerToast(
                            `\u0110\xE3 m\u1EDF t\u1EC7p ${file.name}`,
                          )
                        }
                        className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-md text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                      >
                        <file.icon className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-slate-800 truncate max-w-[180px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {file.size}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600">
                        Điểm đánh giá:
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {sub.score}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onReviewSubmission
                            ? onReviewSubmission(student, sub.title)
                            : triggerToast(
                                `Xem chi ti\u1EBFt b\xE0i n\u1ED9p ${sub.title}`,
                              )
                        }
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg border border-blue-600 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span>Xem & Đánh giá</span>
                      </button>

                      <button
                        onClick={() => onSendComment(student)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        <FileEdit className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nhận xét</span>
                      </button>

                      <button
                        onClick={() => setShowVersionHistoryModal(sub.id)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        <History className="w-3.5 h-3.5 text-blue-600" />
                        <span>Lịch sử v2.1</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Information Panel (1 Col) */}
        <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-5">
          {/* CARD 1: TIẾN ĐỘ (Circular Progress Gauge) */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs text-center space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              TIẾN ĐỘ TỔNG THỂ
            </h4>

            {/* Circular Gauge */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${student.progress}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">
                  {student.progress}%
                </span>
                <span className="text-[9px] font-bold text-blue-600 uppercase">
                  Hoàn thành
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Sinh viên đang đi đúng tiến độ đợt thực tập Học kỳ I - 2026.
            </p>
          </div>

          {/* CARD 2: CHECKLIST (Interactive Task Requirements) */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                CHECKLIST HỒ SƠ
              </h4>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                4 / 7 Hoàn thành
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={`font-semibold truncate ${item.done ? "line-through text-slate-400" : "text-slate-800"}`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: TÀI LIỆU QUICK DOWNLOAD */}
          <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase pb-2 border-b border-slate-100">
              QUICK DOWNLOAD TÀI LIỆU
            </h4>

            <div className="space-y-2 text-xs">
              <button
                onClick={() =>
                  triggerToast(
                    "\u0110\xE3 t\u1EA3i xu\u1ED1ng B\xE1o c\xE1o tu\u1EA7n 3.pdf",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-bold truncate">Bao_Cao_Tuan_3.pdf</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    "\u0110\xE3 t\u1EA3i xu\u1ED1ng Source_code_v2.zip",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-bold truncate">Source_code_v2.zip</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    "\u0110\xE3 t\u1EA3i xu\u1ED1ng Slide_Bao_Cao.pptx",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-bold truncate">Slide_Bao_Cao.pptx</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    "\u0110\xE3 t\u1EA3i xu\u1ED1ng Nhat_Ky_Thuc_Tap.xlsx",
                  )
                }
                className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold truncate">
                    Nhat_Ky_Thuc_Tap.xlsx
                  </span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SUMMARY: EVALUATION SUMMARY */}
      <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              Tổng kết đánh giá thực tập sinh viên: {student.name}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
            <span>
              Điểm quá trình:{" "}
              <strong className="text-blue-600">8.5 / 10</strong>
            </span>
            <span>
              Điểm báo cáo: <strong className="text-blue-600">9.0 / 10</strong>
            </span>
            <span>
              Đánh giá DN:{" "}
              <strong className="text-emerald-600">Rất Tốt (4.8/5)</strong>
            </span>
            <span>
              Điểm tổng kết dự kiến:{" "}
              <strong className="text-emerald-700 font-bold text-sm">
                8.8 (A)
              </strong>
            </span>
          </div>
          <p className="text-xs text-slate-500 italic truncate max-w-2xl">
            "Nhận xét DN: Sinh viên làm việc chăm chỉ, tinh thần trách nhiệm
            cao, hoàn thành xuất sắc các task backend."
          </p>
        </div>

        <button
          onClick={() =>
            onGrade ? onGrade(student) : setShowQuickGradeModal(true)
          }
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md transition-colors shrink-0 flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Chấm điểm & Xác nhận kết quả</span>
        </button>
      </div>

      {/* QUICK GRADE MODAL */}
      {showQuickGradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-md border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Chấm điểm nhanh: {student.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    MSSV: {student.mssv} • {student.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickGradeModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSaveQuickGrade}
              className="space-y-4 text-xs font-sans"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Điểm quá trình (40%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={processScoreInput}
                    onChange={(e) => setProcessScoreInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-sm outline-none focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Đánh giá chuyên cần &amp; tiến độ
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Điểm báo cáo (40%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={reportScoreInput}
                    onChange={(e) => setReportScoreInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-sm outline-none focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Chất lượng báo cáo &amp; sản phẩm
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Nhận xét của Giảng viên hướng dẫn
                </label>
                <textarea
                  rows={3}
                  value={lecturerNotesInput}
                  onChange={(e) => setLecturerNotesInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md font-medium text-xs outline-none focus:border-blue-500"
                  placeholder="Nhập nhận xét về thái độ, kỹ năng chuyên môn..."
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-md border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 block">
                    Điểm Tổng Kết Dự Kiến:
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">
                    Bao gồm 20% điểm bảo vệ/doanh nghiệp
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-700">
                  {(
                    parseFloat(processScoreInput || "0") * 0.4 +
                    parseFloat(reportScoreInput || "0") * 0.4 +
                    8.8 * 0.2
                  ).toFixed(1)}{" "}
                  / 10
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickGradeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-md transition-colors"
                >
                  Lưu Điểm &amp; Nhận Xét
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {showVersionHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Lịch sử các phiên bản nộp bài
              </h3>
              <button
                onClick={() => setShowVersionHistoryModal(null)}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50/80 rounded-md border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">
                    Phiên bản v2.1 (Mới nhất)
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    Nộp lúc 11:30 hôm nay • Bổ sung ERD
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded">
                  Hiện tại
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between opacity-75">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Phiên bản v2.0
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    Nộp lúc 09:15 hôm nay • Bản thảo đầu
                  </span>
                </div>
                <button
                  onClick={() =>
                    triggerToast(
                      "\u0110\xE3 t\u1EA3i phi\xEAn b\u1EA3n c\u0169 v2.0",
                    )
                  }
                  className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] rounded hover:bg-slate-100"
                >
                  Tải v2.0
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowVersionHistoryModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Gán doanh nghiệp cho {student.name}
            </h3>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 outline-none cursor-pointer"
            >
              <option value="">— Chọn doanh nghiệp —</option>
              {enterprises.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssignCompanyModal(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedCompany) return;
                  onAssignCompany?.(selectedCompany);
                  setShowAssignCompanyModal(false);
                  triggerToast(`Đã gán ${selectedCompany}`);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-md bg-[#1d4ed8] text-white cursor-pointer"
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
