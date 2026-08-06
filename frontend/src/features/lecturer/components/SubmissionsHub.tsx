import { useState, useMemo } from 'react';
import {
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Check,
  ShieldCheck,
  ShieldAlert,
  Building2,
  FileSpreadsheet,
  Bot
} from 'lucide-react';
export const SubmissionsHub = ({
  submissions,
  onUpdateSubmissionStatus,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [selectedReportType, setSelectedReportType] = useState("T\u1EA5t c\u1EA3");
  const [selectedCompany, setSelectedCompany] = useState("T\u1EA5t c\u1EA3");
  const [selectedDuplicateFilter, setSelectedDuplicateFilter] = useState("T\u1EA5t c\u1EA3");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [lecturerNoteInput, setLecturerNoteInput] = useState("");
  const [selectedSubIds, setSelectedSubIds] = useState([]);
  const companyList = useMemo(() => {
    const list = Array.from(new Set(submissions.map((s) => s.company)));
    return ["T\u1EA5t c\u1EA3", ...list];
  }, [submissions]);
  const reportTypeList = useMemo(() => {
    const list = Array.from(new Set(submissions.map((s) => s.reportType)));
    return ["T\u1EA5t c\u1EA3", ...list];
  }, [submissions]);
  const stats = useMemo(() => {
    const total = submissions.length;
    const approved = submissions.filter((s) => s.status === "\u0110\xE3 duy\u1EC7t").length;
    const pending = submissions.filter((s) => s.status === "Ch\u1EDD duy\u1EC7t" || s.status === "\u0110\xE3 n\u1ED9p" || s.status === "C\u1EA7n nh\u1EADn x\xE9t").length;
    const revision = submissions.filter((s) => s.status === "Y\xEAu c\u1EA7u s\u1EEDa" || s.status === "Qu\xE1 h\u1EA1n").length;
    const avgPlagiarism = total > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.duplicateScore || 0), 0) / total) : 0;
    return { total, approved, pending, revision, avgPlagiarism };
  }, [submissions]);
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (activeSubTab === "approved" && sub.status !== "\u0110\xE3 duy\u1EC7t") return false;
      if (activeSubTab === "pending" && (sub.status === "\u0110\xE3 duy\u1EC7t" || sub.status === "Y\xEAu c\u1EA7u s\u1EEDa")) return false;
      if (activeSubTab === "revision" && sub.status !== "Y\xEAu c\u1EA7u s\u1EEDa" && sub.status !== "Qu\xE1 h\u1EA1n") return false;
      if (selectedReportType !== "T\u1EA5t c\u1EA3" && sub.reportType !== selectedReportType) return false;
      if (selectedCompany !== "T\u1EA5t c\u1EA3" && sub.company !== selectedCompany) return false;
      if (selectedDuplicateFilter === "safe" && (sub.duplicateScore || 0) >= 10) return false;
      if (selectedDuplicateFilter === "warning" && ((sub.duplicateScore || 0) < 10 || (sub.duplicateScore || 0) > 25)) return false;
      if (selectedDuplicateFilter === "danger" && (sub.duplicateScore || 0) <= 25) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sub.studentName.toLowerCase().includes(q);
        const matchMssv = sub.mssv.toLowerCase().includes(q);
        const matchCompany = sub.company.toLowerCase().includes(q);
        const matchType = sub.reportType.toLowerCase().includes(q);
        if (!matchName && !matchMssv && !matchCompany && !matchType) return false;
      }
      return true;
    });
  }, [submissions, activeSubTab, selectedReportType, selectedCompany, selectedDuplicateFilter, searchQuery]);
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubIds(filteredSubmissions.map((s) => s.id));
    } else {
      setSelectedSubIds([]);
    }
  };
  const handleToggleSelect = (id) => {
    setSelectedSubIds(
      (prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleBatchApprove = () => {
    if (selectedSubIds.length === 0) return;
    selectedSubIds.forEach((id) => {
      onUpdateSubmissionStatus?.(id, "\u0110\xE3 duy\u1EC7t", "\u0110\xE3 ph\xEA duy\u1EC7t h\xE0ng lo\u1EA1t");
    });
    onToast?.(`\u0110\xE3 ph\xEA duy\u1EC7t th\xE0nh c\xF4ng ${selectedSubIds.length} b\xE0i n\u1ED9p \u0111\u01B0\u1EE3c ch\u1ECDn`);
    setSelectedSubIds([]);
  };
  const handleBatchDownload = () => {
    onToast?.(`\u0110ang t\u1EA1o file n\xE9n .ZIP g\u1ED3m ${filteredSubmissions.length} b\xE0i b\xE1o c\xE1o...`);
  };
  const handleOpenDetail = (sub) => {
    setSelectedSubmission(sub);
    setLecturerNoteInput(sub.lecturerNote || "");
    setShowDetailModal(true);
  };
  const handleApproveSingle = () => {
    if (!selectedSubmission) return;
    onUpdateSubmissionStatus?.(selectedSubmission.id, "\u0110\xE3 duy\u1EC7t", lecturerNoteInput || "\u0110\xE3 ki\u1EC3m tra & ph\xEA duy\u1EC7t b\xE0i n\u1ED9p");
    onToast?.(`\u0110\xE3 ph\xEA duy\u1EC7t b\xE0i n\u1ED9p c\u1EE7a ${selectedSubmission.studentName}`);
    setShowDetailModal(false);
  };
  const handleRequestRevisionSingle = () => {
    if (!selectedSubmission) return;
    onUpdateSubmissionStatus?.(selectedSubmission.id, "Y\xEAu c\u1EA7u s\u1EEDa", lecturerNoteInput || "C\u1EA7n b\u1ED5 sung chi ti\u1EBFt theo y\xEAu c\u1EA7u");
    onToast?.(`\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u ch\u1EC9nh s\u1EEDa cho ${selectedSubmission.studentName}`);
    setShowDetailModal(false);
  };
  return <div className="space-y-5 animate-in fade-in duration-200">
      {
    /* Top Title Banner */
  }
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                Kho Báo Cáo & Bài Nộp Sinh Viên
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Tổng hợp tất cả bài báo cáo tuần, giữa kỳ &amp; cuối kỳ do sinh viên tải lên đợt Thực tập Học kỳ I - 2026
              </p>
            </div>
          </div>
        </div>

        {
    /* Quick Batch Export Actions */
  }
        <div className="flex items-center gap-2 shrink-0">
          <button
    onClick={() => onToast?.("\u0110\xE3 xu\u1EA5t danh s\xE1ch t\u1ED5ng h\u1EE3p b\xE0i n\u1ED9p d\u01B0\u1EDBi \u0111\u1ECBnh d\u1EA1ng Excel (.XLSX)")}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200/80 flex items-center gap-1.5"
  >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
    onClick={handleBatchDownload}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
  >
            <Download className="w-4 h-4" />
            <span>Tải toàn bộ (.ZIP)</span>
          </button>
        </div>
      </div>

      {
    /* 4 Summary KPI Metric Cards */
  }
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {
    /* 1. TỔNG BÀI ĐÃ NỘP */
  }
        <div
    onClick={() => setActiveSubTab("all")}
    className={`bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5 ${activeSubTab === "all" ? "ring-2 ring-indigo-500/40 shadow-xs" : ""}`}
  >
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">
              Tổng bài đã nộp
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
            <span className="text-xs font-bold text-slate-400">bài nộp</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">Đợt Thực tập Học kỳ I - 2026</span>
        </div>

        {
    /* 2. ĐÃ PHÊ DUYỆT */
  }
        <div
    onClick={() => setActiveSubTab("approved")}
    className={`bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5 ${activeSubTab === "approved" ? "ring-2 ring-emerald-500/40 shadow-xs" : ""}`}
  >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
              Đã phê duyệt
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800">{stats.approved}</span>
            <span className="text-xs font-bold text-emerald-600">bài đã duyệt</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">
            Đạt {stats.total > 0 ? Math.round(stats.approved / stats.total * 100) : 0}% tổng bài nộp
          </span>
        </div>

        {
    /* 3. CHỜ PHÊ DUYỆT */
  }
        <div
    onClick={() => setActiveSubTab("pending")}
    className={`bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5 ${activeSubTab === "pending" ? "ring-2 ring-amber-500/40 shadow-xs" : ""}`}
  >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
              Chờ phê duyệt
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-800">{stats.pending}</span>
            <span className="text-xs font-bold text-amber-600">báo cáo</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Cần GVHD xem &amp; xác nhận</span>
        </div>

        {
    /* 4. YÊU CẦU CHỈNH SỬA */
  }
        <div
    onClick={() => setActiveSubTab("revision")}
    className={`bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-rose-200/80 border-l-4 border-l-rose-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5 ${activeSubTab === "revision" ? "ring-2 ring-rose-500/40 shadow-xs" : ""}`}
  >
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[10px] font-extrabold uppercase text-rose-800 tracking-wider">
              Yêu cầu chỉnh sửa
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-800">{stats.revision}</span>
            <span className="text-xs font-bold text-rose-600">cần sửa</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold block">Cần bổ sung hoặc nộp lại</span>
        </div>
      </div>

      {
    /* Main Filter & Navigation Hub Bar */
  }
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        {
    /* Sub-tabs Navigation */
  }
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            <button
    onClick={() => setActiveSubTab("all")}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
              Tất cả bài nộp ({submissions.length})
            </button>

            <button
    onClick={() => setActiveSubTab("approved")}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === "approved" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã phê duyệt ({stats.approved})</span>
            </button>

            <button
    onClick={() => setActiveSubTab("pending")}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === "pending" ? "bg-amber-500 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
              <Clock className="w-3.5 h-3.5" />
              <span>Chờ duyệt ({stats.pending})</span>
            </button>

            <button
    onClick={() => setActiveSubTab("revision")}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === "revision" ? "bg-rose-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Yêu cầu sửa ({stats.revision})</span>
            </button>
          </div>

          {
    /* Batch Selection Action Bar if items selected */
  }
          {selectedSubIds.length > 0 && <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl text-xs font-bold text-blue-900 animate-in fade-in">
              <span>Đã chọn {selectedSubIds.length} bài nộp</span>
              <button
    onClick={handleBatchApprove}
    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1"
  >
                <Check className="w-3.5 h-3.5" />
                <span>Duyệt tất cả</span>
              </button>
            </div>}
        </div>

        {
    /* Search & Filter Inputs Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {
    /* Search Box */
  }
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Tìm theo Tên, MSSV, Doanh nghiệp..."
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800"
  />
          </div>

          {
    /* Filter by Report Type */
  }
          <div>
            <select
    value={selectedReportType}
    onChange={(e) => setSelectedReportType(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-700"
  >
              <option value="Tất cả">Loại báo cáo: Tất cả</option>
              {reportTypeList.filter((t) => t !== "T\u1EA5t c\u1EA3").map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          {
    /* Filter by Enterprise */
  }
          <div>
            <select
    value={selectedCompany}
    onChange={(e) => setSelectedCompany(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-700"
  >
              <option value="Tất cả">Doanh nghiệp: Tất cả</option>
              {companyList.filter((c) => c !== "T\u1EA5t c\u1EA3").map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>

          {
    /* Filter by Plagiarism level */
  }
          <div>
            <select
    value={selectedDuplicateFilter}
    onChange={(e) => setSelectedDuplicateFilter(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-700"
  >
              <option value="Tất cả">Kiểm tra trùng lặp: Tất cả</option>
              <option value="safe">🟢 An toàn (&lt;10%)</option>
              <option value="warning">🟡 Cần lưu ý (10-25%)</option>
              <option value="danger">🔴 Cảnh báo (&gt;25%)</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* Submissions Repository Table */
  }
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
    type="checkbox"
    checked={selectedSubIds.length > 0 && selectedSubIds.length === filteredSubmissions.length}
    onChange={handleSelectAll}
    className="rounded border-slate-300 text-blue-600 cursor-pointer"
  />
                </th>
                <th className="py-3 px-3.5">SINH VIÊN & MSSV</th>
                <th className="py-3 px-3.5">DOANH NGHIỆP</th>
                <th className="py-3 px-3.5">BÁO CÁO & TẬP TIN</th>
                <th className="py-3 px-3.5">THỜI GIAN NỘP</th>
                <th className="py-3 px-3.5 text-center">TRÙNG LẶP</th>
                <th className="py-3 px-3.5">TRẠNG THÁI & GHI CHÚ</th>
                <th className="py-3 px-3.5 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSubmissions.length === 0 ? <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">Không tìm thấy bài nộp nào phù hợp</p>
                    <p className="text-xs text-slate-400 mt-0.5">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                  </td>
                </tr> : filteredSubmissions.map((sub) => {
    const isChecked = selectedSubIds.includes(sub.id);
    return <tr
      key={sub.id}
      className={`hover:bg-slate-50/80 transition-colors ${isChecked ? "bg-blue-50/30" : ""}`}
    >
                      {
      /* Checkbox */
    }
                      <td className="py-3.5 px-3.5 text-center">
                        <input
      type="checkbox"
      checked={isChecked}
      onChange={() => handleToggleSelect(sub.id)}
      className="rounded border-slate-300 text-blue-600 cursor-pointer"
    />
                      </td>

                      {
      /* Student Info */
    }
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
      src={sub.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
      alt={sub.studentName}
      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
    />
                          <div>
                            <p className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => handleOpenDetail(sub)}>
                              {sub.studentName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono font-bold">
                              MSSV: {sub.mssv}
                            </p>
                          </div>
                        </div>
                      </td>

                      {
      /* Company */
    }
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{sub.company}</span>
                        </div>
                      </td>

                      {
      /* Report & File */
    }
                      <td className="py-3.5 px-3.5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{sub.reportType}</span>
                          <button
      onClick={() => handleOpenDetail(sub)}
      className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
    >
                            <FileText className="w-3 h-3" />
                            <span>{sub.fileUrl || "bao_cao_thuc_tap.pdf"}</span>
                            {sub.fileSize && <span className="text-slate-400 text-[10px]">({sub.fileSize})</span>}
                          </button>
                        </div>
                      </td>

                      {
      /* Time */
    }
                      <td className="py-3.5 px-3.5 text-xs text-slate-500">
                        <div className="font-semibold text-slate-800">{sub.date}</div>
                        <div className="text-[10px] text-slate-400">{sub.time}</div>
                      </td>

                      {
      /* Duplicate Score */
    }
                      <td className="py-3.5 px-3.5 text-center">
                        <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${(sub.duplicateScore || 0) < 10 ? "bg-emerald-100 text-emerald-800" : (sub.duplicateScore || 0) <= 25 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800 border border-rose-200"}`}
    >
                          {(sub.duplicateScore || 0) < 10 ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {sub.duplicateScore || 0}%
                        </span>
                      </td>

                      {
      /* Status & Lecturer Note */
    }
                      <td className="py-3.5 px-3.5">
                        <div className="space-y-1">
                          <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sub.status === "\u0110\xE3 duy\u1EC7t" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : sub.status === "Ch\u1EDD duy\u1EC7t" || sub.status === "\u0110\xE3 n\u1ED9p" ? "bg-amber-100 text-amber-800 border border-amber-200" : sub.status === "Y\xEAu c\u1EA7u s\u1EEDa" ? "bg-rose-100 text-rose-800 border border-rose-200" : "bg-slate-100 text-slate-700"}`}
    >
                            {sub.status === "\u0110\xE3 duy\u1EC7t" && <CheckCircle2 className="w-3 h-3" />}
                            {sub.status === "Ch\u1EDD duy\u1EC7t" && <Clock className="w-3 h-3" />}
                            {sub.status === "Y\xEAu c\u1EA7u s\u1EEDa" && <AlertCircle className="w-3 h-3" />}
                            {sub.status}
                          </span>

                          {sub.lecturerNote && <p className="text-[11px] text-slate-500 italic line-clamp-1">
                              &ldquo;{sub.lecturerNote}&rdquo;
                            </p>}
                        </div>
                      </td>

                      {
      /* Action buttons */
    }
                      <td className="py-3.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
      onClick={() => handleOpenDetail(sub)}
      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200/60"
      title="Xem chi tiết bài nộp"
    >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                          </button>

                          {sub.status !== "\u0110\xE3 duy\u1EC7t" && <button
      onClick={() => {
        onUpdateSubmissionStatus?.(sub.id, "\u0110\xE3 duy\u1EC7t", "\u0110\xE3 duy\u1EC7t tr\u1EF1c ti\u1EBFp");
        onToast?.(`\u0110\xE3 duy\u1EC7t b\xE0i n\u1ED9p c\u1EE7a ${sub.studentName}`);
      }}
      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-2xs transition-colors flex items-center gap-1"
    >
                              <Check className="w-3 h-3" />
                              <span>Duyệt</span>
                            </button>}
                        </div>
                      </td>
                    </tr>;
  })}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* DETAIL DOCUMENT MODAL */
  }
      {showDetailModal && selectedSubmission && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {
    /* Modal Header */
  }
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedSubmission.reportType}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Sinh viên: {selectedSubmission.studentName} • MSSV: {selectedSubmission.mssv}
                  </p>
                </div>
              </div>
              <button
    onClick={() => setShowDetailModal(false)}
    className="text-slate-400 hover:text-slate-600 font-bold"
  >
                ✕
              </button>
            </div>

            {
    /* Modal Body */
  }
            <div className="space-y-4 text-xs font-sans">
              {
    /* Student Header Summary */
  }
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
    src={selectedSubmission.avatar}
    alt={selectedSubmission.studentName}
    className="w-10 h-10 rounded-full object-cover border border-slate-200"
  />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">{selectedSubmission.studentName}</span>
                    <span className="text-slate-500 text-[11px]">{selectedSubmission.company}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Nộp lúc: <strong>{selectedSubmission.time} - {selectedSubmission.date}</strong></span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${selectedSubmission.status === "\u0110\xE3 duy\u1EC7t" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>

              {
    /* Summary Section */
  }
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs">Tóm tắt nội dung bài nộp:</label>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 leading-relaxed font-medium">
                  {selectedSubmission.summary || "Ch\u01B0a c\xF3 b\u1EA3n t\xF3m t\u1EAFt n\u1ED9i dung b\u1ED5 sung."}
                </div>
              </div>

              {
    /* Document File Card */
  }
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
                    PDF
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedSubmission.fileUrl || "bao_cao_thuc_tap.pdf"}</span>
                    <span className="text-[10px] text-slate-500">Kích thước: {selectedSubmission.fileSize || "2.8 MB"} • Trùng lặp: {selectedSubmission.duplicateScore || 0}%</span>
                  </div>
                </div>

                <button
    onClick={() => onToast?.(`\u0110ang t\u1EA3i file ${selectedSubmission.fileUrl}...`)}
    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
  >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file</span>
                </button>
              </div>

              {
    /* AI Plagiarism Analysis */
  }
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-900 block text-xs">Đánh giá tự động từ AI:</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Tỷ lệ trùng lặp <strong>{selectedSubmission.duplicateScore || 0}%</strong> (Nằm trong ngưỡng an toàn cho phép &lt;15%). Cấu trúc báo cáo tuân thủ biểu mẫu chuẩn Khoa CNTT.
                  </p>
                </div>
              </div>

              {
    /* Lecturer Note Input */
  }
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs">Phản hồi / Ghi chú của Giảng viên hướng dẫn:</label>
                <textarea
    rows={3}
    value={lecturerNoteInput}
    onChange={(e) => setLecturerNoteInput(e.target.value)}
    placeholder="Nhập ghi chú hoặc nhận xét chi tiết cho sinh viên..."
    className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
  />
              </div>

              {
    /* Action Buttons */
  }
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
    type="button"
    onClick={() => setShowDetailModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
  >
                  Đóng
                </button>

                <button
    type="button"
    onClick={handleRequestRevisionSingle}
    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 flex items-center gap-1.5"
  >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Yêu cầu sửa lại</span>
                </button>

                <button
    type="button"
    onClick={handleApproveSingle}
    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
  >
                  <Check className="w-4 h-4" />
                  <span>Phê Duyệt Bài Nộp</span>
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
