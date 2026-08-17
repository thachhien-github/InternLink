import { useState, useEffect } from "react";
import {
  CalendarDays,
  Sparkles,
  Plus,
  Search,
  Calendar,
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  Edit3,
  Copy,
  Lock,
  Eye,
  FileUp,
  Layers,
  CheckSquare,
} from "lucide-react";
import { CreateSemesterModal } from "../components/modals/CreateSemesterModal";
import { ImportModal } from "../components/modals/ImportModal";
import { AssignLecturerModal } from "../components/modals/AssignLecturerModal";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import { Panel } from "../../../components/common/Panel";
import { USE_MOCK } from "../../../config/env";
import { adminStudentsService } from "../../../services/adminStudents.service";
import { adminLecturersService } from "../../../services/adminLecturers.service";
import { adminCompaniesService } from "../../../services/adminCompanies.service";

const INITIAL_SEMESTERS = [
  {
    id: "sem-1",
    name: "Thực tập Tốt nghiệp K20 (2025 - 2026)",
    term: "Học kỳ I",
    academicYear: "2025 - 2026",
    startDate: "01/09/2025",
    endDate: "15/12/2025",
    lecturersCount: 42,
    studentsCount: 1280,
    placedStudents: 1268,
    companiesCount: 185,
    status: "active",
    progressPercent: 66,
    currentPhase: "Thực tập & Nộp báo cáo giữa kỳ",
    description:
      "Đợt thực tập chính thức cho sinh viên Khóa 2020 ngành Công nghệ Thông tin, Kỹ thuật Phần mềm và Mạng máy tính.",
  },
  {
    id: "sem-2",
    name: "Thực tập Doanh nghiệp K20 (2025 - 2026)",
    term: "Học kỳ II",
    academicYear: "2025 - 2026",
    startDate: "15/01/2026",
    endDate: "30/05/2026",
    lecturersCount: 38,
    studentsCount: 1150,
    placedStudents: 0,
    companiesCount: 140,
    status: "upcoming",
    progressPercent: 10,
    currentPhase: "Tiếp nhận hồ sơ đăng ký & Import Giảng viên",
    description:
      "Đợt thực tập Học kỳ II dành cho sinh viên giai đoạn 2 và sinh viên đăng ký bổ sung.",
  },
  {
    id: "sem-3",
    name: "Thực tập Tốt nghiệp K19 (2024 - 2025)",
    term: "Học kỳ I",
    academicYear: "2024 - 2025",
    startDate: "01/09/2024",
    endDate: "15/12/2024",
    lecturersCount: 40,
    studentsCount: 1210,
    placedStudents: 1210,
    companiesCount: 172,
    status: "completed",
    progressPercent: 100,
    currentPhase: "Đã hoàn thành & Lưu trữ kho dữ liệu",
    description:
      "Khóa thực tập đã hoàn tất bảo vệ, chấm điểm và tổng kết dữ liệu Khoa CNTT.",
  },
  {
    id: "sem-4",
    name: "Thực tập Hè Doanh nghiệp (2024 - 2025)",
    term: "Học kỳ Hè",
    academicYear: "2024 - 2025",
    startDate: "01/06/2025",
    endDate: "30/08/2025",
    lecturersCount: 15,
    studentsCount: 320,
    placedStudents: 320,
    companiesCount: 65,
    status: "completed",
    progressPercent: 100,
    currentPhase: "Đã hoàn thành đợt thực tập Hè",
    description: "Khóa thực tập hè trải nghiệm doanh nghiệp.",
  },
];

import { useSemester } from "../../../contexts/SemesterContext";

