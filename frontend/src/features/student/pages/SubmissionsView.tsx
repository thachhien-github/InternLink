import { useState } from 'react';
import {
  Package,
  FileCode,
  Database,
  FileText,
  Video,
  Presentation,
  Github,
  ExternalLink,
  Upload,
  Download,
  RefreshCw,
  Trash2,
  Copy,
  Send,
  Plus,
  GitBranch,
  ShieldAlert,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../../data/studentMockData';
export const SubmissionsView = ({ onShowToast }) => {
  const [hasSubmissions, setHasSubmissions] = useState(true);
  const [checklist, setChecklist] = useState([
    { id: "ck-1", label: "M\xE3 ngu\u1ED3n (Source Code ZIP / GitHub)", required: true, completed: true },
    { id: "ck-2", label: "B\xE1o c\xE1o t\u1ED5ng k\u1EBFt (Final Report PDF)", required: true, completed: true },
    { id: "ck-3", label: "Slide thuy\u1EBFt tr\xECnh (Presentation PPTX)", required: true, completed: true },
    { id: "ck-4", label: "Video Demo s\u1EA3n ph\u1EA9m (MP4)", required: true, completed: false },
    { id: "ck-5", label: "K\u1ECBch b\u1EA3n CSDL (Database Script SQL)", required: false, completed: true }
  ]);
  const [repoInfo, setRepoInfo] = useState({
    url: "https://github.com/fpt-student/internlink-app",
    branch: "main",
    lastCommit: "feat: add JWT authentication & refresh token middleware",
    lastCommitTime: "2 gi\u1EDD tr\u01B0\u1EDBc"
  });
  const [uploads, setUploads] = useState([
    {
      id: "ul-1",
      title: "M\xE3 ngu\u1ED3n h\u1EC7 th\u1ED1ng InternLink (Source Code Full)",
      category: "Source Code",
      fileType: "ZIP",
      size: "34.2 MB",
      version: "v2.1",
      uploadDate: "20/09/2026 14:30",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      notes: "\u0110\xE3 bao g\u1ED3m Dockerfile, file .env.example v\xE0 h\u01B0\u1EDBng d\u1EABn ch\u1EA1y d\u1EF1 \xE1n."
    },
    {
      id: "ul-2",
      title: "Slide thuy\u1EBFt tr\xECnh B\xE1o c\xE1o H\u1ED9i \u0111\u1ED3ng (Presentation Slide)",
      category: "Slide",
      fileType: "PPTX",
      size: "14.8 MB",
      version: "v1.1",
      uploadDate: "19/09/2026 11:00",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      notes: "\u0110\xE3 c\u1EADp nh\u1EADt th\xEAm s\u01A1 \u0111\u1ED3 ki\u1EBFn tr\xFAc d\u1EEF li\u1EC7u \u1EDF trang slide 12 theo g\xF3p \xFD c\u1EE7a Mentor."
    },
    {
      id: "ul-3",
      title: "K\u1ECBch b\u1EA3n kh\u1EDFi t\u1EA1o CSDL PostgreSQL (Database Backup)",
      category: "Database Backup",
      fileType: "SQL",
      size: "2.4 MB",
      version: "v1.0",
      uploadDate: "18/09/2026 16:20",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      notes: "Bao g\u1ED3m schema, DDL, triggers v\xE0 b\u1EA3n ghi d\u1EEF li\u1EC7u m\u1EABu."
    },
    {
      id: "ul-4",
      title: "Video Demo t\u1ED5ng quan t\xEDnh n\u0103ng h\u1EC7 th\u1ED1ng (Video Demo)",
      category: "Video Demo",
      fileType: "MP4",
      size: "85.0 MB",
      version: "v1.0",
      uploadDate: "12/09/2026 10:00",
      status: "C\u1EA7n ch\u1EC9nh s\u1EEDa",
      notes: "Gi\u1EA3ng vi\xEAn y\xEAu c\u1EA7u b\u1ED5 sung ph\u1EA7n thuy\u1EBFt minh gi\u1ECDng n\xF3i \u1EDF \u0111o\u1EA1n gi\u1EDBi thi\u1EC7u AI Assistant."
    }
  ]);
  const [requirements] = useState([
    {
      id: "req-1",
      title: "B\u1ED5 sung thuy\u1EBFt minh gi\u1ECDng n\xF3i v\xE0o Video Demo",
      detail: "Video demo hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 \xE2m thanh thuy\u1EBFt minh. C\u1EA7n thu \xE2m voiceover gi\u1EA3i th\xEDch lu\u1ED3ng x\u1EED l\xFD t\u1EEB 02:15 \u0111\u1EBFn 04:30.",
      deadline: "02/10/2026",
      priority: "Cao",
      status: "Ch\u01B0a xong"
    },
    {
      id: "req-2",
      title: "C\u1EADp nh\u1EADt file README.md trong Git Repository",
      detail: "Ghi r\xF5 c\xE1ch thi\u1EBFt l\u1EADp bi\u1EBFn m\xF4i tr\u01B0\u1EDDng v\xE0 h\u01B0\u1EDBng d\u1EABn kh\u1EDFi ch\u1EA1y c\u1ED5ng 3000.",
      deadline: "28/09/2026",
      priority: "Trung b\xECnh",
      status: "\u0110\xE3 c\u1EADp nh\u1EADt"
    }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpdateRepoModal, setShowUpdateRepoModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Source Code");
  const [uploadVersion, setUploadVersion] = useState("v1.0");
  const [uploadNotes, setUploadNotes] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState(repoInfo.url);
  const [newRepoBranch, setNewRepoBranch] = useState(repoInfo.branch);
  const [contactMsg, setContactMsg] = useState("");
  const completedChecklistCount = checklist.filter((c) => c.completed).length;
  const toggleChecklist = (id) => {
    setChecklist((prev) => prev.map((item) => {
      if (item.id === id) {
        const next = !item.completed;
        onShowToast(next ? `\u0110\xE3 ho\xE0n th\xE0nh: ${item.label}` : `Ch\u01B0a xong: ${item.label}`);
        return { ...item, completed: next };
      }
      return item;
    }));
  };
  const handleCopyGit = () => {
    navigator.clipboard.writeText(repoInfo.url);
    onShowToast("\u0110\xE3 sao ch\xE9p li\xEAn k\u1EBFt GitHub Repository!");
  };
  const handleAddUpload = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp t\xEAn t\u1EC7p s\u1EA3n ph\u1EA9m!");
      return;
    }
    const newUploadItem = {
      id: `ul-${Date.now()}`,
      title: uploadTitle,
      category: uploadCategory,
      fileType: uploadCategory === "Source Code" ? "ZIP" : uploadCategory === "Slide" ? "PPTX" : uploadCategory === "Video Demo" ? "MP4" : "PDF",
      size: "18.5 MB",
      version: uploadVersion || "v1.0",
      uploadDate: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN", { hour12: false }),
      status: "\u0110ang xem x\xE9t",
      notes: uploadNotes
    };
    setUploads([newUploadItem, ...uploads]);
    setShowUploadModal(false);
    onShowToast(`\u0110\xE3 t\u1EA3i l\xEAn s\u1EA3n ph\u1EA9m: ${uploadTitle}`);
    setUploadTitle("");
    setUploadNotes("");
  };
  const handleReplaceFile = (e) => {
    e.preventDefault();
    if (!replaceTarget) return;
    setUploads((prev) => prev.map((item) => {
      if (item.id === replaceTarget.id) {
        return {
          ...item,
          version: `v${(parseFloat(item.version.replace("v", "")) + 0.1).toFixed(1)}`,
          status: "\u0110ang xem x\xE9t",
          uploadDate: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN", { hour12: false }),
          notes: uploadNotes || item.notes
        };
      }
      return item;
    }));
    onShowToast(`\u0110\xE3 t\u1EA3i l\xEAn t\u1EC7p thay th\u1EBF cho: ${replaceTarget.title}`);
    setReplaceTarget(null);
    setUploadNotes("");
  };
  const handleDeleteUpload = (id, title) => {
    if (window.confirm(`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a t\u1EC7p "${title}"?`)) {
      setUploads((prev) => prev.filter((u) => u.id !== id));
      onShowToast(`\u0110\xE3 x\xF3a t\u1EC7p: ${title}`);
    }
  };
  const handleUpdateRepo = (e) => {
    e.preventDefault();
    setRepoInfo((prev) => ({
      ...prev,
      url: newRepoUrl,
      branch: newRepoBranch,
      lastCommitTime: "V\u1EEBa xong"
    }));
    setShowUpdateRepoModal(false);
    onShowToast("\u0110\xE3 c\u1EADp nh\u1EADt th\xF4ng tin GitHub Repository!");
  };
  const handleSendContact = (e) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setShowContactModal(false);
    setContactMsg("");
    onShowToast("\u0110\xE3 g\u1EEDi tin nh\u1EAFn \u0111\u1EBFn Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn!");
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Source Code":
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case "Slide":
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case "Video Demo":
        return <Video className="w-4 h-4 text-rose-600" />;
      case "User Manual":
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case "Database Backup":
        return <Database className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };
  if (!hasSubmissions) {
    return <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600">
            Thử nghiệm giao diện:
          </span>
          <button
      onClick={() => setHasSubmissions(true)}
      className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
    >
            Xem state: Đã có sản phẩm bàn giao
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              Chưa có sản phẩm thực tập nào được bàn giao
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bạn chưa tải lên mã nguồn, báo cáo cuối kỳ hay slide thuyết trình đợt thực tập này.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
      onClick={() => {
        setHasSubmissions(true);
        setShowUploadModal(true);
      }}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
    >
              <Plus className="w-4 h-4" /> Bắt đầu tải lên
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sản phẩm thực tập
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              Đã nộp {uploads.length} sản phẩm
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-200">
              Checklist {completedChecklistCount}/{checklist.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý mã nguồn, slide thuyết trình, video demo và các tài liệu đợt thực tập.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={() => setShowUploadModal(true)}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm sản phẩm</span>
          </button>
          <button
    onClick={() => setShowUpdateRepoModal(true)}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-slate-200/80"
  >
            <Github className="w-3.5 h-3.5 text-slate-600" />
            <span>Git Repo</span>
          </button>
        </div>
      </div>

      {
    /* 2. PROJECT OVERVIEW CARD */
  }
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl text-white font-black text-base flex items-center justify-center shrink-0">
              FPT
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hệ thống Quản lý Thực tập Doanh nghiệp InternLink
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Vị trí: Full-Stack Developer Intern • Doanh nghiệp: {STUDENT_PROFILE.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
    href={repoInfo.url}
    target="_blank"
    rel="noreferrer"
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
  >
              <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub Repo <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <button
    onClick={handleCopyGit}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200"
  >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {
    /* Project Meta Info Grid */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Giảng viên hướng dẫn</span>
            <p className="font-bold text-slate-800 mt-0.5">{STUDENT_PROFILE.lecturerName}</p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mentor Doanh nghiệp</span>
            <p className="font-bold text-slate-800 mt-0.5">{STUDENT_PROFILE.supervisorName}</p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Git Branch</span>
            <p className="font-mono font-bold text-blue-700 mt-0.5 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-blue-600" /> {repoInfo.branch}
            </p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Công nghệ chính</span>
            <p className="font-bold text-slate-800 mt-0.5 truncate">React, TypeScript, Express, SQL</p>
          </div>
        </div>
      </div>

      {
    /* 3. MAIN GRID: DELIVERABLES LIST & SIDEBAR */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {
    /* LEFT 2 COLS: DELIVERABLES UPLOADS LIST */
  }
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" /> Các tệp sản phẩm bàn giao ({uploads.length})
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tải lên mã nguồn, slide, video demo và kịch bản cơ sở dữ liệu.
                </p>
              </div>

              <button
    onClick={() => setShowUploadModal(true)}
    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
  >
                <Plus className="w-3.5 h-3.5" /> Thêm tệp
              </button>
            </div>

            {
    /* Deliverables Cards */
  }
            <div className="space-y-3">
              {uploads.map((item) => <div
    key={item.id}
    className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all space-y-3"
  >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0 mt-0.5">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                            {item.version}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {item.category} • {item.fileType} • {item.size} • Nộp ngày: {item.uploadDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${item.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : item.status === "C\u1EA7n ch\u1EC9nh s\u1EEDa" ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {item.notes && <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 font-medium">
                      Ghi chú: {item.notes}
                    </p>}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i t\u1EC7p: ${item.title}`)}
    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
  >
                      <Download className="w-3.5 h-3.5 text-blue-600" /> Tải về
                    </button>
                    <button
    onClick={() => {
      setReplaceTarget(item);
      setUploadNotes(item.notes || "");
    }}
    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
  >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Thay thế
                    </button>
                    <button
    onClick={() => handleDeleteUpload(item.id, item.title)}
    className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-bold rounded-lg border border-slate-200 transition-colors"
  >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {
    /* RIGHT 1 COL: CHECKLIST & LECTURER REQUIREMENTS */
  }
        <div className="lg:col-span-1 space-y-6">

          {
    /* DELIVERABLE CHECKLIST CARD */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Checklist bàn giao
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {completedChecklistCount}/{checklist.length}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {checklist.map((item) => <div
    key={item.id}
    onClick={() => toggleChecklist(item.id)}
    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${item.completed ? "bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300"}`}
  >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${item.completed ? "bg-emerald-600 text-white font-bold" : "border border-slate-300 bg-white"}`}>
                      {item.completed && "\u2713"}
                    </div>
                    <span className="truncate font-bold">{item.label}</span>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.required ? "bg-rose-100 text-rose-800" : "bg-slate-200 text-slate-700"}`}>
                    {item.required ? "B\u1EAFt bu\u1ED9c" : "T\xF9y ch\u1ECDn"}
                  </span>
                </div>)}
            </div>
          </div>

          {
    /* LECTURER FEEDBACK & REQUIREMENTS */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Góp ý từ Giảng viên
            </h3>

            <div className="space-y-2.5 text-xs">
              {requirements.map((req) => <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{req.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${req.status === "\u0110\xE3 c\u1EADp nh\u1EADt" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{req.detail}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Hạn chót: {req.deadline}</p>
                </div>)}
            </div>
          </div>

          {
    /* QUICK ACTIONS */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Thao tác nhanh
            </h3>

            <div className="space-y-2">
              <button
    onClick={() => setShowUploadModal(true)}
    className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-between"
  >
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Tải lên sản phẩm mới
                </span>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>

              <button
    onClick={() => setShowContactModal(true)}
    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-between"
  >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" /> Liên hệ Giảng viên
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {
    /* UPLOAD MODAL */
  }
      {showUploadModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddUpload} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> Tải lên sản phẩm thực tập mới
              </h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên tệp sản phẩm *</label>
                <input
    type="text"
    required
    placeholder="Ví dụ: Mã nguồn hệ thống (ZIP), Slide thuyết trình..."
    value={uploadTitle}
    onChange={(e) => setUploadTitle(e.target.value)}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium focus:border-blue-500 focus:bg-white"
  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại sản phẩm</label>
                  <select
    value={uploadCategory}
    onChange={(e) => setUploadCategory(e.target.value)}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  >
                    <option value="Source Code">Mã nguồn (.zip)</option>
                    <option value="Slide">Slide thuyết trình (.pptx / .pdf)</option>
                    <option value="Video Demo">Video Demo (.mp4)</option>
                    <option value="User Manual">Tài liệu / Báo cáo (.pdf)</option>
                    <option value="Database Backup">Kịch bản CSDL (.sql)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phiên bản</label>
                  <input
    type="text"
    value={uploadVersion}
    onChange={(e) => setUploadVersion(e.target.value)}
    placeholder="v1.0"
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn tệp đính kèm</label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center rounded-xl hover:border-blue-400 transition-colors cursor-pointer space-y-1">
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="font-bold text-slate-800 text-xs">Bấm để chọn tệp từ máy tính</p>
                  <p className="text-[11px] text-slate-400 font-medium">Hỗ trợ ZIP, PDF, PPTX, MP4, SQL (Tối đa 100MB)</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú kèm theo</label>
                <textarea
    rows={2}
    value={uploadNotes}
    onChange={(e) => setUploadNotes(e.target.value)}
    placeholder="Ghi chú tóm tắt nội dung tệp..."
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setShowUploadModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Hủy
              </button>
              <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
  >
                Tải lên
              </button>
            </div>
          </form>
        </div>}

      {
    /* REPLACE FILE MODAL */
  }
      {replaceTarget && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleReplaceFile} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" /> Thay thế tệp sản phẩm
              </h3>
              <button type="button" onClick={() => setReplaceTarget(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl font-bold border border-blue-100">
                Đang thay thế: {replaceTarget.title} ({replaceTarget.version})
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn tệp mới</label>
                <div className="border-2 border-dashed border-amber-200 bg-amber-50/40 p-4 text-center rounded-xl hover:bg-amber-50 transition-colors cursor-pointer space-y-1">
                  <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="font-bold text-amber-900 text-xs">Bấm để chọn tệp thay thế</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú chỉnh sửa</label>
                <textarea
    rows={2}
    value={uploadNotes}
    onChange={(e) => setUploadNotes(e.target.value)}
    placeholder="Mô tả điểm chỉnh sửa..."
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setReplaceTarget(null)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Hủy
              </button>
              <button
    type="submit"
    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
  >
                Lưu thay thế
              </button>
            </div>
          </form>
        </div>}

      {
    /* UPDATE REPOSITORY MODAL */
  }
      {showUpdateRepoModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleUpdateRepo} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-800" /> Cập nhật GitHub Repository
              </h3>
              <button type="button" onClick={() => setShowUpdateRepoModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">GitHub Repository URL *</label>
                <input
    type="url"
    required
    value={newRepoUrl}
    onChange={(e) => setNewRepoUrl(e.target.value)}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch chính</label>
                <input
    type="text"
    required
    value={newRepoBranch}
    onChange={(e) => setNewRepoBranch(e.target.value)}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setShowUpdateRepoModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Hủy
              </button>
              <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
  >
                Cập nhật
              </button>
            </div>
          </form>
        </div>}

      {
    /* CONTACT LECTURER MODAL */
  }
      {showContactModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSendContact} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Trao đổi với Giảng viên
              </h3>
              <button type="button" onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                Người nhận: {STUDENT_PROFILE.lecturerName} (Giảng viên hướng dẫn)
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung tin nhắn *</label>
                <textarea
    rows={4}
    required
    value={contactMsg}
    onChange={(e) => setContactMsg(e.target.value)}
    placeholder="Nhập nội dung thắc mắc về sản phẩm thực tập..."
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium"
  />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setShowContactModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Hủy
              </button>
              <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
  >
                <Send className="w-3.5 h-3.5" /> Gửi
              </button>
            </div>
          </form>
        </div>}
    </div>;
};

export { SubmissionsView as StudentSubmissionsView };
