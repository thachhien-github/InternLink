import { useState, useMemo } from 'react';
import {
  Bell,
  Send,
  Calendar,
  Clock,
  FileText,
  Paperclip,
  Users,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Search,
  Trash2,
  Copy,
  RefreshCw,
  BarChart3,
  Activity,
  Layers,
  ShieldAlert,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  Radio,
  CalendarClock,
  FileCheck,
  CheckCheck,
  Server
} from 'lucide-react';
export const NotificationsView = ({
  onShowToast,
  onNavigateTab
}) => {
  const [notifications, setNotifications] = useState([
    {
      id: "TB-2026-089",
      title: "Kh\u1EA9n: Y\xEAu c\u1EA7u c\u1EADp nh\u1EADt B\xE1o c\xE1o Th\u1EF1c t\u1EADp Tu\u1EA7n 8 tr\u01B0\u1EDBc 17:00",
      content: "T\u1EA5t c\u1EA3 sinh vi\xEAn K20 \u0111ang tham gia th\u1EF1c t\u1EADp t\u1EA1i doanh nghi\u1EC7p b\u1EAFt bu\u1ED9c ho\xE0n t\u1EA5t vi\u1EC7c n\u1ED9p b\xE1o c\xE1o ti\u1EBFn \u0111\u1ED9 tu\u1EA7n 8 l\xEAn h\u1EC7 th\u1ED1ng InternLink \u0111\u1EC3 Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn ch\u1EA5m \u0111i\u1EC3m \u0111\xFAng h\u1EA1n.",
      type: "Kh\u1EA9n c\u1EA5p",
      priority: "urgent",
      audienceType: "student",
      audienceLabel: "To\xE0n b\u1ED9 Sinh vi\xEAn K20 (1,280 SV)",
      recipientCount: 1280,
      sentAt: "02/08/2026 08:30",
      createdAt: "02/08/2026 08:15",
      createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      status: "sent",
      readCount: 1142,
      totalRecipients: 1280,
      attachmentName: "Quy_Dinh_Nop_Bao_Cao_T8.pdf",
      attachmentSize: "1.2 MB"
    },
    {
      id: "TB-2026-088",
      title: "Th\xF4ng b\xE1o L\u1ECBch h\u1ECDp H\u1ED9i \u0111\u1ED3ng \u0110\xE1nh gi\xE1 Th\u1EF1c t\u1EADp HK2 (2025-2026)",
      content: "K\xEDnh g\u1EEDi Qu\xFD Th\u1EA7y/C\xF4 Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn, Ban Khoa CNTT tr\xE2n tr\u1ECDng k\xEDnh m\u1EDDi Th\u1EA7y/C\xF4 tham d\u1EF1 bu\u1ED5i h\u1ECDp r\xE0 so\xE1t k\u1EBFt qu\u1EA3 \u0111\xE1nh gi\xE1 th\u1EF1c t\u1EADp h\u1ECDc k\u1EF3 2.",
      type: "L\u1ECBch tr\xECnh",
      priority: "high",
      audienceType: "lecturer",
      audienceLabel: "To\xE0n b\u1ED9 Gi\u1EA3ng vi\xEAn (42 GV)",
      recipientCount: 42,
      sentAt: "01/08/2026 14:00",
      createdAt: "01/08/2026 11:20",
      createdBy: "V\u0103n ph\xF2ng Khoa (L\xEA V\u0103n An)",
      status: "sent",
      readCount: 40,
      totalRecipients: 42,
      attachmentName: "Lich_Hop_Hoi_Dong_Khoa_CNTT.pdf",
      attachmentSize: "850 KB"
    },
    {
      id: "TB-2026-087",
      title: "Nh\u1EAFc nh\u1EDF \u0110\u0103ng k\xFD Nguy\u1EC7n v\u1ECDng Doanh nghi\u1EC7p Th\u1EF1c t\u1EADp \u0110\u1EE3t 2",
      content: "H\u1EC7 th\u1ED1ng \u0111\xE3 m\u1EDF c\u1ED5ng ti\u1EBFp nh\u1EADn \u0111\u0103ng k\xFD b\u1ED5 sung nguy\u1EC7n v\u1ECDng th\u1EF1c t\u1EADp t\u1EA1i c\xE1c doanh nghi\u1EC7p \u0111\u1ED1i t\xE1c \u0111\u1EE3t 2. H\u1EA1n ch\xF3t \u0111\u0103ng k\xFD l\xE0 23:59 ng\xE0y 05/08/2026.",
      type: "H\u1ECDc t\u1EADp",
      priority: "medium",
      audienceType: "semester",
      audienceLabel: "K\u1EF3 th\u1EF1c t\u1EADp HK1 (2026-2027)",
      recipientCount: 850,
      scheduledAt: "03/08/2026 07:00",
      createdAt: "01/08/2026 16:45",
      createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      status: "scheduled",
      readCount: 0,
      totalRecipients: 850,
      attachmentName: "Danh_Sach_Doanh_Nghiep_Dot_2.xlsx",
      attachmentSize: "3.4 MB"
    },
    {
      id: "TB-2026-086",
      title: "C\u1EADp nh\u1EADt Quy ch\u1EBF \u0110\xE1nh gi\xE1 \u0110i\u1EC3m Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p n\u0103m 2026",
      content: "Tr\u01B0\u1EDDng \u0110\u1EA1i h\u1ECDc S\u01B0 ph\u1EA1m K\u1EF9 thu\u1EADt TP.HCM ban h\xE0nh quy ch\u1EBF m\u1EDBi v\u1EC1 c\u01A1 c\u1EA5u \u0111i\u1EC3m th\u1EF1c t\u1EADp: 40% Doanh nghi\u1EC7p, 30% GVHD, 30% H\u1ED9i \u0111\u1ED3ng ph\u1EA3n bi\u1EC7n.",
      type: "Quy ch\u1EBF",
      priority: "high",
      audienceType: "all",
      audienceLabel: "To\xE0n b\u1ED9 H\u1EC7 th\u1ED1ng (1,322 ng\u01B0\u1EDDi)",
      recipientCount: 1322,
      sentAt: "30/07/2026 09:00",
      createdAt: "29/07/2026 15:10",
      createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      status: "sent",
      readCount: 1285,
      totalRecipients: 1322,
      attachmentName: "Quy_Che_Danh_Gia_2026_HCMUTE.pdf",
      attachmentSize: "2.1 MB"
    },
    {
      id: "TB-2026-085",
      title: "B\u1EA3o tr\xEC H\u1EC7 th\u1ED1ng C\u1ED5ng th\xF4ng tin InternLink ng\xE0y 08/08",
      content: "H\u1EC7 th\u1ED1ng InternLink s\u1EBD t\u1EA1m ng\u1EEBng ho\u1EA1t \u0111\u1ED9ng t\u1EEB 00:00 \u0111\u1EBFn 04:00 ng\xE0y 08/08/2026 \u0111\u1EC3 n\xE2ng c\u1EA5p h\u1EA1 t\u1EA7ng m\xE1y ch\u1EE7 m\xE1y h\u1ECDc v\xE0 b\u1EA3o m\u1EADt.",
      type: "H\u1EC7 th\u1ED1ng",
      priority: "medium",
      audienceType: "all",
      audienceLabel: "To\xE0n b\u1ED9 H\u1EC7 th\u1ED1ng (1,322 ng\u01B0\u1EDDi)",
      recipientCount: 1322,
      scheduledAt: "07/08/2026 18:00",
      createdAt: "31/07/2026 10:00",
      createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      status: "scheduled",
      readCount: 0,
      totalRecipients: 1322
    },
    {
      id: "TB-2026-084",
      title: "H\u01B0\u1EDBng d\u1EABn Sinh vi\xEAn L\u1EDBp 20CNTT1 n\u1ED9p S\u1ED5 nh\u1EADt k\xFD th\u1EF1c t\u1EADp \u0111\u1EE3t 1",
      content: "Nh\u1EAFc nh\u1EDF ri\xEAng l\u1EDBp 20CNTT1 chu\u1EA9n b\u1ECB file scan s\u1ED5 nh\u1EADt k\xFD c\xF3 ch\u1EEF k\xFD x\xE1c nh\u1EADn c\u1EE7a c\xE1n b\u1ED9 h\u01B0\u1EDBng d\u1EABn t\u1EA1i doanh nghi\u1EC7p.",
      type: "\u0110\xE1nh gi\xE1",
      priority: "low",
      audienceType: "class",
      audienceLabel: "L\u1EDBp 20CNTT1 (45 SV)",
      recipientCount: 45,
      createdAt: "01/08/2026 09:30",
      createdBy: "V\u0103n ph\xF2ng Khoa (L\xEA V\u0103n An)",
      status: "draft",
      readCount: 0,
      totalRecipients: 45
    },
    {
      id: "TB-2026-083",
      title: "Th\xF4ng b\xE1o ph\xE2n c\xF4ng Gi\u1EA3ng vi\xEAn H\u01B0\u1EDBng d\u1EABn \u0110\u1EE3t b\u1ED5 sung th\xE1ng 8",
      content: "\u0110\xE3 ho\xE0n t\u1EA5t ph\xE2n c\xF4ng 12 sinh vi\xEAn n\u1ED9p tr\u1EC5 v\xE0o c\xE1c nh\xF3m gi\u1EA3ng vi\xEAn b\u1ED9 m\xF4n C\xF4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m.",
      type: "H\u1ECDc t\u1EADp",
      priority: "medium",
      audienceType: "department",
      audienceLabel: "B\u1ED9 m\xF4n CNPM (12 GV)",
      recipientCount: 12,
      sentAt: "28/07/2026 15:20",
      createdAt: "28/07/2026 14:00",
      createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      status: "sent",
      readCount: 12,
      totalRecipients: 12
    }
  ]);
  const [activityLogs, setActivityLogs] = useState([
    { id: "nlog-1", notificationId: "TB-2026-089", title: "Kh\u1EA9n: Y\xEAu c\u1EA7u c\u1EADp nh\u1EADt B\xE1o c\xE1o...", action: "Sinh vi\xEAn Tr\u1EA7n V\u0103n Nam (20110201) \u0111\xE3 m\u1EDF \u0111\u1ECDc", timestamp: "02/08/2026 09:12", type: "read" },
    { id: "nlog-2", notificationId: "TB-2026-089", title: "Kh\u1EA9n: Y\xEAu c\u1EA7u c\u1EADp nh\u1EADt B\xE1o c\xE1o...", action: "\u0110\xE3 ph\xE1t h\xE0nh th\xF4ng b\xE1o \u0111\u1EBFn 1,280 sinh vi\xEAn", timestamp: "02/08/2026 08:30", type: "sent" },
    { id: "nlog-3", notificationId: "TB-2026-088", title: "L\u1ECBch h\u1ECDp H\u1ED9i \u0111\u1ED3ng \u0110\xE1nh gi\xE1...", action: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc (GV001) \u0111\xE3 x\xE1c nh\u1EADn tham d\u1EF1", timestamp: "01/08/2026 16:05", type: "confirmed" },
    { id: "nlog-4", notificationId: "TB-2026-087", title: "Nh\u1EAFc nh\u1EDF \u0110\u0103ng k\xFD Nguy\u1EC7n v\u1ECDng...", action: "\u0110\xE3 l\xEAn l\u1ECBch g\u1EEDi l\xFAc 07:00 ng\xE0y 03/08/2026", timestamp: "01/08/2026 16:45", type: "scheduled" },
    { id: "nlog-5", notificationId: "TB-2026-086", title: "C\u1EADp nh\u1EADt Quy ch\u1EBF \u0110\xE1nh gi\xE1...", action: "1,285 ng\u01B0\u1EDDi d\xF9ng \u0111\xE3 ho\xE0n th\xE0nh vi\u1EC7c \u0111\u1ECDc quy ch\u1EBF", timestamp: "31/07/2026 11:30", type: "read" }
  ]);
  const [composeTitle, setComposeTitle] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeType, setComposeType] = useState("H\u1ECDc t\u1EADp");
  const [composePriority, setComposePriority] = useState("medium");
  const [composeAudience, setComposeAudience] = useState("all");
  const [composeCustomAudienceDetail, setComposeCustomAudienceDetail] = useState("all_system");
  const [composeAttachment, setComposeAttachment] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("2026-08-05");
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [isUrgentFastSend, setIsUrgentFastSend] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState("list");
  const calculatedRecipientCount = useMemo(() => {
    switch (composeAudience) {
      case "all":
        return 1322;
      // 1,280 SV + 42 GV
      case "lecturer":
        return 42;
      case "student":
        return 1280;
      case "semester":
        return composeCustomAudienceDetail === "hk1_2026" ? 850 : 430;
      case "class":
        return composeCustomAudienceDetail === "20cntt1" ? 45 : 42;
      case "faculty":
        return 1322;
      // Khoa CNTT
      case "department":
        return 14;
      // Bộ môn CNPM
      case "custom":
        return 28;
      default:
        return 1322;
    }
  }, [composeAudience, composeCustomAudienceDetail]);
  const calculatedAudienceLabel = useMemo(() => {
    switch (composeAudience) {
      case "all":
        return "To\xE0n b\u1ED9 h\u1EC7 th\u1ED1ng (1,322 ng\u01B0\u1EDDi)";
      case "lecturer":
        return "To\xE0n b\u1ED9 Gi\u1EA3ng vi\xEAn (42 GV)";
      case "student":
        return "To\xE0n b\u1ED9 Sinh vi\xEAn (1,280 SV)";
      case "semester":
        return composeCustomAudienceDetail === "hk1_2026" ? "K\u1EF3 HK1 (2026-2027) - 850 SV" : "K\u1EF3 HK2 (2025-2026) - 430 SV";
      case "class":
        return composeCustomAudienceDetail === "20cntt1" ? "L\u1EDBp 20CNTT1 (45 SV)" : "L\u1EDBp 20KTPM1 (42 SV)";
      case "faculty":
        return "Khoa CNTT (1,322 ng\u01B0\u1EDDi)";
      case "department":
        return "B\u1ED9 m\xF4n C\xF4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m (14 GV)";
      case "custom":
        return "Danh s\xE1ch t\xF9y ch\u1ECDn (28 ng\u01B0\u1EDDi nh\u1EADn)";
      default:
        return "To\xE0n b\u1ED9 h\u1EC7 th\u1ED1ng";
    }
  }, [composeAudience, composeCustomAudienceDetail]);
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchPriority = priorityFilter === "all" || item.priority === priorityFilter;
      const matchAudience = audienceFilter === "all" || item.audienceType === audienceFilter;
      return matchSearch && matchType && matchStatus && matchPriority && matchAudience;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter, priorityFilter, audienceFilter]);
  const scheduledNotifications = useMemo(() => {
    return notifications.filter((n) => n.status === "scheduled");
  }, [notifications]);
  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);
  const totalCount = notifications.length;
  const sentCount = notifications.filter((n) => n.status === "sent").length;
  const scheduledCount = notifications.filter((n) => n.status === "scheduled").length;
  const draftCount = notifications.filter((n) => n.status === "draft").length;
  const urgentCount = notifications.filter((n) => n.priority === "urgent").length;
  const sentNotifs = notifications.filter((n) => n.status === "sent" && n.totalRecipients > 0);
  const avgReadRate = sentNotifs.length > 0 ? Math.round(sentNotifs.reduce((acc, curr) => acc + curr.readCount / curr.totalRecipients * 100, 0) / sentNotifs.length) : 92;
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return { bg: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse", label: "Kh\u1EA9n c\u1EA5p", icon: ShieldAlert };
      case "high":
        return { bg: "bg-amber-100 text-amber-800 border-amber-300", label: "M\u1EE9c Cao", icon: AlertTriangle };
      case "medium":
        return { bg: "bg-blue-100 text-blue-800 border-blue-200", label: "Trung b\xECnh", icon: Layers };
      case "low":
      default:
        return { bg: "bg-slate-100 text-slate-700 border-slate-200", label: "M\u1EE9c Th\u1EA5p", icon: Clock };
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return { bg: "bg-emerald-50 text-emerald-800 border-emerald-200", label: "\u0110\xE3 g\u1EEDi", icon: CheckCircle2, dot: "bg-emerald-500" };
      case "scheduled":
        return { bg: "bg-blue-50 text-blue-800 border-blue-200", label: "\u0110\xE3 l\xEAn l\u1ECBch", icon: Calendar, dot: "bg-blue-500" };
      case "draft":
        return { bg: "bg-slate-100 text-slate-700 border-slate-300", label: "B\u1EA3n nh\xE1p", icon: FileText, dot: "bg-slate-400" };
      case "sending":
      default:
        return { bg: "bg-amber-50 text-amber-800 border-amber-200", label: "\u0110ang g\u1EEDi...", icon: RefreshCw, dot: "bg-amber-500" };
    }
  };
  const getTypeBadge = (type) => {
    switch (type) {
      case "Kh\u1EA9n c\u1EA5p":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Quy ch\u1EBF":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "L\u1ECBch tr\xECnh":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "H\u1EC7 th\u1ED1ng":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "\u0110\xE1nh gi\xE1":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "H\u1ECDc t\u1EADp":
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };
  const handleFileAttachmentSim = () => {
    setComposeAttachment({
      name: "Thong_Bao_Moi_2026_InternLink.pdf",
      size: "1.8 MB"
    });
    onShowToast("\u0110\xE3 \u0111\xEDnh k\xE8m t\u1EC7p Thong_Bao_Moi_2026_InternLink.pdf th\xE0nh c\xF4ng!");
  };
  const handleSaveDraft = () => {
    if (!composeTitle.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp ti\xEAu \u0111\u1EC1 th\xF4ng b\xE1o tr\u01B0\u1EDBc khi l\u01B0u nh\xE1p.");
      return;
    }
    const newNotif = {
      id: `TB-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: composeTitle,
      content: composeContent || "N\u1ED9i dung ch\u01B0a c\u1EADp nh\u1EADt...",
      type: composeType,
      priority: composePriority,
      audienceType: composeAudience,
      audienceLabel: calculatedAudienceLabel,
      recipientCount: calculatedRecipientCount,
      createdAt: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"),
      createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      status: "draft",
      readCount: 0,
      totalRecipients: calculatedRecipientCount,
      attachmentName: composeAttachment?.name,
      attachmentSize: composeAttachment?.size
    };
    setNotifications([newNotif, ...notifications]);
    onShowToast(`\u0110\xE3 l\u01B0u b\u1EA3n nh\xE1p "${composeTitle}" th\xE0nh c\xF4ng!`);
    resetComposeForm();
  };
  const handleSendNow = () => {
    if (!composeTitle.trim() || !composeContent.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 Ti\xEAu \u0111\u1EC1 v\xE0 N\u1ED9i dung th\xF4ng b\xE1o.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const notifId = `TB-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newNotif = {
        id: notifId,
        title: composeTitle,
        content: composeContent,
        type: composeType,
        priority: composePriority,
        audienceType: composeAudience,
        audienceLabel: calculatedAudienceLabel,
        recipientCount: calculatedRecipientCount,
        sentAt: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"),
        createdAt: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"),
        createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
        status: "sent",
        readCount: 0,
        totalRecipients: calculatedRecipientCount,
        attachmentName: composeAttachment?.name,
        attachmentSize: composeAttachment?.size
      };
      setNotifications([newNotif, ...notifications]);
      setActivityLogs([
        {
          id: `nlog-${Date.now()}`,
          notificationId: notifId,
          title: composeTitle,
          action: `\u0110\xE3 ph\xE1t h\xE0nh th\xF4ng b\xE1o \u0111\u1EBFn ${calculatedAudienceLabel}`,
          timestamp: "V\u1EEBa xong",
          type: "sent"
        },
        ...activityLogs
      ]);
      onShowToast(`\u0110\xE3 g\u1EEDi th\xF4ng b\xE1o \u0111\u1EBFn ${calculatedRecipientCount} ng\u01B0\u1EDDi nh\u1EADn th\xE0nh c\xF4ng!`);
      resetComposeForm();
    }, 600);
  };
  const handleScheduleSend = () => {
    if (!composeTitle.trim() || !composeContent.trim()) {
      onShowToast("Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 Ti\xEAu \u0111\u1EC1 v\xE0 N\u1ED9i dung th\xF4ng b\xE1o.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const notifId = `TB-2026-${Math.floor(100 + Math.random() * 900)}`;
      const scheduledDateTime = `${scheduleDate.split("-").reverse().join("/")} ${scheduleTime}`;
      const newNotif = {
        id: notifId,
        title: composeTitle,
        content: composeContent,
        type: composeType,
        priority: composePriority,
        audienceType: composeAudience,
        audienceLabel: calculatedAudienceLabel,
        recipientCount: calculatedRecipientCount,
        scheduledAt: scheduledDateTime,
        createdAt: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"),
        createdBy: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
        status: "scheduled",
        readCount: 0,
        totalRecipients: calculatedRecipientCount,
        attachmentName: composeAttachment?.name,
        attachmentSize: composeAttachment?.size
      };
      setNotifications([newNotif, ...notifications]);
      setActivityLogs([
        {
          id: `nlog-${Date.now()}`,
          notificationId: notifId,
          title: composeTitle,
          action: `\u0110\xE3 l\xEAn l\u1ECBch g\u1EEDi v\xE0o l\xFAc ${scheduledDateTime}`,
          timestamp: "V\u1EEBa xong",
          type: "scheduled"
        },
        ...activityLogs
      ]);
      onShowToast(`\u0110\xE3 l\xEAn l\u1ECBch g\u1EEDi v\xE0o l\xFAc ${scheduledDateTime} th\xE0nh c\xF4ng!`);
      setShowSchedulePicker(false);
      resetComposeForm();
    }, 500);
  };
  const handleQuickUrgentBroadcast = () => {
    setComposeTitle("KH\u1EA8N: C\u1EA3nh b\xE1o th\u1EDDi h\u1EA1n n\u1ED9p b\xE1o c\xE1o v\xE0 ch\u1EA5m \u0111i\u1EC3m h\u1EC7 th\u1ED1ng InternLink");
    setComposeContent("K\xEDnh g\u1EEDi Qu\xFD Th\u1EA7y/C\xF4 v\xE0 c\xE1c b\u1EA1n Sinh vi\xEAn, h\u1EC7 th\u1ED1ng ghi nh\u1EADn c\xF2n m\u1ED9t s\u1ED1 h\u1ED3 s\u01A1 ch\u01B0a ho\xE0n t\u1EA5t. Vui l\xF2ng ki\u1EC3m tra v\xE0 x\u1EED l\xFD g\u1EA5p tr\u01B0\u1EDBc 17:00 h\xF4m nay.");
    setComposeType("Kh\u1EA9n c\u1EA5p");
    setComposePriority("urgent");
    setComposeAudience("all");
    setIsUrgentFastSend(true);
    onShowToast('\u0110\xE3 t\u1EA3i m\u1EABu Th\xF4ng b\xE1o Kh\u1EA9n c\u1EA5p. H\xE3y ki\u1EC3m tra l\u1EA1i v\xE0 b\u1EA5m "G\u1EEDi ngay".');
  };
  const handleCancelSchedule = (id) => {
    setNotifications((prev) => prev.map((n) => {
      if (n.id === id) {
        return { ...n, status: "draft", scheduledAt: void 0 };
      }
      return n;
    }));
    onShowToast(`\u0110\xE3 h\u1EE7y l\u1ECBch g\u1EEDi th\xF4ng b\xE1o ${id} v\xE0 chuy\u1EC3n th\xE0nh b\u1EA3n nh\xE1p.`);
  };
  const handleSendScheduledNow = (id) => {
    setNotifications((prev) => prev.map((n) => {
      if (n.id === id) {
        return {
          ...n,
          status: "sent",
          sentAt: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"),
          scheduledAt: void 0
        };
      }
      return n;
    }));
    onShowToast(`\u0110\xE3 ph\xE1t h\xE0nh ngay th\xF4ng b\xE1o ${id}!`);
  };
  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    onShowToast(`\u0110\xE3 x\xF3a th\xF4ng b\xE1o ${id}.`);
  };
  const resetComposeForm = () => {
    setComposeTitle("");
    setComposeContent("");
    setComposeType("H\u1ECDc t\u1EADp");
    setComposePriority("medium");
    setComposeAudience("all");
    setComposeAttachment(null);
    setIsUrgentFastSend(false);
  };
  const handleExportHistory = () => {
    onShowToast("\u0110\xE3 xu\u1EA5t B\xE1o c\xE1o L\u1ECBch s\u1EED Th\xF4ng b\xE1o (.xlsx) th\xE0nh c\xF4ng!");
  };
  return <div className="p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-300 min-w-0 max-w-full overflow-hidden">
      
      {
    /* PAGE TITLE BAR */
  }
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs min-w-0 max-w-full overflow-hidden">
        <div className="min-w-0 max-w-full">
          <h1 className="text-xl font-black text-slate-900 tracking-tight truncate">Thông báo (Notification Center)</h1>
        </div>

        {
    /* SECTION 7: QUICK ACTIONS */
  }
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
    onClick={handleQuickUrgentBroadcast}
    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 animate-pulse"
  >
            <ShieldAlert className="w-4 h-4 text-rose-200" />
            <span>Gửi khẩn</span>
          </button>

          <button
    onClick={() => {
      setComposeAudience("all");
      onShowToast("\u0110\xE3 ch\u1ECDn nh\xF3m \u0111\u1ED1i t\u01B0\u1EE3ng To\xE0n h\u1EC7 th\u1ED1ng.");
    }}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
  >
            <Radio className="w-4 h-4 text-blue-200" />
            <span>Thông báo toàn hệ thống</span>
          </button>

          <button
    onClick={handleExportHistory}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
  >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất lịch sử</span>
          </button>

          <button
    onClick={() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onShowToast("\u0110\xE3 l\xE0m m\u1EDBi danh s\xE1ch v\xE0 ch\u1EC9 s\u1ED1 th\xF4ng b\xE1o m\u1EDBi nh\u1EA5t!");
      }, 400);
    }}
    disabled={isLoading}
    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200 disabled:opacity-50"
    title="Làm mới"
  >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {
    /* HERO KPI CARDS - UNIFIED 4 CORE CARDS */
  }
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {
    /* KPI 1: Tổng thông báo */
  }
        <div className="p-4 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tổng thông báo</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
            <span className="text-xs font-bold text-slate-400">thông báo</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Toàn bộ hệ thống</p>
        </div>

        {
    /* KPI 2: Đã gửi */
  }
        <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Đã gửi</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{sentCount}</span>
            <span className="text-xs font-bold text-emerald-600/70">thông báo</span>
          </div>
          <span className="inline-block px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md border border-emerald-200">
            Đã phát hành thành công
          </span>
        </div>

        {
    /* KPI 3: Thông báo khẩn */
  }
        <div className="p-4 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40 rounded-2xl border border-rose-200/80 border-l-4 border-l-rose-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Thông báo khẩn</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 border border-rose-200/60 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{urgentCount}</span>
            <span className="text-xs font-bold text-rose-600/70">thông báo</span>
          </div>
          <span className="inline-block px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-md border border-rose-200">
            Ưu tiên tối cao
          </span>
        </div>

        {
    /* KPI 4: Tỷ lệ đã đọc */
  }
        <div className="p-4 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md transition-all space-y-1.5">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800">Tỷ lệ đã đọc</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-600">{avgReadRate}%</span>
            <span className="text-xs font-bold text-indigo-500">lượt đọc</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Trung bình toàn trường</p>
        </div>

      </div>

      {
    /* MAIN CONTENT GRID: 8 COLUMNS LEFT, 4 COLUMNS RIGHT */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0 max-w-full">
        
        {
    /* MAIN LEFT COLUMN: 8 COLUMNS */
  }
        <div className="lg:col-span-8 space-y-6 min-w-0 max-w-full">

          {
    /* SECTION 1 & 2: COMPOSE NOTIFICATION & AUDIENCE SELECTOR PANEL */
  }
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 relative overflow-hidden">
            
            {isUrgentFastSend && <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                  <span>Đang ở chế độ <strong>Phát hành Thông báo Khẩn cấp</strong>! Vui lòng rà soát cẩn thận trước khi gửi.</span>
                </div>
                <button onClick={() => setIsUrgentFastSend(false)} className="text-rose-500 hover:text-rose-800">
                  <X className="w-4 h-4" />
                </button>
              </div>}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">Soạn thông báo mới (Compose Center)</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Tạo thông báo, chọn nhóm người nhận mục tiêu và phát hành hoặc lên lịch tự động.
                  </p>
                </div>
              </div>

              {
    /* Live Recipient Count Badge */
  }
              <div className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-xs font-black flex items-center gap-2 shadow-2xs">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Dự kiến gửi tới: <strong className="text-blue-700 font-extrabold">{calculatedRecipientCount.toLocaleString("vi-VN")}</strong> người nhận</span>
              </div>
            </div>

            {
    /* FORM INPUTS */
  }
            <div className="space-y-4">
              
              {
    /* Row 1: Title */
  }
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo <span className="text-rose-500">*</span>
                </label>
                <input
    type="text"
    value={composeTitle}
    onChange={(e) => setComposeTitle(e.target.value)}
    placeholder="Ví dụ: Khẩn: Yêu cầu cập nhật Báo cáo Thực tập Tuần 8 trước 17:00..."
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs outline-none focus:bg-white focus:border-blue-500 transition-colors"
  />
              </div>

              {
    /* Row 2: Type, Priority, Audience Type */
  }
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {
    /* Notification Type */
  }
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại thông báo</label>
                  <select
    value={composeType}
    onChange={(e) => setComposeType(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                    <option value="Học tập">Học tập & Tiến độ</option>
                    <option value="Lịch trình">Lịch trình & Hội đồng</option>
                    <option value="Hệ thống">Bảo trì & Hệ thống</option>
                    <option value="Đánh giá">Đánh giá & Chấm điểm</option>
                    <option value="Quy chế">Quy chế & Văn bản</option>
                    <option value="Khẩn cấp">Khẩn cấp & Cảnh báo</option>
                  </select>
                </div>

                {
    /* Priority */
  }
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
                  <select
    value={composePriority}
    onChange={(e) => setComposePriority(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                    <option value="low">Thấp (Thông thường)</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao (Cần chú ý)</option>
                    <option value="urgent">Khẩn cấp (Báo động đỏ)</option>
                  </select>
                </div>

                {
    /* Audience Selector (SECTION 2) */
  }
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đối tượng nhận (Audience)</label>
                  <select
    value={composeAudience}
    onChange={(e) => setComposeAudience(e.target.value)}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                    <option value="all">Toàn bộ hệ thống</option>
                    <option value="semester">Theo kỳ thực tập</option>
                    <option value="lecturer">Theo Giảng viên</option>
                    <option value="student">Theo Sinh viên</option>
                    <option value="class">Theo Lớp học</option>
                    <option value="faculty">Theo Khoa (CNTT)</option>
                    <option value="department">Theo Bộ môn</option>
                    <option value="custom">Theo danh sách được chọn</option>
                  </select>
                </div>

              </div>

              {
    /* Sub-audience selector if specific option selected */
  }
              {(composeAudience === "semester" || composeAudience === "class") && <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 text-xs flex items-center justify-between gap-3">
                  <span className="font-bold text-blue-900 shrink-0">Chi tiết nhóm chọn:</span>
                  {composeAudience === "semester" ? <select
    value={composeCustomAudienceDetail}
    onChange={(e) => setComposeCustomAudienceDetail(e.target.value)}
    className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg font-bold text-slate-800 outline-none"
  >
                      <option value="hk1_2026">Kỳ HK1 (2026-2027) - 850 sinh viên</option>
                      <option value="hk2_2025">Kỳ HK2 (2025-2026) - 430 sinh viên</option>
                    </select> : <select
    value={composeCustomAudienceDetail}
    onChange={(e) => setComposeCustomAudienceDetail(e.target.value)}
    className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg font-bold text-slate-800 outline-none"
  >
                      <option value="20cntt1">Lớp 20CNTT1 (45 sinh viên)</option>
                      <option value="20ktpm1">Lớp 20KTPM1 (42 sinh viên)</option>
                    </select>}
                </div>}

              {
    /* Content Field */
  }
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung thông báo <span className="text-rose-500">*</span>
                </label>
                <textarea
    rows={4}
    value={composeContent}
    onChange={(e) => setComposeContent(e.target.value)}
    placeholder="Nhập nội dung chi tiết thông báo..."
    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-xs outline-none focus:bg-white focus:border-blue-500 transition-colors resize-y"
  />
              </div>

              {
    /* Attachment & Schedule Selector Bar */
  }
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                
                {
    /* File Attachment Button & Preview */
  }
                <div className="flex items-center gap-2">
                  <button
    type="button"
    onClick={handleFileAttachmentSim}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>Đính kèm tệp văn bản</span>
                  </button>

                  {composeAttachment && <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-extrabold flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[180px]">{composeAttachment.name}</span>
                      <button onClick={() => setComposeAttachment(null)} className="text-emerald-500 hover:text-emerald-800">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>}
                </div>

                {
    /* Schedule Toggle Button */
  }
                <button
    type="button"
    onClick={() => setShowSchedulePicker(!showSchedulePicker)}
    className={`px-3 py-1.5 font-bold text-xs rounded-xl border transition-colors flex items-center gap-1.5 ${showSchedulePicker ? "bg-blue-50 text-blue-700 border-blue-300" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"}`}
  >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>{showSchedulePicker ? "\u1EA8n c\xE0i \u0111\u1EB7t l\xEAn l\u1ECBch" : "T\xF9y ch\u1ECDn L\xEAn l\u1ECBch g\u1EEDi"}</span>
                </button>
              </div>

              {
    /* Expandable Schedule Picker Box */
  }
              {showSchedulePicker && <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3 animate-in fade-in duration-200">
                  <span className="text-xs font-black text-blue-900 block flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Cấu hình Ngày & Giờ tự động phát hành
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ngày gửi</label>
                      <input
    type="date"
    value={scheduleDate}
    onChange={(e) => setScheduleDate(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg font-bold text-slate-800 outline-none"
  />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Giờ gửi</label>
                      <input
    type="time"
    value={scheduleTime}
    onChange={(e) => setScheduleTime(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg font-bold text-slate-800 outline-none"
  />
                    </div>
                  </div>

                  <p className="text-[10px] text-blue-700 font-medium italic">
                    * Hệ thống Server InternLink sẽ tự động phát hành thông báo đúng thời gian này đến tất cả thiết bị của người nhận.
                  </p>
                </div>}

            </div>

            {
    /* SECTION 1 BUTTONS */
  }
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
    onClick={handleSaveDraft}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200"
  >
                Lưu nháp
              </button>

              {showSchedulePicker ? <button
    onClick={handleScheduleSend}
    disabled={isLoading}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
  >
                  <CalendarClock className="w-4 h-4 text-blue-200" />
                  <span>Xác nhận Lên lịch gửi</span>
                </button> : <button
    onClick={handleSendNow}
    disabled={isLoading}
    className={`px-5 py-2 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 ${composePriority === "urgent" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
  >
                  <Send className="w-4 h-4 text-white" />
                  <span>Gửi ngay ({calculatedRecipientCount} người nhận)</span>
                </button>}
            </div>

          </section>

          {
    /* SECTION 3: NOTIFICATION LIST TABLE */
  }
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Danh sách thông báo ({filteredNotifications.length})
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Quản lý và tra cứu trạng thái toàn bộ thông báo đã phát hành hoặc đang lên lịch.
                </p>
              </div>

              {
    /* Tab Selector */
  }
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-extrabold">
                <button
    onClick={() => setActiveTabSection("list")}
    className={`px-3 py-1.5 rounded-lg transition-all ${activeTabSection === "list" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                  Tất cả ({notifications.length})
                </button>
                <button
    onClick={() => setActiveTabSection("schedule")}
    className={`px-3 py-1.5 rounded-lg transition-all ${activeTabSection === "schedule" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                  Lên lịch ({scheduledNotifications.length})
                </button>
                <button
    onClick={() => setActiveTabSection("analytics")}
    className={`px-3 py-1.5 rounded-lg transition-all ${activeTabSection === "analytics" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
  >
                  Phân tích lượt đọc
                </button>
              </div>
            </div>

            {
    /* Filter Bar */
  }
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              
              {
    /* Search */
  }
              <div className="relative sm:col-span-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
    type="text"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    }}
    placeholder="Tiêu đề, mã, nội dung..."
    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-blue-500"
  />
              </div>

              {
    /* Type Filter */
  }
              <select
    value={typeFilter}
    onChange={(e) => {
      setTypeFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                <option value="all">Tất cả Loại thông báo</option>
                <option value="Học tập">Học tập & Tiến độ</option>
                <option value="Lịch trình">Lịch trình & Hội đồng</option>
                <option value="Hệ thống">Hệ thống & Bảo trì</option>
                <option value="Đánh giá">Đánh giá & Chấm điểm</option>
                <option value="Quy chế">Quy chế & Văn bản</option>
                <option value="Khẩn cấp">Khẩn cấp</option>
              </select>

              {
    /* Status Filter */
  }
              <select
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                <option value="all">Tất cả Trạng thái</option>
                <option value="sent">Đã gửi</option>
                <option value="scheduled">Đã lên lịch</option>
                <option value="draft">Bản nháp</option>
              </select>

              {
    /* Priority Filter */
  }
              <select
    value={priorityFilter}
    onChange={(e) => {
      setPriorityFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
  >
                <option value="all">Tất cả Mức ưu tiên</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>

            </div>

            {
    /* Notification Table */
  }
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Mã & Tiêu đề</th>
                    <th className="py-2.5 px-3 text-center">Loại</th>
                    <th className="py-2.5 px-3">Người nhận</th>
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3 text-center">Ưu tiên</th>
                    <th className="py-2.5 px-3 text-center">Trạng thái</th>
                    <th className="py-2.5 px-3">Tỷ lệ đã đọc</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedNotifications.length === 0 ? <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                        Không tìm thấy thông báo nào phù hợp bộ lọc.
                      </td>
                    </tr> : paginatedNotifications.map((notif) => {
    const priorityBadge = getPriorityBadge(notif.priority);
    const statusBadge = getStatusBadge(notif.status);
    const readPercent = notif.totalRecipients > 0 ? Math.round(notif.readCount / notif.totalRecipients * 100) : 0;
    return <tr key={notif.id} className="hover:bg-slate-50/80 transition-colors group">
                          
                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-slate-400">{notif.id}</span>
                                {notif.attachmentName && <Paperclip className="w-3 h-3 text-blue-500 shrink-0" title={notif.attachmentName} />}
                              </div>
                              <p className="font-extrabold text-slate-900 line-clamp-1 max-w-[240px]">
                                {notif.title}
                              </p>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getTypeBadge(notif.type)}`}>
                              {notif.type}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-extrabold text-slate-800 text-xs block">
                              {notif.audienceLabel}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Tạo bởi: {notif.createdBy}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {notif.sentAt ? <span>{notif.sentAt}</span> : notif.scheduledAt ? <span className="text-blue-600 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notif.scheduledAt}
                              </span> : <span className="text-slate-400 italic">Bản nháp ({notif.createdAt})</span>}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border inline-flex items-center gap-1 ${priorityBadge.bg}`}>
                              <span>{priorityBadge.label}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border inline-flex items-center gap-1 ${statusBadge.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                              <span>{statusBadge.label}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            {notif.status === "sent" ? <div className="space-y-1 min-w-[100px]">
                                <div className="flex justify-between text-[10px] font-extrabold">
                                  <span className="text-slate-700">{notif.readCount}/{notif.totalRecipients}</span>
                                  <span className="text-blue-600">{readPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div
      className={`h-full rounded-full ${readPercent > 80 ? "bg-emerald-500" : "bg-blue-500"}`}
      style={{ width: `${readPercent}%` }}
    />
                                </div>
                              </div> : <span className="text-[10px] text-slate-400 font-mono">—</span>}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
      onClick={() => {
        setSelectedNotif(notif);
        setIsDetailOpen(true);
      }}
      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="Xem chi tiết"
    >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
      onClick={() => {
        setComposeTitle(`[Sao ch\xE9p] ${notif.title}`);
        setComposeContent(notif.content);
        setComposeType(notif.type);
        setComposePriority(notif.priority);
        onShowToast("\u0110\xE3 sao ch\xE9p n\u1ED9i dung v\xE0o khung so\u1EA1n th\u1EA3o!");
      }}
      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      title="Sao chép nội dung"
    >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
      onClick={() => handleDeleteNotification(notif.id)}
      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
      title="Xóa"
    >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>;
  })}
                </tbody>
              </table>
            </div>

            {
    /* Pagination Controls */
  }
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">
                  Hiển thị {paginatedNotifications.length} / {filteredNotifications.length} thông báo
                </span>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span>Số dòng:</span>
                  <select
    value={pageSize}
    onChange={(e) => {
      setPageSize(Number(e.target.value));
      setCurrentPage(1);
    }}
    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer text-xs"
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
    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
  >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
                  {currentPage} / {totalPages}
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

          </section>

          {
    /* SECTION 4: SCHEDULE CENTER */
  }
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-blue-600" />
                  Trung tâm quản lý Lên lịch gửi (Schedule Center)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Danh sách các thông báo đã được cấu hình gửi tự động theo thời gian chỉ định.
                </p>
              </div>
            </div>

            {scheduledNotifications.length === 0 ? <div className="p-8 text-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Hiện tại không có thông báo nào đang trong hàng đợi lên lịch.
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {scheduledNotifications.map((sItem) => <div key={sItem.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3 relative hover:border-blue-300 transition-colors">
                    
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-black border border-blue-200 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        Gửi lúc: {sItem.scheduledAt}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{sItem.id}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1">{sItem.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">{sItem.content}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 text-slate-600">
                      <span>Người nhận: <strong>{sItem.audienceLabel}</strong></span>
                      <span className="font-extrabold text-blue-700">{sItem.recipientCount} người</span>
                    </div>

                    {
    /* Schedule Action Buttons */
  }
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
    onClick={() => {
      setComposeTitle(sItem.title);
      setComposeContent(sItem.content);
      onShowToast("\u0110\xE3 t\u1EA3i th\xF4ng b\xE1o l\xEAn l\u1ECBch v\xE0o khung ch\u1EC9nh s\u1EEDa.");
    }}
    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200"
  >
                        Chỉnh sửa
                      </button>

                      <button
    onClick={() => handleCancelSchedule(sItem.id)}
    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200"
  >
                        Hủy lịch
                      </button>

                      <button
    onClick={() => handleSendScheduledNow(sItem.id)}
    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg"
  >
                        Gửi ngay
                      </button>
                    </div>

                  </div>)}
              </div>}
          </section>

          {
    /* SECTION 5: READ ANALYTICS CHARTS */
  }
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Phân tích tỷ lệ mở & tương tác đọc (Read Analytics)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Thống kê phản hồi đọc thông báo theo phân nhóm đối tượng và mốc thời gian.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {
    /* Analytics Box 1: Overall Read Breakdown */
  }
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                  Phân bổ Lượt đọc Toàn trường (Read Rate Status)
                </span>
                
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-700">Đã đọc (2,427 lượt)</span>
                      <span className="text-slate-900">92.4%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92.4%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-amber-700">Chưa đọc (199 lượt)</span>
                      <span className="text-slate-900">7.6%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "7.6%" }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Theo Giảng viên</span>
                    <span className="text-base font-black text-purple-700">95.2% đã đọc</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Theo Sinh viên</span>
                    <span className="text-base font-black text-blue-700">91.8% đã đọc</span>
                  </div>
                </div>
              </div>

              {
    /* Analytics Box 2: Timeline Read Engagement */
  }
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                  Xu hướng tốc độ đọc theo thời gian
                </span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700">Mở đọc trong 1 giờ đầu:</span>
                    <span className="font-black text-emerald-600">68.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700">Mở đọc trong 24 giờ:</span>
                    <span className="font-black text-blue-600">89.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700">Mở đọc sau 48 giờ:</span>
                    <span className="font-black text-purple-600">94.8%</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-medium italic text-center">
                  * Tự động gửi tin nhắn SMS / Zalo nhắc nhở đối với các trường hợp chưa đọc sau 24h đối với thông báo Khẩn.
                </p>
              </div>

            </div>
          </section>

          {
    /* SECTION 6: RECENT ACTIVITIES TIMELINE */
  }
          <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Lịch sử hoạt động gửi & phản hồi gần đây (Recent Activities)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Theo dõi tiến trình: Đã gửi thông báo ↓ Sinh viên đã đọc ↓ Giảng viên đã xác nhận.
                </p>
              </div>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
              {activityLogs.map((log) => <div key={log.id} className="flex items-start gap-3 relative z-10 pl-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-black shadow-2xs ${log.type === "sent" ? "bg-blue-50 text-blue-700 border-blue-200" : log.type === "read" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : log.type === "confirmed" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {log.type === "sent" ? <Send className="w-3.5 h-3.5" /> : log.type === "read" ? <Eye className="w-3.5 h-3.5" /> : log.type === "confirmed" ? <CheckCheck className="w-3.5 h-3.5" /> : <CalendarClock className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-900 line-clamp-1">{log.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{log.action}</p>
                  </div>
                </div>)}
            </div>
          </section>

        </div>

        {
    /* RIGHT SIDEBAR: 4 COLUMNS */
  }
        <div className="lg:col-span-4 space-y-6 min-w-0 max-w-full">
          
          {
    /* Widget 1: Scheduled Today */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Lên lịch hôm nay (Scheduled Today)
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md text-[10px] font-extrabold">
                {scheduledNotifications.length} thông báo
              </span>
            </div>

            {scheduledNotifications.length === 0 ? <p className="text-xs text-slate-400 font-medium text-center py-2">Không có lịch gửi thông báo hôm nay.</p> : <div className="space-y-2.5">
                {scheduledNotifications.map((sn) => <div key={sn.id} className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-800">
                      <span>Mã: {sn.id}</span>
                      <span>{sn.scheduledAt}</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 line-clamp-1">{sn.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Gửi tới: {sn.audienceLabel}</p>
                  </div>)}
              </div>}
          </div>

          {
    /* Widget 2: Unread Rate Top Warning */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Nhóm tỷ lệ chưa đọc cao (Unread Rate)
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">Lớp 20KTPM2 (Khoa CNTT)</span>
                  <span className="text-rose-600 font-extrabold">24% chưa đọc</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "24%" }} />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">11/45 sinh viên chưa mở thông báo Tuần 8</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">Lớp 20HTTT1 (Khoa CNTT)</span>
                  <span className="text-amber-600 font-extrabold">18% chưa đọc</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "18%" }} />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">8/44 sinh viên chưa mở thông báo Tuần 8</p>
              </div>
            </div>
          </div>

          {
    /* Widget 3: Urgent Messages Highlight */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Thông báo Khẩn hoạt động (Urgent Messages)
              </span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black text-rose-700">
                <span>TB-2026-089</span>
                <span>Phát hành 08:30 hôm nay</span>
              </div>
              <p className="text-xs font-black text-slate-900 line-clamp-2">
                Khẩn: Yêu cầu cập nhật Báo cáo Thực tập Tuần 8 trước 17:00
              </p>
              <div className="flex justify-between text-[10px] font-bold text-slate-600 pt-1">
                <span>Đã đọc: 1,142 / 1,280</span>
                <span className="text-rose-600">Còn 138 SV chưa xem</span>
              </div>
            </div>
          </div>

          {
    /* Widget 4: System Status */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-600" />
                Trạng thái Hạ tầng Gửi (System Status)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Cổng Email SMTP (@hcmute.edu.vn):</span>
                <span className="font-bold text-emerald-600">Đang hoạt động (99.9%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cổng Push Notification Mobile App:</span>
                <span className="font-bold text-emerald-600">Sẵn sàng (FCM API)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Băng thông hàng đợi tin nhắn:</span>
                <span className="font-bold text-slate-800">1,500 tin / phút</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {
    /* DETAIL MODAL DRAWER */
  }
      {isDetailOpen && selectedNotif && <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden space-y-4 p-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-mono font-black border border-blue-200">
                  {selectedNotif.id}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getTypeBadge(selectedNotif.type)}`}>
                  {selectedNotif.type}
                </span>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 leading-snug">{selectedNotif.title}</h3>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Đối tượng nhận:</span>
                  <span className="font-extrabold text-slate-800">{selectedNotif.audienceLabel}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Người phát hành:</span>
                  <span className="font-extrabold text-slate-800">{selectedNotif.createdBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Thời gian phát hành:</span>
                  <span className="font-mono text-slate-700">{selectedNotif.sentAt || selectedNotif.scheduledAt || "Ch\u01B0a g\u1EEDi"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Lượt mở đọc:</span>
                  <span className="font-black text-emerald-600">{selectedNotif.readCount} / {selectedNotif.totalRecipients} ({selectedNotif.totalRecipients > 0 ? Math.round(selectedNotif.readCount / selectedNotif.totalRecipients * 100) : 0}%)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium space-y-2">
                <span className="font-black text-slate-500 uppercase text-[10px] tracking-wider block">Nội dung văn bản:</span>
                <p>{selectedNotif.content}</p>
              </div>

              {selectedNotif.attachmentName && <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-extrabold text-emerald-900 block">{selectedNotif.attachmentName}</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Kích thước: {selectedNotif.attachmentSize}</span>
                    </div>
                  </div>
                  <button
    onClick={() => onShowToast(`\u0110ang t\u1EA3i t\u1EC7p \u0111\xEDnh k\xE8m ${selectedNotif.attachmentName}...`)}
    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs"
  >
                    Tải xuống
                  </button>
                </div>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
    onClick={() => setIsDetailOpen(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
  >
                Đóng
              </button>
            </div>

          </div>
        </div>}

    </div>;
};

export { NotificationsView as AdminNotificationsView };