export const SemestersView = ({ onShowToast, onNavigateTab }) => {
  const {
    semesters: semestersList,
    selectedSemesterId,
    selectSemester,
    createSemester,
    closeSemester,
    duplicateSemester,
  } = useSemester();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [importType, setImportType] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [tableFilterStatus, setTableFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    name: "",
    term: "Học kỳ I",
    academicYear: "2026 - 2027",
    startDate: "",
    endDate: "",
    description: "",
  });

  const currentActiveSem =
    semestersList.find((s) => s.id === selectedSemesterId && s.status !== "completed") ||
    semestersList.find((s) => s.status === "active") ||
    semestersList.find((s) => s.status === "upcoming") ||
    semestersList[0];

  const handleCreateNewFromForm = (e, isDraft = false) => {
    e.preventDefault();
    if (!formData.name) {
      onShowToast("Vui lòng nhập tên kỳ thực tập!");
      return;
    }
    createSemester({
      name: formData.name,
      term: formData.term,
      academicYear: formData.academicYear,
      startDate: formData.startDate || "01/09/2026",
      endDate: formData.endDate || "15/12/2026",
      status: isDraft ? "draft" : "upcoming",
      description: formData.description || `Đợt thực tập ${formData.term} ${formData.academicYear}`,
    });
    onShowToast(
      `Đã ${isDraft ? "lưu nháp" : "tạo thành công"} kỳ thực tập: "${formData.name}"`,
    );
    setFormData({
      name: "",
      term: "Học kỳ I",
      academicYear: "2026 - 2027",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleDuplicateSemester = (sem) => {
    duplicateSemester(sem, onShowToast);
  };

  const handleCloseSemester = (semId: string, _semName: string) => {
    closeSemester(semId, onShowToast);
  };
  const activeSem = currentActiveSem;
  const timelinePhases = [
    {
      num: "01",
      label: "Tạo kỳ thực tập",
      sub: "Thiết lập thời gian & tiêu chí",
      isDone: true,
      isCurrent: false,
    },
    {
      num: "02",
      label: "Import giảng viên",
      sub: `${activeSem.lecturersCount} GV hướng dẫn`,
      isDone: true,
      isCurrent: false,
    },
    {
      num: "03",
      label: "Import sinh viên",
      sub: `${activeSem.studentsCount} SV đủ điều kiện`,
      isDone: true,
      isCurrent: false,
    },
    {
      num: "04",
      label: "Phân công hướng dẫn",
      sub: "Ghép nối SV & GV",
      isDone: true,
      isCurrent: false,
    },
    {
      num: "05",
      label: "Sinh viên thực tập",
      sub: `Tại ${activeSem.companiesCount} doanh nghiệp`,
      isDone: false,
      isCurrent: true,
    },
    {
      num: "06",
      label: "Thu báo cáo & Chấm",
      sub: "Hạn chót: 30/11/2025",
      isDone: false,
      isCurrent: false,
    },
    {
      num: "07",
      label: "Tổng kết & Đóng kỳ",
      sub: "Tổng hợp điểm & Kho dữ liệu",
      isDone: false,
      isCurrent: false,
    },
  ];
  const detailedSchedule = [
    {
      title: "Th\u1EDDi gian Import Gi\u1EA3ng vi\xEAn",
      date: "01/08/2025 - 15/08/2025",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      color: "emerald",
    },
    {
      title: "Th\u1EDDi gian Import Sinh vi\xEAn",
      date: "16/08/2025 - 25/08/2025",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      color: "emerald",
    },
    {
      title: "Th\u1EDDi gian Ph\xE2n c\xF4ng H\u01B0\u1EDBng d\u1EABn",
      date: "26/08/2025 - 05/09/2025",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      color: "emerald",
    },
    {
      title: "Th\u1EDDi gian Sinh vi\xEAn Th\u1EF1c t\u1EADp",
      date: "01/09/2025 - 15/12/2025",
      status: "\u0110ang di\u1EC5n ra",
      color: "blue",
    },
    {
      title: "Th\u1EDDi gian N\u1ED9p B\xE1o c\xE1o Gi\u1EEFa k\u1EF3",
      date: "15/10/2025 - 20/10/2025",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      color: "emerald",
    },
    {
      title: "Th\u1EDDi gian N\u1ED9p B\xE1o c\xE1o Cu\u1ED1i k\u1EF3",
      date: "25/11/2025 - 05/12/2025",
      status: "S\u1EAFp t\u1EDBi",
      color: "amber",
    },
    {
      title: "Th\u1EDDi gian Ch\u1EA5m \u0111i\u1EC3m & B\u1EA3o v\u1EC7",
      date: "10/12/2025 - 15/12/2025",
      status: "S\u1EAFp t\u1EDBi",
      color: "slate",
    },
    {
      title: "Th\u1EDDi gian K\u1EBFt th\xFAc & \u0110\xF3ng \u0111\u1EE3t",
      date: "20/12/2025",
      status: "S\u1EAFp t\u1EDBi",
      color: "slate",
    },
  ];
  const upcomingTasks = [
    {
      id: "task-1",
      title: "Thu b\xE1o c\xE1o gi\u1EEFa k\u1EF3 & X\xE1c nh\u1EADn GV",
      date: "H\u1EA1n ch\xF3t: 20/10/2025",
      badge: "Ho\xE0n th\xE0nh 98%",
      color: "emerald",
    },
    {
      id: "task-2",
      title:
        "Kh\xF3a danh s\xE1ch \u0111\u0103ng k\xFD doanh nghi\u1EC7p \u0111\u1EE3t 2",
      date: "H\u1EA1n ch\xF3t: 15/11/2025",
      badge: "C\xF2n 10 ng\xE0y",
      color: "amber",
    },
    {
      id: "task-3",
      title:
        "M\u1EDF h\u1EC7 th\u1ED1ng Thu B\xE1o c\xE1o cu\u1ED1i k\u1EF3 PDF",
      date: "H\u1EA1n ch\xF3t: 30/11/2025",
      badge: "Chu\u1EA9n b\u1ECB",
      color: "blue",
    },
    {
      id: "task-4",
      title:
        "Th\xE0nh l\u1EADp H\u1ED9i \u0111\u1ED3ng B\u1EA3o v\u1EC7 Th\u1EF1c t\u1EADp K20",
      date: "H\u1EA1n ch\xF3t: 05/12/2025",
      badge: "K\u1EBF ho\u1EA1ch",
      color: "indigo",
    },
  ];
  const filteredSemesters = semestersList.filter((s) => {
    const matchesFilter =
      tableFilterStatus === "all" || s.status === tableFilterStatus;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.academicYear.includes(searchQuery) ||
      s.term.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const totalPages = Math.ceil(filteredSemesters.length / pageSize) || 1;
  const paginatedSemesters = filteredSemesters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={CalendarDays}
        title="Quản lý kỳ thực tập"
        actions={[
          {
            label: "Import Giảng viên",
            icon: FileUp,
            onClick: () => setImportType("lecturers"),
            variant: "secondary",
          },
          {
            label: "Import Sinh viên",
            icon: Users,
            onClick: () => setImportType("students"),
            variant: "secondary",
          },
          {
            label: "Tạo kỳ thực tập mới",
            icon: Plus,
            onClick: () => setShowCreateModal(true),
            variant: "primary",
          },
        ]}
      />

      <KpiGrid>
        <KpiCard
          tone="blue"
          title="Tổng số kỳ thực tập"
          value={semestersList.length}
          unit="kỳ"
          icon={Calendar}
          footer="Tất cả niên khóa"
        />
        <KpiCard
          tone="emerald"
          title="Đợt đang hoạt động"
          value={1}
          unit="đợt"
          icon={CheckCircle2}
          footer={
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> HK1
              (2025-2026)
            </span>
          }
        />
        <KpiCard
          tone="amber"
          title="Sinh viên đợt hiện tại"
          value={activeSem.studentsCount}
          unit="sinh viên"
          icon={Users}
          footer={`${activeSem.placedStudents} đã tiếp nhận doanh nghiệp`}
        />
        <KpiCard
          tone="sky"
          title="Giảng viên hướng dẫn"
          value={activeSem.lecturersCount}
          unit="giảng viên"
          icon={UserCheck}
          footer={`${activeSem.companiesCount} doanh nghiệp liên kết`}
        />
      </KpiGrid>

      {/* STREAMLINED 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLUMNS: MAIN SEMESTERS TABLE & ACTIVE PROGRESS */}
        <div className="lg:col-span-8 space-y-6">
          {/* ACTIVE INTERNSHIP FEATURED SUMMARY */}
          <Panel className="space-y-5 relative overflow-hidden border-blue-200/90">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-600/20 shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      {currentActiveSem.name}
                    </h2>
                    <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Đang diễn ra
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {currentActiveSem.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md border border-slate-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa</span>
                </button>

                <button
                  onClick={() =>
                    handleCloseSemester(
                      currentActiveSem.id,
                      currentActiveSem.name,
                    )
                  }
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Đóng đợt</span>
                </button>
              </div>
            </div>

            {/* Key Grid Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Học kỳ & Niên khóa
                </p>
                <p className="font-bold text-slate-800 text-xs mt-1">
                  {currentActiveSem.term} ({currentActiveSem.academicYear})
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Thời gian diễn ra
                </p>
                <p className="font-bold text-slate-800 text-xs mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />{" "}
                  {currentActiveSem.startDate} - {currentActiveSem.endDate}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Quy mô tham gia
                </p>
                <p className="font-bold text-slate-800 text-xs mt-1">
                  {currentActiveSem.studentsCount} SV /{" "}
                  {currentActiveSem.lecturersCount} GV
                </p>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-md border border-blue-100">
                <p className="text-[10px] font-bold uppercase text-blue-700">
                  Doanh nghiệp tiếp nhận
                </p>
                <p className="font-bold text-blue-950 text-xs mt-1">
                  {currentActiveSem.companiesCount} Doanh nghiệp
                </p>
              </div>
            </div>

            {/* Progress Bar & Phase Status */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Tiến độ đợt
                  thực tập
                </span>
                <span className="font-bold text-blue-700">
                  {currentActiveSem.progressPercent}% hoàn thành
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
                <div
                  className="bg-[#1d4ed8] h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${currentActiveSem.progressPercent}%` }}
                />
              </div>

              <div className="p-2.5 bg-blue-50/60 rounded-md border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">
                    Giai đoạn hiện tại:{" "}
                    <span className="text-blue-700">
                      {currentActiveSem.currentPhase}
                    </span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Tuần 10 / 15
                </span>
              </div>
            </div>
          </Panel>

          {/* INTERNSHIP LIST TABLE (Clean Data Grid) */}
          <Panel className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Danh sách các kỳ thực tập
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Toàn bộ dữ liệu đợt thực tập hiện tại và lịch sử lưu trữ
                </p>
              </div>

              {/* Table Filters & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên kỳ, khóa..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium outline-none focus:border-blue-500 w-44"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setTableFilterStatus("all")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "all" ? "bg-white text-blue-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setTableFilterStatus("active")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "active" ? "bg-white text-emerald-800 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Hoạt động
                  </button>
                  <button
                    onClick={() => setTableFilterStatus("upcoming")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "upcoming" ? "bg-white text-blue-800 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Sắp tới
                  </button>
                  <button
                    onClick={() => setTableFilterStatus("completed")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "completed" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Đã đóng
                  </button>
                </div>
              </div>
            </div>

            {/* Table Element */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Tên kỳ thực tập</th>
                    <th className="py-3 px-3">Học kỳ / Niên khóa</th>
                    <th className="py-3 px-3">Thời gian</th>
                    <th className="py-3 px-3 text-center">Giảng viên</th>
                    <th className="py-3 px-3 text-center">Sinh viên</th>
                    <th className="py-3 px-3 text-center">Trạng thái</th>
                    <th className="py-3 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSemesters.map((sem) => (
                    <tr
                      key={sem.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3 px-3 font-bold text-slate-900">
                        <div>
                          <p className="text-xs group-hover:text-blue-600 transition-colors">
                            {sem.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                            {sem.currentPhase}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-700">
                        {sem.term} ({sem.academicYear})
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                        {sem.startDate} - {sem.endDate}
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-blue-900">
                        {sem.lecturersCount} GV
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-blue-900">
                        {sem.studentsCount} SV
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${sem.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : sem.status === "upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" : sem.status === "draft" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                        >
                          {sem.status === "active"
                            ? "Ho\u1EA1t \u0111\u1ED9ng"
                            : sem.status === "upcoming"
                              ? "S\u1EAFp di\u1EC5n ra"
                              : sem.status === "draft"
                                ? "Nh\xE1p"
                                : "\u0110\xE3 \u0111\xF3ng"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              selectSemester(sem.id);
                              onShowToast(
                                `Đã chọn xem chi tiết: ${sem.name}`,
                              );
                            }}
                            className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicateSemester(sem)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Sao chép"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {sem.status !== "completed" && (
                            <button
                              onClick={() =>
                                handleCloseSemester(sem.id, sem.name)
                              }
                              className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Đóng kỳ"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* RIGHT 4 COLUMNS: PROCESS TIMELINE & UPCOMING DEADLINES */}
        <div className="lg:col-span-4 space-y-6">
          {/* INTERNSHIP PROCESS STEPPER */}
          <Panel className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Quy trình Vận hành
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  7 bước vận hành đợt thực tập chuẩn hóa
                </p>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md">
                Bước 5/7
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {timelinePhases.map((phase, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-md border flex items-center justify-between gap-2.5 transition-all ${phase.isCurrent ? "bg-blue-600 text-white border-blue-600 shadow-sm" : phase.isDone ? "bg-emerald-50/70 text-emerald-950 border-emerald-200/80" : "bg-slate-50 text-slate-500 border-slate-200/70"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${phase.isCurrent ? "bg-white text-blue-600" : phase.isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}
                    >
                      {phase.isDone ? "\u2713" : phase.num}
                    </span>
                    <div>
                      <p
                        className={`font-bold text-xs ${phase.isCurrent ? "text-white" : "text-slate-900"}`}
                      >
                        {phase.label}
                      </p>
                      <p
                        className={`text-[10px] font-medium ${phase.isCurrent ? "text-blue-100" : "text-slate-500"}`}
                      >
                        {phase.sub}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* UPCOMING TASKS & DEADLINES */}
          <Panel className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> Mốc hạn
                chót tiếp theo
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-md border border-slate-200/70 space-y-1 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {task.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${task.color === "emerald" ? "bg-emerald-100 text-emerald-800" : task.color === "amber" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {task.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {task.date}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* MODALS */}
      <CreateSemesterModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onShowToast={onShowToast}
        onCreate={(data) => {
          createSemester({
            name: data.name,
            term: data.term,
            academicYear: data.academicYear,
            startDate: data.startDate,
            endDate: data.endDate,
            studentsCount: data.targetStudents,
            status: "upcoming",
            description: `Đợt thực tập ${data.term} ${data.academicYear}`,
          });
        }}
      />

      <ImportModal
        isOpen={importType !== null}
        type={importType || "students"}
        onClose={() => setImportType(null)}
        onShowToast={onShowToast}
      />

      <AssignLecturerModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onShowToast={onShowToast}
      />
    </div>
  );
};

export { SemestersView as AdminSemestersView };
