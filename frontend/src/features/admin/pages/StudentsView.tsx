import { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  KeyRound,
  Lock,
  Unlock,
  RotateCcw,
  Eye,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  GraduationCap,
  Building2,
  FileUp,
  Check
} from 'lucide-react';
import { CreateStudentModal } from '../components/modals/CreateStudentModal';
export const StudentsView = ({
  onShowToast
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGenerateAccountsModalOpen, setIsGenerateAccountsModalOpen] = useState(false);
  const [students, setStudents] = useState([
    {
      id: "st-1",
      mssv: "20110201",
      fullName: "Nguy\u1EC5n V\u0103n Minh",
      gender: "Nam",
      dateOfBirth: "15/04/2002",
      classCode: "20CNTT1",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110201@student.hcmute.edu.vn",
      phone: "0912 345 678",
      assignedLecturer: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      companyName: "FPT Software HCM",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "02/08/2026 08:45",
      gpa: 3.42
    },
    {
      id: "st-2",
      mssv: "20110202",
      fullName: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o",
      gender: "N\u1EEF",
      dateOfBirth: "22/09/2002",
      classCode: "20CNTT1",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110202@student.hcmute.edu.vn",
      phone: "0908 765 432",
      assignedLecturer: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      companyName: "VNG Corporation",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "01/08/2026 19:20",
      gpa: 3.65
    },
    {
      id: "st-3",
      mssv: "20110205",
      fullName: "L\xEA Ho\xE0ng Nam",
      gender: "Nam",
      dateOfBirth: "10/11/2002",
      classCode: "20KTPM1",
      major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110205@student.hcmute.edu.vn",
      phone: "0933 111 222",
      assignedLecturer: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      companyName: "Viettel Telecom",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "02/08/2026 10:12",
      gpa: 3.18
    },
    {
      id: "st-4",
      mssv: "20110208",
      fullName: "Ph\u1EA1m \u0110\u0103ng Khoa",
      gender: "Nam",
      dateOfBirth: "05/02/2002",
      classCode: "20KTPM2",
      major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110208@student.hcmute.edu.vn",
      phone: "0977 888 999",
      assignedLecturer: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh",
      companyName: "MGM Technology",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "31/07/2026 15:30",
      gpa: 3.25
    },
    {
      id: "st-5",
      mssv: "20110212",
      fullName: "V\u0169 Ng\u1ECDc B\u1EA3o Tr\xE2m",
      gender: "N\u1EEF",
      dateOfBirth: "18/06/2002",
      classCode: "20MMT1",
      major: "M\u1EA1ng m\xE1y t\xEDnh",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110212@student.hcmute.edu.vn",
      phone: "0988 222 333",
      assignedLecturer: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i",
      companyName: "TMA Solutions",
      accountStatus: "pending",
      internshipStatus: "preparing",
      lastLogin: "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
      gpa: 3.5
    },
    {
      id: "st-6",
      mssv: "20110218",
      fullName: "Ng\xF4 Qu\u1ED1c Huy",
      gender: "Nam",
      dateOfBirth: "30/01/2002",
      classCode: "20HTTT1",
      major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110218@student.hcmute.edu.vn",
      phone: "0918 555 666",
      assignedLecturer: "Ch\u01B0a ph\xE2n c\xF4ng",
      companyName: "KMS Technology",
      accountStatus: "pending",
      internshipStatus: "preparing",
      lastLogin: "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
      gpa: 2.95
    },
    {
      id: "st-7",
      mssv: "20110224",
      fullName: "Ho\xE0ng Minh Tu\u1EA5n",
      gender: "Nam",
      dateOfBirth: "12/08/2002",
      classCode: "20CNTT2",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110224@student.hcmute.edu.vn",
      phone: "0903 444 777",
      assignedLecturer: "TS. B\xF9i Minh Ti\u1EBFn",
      companyName: "Bosch Global Software",
      accountStatus: "locked",
      internshipStatus: "paused",
      lastLogin: "20/06/2026 (\u0110\xE3 kh\xF3a)",
      gpa: 2.7
    },
    {
      id: "st-8",
      mssv: "20110230",
      fullName: "\u0110\u1EB7ng Th\xF9y D\u01B0\u01A1ng",
      gender: "N\u1EEF",
      dateOfBirth: "03/03/2002",
      classCode: "20CNTT1",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110230@student.hcmute.edu.vn",
      phone: "0912 999 000",
      assignedLecturer: "ThS. Ph\u1EA1m Qu\u1ED1c B\u1EA3o",
      companyName: "Shopee Vietnam",
      accountStatus: "active",
      internshipStatus: "completed",
      lastLogin: "02/08/2026 07:15",
      gpa: 3.8
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState("all");
  const [internshipFilter, setInternshipFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importFileName, setImportFileName] = useState(null);
  const handleAddStudent = (newSt) => {
    setStudents((prev) => [newSt, ...prev]);
  };
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.accountStatus === "active").length;
  const pendingAccounts = students.filter((s) => s.accountStatus === "pending").length;
  const interningStudents = students.filter((s) => s.internshipStatus === "interning" || s.companyName !== "Ch\u01B0a c\xF3").length;
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || s.mssv.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()) || s.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = classFilter === "all" || s.classCode === classFilter;
      const matchAccount = accountStatusFilter === "all" || s.accountStatus === accountStatusFilter;
      const matchIntern = internshipFilter === "all" || s.internshipStatus === internshipFilter;
      return matchSearch && matchClass && matchAccount && matchIntern;
    });
  }, [students, searchQuery, classFilter, accountStatusFilter, internshipFilter]);
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);
  const isAllPageSelected = paginatedStudents.length > 0 && paginatedStudents.every((s) => selectedIds.includes(s.id));
  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedStudents.some((ps) => ps.id === id)));
    } else {
      const pageIds = paginatedStudents.map((s) => s.id);
      setSelectedIds((prev) => Array.from(/* @__PURE__ */ new Set([...prev, ...pageIds])));
    }
  };
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };
  const handleQuickGrantSingle = (st) => {
    setStudents((prev) => prev.map((s) => s.id === st.id ? { ...s, accountStatus: "active", lastLogin: "V\u1EEBa c\u1EA5p t\xE0i kho\u1EA3n" } : s));
    onShowToast(`\u0110\xE3 c\u1EA5p t\xE0i kho\u1EA3n th\xE0nh c\xF4ng cho sinh vi\xEAn ${st.fullName} (${st.mssv})`);
  };
  const handleBatchGenerateAccounts = () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : students.filter((s) => s.accountStatus === "pending").map((s) => s.id);
    setStudents((prev) => prev.map((s) => {
      if (targetIds.includes(s.id)) {
        return { ...s, accountStatus: "active", lastLogin: "V\u1EEBa c\u1EA5p t\xE0i kho\u1EA3n" };
      }
      return s;
    }));
    onShowToast(`\u0110\xE3 c\u1EA5p t\xE0i kho\u1EA3n th\xE0nh c\xF4ng cho ${targetIds.length} sinh vi\xEAn`);
    setIsGenerateAccountsModalOpen(false);
    setSelectedIds([]);
  };
  const handleResetPassword = (st) => {
    onShowToast(`\u0110\xE3 \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u m\u1EB7c \u0111\u1ECBnh (Fit@2026!) cho sinh vi\xEAn ${st.fullName}`);
  };
  const handleToggleLockAccount = (id) => {
    setStudents((prev) => prev.map((s) => {
      if (s.id === id) {
        const newStatus = s.accountStatus === "locked" ? "active" : "locked";
        onShowToast(`\u0110\xE3 ${newStatus === "locked" ? "kh\xF3a" : "m\u1EDF kh\xF3a"} t\xE0i kho\u1EA3n c\u1EE7a ${s.fullName}`);
        return { ...s, accountStatus: newStatus };
      }
      return s;
    }));
  };
  const handleFileDrop = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFileName(e.target.files[0].name);
    }
  };
  return <div className="p-6 space-y-6 max-w-[1500px] mx-auto animate-in fade-in duration-300">
      
      {
    /* PAGE TITLE & ACTION BAR */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Sinh viên</h1>
        </div>

        {
    /* Core Actions */
  }
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
    onClick={() => setIsImportModalOpen(true)}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
  >
            <FileUp className="w-3.5 h-3.5 text-slate-600" />
            <span>Import Excel</span>
          </button>

          <button
    onClick={() => setIsCreateModalOpen(true)}
    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs rounded-xl border border-blue-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
  >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Thêm sinh viên</span>
          </button>

          <button
    onClick={() => setIsGenerateAccountsModalOpen(true)}
    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
  >
            <KeyRound className="w-4 h-4" />
            <span>Cấp tài khoản nhanh ({pendingAccounts})</span>
          </button>
        </div>
      </div>

      {
    /* CORE STATS KPI CARDS */
  }
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">Tổng số Sinh viên</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs font-bold text-slate-400">sinh viên</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold block">Danh sách đợt hiện tại</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">Đã cấp tài khoản</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800">{activeStudents}</span>
            <span className="text-xs font-bold text-emerald-600">tài khoản</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">Đã có quyền đăng nhập</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">Chưa có tài khoản</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-800">{pendingAccounts}</span>
            <span className="text-xs font-bold text-amber-600">sinh viên</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Cần chọn cấp nhanh</span>
        </div>

        <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 p-4 rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">Đã tiếp nhận Doanh nghiệp</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-900">{interningStudents}</span>
            <span className="text-xs font-bold text-slate-400">sinh viên</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">Đã có doanh nghiệp</span>
        </div>
      </section>

      {
    /* STUDENTS MAIN TABLE */
  }
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        
        {
    /* Table Header & Search Filters */
  }
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Danh sách Sinh viên ({filteredStudents.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">Bảng thông tin chi tiết và quản lý tài khoản sinh viên</p>
          </div>

          {
    /* Search & Filter Inputs */
  }
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    }}
    placeholder="Tìm tên, MSSV, Email, Doanh nghiệp..."
    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-blue-500"
  />
            </div>

            <select
    value={classFilter}
    onChange={(e) => {
      setClassFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
              <option value="all">Tất cả Lớp</option>
              <option value="20CNTT1">Lớp 20CNTT1</option>
              <option value="20KTPM1">Lớp 20KTPM1</option>
              <option value="20KTPM2">Lớp 20KTPM2</option>
              <option value="20MMT1">Lớp 20MMT1</option>
              <option value="20HTTT1">Lớp 20HTTT1</option>
            </select>

            <select
    value={accountStatusFilter}
    onChange={(e) => {
      setAccountStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
              <option value="all">Tất cả trạng thái TK</option>
              <option value="active">Đã cấp tài khoản</option>
              <option value="pending">Chưa cấp tài khoản</option>
              <option value="locked">Tài khoản bị khóa</option>
            </select>

            {selectedIds.length > 0 && <button
    onClick={handleBatchGenerateAccounts}
    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer animate-in fade-in"
  >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Cấp TK đã chọn ({selectedIds.length})</span>
              </button>}
          </div>
        </div>

        {
    /* Data Table */
  }
        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 text-center w-10">
                  <input
    type="checkbox"
    checked={isAllPageSelected}
    onChange={handleToggleSelectAllPage}
    className="rounded text-blue-600 cursor-pointer"
  />
                </th>
                <th className="py-2.5 px-3">Sinh viên</th>
                <th className="py-2.5 px-3">MSSV & Lớp</th>
                <th className="py-2.5 px-3">Doanh nghiệp thực tập</th>
                <th className="py-2.5 px-3">GV Hướng dẫn</th>
                <th className="py-2.5 px-3 text-center">Trạng thái TK</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Không tìm thấy sinh viên nào khớp với bộ lọc.
                  </td>
                </tr> : paginatedStudents.map((st) => {
    const isSelected = selectedIds.includes(st.id);
    return <tr
      key={st.id}
      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
    >
                      <td className="py-3 px-3 text-center">
                        <input
      type="checkbox"
      checked={isSelected}
      onChange={() => handleToggleSelect(st.id)}
      className="rounded text-blue-600 cursor-pointer"
    />
                      </td>

                      {
      /* Name & Gender */
    }
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {st.fullName.split(" ").slice(-1)[0][0]}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{st.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{st.gender} • {st.dateOfBirth}</p>
                          </div>
                        </div>
                      </td>

                      {
      /* MSSV & Class */
    }
                      <td className="py-3 px-3">
                        <p className="font-mono font-bold text-slate-800">{st.mssv}</p>
                        <p className="text-[10px] text-blue-600 font-bold">{st.classCode}</p>
                      </td>

                      {
      /* Company */
    }
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{st.companyName}</span>
                        </div>
                      </td>

                      {
      /* Lecturer */
    }
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800">{st.assignedLecturer}</p>
                      </td>

                      {
      /* Account Status Badge */
    }
                      <td className="py-3 px-3 text-center">
                        {st.accountStatus === "active" && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-md inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã cấp
                          </span>}
                        {st.accountStatus === "pending" && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black rounded-md inline-flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-amber-600" /> Chưa cấp
                          </span>}
                        {st.accountStatus === "locked" && <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black rounded-md inline-flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-600" /> Đã khóa
                          </span>}
                      </td>

                      {
      /* Action Buttons */
    }
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {st.accountStatus === "pending" && <button
      onClick={() => handleQuickGrantSingle(st)}
      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
      title="Cấp tài khoản ngay"
    >
                              <KeyRound className="w-3 h-3" />
                              <span>Cấp TK ngay</span>
                            </button>}

                          <button
      onClick={() => setSelectedStudent(st)}
      className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
      title="Xem chi tiết"
    >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
      onClick={() => handleResetPassword(st)}
      className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
      title="Đặt lại mật khẩu"
    >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
      onClick={() => handleToggleLockAccount(st.id)}
      className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
      title={st.accountStatus === "locked" ? "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n" : "Kh\xF3a t\xE0i kho\u1EA3n"}
    >
                            {st.accountStatus === "locked" ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-rose-600" />}
                          </button>
                        </div>
                      </td>
                    </tr>;
  })}
            </tbody>
          </table>
        </div>

        {
    /* Table Pagination */
  }
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">
              Hiển thị {paginatedStudents.length} / {filteredStudents.length} sinh viên
            </span>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span>Số dòng:</span>
              <select
    value={pageSize}
    onChange={(e) => {
      setPageSize(Number(e.target.value));
      setCurrentPage(1);
    }}
    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer text-xs"
  >
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-extrabold">
            <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
  >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
  >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </section>

      {
    /* IMPORT EXCEL MODAL */
  }
      {isImportModalOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Import Danh sách Sinh viên từ Excel</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-6 transition-all text-center relative cursor-pointer">
              <input
    type="file"
    accept=".xlsx, .xls"
    onChange={handleFileDrop}
    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
  />
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    Kéo thả file Excel (.xlsx) vào đây hoặc <span className="text-blue-600 underline">bấm để chọn file</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hỗ trợ định dạng .XLSX, .XLS - Tối đa 15MB</p>
                </div>
                {importFileName && <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {importFileName}
                  </p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
    onClick={() => onShowToast("\u0110\xE3 t\u1EA3i xu\u1ED1ng file m\u1EABu Danh_sach_Sinh_vien_Template.xlsx")}
    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
  >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file Excel mẫu</span>
              </button>

              <div className="flex items-center gap-2">
                <button
    onClick={() => setIsImportModalOpen(false)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
  >
                  Hủy
                </button>
                <button
    onClick={() => {
      onShowToast("\u0110\xE3 import th\xE0nh c\xF4ng danh s\xE1ch sinh vi\xEAn t\u1EEB Excel");
      setIsImportModalOpen(false);
    }}
    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
  >
                  Xác nhận Import
                </button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* GENERATE ACCOUNTS MODAL */
  }
      {isGenerateAccountsModalOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Cấp Tài khoản Nhanh</h3>
              </div>
              <button onClick={() => setIsGenerateAccountsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Khởi tạo tài khoản đăng nhập MSSV cho <span className="font-black text-emerald-700">{selectedIds.length > 0 ? `${selectedIds.length} sinh vi\xEAn \u0111\xE3 ch\u1ECDn` : `${pendingAccounts} sinh vi\xEAn ch\u01B0a c\xF3 t\xE0i kho\u1EA3n`}</span>.
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <p className="font-bold text-emerald-950">Quy tắc cấp tài khoản mặc định:</p>
              <ul className="list-disc pl-4 text-[11px] text-emerald-800 space-y-0.5">
                <li>Username: Mã số sinh viên (MSSV)</li>
                <li>Mật khẩu mặc định: <code className="bg-white px-1 py-0.5 rounded border">Fit@2026!</code></li>
                <li>Yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
    onClick={() => setIsGenerateAccountsModalOpen(false)}
    className="px-4 py-2 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
  >
                Hủy
              </button>
              <button
    onClick={handleBatchGenerateAccounts}
    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
  >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kích hoạt ngay</span>
              </button>
            </div>
          </div>
        </div>}

      {
    /* STUDENT DETAIL DRAWER */
  }
      {selectedStudent && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 space-y-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Hồ sơ Sinh viên</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                {selectedStudent.fullName.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedStudent.fullName}</h4>
                <p className="text-xs font-mono font-bold text-blue-600">{selectedStudent.mssv}</p>
                <p className="text-xs text-slate-500 font-medium">Lớp: {selectedStudent.classCode} • GPA: {selectedStudent.gpa}</p>
              </div>
            </div>

            {
    /* Details List */
  }
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngành học:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.major}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Khóa học:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.cohort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-blue-600">{selectedStudent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GV Hướng dẫn:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.assignedLecturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doanh nghiệp thực tập:</span>
                  <span className="font-bold text-slate-900">{selectedStudent.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái tài khoản:</span>
                  <span className="font-black uppercase text-emerald-700">{selectedStudent.accountStatus}</span>
                </div>
              </div>
            </div>

            {
    /* Quick Actions */
  }
            <div className="pt-4 border-t border-slate-100 space-y-2">
              {selectedStudent.accountStatus === "pending" && <button
    onClick={() => {
      handleQuickGrantSingle(selectedStudent);
      setSelectedStudent(null);
    }}
    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
  >
                  <KeyRound className="w-3.5 h-3.5" /> Cấp tài khoản ngay
                </button>}

              <button
    onClick={() => handleResetPassword(selectedStudent)}
    className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
  >
                <RotateCcw className="w-3.5 h-3.5" /> Đặt lại mật khẩu tài khoản
              </button>

              <button
    onClick={() => handleToggleLockAccount(selectedStudent.id)}
    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
  >
                <Lock className="w-3.5 h-3.5" /> {selectedStudent.accountStatus === "locked" ? "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n" : "Kh\xF3a t\xE0i kho\u1EA3n"}
              </button>
            </div>

          </div>
        </div>}

      {
    /* CREATE STUDENT MODAL */
  }
      <CreateStudentModal
    isOpen={isCreateModalOpen}
    onClose={() => setIsCreateModalOpen(false)}
    onShowToast={onShowToast}
    onAddStudent={handleAddStudent}
  />

    </div>;
};

export { StudentsView as AdminStudentsView };
