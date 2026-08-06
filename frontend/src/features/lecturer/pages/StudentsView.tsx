import { useState, useMemo } from 'react';
import { Toast } from '../../../components/common/Toast';
import { StudentDetailWorkspace } from '../components/StudentDetailWorkspace';
import { StudentProgressWorkspace } from '../components/StudentProgressWorkspace';
import { ReviewSubmissionWorkspace } from '../components/ReviewSubmissionWorkspace';
import {
  Search,
  Plus,
  Upload,
  Download,
  Eye,
  MessageSquare,
  MessageCircle,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  CheckCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Send,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  UserX,
  X,
  BarChart2,
  Users,
  BookOpen,
  TrendingUp
} from 'lucide-react';
export const StudentsView = ({
  students,
  onAddStudent,
  onSendReminder
}) => {
  const [search, setSearch] = useState("");
  const [termFilter, setTermFilter] = useState("H\u1ECDc k\u1EF3 I - 2026");
  const [classFilter, setClassFilter] = useState("T\u1EA5t c\u1EA3");
  const [lecturerFilter, setLecturerFilter] = useState("T\u1EA5t c\u1EA3");
  const [companyFilter, setCompanyFilter] = useState("T\u1EA5t c\u1EA3");
  const [statusFilter, setStatusFilter] = useState("T\u1EA5t c\u1EA3");
  const [progressFilter, setProgressFilter] = useState("T\u1EA5t c\u1EA3");
  const [gpaFilter, setGpaFilter] = useState("T\u1EA5t c\u1EA3");
  const [majorFilter, setMajorFilter] = useState("T\u1EA5t c\u1EA3");
  const [sortBy, setSortBy] = useState("name");
  const [selectedIds, setSelectedIds] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailStudent, setDetailStudent] = useState(null);
  const [reviewState, setReviewState] = useState(null);
  const [commentStudent, setCommentStudent] = useState(null);
  const [chatStudent, setChatStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [aiDrafting, setAiDrafting] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "L\xEA Minh T\xE2m", text: "Em ch\xE0o Th\u1EA7y/C\xF4 \u1EA1, tu\u1EA7n n\xE0y em v\u1EEBa ho\xE0n th\xE0nh xong module OAuth2 API theo ch\u1EC9 d\u1EABn c\u1EE7a Anh H\u1EA3i mentor.", time: "09:15", role: "student" },
    { sender: "TS. Ph\u1EA1m Minh Anh", text: "Ch\xE0o T\xE2m, th\u1EA7y \u0111\xE3 xem qua code commit c\u1EE7a em. K\u1EBFt qu\u1EA3 t\u1ED1t, ch\xFA \xFD th\xEAm ph\u1EA7n x\u1EED l\xFD Refresh Token nh\xE9.", time: "10:02", role: "lecturer" }
  ]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    mssv: "",
    class: "CNTT-K15A",
    gpa: 3.5,
    company: "FPT Software",
    position: "Backend Developer Intern",
    supervisor: "Nguy\u1EC5n V\u0103n H\u1EA3i",
    lecturer: "TS. Ph\u1EA1m Minh Anh",
    major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m"
  });
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const searchLower = search.toLowerCase().trim();
      const matchesSearch = !searchLower || s.name.toLowerCase().includes(searchLower) || s.mssv.includes(searchLower) || s.class.toLowerCase().includes(searchLower) || s.company.toLowerCase().includes(searchLower) || s.position && s.position.toLowerCase().includes(searchLower);
      const matchesClass = classFilter === "T\u1EA5t c\u1EA3" || s.class === classFilter;
      const matchesLecturer = lecturerFilter === "T\u1EA5t c\u1EA3" || s.lecturer === lecturerFilter;
      const matchesCompany = companyFilter === "T\u1EA5t c\u1EA3" || (companyFilter === "Ch\u01B0a c\xF3" ? s.company === "Ch\u01B0a c\xF3" : s.company === companyFilter);
      const matchesStatus = statusFilter === "T\u1EA5t c\u1EA3" || s.status === statusFilter;
      const matchesMajor = majorFilter === "T\u1EA5t c\u1EA3" || s.major === majorFilter;
      let matchesProgress = true;
      if (progressFilter === "< 30%") matchesProgress = s.progress < 30;
      else if (progressFilter === "30% - 70%") matchesProgress = s.progress >= 30 && s.progress <= 70;
      else if (progressFilter === "> 70%") matchesProgress = s.progress > 70 && s.progress < 100;
      else if (progressFilter === "100%") matchesProgress = s.progress === 100;
      let matchesGpa = true;
      if (gpaFilter === "GPA \u2265 3.6") matchesGpa = s.gpa >= 3.6;
      else if (gpaFilter === "3.2 - 3.59") matchesGpa = s.gpa >= 3.2 && s.gpa < 3.6;
      else if (gpaFilter === "2.8 - 3.19") matchesGpa = s.gpa >= 2.8 && s.gpa < 3.2;
      else if (gpaFilter === "< 2.8") matchesGpa = s.gpa < 2.8;
      return matchesSearch && matchesClass && matchesLecturer && matchesCompany && matchesStatus && matchesProgress && matchesGpa && matchesMajor;
    }).sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "vi");
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "updatedAt") return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      return 0;
    });
  }, [students, search, classFilter, lecturerFilter, companyFilter, statusFilter, progressFilter, gpaFilter, majorFilter, sortBy]);
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectOne = (id) => {
    setSelectedIds(
      (prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleBulkNotify = () => {
    showToast(`\u0110\xE3 g\u1EEDi th\xF4ng b\xE1o \u0111\u1EBFn ${selectedIds.length} sinh vi\xEAn \u0111\u01B0\u1EE3c ch\u1ECDn`);
    setSelectedIds([]);
  };
  const handleBulkExport = () => {
    showToast(`\u0110\xE3 xu\u1EA5t d\u1EEF li\u1EC7u Excel cho ${selectedIds.length} sinh vi\xEAn`);
    setSelectedIds([]);
  };
  const handleBulkAssignCompany = () => {
    setShowAssignModal(true);
  };
  const handleBulkStatusChange = () => {
    showToast(`\u0110\xE3 chuy\u1EC3n tr\u1EA1ng th\xE1i cho ${selectedIds.length} sinh vi\xEAn sang "\u0110ang ch\u1EC9nh s\u1EEDa"`);
    setSelectedIds([]);
  };
  const handleCreateStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.mssv) return;
    onAddStudent?.({
      id: `sv-${Date.now()}`,
      ...newStudent,
      status: "\u0110\xFAng ti\u1EBFn \u0111\u1ED9",
      progress: 20,
      riskFlag: false,
      lastReportName: "\u0110\u0103ng k\xFD \u0111\u1EC1 t\xE0i th\u1EF1c t\u1EADp",
      lastReportDate: "H\xF4m nay",
      updatedAt: "H\xF4m nay"
    });
    setShowAddModal(false);
    showToast(`\u0110\xE3 th\xEAm th\xE0nh c\xF4ng sinh vi\xEAn ${newStudent.name}`);
    setNewStudent({
      name: "",
      mssv: "",
      class: "CNTT-K15A",
      gpa: 3.5,
      company: "FPT Software",
      position: "Backend Developer Intern",
      supervisor: "Nguy\u1EC5n V\u0103n H\u1EA3i",
      lecturer: "TS. Ph\u1EA1m Minh Anh",
      major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m"
    });
  };
  const handleGenerateAiComment = () => {
    setAiDrafting(true);
    setTimeout(() => {
      if (commentStudent) {
        setCommentText(`[AI \u0110\u1EC1 xu\u1EA5t Nh\u1EADn x\xE9t]: Sinh vi\xEAn ${commentStudent.name} (MSSV: ${commentStudent.mssv}) \u0111\xE3 ho\xE0n th\xE0nh ${commentStudent.progress}% kh\u1ED1i l\u01B0\u1EE3ng th\u1EF1c t\u1EADp t\u1EA1i ${commentStudent.company}. B\xE1o c\xE1o g\u1EA7n nh\u1EA5t "${commentStudent.lastReportName}" c\xF3 k\u1EBFt qu\u1EA3 \u0111\u1EA1t ti\xEAu chu\u1EA9n. \u0110\u1EC1 xu\u1EA5t ti\u1EBFp t\u1EE5c duy tr\xEC ti\u1EBFn \u0111\u1ED9 v\xE0 ho\xE0n thi\u1EC7n b\xE1o c\xE1o t\u1ED5ng k\u1EBFt.`);
      }
      setAiDrafting(false);
    }, 800);
  };
  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    showToast(`\u0110\xE3 l\u01B0u nh\u1EADn x\xE9t cho sinh vi\xEAn ${commentStudent?.name}`);
    setCommentStudent(null);
    setCommentText("");
  };
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: "TS. Ph\u1EA1m Minh Anh (Gi\u1EA3ng vi\xEAn)", text: chatMessage, time: "V\u1EEBa xong", role: "lecturer" }
    ]);
    setChatMessage("");
  };
  const renderStatusChip = (status, riskFlag) => {
    switch (status) {
      case "\u0110\xFAng ti\u1EBFn \u0111\u1ED9":
      case "\u0110\xFAng h\u1EA1n":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đúng tiến độ
          </span>;
      case "Ch\u1EDD ph\u1EA3n h\u1ED3i":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Chờ phản hồi
          </span>;
      case "\u0110ang ch\u1EC9nh s\u1EEDa":
      case "Ch\u1EADm":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shrink-0">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            Đang chỉnh sửa
          </span>;
      case "Qu\xE1 h\u1EA1n":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Quá hạn
          </span>;
      case "Ho\xE0n th\xE0nh":
      case "\u0110\xE3 xong":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            Hoàn thành
          </span>;
      case "Ch\u01B0a c\xF3 doanh nghi\u1EC7p":
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Chưa có doanh nghiệp
          </span>;
    }
  };
  if (reviewState) {
    return <ReviewSubmissionWorkspace
      student={reviewState.student}
      submissionTitle={reviewState.title}
      onBack={() => setReviewState(null)}
      onApprove={() => {
        setReviewState(null);
      }}
      onRequestRevision={() => {
        setReviewState(null);
      }}
    />;
  }
  if (detailStudent) {
    return (
      <StudentDetailWorkspace
        student={detailStudent}
        onBack={() => setDetailStudent(null)}
        onSendComment={(comment) => showToast(`Đã lưu nhận xét cho ${detailStudent.name}`)}
        onChat={() => showToast(`Đã mở khung trao đổi với ${detailStudent.name}`)}
        onGrade={() => showToast(`Đã ghi nhận điểm cho ${detailStudent.name}`)}
        onReviewSubmission={() => showToast(`Mở duyệt bài nộp của ${detailStudent.name}`)}
      />
    );
  }
  return <div className="space-y-4 animate-in fade-in duration-200">
      {
    /* Toast Alert */
  }
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      {
    /* HEADER SECTION */
  }
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Sinh viên
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Quản lý và theo dõi toàn bộ sinh viên thực tập.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
    onClick={() => setShowImportModal(true)}
    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
  >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Import Excel</span>
          </button>

          <button
    onClick={() => showToast("\u0110\xE3 xu\u1EA5t to\xE0n b\u1ED9 danh s\xE1ch sinh vi\xEAn ra file Excel (.xlsx)")}
    className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
  >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất Excel</span>
          </button>

          <button
    onClick={() => setShowAddModal(true)}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
  >
            <Plus className="w-4 h-4" />
            <span>+ Thêm sinh viên</span>
          </button>
        </div>
      </div>

      {
    /* 4 SYNCHRONIZED TOP METRIC CARDS */
  }
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {
    /* 1. TỔNG SINH VIÊN HƯỚNG DẪN */
  }
        <div
    onClick={() => setStatusFilter("T\u1EA5t c\u1EA3")}
    className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">
              Sinh viên hướng dẫn
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{students.length}</span>
            <span className="text-xs font-bold text-slate-400">sinh viên</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">Danh sách đợt hiện tại</span>
        </div>

        {
    /* 2. ĐÃ TIẾP NHẬN DOANH NGHIỆP */
  }
        <div
    onClick={() => setCompanyFilter("FPT Software")}
    className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
              Đã tiếp nhận Doanh nghiệp
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800">
              {students.filter((s) => s.company !== "Ch\u01B0a c\xF3").length}
            </span>
            <span className="text-xs font-bold text-emerald-600">sinh viên</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">Đang làm việc tại công ty</span>
        </div>

        {
    /* 3. CHƯA CÓ DOANH NGHIỆP */
  }
        <div
    onClick={() => setCompanyFilter("Ch\u01B0a c\xF3")}
    className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
              Chưa có doanh nghiệp
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-800">
              {students.filter((s) => s.company === "Ch\u01B0a c\xF3").length}
            </span>
            <span className="text-xs font-bold text-amber-600">sinh viên</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Cần hỗ trợ ghép cặp</span>
        </div>

        {
    /* 4. TIẾN ĐỘ TRUNG BÌNH */
  }
        <div
    onClick={() => setProgressFilter("T\u1EA5t c\u1EA3")}
    className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 p-4 rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">
              Tiến độ trung bình
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-900">
              {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length) : 0}%
            </span>
            <span className="text-xs font-bold text-blue-600">tiến độ</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold block">Bình quân toàn bộ sinh viên</span>
        </div>
      </section>

      {
    /* TỔNG QUAN ĐỢT THỰC TẬP & SEARCH / FILTERS BAR */
  }
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {
    /* Header Section Label */
  }
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              Tổng quan đợt thực tập
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-200/60">
              {termFilter}
            </span>
          </div>

          {(classFilter !== "T\u1EA5t c\u1EA3" || companyFilter !== "T\u1EA5t c\u1EA3" || statusFilter !== "T\u1EA5t c\u1EA3" || progressFilter !== "T\u1EA5t c\u1EA3" || search) && <button
    onClick={() => {
      setSearch("");
      setClassFilter("T\u1EA5t c\u1EA3");
      setCompanyFilter("T\u1EA5t c\u1EA3");
      setStatusFilter("T\u1EA5t c\u1EA3");
      setProgressFilter("T\u1EA5t c\u1EA3");
      setGpaFilter("T\u1EA5t c\u1EA3");
      setMajorFilter("T\u1EA5t c\u1EA3");
    }}
    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
  >
              Xóa bộ lọc
            </button>}
        </div>

        {
    /* Filter inputs in 1 neat row */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          {
    /* Search input */
  }
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Tìm MSSV, họ tên, lớp, doanh nghiệp..."
    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
  />
          </div>

          <div>
            <select
    value={classFilter}
    onChange={(e) => setClassFilter(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Lớp</option>
              <option value="CNTT-K15A">CNTT-K15A</option>
              <option value="CNTT-K15B">CNTT-K15B</option>
              <option value="CNTT-02">CNTT-02</option>
            </select>
          </div>

          <div>
            <select
    value={companyFilter}
    onChange={(e) => setCompanyFilter(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Doanh nghiệp</option>
              <option value="FPT Software">FPT Software</option>
              <option value="VNG Corporation">VNG Corp</option>
              <option value="Viettel Group">Viettel Group</option>
              <option value="VinFast">VinFast</option>
              <option value="MB Bank">MB Bank</option>
              <option value="Chưa có">Chưa có DN</option>
            </select>
          </div>

          <div>
            <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Trạng thái</option>
              <option value="Đúng tiến độ">Đúng tiến độ</option>
              <option value="Chờ phản hồi">Chờ phản hồi</option>
              <option value="Đang chỉnh sửa">Đang chỉnh sửa</option>
              <option value="Quá hạn">Quá hạn</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>

          <div>
            <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full p-1.5 bg-blue-50/80 border border-blue-200 rounded-xl outline-none font-bold text-blue-900 text-[11px]"
  >
              <option value="name">Sắp xếp: Tên A-Z</option>
              <option value="progress">Sắp xếp: Tiến độ</option>
              <option value="updatedAt">Sắp xếp: Mới nhất</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* BULK ACTIONS BAR (Appears when 1+ checkboxes checked) */
  }
      {selectedIds.length > 0 && <div className="bg-blue-900 text-white p-3 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in zoom-in-98">
          <div className="flex items-center gap-2 text-xs font-bold pl-2">
            <span className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-[11px]">
              {selectedIds.length}
            </span>
            <span>Đã chọn {selectedIds.length} sinh viên</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
    onClick={handleBulkNotify}
    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
  >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi thông báo</span>
            </button>

            <button
    onClick={handleBulkExport}
    className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
  >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel</span>
            </button>

            <button
    onClick={handleBulkAssignCompany}
    className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
  >
              <Building2 className="w-3.5 h-3.5" />
              <span>Phân công doanh nghiệp</span>
            </button>

            <button
    onClick={handleBulkStatusChange}
    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
  >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đổi trạng thái</span>
            </button>

            <button
    onClick={() => setSelectedIds([])}
    className="p-1.5 hover:bg-blue-800 rounded-lg text-blue-200 transition-colors"
  >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>}

      {
    /* BALANCED STUDENT DATA TABLE (NO HORIZONTAL OVERFLOW) */
  }
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full">
          {filteredStudents.length === 0 ? (
    /* EMPTY STATE */
    <div className="p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Chưa có sinh viên trong học kỳ này.</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Không tìm thấy sinh viên tương ứng với bộ lọc hiện tại. Thử xóa bộ lọc hoặc thêm sinh viên mới.</p>
              </div>
              <button
      onClick={() => setShowAddModal(true)}
      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs inline-flex items-center gap-2 transition-colors"
    >
                <Plus className="w-4 h-4" />
                <span>Thêm sinh viên</span>
              </button>
            </div>
  ) : <div className="w-full">
              <table className="w-full text-left text-xs border-collapse table-auto">
                <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-8 text-center">
                      <input
    type="checkbox"
    onChange={handleSelectAll}
    checked={selectedIds.length === paginatedStudents.length && paginatedStudents.length > 0}
    className="rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
  />
                    </th>
                    <th className="py-2.5 px-3">Sinh viên</th>
                    <th className="py-2.5 px-3">Lớp & GPA</th>
                    <th className="py-2.5 px-3">Doanh nghiệp & Vị trí</th>
                    <th className="py-2.5 px-3">Tiến độ</th>
                    <th className="py-2.5 px-3">Bài nộp gần nhất</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {paginatedStudents.map((s) => {
    const isSelected = selectedIds.includes(s.id);
    return <tr
      key={s.id}
      className={`hover:bg-blue-50/30 transition-colors ${isSelected ? "bg-blue-50/60" : ""}`}
    >
                        <td className="py-2.5 px-3 text-center">
                          <input
      type="checkbox"
      checked={isSelected}
      onChange={() => handleSelectOne(s.id)}
      className="rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
                        </td>

                        {
      /* SINH VIÊN (AVATAR + NAME + MSSV) */
    }
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
      src={s.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
      alt={s.name}
      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
    />
                            <div>
                              <p className="font-extrabold text-slate-900 leading-snug">{s.name}</p>
                              <span className="text-[10px] text-slate-500 font-mono">MSSV: {s.mssv}</span>
                            </div>
                          </div>
                        </td>

                        {
      /* LỚP & GPA */
    }
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-slate-700 text-[11px]">
                            {s.class}
                          </span>
                          <span className="text-[10px] text-blue-600 font-bold ml-1.5">GPA {s.gpa}</span>
                        </td>

                        {
      /* DOANH NGHIỆP & VỊ TRÍ */
    }
                        <td className="py-2.5 px-3 max-w-[200px]">
                          <p className={`font-bold text-[11px] truncate ${s.company === "Ch\u01B0a c\xF3" ? "text-slate-400 italic" : "text-slate-900"}`}>
                            {s.company}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {s.position || "\u2014"}
                          </p>
                        </td>

                        {
      /* TIẾN ĐỘ PROGRESS BAR */
    }
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-slate-800 w-8">{s.progress}%</span>
                            <div className="w-16 sm:w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
      className={`h-full rounded-full transition-all duration-500 ${s.progress === 100 ? "bg-blue-600" : s.progress >= 70 ? "bg-emerald-500" : s.progress >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
      style={{ width: `${s.progress}%` }}
    />
                            </div>
                          </div>
                        </td>

                        {
      /* BÀI NỘP GẦN NHẤT */
    }
                        <td className="py-2.5 px-3 max-w-[160px]">
                          <p className="text-slate-800 font-semibold text-[11px] truncate" title={s.lastReportName}>
                            {s.lastReportName || "Ch\u01B0a n\u1ED9p"}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {s.updatedAt || s.lastReportDate || "\u2014"}
                          </span>
                        </td>

                        {
      /* STATUS CHIP */
    }
                        <td className="py-2.5 px-3">
                          {renderStatusChip(s.status, s.riskFlag)}
                        </td>

                        {
      /* ROW ACTIONS */
    }
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
      onClick={() => setDetailStudent(s)}
      title="Chi tiết sinh viên"
      className="p-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
    >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
      onClick={() => {
        setCommentStudent(s);
        setCommentText("");
      }}
      title="Thêm nhận xét"
      className="p-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
    >
                              <MessageSquare className="w-4 h-4" />
                            </button>

                            <button
      onClick={() => setChatStudent(s)}
      title="Trao đổi 1:1"
      className="p-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
    >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {
      /* MORE DROPDOWN */
    }
                            <div className="relative">
                              <button
      onClick={() => setActiveDropdownId(activeDropdownId === s.id ? null : s.id)}
      className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"
    >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {activeDropdownId === s.id && <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 z-30 py-1 text-xs animate-in fade-in zoom-in-95">
                                  <button
      onClick={() => {
        onSendReminder?.(s);
        setActiveDropdownId(null);
      }}
      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
    >
                                    <Send className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Gửi nhắc nộp bài</span>
                                  </button>

                                  <button
      onClick={() => {
        setShowAssignModal(true);
        setActiveDropdownId(null);
      }}
      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
    >
                                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Phân công DN</span>
                                  </button>

                                  <button
      onClick={() => {
        showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o c\xE1 nh\xE2n c\u1EE7a ${s.name}`);
        setActiveDropdownId(null);
      }}
      className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
    >
                                    <Download className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Tải file báo cáo</span>
                                  </button>
                                </div>}
                            </div>
                          </div>
                        </td>
                      </tr>;
  })}
                </tbody>
              </table>
            </div>}

          {
    /* PAGINATION */
  }
          <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-600">
              <span>Hiển thị tối đa:</span>
              <select
    value={pageSize}
    onChange={(e) => {
      setPageSize(Number(e.target.value));
      setCurrentPage(1);
    }}
    className="px-2 py-1 bg-white border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
  >
                <option value={10}>10 dòng/trang</option>
                <option value={20}>20 dòng/trang</option>
                <option value={50}>50 dòng/trang</option>
              </select>
              <span className="text-slate-400 font-normal">
                (Hiển thị {Math.min((currentPage - 1) * pageSize + 1, filteredStudents.length)} - {Math.min(currentPage * pageSize, filteredStudents.length)} / tổng {filteredStudents.length} sinh viên)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors text-slate-700"
  >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => <button
    key={pg}
    onClick={() => setCurrentPage(pg)}
    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentPage === pg ? "bg-blue-600 text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
  >
                  {pg}
                </button>)}

              <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors text-slate-700"
  >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {
    /* FLOATING SUMMARY PANEL */
  }
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Tổng quan đợt thực tập
              </h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                HK I - 2026
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-semibold">Tổng số sinh viên</span>
                <span className="font-black text-slate-900">28</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50/60 text-emerald-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Đúng tiến độ
                </span>
                <span className="font-bold">18 SV</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50/60 text-amber-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Chậm tiến độ
                </span>
                <span className="font-bold">5 SV</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-rose-50/60 text-rose-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Quá hạn
                </span>
                <span className="font-bold">2 SV</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50/60 text-blue-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Hoàn thành
                </span>
                <span className="font-bold">3 SV</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold">
                <span className="text-slate-600">Average GPA:</span>
                <span className="text-blue-600 text-sm">3.48 / 4.0</span>
              </div>
            </div>
          </div>
        </div>

      {
    /* STUDENT DETAIL MODAL (👁 Chi tiết) */
  }
      {detailStudent && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Hồ sơ chi tiết sinh viên thực tập
              </h3>
              <button
    onClick={() => setDetailStudent(null)}
    className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg font-bold"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img
    src={detailStudent.avatar}
    alt={detailStudent.name}
    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
  />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-slate-900">{detailStudent.name}</h4>
                    {renderStatusChip(detailStudent.status, detailStudent.riskFlag)}
                  </div>
                  <p className="text-slate-500 font-mono">MSSV: {detailStudent.mssv} • Lớp: {detailStudent.class}</p>
                  <p className="text-blue-600 font-semibold">Chuyên ngành: {detailStudent.major}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Doanh nghiệp tiếp nhận</p>
                  <p className="font-bold text-slate-900 text-sm">{detailStudent.company}</p>
                  <p className="text-slate-600">Vị trí: <strong>{detailStudent.position || "Th\u1EF1c t\u1EADp sinh"}</strong></p>
                  <p className="text-slate-500 text-[11px]">Mentor: {detailStudent.supervisor}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Giảng viên hướng dẫn</p>
                  <p className="font-bold text-slate-900 text-sm">{detailStudent.lecturer}</p>
                  <p className="text-blue-600 font-extrabold">Điểm GPA tích lũy: {detailStudent.gpa} / 4.0</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-blue-900">
                  <span>Tiến độ thực tập: {detailStudent.progress}%</span>
                  <span>Bài nộp gần nhất: {detailStudent.lastReportDate || "M\u1EDBi nh\u1EA5t"}</span>
                </div>
                <p className="text-slate-700 font-medium">{detailStudent.lastReportName || "Ch\u01B0a n\u1ED9p b\xE0i"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    onClick={() => setDetailStudent(null)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
  >
                Đóng
              </button>
              <button
    onClick={() => {
      onSendReminder?.(detailStudent);
      setDetailStudent(null);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
  >
                Gửi nhắc nộp bài
              </button>
            </div>
          </div>
        </div>}

      {
    /* LECTURER COMMENT MODAL (📝 Nhận xét) */
  }
      {commentStudent && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSendComment} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Nhận xét tiến độ: {commentStudent.name}
              </h3>
              <button onClick={() => setCommentStudent(null)} className="p-1 text-slate-400 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">{commentStudent.name} ({commentStudent.mssv})</p>
                  <p className="text-slate-500">{commentStudent.company} • Tiến độ: {commentStudent.progress}%</p>
                </div>
                <button
    type="button"
    onClick={handleGenerateAiComment}
    disabled={aiDrafting}
    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors"
  >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>{aiDrafting ? "\u0110ang t\u1EA1o..." : "AI So\u1EA1n g\u1EE3i \xFD"}</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung nhận xét của giảng viên</label>
                <textarea
    rows={4}
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Nhập đánh giá, lưu ý hoặc góp ý cho sinh viên..."
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 leading-relaxed"
  />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setCommentStudent(null)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
  >
                Hủy
              </button>
              <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
  >
                Lưu nhận xét
              </button>
            </div>
          </form>
        </div>}

      {
    /* STUDENT CHAT DIALOG (💬 Trao đổi) */
  }
      {chatStudent && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <img src={chatStudent.avatar} alt={chatStudent.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Kênh trao đổi trực tiếp</h3>
                  <p className="text-[11px] text-slate-500">GV: {chatStudent.lecturer} • SV: {chatStudent.name}</p>
                </div>
              </div>
              <button onClick={() => setChatStudent(null)} className="p-1 text-slate-400 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            {
    /* Chat Body */
  }
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
              {chatHistory.map((msg, idx) => <div
    key={idx}
    className={`p-3 rounded-xl max-w-[85%] ${msg.role === "lecturer" ? "ml-auto bg-blue-600 text-white rounded-br-xs" : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"}`}
  >
                  <div className="flex justify-between items-center gap-2 mb-1 font-bold text-[10px] opacity-80">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                </div>)}
            </div>

            {
    /* Chat Input */
  }
            <form onSubmit={handleSendChatMessage} className="flex gap-2 shrink-0">
              <input
    type="text"
    value={chatMessage}
    onChange={(e) => setChatMessage(e.target.value)}
    placeholder="Nhập tin nhắn nhắn gửi sinh viên..."
    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
  />
              <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
  >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </div>}

      {
    /* ADD STUDENT MODAL (+ Thêm sinh viên) */
  }
      {showAddModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateStudentSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Thêm sinh viên thực tập mới</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên sinh viên</label>
                <input
    type="text"
    required
    value={newStudent.name}
    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
    placeholder="Ví dụ: Nguyễn Văn Hải"
  />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MSSV</label>
                  <input
    type="text"
    required
    value={newStudent.mssv}
    onChange={(e) => setNewStudent({ ...newStudent, mssv: e.target.value })}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono"
    placeholder="20120999"
  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lớp</label>
                  <select
    value={newStudent.class}
    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
  >
                    <option value="CNTT-K15A">CNTT-K15A</option>
                    <option value="CNTT-K15B">CNTT-K15B</option>
                    <option value="CNTT-02">CNTT-02</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doanh nghiệp</label>
                  <input
    type="text"
    value={newStudent.company}
    onChange={(e) => setNewStudent({ ...newStudent, company: e.target.value })}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
    placeholder="FPT Software"
  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GPA</label>
                  <input
    type="number"
    step="0.01"
    value={newStudent.gpa}
    onChange={(e) => setNewStudent({ ...newStudent, gpa: parseFloat(e.target.value) })}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-blue-600"
  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setShowAddModal(false)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
  >
                Hủy
              </button>
              <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
  >
                Thêm sinh viên
              </button>
            </div>
          </form>
        </div>}

      {
    /* IMPORT EXCEL MODAL */
  }
      {showImportModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Import danh sách sinh viên Excel
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl text-center space-y-2 bg-slate-50/50 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="font-bold text-slate-800 text-xs">Kéo thả file .XLSX hoặc .CSV vào đây</p>
              <p className="text-[10px] text-slate-400">Hỗ trợ file chuẩn Khung Đào tạo Đại học (&lt; 10MB)</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    onClick={() => setShowImportModal(false)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
  >
                Hủy
              </button>
              <button
    onClick={() => {
      setShowImportModal(false);
      showToast("\u0110\xE3 t\u1EA3i l\xEAn v\xE0 nh\u1EADp d\u1EEF li\u1EC7u 28 sinh vi\xEAn t\u1EEB file Excel th\xE0nh c\xF4ng!");
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
  >
                Tải lên & Xử lý
              </button>
            </div>
          </div>
        </div>}

      {
    /* ASSIGN COMPANY MODAL */
  }
      {showAssignModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Phân công doanh nghiệp thực tập
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn doanh nghiệp tiếp nhận</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none">
                  <option value="FPT Software">FPT Software (Còn 5 chỉ tiêu)</option>
                  <option value="VNG Corporation">VNG Corp (Còn 3 chỉ tiêu)</option>
                  <option value="Viettel Group">Viettel Group (Còn 4 chỉ tiêu)</option>
                  <option value="CMC Global">CMC Global (Còn 8 chỉ tiêu)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cán bộ phụ trách (Mentor)</label>
                <input
    type="text"
    defaultValue="Nguyễn Văn Hải (Lead Tech)"
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none"
  />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
    onClick={() => setShowAssignModal(false)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
  >
                Hủy
              </button>
              <button
    onClick={() => {
      setShowAssignModal(false);
      showToast("\u0110\xE3 ho\xE0n t\u1EA5t ph\xE2n c\xF4ng doanh nghi\u1EC7p th\u1EF1c t\u1EADp th\xE0nh c\xF4ng!");
      setSelectedIds([]);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
  >
                Xác nhận phân công
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
