import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  ArrowLeft,
  Download,
  History,
  GraduationCap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Video,
  FileArchive,
  Send,
  ChevronRight,
  Highlighter,
} from "lucide-react";
export const ReviewSubmissionWorkspace = ({
  student = {} as any,
  submissionTitle = "",
  onBack,
  onApprove,
  onRequestRevision,
}: {
  student?: any;
  submissionTitle?: string;
  onBack?: () => void;
  onApprove: () => void;
  onRequestRevision: () => void;
}) => {
  const [currentVersion, setCurrentVersion] = useState("v3");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [previewTab, setPreviewTab] = useState("pdf");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [completionProgress, setCompletionProgress] = useState(85);
  const [score, setScore] = useState("8.5");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [highlightComment, setHighlightComment] = useState("");
  const [selectedHighlightText, setSelectedHighlightText] = useState(null);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [aiChecks, setAiChecks] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentInput, setNewCommentInput] = useState("");
  const availableTags = [
    "\u0110\xFAng y\xEAu c\u1EA7u",
    "Thi\u1EBFu minh ch\u1EE9ng",
    "C\u1EA7n ch\u1EC9nh s\u1EEDa",
    "Vi\u1EBFt t\u1ED1t",
    "Thi\u1EBFu h\xECnh \u1EA3nh",
    "Thi\u1EBFu t\xE0i li\u1EC7u",
  ];
  const studentFiles: any[] = [];
  const versionsHistory: any[] = [];
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleResolveAiCheck = (id) => {
    setAiChecks(
      aiChecks.map((item) =>
        item.id === id ? { ...item, resolved: !item.resolved } : item,
      ),
    );
    triggerToast(
      "\u0110\xE3 c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i ki\u1EC3m tra AI",
    );
  };
  const handleAddCommentThread = (e) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: "TS. Ph\u1EA1m Minh Anh",
      role: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      time: "M\u1EDBi xong",
      paragraphRef: selectedHighlightText
        ? `N\u1ED9i dung \u0111\xE3 ch\u1ECDn: "${selectedHighlightText.substring(0, 35)}..."`
        : "Trang xem hi\u1EC7n t\u1EA1i",
      content: newCommentInput,
      resolved: false,
      replies: [],
    };
    setComments([newComment, ...comments]);
    setNewCommentInput("");
    setSelectedHighlightText(null);
    triggerToast(
      "\u0110\xE3 th\xEAm nh\u1EADn x\xE9t m\u1EDBi v\xE0o t\xE0i li\u1EC7u",
    );
  };
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden select-none font-sans">
      {/* Toast alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* TOP HEADER WORKSPACE NAVIGATION */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>← Quay lại hồ sơ sinh viên</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Breadcrumb Navigation */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="hover:text-slate-200 cursor-pointer">
              Sinh viên
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-bold">
              {student.name} ({student.mssv})
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 font-bold truncate max-w-[200px]">
              {submissionTitle}
            </span>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              triggerToast(
                `\u0110\xE3 t\u1EA3i g\xF3i b\xE0i n\u1ED9p c\u1EE7a ${student.name} (.zip)`,
              )
            }
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-md border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Tải xuống</span>
          </button>

          <button
            onClick={() =>
              triggerToast(
                "\u0110ang so s\xE1nh ch\xE9o c\xE1c phi\xEAn b\u1EA3n v1 vs v2 vs v3",
              )
            }
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-md border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Lịch sử phiên bản</span>
          </button>

          <button
            onClick={() => {
              triggerToast(
                "\u0110\xE3 l\u01B0u k\u1EBFt qu\u1EA3 ch\u1EA5m \u0111i\u1EC3m b\xE0i n\u1ED9p",
              );
              onApprove?.();
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-md"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Chấm điểm</span>
          </button>
        </div>
      </header>

      {/* THREE-COLUMN WORKSPACE BODY */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* ================================================================= */}
        {/* LEFT SIDEBAR: Student Info & Submission Versions Timeline (280px) */}
        {/* ================================================================= */}
        <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          {/* Card 1: Student Information Card */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-md object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm truncate">
                  {student.name}
                </h3>
                <p className="text-[11px] font-mono text-blue-400 font-bold">
                  MSSV: {student.mssv}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {student.class} • {student.major}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-900">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">
                  Doanh nghiệp:
                </span>
                <span className="font-bold text-slate-200 truncate text-[11px] max-w-[150px]">
                  {student.company}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Vị trí:</span>
                <span className="font-bold text-slate-200 text-[11px]">
                  {student.position || "Backend Intern"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">
                  Trạng thái đợt:
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded border border-emerald-500/30">
                  {student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Submission Details */}
          <div className="p-4 border-b border-slate-800/80 space-y-2.5 text-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              THÔNG TIN BÀI NỘP
            </h4>

            <div className="p-3 bg-slate-900/90 rounded-md border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Loại bài:</span>
                <span className="font-bold text-blue-400 text-[11px] text-right max-w-[180px] truncate" title={submissionTitle}>
                  {submissionTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Ngày nộp:</span>
                <span className="font-mono text-slate-200 text-[11px]">
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Phiên bản:</span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px] rounded">
                  {currentVersion.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400 text-[11px]">Hạn chót:</span>
                <span className="font-bold text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Nộp đúng hạn
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Submission History (Version Timeline like GitHub) */}
          <div className="p-4 border-b border-slate-800/80 space-y-3 text-xs flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                LỊCH SỬ PHIÊN BẢN (PR STYLE)
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">3 v</span>
            </div>

            <div className="space-y-2">
              {versionsHistory.map((v, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (v.version.includes("v3")) setCurrentVersion("v3");
                    if (v.version.includes("v2")) setCurrentVersion("v2");
                    if (v.version.includes("v1")) setCurrentVersion("v1");
                    triggerToast(
                      `Chuy\u1EC3n sang xem phi\xEAn b\u1EA3n ${v.version}`,
                    );
                  }}
                  className={`p-2.5 rounded-md border transition-all cursor-pointer space-y-1 ${v.active ? "bg-blue-950/60 border-blue-500/60 text-white shadow-sm" : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 text-slate-300"}`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${v.active ? "bg-blue-400 animate-ping" : "bg-slate-600"}`}
                      />
                      Phiên bản {v.version}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {v.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{v.date}</span>
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <MessageSquare className="w-3 h-3 text-blue-400" />{" "}
                      {v.commentsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Student Uploaded Attachments */}
          <div className="p-4 space-y-2.5 text-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TỆP ĐÍNH KÈM (5 FILES)
            </h4>

            <div className="space-y-1.5">
              {studentFiles.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedFileIndex(idx);
                    triggerToast(
                      `\u0110ang hi\u1EC3n th\u1ECB t\u1EC7p ${file.name}`,
                    );
                  }}
                  className={`p-2 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${selectedFileIndex === idx ? "bg-blue-600/20 border-blue-500 text-white" : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 text-slate-300"}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <file.icon
                      className={`w-3.5 h-3.5 ${file.primary ? "text-red-400" : "text-blue-400"} shrink-0`}
                    />
                    <span className="font-semibold text-[11px] truncate">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0 font-mono">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ================================================================= */}
        {/* CENTER: Document Preview Workspace (Visual Center) */}
        {/* ================================================================= */}
        <main className="flex-1 bg-slate-900 flex flex-col min-w-0 relative overflow-hidden">
          {/* Document Preview Toolbar */}
          <div className="h-11 bg-slate-950/80 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 text-xs">
            {/* Format Preview Switches */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800">
              <button
                onClick={() => setPreviewTab("pdf")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${previewTab === "pdf" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"}`}
              >
                PDF Document
              </button>
              <button
                onClick={() => setPreviewTab("markdown")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${previewTab === "markdown" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"}`}
              >
                Markdown / Text
              </button>
              <button
                onClick={() => setPreviewTab("code")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${previewTab === "code" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"}`}
              >
                Source Code
              </button>
            </div>

            {/* View Controls: Zoom, Rotate, Fullscreen */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800 text-slate-300">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  className="p-1 hover:text-white"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] font-bold w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  className="p-1 hover:text-white"
                  title="Phóng to"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setRotation((rotation + 90) % 360)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800"
                title="Xoay 90 độ"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    "M\u1EDF ch\u1EBF \u0111\u1ED9 xem to\xE0n m\xE0n h\xECnh",
                  )
                }
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800"
                title="Toàn màn hình"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Display Canvas */}
          <div className="flex-1 overflow-auto p-6 flex justify-center bg-[#0b0f19] custom-scrollbar relative">
            {/* Floating Selection Tooltip for Inline Commenting (Figma / Docs Style) */}
            {selectedHighlightText && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md border border-blue-400 flex items-center gap-2 animate-in fade-in zoom-in-95 text-xs font-bold">
                <Highlighter className="w-4 h-4 text-amber-300" />
                <span>Đã chọn: "{selectedHighlightText}"</span>
                <button
                  onClick={() => {
                    setNewCommentInput(
                      `[Nh\u1EADn x\xE9t \u0111o\u1EA1n: "${selectedHighlightText}"] `,
                    );
                  }}
                  className="px-2.5 py-1 bg-white text-blue-900 font-bold rounded-lg hover:bg-slate-100 transition-colors ml-2"
                >
                  💬 Thêm nhận xét
                </button>
              </div>
            )}

            {/* Document Paper Container */}
            <div
              className="bg-white text-slate-900 rounded-lg shadow-md p-8 md:p-12 max-w-3xl w-full min-h-[900px] my-auto transition-transform duration-200 select-text"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center top",
              }}
              onMouseUp={() => {
                const selection = window.getSelection()?.toString().trim();
                if (selection && selection.length > 5) {
                  setSelectedHighlightText(selection);
                }
              }}
            >
              {/* Document Paper Header */}
              <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 tracking-widest uppercase">
                    TRƯỜNG ĐẠI HỌC BÁCH KHOA • KHOA CNTT
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 uppercase">
                    BÁO CÁO THỰC TẬP TỐT NGHIỆP - TUẦN 5
                  </h1>
                  <p className="text-xs text-slate-600 font-serif mt-1 italic">
                    Chuyên đề: Thiết kế Kiến trúc Microservices & Tích hợp
                    OAuth2/JWT Refresh Token
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-slate-600">
                  <p className="font-bold text-slate-900">Mã bài: BC-T5-2026</p>
                  <p>
                    Phiên bản: <strong>{currentVersion}</strong>
                  </p>
                  <p>Ngày: 02/09/2026</p>
                </div>
              </div>

              {/* Document Content Sections */}
              {previewTab === "pdf" && (
                <div className="space-y-6 text-sm leading-relaxed text-slate-800 font-serif">
                  {/* Section 1 */}
                  <div className="space-y-2">
                    <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-l-4 border-blue-600 pl-3">
                      1. CÔNG VIỆC ĐÃ HOÀN THÀNH TRONG TUẦN 5
                    </h2>
                    <p className="text-justify">
                      Trong tuần làm việc vừa qua tại doanh nghiệp{" "}
                      <strong className="font-sans text-slate-900">{student.company || "—"}</strong>
                      , dưới sự hướng dẫn trực tiếp của Mentor{" "}
                      <span className="font-sans font-bold">{student.supervisor || "—"}</span>
                      , em đã hoàn thành thiết kế và cài đặt luồng xác thực
                      người dùng dựa trên mô hình Microservices.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-xs font-sans text-slate-700">
                      <li>
                        Cài đặt API Gateway kết nối Service Auth và Service
                        User.
                      </li>
                      <li>
                        Áp dụng giải thuật mã hóa RSA256 cho chuỗi JWT Access
                        Token (Thời hạn 15 phút).
                      </li>
                      <li>
                        Lưu trữ Refresh Token mã hóa Argon2 trong CSDL Redis
                        Cache đảm bảo tốc độ truy vấn &lt; 5ms.
                      </li>
                    </ul>
                  </div>

                  {/* Section 2 (Highlighted Paragraph Example) */}
                  <div className="space-y-2 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500 font-sans">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                      <span>
                        Mục 2.3: "Kiến trúc JWT Refresh Token Handler"
                      </span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px]">
                        Đang có 1 nhận xét
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed italic">
                      "Khi Access Token hết hạn, Client tự động gửi request kèm
                      Refresh Token lên `/api/v1/auth/refresh`. Hệ thống kiểm
                      tra Redis, nếu token hợp lệ và chưa revoked thì cấp cặp
                      token mới."
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div className="space-y-2">
                    <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-l-4 border-blue-600 pl-3">
                      2. SƠ ĐỒ LUỒNG DỮ LIỆU SEQUENCE DIAGRAM
                    </h2>
                    <p className="text-justify text-xs font-sans text-slate-600">
                      Dưới đây là sơ đồ trình tự thể hiện sự tương tác giữa
                      Client App, API Gateway, Auth Microservice và CSDL Redis:
                    </p>
                    <div className="p-4 bg-slate-100 rounded-md border border-slate-300 text-center space-y-2 font-mono text-xs">
                      <div className="p-6 bg-white border border-slate-300 rounded shadow-xs font-bold text-slate-700">
                        [Client App] ──(1) Post Login──► [API Gateway] ──(2)
                        Verify──► [Auth Service] ──(3) Save Cache──► [Redis DB]
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Hình 5.1: Sơ đồ tương tác xác thực hệ thống v3
                      </span>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="space-y-2">
                    <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-l-4 border-blue-600 pl-3">
                      3. KẾ HOẠCH CHO TUẦN 6
                    </h2>
                    <p className="text-justify text-xs font-sans text-slate-600">
                      Tuần 6 em sẽ hoàn thiện phần Docker Compose để khởi chạy
                      toàn bộ 4 microservices trên môi trường staging của FPT và
                      viết tài liệu OpenAPI Swagger cho nhóm Frontend kết nối.
                    </p>
                  </div>
                </div>
              )}

              {previewTab === "markdown" && (
                <div className="font-mono text-xs text-slate-800 space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200">
                  <p className="text-blue-700 font-bold">
                    # BÁO CÁO THỰC TẬP TUẦN 5
                  </p>
                  <p>**Sinh viên:** {student.name || "—"} - **MSSV:** {student.mssv || "—"}</p>
                  <p>**Mentor:** {student.supervisor || "—"}</p>
                  <hr />
                  <p className="font-bold text-slate-900">
                    ## 1. Công việc hoàn thành
                  </p>
                  <p>- Cài đặt JWT Refresh Token Handler</p>
                  <p>- Thiết kế sơ đồ ERD &amp; Sequence Diagram</p>
                </div>
              )}

              {previewTab === "code" && (
                <div className="font-mono text-xs text-slate-100 bg-slate-900 p-4 rounded-md space-y-2 overflow-x-auto">
                  <p className="text-slate-500">
                    // auth.controller.ts - Version 3
                  </p>
                  <p>
                    <span className="text-purple-400">
                      export async function
                    </span>{" "}
                    <span className="text-blue-400">refreshTokenHandler</span>
                    (req: Request, res: Response) &#123;
                  </p>
                  <p className="pl-4">
                    <span className="text-purple-400">const</span> token =
                    req.body.refreshToken;
                  </p>
                  <p className="pl-4">
                    <span className="text-purple-400">if</span> (!token){" "}
                    <span className="text-purple-400">return</span>{" "}
                    res.status(401).json(&#123; error:{" "}
                    <span className="text-green-300">'Token missing'</span>{" "}
                    &#125;);
                  </p>
                  <p className="pl-4">
                    <span className="text-slate-500">
                      // Verify with Redis Cache
                    </span>
                  </p>
                  <p className="pl-4">
                    <span className="text-purple-400">const</span> isValid ={" "}
                    <span className="text-purple-400">await</span>{" "}
                    redis.get(`refresh:$&#123;token&#125;`);
                  </p>
                  <p>&#125;</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ================================================================= */}
        {/* RIGHT SIDEBAR: Review Panel, Discussion & AI Review (320px) */}
        {/* ================================================================= */}
        <aside className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          {/* Section 2: Comments & Threaded Discussion */}
          <div className="p-4 border-b border-slate-800/80 space-y-3 text-xs flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                NHẬN XÉT DẠNG THREAD ({comments.length})
              </h4>
              <span className="text-[10px] text-slate-500">
                Google Docs Style
              </span>
            </div>

            {/* Comment Threads */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-slate-900 rounded-md border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        className="w-6 h-6 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-white text-[11px] block">
                          {c.author}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {c.time}
                        </span>
                      </div>
                    </div>
                    {c.resolved && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded">
                        Đã giải quyết
                      </span>
                    )}
                  </div>

                  <div className="p-1.5 bg-slate-950 rounded text-[10px] font-mono text-amber-300 border border-slate-800/80">
                    📌 {c.paragraphRef}
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-medium">
                    {c.content}
                  </p>

                  {/* Student Reply */}
                  {c.replies.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="pl-3 border-l-2 border-blue-600/50 pt-1 space-y-1"
                    >
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-blue-400">
                          {r.author} ({r.role})
                        </span>
                        <span className="text-slate-500">{r.time}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] italic">
                        {r.content}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* New Comment Thread Input */}
            <form onSubmit={handleAddCommentThread} className="space-y-2 pt-2">
              <textarea
                rows={2}
                value={newCommentInput}
                onChange={(e) => setNewCommentInput(e.target.value)}
                placeholder="Nhập nhận xét trực tiếp vào đoạn đang xem..."
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-md text-xs outline-none focus:border-blue-500 text-slate-100 font-medium"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi nhận xét</span>
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* ================================================================= */}
      {/* BOTTOM FIXED EVALUATION BAR (Minimizes Clicks) */}
      {/* ================================================================= */}
      <footer className="h-20 bg-slate-950 border-t border-slate-800 px-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 z-30">
        {/* Left: Completion Progress Slider & Score Input */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Progress Slider */}
          <div className="space-y-1 min-w-[160px]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-bold">
                Mức độ hoàn thành:
              </span>
              <span className="font-bold text-blue-400">
                {completionProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={completionProgress}
              onChange={(e) => setCompletionProgress(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Quick Score */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
            <span className="text-xs font-bold text-slate-400">Điểm số:</span>
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-12 text-center bg-slate-950 text-emerald-400 font-bold text-sm border border-slate-700 rounded-lg py-0.5 outline-none focus:border-emerald-500"
            />
            <span className="text-xs font-bold text-slate-500">/ 10</span>
          </div>

          {/* Quick Tags Selector */}
          <div className="hidden lg:flex items-center gap-1.5">
            {availableTags.map((tag, tIdx) => (
              <button
                key={tIdx}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${selectedTags.includes(tag) ? "bg-blue-600/30 text-blue-300 border-blue-500" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Primary Decision Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              triggerToast(
                "\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u ch\u1EC9nh s\u1EEDa cho sinh vi\xEAn k\xE8m danh s\xE1ch g\xF3p \xFD",
              );
              onRequestRevision?.();
            }}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-md border border-amber-500/40 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Yêu cầu chỉnh sửa</span>
          </button>

          <button
            onClick={() => {
              triggerToast(
                "\u0110\xE3 ch\u1EA5p nh\u1EADn ph\xEA duy\u1EC7t b\xE1o c\xE1o tu\u1EA7n 5!",
              );
              onApprove?.();
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md transition-all shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Chấp nhận &amp; Phê duyệt</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
