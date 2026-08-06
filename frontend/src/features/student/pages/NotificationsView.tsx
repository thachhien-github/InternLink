import { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Search,
  FileText,
  MessageSquare,
  Building2,
  Download,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Pin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
export const NotificationsView = ({
  onShowToast,
  onNavigate
}) => {
  const [activeFilter, setActiveFilter] = useState("T\u1EA5t c\u1EA3");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedNotifId, setSelectedNotifId] = useState("notif-101");
  const [selectedModalNotif, setSelectedModalNotif] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-101",
      title: "Gi\u1EA3ng vi\xEAn \u0111\xE3 ph\u1EA3n h\u1ED3i B\xE1o c\xE1o tu\u1EA7n 5",
      description: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc \u0111\xE3 ghi nh\u1EADn nh\u1EADn x\xE9t v\u1EC1 s\u01A1 \u0111\u1ED3 UML Use Case v\xE0 y\xEAu c\u1EA7u c\u1EADp nh\u1EADt b\u1EA3n v1.1 tr\u01B0\u1EDBc ng\xE0y 03/10.",
      fullContent: "Ch\xE0o em, th\u1EA7y \u0111\xE3 ki\u1EC3m tra b\xE1o c\xE1o tu\u1EA7n 5 c\u1EE7a em. Ph\u1EA7n thi\u1EBFt k\u1EBF s\u01A1 \u0111\u1ED3 Use Case v\xE0 Sequence Diagram c\u1EA7n b\u1ED5 sung th\xEAm Validation Middleware v\xE0 m\xF4 t\u1EA3 chi ti\u1EBFt b\u1EA3ng Database Transactions. Em vui l\xF2ng t\u1EA3i l\xEAn b\u1EA3n ch\u1EC9nh s\u1EEDa v1.1 t\u1EA1i m\u1EE5c Ph\u1EA3n h\u1ED3i & Ch\u1EC9nh s\u1EEDa.",
      senderName: "Th\u1EA7y Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      senderRole: "Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn",
      dateStr: "01/10/2026 14:30",
      timeAgo: "15 ph\xFAt tr\u01B0\u1EDBc",
      category: "Gi\u1EA3ng vi\xEAn",
      priority: "Kh\u1EA9n",
      isUnread: true,
      relatedModule: "Ph\u1EA3n h\u1ED3i & Ch\u1EC9nh s\u1EEDa",
      relatedTab: "student-feedback",
      attachment: {
        name: "GopY_BaoCao_Tuan5_GV.pdf",
        size: "1.2 MB",
        type: "pdf"
      }
    },
    {
      id: "notif-102",
      title: "M\u1EABu B\xE1o c\xE1o cu\u1ED1i k\u1EF3 & Slide b\u1EA3o v\u1EC7 \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt",
      description: "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin v\u1EEBa c\u1EADp nh\u1EADt bi\u1EC3u m\u1EABu b\xE1o c\xE1o ch\xEDnh th\u1EE9c v2.1 v\xE0 Slide m\u1EABu tr\xECnh b\xE0y tr\u01B0\u1EDBc H\u1ED9i \u0111\u1ED3ng.",
      fullContent: 'Th\xF4ng b\xE1o t\u1EDBi to\xE0n b\u1ED9 sinh vi\xEAn th\u1EF1c t\u1EADp K2026: Khoa CNTT \u0111\xE3 ph\xE1t h\xE0nh bi\u1EC3u m\u1EABu B\xE1o c\xE1o cu\u1ED1i k\u1EF3 ch\xEDnh th\u1EE9c (file .docx) v\xE0 Slide thuy\u1EBFt tr\xECnh b\u1EA3o v\u1EC7 (.pptx). Sinh vi\xEAn vui l\xF2ng truy c\u1EADp m\u1EE5c "Bi\u1EC3u m\u1EABu & T\xE0i li\u1EC7u" \u0111\u1EC3 t\u1EA3i v\u1EC1 v\xE0 th\u1EF1c hi\u1EC7n theo \u0111\xFAng quy \u0111\u1ECBnh.',
      senderName: "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      senderRole: "Ban Qu\u1EA3n l\xFD Th\u1EF1c t\u1EADp",
      dateStr: "01/10/2026 10:00",
      timeAgo: "4 gi\u1EDD tr\u01B0\u1EDBc",
      category: "Th\xF4ng b\xE1o Khoa",
      priority: "Quan tr\u1ECDng",
      isUnread: true,
      relatedModule: "Bi\u1EC3u m\u1EABu & T\xE0i li\u1EC7u",
      relatedTab: "student-templates",
      attachment: {
        name: "Mau_BaoCao_CuoiKy_2026_v2.1.docx",
        size: "1.8 MB",
        type: "docx"
      }
    },
    {
      id: "notif-103",
      title: "Doanh nghi\u1EC7p \u0111\xE3 x\xE1c nh\u1EADn ti\u1EBFp nh\u1EADn th\u1EF1c t\u1EADp ch\xEDnh th\u1EE9c",
      description: "C\xF4ng ty FPT Software (Mentor Tr\u1EA7n Minh T\xE2m) \u0111\xE3 duy\u1EC7t ti\u1EBFp nh\u1EADn v\xE0 c\u1EA5p t\xE0i kho\u1EA3n l\xE0m vi\u1EC7c t\u1EA1i V\u0103n ph\xF2ng.",
      fullContent: "Ch\xFAc m\u1EEBng b\u1EA1n! Doanh nghi\u1EC7p FPT Software Corporation \u0111\xE3 ho\xE0n t\u1EA5t x\xE1c nh\u1EADn ti\u1EBFp nh\u1EADn th\u1EF1c t\u1EADp v\u1ECB tr\xED Fullstack Developer. Gi\u1EA5y x\xE1c nh\u1EADn th\u1EF1c t\u1EADp ch\xEDnh th\u1EE9c \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1ED3ng b\u1ED9 v\xE0o h\u1EC7 th\u1ED1ng InternLink.",
      senderName: "FPT Software Corporation",
      senderRole: "Mentor Doanh nghi\u1EC7p",
      dateStr: "30/09/2026 16:45",
      timeAgo: "H\xF4m qua",
      category: "Doanh nghi\u1EC7p",
      priority: "B\xECnh th\u01B0\u1EDDng",
      isUnread: false,
      relatedModule: "Th\xF4ng tin Th\u1EF1c t\u1EADp",
      relatedTab: "student-internship"
    },
    {
      id: "notif-104",
      title: "S\u1EAFp \u0111\u1EBFn h\u1EA1n n\u1ED9p B\xE1o c\xE1o tu\u1EA7n 6 (C\xF2n 2 ng\xE0y)",
      description: "Nh\u1EAFc nh\u1EDF: H\u1EA1n ch\xF3t n\u1ED9p B\xE1o c\xE1o tu\u1EA7n 6 l\xE0 23:59 ng\xE0y 03/10/2026. H\xE3y ho\xE0n thi\u1EC7n file PDF v\xE0 t\u1EA3i l\xEAn \u0111\xFAng h\u1EA1n.",
      fullContent: "H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng nh\u1EAFc nh\u1EDF: B\u1EA1n c\xF2n 2 ng\xE0y n\u1EEFa \u0111\u1EC3 ho\xE0n th\xE0nh v\xE0 t\u1EA3i l\xEAn B\xE1o c\xE1o tu\u1EA7n 6. H\xE3y \u0111\u1EA3m b\u1EA3o b\xE1o c\xE1o \u0111\xE3 c\xF3 x\xE1c nh\u1EADn ti\u1EBFn \u0111\u1ED9 t\u1EEB Mentor Doanh nghi\u1EC7p v\xE0 xu\u1EA5t \u0111\u1ECBnh d\u1EA1ng PDF tr\u01B0\u1EDBc khi n\u1ED9p.",
      senderName: "H\u1EC7 th\u1ED1ng InternLink",
      senderRole: "Nh\u1EAFc nh\u1EDF T\u1EF1 \u0111\u1ED9ng",
      dateStr: "30/09/2026 08:00",
      timeAgo: "H\xF4m qua",
      category: "Deadline",
      priority: "Kh\u1EA9n",
      isUnread: true,
      relatedModule: "B\xE1o c\xE1o tu\u1EA7n",
      relatedTab: "student-weekly-reports"
    },
    {
      id: "notif-105",
      title: "B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh 100% c\xE1c b\xE1o c\xE1o tu\u1EA7n \u0111\u1EE3t 1",
      description: "Ch\xFAc m\u1EEBng b\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh \u0111\u1EA7y \u0111\u1EE7 5 tu\u1EA7n b\xE1o c\xE1o \u0111\xFAng ti\u1EBFn \u0111\u1ED9 v\xE0 nh\u1EADn \u0111\u01B0\u1EE3c \u0111\xE1nh gi\xE1 T\u1ED1t t\u1EEB Gi\u1EA3ng vi\xEAn.",
      fullContent: "H\u1EC7 th\u1ED1ng ghi nh\u1EADn b\u1EA1n \u0111\xE3 ho\xE0n t\u1EA5t 100% kh\u1ED1i l\u01B0\u1EE3ng b\xE1o c\xE1o tu\u1EA7n giai \u0111o\u1EA1n 1. T\u1EA5t c\u1EA3 b\xE0i n\u1ED9p \u0111\xE3 \u0111\u01B0\u1EE3c Gi\u1EA3ng vi\xEAn ph\xEA duy\u1EC7t \u0111\u1EA1t y\xEAu c\u1EA7u. Ti\u1EBFp t\u1EE5c duy tr\xEC phong \u0111\u1ED9 cho giai \u0111o\u1EA1n b\xE1o c\xE1o cu\u1ED1i k\u1EF3!",
      senderName: "H\u1EC7 th\u1ED1ng InternLink",
      senderRole: "Ghi nh\u1EADn Ti\u1EBFn \u0111\u1ED9",
      dateStr: "28/09/2026 18:00",
      timeAgo: "3 ng\xE0y tr\u01B0\u1EDBc",
      category: "H\u1EC7 th\u1ED1ng",
      priority: "B\xECnh th\u01B0\u1EDDng",
      isUnread: false,
      relatedModule: "B\xE1o c\xE1o tu\u1EA7n",
      relatedTab: "student-weekly-reports"
    },
    {
      id: "notif-106",
      title: "L\u1ECBch b\u1EA3o v\u1EC7 th\u1EF1c t\u1EADp t\u1ED1t nghi\u1EC7p ch\xEDnh th\u1EE9c \u0111\u1EE3t 1/2026",
      description: "Ph\xF2ng \u0110\xE0o t\u1EA1o th\xF4ng b\xE1o th\u1EDDi gian b\u1EA3o v\u1EC7 d\u1EF1 ki\u1EBFn t\u1EEB ng\xE0y 20/10/2026 \u0111\u1EBFn 25/10/2026 t\u1EA1i H\u1ED9i tr\u01B0\u1EDDng A.",
      fullContent: "Th\xF4ng b\xE1o ch\xEDnh th\u1EE9c t\u1EEB Ph\xF2ng \u0110\xE0o t\u1EA1o & Khoa CNTT: L\u1ECBch b\u1EA3o v\u1EC7 b\xE1o c\xE1o th\u1EF1c t\u1EADp t\u1ED1t nghi\u1EC7p \u0111\u1EE3t 1 n\u0103m 2026 s\u1EBD di\u1EC5n ra tr\u1EF1c ti\u1EBFp. Danh s\xE1ch h\u1ED9i \u0111\u1ED3ng v\xE0 th\u1EE9 t\u1EF1 thuy\u1EBFt tr\xECnh s\u1EBD \u0111\u01B0\u1EE3c ni\xEAm y\u1EBFt tr\u01B0\u1EDBc 5 ng\xE0y.",
      senderName: "Ph\xF2ng \u0110\xE0o t\u1EA1o & Khoa CNTT",
      senderRole: "Th\xF4ng b\xE1o Ban Qu\u1EA3n L\xFD",
      dateStr: "25/09/2026 09:30",
      timeAgo: "6 ng\xE0y tr\u01B0\u1EDBc",
      category: "Th\xF4ng b\xE1o Khoa",
      priority: "Quan tr\u1ECDng",
      isUnread: false,
      relatedModule: "Trang ch\u1EE7",
      relatedTab: "student-dashboard"
    }
  ]);
  const pinnedAnnouncements = [
    {
      id: "ann-1",
      title: "L\u1ECBch b\u1EA3o v\u1EC7 b\xE1o c\xE1o th\u1EF1c t\u1EADp \u0111\u1EE3t 1/2026 ch\xEDnh th\u1EE9c",
      source: "Khoa CNTT",
      date: "25/09/2026",
      desc: "Th\u1EDDi gian b\u1EA3o v\u1EC7 di\u1EC5n ra t\u1EEB 20/10 \u0111\u1EBFn 25/10/2026. Sinh vi\xEAn chu\u1EA9n b\u1ECB b\xE1o c\xE1o b\xECa ki\u1EBFng v\xE0 slide thuy\u1EBFt tr\xECnh.",
      badge: "L\u1ECBch b\u1EA3o v\u1EC7"
    },
    {
      id: "ann-2",
      title: "Quy \u0111\u1ECBnh \u0111\xF3ng d\u1EA5u x\xE1c nh\u1EADn t\u1EEB Doanh nghi\u1EC7p",
      source: "Ban QLTT",
      date: "20/09/2026",
      desc: "Gi\u1EA5y nh\u1EADn x\xE9t b\u1EAFt bu\u1ED9c c\xF3 ch\u1EEF k\xFD Mentor v\xE0 con d\u1EA5u m\u1ED9c \u0111\u1ECF c\u1EE7a C\xF4ng ty ti\u1EBFp nh\u1EADn.",
      badge: "Quy \u0111\u1ECBnh"
    }
  ];
  const upcomingDeadlines = [
    {
      id: "dl-1",
      daysLeft: "2 ng\xE0y",
      title: "N\u1ED9p B\xE1o c\xE1o Tu\u1EA7n 6",
      deadlineStr: "23:59 - 03/10/2026",
      tab: "student-weekly-reports"
    },
    {
      id: "dl-2",
      daysLeft: "10 ng\xE0y",
      title: "N\u1ED9p B\xE1o c\xE1o Cu\u1ED1i k\u1EF3 & Source Code",
      deadlineStr: "23:59 - 11/10/2026",
      tab: "student-submissions"
    }
  ];
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    onShowToast("\u0110\xE3 \u0111\xE1nh d\u1EA5u t\u1EA5t c\u1EA3 th\xF4ng b\xE1o l\xE0 \u0110\xE3 \u0111\u1ECDc!");
  };
  const handleMarkSingleRead = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.map((n) => {
      if (n.id === id) {
        return { ...n, isUnread: !n.isUnread };
      }
      return n;
    }));
  };
  const filteredNotifications = notifications.filter((n) => {
    let matchCat = true;
    if (activeFilter === "Ch\u01B0a \u0111\u1ECDc") matchCat = n.isUnread;
    else if (activeFilter === "\u0110\xE3 \u0111\u1ECDc") matchCat = !n.isUnread;
    else if (activeFilter === "Gi\u1EA3ng vi\xEAn") matchCat = n.category === "Gi\u1EA3ng vi\xEAn";
    else if (activeFilter === "Doanh nghi\u1EC7p") matchCat = n.category === "Doanh nghi\u1EC7p";
    else if (activeFilter === "Deadline") matchCat = n.category === "Deadline";
    else if (activeFilter === "Th\xF4ng b\xE1o Khoa") matchCat = n.category === "Th\xF4ng b\xE1o Khoa";
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.description.toLowerCase().includes(searchQuery.toLowerCase()) || n.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedNotif = notifications.find((n) => n.id === selectedNotifId) || notifications[0];
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Gi\u1EA3ng vi\xEAn":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "Doanh nghi\u1EC7p":
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case "Deadline":
        return <Clock className="w-4 h-4 text-rose-600" />;
      case "Th\xF4ng b\xE1o Khoa":
        return <Bell className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };
  const getPriorityBadge = (p) => {
    switch (p) {
      case "Kh\u1EA9n":
        return "bg-rose-100 text-rose-800 border-rose-200 font-bold";
      case "Quan tr\u1ECDng":
        return "bg-amber-100 text-amber-800 border-amber-200 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-medium";
    }
  };
  const unreadCount = notifications.filter((n) => n.isUnread).length;
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Thông báo
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              {notifications.length} thông báo
            </span>
            {unreadCount > 0 && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 font-extrabold text-[11px] rounded-full border border-amber-200">
                {unreadCount} chưa đọc
              </span>}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Cập nhật tin tức, nhắc nhở deadline và nhận xét từ Giảng viên & Doanh nghiệp.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={handleMarkAllRead}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
  >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
        </div>
      </div>

      {
    /* 2. MAIN GRID LAYOUT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {
    /* LEFT 2 COLS: NOTIFICATION LIST & SELECTED NOTIFICATION DETAIL */
  }
        <div className="lg:col-span-2 space-y-6">

          {
    /* NOTIFICATION LIST CARD */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" /> Danh sách thông báo
              </h2>

              <div className="relative w-40 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
    type="text"
    placeholder="Tìm thông báo..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs outline-none font-medium"
  />
              </div>
            </div>

            {
    /* Filter Pills */
  }
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1">
              {[
    "T\u1EA5t c\u1EA3",
    "Ch\u01B0a \u0111\u1ECDc",
    "\u0110\xE3 \u0111\u1ECDc",
    "Gi\u1EA3ng vi\xEAn",
    "Doanh nghi\u1EC7p",
    "Deadline",
    "Th\xF4ng b\xE1o Khoa"
  ].map((chip) => <button
    key={chip}
    onClick={() => {
      setActiveFilter(chip);
      setCurrentPage(1);
    }}
    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${activeFilter === chip ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
                  {chip}
                </button>)}
            </div>

            {
    /* List items */
  }
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
              {filteredNotifications.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  Không tìm thấy thông báo nào phù hợp.
                </div> : paginatedNotifications.map((n) => {
    const isSelected = selectedNotifId === n.id;
    return <div
      key={n.id}
      onClick={() => {
        setSelectedNotifId(n.id);
        if (n.isUnread) handleMarkSingleRead(n.id);
      }}
      className={`p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSelected ? "bg-blue-50/70 border-l-4 border-l-blue-600" : n.isUnread ? "bg-slate-50/80 font-bold" : "hover:bg-slate-50/50"}`}
    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                          {getCategoryIcon(n.category)}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate">{n.senderName}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-md">
                              {n.category}
                            </span>
                          </div>
                          <p className={`text-xs truncate ${isSelected ? "text-blue-900 font-bold" : "text-slate-800 font-medium"}`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{n.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className={`px-2 py-0.5 text-[10px] rounded-md border ${getPriorityBadge(n.priority)}`}>
                          {n.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {n.timeAgo}
                        </span>
                        <button
      onClick={() => setSelectedModalNotif(n)}
      className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
      title="Xem nhanh"
    >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>;
  })}
            </div>

            {
    /* Pagination */
  }
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">
                Hiển thị {paginatedNotifications.length} / {filteredNotifications.length} thông báo
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
    /* SELECTED NOTIFICATION DETAIL PANEL */
  }
          {selectedNotif && <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                    {getCategoryIcon(selectedNotif.category)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedNotif.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedNotif.senderName} ({selectedNotif.senderRole}) • {selectedNotif.dateStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 text-xs rounded-md border ${getPriorityBadge(selectedNotif.priority)}`}>
                    {selectedNotif.priority}
                  </span>
                </div>
              </div>

              {
    /* Detailed Content */
  }
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-800">
                <p className="font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                  {selectedNotif.fullContent}
                </p>

                {
    /* Attachment */
  }
                {selectedNotif.attachment && <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Tệp đính kèm:</p>
                    <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2 max-w-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-800">{selectedNotif.attachment.name}</p>
                          <p className="text-[10px] text-slate-400">{selectedNotif.attachment.size}</p>
                        </div>
                      </div>
                      <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i t\u1EC7p ${selectedNotif.attachment?.name}...`)}
    className="p-1.5 hover:bg-slate-100 text-blue-600 rounded transition-colors"
  >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>}
              </div>

              {
    /* Navigation Action */
  }
              {selectedNotif.relatedTab && <div className="flex justify-end pt-1">
                  <button
    onClick={() => {
      if (onNavigate) onNavigate(selectedNotif.relatedTab);
      else onShowToast(`Chuy\u1EC3n sang trang ${selectedNotif.relatedModule}`);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
                    <span>Xem tại mục: {selectedNotif.relatedModule}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>}
            </div>}

        </div>

        {
    /* RIGHT 1 COL: PINNED NOTICES & UPCOMING DEADLINES */
  }
        <div className="lg:col-span-1 space-y-6">

          {
    /* PINNED ANNOUNCEMENTS */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-600" /> Thông báo từ Khoa
            </h3>

            <div className="space-y-2 text-xs">
              {pinnedAnnouncements.map((ann) => <div key={ann.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 text-[10px] px-2 py-0.5 bg-amber-100 rounded">
                      {ann.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="font-bold text-slate-900">{ann.title}</p>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{ann.desc}</p>
                </div>)}
            </div>
          </div>

          {
    /* UPCOMING DEADLINES */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" /> Nhắc nhở hạn nộp
            </h3>

            <div className="space-y-2 text-xs">
              {upcomingDeadlines.map((dl) => <div key={dl.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-rose-700 text-[10px] px-2 py-0.5 bg-rose-100 rounded">
                      Còn {dl.daysLeft}
                    </span>
                    <span className="text-[10px] text-slate-400">{dl.deadlineStr}</span>
                  </div>
                  <p className="font-bold text-slate-900">{dl.title}</p>
                  {onNavigate && <button
    onClick={() => onNavigate(dl.tab)}
    className="w-full mt-1.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
  >
                      <span>Nộp ngay</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>}
                </div>)}
            </div>
          </div>

        </div>

      </div>

      {
    /* QUICK VIEW MODAL */
  }
      {selectedModalNotif && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 relative">
            <button
    onClick={() => setSelectedModalNotif(null)}
    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
  >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                {getCategoryIcon(selectedModalNotif.category)}
              </div>
              <div className="min-w-0 pr-6 space-y-1">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityBadge(selectedModalNotif.priority)}`}>
                  {selectedModalNotif.priority}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedModalNotif.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Đăng bởi: {selectedModalNotif.senderName} ({selectedModalNotif.senderRole})</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Nội dung chi tiết:</p>
                <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                  {selectedModalNotif.fullContent}
                </p>
              </div>

              {selectedModalNotif.attachment && <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Tệp đính kèm:</p>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">{selectedModalNotif.attachment.name}</span>
                    <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i t\u1EC7p ${selectedModalNotif.attachment?.name}...`)}
    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
  >
                      <Download className="w-3 h-3" /> Tải về
                    </button>
                  </div>
                </div>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
    onClick={() => setSelectedModalNotif(null)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
  >
                Đóng
              </button>

              {selectedModalNotif.relatedTab && <button
    onClick={() => {
      if (onNavigate) onNavigate(selectedModalNotif.relatedTab);
      setSelectedModalNotif(null);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
  >
                  <span>Chuyển tới trang liên quan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>}
            </div>
          </div>
        </div>}

    </div>;
};

export { NotificationsView as StudentNotificationsView };
