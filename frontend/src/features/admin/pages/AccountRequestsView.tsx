import { useState, useMemo } from "react";
import {
  KeyRound,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Eye,
  Mail,
  Phone,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  Square,
  HelpCircle,
  Info,
  SlidersHorizontal,
  Layers,
  Check,
  X,
  Copy,
  UserPlus,
  History,
  FileCheck2,
  Bell,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import { Panel } from "../../../components/common/Panel";
export const AccountRequestsView = ({ onShowToast, onNavigateTab }) => {
  const [activeMainTab, setActiveMainTab] = useState("requests");
  const [requests, setRequests] = useState([
    {
      id: "YC-2026-0891",
      requesterCode: "20110201",
      requesterName: "Nguy\u1EC5n V\u0103n Minh",
      role: "student",
      departmentOrClass: "L\u1EDBp 20CNTT1 \u2022 Khoa CNTT",
      email: "minh.nv20110201@student.hcmute.edu.vn",
      phone: "0908123456",
      requestType: "Qu\xEAn m\u1EADt kh\u1EA9u",
      description:
        "Em b\u1ECB qu\xEAn m\u1EADt kh\u1EA9u \u0111\u0103ng nh\u1EADp c\u1ED5ng InternLink v\xE0 kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c OTP qua email c\xE1 nh\xE2n c\u0169. Nh\u1EDD Th\u1EA7y/C\xF4 c\u1EA5p l\u1EA1i m\u1EADt kh\u1EA9u t\u1EA1m.",
      createdAt: "02/08/2026 09:15",
      priority: "high",
      status: "pending",
      attachmentName: "Scan_The_Sinh_Vien_20110201.pdf",
      requestedChanges: [
        {
          field: "M\u1EADt kh\u1EA9u",
          oldValue: "********",
          newValue:
            "Y\xEAu c\u1EA7u \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi",
        },
      ],
    },
    {
      id: "YC-2026-0890",
      requesterCode: "GV001",
      requesterName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      role: "lecturer",
      departmentOrClass: "B\u1ED9 m\xF4n CNPM \u2022 Khoa CNTT",
      email: "phuocnv@hcmute.edu.vn",
      phone: "0913888999",
      requestType: "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n",
      description:
        "T\xE0i kho\u1EA3n gi\u1EA3ng vi\xEAn b\u1ECB kh\xF3a t\u1EF1 \u0111\u1ED9ng do nh\u1EADp sai m\u1EADt kh\u1EA9u qu\xE1 5 l\u1EA7n khi truy c\u1EADp t\u1EEB thi\u1EBFt b\u1ECB m\u1EDBi t\u1EA1i doanh nghi\u1EC7p.",
      createdAt: "02/08/2026 08:30",
      priority: "urgent",
      status: "pending",
      attachmentName: "Xac_Nhan_Giang_Vien_GV001.pdf",
      requestedChanges: [
        {
          field: "Tr\u1EA1ng th\xE1i t\xE0i kho\u1EA3n",
          oldValue: "\u0110ang b\u1ECB kh\xF3a (Locked)",
          newValue: "Ho\u1EA1t \u0111\u1ED9ng (Active)",
        },
      ],
    },
    {
      id: "YC-2026-0889",
      requesterCode: "DN-FPT-02",
      requesterName: "L\xEA Kim Y\u1EBFn",
      role: "enterprise",
      departmentOrClass:
        "FPT Software \u2022 Tr\u01B0\u1EDFng ph\xF2ng Nh\xE2n s\u1EF1",
      email: "yenlk@fpt.com",
      phone: "0988111222",
      requestType: "Y\xEAu c\u1EA7u c\u1EA5p m\u1EDBi",
      description:
        "C\u1EA7n c\u1EA5p t\xE0i kho\u1EA3n Mentor Doanh nghi\u1EC7p m\u1EDBi \u0111\u1EC3 \u0111\xE1nh gi\xE1 15 sinh vi\xEAn th\u1EF1c t\u1EADp kh\xF3a K20 t\u1EA1i FPT Software H\u1ED3 Ch\xED Minh.",
      createdAt: "02/08/2026 08:00",
      priority: "high",
      status: "pending",
      attachmentName: "Cong_Van_FPT_Mentor.pdf",
      requestedChanges: [
        {
          field: "T\xE0i kho\u1EA3n m\u1EDBi",
          oldValue: "Ch\u01B0a c\xF3",
          newValue: "T\u1EA1o t\xE0i kho\u1EA3n Mentor Doanh nghi\u1EC7p",
        },
      ],
    },
    {
      id: "YC-2026-0888",
      requesterCode: "20110205",
      requesterName: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o",
      role: "student",
      departmentOrClass: "L\u1EDBp 20CNTT1 \u2022 Khoa CNTT",
      email: "thao.ttt20110205@student.hcmute.edu.vn",
      phone: "0977222333",
      requestType: "\u0110\u1ED5i Email",
      description:
        "Em v\u1EEBa \u0111\u1ED5i sang email sinh vi\xEAn ch\xEDnh th\u1EE9c m\u1EDBi theo quy \u0111\u1ECBnh nh\xE0 tr\u01B0\u1EDDng. Xin c\u1EADp nh\u1EADt l\u1EA1i \u0111\u1ECBa ch\u1EC9 email nh\u1EADn th\xF4ng b\xE1o th\u1EF1c t\u1EADp.",
      createdAt: "01/08/2026 16:40",
      priority: "medium",
      status: "approved",
      processorName: "V\u0103n ph\xF2ng Khoa (L\xEA V\u0103n An)",
      processedAt: "01/08/2026 17:10",
      adminNote:
        "\u0110\xE3 x\xE1c minh tr\xF9ng kh\u1EDBp v\u1EDBi danh s\xE1ch sinh vi\xEAn Khoa CNTT K20.",
      attachmentName: "Thong_Bao_Doi_Email_HCMUTE.pdf",
      requestedChanges: [
        {
          field: "Email ch\xEDnh th\u1EE9c",
          oldValue: "thaotran99@gmail.com",
          newValue: "thao.ttt20110205@student.hcmute.edu.vn",
        },
      ],
    },
    {
      id: "YC-2026-0887",
      requesterCode: "20110212",
      requesterName: "L\xEA Ho\xE0ng Nam",
      role: "student",
      departmentOrClass: "L\u1EDBp 20KTPM1 \u2022 Khoa CNTT",
      email: "nam.lh20110212@student.hcmute.edu.vn",
      phone: "0988333444",
      requestType: "K\xEDch ho\u1EA1t t\xE0i kho\u1EA3n",
      description:
        "Em m\u1EDBi b\u1ED5 sung xong th\u1EE7 t\u1EE5c h\u1ECDc ph\xED k\u1EF3 th\u1EF1c t\u1EADp v\xE0 c\u1EA7n k\xEDch ho\u1EA1t l\u1EA1i t\xE0i kho\u1EA3n \u0111\u1EC3 n\u1ED9p b\xE1o c\xE1o tu\u1EA7n.",
      createdAt: "01/08/2026 14:20",
      priority: "high",
      status: "pending",
      attachmentName: "Bien_Lai_Hoc_Phi_Xac_Nhan.pdf",
      requestedChanges: [
        {
          field: "Tr\u1EA1ng th\xE1i k\xEDch ho\u1EA1t",
          oldValue: "Ch\u01B0a k\xEDch ho\u1EA1t",
          newValue: "\u0110\xE3 k\xEDch ho\u1EA1t",
        },
      ],
    },
    {
      id: "YC-2026-0886",
      requesterCode: "GV004",
      requesterName: "TS. \u0110\u1EB7ng Minh Ch\xE2u",
      role: "lecturer",
      departmentOrClass: "B\u1ED9 m\xF4n HTTT \u2022 Khoa CNTT",
      email: "chaudm@hcmute.edu.vn",
      phone: "0903111222",
      requestType: "\u0110\u1ED5i s\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
      description:
        "T\xF4i thay \u0111\u1ED5i s\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn l\u1EA1c c\xF4ng t\xE1c ch\xEDnh th\u1EE9c \u0111\u1EC3 nh\u1EADn tin nh\u1EAFn SMS b\u1EA3o m\u1EADt OTP h\u1EC7 th\u1ED1ng.",
      createdAt: "01/08/2026 10:15",
      priority: "low",
      status: "approved",
      processorName: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      processedAt: "01/08/2026 11:00",
      adminNote:
        "\u0110\xE3 g\u1ECDi \u0111i\u1EC7n x\xE1c nh\u1EADn ch\xEDnh ch\u1EE7 s\u1ED1 \u0111i\u1EC7n tho\u1EA1i m\u1EDBi.",
      requestedChanges: [
        {
          field: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
          oldValue: "0903111000",
          newValue: "0903111222",
        },
      ],
    },
    {
      id: "YC-2026-0885",
      requesterCode: "20110218",
      requesterName: "Ph\u1EA1m \u0110\u0103ng Khoa",
      role: "student",
      departmentOrClass: "L\u1EDBp 20KTPM2 \u2022 Khoa CNTT",
      email: "khoa.pd20110218@gmail.com",
      phone: "0933444555",
      requestType: "C\u1EADp nh\u1EADt th\xF4ng tin c\xE1 nh\xE2n",
      description:
        "Y\xEAu c\u1EA7u thay \u0111\u1ED5i h\u1ECD t\xEAn do b\u1ECB sai k\xFD t\u1EF1 d\xEDnh l\xF3t tr\xEAn b\u1EB1ng t\u1ED1t nghi\u1EC7p v\xE0 t\xE0i kho\u1EA3n th\u1EF1c t\u1EADp.",
      createdAt: "31/07/2026 15:30",
      priority: "medium",
      status: "need_info",
      processorName: "V\u0103n ph\xF2ng Khoa (L\xEA V\u0103n An)",
      processedAt: "31/07/2026 16:00",
      adminNote:
        "Vui l\xF2ng n\u1ED9p k\xE8m b\u1EA3n ch\u1EE5p Tr\xEDch l\u1EE5c khai sinh ho\u1EB7c CCCD b\u1EA3n g\u1ED1c \u0111\u1EC3 x\xE1c minh.",
      attachmentName: "CCCD_Scan_Chua_Ro_Nets.jpg",
      requestedChanges: [
        {
          field: "H\u1ECD v\xE0 t\xEAn",
          oldValue: "Ph\u1EA1m \u0110\u0103ng Kho",
          newValue: "Ph\u1EA1m \u0110\u0103ng Khoa",
        },
      ],
    },
    {
      id: "YC-2026-0884",
      requesterCode: "20110225",
      requesterName: "V\xF5 Minh Ch\xE2u",
      role: "student",
      departmentOrClass: "L\u1EDBp 20HTTT1 \u2022 Khoa CNTT",
      email: "chau.vm20110225@student.hcmute.edu.vn",
      phone: "0912555666",
      requestType: "Qu\xEAn m\u1EADt kh\u1EA9u",
      description:
        "Em kh\xF4ng \u0111\u0103ng nh\u1EADp \u0111\u01B0\u1EE3c \u1EE9ng d\u1EE5ng di \u0111\u1ED9ng InternLink.",
      createdAt: "31/07/2026 11:20",
      priority: "low",
      status: "rejected",
      processorName: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      processedAt: "31/07/2026 11:45",
      adminNote:
        "T\u1EEB ch\u1ED1i: \u0110\u1ECBa ch\u1EC9 IP g\u1EEDi y\xEAu c\u1EA7u t\u1EEB n\u01B0\u1EDBc ngo\xE0i kh\xF4ng h\u1EE3p l\u1EC7 v\xE0 kh\xF4ng c\xF3 minh ch\u1EE9ng sinh vi\xEAn.",
    },
  ]);
  const [userAccounts, setUserAccounts] = useState([
    {
      id: "ACC-1001",
      code: "20110201",
      fullName: "Nguy\u1EC5n V\u0103n Minh",
      email: "minh.nv20110201@student.hcmute.edu.vn",
      phone: "0908123456",
      role: "student",
      departmentOrOrg: "L\u1EDBp 20CNTT1 \u2022 Khoa CNTT",
      status: "active",
      createdAt: "15/08/2023",
      lastLogin: "02/08/2026 09:10",
    },
    {
      id: "ACC-1002",
      code: "GV001",
      fullName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      email: "phuocnv@hcmute.edu.vn",
      phone: "0913888999",
      role: "lecturer",
      departmentOrOrg: "B\u1ED9 m\xF4n CNPM \u2022 Khoa CNTT",
      status: "locked",
      createdAt: "01/09/2018",
      lastLogin: "02/08/2026 08:25",
    },
    {
      id: "ACC-1003",
      code: "GV002",
      fullName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh",
      email: "maianhtt@hcmute.edu.vn",
      phone: "0909777888",
      role: "lecturer",
      departmentOrOrg: "B\u1ED9 m\xF4n CNPM \u2022 Khoa CNTT",
      status: "active",
      createdAt: "10/01/2020",
      lastLogin: "01/08/2026 18:30",
    },
    {
      id: "ACC-1004",
      code: "DN-FPT-01",
      fullName: "Nguy\u1EC5n Ti\u1EBFn D\u0169ng",
      email: "dungnt@fpt.com",
      phone: "0903999111",
      role: "enterprise",
      departmentOrOrg: "FPT Software HCM",
      status: "active",
      createdAt: "01/06/2025",
      lastLogin: "02/08/2026 07:45",
    },
    {
      id: "ACC-1005",
      code: "20110205",
      fullName: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o",
      email: "thao.ttt20110205@student.hcmute.edu.vn",
      phone: "0977222333",
      role: "student",
      departmentOrOrg: "L\u1EDBp 20CNTT1 \u2022 Khoa CNTT",
      status: "active",
      createdAt: "15/08/2023",
      lastLogin: "01/08/2026 17:15",
    },
    {
      id: "ACC-1006",
      code: "ADM-001",
      fullName: "\u0110\u1ED7 Ho\xE0ng Y\u1EBFn",
      email: "yendh@hcmute.edu.vn",
      phone: "0908888999",
      role: "admin",
      departmentOrOrg: "Ph\xF2ng Qu\u1EA3n l\xFD Khoa CNTT",
      status: "active",
      createdAt: "01/01/2021",
      lastLogin: "02/08/2026 09:20",
    },
  ]);
  const [activityLogs, setActivityLogs] = useState([
    {
      id: "log-1",
      requestId: "YC-2026-0889",
      user: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o (SV)",
      action:
        "Y\xEAu c\u1EA7u \u0110\u1ED5i Email \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t b\u1EDFi L\xEA V\u0103n An",
      timestamp: "01/08/2026 17:10",
      type: "approved",
    },
    {
      id: "log-2",
      requestId: "YC-2026-0886",
      user: "TS. \u0110\u1EB7ng Minh Ch\xE2u (GV)",
      action:
        "\u0110\xE3 x\xE1c nh\u1EADn v\xE0 \u0111\u1ED5i s\u1ED1 \u0111i\u1EC7n tho\u1EA1i m\u1EDBi th\xE0nh c\xF4ng",
      timestamp: "01/08/2026 11:00",
      type: "approved",
    },
    {
      id: "log-3",
      requestId: "YC-2026-0885",
      user: "Ph\u1EA1m \u0110\u0103ng Khoa (SV)",
      action:
        "Y\xEAu c\u1EA7u b\u1ED5 sung th\xEAm b\u1EA3n scan CCCD r\xF5 n\xE9t",
      timestamp: "31/07/2026 16:00",
      type: "need_info",
    },
    {
      id: "log-4",
      requestId: "YC-2026-0884",
      user: "V\xF5 Minh Ch\xE2u (SV)",
      action:
        "T\u1EEB ch\u1ED1i y\xEAu c\u1EA7u do kh\xF4ng \u0111\u1EE7 minh ch\u1EE9ng x\xE1c minh",
      timestamp: "31/07/2026 11:45",
      type: "rejected",
    },
    {
      id: "log-5",
      requestId: "YC-2026-0891",
      user: "Nguy\u1EC5n V\u0103n Minh (SV)",
      action:
        "G\u1EEDi y\xEAu c\u1EA7u Qu\xEAn m\u1EADt kh\u1EA9u k\xE8m b\u1EA3n scan Th\u1EBB sinh vi\xEAn",
      timestamp: "02/08/2026 09:15",
      type: "pending",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [dirSearch, setDirSearch] = useState("");
  const [dirRoleFilter, setDirRoleFilter] = useState("all");
  const [dirStatusFilter, setDirStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processActionType, setProcessActionType] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [generatedTempPass, setGeneratedTempPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newAccCode, setNewAccCode] = useState("");
  const [newAccName, setNewAccName] = useState("");
  const [newAccEmail, setNewAccEmail] = useState("");
  const [newAccPhone, setNewAccPhone] = useState("");
  const [newAccRole, setNewAccRole] = useState("student");
  const [newAccOrg, setNewAccOrg] = useState("");
  const [newAccSendMail, setNewAccSendMail] = useState(true);
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchSearch =
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || req.role === roleFilter;
      const matchType = typeFilter === "all" || req.requestType === typeFilter;
      const matchStatus = statusFilter === "all" || req.status === statusFilter;
      const matchPriority =
        priorityFilter === "all" || req.priority === priorityFilter;
      return (
        matchSearch && matchRole && matchType && matchStatus && matchPriority
      );
    });
  }, [
    requests,
    searchQuery,
    roleFilter,
    typeFilter,
    statusFilter,
    priorityFilter,
  ]);
  const filteredAccounts = useMemo(() => {
    return userAccounts.filter((acc) => {
      const matchSearch =
        acc.fullName.toLowerCase().includes(dirSearch.toLowerCase()) ||
        acc.code.toLowerCase().includes(dirSearch.toLowerCase()) ||
        acc.email.toLowerCase().includes(dirSearch.toLowerCase()) ||
        acc.departmentOrOrg.toLowerCase().includes(dirSearch.toLowerCase());
      const matchRole = dirRoleFilter === "all" || acc.role === dirRoleFilter;
      const matchStatus =
        dirStatusFilter === "all" || acc.status === dirStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [userAccounts, dirSearch, dirRoleFilter, dirStatusFilter]);
  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage, pageSize]);
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const todayCount = requests.filter((r) =>
    r.createdAt.startsWith("02/08/2026"),
  ).length;
  const totalAccountsCount = userAccounts.length;
  const categoryCounts = useMemo(() => {
    const categories = [
      "Qu\xEAn m\u1EADt kh\u1EA9u",
      "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n",
      "Y\xEAu c\u1EA7u c\u1EA5p m\u1EDBi",
      "\u0110\u1ED5i Email",
      "\u0110\u1ED5i s\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
      "K\xEDch ho\u1EA1t t\xE0i kho\u1EA3n",
      "C\u1EADp nh\u1EADt th\xF4ng tin c\xE1 nh\xE2n",
      "Kh\xE1c",
    ];
    return categories.map((cat) => ({
      name: cat,
      count: requests.filter((r) => r.requestType === cat).length,
      pending: requests.filter(
        (r) => r.requestType === cat && r.status === "pending",
      ).length,
    }));
  }, [requests]);
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedRequests.map((r) => r.id));
    }
  };
  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300 ",
          label: "Kh\u1EA9n c\u1EA5p",
          icon: ShieldAlert,
        };
      case "high":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          label: "Cao",
          icon: AlertTriangle,
        };
      case "medium":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Trung b\xECnh",
          icon: Info,
        };
      case "low":
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          label: "Th\u1EA5p",
          icon: Clock,
        };
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          label: "\u0110\xE3 x\u1EED l\xFD",
          icon: CheckCircle2,
          dot: "bg-emerald-500",
        };
      case "rejected":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-200",
          label: "B\u1ECB t\u1EEB ch\u1ED1i",
          icon: XCircle,
          dot: "bg-rose-500",
        };
      case "need_info":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          label: "Ch\u1EDD b\u1ED5 sung",
          icon: HelpCircle,
          dot: "bg-blue-500",
        };
      case "pending":
      default:
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          label: "\u0110ang ch\u1EDD",
          icon: Clock,
          dot: "bg-amber-500",
        };
    }
  };
  const openProcessModal = (req, action) => {
    setSelectedRequest(req);
    setProcessActionType(action);
    setAdminNoteInput("");
    if (action === "reset_pass") {
      const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      setGeneratedTempPass(`InternLink@2026#${randStr}`);
    }
    setShowProcessModal(true);
  };
  const handleExecuteProcess = () => {
    if (!selectedRequest || !processActionType) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowProcessModal(false);
      let updatedStatus = "approved";
      let actionText = "";
      if (processActionType === "reject") {
        updatedStatus = "rejected";
        actionText = `T\u1EEB ch\u1ED1i y\xEAu c\u1EA7u ${selectedRequest.id}`;
      } else if (processActionType === "need_info") {
        updatedStatus = "need_info";
        actionText = `Y\xEAu c\u1EA7u b\u1ED5 sung th\xF4ng tin cho ${selectedRequest.id}`;
      } else if (processActionType === "reset_pass") {
        updatedStatus = "approved";
        actionText = `\u0110\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u t\u1EA1m (${generatedTempPass}) th\xE0nh c\xF4ng`;
      } else if (processActionType === "unlock") {
        updatedStatus = "approved";
        actionText = `M\u1EDF kh\xF3a t\xE0i kho\u1EA3n th\xE0nh c\xF4ng`;
      } else if (processActionType === "activate") {
        updatedStatus = "approved";
        actionText = `K\xEDch ho\u1EA1t t\xE0i kho\u1EA3n th\xE0nh c\xF4ng`;
      } else {
        updatedStatus = "approved";
        actionText = `Ph\xEA duy\u1EC7t y\xEAu c\u1EA7u ${selectedRequest.id}`;
      }
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === selectedRequest.id) {
            return {
              ...r,
              status: updatedStatus,
              processorName: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
              processedAt: /* @__PURE__ */ new Date().toLocaleString("vi-VN"),
              adminNote:
                adminNoteInput ||
                (processActionType === "reset_pass"
                  ? `M\u1EADt kh\u1EA9u m\u1EDBi: ${generatedTempPass}`
                  : "\u0110\xE3 x\xE1c th\u1EF1c v\xE0 ph\xEA duy\u1EC7t."),
            };
          }
          return r;
        }),
      );
      setActivityLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          requestId: selectedRequest.id,
          user: `${selectedRequest.requesterName} (${selectedRequest.role === "student" ? "SV" : selectedRequest.role === "lecturer" ? "GV" : "DN"})`,
          action: actionText,
          timestamp: "V\u1EEBa xong",
          type: updatedStatus,
        },
        ...prev,
      ]);
      onShowToast(
        `\u0110\xE3 x\u1EED l\xFD y\xEAu c\u1EA7u ${selectedRequest.id} th\xE0nh c\xF4ng!`,
      );
      setIsDetailOpen(false);
    }, 500);
  };
  const handleProvisionNewAccount = (e) => {
    e.preventDefault();
    if (!newAccCode.trim() || !newAccName.trim() || !newAccEmail.trim()) {
      onShowToast(
        "Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 M\xE3, H\u1ECD t\xEAn v\xE0 Email ch\xEDnh th\u1EE9c.",
      );
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newAcc = {
        id: `ACC-${1e3 + userAccounts.length + 1}`,
        code: newAccCode.trim(),
        fullName: newAccName.trim(),
        email: newAccEmail.trim(),
        phone: newAccPhone.trim() || "0901234567",
        role: newAccRole,
        departmentOrOrg:
          newAccOrg.trim() ||
          (newAccRole === "student"
            ? "Sinh vi\xEAn K20"
            : newAccRole === "lecturer"
              ? "Khoa CNTT"
              : "Doanh nghi\u1EC7p"),
        status: "active",
        createdAt: /* @__PURE__ */ new Date().toLocaleDateString("vi-VN"),
        lastLogin: "Ch\u01B0a \u0111\u0103ng nh\u1EADp",
      };
      setUserAccounts((prev) => [newAcc, ...prev]);
      setActivityLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          requestId: "C\u1EA4P-M\u1EDAI",
          user: `${newAcc.fullName} (${newAcc.role})`,
          action: `C\u1EA5p ph\xE1t t\xE0i kho\u1EA3n m\u1EDBi (${newAcc.code}) th\xE0nh c\xF4ng. ${newAccSendMail ? "\u0110\xE3 g\u1EEDi email th\xF4ng b\xE1o k\xEDch ho\u1EA1t." : ""}`,
          timestamp: "V\u1EEBa xong",
          type: "provisioned",
        },
        ...prev,
      ]);
      onShowToast(
        `\u0110\xE3 c\u1EA5p ph\xE1t t\xE0i kho\u1EA3n m\u1EDBi cho ${newAcc.fullName} (${newAcc.code}) th\xE0nh c\xF4ng!`,
      );
      setShowProvisionModal(false);
      setNewAccCode("");
      setNewAccName("");
      setNewAccEmail("");
      setNewAccPhone("");
      setNewAccOrg("");
    }, 500);
  };
  const handleToggleAccountLock = (account) => {
    const isLocking = account.status === "active";
    const newStatus = isLocking ? "locked" : "active";
    setUserAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, status: newStatus } : a)),
    );
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        requestId: account.code,
        user: `${account.fullName} (${account.code})`,
        action: isLocking
          ? `Kh\xF3a t\xE0i kho\u1EA3n h\u1EC7 th\u1ED1ng`
          : `M\u1EDF kh\xF3a t\xE0i kho\u1EA3n h\u1EC7 th\u1ED1ng`,
        timestamp: "V\u1EEBa xong",
        type: isLocking ? "locked" : "unlocked",
      },
      ...prev,
    ]);
    onShowToast(
      `\u0110\xE3 ${isLocking ? "kh\xF3a" : "m\u1EDF kh\xF3a"} t\xE0i kho\u1EA3n ${account.fullName} th\xE0nh c\xF4ng!`,
    );
  };
  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      onShowToast(
        "Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 01 y\xEAu c\u1EA7u \u0111\u1EC3 x\u1EED l\xFD \u0111\u1ED3ng lo\u1EA1t.",
      );
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRequests((prev) =>
        prev.map((r) => {
          if (selectedIds.includes(r.id)) {
            return {
              ...r,
              status: "approved",
              processorName: "Super Admin (X\u1EED l\xFD h\xE0ng lo\u1EA1t)",
              processedAt: /* @__PURE__ */ new Date().toLocaleString("vi-VN"),
              adminNote:
                "Ph\xEA duy\u1EC7t h\xE0ng lo\u1EA1t t\u1EF1 \u0111\u1ED9ng b\u1EDFi Super Admin.",
            };
          }
          return r;
        }),
      );
      onShowToast(
        `\u0110\xE3 ph\xEA duy\u1EC7t h\xE0ng lo\u1EA1t ${selectedIds.length} y\xEAu c\u1EA7u t\xE0i kho\u1EA3n!`,
      );
      setSelectedIds([]);
    }, 600);
  };
  const handleExportExcel = () => {
    onShowToast(
      "\u0110\xE3 xu\u1EA5t B\xE1o c\xE1o Y\xEAu c\u1EA7u & T\xE0i kho\u1EA3n (.xlsx) th\xE0nh c\xF4ng!",
    );
  };
  const handleExportPdf = () => {
    onShowToast(
      "\u0110\xE3 xu\u1EA5t Nh\u1EADt k\xFD X\u1EED l\xFD T\xE0i kho\u1EA3n (.pdf) th\xE0nh c\xF4ng!",
    );
  };
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onShowToast(
        "\u0110\xE3 l\xE0m m\u1EDBi d\u1EEF li\u1EC7u t\xE0i kho\u1EA3n v\xE0 y\xEAu c\u1EA7u m\u1EDBi nh\u1EA5t!",
      );
    }, 400);
  };
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto min-w-0 max-w-full overflow-hidden">
      <PageHeader
        icon={KeyRound}
        title="Quản lý Yêu cầu & Cấp phát Tài khoản"
        actions={[
          {
            label: "Excel",
            icon: FileSpreadsheet,
            onClick: handleExportExcel,
            variant: "secondary",
          },
          {
            label: "Cấp tài khoản mới",
            icon: UserPlus,
            onClick: () => setShowProvisionModal(true),
            variant: "primary",
          },
        ]}
      >
        <button
          type="button"
          onClick={handleBatchApprove}
          disabled={selectedIds.length === 0}
          className="il-btn il-btn-secondary il-btn-press disabled:opacity-40"
        >
          <CheckSquare className="w-4 h-4 text-blue-600" />
          <span>Xử lý ({selectedIds.length})</span>
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="il-btn il-btn-secondary il-btn-press p-2 disabled:opacity-50"
          title="Làm mới"
          aria-label="Làm mới"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`}
          />
        </button>
      </PageHeader>

      {/* MAIN VIEW MODE NAV TABS */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-lg border border-slate-200 text-xs font-bold max-w-full overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveMainTab("requests")}
          className={`px-4 py-2.5 rounded-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${activeMainTab === "requests" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
        >
          <KeyRound className="w-4 h-4 shrink-0" />
          <span>Hàng đợi yêu cầu</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
              {pendingCount} chờ
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab("directory")}
          className={`px-4 py-2.5 rounded-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${activeMainTab === "directory" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Danh sách &amp; Cấp phát tài khoản</span>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-full">
            {totalAccountsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab("logs")}
          className={`px-4 py-2.5 rounded-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${activeMainTab === "logs" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
        >
          <History className="w-4 h-4 shrink-0" />
          <span>Nhật ký hệ thống &amp; Kiểm toán</span>
        </button>
      </div>

      <KpiGrid>
        <KpiCard
          tone="blue"
          title="Tổng yêu cầu"
          value={totalCount}
          unit="yêu cầu"
          icon={Layers}
          footer="Toàn hệ thống"
        />
        <KpiCard
          tone="amber"
          title="Đang chờ xử lý"
          value={pendingCount}
          unit="yêu cầu"
          icon={Clock}
          footer="Cần đối soát"
        />
        <KpiCard
          tone="emerald"
          title="Đã phê duyệt"
          value={approvedCount}
          unit="yêu cầu"
          icon={CheckCircle2}
          footer="Thành công 95%"
        />
        <KpiCard
          tone="rose"
          title="Bị từ chối"
          value={rejectedCount}
          unit="yêu cầu"
          icon={XCircle}
          footer="Cần bổ sung hồ sơ"
        />
      </KpiGrid>

      {/* TAB 1: ACCOUNT REQUESTS QUEUE */}
      {activeMainTab === "requests" && (
        <div className="space-y-6">
          {/* REQUEST CATEGORIES GRID */}
          <Panel className="space-y-3 max-w-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Danh mục loại yêu cầu tài khoản
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                Bấm để lọc nhanh
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {categoryCounts.map((cat) => {
                const isSelected = typeFilter === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setTypeFilter(isSelected ? "all" : cat.name);
                      setCurrentPage(1);
                    }}
                    className={`p-2.5 rounded-md border text-left transition-all relative overflow-hidden ${isSelected ? "bg-blue-600 text-white border-blue-600 shadow-sm scale-[1.02]" : "bg-slate-50/70 hover:bg-slate-100/80 text-slate-800 border-slate-200/80"}`}
                  >
                    <p
                      className={`text-[10px] font-bold truncate ${isSelected ? "text-white" : "text-slate-800"}`}
                    >
                      {cat.name}
                    </p>
                    <div className="flex items-baseline justify-between mt-1">
                      <span
                        className={`text-base font-bold ${isSelected ? "text-white" : "text-slate-900"}`}
                      >
                        {cat.count}
                      </span>
                      {cat.pending > 0 && (
                        <span
                          className={`text-[9px] font-bold px-1 rounded ${isSelected ? "bg-amber-400 text-slate-900" : "bg-amber-100 text-amber-800"}`}
                        >
                          {cat.pending}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* MAIN CONTENT AREA & RIGHT SIDEBAR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0 max-w-full">
            {/* LEFT COLUMN: REQUEST QUEUE TABLE */}
            <div className="lg:col-span-8 space-y-6 min-w-0 max-w-full">
              <Panel className="space-y-4 max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-blue-600" />
                      Hàng đợi yêu cầu tài khoản ({filteredRequests.length})
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Danh sách các yêu cầu quên mật khẩu, mở khóa, đổi thông
                      tin từ người dùng.
                    </p>
                  </div>

                  {selectedIds.length > 0 && (
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-md border border-blue-200 text-xs font-bold flex items-center gap-2">
                      <span>
                        Đã chọn: <strong>{selectedIds.length}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedIds([])}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="relative sm:col-span-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Mã YC, Tên, MSSV, Email..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">Tất cả Vai trò</option>
                    <option value="student">Sinh viên</option>
                    <option value="lecturer">Giảng viên</option>
                    <option value="enterprise">Doanh nghiệp</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">Tất cả Trạng thái</option>
                    <option value="pending">Đang chờ xử lý</option>
                    <option value="approved">Đã phê duyệt</option>
                    <option value="need_info">Chờ bổ sung thông tin</option>
                    <option value="rejected">Bị từ chối</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => {
                      setPriorityFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">Tất cả Mức ưu tiên</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="high">Mức độ Cao</option>
                    <option value="medium">Mức độ Trung bình</option>
                    <option value="low">Mức độ Thấp</option>
                  </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-200/80 rounded-md">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 w-8">
                          <button
                            onClick={toggleSelectAll}
                            className="text-slate-500 hover:text-slate-800"
                          >
                            {selectedIds.length === paginatedRequests.length &&
                            paginatedRequests.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="py-2.5 px-3">Mã &amp; Người gửi</th>
                        <th className="py-2.5 px-3 text-center">Vai trò</th>
                        <th className="py-2.5 px-3">Loại yêu cầu</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3 text-center">Ưu tiên</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                        <th className="py-2.5 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRequests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="py-8 text-center text-slate-400 font-medium"
                          >
                            Không tìm thấy yêu cầu tài khoản nào phù hợp bộ lọc.
                          </td>
                        </tr>
                      ) : (
                        paginatedRequests.map((req) => {
                          const isChecked = selectedIds.includes(req.id);
                          const priorityBadge = getPriorityBadge(req.priority);
                          const statusBadge = getStatusBadge(req.status);
                          const PriorityIcon = priorityBadge.icon;
                          return (
                            <tr
                              key={req.id}
                              className={`hover:bg-slate-50/80 transition-colors ${isChecked ? "bg-blue-50/30" : ""}`}
                            >
                              <td className="py-3 px-3">
                                <button
                                  onClick={() => toggleSelectOne(req.id)}
                                  className="text-slate-400 hover:text-blue-600"
                                >
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${req.role === "lecturer" ? "bg-slate-100 text-slate-700 border-slate-200" : req.role === "enterprise" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                                  >
                                    {
                                      req.requesterName
                                        .split(" ")
                                        .slice(-1)[0][0]
                                    }
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-slate-900">
                                        {req.requesterName}
                                      </span>
                                      <span className="text-[10px] font-mono font-bold text-slate-400">
                                        ({req.requesterCode})
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium block">
                                      {req.email}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${req.role === "lecturer" ? "bg-slate-100 text-slate-800 border-slate-200" : req.role === "enterprise" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-blue-50 text-blue-800 border-blue-200"}`}
                                >
                                  {req.role === "lecturer"
                                    ? "Gi\u1EA3ng vi\xEAn"
                                    : req.role === "enterprise"
                                      ? "Doanh nghi\u1EC7p"
                                      : "Sinh vi\xEAn"}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-bold text-slate-800 block text-xs">
                                  {req.requestType}
                                </span>
                                <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[180px]">
                                  {req.description}
                                </span>
                              </td>

                              <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                                {req.createdAt}
                              </td>

                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 ${priorityBadge.bg}`}
                                >
                                  <PriorityIcon className="w-3 h-3" />
                                  <span>{priorityBadge.label}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 ${statusBadge.bg}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}
                                  />
                                  <span>{statusBadge.label}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setIsDetailOpen(true);
                                    }}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Xem</span>
                                  </button>

                                  {req.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        openProcessModal(
                                          req,
                                          req.requestType ===
                                            "Qu\xEAn m\u1EADt kh\u1EA9u"
                                            ? "reset_pass"
                                            : req.requestType ===
                                                "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n"
                                              ? "unlock"
                                              : "approve",
                                        )
                                      }
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Xử lý</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-medium">
                      Hiển thị {paginatedRequests.length} /{" "}
                      {filteredRequests.length} yêu cầu
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

                  <div className="flex items-center gap-1.5 font-bold">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Panel>
            </div>

            {/* RIGHT SIDEBAR WIDGETS */}
            <div className="lg:col-span-4 space-y-6">
              {/* Urgent Pending Widget */}
              <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[11px] font-bold uppercase text-amber-700 tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" /> Cần xử lý gấp (
                    {pendingCount})
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
                    Khẩn
                  </span>
                </div>

                <div className="space-y-2.5">
                  {requests
                    .filter((r) => r.status === "pending")
                    .slice(0, 3)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-3 bg-amber-50/40 rounded-md border border-amber-200/80 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {req.requesterName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {req.id}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{req.requestType}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-2">
                          {req.description}
                        </p>
                        <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-amber-100">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsDetailOpen(true);
                            }}
                            className="px-2 py-0.5 bg-white text-slate-700 font-bold text-[10px] rounded-md border border-slate-200 hover:bg-slate-50"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() =>
                              openProcessModal(
                                req,
                                req.requestType === "Qu\xEAn m\u1EADt kh\u1EA9u"
                                  ? "reset_pass"
                                  : "approve",
                              )
                            }
                            className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-md hover:bg-emerald-700 shadow-2xs"
                          >
                            Duyệt ngay
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Security Alert Card */}
              <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-rose-600" /> Cảnh báo an ninh
                    tài khoản
                  </span>
                </div>

                <div className="p-3 bg-rose-50/60 rounded-md border border-rose-100 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Nhập sai mật khẩu liên tiếp</span>
                  </div>
                  <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                    Tài khoản GV001 (TS. Nguyễn Văn Phước) đã bị khóa tự động do
                    5 lần nhập sai từ địa chỉ IP lạ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNT DIRECTORY & PROVISIONING */}
      {activeMainTab === "directory" && (
        <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4 max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Danh mục tài khoản người dùng ({filteredAccounts.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Quản lý trạng thái tài khoản sinh viên, giảng viên, cán bộ doanh
                nghiệp và quản trị viên.
              </p>
            </div>

            <button
              onClick={() => setShowProvisionModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4 text-blue-200" />
              <span>Cấp tài khoản mới</span>
            </button>
          </div>

          {/* Directory Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={dirSearch}
                onChange={(e) => setDirSearch(e.target.value)}
                placeholder="Tìm tên, mã, email, tổ chức..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <select
              value={dirRoleFilter}
              onChange={(e) => setDirRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả Vai trò</option>
              <option value="student">Sinh viên</option>
              <option value="lecturer">Giảng viên</option>
              <option value="enterprise">Doanh nghiệp</option>
              <option value="admin">Quản trị viên</option>
            </select>

            <select
              value={dirStatusFilter}
              onChange={(e) => setDirStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="active">Đang hoạt động (Active)</option>
              <option value="locked">Đang bị khóa (Locked)</option>
              <option value="inactive">Chưa kích hoạt (Inactive)</option>
            </select>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-md">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Tài khoản &amp; Mã</th>
                  <th className="py-2.5 px-3 text-center">Vai trò</th>
                  <th className="py-2.5 px-3">Lớp / Đơn vị công tác</th>
                  <th className="py-2.5 px-3">Email &amp; SĐT</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                  <th className="py-2.5 px-3">Đăng nhập gần nhất</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-slate-400 font-medium"
                    >
                      Không tìm thấy tài khoản nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${acc.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-200" : acc.role === "lecturer" ? "bg-slate-100 text-slate-700 border-slate-200" : acc.role === "enterprise" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                          >
                            {acc.fullName.split(" ").slice(-1)[0][0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {acc.fullName}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              {acc.code} • {acc.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${acc.role === "admin" ? "bg-rose-50 text-rose-800 border-rose-200" : acc.role === "lecturer" ? "bg-slate-100 text-slate-800 border-slate-200" : acc.role === "enterprise" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-blue-50 text-blue-800 border-blue-200"}`}
                        >
                          {acc.role === "admin"
                            ? "Qu\u1EA3n tr\u1ECB vi\xEAn"
                            : acc.role === "lecturer"
                              ? "Gi\u1EA3ng vi\xEAn"
                              : acc.role === "enterprise"
                                ? "Doanh nghi\u1EC7p"
                                : "Sinh vi\xEAn"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {acc.departmentOrOrg}
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium block">
                          {acc.email}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {acc.phone}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {acc.status === "active" && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            Hoạt động
                          </span>
                        )}
                        {acc.status === "locked" && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold">
                            Bị khóa
                          </span>
                        )}
                        {acc.status === "inactive" && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold">
                            Chưa kích hoạt
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                        {acc.lastLogin}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleAccountLock(acc)}
                            className={`p-1.5 rounded-lg border font-bold text-[10px] transition-colors ${acc.status === "active" ? "bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-200" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"}`}
                            title={
                              acc.status === "active"
                                ? "Kh\xF3a t\xE0i kho\u1EA3n"
                                : "M\u1EDF kh\xF3a"
                            }
                          >
                            {acc.status === "active" ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              const randStr = Math.random()
                                .toString(36)
                                .substring(2, 6)
                                .toUpperCase();
                              const pass = `InternLink@2026#${randStr}`;
                              onShowToast(
                                `\u0110\xE3 c\u1EA5p l\u1EA1i m\u1EADt kh\u1EA9u t\u1EA1m cho ${acc.fullName}: ${pass}`,
                              );
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-lg border border-slate-200 transition-colors"
                            title="Đặt lại mật khẩu tạm"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT & ACTIVITY LOGS */}
      {activeMainTab === "logs" && (
        <Panel className="space-y-4 max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Nhật ký kiểm toán &amp; Xử lý hệ thống (System Audit Logs)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Lưu toàn bộ lịch sử khởi tạo, duyệt yêu cầu, đổi mật khẩu và
                thay đổi quyền hạn tài khoản.
              </p>
            </div>

            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-md border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Xuất nhật ký PDF</span>
            </button>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 relative z-10 pl-1"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold shadow-2xs ${log.type === "approved" || log.type === "provisioned" || log.type === "unlocked" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : log.type === "rejected" || log.type === "locked" ? "bg-rose-50 text-rose-700 border-rose-200" : log.type === "need_info" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                >
                  {log.type === "approved" ||
                  log.type === "provisioned" ||
                  log.type === "unlocked" ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : log.type === "rejected" || log.type === "locked" ? (
                    <X className="w-3.5 h-3.5" />
                  ) : (
                    <Info className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex-1 bg-slate-50/80 p-3 rounded-md border border-slate-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{log.action}</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                    Mã tham chiếu / YC: <strong>{log.requestId}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* REQUEST DETAIL DRAWER */}
      {isDetailOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-md flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-md shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedRequest.id}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(selectedRequest.status).bg}`}
                    >
                      {getStatusBadge(selectedRequest.status).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Chi tiết hồ sơ yêu cầu xử lý tài khoản
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Thông tin người gửi (Requester Info)
                </span>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg font-bold text-base flex items-center justify-center shrink-0 border ${selectedRequest.role === "lecturer" ? "bg-slate-100 text-slate-800 border-slate-200" : selectedRequest.role === "enterprise" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-blue-100 text-blue-800 border-blue-200"}`}
                  >
                    {selectedRequest.requesterName.split(" ").slice(-1)[0][0]}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedRequest.requesterName}
                      </h4>
                      <span className="font-mono text-slate-500 font-bold">
                        ({selectedRequest.requesterCode})
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">
                      {selectedRequest.departmentOrClass}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRequest.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedRequest.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Nội dung chi tiết yêu cầu
                </span>

                <div className="p-4 bg-white rounded-md border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedRequest.requestType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedRequest.createdAt}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedRequest.description}
                  </p>
                </div>

                {selectedRequest.requestedChanges &&
                  selectedRequest.requestedChanges.length > 0 && (
                    <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">
                        Thay đổi đề xuất
                      </span>
                      {selectedRequest.requestedChanges.map((chg, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] font-medium"
                        >
                          <span className="text-slate-600">{chg.field}:</span>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-rose-600 line-through">
                              {chg.oldValue}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="text-emerald-700 font-bold">
                              {chg.newValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {selectedRequest.attachmentName && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Minh chứng đính kèm
                  </span>
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-800">
                        {selectedRequest.attachmentName}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        onShowToast(
                          `\u0110ang m\u1EDF xem minh ch\u1EE9ng ${selectedRequest.attachmentName}...`,
                        )
                      }
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200"
                    >
                      Xem đính kèm
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Ghi chú của Quản trị viên
                </span>
                <p className="p-3 bg-slate-50 rounded-md border border-slate-200 font-medium text-slate-700 italic">
                  {selectedRequest.adminNote ||
                    "Ch\u01B0a c\xF3 ghi ch\xFA n\u1ED9i b\u1ED9."}
                </p>
                {selectedRequest.processorName && (
                  <p className="text-[10px] text-slate-400 text-right">
                    Xử lý bởi: <strong>{selectedRequest.processorName}</strong>{" "}
                    ({selectedRequest.processedAt})
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => openProcessModal(selectedRequest, "reject")}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-md border border-rose-200 transition-colors"
              >
                Từ chối
              </button>

              <button
                onClick={() => openProcessModal(selectedRequest, "need_info")}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-md border border-blue-200 transition-colors"
              >
                Yêu cầu bổ sung
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {selectedRequest.requestType ===
                  "Qu\xEAn m\u1EADt kh\u1EA9u" && (
                  <button
                    onClick={() =>
                      openProcessModal(selectedRequest, "reset_pass")
                    }
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Đặt lại mật khẩu</span>
                  </button>
                )}

                {selectedRequest.requestType ===
                  "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n" && (
                  <button
                    onClick={() => openProcessModal(selectedRequest, "unlock")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Mở khóa ngay</span>
                  </button>
                )}

                <button
                  onClick={() => openProcessModal(selectedRequest, "approve")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Phê duyệt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS ACTION MODAL */}
      {showProcessModal && selectedRequest && processActionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {processActionType === "reset_pass" &&
                  "\u0110\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u t\u1EA1m"}
                {processActionType === "unlock" &&
                  "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n"}
                {processActionType === "activate" &&
                  "K\xEDch ho\u1EA1t t\xE0i kho\u1EA3n"}
                {processActionType === "approve" &&
                  "X\xE1c nh\u1EADn ph\xEA duy\u1EC7t y\xEAu c\u1EA7u"}
                {processActionType === "reject" &&
                  "T\u1EEB ch\u1ED1i y\xEAu c\u1EA7u t\xE0i kho\u1EA3n"}
                {processActionType === "need_info" &&
                  "G\u1EEDi y\xEAu c\u1EA7u b\u1ED5 sung th\xF4ng tin"}
              </h3>
              <button
                onClick={() => setShowProcessModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {processActionType === "reset_pass" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 font-medium">
                  Mật khẩu tạm thời đã được khởi tạo tự động. Mật khẩu này sẽ có
                  hiệu lực trong vòng 24 giờ.
                </p>
                <div className="p-3 bg-slate-100 rounded-md font-mono text-center text-sm font-bold text-slate-900 flex items-center justify-between border border-slate-200">
                  <span>{generatedTempPass}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedTempPass);
                      onShowToast(
                        "\u0110\xE3 sao ch\xE9p m\u1EADt kh\u1EA9u t\u1EA1m v\xE0o clipboard!",
                      );
                    }}
                    className="p-1 hover:bg-white rounded"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-700">
                Ghi chú nội bộ / Phản hồi gửi người dùng:
              </label>
              <textarea
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Nhập ghi chú xử lý hoặc lý do..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowProcessModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleExecuteProcess}
                disabled={isLoading}
                className={`px-4 py-2 font-bold text-xs rounded-md text-white shadow-2xs flex items-center gap-1.5 ${processActionType === "reject" ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Xác nhận thực hiện</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROVISION NEW ACCOUNT MODAL */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cấp phát tài khoản mới
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Khởi tạo tài khoản cho Sinh viên, Giảng viên hoặc Doanh
                    nghiệp
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleProvisionNewAccount}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Mã định danh (MSSV/MSGV/Mã DN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccCode}
                    onChange={(e) => setNewAccCode(e.target.value)}
                    placeholder="VD: 20110299 hoặc GV010"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Vai trò người dùng *
                  </label>
                  <select
                    value={newAccRole}
                    onChange={(e) => setNewAccRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                  >
                    <option value="student">Sinh viên</option>
                    <option value="lecturer">Giảng viên hướng dẫn</option>
                    <option value="enterprise">
                      Cán bộ Doanh nghiệp (Mentor)
                    </option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Họ và tên người dùng *
                </label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Anh"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Email chính thức *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                    placeholder="VD: email@hcmute.edu.vn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={newAccPhone}
                    onChange={(e) => setNewAccPhone(e.target.value)}
                    placeholder="VD: 0901234567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Lớp / Bộ môn / Tên doanh nghiệp
                </label>
                <input
                  type="text"
                  value={newAccOrg}
                  onChange={(e) => setNewAccOrg(e.target.value)}
                  placeholder="VD: Lớp 20CNTT1 • Khoa CNTT hoặc FPT Software"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">
                    Tự động gửi mail thông báo
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Gửi liên kết kích hoạt và mật khẩu khởi tạo qua Email.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newAccSendMail}
                  onChange={(e) => setNewAccSendMail(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>Cấp tài khoản</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { AccountRequestsView as AdminAccountRequestsView };
