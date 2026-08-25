import { useState, useMemo, useEffect } from "react";
import {
  Users,
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
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  GraduationCap,
  FileUp,
  Check,
} from "lucide-react";
import { CreateLecturerModal } from "../components/modals/CreateLecturerModal";
import type { CreateLecturerFormPayload } from "../components/modals/CreateLecturerModal";
import { EditLecturerModal } from "../components/modals/EditLecturerModal";
import type {
  EditLecturerFormPayload,
  LecturerRowForEdit,
} from "../components/modals/EditLecturerModal";
import { PageHeader } from "../../../components/common/PageHeader";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Panel } from "../../../components/common/Panel";
import { Toolbar } from "../../../components/common/Toolbar";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import {
  buildAssignmentMaps,
  mapLecturerDtoToRow,
} from "../../../lib/adminMappers";
import { adminAssignmentsService } from "../../../services/adminAssignments.service";
import { adminLecturersService } from "../../../services/adminLecturers.service";
import { adminUsersService } from "../../../services/adminUsers.service";
export const LecturersView = ({
  onShowToast,
  onNavigateTab,
}: {
  onShowToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}) => {
  const [isLoadingApi, setIsLoadingApi] = useState(!USE_MOCK);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<LecturerRowForEdit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LecturerRowForEdit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<
    (typeof lecturers)[number] | null
  >(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGenerateAccountsModalOpen, setIsGenerateAccountsModalOpen] =
    useState(false);
  const [lecturers, setLecturers] = useState([
    {
      id: "lec-1",
      employeeId: "GV001",
      fullName: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      academicDegree: "TS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
      email: "phuoc.nv@fit.edu.vn",
      phone: "0908 123 456",
      currentCount: 32,
      maxCapacity: 40,
      accountStatus: "active",
      guidanceStatus: "guiding",
      lastLogin: "02/08/2026 09:15",
      assignedStudents: [
        {
          studentId: "20110201",
          name: "Nguy\u1EC5n V\u0103n Minh",
          classCode: "20CNTT1",
          company: "FPT Software HCM",
        },
        {
          studentId: "20110202",
          name: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o",
          classCode: "20CNTT1",
          company: "VNG Corporation",
        },
        {
          studentId: "20110205",
          name: "L\xEA Ho\xE0ng Nam",
          classCode: "20KTPM1",
          company: "Viettel Telecom",
        },
      ],
    },
    {
      id: "lec-2",
      employeeId: "GV005",
      fullName: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh",
      academicDegree: "ThS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
      email: "maianh.tt@fit.edu.vn",
      phone: "0912 345 678",
      currentCount: 38,
      maxCapacity: 40,
      accountStatus: "active",
      guidanceStatus: "full",
      lastLogin: "01/08/2026 16:40",
      assignedStudents: [
        {
          studentId: "20110208",
          name: "Ph\u1EA1m \u0110\u0103ng Khoa",
          classCode: "20KTPM2",
          company: "MGM Technology",
        },
      ],
    },
    {
      id: "lec-3",
      employeeId: "GV008",
      fullName: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i",
      academicDegree: "PGS.TS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "M\u1EA1ng m\xE1y t\xEDnh & TTTT",
      email: "thai.lh@fit.edu.vn",
      phone: "0903 888 999",
      currentCount: 15,
      maxCapacity: 35,
      accountStatus: "active",
      guidanceStatus: "guiding",
      lastLogin: "02/08/2026 11:05",
      assignedStudents: [
        {
          studentId: "20110212",
          name: "V\u0169 Ng\u1ECDc B\u1EA3o Tr\xE2m",
          classCode: "20MMT1",
          company: "TMA Solutions",
        },
      ],
    },
    {
      id: "lec-4",
      employeeId: "GV012",
      fullName: "TS. \u0110\u1EB7ng Minh Ch\xE2u",
      academicDegree: "TS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "H\u1EC7 th\u1ED1ng Th\xF4ng tin",
      email: "chaudm@fit.edu.vn",
      phone: "0988 777 666",
      currentCount: 0,
      maxCapacity: 40,
      accountStatus: "pending",
      guidanceStatus: "available",
      lastLogin: "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
    },
    {
      id: "lec-5",
      employeeId: "GV018",
      fullName: "ThS. Ph\u1EA1m Qu\u1ED1c B\u1EA3o",
      academicDegree: "ThS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
      email: "baopq@fit.edu.vn",
      phone: "0977 111 222",
      currentCount: 10,
      maxCapacity: 30,
      accountStatus: "active",
      guidanceStatus: "guiding",
      lastLogin: "30/07/2026 14:20",
    },
    {
      id: "lec-6",
      employeeId: "GV022",
      fullName: "TS. V\u0169 \u0110\xECnh Khoa",
      academicDegree: "TS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "M\u1EA1ng m\xE1y t\xEDnh & TTTT",
      email: "khoavd@fit.edu.vn",
      phone: "0933 444 555",
      currentCount: 0,
      maxCapacity: 40,
      accountStatus: "pending",
      guidanceStatus: "available",
      lastLogin: "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
    },
    {
      id: "lec-7",
      employeeId: "GV025",
      fullName: "ThS. Ho\xE0ng Th\u1ECB Thanh",
      academicDegree: "ThS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "Khoa h\u1ECDc M\xE1y t\xEDnh",
      email: "thanhht@fit.edu.vn",
      phone: "0918 222 333",
      currentCount: 0,
      maxCapacity: 35,
      accountStatus: "locked",
      guidanceStatus: "available",
      lastLogin: "15/05/2026 (\u0110\xE3 kh\xF3a)",
    },
    {
      id: "lec-8",
      employeeId: "GV029",
      fullName: "TS. B\xF9i Minh Ti\u1EBFn",
      academicDegree: "TS",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      department: "H\u1EC7 th\u1ED1ng Th\xF4ng tin",
      email: "tienbm@fit.edu.vn",
      phone: "0909 555 123",
      currentCount: 22,
      maxCapacity: 40,
      accountStatus: "active",
      guidanceStatus: "guiding",
      lastLogin: "02/08/2026 08:30",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importFileName, setImportFileName] = useState(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const fetchLecturerRows = async () => {
    const dtos = await adminLecturersService.getAll();
    const assignmentGroups = await Promise.all(
      dtos.map((l) =>
        adminAssignmentsService.getByLecturer(l.id).catch(() => []),
      ),
    );
    const { lecturerCounts } = buildAssignmentMaps(dtos, assignmentGroups);
    return dtos.map((l) =>
      mapLecturerDtoToRow(l, lecturerCounts.get(l.id) ?? 0),
    );
  };

  const reloadLecturers = async () => {
    const rows = await fetchLecturerRows();
    setLecturers(rows);
  };

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      setIsLoadingApi(true);
      try {
        const rows = await fetchLecturerRows();
        if (!cancelled) setLecturers(rows);
      } catch (err) {
        onShowToast(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoadingApi(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onShowToast]);

  const handleAddLecturer = async (payload: CreateLecturerFormPayload) => {
    if (USE_MOCK) {
      const newLec = {
        id: "lec-" + Date.now(),
        employeeId: payload.staffCode,
        fullName: payload.fullName,
        academicDegree: "—",
        faculty: payload.department ?? "—",
        department: payload.department ?? "—",
        email: payload.email ?? "—",
        phone: payload.phone ?? "—",
        currentCount: 0,
        maxCapacity: 40,
        accountStatus: payload.grantAccount ? "active" : "pending",
        guidanceStatus: "available",
        lastLogin: payload.grantAccount ? "Chưa từng đăng nhập" : "Chưa cấp tài khoản",
      };
      setLecturers((prev) => [newLec, ...prev]);
      return;
    }
    try {
      await adminLecturersService.create({
        staffCode: payload.staffCode,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        department: payload.department,
        grantAccount: payload.grantAccount,
      });
      await reloadLecturers();
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
      throw err;
    }
  };

  const handleUpdateLecturer = async (
    id: string,
    payload: EditLecturerFormPayload,
  ) => {
    const existing = lecturers.find((l) => l.id === id);
    if (!existing) return;

    if (USE_MOCK) {
      setLecturers((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                fullName: payload.fullName,
                email: payload.email ?? "—",
                phone: payload.phone ?? "—",
                department: payload.department ?? "—",
                accountStatus: l.accountStatus,
              }
            : l,
        ),
      );
      return;
    }

    try {
      await adminLecturersService.update(id, {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        department: payload.department,
      });
      await reloadLecturers();
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
      throw err;
    }
  };

  const handleDeleteLecturer = async (lec: LecturerRowForEdit) => {
    if (USE_MOCK) {
      setLecturers((prev) => prev.filter((l) => l.id !== lec.id));
      onShowToast(`Đã xóa ${lec.fullName}`);
      return;
    }

    try {
      await adminLecturersService.delete(lec.id);
      if (selectedLecturer?.id === lec.id) setSelectedLecturer(null);
      if (editingLecturer?.id === lec.id) setEditingLecturer(null);
      await reloadLecturers();
      onShowToast(`Đã xóa ${lec.fullName}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  const confirmDeleteLecturer = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await handleDeleteLecturer(deleteTarget);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalLecturers = lecturers.length;
  const activeLecturers = lecturers.filter(
    (l) => l.accountStatus === "active",
  ).length;
  const pendingAccounts = lecturers.filter(
    (l) => l.accountStatus === "pending",
  ).length;
  const guidingLecturers = lecturers.filter((l) => l.currentCount > 0).length;
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((l) => {
      const matchSearch =
        l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = deptFilter === "all" || l.department === deptFilter;
      const matchAccount =
        accountStatusFilter === "all" ||
        l.accountStatus === accountStatusFilter;
      return matchSearch && matchDept && matchAccount;
    });
  }, [lecturers, searchQuery, deptFilter, accountStatusFilter]);
  const totalPages = Math.ceil(filteredLecturers.length / pageSize) || 1;
  const paginatedLecturers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLecturers.slice(start, start + pageSize);
  }, [filteredLecturers, currentPage, pageSize]);
  const isAllPageSelected =
    paginatedLecturers.length > 0 &&
    paginatedLecturers.every((l) => selectedIds.includes(l.id));
  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedLecturers.some((pl) => pl.id === id)),
      );
    } else {
      const pageIds = paginatedLecturers.map((l) => l.id);
      setSelectedIds((prev) =>
        Array.from(/* @__PURE__ */ new Set([...prev, ...pageIds])),
      );
    }
  };
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const handleQuickGrantSingle = async (lec) => {
    if (USE_MOCK) {
      setLecturers((prev) =>
        prev.map((l) =>
          l.id === lec.id
            ? {
                ...l,
                accountStatus: "active",
                lastLogin: "Vừa cấp tài khoản",
              }
            : l,
        ),
      );
      onShowToast(
        `Đã cấp tài khoản nhanh cho giảng viên ${lec.fullName} (${lec.employeeId})`,
      );
      return;
    }
    try {
      await adminLecturersService.update(lec.id, {
        fullName: lec.fullName,
        email: lec.email !== "—" ? lec.email : undefined,
        phone: lec.phone !== "—" ? lec.phone : undefined,
        department: lec.department !== "—" ? lec.department : undefined,
        grantAccount: true,
      });
      await reloadLecturers();
      onShowToast(
        lec.email !== "—"
          ? `Đã cấp tài khoản ${lec.employeeId} — email mời đã gửi (nếu SMTP bật)`
          : `Đã cấp tài khoản ${lec.employeeId} — chưa có email để gửi mật khẩu`,
      );
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };
  const handleBatchGenerateAccounts = async () => {
    const targetIds =
      selectedIds.length > 0
        ? selectedIds
        : lecturers
            .filter((l) => l.accountStatus === "pending")
            .map((l) => l.id);
    if (USE_MOCK) {
      setLecturers((prev) =>
        prev.map((l) => {
          if (targetIds.includes(l.id)) {
            return {
              ...l,
              accountStatus: "active",
              lastLogin: "Vừa cấp tài khoản",
            };
          }
          return l;
        }),
      );
      onShowToast(
        `Đã cấp tài khoản thành công cho ${targetIds.length} giảng viên`,
      );
      setIsGenerateAccountsModalOpen(false);
      setSelectedIds([]);
      return;
    }
    let ok = 0;
    let fail = 0;
    for (const id of targetIds) {
      const lec = lecturers.find((l) => l.id === id);
      if (!lec || lec.accountStatus !== "pending") continue;
      try {
        await adminLecturersService.update(lec.id, {
          fullName: lec.fullName,
          email: lec.email !== "—" ? lec.email : undefined,
          phone: lec.phone !== "—" ? lec.phone : undefined,
          department: lec.department !== "—" ? lec.department : undefined,
          grantAccount: true,
        });
        ok++;
      } catch {
        fail++;
      }
    }
    if (ok > 0) await reloadLecturers();
    onShowToast(
      fail > 0
        ? `Cấp tài khoản: ${ok} thành công, ${fail} lỗi`
        : `Đã cấp tài khoản thành công cho ${ok} giảng viên`,
    );
    setIsGenerateAccountsModalOpen(false);
    setSelectedIds([]);
  };
  const handleResetPassword = async (lec) => {
    if (USE_MOCK) {
      onShowToast(
        `Đã reset mật khẩu tạm (8 ký tự ngẫu nhiên) cho ${lec.fullName}`,
      );
      return;
    }
    const userId = (lec as { userId?: string | null }).userId;
    if (!userId) {
      onShowToast("Giảng viên chưa có tài khoản đăng nhập");
      return;
    }
    try {
      const res = await adminUsersService.resetPassword(userId);
      onShowToast(
        res.emailSent
          ? `Đã gửi email đặt lại mật khẩu cho ${lec.fullName}`
          : `Đã reset mật khẩu cho ${res.username}`,
      );
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };
  const handleToggleLockAccount = async (id) => {
    const lec = lecturers.find((l) => l.id === id);
    if (!lec) return;
    const newStatus = lec.accountStatus === "locked" ? "active" : "locked";
    if (USE_MOCK) {
      setLecturers((prev) =>
        prev.map((l) => {
          if (l.id === id) {
            onShowToast(
              `Đã ${newStatus === "locked" ? "khóa" : "mở khóa"} tài khoản của ${l.fullName}`,
            );
            return { ...l, accountStatus: newStatus };
          }
          return l;
        }),
      );
      return;
    }
    const userId = (lec as { userId?: string | null }).userId;
    if (!userId) {
      onShowToast("Giảng viên chưa có tài khoản đăng nhập");
      return;
    }
    try {
      await adminUsersService.update(userId, {
        fullName: lec.fullName,
        email: lec.email !== "—" ? lec.email : undefined,
        isActive: newStatus === "active",
      });
      setLecturers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, accountStatus: newStatus } : l)),
      );
      onShowToast(
        `Đã ${newStatus === "locked" ? "khóa" : "mở khóa"} tài khoản của ${lec.fullName}`,
      );
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };
  const handleFileDrop = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFileName(e.target.files[0].name);
      setImportFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    if (USE_MOCK) {
      onShowToast("Đã tải xuống file mẫu Danh_sach_Giang_vien_Template.xlsx");
      return;
    }
    try {
      await adminLecturersService.downloadImportTemplate();
      onShowToast("Đã tải xuống file mẫu import giảng viên");
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  const handleConfirmImport = async () => {
    if (USE_MOCK) {
      onShowToast("Đã import thành công danh sách giảng viên từ Excel");
      setIsImportModalOpen(false);
      return;
    }
    if (!importFile) {
      onShowToast("Vui lòng chọn file Excel trước khi import");
      return;
    }
    setIsImporting(true);
    try {
      const result = await adminLecturersService.importExcel(importFile);
      await reloadLecturers();
      onShowToast(
        `Import xong: ${result.successCount}/${result.totalRows} giảng viên · email: ${result.emailSentCount}`,
      );
      setIsImportModalOpen(false);
      setImportFile(null);
      setImportFileName(null);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsImporting(false);
    }
  };
  const handleExportLecturers = async () => {
    if (USE_MOCK) {
      onShowToast("Đã xuất danh sách giảng viên (.xlsx)");
      return;
    }
    try {
      await adminLecturersService.downloadExport();
      onShowToast("Đã tải xuống danh sách giảng viên (.xlsx)");
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={GraduationCap}
        title="Quản lý Giảng viên"
        actions={[
          {
            label: "Xuất Excel",
            icon: Download,
            onClick: () => void handleExportLecturers(),
            variant: "secondary",
          },
          {
            label: "Import Excel",
            icon: FileUp,
            onClick: () => setIsImportModalOpen(true),
            variant: "secondary",
          },
          {
            label: "Thêm giảng viên",
            icon: UserPlus,
            onClick: () => setIsCreateModalOpen(true),
            variant: "primary",
          },
        ]}
      >
        <button
          type="button"
          onClick={() => setIsGenerateAccountsModalOpen(true)}
          className="il-btn-press px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          <span>Cấp tài khoản nhanh ({pendingAccounts})</span>
        </button>
      </PageHeader>

      <Toolbar
        left={
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{totalLecturers}</span>{" "}
            GV ·{" "}
            <span className="font-bold text-emerald-700">{activeLecturers}</span>{" "}
            đã cấp TK ·{" "}
            <span className="font-bold text-amber-700">{pendingAccounts}</span>{" "}
            chưa TK ·{" "}
            <span className="font-bold text-sky-700">{guidingLecturers}</span>{" "}
            đang phân công
          </p>
        }
      />

      {/* LECTURERS MAIN TABLE */}
      <Panel className="space-y-4">
        {/* Table Header & Search Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Danh sách Giảng viên ({filteredLecturers.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bảng thông tin chi tiết và quản lý quyền truy cập
            </p>
          </div>

          {/* Search & Filter Inputs */}
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
                placeholder="Tìm tên, MSGV, Email..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả Bộ môn</option>
              <option value="Công nghệ Phần mềm">Bộ môn CNPM</option>
              <option value="Mạng máy tính & TTTT">Bộ môn MMT</option>
              <option value="Hệ thống Thông tin">Bộ môn HTTT</option>
              <option value="Khoa học Máy tính">Bộ môn KHMT</option>
            </select>

            <select
              value={accountStatusFilter}
              onChange={(e) => {
                setAccountStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái TK</option>
              <option value="active">Đã cấp tài khoản</option>
              <option value="pending">Chưa cấp tài khoản</option>
              <option value="locked">Tài khoản bị khóa</option>
            </select>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchGenerateAccounts}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer animate-in fade-in"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Cấp TK đã chọn ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleToggleSelectAllPage}
                    className="rounded text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Giảng viên</th>
                <th className="py-2.5 px-3">MSGV</th>
                <th className="py-2.5 px-3">Khoa / Bộ môn</th>
                <th className="py-2.5 px-3">Liên hệ</th>
                <th className="py-2.5 px-3 text-center">SV phân công</th>
                <th className="py-2.5 px-3 text-center">Trạng thái TK</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLecturers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy giảng viên nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedLecturers.map((lec) => {
                  const isSelected = selectedIds.includes(lec.id);
                  return (
                    <tr
                      key={lec.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(lec.id)}
                          className="rounded text-blue-600 cursor-pointer"
                        />
                      </td>

                      {/* Name & Academic Degree */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {lec.fullName.split(" ").slice(-1)[0][0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {lec.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {lec.academicDegree}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {lec.employeeId}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 block">
                          {lec.department}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {lec.faculty}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <p className="font-bold text-blue-600">{lec.email}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {lec.phone}
                        </p>
                      </td>

                      {/* Assignment count */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-slate-800 tabular-nums">
                          {lec.currentCount}
                        </span>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3 px-3 text-center">
                        {lec.accountStatus === "active" && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                            Đã cấp
                          </span>
                        )}
                        {lec.accountStatus === "pending" && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-amber-600" /> Chưa
                            cấp
                          </span>
                        )}
                        {lec.accountStatus === "locked" && (
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-600" /> Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {lec.accountStatus === "pending" && (
                            <button
                              onClick={() => handleQuickGrantSingle(lec)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Cấp tài khoản ngay"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Cấp TK ngay</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedLecturer(lec)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingLecturer(lec)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(lec)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleResetPassword(lec)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Đặt lại mật khẩu"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleLockAccount(lec.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title={
                              lec.accountStatus === "locked"
                                ? "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n"
                                : "Kh\xF3a t\xE0i kho\u1EA3n"
                            }
                          >
                            {lec.accountStatus === "locked" ? (
                              <Unlock className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-rose-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">
              Hiển thị {paginatedLecturers.length} / {filteredLecturers.length}{" "}
              giảng viên
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

          <div className="flex items-center gap-1.5 font-bold">
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Panel>

      {/* IMPORT EXCEL MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Import Danh sách Giảng viên từ Excel
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-lg p-6 transition-all text-center relative cursor-pointer">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Kéo thả file Excel (.xlsx) vào đây hoặc{" "}
                    <span className="text-blue-600 underline">
                      bấm để chọn file
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ các file định dạng .XLSX, .XLS - Tối đa 15MB
                  </p>
                </div>
                {importFileName && (
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {importFileName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleDownloadTemplate}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file Excel mẫu</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-md cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => void handleConfirmImport()}
                  disabled={isImporting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-md shadow-xs cursor-pointer"
                >
                  {isImporting ? "Đang import…" : "Xác nhận Import"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE ACCOUNTS MODAL */}
      {isGenerateAccountsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Cấp Tài khoản Nhanh
                </h3>
              </div>
              <button
                onClick={() => setIsGenerateAccountsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Khởi tạo tài khoản đăng nhập MSGV cho{" "}
              <span className="font-bold text-emerald-700">
                {selectedIds.length > 0
                  ? `${selectedIds.length} gi\u1EA3ng vi\xEAn \u0111\xE3 ch\u1ECDn`
                  : `${pendingAccounts} gi\u1EA3ng vi\xEAn ch\u01B0a c\xF3 t\xE0i kho\u1EA3n`}
              </span>
              .
            </p>

            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-xs space-y-1">
              <p className="font-bold text-emerald-950">
                Quy tắc cấp tài khoản mặc định:
              </p>
              <ul className="list-disc pl-4 text-[11px] text-emerald-800 space-y-0.5">
                <li>Username: Mã giảng viên (MaGV)</li>
                <li>Mật khẩu tạm: 8 ký tự ngẫu nhiên (gửi qua email nếu có)</li>
                <li>Yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsGenerateAccountsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-md cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleBatchGenerateAccounts}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kích hoạt ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LECTURER DETAIL DRAWER */}
      {selectedLecturer && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-md p-6 space-y-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Hồ sơ Giảng viên
              </h3>
              <button
                onClick={() => setSelectedLecturer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#1d4ed8] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                {selectedLecturer.fullName.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedLecturer.fullName}
                </h4>
                <p className="text-xs font-mono font-bold text-blue-600">
                  {selectedLecturer.employeeId}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedLecturer.academicDegree} •{" "}
                  {selectedLecturer.department}
                </p>
              </div>
            </div>

            {/* Info Details List */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md space-y-2 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Khoa:</span>
                  <span className="font-bold text-slate-900">
                    {selectedLecturer.faculty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bộ môn:</span>
                  <span className="font-bold text-slate-900">
                    {selectedLecturer.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-blue-600">
                    {selectedLecturer.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-bold text-slate-900">
                    {selectedLecturer.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái tài khoản:</span>
                  <span className="font-bold uppercase text-emerald-700">
                    {selectedLecturer.accountStatus}
                  </span>
                </div>
              </div>

              {/* Assignment count */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-lg">
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  SV phân công
                </span>
                <p className="text-xl font-bold text-blue-950 mt-1">
                  {selectedLecturer.currentCount}
                </p>
              </div>

              {/* List of Assigned Students */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Danh sách Sinh viên đang hướng dẫn (
                  {selectedLecturer.assignedStudents?.length || 0})
                </span>

                {selectedLecturer.assignedStudents &&
                selectedLecturer.assignedStudents.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedLecturer.assignedStudents.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{st.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {st.studentId} • Lớp {st.classCode}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">
                          {st.company}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-center text-slate-400 italic bg-slate-50 rounded-md">
                    Chưa có sinh viên nào được phân công.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              {selectedLecturer.accountStatus === "pending" && (
                <button
                  onClick={() => {
                    handleQuickGrantSingle(selectedLecturer);
                    setSelectedLecturer(null);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Cấp tài khoản ngay
                </button>
              )}

              <button
                onClick={() => {
                  setEditingLecturer(selectedLecturer);
                  setSelectedLecturer(null);
                }}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa hồ sơ
              </button>

              <button
                onClick={() => {
                  setDeleteTarget(selectedLecturer);
                  setSelectedLecturer(null);
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa giảng viên
              </button>

              <button
                onClick={() => handleResetPassword(selectedLecturer)}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Đặt lại mật khẩu tài khoản
              </button>

              <button
                onClick={() => handleToggleLockAccount(selectedLecturer.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />{" "}
                {selectedLecturer.accountStatus === "locked"
                  ? "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n"
                  : "Kh\xF3a t\xE0i kho\u1EA3n"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LECTURER MODAL */}
      <CreateLecturerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onShowToast={onShowToast}
        onAddLecturer={handleAddLecturer}
      />

      <EditLecturerModal
        isOpen={Boolean(editingLecturer)}
        lecturer={editingLecturer}
        onClose={() => setEditingLecturer(null)}
        onShowToast={onShowToast}
        onSave={handleUpdateLecturer}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa giảng viên"
        description={
          deleteTarget ? (
            <>
              Xóa giảng viên{" "}
              <strong className="text-slate-900">{deleteTarget.fullName}</strong> (
              {deleteTarget.employeeId})? Hành động không thể hoàn tác.
            </>
          ) : null
        }
        confirmLabel="Xóa giảng viên"
        variant="danger"
        loading={isDeleting}
        onConfirm={() => void confirmDeleteLecturer()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export { LecturersView as AdminLecturersView };
