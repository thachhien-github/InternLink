import { useState } from 'react';
import {
  FileCheck2,
  Upload,
  Download,
  FileText,
  Clock,
  MessageSquare,
  FileUp,
  Search,
  X,
  ShieldCheck
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../../data/studentMockData';
export const WeeklyReportsView = ({ onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("T\u1EA5t c\u1EA3");
  const [selectedWeek, setSelectedWeek] = useState(6);
  const [selectedPdfFile, setSelectedPdfFile] = useState({
    name: "BaoCao_Tuan6_NguyenVanA_v2.pdf",
    size: "2.4 MB",
    time: "20/09/2026 14:30"
  });
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [reports, setReports] = useState([
    {
      weekNumber: 1,
      title: "Onboarding & Setup d\u1EF1 \xE1n SmartHR",
      deadline: "07/08/2026",
      submittedAt: "07/08/2026 16:40",
      version: "v1.0",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      fileName: "BaoCao_Tuan1_NguyenVanA.pdf",
      fileSize: "1.8 MB",
      feedback: "Kh\u1EDFi \u0111\u1ED9ng r\u1EA5t t\u1ED1t, tr\xECnh b\xE0y \u0111\xFAng bi\u1EC3u m\u1EABu quy \u0111\u1ECBnh.",
      feedbackDate: "08/08/2026",
      stepIndex: 5
    },
    {
      weekNumber: 2,
      title: "Design System & React UI Component",
      deadline: "14/08/2026",
      submittedAt: "14/08/2026 17:50",
      version: "v1.0",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      fileName: "BaoCao_Tuan2_NguyenVanA.pdf",
      fileSize: "2.1 MB",
      feedback: "Tr\xECnh b\xE0y r\xF5 r\xE0ng, \u0111\xEDnh k\xE8m s\u01A1 \u0111\u1ED3 t\u1ED5 ch\u1EE9c component.",
      feedbackDate: "15/08/2026",
      stepIndex: 5
    },
    {
      weekNumber: 3,
      title: "Authentication & OAuth Integration",
      deadline: "21/08/2026",
      submittedAt: "21/08/2026 21:05",
      version: "v1.0",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      fileName: "BaoCao_Tuan3_NguyenVanA.pdf",
      fileSize: "1.9 MB",
      feedback: "Ki\u1EBFn th\u1EE9c JWT t\u1ED1t, h\xECnh \u1EA3nh minh h\u1ECDa lu\u1ED3ng x\u1EED l\xFD s\u1EAFc n\xE9t.",
      feedbackDate: "22/08/2026",
      stepIndex: 5
    },
    {
      weekNumber: 4,
      title: "L\u1EADp tr\xECnh Dashboard & Chart Recharts",
      deadline: "28/08/2026",
      submittedAt: "28/08/2026 19:20",
      version: "v1.0",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      fileName: "BaoCao_Tuan4_NguyenVanA.pdf",
      fileSize: "2.5 MB",
      feedback: "\u0110\xE3 duy\u1EC7t. Ti\u1EBFp t\u1EE5c gi\u1EEF v\u1EEFng phong \u0111\u1ED9.",
      feedbackDate: "29/08/2026",
      stepIndex: 5
    },
    {
      weekNumber: 5,
      title: "RESTful API Integration & TanStack Query",
      deadline: "04/09/2026",
      submittedAt: "04/09/2026 22:00",
      version: "v1.0",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      fileName: "BaoCao_Tuan5_NguyenVanA.pdf",
      fileSize: "3.1 MB",
      feedback: "\u0110\xE3 duy\u1EC7t. Ho\xE0n th\xE0nh t\u1ED1t 5 tu\u1EA7n \u0111\u1EA7u.",
      feedbackDate: "05/09/2026",
      stepIndex: 5
    },
    {
      weekNumber: 6,
      title: "Frontend UI & State Management",
      deadline: "22/09/2026 (C\xF2n 2 ng\xE0y)",
      submittedAt: "20/09/2026 14:30",
      version: "v2.0",
      status: "C\u1EA7n ch\u1EC9nh s\u1EEDa",
      fileName: "BaoCao_Tuan6_NguyenVanA_v2.pdf",
      fileSize: "2.4 MB",
      feedback: "C\u1EA7n b\u1ED5 sung h\xECnh s\u01A1 \u0111\u1ED3 UML Data Flow v\xE0 ch\u1EC9nh l\u1EA1i ph\u1EA7n k\u1EBFt lu\u1EADn tr\u01B0\u1EDBc khi duy\u1EC7t ch\xEDnh th\u1EE9c.",
      feedbackDate: "21/09/2026",
      stepIndex: 3
    },
    {
      weekNumber: 7,
      title: "Unit Test & Performance Optimization",
      deadline: "29/09/2026",
      submittedAt: null,
      version: "v0.0",
      status: "Ch\u01B0a n\u1ED9p",
      stepIndex: 0
    },
    {
      weekNumber: 8,
      title: "Ho\xE0n thi\u1EC7n B\xE1o c\xE1o T\u1ED5ng k\u1EBFt & Slide B\u1EA3o v\u1EC7",
      deadline: "06/10/2026",
      submittedAt: null,
      version: "v0.0",
      status: "Ch\u01B0a n\u1ED9p",
      stepIndex: 0
    }
  ]);
  const [versionHistory, setVersionHistory] = useState([
    {
      version: "v2.0 (M\u1EDBi nh\u1EA5t)",
      submittedAt: "20/09/2026 14:30",
      fileName: "BaoCao_Tuan6_NguyenVanA_v2.pdf",
      fileSize: "2.4 MB",
      status: "C\u1EA7n ch\u1EC9nh s\u1EEDa",
      feedback: "C\u1EA7n b\u1ED5 sung h\xECnh s\u01A1 \u0111\u1ED3 UML Data Flow v\xE0 ch\u1EC9nh l\u1EA1i ph\u1EA7n k\u1EBFt lu\u1EADn."
    },
    {
      version: "v1.0",
      submittedAt: "19/09/2026 10:15",
      fileName: "BaoCao_Tuan6_NguyenVanA_v1.pdf",
      fileSize: "2.2 MB",
      status: "\u0110\xE3 t\u1EEB ch\u1ED1i",
      feedback: "Thi\u1EBFu minh ch\u1EE9ng \u1EA3nh ch\u1EE5p m\xE0n h\xECnh \u1EE9ng d\u1EE5ng t\u1EA1i Doanh nghi\u1EC7p."
    }
  ]);
  const currentReport = reports.find((r) => r.weekNumber === selectedWeek) || reports[5];
  const handleFileSelect = () => {
    const fileName = prompt(
      "Ch\u1ECDn file PDF b\xE1o c\xE1o \u0111\xE3 xu\u1EA5t t\u1EEB Word:",
      `BaoCao_Tuan${selectedWeek}_NguyenVanA_v${currentReport.version === "v0.0" ? "1.0" : "2.1"}.pdf`
    );
    if (fileName) {
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        alert("H\u1EC7 th\u1ED1ng ch\u1EC9 ch\u1EA5p nh\u1EADn \u0111\u1ECBnh d\u1EA1ng file PDF (.pdf)!");
        return;
      }
      setSelectedPdfFile({
        name: fileName,
        size: "2.6 MB",
        time: "V\u1EEBa ch\u1ECDn"
      });
      onShowToast(`\u0110\xE3 ch\u1ECDn file: ${fileName}`);
    }
  };
  const handleSubmitPdf = () => {
    if (!selectedPdfFile) {
      alert("Vui l\xF2ng ch\u1ECDn ho\u1EB7c t\u1EA3i l\xEAn file PDF tr\u01B0\u1EDBc khi b\u1EA5m N\u1ED9p b\xE1o c\xE1o.");
      return;
    }
    setReports((prev) => prev.map((r) => {
      if (r.weekNumber === selectedWeek) {
        return {
          ...r,
          submittedAt: "V\u1EEBa xong",
          fileName: selectedPdfFile.name,
          fileSize: selectedPdfFile.size,
          version: r.version === "v0.0" ? "v1.0" : "v2.1",
          status: "\u0110ang xem x\xE9t",
          stepIndex: 2
        };
      }
      return r;
    }));
    setVersionHistory((prev) => [
      {
        version: `v${currentReport.version === "v0.0" ? "1.0" : "2.1"} (V\u1EEBa n\u1ED9p)`,
        submittedAt: "V\u1EEBa xong",
        fileName: selectedPdfFile.name,
        fileSize: selectedPdfFile.size,
        status: "\u0110ang xem x\xE9t",
        feedback: "\u0110ang ch\u1EDD Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn duy\u1EC7t."
      },
      ...prev
    ]);
    onShowToast(`\u0110\xE3 n\u1ED9p th\xE0nh c\xF4ng file PDF cho Tu\u1EA7n ${selectedWeek}!`);
  };
  const handleDownloadWordTemplate = () => {
    onShowToast(`\u0110ang t\u1EA3i xu\u1ED1ng: Mau_Bao_Cao_Thuc_Tap_Tuan_${selectedWeek}_Khoa_CNTT.docx`);
  };
  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.weekNumber.toString().includes(searchQuery);
    const matchesStatus = statusFilter === "T\u1EA5t c\u1EA3" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const completedCount = reports.filter((r) => r.status === "\u0110\xE3 ho\xE0n th\xE0nh").length;
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Báo cáo thực tập tuần
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              Tiến độ: {completedCount} / 8 Tuần hoàn thành
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Tải mẫu Word, xuất file PDF và nộp báo cáo đúng hạn cho Giảng viên hướng dẫn.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={handleDownloadWordTemplate}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
            <Download className="w-3.5 h-3.5" />
            <span>Tải mẫu Word</span>
          </button>
          <button
    onClick={() => setShowRequirementModal(true)}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-slate-200/80"
  >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Quy định nộp</span>
          </button>
        </div>
      </div>

      {
    /* 2. MAIN GRID LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {
    /* LEFT 2 COLS: REPORTS TABLE & SELECTED WEEK WORKSPACE */
  }
        <div className="lg:col-span-2 space-y-6">

          {
    /* WEEKLY REPORTS TABLE CARD */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-blue-600" /> Danh sách báo cáo (8 Tuần)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-40 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
    type="text"
    placeholder="Tìm tuần/tiêu đề..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none"
  />
                </div>

                <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
  >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                  <option value="Cần chỉnh sửa">Cần chỉnh sửa</option>
                  <option value="Đang xem xét">Đang xem xét</option>
                  <option value="Chưa nộp">Chưa nộp</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold">
                    <th className="p-3 w-16">Tuần</th>
                    <th className="p-3">Nội dung báo cáo</th>
                    <th className="p-3 w-28">Hạn nộp</th>
                    <th className="p-3 w-28">Trạng thái</th>
                    <th className="p-3 text-right w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((rep) => {
    const isSelected = rep.weekNumber === selectedWeek;
    return <tr
      key={rep.weekNumber}
      className={`transition-colors ${isSelected ? "bg-blue-50/60 font-medium" : "hover:bg-slate-50/80"}`}
    >
                        <td className="p-3 font-bold text-blue-700">
                          Tuần {rep.weekNumber}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800 line-clamp-1">{rep.title}</p>
                          {rep.fileName && <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3 text-blue-600" /> {rep.fileName} ({rep.fileSize})
                            </p>}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{rep.deadline}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-block ${rep.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : rep.status === "C\u1EA7n ch\u1EC9nh s\u1EEDa" ? "bg-rose-50 text-rose-800 border border-rose-200" : rep.status === "\u0110ang xem x\xE9t" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-slate-100 text-slate-500"}`}>
                            {rep.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
      onClick={() => setSelectedWeek(rep.weekNumber)}
      className={`px-2.5 py-1 font-bold text-[11px] rounded-lg transition-colors ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700"}`}
    >
                            {isSelected ? "\u0110ang ch\u1ECDn" : "Ch\u1ECDn"}
                          </button>
                        </td>
                      </tr>;
  })}
                </tbody>
              </table>
            </div>
          </div>

          {
    /* SELECTED WEEK WORKSPACE CARD */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  Khu vực nộp bài
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  Tuần {selectedWeek}: {currentReport.title}
                </h2>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${currentReport.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : currentReport.status === "C\u1EA7n ch\u1EC9nh s\u1EEDa" ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`}>
                {currentReport.status}
              </span>
            </div>

            {
    /* Lecturer Feedback (If present) */
  }
            {currentReport.feedback && <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Nhận xét từ Giảng viên ({currentReport.feedbackDate}):
                  </span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed bg-white/80 p-3 rounded-lg border border-amber-200/60">
                  "{currentReport.feedback}"
                </p>
              </div>}

            {
    /* Compact Drag & Drop Upload Zone */
  }
            <div className="space-y-3">
              <div
    onClick={handleFileSelect}
    className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30 p-6 text-center rounded-xl cursor-pointer transition-all space-y-2"
  >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Bấm để chọn file PDF hoặc kéo thả file báo cáo vào đây
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Định dạng chấp nhận: <strong>PDF (.pdf)</strong> (Dưới 20MB)
                  </p>
                </div>
              </div>

              {
    /* Selected PDF file info */
  }
              {selectedPdfFile && <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{selectedPdfFile.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{selectedPdfFile.size} • {selectedPdfFile.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
    onClick={handleFileSelect}
    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors"
  >
                      Đổi file
                    </button>
                    <button
    onClick={handleSubmitPdf}
    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
  >
                      <FileUp className="w-3.5 h-3.5" /> Nộp báo cáo
                    </button>
                  </div>
                </div>}
            </div>
          </div>
        </div>

        {
    /* RIGHT 1 COL: VERSION HISTORY & HELPFUL INFO */
  }
        <div className="lg:col-span-1 space-y-6">

          {
    /* VERSION HISTORY */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Lịch sử nộp (Tuần {selectedWeek})
            </h3>

            <div className="space-y-2.5 text-xs">
              {versionHistory.map((ver, idx) => <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700">{ver.version}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{ver.submittedAt}</span>
                  </div>
                  <p className="font-medium text-slate-800 truncate">{ver.fileName}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-slate-500">{ver.status}</span>
                    <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i xu\u1ED1ng ${ver.fileName}`)}
    className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
  >
                      <Download className="w-3 h-3" /> Tải về
                    </button>
                  </div>
                </div>)}
            </div>
          </div>

          {
    /* LECTURER CONTACT & QUICK GUIDELINE */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Thông tin Hướng dẫn
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Giảng viên hướng dẫn</span>
                <p className="font-bold text-slate-900">{STUDENT_PROFILE.lecturerName}</p>
                <p className="text-[11px] text-slate-500">phuoc.nv@internlink.edu.vn</p>
              </div>

              <button
    onClick={handleDownloadWordTemplate}
    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
  >
                <Download className="w-4 h-4 text-slate-500" /> Tải mẫu báo cáo .docx
              </button>
            </div>
          </div>

        </div>
      </div>

      {
    /* REQUIREMENTS MODAL */
  }
      {showRequirementModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Quy định nộp Báo cáo tuần
              </h3>
              <button onClick={() => setShowRequirementModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 font-medium">
              <p className="font-bold text-slate-900">1. Quy định file:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Soạn thảo bằng Microsoft Word theo mẫu chuẩn của Khoa.</li>
                <li>Xuất file định dạng PDF (.pdf) trước khi nộp lên hệ thống.</li>
                <li>Cấu trúc tên file: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-700">BaoCao_Tuan[X]_[MSSV]_[HoTen].pdf</code></li>
              </ul>

              <p className="font-bold text-slate-900 pt-2">2. Hạn nộp & Đánh giá:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Nộp trước 23:59 Chủ nhật hàng tuần.</li>
                <li>Giảng viên sẽ phản hồi và chấm điểm trong vòng 3 ngày làm việc.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
    onClick={() => setShowRequirementModal(false)}
    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
  >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>}
    </div>;
};

export { WeeklyReportsView as StudentWeeklyReportsView };
