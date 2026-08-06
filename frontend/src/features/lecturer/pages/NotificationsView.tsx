import { useState } from 'react';
import { Toast } from '../../../components/common/Toast';
import {
  Bell,
  Send,
  UserCheck,
  AlertTriangle,
  Info,
  Clock,
  Search,
  Plus,
  Trash2,
  Mail,
  User,
  Building2,
  Calendar,
  Paperclip,
  FileText,
  AlertCircle,
  X,
  Share2,
  Eye,
  Edit3
} from 'lucide-react';
export const NotificationsView = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Nguy\u1EC5n V\u0103n A ch\u01B0a n\u1ED9p b\xE1o c\xE1o tu\u1EA7n 5",
      desc: "Sinh vi\xEAn tr\u1EC5 n\u1ED9p b\xE1o c\xE1o tu\u1EA7n 5 qu\xE1 2 ng\xE0y so v\u1EDBi th\u1EDDi h\u1EA1n quy \u0111\u1ECBnh.",
      type: "urgent",
      priority: "Kh\u1EA9n c\u1EA5p",
      color: "rose",
      isUnread: true,
      time: "10:15 - H\xF4m nay",
      sender: "H\u1EC7 th\u1ED1ng InternLink Auto-Check",
      receiver: "Gi\u1EA3ng vi\xEAn Tr\u1EA7n Minh Huy",
      student: "Nguy\u1EC5n V\u0103n A (MSSV: 20120001 - L\u1EDBp C24A.TH1)",
      company: "FPT Software (H\xE0 N\u1ED9i)",
      content: "Th\u01B0a Th\u1EA7y, h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng ghi nh\u1EADn sinh vi\xEAn Nguy\u1EC5n V\u0103n A thu\u1ED9c L\u1EDBp C24A.TH1 ch\u01B0a n\u1ED9p B\xE1o c\xE1o tu\u1EA7n 5 (H\u1EA1n ch\xF3t: 23:59 ng\xE0y 28/10). Vui l\xF2ng g\u1EEDi th\xF4ng b\xE1o nh\u1EAFc nh\u1EDF ho\u1EB7c li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp sinh vi\xEAn qua email / \u0111i\u1EC7n tho\u1EA1i.",
      attachments: ["BaoCao_Tuan4_NguyenVanA.pdf"]
    },
    {
      id: "2",
      title: "Doanh nghi\u1EC7p FPT x\xE1c nh\u1EADn ti\u1EBFp nh\u1EADn sinh vi\xEAn",
      desc: "FPT Software \u0111\xE3 k\xFD x\xE1c nh\u1EADn ti\u1EBFp nh\u1EADn 6 sinh vi\xEAn nh\xF3m h\u01B0\u1EDBng d\u1EABn.",
      type: "enterprise",
      priority: "Quan tr\u1ECDng",
      color: "amber",
      isUnread: true,
      time: "09:30 - H\xF4m nay",
      sender: "Ph\xF2ng Nh\xE2n s\u1EF1 - FPT Software",
      receiver: "Gi\u1EA3ng vi\xEAn Tr\u1EA7n Minh Huy",
      company: "FPT Software (H\xE0 N\u1ED9i)",
      student: "6 sinh vi\xEAn nh\xF3m C24A.TH1",
      content: "K\xEDnh g\u1EEDi Th\u1EA7y Tr\u1EA7n Minh Huy, C\xF4ng ty FPT Software xin th\xF4ng b\xE1o \u0111\xE3 ti\u1EBFp nh\u1EADn th\xE0nh c\xF4ng 6 sinh vi\xEAn do Th\u1EA7y h\u01B0\u1EDBng d\u1EABn v\xE0o c\xE1c v\u1ECB tr\xED Th\u1EF1c t\u1EADp sinh Fullstack v\xE0 React Frontend. H\u1EE3p \u0111\u1ED3ng \u0111\xE0o t\u1EA1o v\xE0 k\u1EBF ho\u1EA1ch c\xF4ng vi\u1EC7c chi ti\u1EBFt \u0111\xEDnh k\xE8m b\xEAn d\u01B0\u1EDBi.",
      attachments: ["HopDong_TiepNhan_FPT_2026.pdf", "DanhSach_SinhVien_FPT.xlsx"]
    },
    {
      id: "3",
      title: "B\xE1o c\xE1o gi\u1EEFa k\u1EF3 c\u1EE7a Tr\u1EA7n V\u0103n B \u0111\xE3 \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t",
      desc: "\u0110\xE3 ho\xE0n t\u1EA5t \u0111\xE1nh gi\xE1 b\xE0i n\u1ED9p gi\u1EEFa k\u1EF3 v\u1EDBi m\u1EE9c \u0111i\u1EC3m 9.0/10.",
      type: "student",
      priority: "Th\xF4ng th\u01B0\u1EDDng",
      color: "emerald",
      isUnread: false,
      time: "16:45 - H\xF4m qua",
      sender: "Gi\u1EA3ng vi\xEAn Tr\u1EA7n Minh Huy",
      receiver: "Tr\u1EA7n V\u0103n B (MSSV: 20120002)",
      student: "Tr\u1EA7n V\u0103n B (MSSV: 20120002)",
      company: "Viettel Telecom",
      content: "B\xE0i n\u1ED9p B\xE1o c\xE1o Gi\u1EEFa k\u1EF3 c\u1EE7a sinh vi\xEAn Tr\u1EA7n V\u0103n B \u0111\u1EA1t ch\u1EA5t l\u01B0\u1EE3ng r\u1EA5t t\u1ED1t. \u0110\u1EC1 t\xE0i ph\xE1t tri\u1EC3n h\u1EC7 th\u1ED1ng microservices \u0111\u01B0\u1EE3c gi\u1EA3ng vi\xEAn v\xE0 c\xE1n b\u1ED9 k\u1EF9 thu\u1EADt Viettel \u0111\xE1nh gi\xE1 cao. \u0110\xE3 duy\u1EC7t b\xE1o c\xE1o chuy\u1EC3n sang giai \u0111o\u1EA1n 2.",
      attachments: ["PhieuDanhGia_GiuaKy_TranVanB.pdf"]
    },
    {
      id: "4",
      title: "C\xF3 bi\u1EC3u m\u1EABu \u0111\xE1nh gi\xE1 doanh nghi\u1EC7p m\u1EDBi \u0111\u01B0\u1EE3c t\u1EA3i l\xEAn",
      desc: "Khoa CNTT v\u1EEBa ph\xE1t h\xE0nh bi\u1EC3u m\u1EABu BM-04 \u0110\xE1nh gi\xE1 th\u1EF1c t\u1EADp 2026.",
      type: "system",
      priority: "Th\xF4ng th\u01B0\u1EDDng",
      color: "blue",
      isUnread: false,
      time: "26/10/2026",
      sender: "V\u0103n ph\xF2ng Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      receiver: "To\xE0n b\u1ED9 Gi\u1EA3ng vi\xEAn H\u01B0\u1EDBng d\u1EABn",
      content: "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin v\u1EEBa c\u1EADp nh\u1EADt bi\u1EC3u m\u1EABu BM-04 (Phi\u1EBFu \u0111\xE1nh gi\xE1 d\xE0nh cho C\xE1n b\u1ED9 h\u01B0\u1EDBng d\u1EABn Doanh nghi\u1EC7p \u0111\u1EE3t H\u1ECDc k\u1EF3 I - 2026). \u0110\u1EC1 ngh\u1ECB c\xE1c Th\u1EA7y/C\xF4 g\u1EEDi bi\u1EC3u m\u1EABu n\xE0y cho \u0111\u1EA1i di\u1EC7n doanh nghi\u1EC7p \u0111\u1EC3 l\u1EA5y ph\u1EA3n h\u1ED3i ch\xEDnh th\u1EE9c tr\u01B0\u1EDBc tu\u1EA7n 12.",
      attachments: ["BM04_DanhGia_DoanhNghiep_2026.docx"]
    },
    {
      id: "5",
      title: "H\u1EC7 th\u1ED1ng s\u1EBD \u0111\xF3ng \u0111\u1EE3t th\u1EF1c t\u1EADp H\u1ECDc k\u1EF3 I sau 3 ng\xE0y",
      desc: "H\u1EA1n ch\xF3t nh\u1EADp \u0111i\u1EC3m k\u1EBFt th\xFAc \u0111\u1EE3t l\xE0 23:59 ng\xE0y 30/10/2026.",
      type: "system",
      priority: "Kh\u1EA9n c\u1EA5p",
      color: "slate",
      isUnread: false,
      time: "25/10/2026",
      sender: "H\u1EC7 th\u1ED1ng Qu\u1EA3n l\xFD \u0110\xE0o t\u1EA1o",
      receiver: "Gi\u1EA3ng vi\xEAn Tr\u1EA7n Minh Huy",
      content: "Nh\u1EAFc nh\u1EDF t\u1EF1 \u0111\u1ED9ng t\u1EEB C\u1ED5ng \u0110\xE0o t\u1EA1o: \u0110\u1EE3t th\u1EF1c t\u1EADp H\u1ECDc k\u1EF3 I - 2026 s\u1EBD ch\xEDnh th\u1EE9c kh\xF3a s\u1ED5 nh\u1EADp \u0111i\u1EC3m v\xE0o 23:59 ng\xE0y 30/10/2026. \u0110\u1EC1 ngh\u1ECB Gi\u1EA3ng vi\xEAn ho\xE0n t\u1EA5t ch\u1EA5m \u0111i\u1EC3m ti\xEAu chu\u1EA9n v\xE0 ph\xEA duy\u1EC7t b\xE1o c\xE1o tr\u01B0\u1EDBc th\u1EDDi h\u1EA1n.",
      attachments: []
    }
  ]);
  const [selectedNotif, setSelectedNotif] = useState(notifications[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("T\u1EA5t c\u1EA3");
  const [sortBy, setSortBy] = useState("newest");
  const [isAiPanelExpanded, setIsAiPanelExpanded] = useState(false);
  const [scheduledList, setScheduledList] = useState([
    {
      id: "s1",
      title: "Nh\u1EAFc nh\u1EDF n\u1ED9p B\xE1o c\xE1o Tu\u1EA7n 6 \u0111\u1EE3t HK I - 2026",
      audience: "To\xE0n b\u1ED9 sinh vi\xEAn L\u1EDBp C24A.TH1 (28 SV)",
      scheduleTime: "08:00 - 02/11/2026",
      priority: "Quan tr\u1ECDng",
      status: "\u0110\xE3 l\xEAn l\u1ECBch"
    },
    {
      id: "s2",
      title: "Y\xEAu c\u1EA7u doanh nghi\u1EC7p x\xE1c nh\u1EADn phi\u1EBFu \u0111\xE1nh gi\xE1 cu\u1ED1i \u0111\u1EE3t",
      audience: "6 Doanh nghi\u1EC7p h\u1EE3p t\xE1c",
      scheduleTime: "09:00 - 05/11/2026",
      priority: "Kh\u1EA9n c\u1EA5p",
      status: "\u0110ang ch\u1EDD g\u1EEDi"
    }
  ]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTitle, setComposeTitle] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeAudience, setComposeAudience] = useState("To\xE0n b\u1ED9 sinh vi\xEAn");
  const [composePriority, setComposePriority] = useState("Th\xF4ng th\u01B0\u1EDDng");
  const [isScheduledOption, setIsScheduledOption] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3e3);
  };
  const openComposeWithAudience = (audience, titlePrefix) => {
    setComposeAudience(audience);
    setComposeTitle(titlePrefix);
    setComposeOpen(true);
  };
  const handleToggleRead = (id, e) => {
    e?.stopPropagation();
    setNotifications(
      (prev) => prev.map((n) => n.id === id ? { ...n, isUnread: !n.isUnread } : n)
    );
    if (selectedNotif.id === id) {
      setSelectedNotif((prev) => ({ ...prev, isUnread: !prev.isUnread }));
    }
  };
  const handleDeleteNotif = (id, e) => {
    e?.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    if (selectedNotif.id === id && updated.length > 0) {
      setSelectedNotif(updated[0]);
    }
    showToast("\u0110\xE3 x\xF3a th\xF4ng b\xE1o kh\u1ECFi danh s\xE1ch.");
  };
  const handleSendCompose = (e) => {
    e.preventDefault();
    if (!composeTitle.trim() || !composeContent.trim()) {
      alert("Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 ti\xEAu \u0111\u1EC1 v\xE0 n\u1ED9i dung th\xF4ng b\xE1o!");
      return;
    }
    if (isScheduledOption) {
      const newScheduled = {
        id: `s_${Date.now()}`,
        title: composeTitle,
        audience: composeAudience,
        scheduleTime: scheduledDate || "08:00 - Ng\xE0y mai",
        priority: composePriority,
        status: "\u0110\xE3 l\xEAn l\u1ECBch"
      };
      setScheduledList([newScheduled, ...scheduledList]);
      showToast(`\u0110\xE3 l\xEAn l\u1ECBch g\u1EEDi th\xF4ng b\xE1o cho ${composeAudience} th\xE0nh c\xF4ng!`);
    } else {
      const newNotif = {
        id: `n_${Date.now()}`,
        title: composeTitle,
        desc: composeContent.substring(0, 70) + "...",
        type: composePriority === "Kh\u1EA9n c\u1EA5p" ? "urgent" : "student",
        priority: composePriority,
        color: composePriority === "Kh\u1EA9n c\u1EA5p" ? "rose" : composePriority === "Quan tr\u1ECDng" ? "amber" : "blue",
        isUnread: false,
        time: "V\u1EEBa xong",
        sender: "Gi\u1EA3ng vi\xEAn Tr\u1EA7n Minh Huy",
        receiver: composeAudience,
        content: composeContent
      };
      setNotifications([newNotif, ...notifications]);
      setSelectedNotif(newNotif);
      showToast(`\u0110\xE3 g\u1EEDi th\xF4ng b\xE1o cho ${composeAudience} th\xE0nh c\xF4ng!`);
    }
    setComposeOpen(false);
    setComposeTitle("");
    setComposeContent("");
    setIsScheduledOption(false);
  };
  const filteredNotifications = notifications.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) || n.sender.toLowerCase().includes(q) || n.student && n.student.toLowerCase().includes(q) || n.company && n.company.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filterType === "Ch\u01B0a \u0111\u1ECDc") return n.isUnread;
    if (filterType === "\u0110\xE3 \u0111\u1ECDc") return !n.isUnread;
    if (filterType === "Kh\u1EA9n c\u1EA5p") return n.priority === "Kh\u1EA9n c\u1EA5p";
    if (filterType === "H\u1EC7 th\u1ED1ng") return n.type === "system";
    if (filterType === "Sinh vi\xEAn") return n.type === "student" || n.student;
    if (filterType === "Doanh nghi\u1EC7p") return n.type === "enterprise" || n.company;
    return true;
  }).sort((a, b) => {
    if (sortBy === "oldest") return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });
  const todayCount = notifications.filter((n) => n.time.includes("H\xF4m nay")).length;
  const unreadCount = notifications.filter((n) => n.isUnread).length;
  const sentCount = 28;
  const readCount = 24;
  return <div className="space-y-6 animate-in fade-in duration-200 pb-12 font-sans min-w-0 max-w-full overflow-hidden">
      {
    /* Toast Alert */
  }
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      {
    /* PAGE HEADER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-w-0 max-w-full overflow-hidden">
        <div className="min-w-0 max-w-full">
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight truncate">
              Trung tâm Thông báo &amp; Trao đổi
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
            Quản lý thông báo, nhắc nhở và trao đổi với sinh viên và doanh nghiệp trong quá trình thực tập.
          </p>
        </div>

        {
    /* TOP QUICK ACTION BUTTONS */
  }
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
    onClick={() => setComposeOpen(true)}
    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
  >
            <Plus className="w-4 h-4" />
            <span>Soạn thông báo</span>
          </button>

          <button
    onClick={() => openComposeWithAudience("Theo sinh vi\xEAn", "Nh\u1EAFc nh\u1EDF c\xE1 nh\xE2n: ")}
    className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5"
  >
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>Nhắc nhở SV</span>
          </button>

          <button
    onClick={() => openComposeWithAudience("To\xE0n b\u1ED9 sinh vi\xEAn", "Th\xF4ng b\xE1o L\u1EDBp h\u01B0\u1EDBng d\u1EABn: ")}
    className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
  >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Thông báo toàn lớp HD</span>
          </button>
        </div>
      </div>

      {
    /* 4 SYNCHRONIZED TOP METRIC CARDS */
  }
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {
    /* 1. THÔNG BÁO HÔM NAY */
  }
        <div
    onClick={() => {
      setSearchQuery("");
      setFilterType("T\u1EA5t c\u1EA3");
    }}
    className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">
              Thông báo hôm nay
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">0{todayCount}</span>
            <span className="text-xs font-bold text-slate-400">tin mới</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">Cập nhật liên tục trong ngày</span>
        </div>

        {
    /* 2. CHƯA ĐỌC */
  }
        <div
    onClick={() => setFilterType("Ch\u01B0a \u0111\u1ECDc")}
    className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
              Chưa đọc / Cần xem
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-800">0{unreadCount}</span>
            <span className="text-xs font-bold text-amber-600">thông báo</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Cần sinh viên phản hồi</span>
        </div>

        {
    /* 3. SINH VIÊN HƯỚNG DẪN */
  }
        <div
    onClick={() => setFilterType("Sinh vi\xEAn")}
    className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
              Sinh viên HD tiếp nhận
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800">28</span>
            <span className="text-xs font-bold text-emerald-600">sinh viên</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">Thuộc phân bổ giảng viên</span>
        </div>

        {
    /* 4. KHẨN CẤP / CẦN XỬ LÝ */
  }
        <div
    onClick={() => setFilterType("Kh\u1EA9n c\u1EA5p")}
    className="bg-gradient-to-br from-rose-50/80 via-white to-pink-50/40 p-4 rounded-2xl border border-rose-200/80 border-l-4 border-l-rose-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1.5"
  >
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[10px] font-extrabold uppercase text-rose-800 tracking-wider">
              Khẩn cấp / Nhắc nhở
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 border border-rose-200/60 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-800">
              {notifications.filter((n) => n.priority === "Kh\u1EA9n c\u1EA5p").length}
            </span>
            <span className="text-xs font-bold text-rose-600">nhắc nhở</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold block">Cần xử lý trễ hạn &amp; Nộp bài</span>
        </div>
      </section>

      {
    /* SEARCH AND SYNCHRONIZED FILTERS BAR */
  }
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {
    /* Header Section Label */
  }
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              Hộp thư &amp; Bộ lọc tìm kiếm thông báo
            </h2>
          </div>

          {(searchQuery || filterType !== "T\u1EA5t c\u1EA3" || sortBy !== "newest") && <button
    onClick={() => {
      setSearchQuery("");
      setFilterType("T\u1EA5t c\u1EA3");
      setSortBy("newest");
    }}
    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
  >
              Xóa bộ lọc
            </button>}
        </div>

        {
    /* Filter inputs in 1 neat row */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {
    /* Search Box */
  }
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Tìm thông báo, tên sinh viên..."
    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
  />
          </div>

          <div>
            <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="Tất cả">Tất cả Phân loại</option>
              <option value="Chưa đọc">Chưa đọc</option>
              <option value="Đã đọc">Đã đọc</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
              <option value="Sinh viên">Sinh viên HD</option>
              <option value="Hệ thống">Hệ thống</option>
            </select>
          </div>

          <div>
            <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="newest">Thứ tự: Mới nhất</option>
              <option value="oldest">Thứ tự: Cũ nhất</option>
            </select>
          </div>

          <div>
            <select
    defaultValue="HK I - 2026"
    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 text-[11px]"
  >
              <option value="HK I - 2026">Đợt: HK I - 2026</option>
              <option value="HK II - 2025">Đợt: HK II - 2025</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* CORE 2-COLUMN LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {
    /* LEFT COLUMN: NOTIFICATION LIST (5 cols) */
  }
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Danh sách thông báo ({filteredNotifications.length})
            </span>
            {unreadCount > 0 && <button
    onClick={() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      showToast("\u0110\xE3 \u0111\xE1nh d\u1EA5u t\u1EA5t c\u1EA3 th\xF4ng b\xE1o l\xE0 \u0111\xE3 \u0111\u1ECDc.");
    }}
    className="text-[11px] text-blue-600 hover:underline font-bold"
  >
                Đánh dấu tất cả đã đọc
              </button>}
          </div>

          {filteredNotifications.length === 0 ? (
    /* EMPTY STATE */
    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-slate-800 text-sm">Không có thông báo mới</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Không tìm thấy thông báo phù hợp với bộ lọc hoặc từ khóa tìm kiếm của bạn.
              </p>
              <button
      onClick={() => {
        setSearchQuery("");
        setFilterType("T\u1EA5t c\u1EA3");
      }}
      className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100"
    >
                Xóa bộ lọc
              </button>
            </div>
  ) : <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredNotifications.map((notif) => {
    const isSelected = selectedNotif.id === notif.id;
    return <div
      key={notif.id}
      onClick={() => {
        setSelectedNotif(notif);
        if (notif.isUnread) handleToggleRead(notif.id);
      }}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative space-y-2 ${isSelected ? "bg-blue-50/90 border-blue-400 shadow-xs" : notif.isUnread ? "bg-white border-blue-200 shadow-2xs font-medium hover:border-blue-300" : "bg-white border-slate-200/80 opacity-90 hover:opacity-100 hover:border-slate-300"}`}
    >
                    {
      /* Unread pulsing indicator */
    }
                    {notif.isUnread && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute top-3.5 right-3.5 animate-pulse" />}

                    <div className="flex items-start gap-2.5 pr-4">
                      {
      /* Priority Icon */
    }
                      <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${notif.color === "rose" ? "bg-rose-100 text-rose-600" : notif.color === "amber" ? "bg-amber-100 text-amber-700" : notif.color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
    >
                        {notif.priority === "Kh\u1EA9n c\u1EA5p" ? <AlertTriangle className="w-4 h-4" /> : notif.type === "enterprise" ? <Building2 className="w-4 h-4" /> : notif.type === "student" ? <User className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${notif.priority === "Kh\u1EA9n c\u1EA5p" ? "bg-rose-100 text-rose-700" : notif.priority === "Quan tr\u1ECDng" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}
    >
                            {notif.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
                          {notif.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                    </div>

                    {
      /* Footer Actions on Card */
    }
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[10px] text-slate-500">
                      <span className="truncate font-semibold text-slate-600">
                        {notif.student ? `SV: ${notif.student}` : `T\u1EEB: ${notif.sender}`}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
      onClick={(e) => handleToggleRead(notif.id, e)}
      className="hover:text-blue-600 transition-colors font-bold"
      title={notif.isUnread ? "\u0110\xE1nh d\u1EA5u \u0111\xE3 \u0111\u1ECDc" : "\u0110\xE1nh d\u1EA5u ch\u01B0a \u0111\u1ECDc"}
    >
                          {notif.isUnread ? "\u0110\xE3 \u0111\u1ECDc" : "Ch\u01B0a \u0111\u1ECDc"}
                        </button>
                        <button
      onClick={(e) => handleDeleteNotif(notif.id, e)}
      className="hover:text-rose-600 transition-colors"
      title="Xóa thông báo"
    >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>;
  })}
            </div>}
        </div>

        {
    /* RIGHT COLUMN: NOTIFICATION DETAIL (7 cols) */
  }
        <div className="lg:col-span-7 space-y-4">
          {selectedNotif ? <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              {
    /* DETAIL HEADER */
  }
              <div className="pb-4 border-b border-slate-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
    className={`px-2.5 py-1 rounded-lg text-xs font-black ${selectedNotif.priority === "Kh\u1EA9n c\u1EA5p" ? "bg-rose-100 text-rose-800 border border-rose-200" : selectedNotif.priority === "Quan tr\u1ECDng" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-blue-100 text-blue-800 border border-blue-200"}`}
  >
                      Mức độ: {selectedNotif.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{selectedNotif.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
    onClick={() => handleToggleRead(selectedNotif.id)}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
  >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{selectedNotif.isUnread ? "\u0110\xE3 \u0111\u1ECDc" : "Ch\u01B0a \u0111\u1ECDc"}</span>
                    </button>

                    <button
    onClick={() => handleDeleteNotif(selectedNotif.id)}
    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
  >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedNotif.title}
                </h2>

                {
    /* SENDER & RECEIVER METADATA */
  }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Người gửi:</span>
                    <span className="text-slate-900 font-extrabold">{selectedNotif.sender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Đối tượng nhận:</span>
                    <span className="text-blue-700 font-extrabold">{selectedNotif.receiver}</span>
                  </div>
                  {selectedNotif.student && <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Sinh viên liên quan:</span>
                      <span className="text-slate-800 font-bold">{selectedNotif.student}</span>
                    </div>}
                  {selectedNotif.company && <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Doanh nghiệp tiếp nhận:</span>
                      <span className="text-emerald-700 font-bold">{selectedNotif.company}</span>
                    </div>}
                </div>
              </div>

              {
    /* NOTIFICATION CONTENT */
  }
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Nội dung chi tiết thông báo
                </h4>
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 text-slate-800 text-xs leading-relaxed whitespace-pre-line font-medium">
                  {selectedNotif.content}
                </div>
              </div>

              {
    /* ATTACHMENTS */
  }
              {selectedNotif.attachments && selectedNotif.attachments.length > 0 && <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    File tài liệu đính kèm ({selectedNotif.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotif.attachments.map((file, idx) => <div
    key={idx}
    className="px-3 py-2 bg-blue-50/90 border border-blue-200 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
    onClick={() => showToast(`\u0110ang t\u1EA3i xu\u1ED1ng t\xE0i li\u1EC7u ${file}...`)}
  >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>{file}</span>
                      </div>)}
                  </div>
                </div>}

              {
    /* DETAIL ACTION BUTTONS */
  }
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
    onClick={() => openComposeWithAudience(selectedNotif.sender, `Ph\u1EA3n h\u1ED3i: ${selectedNotif.title}`)}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
                  <Send className="w-4 h-4" />
                  <span>Trả lời / Phản hồi</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
    onClick={() => showToast("\u0110\xE3 sao ch\xE9p li\xEAn k\u1EBFt th\xF4ng b\xE1o.")}
    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>
            </div> : <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
              Chọn một thông báo ở danh sách bên trái để xem nội dung chi tiết.
            </div>}
        </div>
      </div>

      {
    /* SECTION 5: SCHEDULED NOTIFICATIONS TABLE */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Danh sách Thông báo đã lên lịch gửi</h3>
              <p className="text-xs text-slate-500">Các thông báo tự động phát theo lịch đặt trước cho sinh viên / doanh nghiệp</p>
            </div>
          </div>
          <button
    onClick={() => {
      setIsScheduledOption(true);
      setComposeOpen(true);
    }}
    className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 flex items-center gap-1"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch gửi mới</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Tiêu đề thông báo</th>
                <th className="p-3">Đối tượng nhận</th>
                <th className="p-3">Thời gian phát sóng</th>
                <th className="p-3">Mức ưu tiên</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {scheduledList.map((item) => <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{item.title}</td>
                  <td className="p-3 text-blue-700 font-semibold">{item.audience}</td>
                  <td className="p-3 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.scheduleTime}</span>
                  </td>
                  <td className="p-3">
                    <span
    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${item.priority === "Kh\u1EA9n c\u1EA5p" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}
  >
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[10px] rounded-full border border-blue-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
    onClick={() => showToast(`\u0110ang ch\u1EC9nh s\u1EEDa l\u1ECBch g\u1EEDi "${item.title}"...`)}
    className="p-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
    title="Chỉnh sửa lịch gửi"
  >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
    onClick={() => {
      setScheduledList(scheduledList.filter((s) => s.id !== item.id));
      showToast("\u0110\xE3 h\u1EE7y l\u1ECBch g\u1EEDi th\xF4ng b\xE1o.");
    }}
    className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
    title="Hủy lịch gửi"
  >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* SECTION 7: TIMELINE - RECENT NOTIFICATION ACTIVITY */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Nhật ký Hoạt động Thông báo Gần đây (Timeline)
          </h3>
          <span className="text-xs font-bold text-slate-400">Hôm nay</span>
        </div>

        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
          {[
    {
      time: "09:20",
      text: "\u0110\xE3 ph\xE1t th\xF4ng b\xE1o nh\u1EAFc n\u1ED9p b\xE1o c\xE1o cho to\xE0n b\u1ED9 28 sinh vi\xEAn L\u1EDBp C24A.TH1.",
      icon: "bg-blue-500"
    },
    {
      time: "10:10",
      text: "Sinh vi\xEAn Nguy\u1EC5n V\u0103n A \u0111\xE3 m\u1EDF v\xE0 t\u01B0\u01A1ng t\xE1c v\u1EDBi th\xF4ng b\xE1o nh\u1EAFc nh\u1EDF.",
      icon: "bg-emerald-500"
    },
    {
      time: "13:40",
      text: "\u0110\u1EA1i di\u1EC7n Doanh nghi\u1EC7p FPT Software ph\u1EA3n h\u1ED3i x\xE1c nh\u1EADn danh s\xE1ch sinh vi\xEAn th\u1EF1c t\u1EADp.",
      icon: "bg-amber-500"
    },
    {
      time: "15:15",
      text: "H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng g\u1EEDi email nh\u1EAFc nh\u1EDF cho 3 sinh vi\xEAn qu\xE1 h\u1EA1n gi\u1EEFa k\u1EF3.",
      icon: "bg-indigo-500"
    }
  ].map((act, idx) => <div key={idx} className="relative flex items-start gap-3">
              <span
    className={`w-3 h-3 rounded-full ${act.icon} border-2 border-white absolute -left-6 top-1 shadow-2xs`}
  />
              <div>
                <span className="font-extrabold text-slate-900 mr-2">{act.time}</span>
                <span className="text-slate-600 font-medium">{act.text}</span>
              </div>
            </div>)}
        </div>
      </div>

      {
    /* SECTION 4: COMPOSE NOTIFICATION DIALOG (MODAL) */
  }
      {composeOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
    onSubmit={handleSendCompose}
    className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
  >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Soạn &amp; Gửi Thông báo Mới</h3>
              </div>
              <button
    type="button"
    onClick={() => setComposeOpen(false)}
    className="text-slate-400 hover:text-slate-600 p-1"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
    type="text"
    required
    placeholder="Nhập tiêu đề thông báo..."
    value={composeTitle}
    onChange={(e) => setComposeTitle(e.target.value)}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-900"
  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đối tượng nhận *</label>
                  <select
    value={composeAudience}
    onChange={(e) => setComposeAudience(e.target.value)}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-800"
  >
                    <option value="Toàn bộ sinh viên">Toàn bộ sinh viên HD (28 SV)</option>
                    <option value="Theo lớp">Theo lớp hướng dẫn (Lớp C24A.TH1)</option>
                    <option value="Theo sinh viên">Theo sinh viên cụ thể</option>
                    <option value="Sinh viên chưa nộp báo cáo tuần 5">Sinh viên chưa nộp báo cáo tuần</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức độ ưu tiên *</label>
                  <select
    value={composePriority}
    onChange={(e) => setComposePriority(e.target.value)}
    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-800"
  >
                    <option value="Thông thường">Thông thường</option>
                    <option value="Quan trọng">Quan trọng</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600 font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Gửi thông báo trực tiếp tới app của sinh viên thuộc phân bổ. Nhắc: Liên hệ Doanh nghiệp/Mentor qua email hoặc trao đổi trực tiếp.</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung thông báo *</label>
                <textarea
    rows={5}
    required
    placeholder="Nhập nội dung chi tiết thông báo gửi sinh viên hướng dẫn..."
    value={composeContent}
    onChange={(e) => setComposeContent(e.target.value)}
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 leading-relaxed"
  />
              </div>

              {
    /* Schedule Checkbox option */
  }
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-900 text-xs">
                  <input
    type="checkbox"
    checked={isScheduledOption}
    onChange={(e) => setIsScheduledOption(e.target.checked)}
    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
  />
                  <span>Lên lịch phát thông báo tự động</span>
                </label>

                {isScheduledOption && <div className="pt-2 animate-in fade-in">
                    <label className="block font-bold text-slate-700 mb-1">Thời gian phát sóng dự kiến</label>
                    <input
    type="text"
    placeholder="VD: 08:00 - 02/11/2026"
    value={scheduledDate}
    onChange={(e) => setScheduledDate(e.target.value)}
    className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-medium text-slate-800"
  />
                  </div>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
    type="button"
    onClick={() => {
      showToast("\u0110\xE3 l\u01B0u b\u1EA3n nh\xE1p th\xF4ng b\xE1o.");
      setComposeOpen(false);
    }}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
  >
                Lưu nháp
              </button>

              <div className="flex items-center gap-2">
                <button
    type="button"
    onClick={() => setComposeOpen(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
  >
                  Hủy
                </button>
                <button
    type="submit"
    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
  >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isScheduledOption ? "L\xEAn l\u1ECBch g\u1EEDi" : "G\u1EEDi th\xF4ng b\xE1o ngay"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>}
    </div>;
};
export { AccountView } from './AccountView';
