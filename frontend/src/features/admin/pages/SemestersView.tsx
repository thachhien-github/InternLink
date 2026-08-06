import { useState } from 'react';
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
  CheckSquare
} from 'lucide-react';
import { CreateSemesterModal } from '../components/modals/CreateSemesterModal';
import { ImportModal } from '../components/modals/ImportModal';
import { AssignLecturerModal } from '../components/modals/AssignLecturerModal';
export const SemestersView = ({
  onShowToast,
  onNavigateTab
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [importType, setImportType] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState("sem-1");
  const [tableFilterStatus, setTableFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [semestersList, setSemestersList] = useState([
    {
      id: "sem-1",
      name: "Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p K20 (2025 - 2026)",
      term: "H\u1ECDc k\u1EF3 I",
      academicYear: "2025 - 2026",
      startDate: "01/09/2025",
      endDate: "15/12/2025",
      lecturersCount: 42,
      studentsCount: 1280,
      placedStudents: 1268,
      companiesCount: 185,
      status: "active",
      progressPercent: 66,
      currentPhase: "Th\u1EF1c t\u1EADp & N\u1ED9p b\xE1o c\xE1o gi\u1EEFa k\u1EF3",
      description: "\u0110\u1EE3t th\u1EF1c t\u1EADp ch\xEDnh th\u1EE9c cho sinh vi\xEAn Kh\xF3a 2020 ng\xE0nh C\xF4ng ngh\u1EC7 Th\xF4ng tin, K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m v\xE0 M\u1EA1ng m\xE1y t\xEDnh."
    },
    {
      id: "sem-2",
      name: "Th\u1EF1c t\u1EADp Doanh nghi\u1EC7p K20 (2025 - 2026)",
      term: "H\u1ECDc k\u1EF3 II",
      academicYear: "2025 - 2026",
      startDate: "15/01/2026",
      endDate: "30/05/2026",
      lecturersCount: 38,
      studentsCount: 1150,
      placedStudents: 0,
      companiesCount: 140,
      status: "upcoming",
      progressPercent: 10,
      currentPhase: "Ti\u1EBFp nh\u1EADn h\u1ED3 s\u01A1 \u0111\u0103ng k\xFD & Import Gi\u1EA3ng vi\xEAn",
      description: "\u0110\u1EE3t th\u1EF1c t\u1EADp H\u1ECDc k\u1EF3 II d\xE0nh cho sinh vi\xEAn giai \u0111o\u1EA1n 2 v\xE0 sinh vi\xEAn \u0111\u0103ng k\xFD b\u1ED5 sung."
    },
    {
      id: "sem-3",
      name: "Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p K19 (2024 - 2025)",
      term: "H\u1ECDc k\u1EF3 I",
      academicYear: "2024 - 2025",
      startDate: "01/09/2024",
      endDate: "15/12/2024",
      lecturersCount: 40,
      studentsCount: 1210,
      placedStudents: 1210,
      companiesCount: 172,
      status: "completed",
      progressPercent: 100,
      currentPhase: "\u0110\xE3 ho\xE0n th\xE0nh & L\u01B0u tr\u1EEF kho d\u1EEF li\u1EC7u",
      description: "Kh\xF3a th\u1EF1c t\u1EADp \u0111\xE3 ho\xE0n t\u1EA5t b\u1EA3o v\u1EC7, ch\u1EA5m \u0111i\u1EC3m v\xE0 t\u1ED5ng k\u1EBFt d\u1EEF li\u1EC7u Khoa CNTT."
    },
    {
      id: "sem-4",
      name: "Th\u1EF1c t\u1EADp H\xE8 Doanh nghi\u1EC7p (2024 - 2025)",
      term: "H\u1ECDc k\u1EF3 H\xE8",
      academicYear: "2024 - 2025",
      startDate: "01/06/2025",
      endDate: "30/08/2025",
      lecturersCount: 15,
      studentsCount: 320,
      placedStudents: 320,
      companiesCount: 65,
      status: "completed",
      progressPercent: 100,
      currentPhase: "\u0110\xE3 ho\xE0n th\xE0nh",
      description: "Kh\xF3a th\u1EF1c t\u1EADp h\xE8 t\u0103ng c\u01B0\u1EDDng cho sinh vi\xEAn \u0111\u0103ng k\xFD s\u1EDBm."
    }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    term: "H\u1ECDc k\u1EF3 I",
    academicYear: "2026 - 2027",
    startDate: "",
    endDate: "",
    description: ""
  });
  const currentActiveSem = semestersList.find((s) => s.id === selectedSemesterId) || semestersList[0];
  const handleCreateNewFromForm = (e, isDraft = false) => {
    e.preventDefault();
    if (!formData.name) {
      onShowToast("Vui l\xF2ng nh\u1EADp t\xEAn k\u1EF3 th\u1EF1c t\u1EADp!");
      return;
    }
    const newItem = {
      id: `sem-${Date.now()}`,
      name: formData.name,
      term: formData.term,
      academicYear: formData.academicYear,
      startDate: formData.startDate || "01/09/2026",
      endDate: formData.endDate || "15/12/2026",
      lecturersCount: 0,
      studentsCount: 0,
      placedStudents: 0,
      companiesCount: 0,
      status: isDraft ? "draft" : "upcoming",
      progressPercent: 0,
      currentPhase: "Chu\u1EA9n b\u1ECB danh s\xE1ch",
      description: formData.description || "\u0110\u1EE3t th\u1EF1c t\u1EADp m\u1EDBi kh\u1EDFi t\u1EA1o"
    };
    setSemestersList([newItem, ...semestersList]);
    onShowToast(`\u0110\xE3 ${isDraft ? "l\u01B0u nh\xE1p" : "t\u1EA1o th\xE0nh c\xF4ng"} k\u1EF3 th\u1EF1c t\u1EADp: "${formData.name}"`);
    setFormData({
      name: "",
      term: "H\u1ECDc k\u1EF3 I",
      academicYear: "2026 - 2027",
      startDate: "",
      endDate: "",
      description: ""
    });
  };
  const handleDuplicateSemester = (sem) => {
    const duplicated = {
      ...sem,
      id: `sem-dup-${Date.now()}`,
      name: `${sem.name} (B\u1EA3n sao)`,
      status: "upcoming",
      progressPercent: 0,
      currentPhase: "M\u1EDBi sao ch\xE9p"
    };
    setSemestersList([duplicated, ...semestersList]);
    onShowToast(`\u0110\xE3 sao ch\xE9p k\u1EF3 th\u1EF1c t\u1EADp: "${sem.name}"`);
  };
  const handleCloseSemester = (semId, semName) => {
    setSemestersList(semestersList.map((s) => {
      if (s.id === semId) {
        return { ...s, status: "completed", progressPercent: 100, currentPhase: "\u0110\xE3 ho\xE0n th\xE0nh & Kh\xF3a d\u1EEF li\u1EC7u" };
      }
      return s;
    }));
    onShowToast(`\u0110\xE3 \u0111\xF3ng k\u1EF3 th\u1EF1c t\u1EADp: "${semName}"`);
  };
  const timelinePhases = [
    { num: "01", label: "T\u1EA1o k\u1EF3 th\u1EF1c t\u1EADp", sub: "Thi\u1EBFt l\u1EADp th\u1EDDi gian & ti\xEAu ch\xED", isDone: true, isCurrent: false },
    { num: "02", label: "Import gi\u1EA3ng vi\xEAn", sub: "42 GV h\u01B0\u1EDBng d\u1EABn", isDone: true, isCurrent: false },
    { num: "03", label: "Import sinh vi\xEAn", sub: "1,280 SV \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n", isDone: true, isCurrent: false },
    { num: "04", label: "Ph\xE2n c\xF4ng h\u01B0\u1EDBng d\u1EABn", sub: "Gh\xE9p n\u1ED1i SV & GV", isDone: true, isCurrent: false },
    { num: "05", label: "Sinh vi\xEAn th\u1EF1c t\u1EADp", sub: "T\u1EA1i 185 doanh nghi\u1EC7p", isDone: false, isCurrent: true },
    { num: "06", label: "Thu b\xE1o c\xE1o & Ch\u1EA5m", sub: "H\u1EA1n ch\xF3t: 30/11/2025", isDone: false, isCurrent: false },
    { num: "07", label: "T\u1ED5ng k\u1EBFt & \u0110\xF3ng k\u1EF3", sub: "T\u1ED5ng h\u1EE3p \u0111i\u1EC3m & Kho d\u1EEF li\u1EC7u", isDone: false, isCurrent: false }
  ];
  const detailedSchedule = [
    { title: "Th\u1EDDi gian Import Gi\u1EA3ng vi\xEAn", date: "01/08/2025 - 15/08/2025", status: "\u0110\xE3 ho\xE0n th\xE0nh", color: "emerald" },
    { title: "Th\u1EDDi gian Import Sinh vi\xEAn", date: "16/08/2025 - 25/08/2025", status: "\u0110\xE3 ho\xE0n th\xE0nh", color: "emerald" },
    { title: "Th\u1EDDi gian Ph\xE2n c\xF4ng H\u01B0\u1EDBng d\u1EABn", date: "26/08/2025 - 05/09/2025", status: "\u0110\xE3 ho\xE0n th\xE0nh", color: "emerald" },
    { title: "Th\u1EDDi gian Sinh vi\xEAn Th\u1EF1c t\u1EADp", date: "01/09/2025 - 15/12/2025", status: "\u0110ang di\u1EC5n ra", color: "blue" },
    { title: "Th\u1EDDi gian N\u1ED9p B\xE1o c\xE1o Gi\u1EEFa k\u1EF3", date: "15/10/2025 - 20/10/2025", status: "\u0110\xE3 ho\xE0n th\xE0nh", color: "emerald" },
    { title: "Th\u1EDDi gian N\u1ED9p B\xE1o c\xE1o Cu\u1ED1i k\u1EF3", date: "25/11/2025 - 05/12/2025", status: "S\u1EAFp t\u1EDBi", color: "amber" },
    { title: "Th\u1EDDi gian Ch\u1EA5m \u0111i\u1EC3m & B\u1EA3o v\u1EC7", date: "10/12/2025 - 15/12/2025", status: "S\u1EAFp t\u1EDBi", color: "slate" },
    { title: "Th\u1EDDi gian K\u1EBFt th\xFAc & \u0110\xF3ng \u0111\u1EE3t", date: "20/12/2025", status: "S\u1EAFp t\u1EDBi", color: "slate" }
  ];
  const upcomingTasks = [
    { id: "task-1", title: "Thu b\xE1o c\xE1o gi\u1EEFa k\u1EF3 & X\xE1c nh\u1EADn GV", date: "H\u1EA1n ch\xF3t: 20/10/2025", badge: "Ho\xE0n th\xE0nh 98%", color: "emerald" },
    { id: "task-2", title: "Kh\xF3a danh s\xE1ch \u0111\u0103ng k\xFD doanh nghi\u1EC7p \u0111\u1EE3t 2", date: "H\u1EA1n ch\xF3t: 15/11/2025", badge: "C\xF2n 10 ng\xE0y", color: "amber" },
    { id: "task-3", title: "M\u1EDF h\u1EC7 th\u1ED1ng Thu B\xE1o c\xE1o cu\u1ED1i k\u1EF3 PDF", date: "H\u1EA1n ch\xF3t: 30/11/2025", badge: "Chu\u1EA9n b\u1ECB", color: "blue" },
    { id: "task-4", title: "Th\xE0nh l\u1EADp H\u1ED9i \u0111\u1ED3ng B\u1EA3o v\u1EC7 Th\u1EF1c t\u1EADp K20", date: "H\u1EA1n ch\xF3t: 05/12/2025", badge: "K\u1EBF ho\u1EA1ch", color: "indigo" }
  ];
  const filteredSemesters = semestersList.filter((s) => {
    const matchesFilter = tableFilterStatus === "all" || s.status === tableFilterStatus;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.academicYear.includes(searchQuery) || s.term.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const totalPages = Math.ceil(filteredSemesters.length / pageSize) || 1;
  const paginatedSemesters = filteredSemesters.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <div className="p-6 space-y-6 max-w-[1500px] mx-auto animate-in fade-in duration-300">
      
      {
    /* PAGE TITLE & ACTION BAR */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý kỳ thực tập</h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
    onClick={() => setImportType("lecturers")}
    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs rounded-xl border border-indigo-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
  >
            <FileUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Import Giảng viên</span>
          </button>

          <button
    onClick={() => setImportType("students")}
    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 font-extrabold text-xs rounded-xl border border-teal-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
  >
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Import Sinh viên</span>
          </button>

          <button
    onClick={() => setShowCreateModal(true)}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
  >
            <Plus className="w-4 h-4" />
            <span>Tạo kỳ thực tập mới</span>
          </button>
        </div>
      </div>

      {
    /* CORE STATS KPI CARDS */
  }
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/40 p-4 rounded-2xl border border-sky-200/80 border-l-4 border-l-sky-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Tổng số kỳ thực tập</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100/80 text-sky-600 border border-sky-200/60 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{semestersList.length}</span>
            <span className="text-xs font-bold text-slate-400">kỳ</span>
          </div>
          <span className="text-[11px] text-blue-600 font-extrabold block">Tất cả niên khóa</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">Đợt đang hoạt động</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700">1</span>
            <span className="text-xs font-bold text-emerald-600">đợt</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> HK1 (2025-2026)
          </span>
        </div>

        <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 p-4 rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">Sinh viên đợt hiện tại</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-900">1,280</span>
            <span className="text-xs font-bold text-slate-400">sinh viên</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold block">1,268 đã tiếp nhận doanh nghiệp</span>
        </div>

        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">Giảng viên hướng dẫn</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-900">42</span>
            <span className="text-xs font-bold text-slate-400">giảng viên</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">38 giảng viên đang hướng dẫn</span>
        </div>
      </section>

      {
    /* STREAMLINED 2-COLUMN LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {
    /* LEFT 8 COLUMNS: MAIN SEMESTERS TABLE & ACTIVE PROGRESS */
  }
        <div className="lg:col-span-8 space-y-6">

          {
    /* ACTIVE INTERNSHIP FEATURED SUMMARY */
  }
          <section className="bg-white rounded-2xl border border-blue-200/90 shadow-xs p-6 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-600/20 shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {currentActiveSem.name}
                    </h2>
                    <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Đang diễn ra
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {currentActiveSem.description}
                  </p>
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="flex items-center gap-2 shrink-0">
                <button
    onClick={() => setShowCreateModal(true)}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
  >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa</span>
                </button>

                <button
    onClick={() => handleCloseSemester(currentActiveSem.id, currentActiveSem.name)}
    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
  >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Đóng đợt</span>
                </button>
              </div>
            </div>

            {
    /* Key Grid Details */
  }
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Học kỳ & Niên khóa</p>
                <p className="font-black text-slate-800 text-xs mt-1">{currentActiveSem.term} ({currentActiveSem.academicYear})</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Thời gian diễn ra</p>
                <p className="font-bold text-slate-800 text-xs mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" /> {currentActiveSem.startDate} - {currentActiveSem.endDate}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Quy mô tham gia</p>
                <p className="font-bold text-slate-800 text-xs mt-1">{currentActiveSem.studentsCount} SV / {currentActiveSem.lecturersCount} GV</p>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">
                <p className="text-[10px] font-extrabold uppercase text-blue-700">Doanh nghiệp tiếp nhận</p>
                <p className="font-black text-blue-950 text-xs mt-1">{currentActiveSem.companiesCount} Doanh nghiệp</p>
              </div>
            </div>

            {
    /* Progress Bar & Phase Status */
  }
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Tiến độ đợt thực tập
                </span>
                <span className="font-black text-blue-700">{currentActiveSem.progressPercent}% hoàn thành</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
                <div
    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs relative"
    style={{ width: `${currentActiveSem.progressPercent}%` }}
  />
              </div>

              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">Giai đoạn hiện tại: <span className="text-blue-700">{currentActiveSem.currentPhase}</span></span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Tuần 10 / 15</span>
              </div>
            </div>
          </section>

          {
    /* INTERNSHIP LIST TABLE (Clean Data Grid) */
  }
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">Danh sách các kỳ thực tập</h2>
                <p className="text-xs text-slate-500 font-medium">Toàn bộ dữ liệu đợt thực tập hiện tại và lịch sử lưu trữ</p>
              </div>

              {
    /* Table Filters & Search */
  }
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Tìm tên kỳ, khóa..."
    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500 w-44"
  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
    onClick={() => setTableFilterStatus("all")}
    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "all" ? "bg-white text-blue-900 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"}`}
  >
                    Tất cả
                  </button>
                  <button
    onClick={() => setTableFilterStatus("active")}
    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "active" ? "bg-white text-emerald-800 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"}`}
  >
                    Hoạt động
                  </button>
                  <button
    onClick={() => setTableFilterStatus("upcoming")}
    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "upcoming" ? "bg-white text-indigo-800 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"}`}
  >
                    Sắp tới
                  </button>
                  <button
    onClick={() => setTableFilterStatus("completed")}
    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${tableFilterStatus === "completed" ? "bg-white text-slate-800 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"}`}
  >
                    Đã đóng
                  </button>
                </div>
              </div>
            </div>

            {
    /* Table Element */
  }
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
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
                  {paginatedSemesters.map((sem) => <tr
    key={sem.id}
    className="hover:bg-slate-50/80 transition-colors group"
  >
                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        <div>
                          <p className="text-xs group-hover:text-blue-600 transition-colors">{sem.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{sem.currentPhase}</p>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-700">
                        {sem.term} ({sem.academicYear})
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                        {sem.startDate} - {sem.endDate}
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-indigo-900">
                        {sem.lecturersCount} GV
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-blue-900">
                        {sem.studentsCount} SV
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${sem.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : sem.status === "upcoming" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : sem.status === "draft" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {sem.status === "active" ? "Ho\u1EA1t \u0111\u1ED9ng" : sem.status === "upcoming" ? "S\u1EAFp di\u1EC5n ra" : sem.status === "draft" ? "Nh\xE1p" : "\u0110\xE3 \u0111\xF3ng"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
    onClick={() => {
      setSelectedSemesterId(sem.id);
      onShowToast(`\u0110\xE3 ch\u1ECDn xem chi ti\u1EBFt: ${sem.name}`);
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

                          {sem.status !== "completed" && <button
    onClick={() => handleCloseSemester(sem.id, sem.name)}
    className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
    title="Đóng kỳ"
  >
                              <Lock className="w-3.5 h-3.5" />
                            </button>}
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {
    /* RIGHT 4 COLUMNS: PROCESS TIMELINE & UPCOMING DEADLINES */
  }
        <div className="lg:col-span-4 space-y-6">
          
          {
    /* INTERNSHIP PROCESS STEPPER */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Quy trình Vận hành
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">7 bước vận hành đợt thực tập chuẩn hóa</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] rounded-md">
                Bước 5/7
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {timelinePhases.map((phase, idx) => <div
    key={idx}
    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${phase.isCurrent ? "bg-blue-600 text-white border-blue-600 shadow-sm" : phase.isDone ? "bg-emerald-50/70 text-emerald-950 border-emerald-200/80" : "bg-slate-50 text-slate-500 border-slate-200/70"}`}
  >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${phase.isCurrent ? "bg-white text-blue-600" : phase.isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {phase.isDone ? "\u2713" : phase.num}
                    </span>
                    <div>
                      <p className={`font-extrabold text-xs ${phase.isCurrent ? "text-white" : "text-slate-900"}`}>
                        {phase.label}
                      </p>
                      <p className={`text-[10px] font-medium ${phase.isCurrent ? "text-blue-100" : "text-slate-500"}`}>
                        {phase.sub}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {
    /* UPCOMING TASKS & DEADLINES */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> Mốc hạn chót tiếp theo
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {upcomingTasks.map((task) => <div key={task.id} className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">{task.title}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${task.color === "emerald" ? "bg-emerald-100 text-emerald-800" : task.color === "amber" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                      {task.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {task.date}
                  </p>
                </div>)}
            </div>
          </div>

        </div>

      </div>

      {
    /* MODALS */
  }
      <CreateSemesterModal
    isOpen={showCreateModal}
    onClose={() => setShowCreateModal(false)}
    onShowToast={onShowToast}
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

    </div>;
};

export { SemestersView as AdminSemestersView };
