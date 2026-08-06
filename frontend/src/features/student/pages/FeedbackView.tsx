import { useState } from 'react';
import {
  MessageSquare,
  Send,
  Upload,
  History,
  FileText,
  Search,
  Download,
  FileArchive,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  FileCode,
  Presentation
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../../data/studentMockData';
export const FeedbackView = ({
  onShowToast,
  onNavigateToWeeklyReports
}) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [feedbacks, setFeedbacks] = useState([
    {
      id: "fb-101",
      senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      senderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      timeAgo: "2 gi\u1EDD tr\u01B0\u1EDBc",
      dateStr: "01/10/2026 14:30",
      title: "B\u1ED5 sung s\u01A1 \u0111\u1ED3 UML Use Case & Sequence Diagram",
      category: "UML",
      priority: "Kh\u1EA9n",
      status: "C\u1EA7n ch\u1EC9nh s\u1EEDa",
      detail: "C\u1EA7n b\u1ED5 sung s\u01A1 \u0111\u1ED3 ERD v\xE0 v\u1EBD l\u1EA1i Sequence Diagram cho lu\u1ED3ng Thanh to\xE1n VNPAY. File thi\u1EBFt k\u1EBF hi\u1EC7n t\u1EA1i c\xF2n thi\u1EBFu Validation Middleware \u1EDF Server.",
      attachments: [
        { name: "Yeu_Cau_Bo_Sung_UML_v1.pdf", size: "1.4 MB", type: "pdf" },
        { name: "Mau_So_Do_Mau.png", size: "850 KB", type: "image" }
      ],
      currentWorkflowStep: 3,
      conversation: [
        {
          id: "c-1",
          sender: "lecturer",
          senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          time: "01/10/2026 14:30",
          text: "Ch\xE0o em, th\u1EA7y \u0111\xE3 ki\u1EC3m tra ph\u1EA7n thi\u1EBFt k\u1EBF UML. Em c\u1EA7n b\u1ED5 sung s\u01A1 \u0111\u1ED3 ERD chi ti\u1EBFt cho b\u1EA3ng Transactions v\xE0 s\u1EEDa l\u1EA1i README ch\u01B0a \u0111\u1EA7y \u0111\u1EE7 \u1EDF Repository GitHub.",
          attachments: [{ name: "Nhan_Xet_Chi_Tiet_GV.pdf", size: "420 KB", type: "pdf" }]
        },
        {
          id: "c-2",
          sender: "student",
          senderName: "Nguy\u1EC5n V\u0103n A (B\u1EA1n)",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
          time: "01/10/2026 15:10",
          text: "D\u1EA1 th\u1EA7y! Em \u0111\xE3 ti\u1EBFp thu g\xF3p \xFD. Em v\u1EEBa c\u1EADp nh\u1EADt l\u1EA1i s\u01A1 \u0111\u1ED3 Use Case v\xE0 b\u1ED5 sung README tr\xEAn Repo. Em xin n\u1ED9p l\u1EA1i b\u1EA3n revision v1.1 \u1EA1."
        }
      ],
      revisions: [
        {
          version: "v1.1",
          submissionTime: "01/10/2026 15:15",
          description: "C\u1EADp nh\u1EADt theo g\xF3p \xFD: Th\xEAm s\u01A1 \u0111\u1ED3 ERD & c\u1EADp nh\u1EADt README",
          status: "\u0110ang ch\u1EDD duy\u1EC7t",
          fileName: "Design_UML_v1.1_Revised.zip",
          fileSize: "14.2 MB"
        },
        {
          version: "v1.0",
          submissionTime: "28/09/2026 09:00",
          description: "B\u1EA3n n\u1ED9p ban \u0111\u1EA7u",
          status: "C\u1EA7n ch\u1EC9nh s\u1EEDa l\u1EA1i",
          fileName: "Design_UML_v1.0.zip",
          fileSize: "12.5 MB"
        }
      ]
    },
    {
      id: "fb-102",
      senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      senderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      timeAgo: "H\xF4m qua",
      dateStr: "30/09/2026 16:45",
      title: "C\u1EA7n s\u1EEDa b\xE1o c\xE1o tu\u1EA7n 6 - Th\xEAm s\u01A1 \u0111\u1ED3 UML Data Flow",
      category: "B\xE1o c\xE1o tu\u1EA7n",
      priority: "Cao",
      status: "Ch\u01B0a xem",
      detail: "B\xE1o c\xE1o tu\u1EA7n 6 ti\u1EBFn \u0111\u1ED9 t\u1ED1t nh\u01B0ng thi\u1EBFu h\xECnh s\u01A1 \u0111\u1ED3 UML Data Flow v\xE0 k\u1EBFt lu\u1EADn ch\u01B0a \u0111\u1EA7y \u0111\u1EE7.",
      attachments: [
        { name: "BaoCao_Tuan6_GopY.docx", size: "520 KB", type: "docx" }
      ],
      currentWorkflowStep: 2,
      conversation: [
        {
          id: "c-10",
          sender: "lecturer",
          senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          time: "30/09/2026 16:45",
          text: "N\u1ED9i dung tu\u1EA7n 6 t\u1ED1t nh\u01B0ng em nh\u1EDB b\u1ED5 sung h\xECnh s\u01A1 \u0111\u1ED3 UML Data Flow v\xE0 c\u1EADp nh\u1EADt ph\u1EA7n k\u1EBFt lu\u1EADn nh\xE9."
        }
      ],
      revisions: [
        {
          version: "v1.0",
          submissionTime: "29/09/2026 18:00",
          description: "B\u1EA3n n\u1ED9p ban \u0111\u1EA7u",
          status: "G\u1ED1c (Original)",
          fileName: "BaoCao_Tuan6_NguyenVanA.pdf",
          fileSize: "2.4 MB"
        }
      ]
    },
    {
      id: "fb-103",
      senderName: "Anh Tr\u1EA7n Minh T\xE2m",
      senderRole: "Mentor FPT Software",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      timeAgo: "3 ng\xE0y tr\u01B0\u1EDBc",
      dateStr: "28/09/2026 10:20",
      title: "Thuy\u1EBFt minh gi\u1ECDng n\xF3i cho Video Demo",
      category: "Video Demo",
      priority: "Cao",
      status: "C\u1EA7n ch\u1EC9nh s\u1EEDa",
      detail: "Video Demo c\u1EA7n c\xF4 \u0111\u1ECDng d\u01B0\u1EDBi 5 ph\xFAt, ch\xE8n th\xEAm thuy\u1EBFt minh gi\u1ECDng n\xF3i gi\u1EA3i th\xEDch t\xEDnh n\u0103ng ch\xEDnh.",
      attachments: [],
      currentWorkflowStep: 3,
      conversation: [
        {
          id: "c-20",
          sender: "lecturer",
          senderName: "Anh Tr\u1EA7n Minh T\xE2m",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
          time: "28/09/2026 10:20",
          text: "Video Demo hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 \xE2m thanh thuy\u1EBFt minh. Em thu \xE2m gi\u1ECDng n\xF3i gi\u1EA3i th\xEDch t\u1EEB 02:15 \u0111\u1EBFn 04:30 nh\xE9."
        }
      ],
      revisions: [
        {
          version: "v1.0",
          submissionTime: "27/09/2026 20:00",
          description: "B\u1EA3n n\u1ED9p ban \u0111\u1EA7u",
          status: "C\u1EA7n ch\u1EC9nh s\u1EEDa l\u1EA1i",
          fileName: "Demo_Full_15Mins.mp4",
          fileSize: "85 MB"
        }
      ]
    },
    {
      id: "fb-104",
      senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      senderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      timeAgo: "5 ng\xE0y tr\u01B0\u1EDBc",
      dateStr: "26/09/2026 11:00",
      title: "Duy\u1EC7t Slide thuy\u1EBFt tr\xECnh B\u1EA3o v\u1EC7 Th\u1EF1c t\u1EADp",
      category: "Slide",
      priority: "B\xECnh th\u01B0\u1EDDng",
      status: "\u0110\xE3 ho\xE0n th\xE0nh",
      detail: "Slide thi\u1EBFt k\u1EBF r\xF5 r\xE0ng, tr\xECnh b\xE0y \u0111\u1EA7y \u0111\u1EE7 c\xE1c ph\u1EA7n. \u0110\xE3 duy\u1EC7t \u0111\u1EC3 b\u1EA3o v\u1EC7 ch\xEDnh th\u1EE9c.",
      attachments: [
        { name: "Slide_Approved_Final.pptx", size: "18.2 MB", type: "pptx" }
      ],
      currentWorkflowStep: 6,
      conversation: [
        {
          id: "c-30",
          sender: "lecturer",
          senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          time: "26/09/2026 11:00",
          text: "Slide \u0111\u1EA1t y\xEAu c\u1EA7u. Ch\xFAc em chu\u1EA9n b\u1ECB t\u1ED1t cho bu\u1ED5i b\xE1o c\xE1o."
        }
      ],
      revisions: [
        {
          version: "v1.2",
          submissionTime: "26/09/2026 09:30",
          description: "Phi\xEAn b\u1EA3n ho\xE0n thi\u1EC7n",
          status: "\u0110\xE3 ch\u1EA5p nh\u1EADn",
          fileName: "Slide_BaoVe_v1.2_Final.pptx",
          fileSize: "18.2 MB"
        }
      ]
    }
  ]);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState("fb-101");
  const selectedFeedback = feedbacks.find((f) => f.id === selectedFeedbackId) || feedbacks[0];
  const [replyText, setReplyText] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadVersion, setUploadVersion] = useState("v1.2");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchSearch = fb.title.toLowerCase().includes(searchQuery.toLowerCase()) || fb.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || fb.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "Unread") return fb.status === "Ch\u01B0a xem";
    if (activeTab === "Need Revision") return fb.status === "C\u1EA7n ch\u1EC9nh s\u1EEDa";
    if (activeTab === "Completed") return fb.status === "\u0110\xE3 ho\xE0n th\xE0nh";
    return true;
  });
  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize) || 1;
  const paginatedFeedbacks = filteredFeedbacks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handleMarkAsRead = (id) => {
    setFeedbacks((prev) => prev.map((f) => {
      if (f.id === id) {
        return { ...f, status: f.status === "Ch\u01B0a xem" ? "\u0110\xE3 xem" : f.status };
      }
      return f;
    }));
    onShowToast("\u0110\xE3 \u0111\xE1nh d\u1EA5u l\xE0 \u0110\xE3 xem!");
  };
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp n\u1ED9i dung tr\u1EA3 l\u1EDDi!");
      return;
    }
    const newReply = {
      id: `c-${Date.now()}`,
      sender: "student",
      senderName: "Nguy\u1EC5n V\u0103n A (B\u1EA1n)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      time: "V\u1EEBa xong",
      text: replyText
    };
    setFeedbacks((prev) => prev.map((f) => {
      if (f.id === selectedFeedback.id) {
        return {
          ...f,
          conversation: [...f.conversation, newReply],
          status: f.status === "C\u1EA7n ch\u1EC9nh s\u1EEDa" ? "\u0110\xE3 xem" : f.status
        };
      }
      return f;
    }));
    setReplyText("");
    onShowToast("\u0110\xE3 g\u1EEDi tin nh\u1EAFn ph\u1EA3n h\u1ED3i t\u1EDBi gi\u1EA3ng vi\xEAn!");
  };
  const handleUploadRevisionSubmit = (e) => {
    e.preventDefault();
    if (!selectedFileName) {
      onShowToast("Vui l\xF2ng ch\u1ECDn t\u1EC7p \u0111\xEDnh k\xE8m!");
      return;
    }
    const newRev = {
      version: uploadVersion || "v1.2",
      submissionTime: "V\u1EEBa xong",
      description: uploadDescription || "\u0110\xE3 c\u1EADp nh\u1EADt theo ph\u1EA3n h\u1ED3i c\u1EE7a Gi\u1EA3ng vi\xEAn",
      status: "\u0110ang ch\u1EDD duy\u1EC7t",
      fileName: selectedFileName,
      fileSize: "8.4 MB"
    };
    setFeedbacks((prev) => prev.map((f) => {
      if (f.id === selectedFeedback.id) {
        return {
          ...f,
          currentWorkflowStep: 4,
          revisions: [newRev, ...f.revisions]
        };
      }
      return f;
    }));
    onShowToast(`\u0110\xE3 t\u1EA3i l\xEAn t\u1EC7p ch\u1EC9nh s\u1EEDa ${newRev.version} th\xE0nh c\xF4ng!`);
    setShowUploadModal(false);
    setSelectedFileName("");
    setUploadDescription("");
  };
  const getPriorityBadge = (p) => {
    switch (p) {
      case "Kh\u1EA9n":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Cao":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };
  const getStatusBadge = (s) => {
    switch (s) {
      case "Ch\u01B0a xem":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "\u0110\xE3 xem":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "C\u1EA7n ch\u1EC9nh s\u1EEDa":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "\u0110\xE3 ho\xE0n th\xE0nh":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
  const getFileTypeIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-rose-600" />;
      case "docx":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "pptx":
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case "zip":
        return <FileArchive className="w-4 h-4 text-amber-600" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-600" />;
    }
  };
  const unreadCount = feedbacks.filter((f) => f.status === "Ch\u01B0a xem").length;
  const needRevisionCount = feedbacks.filter((f) => f.status === "C\u1EA7n ch\u1EC9nh s\u1EEDa").length;
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Phản hồi & Chỉnh sửa
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              {feedbacks.length} phản hồi
            </span>
            {unreadCount > 0 && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 font-extrabold text-[11px] rounded-full border border-amber-200">
                {unreadCount} chưa đọc
              </span>}
            {needRevisionCount > 0 && <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 font-extrabold text-[11px] rounded-full border border-rose-200">
                {needRevisionCount} cần chỉnh sửa
              </span>}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Theo dõi ý kiến đánh giá từ Giảng viên hướng dẫn và nộp bản chỉnh sửa bổ sung.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={() => setShowUploadModal(true)}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
            <Upload className="w-3.5 h-3.5" />
            <span>Nộp bản chỉnh sửa</span>
          </button>
        </div>
      </div>

      {
    /* 2. MAIN GRID LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {
    /* LEFT 2 COLS: FEEDBACK LIST & SELECTED FEEDBACK CONVERSATION */
  }
        <div className="lg:col-span-2 space-y-6">

          {
    /* FEEDBACK LIST CARD */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" /> Danh sách góp ý & nhận xét
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-40 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
    type="text"
    placeholder="Tìm góp ý/giảng viên..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none"
  />
                </div>
              </div>
            </div>

            {
    /* Filter Tabs */
  }
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              {[
    { key: "All", label: "T\u1EA5t c\u1EA3" },
    { key: "Unread", label: "Ch\u01B0a \u0111\u1ECDc" },
    { key: "Need Revision", label: "C\u1EA7n ch\u1EC9nh s\u1EEDa" },
    { key: "Completed", label: "\u0110\xE3 ho\xE0n th\xE0nh" }
  ].map((tab) => <button
    key={tab.key}
    onClick={() => setActiveTab(tab.key)}
    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.key ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
                  {tab.label}
                </button>)}
            </div>

            {
    /* List of items */
  }
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {filteredFeedbacks.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  Không tìm thấy phản hồi nào phù hợp.
                </div> : paginatedFeedbacks.map((fb) => {
    const isSelected = fb.id === selectedFeedbackId;
    return <div
      key={fb.id}
      onClick={() => {
        setSelectedFeedbackId(fb.id);
        if (fb.status === "Ch\u01B0a xem") handleMarkAsRead(fb.id);
      }}
      className={`p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSelected ? "bg-blue-50/70 border-l-4 border-l-blue-600" : fb.status === "Ch\u01B0a xem" ? "bg-slate-50/80 font-bold" : "hover:bg-slate-50/50"}`}
    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img src={fb.avatar} alt={fb.senderName} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate">{fb.senderName}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-md">
                              {fb.category}
                            </span>
                          </div>
                          <p className={`text-xs truncate ${isSelected ? "text-blue-900 font-bold" : "text-slate-800 font-medium"}`}>
                            {fb.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{fb.detail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getPriorityBadge(fb.priority)}`}>
                          {fb.priority}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${getStatusBadge(fb.status)}`}>
                          {fb.status}
                        </span>
                      </div>
                    </div>;
  })}
            </div>

            {
    /* Pagination */
  }
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                Hiển thị {paginatedFeedbacks.length} / {filteredFeedbacks.length} phản hồi
              </span>

              <div className="flex items-center gap-1.5 font-bold">
                <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
  >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
  >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {
    /* SELECTED FEEDBACK CONVERSATION WORKSPACE */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedFeedback.avatar} alt={selectedFeedback.senderName} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedFeedback.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedFeedback.senderName} ({selectedFeedback.senderRole}) • {selectedFeedback.dateStr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
    onClick={() => setShowUploadModal(true)}
    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
                  <Upload className="w-3.5 h-3.5" /> Nộp bản sửa
                </button>
              </div>
            </div>

            {
    /* Detailed Comment Box */
  }
            <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Nhận xét từ Giảng viên:
              </p>
              <p className="text-slate-800 font-medium leading-relaxed bg-white/80 p-3 rounded-lg border border-amber-200/60">
                "{selectedFeedback.detail}"
              </p>

              {
    /* Attachments */
  }
              {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                  <p className="text-[10px] font-bold text-amber-900 uppercase">File đính kèm từ Giảng viên:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.attachments.map((att, idx) => <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-amber-200/80 text-xs flex items-center gap-2">
                        {getFileTypeIcon(att.type)}
                        <span className="font-bold text-slate-800">{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                        <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i t\u1EC7p ${att.name}...`)}
    className="p-1 hover:bg-amber-50 text-amber-700 rounded transition-colors"
  >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>)}
                  </div>
                </div>}
            </div>

            {
    /* Conversation Thread */
  }
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Trao đổi ({selectedFeedback.conversation.length})
              </h4>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedFeedback.conversation.map((msg) => <div
    key={msg.id}
    className={`flex gap-2.5 text-xs ${msg.sender === "student" ? "flex-row-reverse" : ""}`}
  >
                    <img src={msg.avatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5" />
                    <div className={`space-y-1 max-w-[85%] ${msg.sender === "student" ? "items-end text-right" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-[11px]">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                      </div>
                      <div className={`p-3 rounded-2xl leading-relaxed text-xs font-medium inline-block ${msg.sender === "student" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none"}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>)}
              </div>

              {
    /* Reply Form */
  }
              <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
    type="text"
    placeholder="Nhập nội dung phản hồi tới giảng viên..."
    value={replyText}
    onChange={(e) => setReplyText(e.target.value)}
    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
  />
                <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
  >
                  <Send className="w-3.5 h-3.5" /> Trả lời
                </button>
              </form>
            </div>
          </div>
        </div>

        {
    /* RIGHT 1 COL: REVISION HISTORY & INSTRUCTOR INFO */
  }
        <div className="lg:col-span-1 space-y-6">

          {
    /* REVISION HISTORY FOR SELECTED ITEM */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" /> Lịch sử nộp ({selectedFeedback.revisions.length} bản)
            </h3>

            <div className="space-y-2.5 text-xs">
              {selectedFeedback.revisions.map((rev, idx) => <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700">{rev.version}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.submissionTime}</span>
                  </div>
                  <p className="font-bold text-slate-800 truncate">{rev.fileName}</p>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{rev.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rev.status === "\u0110\xE3 ch\u1EA5p nh\u1EADn" ? "bg-emerald-100 text-emerald-800" : rev.status === "\u0110ang ch\u1EDD duy\u1EC7t" ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"}`}>
                      {rev.status}
                    </span>
                    <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i xu\u1ED1ng ${rev.fileName}`)}
    className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
  >
                      <Download className="w-3 h-3" /> Tải về
                    </button>
                  </div>
                </div>)}
            </div>
          </div>

          {
    /* LECTURER CONTACT INFO */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Giảng viên Hướng dẫn
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Phụ trách chấm bài</span>
                <p className="font-bold text-slate-900">{STUDENT_PROFILE.lecturerName}</p>
                <p className="text-[11px] text-slate-500">phuoc.nv@internlink.edu.vn</p>
              </div>

              {onNavigateToWeeklyReports && <button
    onClick={onNavigateToWeeklyReports}
    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
  >
                  <FileText className="w-4 h-4 text-slate-500" /> Xem danh sách Báo cáo tuần
                </button>}
            </div>
          </div>

        </div>
      </div>

      {
    /* MODAL: UPLOAD REVISION FORM */
  }
      {showUploadModal && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleUploadRevisionSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> Nộp bản chỉnh sửa cho {selectedFeedback.category}
              </h3>
              <button
    type="button"
    onClick={() => setShowUploadModal(false)}
    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
  >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phiên bản *</label>
                <input
    type="text"
    required
    placeholder="v1.1, v1.2, v2.0..."
    value={uploadVersion}
    onChange={(e) => setUploadVersion(e.target.value)}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú chỉnh sửa</label>
                <textarea
    rows={2}
    required
    placeholder="Mô tả các nội dung đã tiếp thu và bổ sung..."
    value={uploadDescription}
    onChange={(e) => setUploadDescription(e.target.value)}
    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn tệp đính kèm *</label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center rounded-xl hover:border-blue-400 transition-colors cursor-pointer space-y-1">
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="font-bold text-slate-800 text-xs">Bấm để chọn tệp từ máy tính</p>
                  <p className="text-[11px] text-slate-400 font-medium">Hỗ trợ PDF, ZIP, DOCX, PPTX (Tối đa 50MB)</p>
                </div>
                <input
    type="file"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFileName(e.target.files[0].name);
      }
    }}
    className="mt-2 w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />
                {selectedFileName && <p className="text-[11px] text-emerald-700 font-bold mt-1">Đã chọn: {selectedFileName}</p>}
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

    </div>;
};

export { FeedbackView as StudentFeedbackView };
