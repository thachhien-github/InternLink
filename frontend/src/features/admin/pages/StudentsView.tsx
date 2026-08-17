import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
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
  Building2,
  FileUp,
  Check,
} from "lucide-react";
import { CreateStudentModal } from "../components/modals/CreateStudentModal";
import type { CreateStudentFormPayload } from "../components/modals/CreateStudentModal";
import { EditStudentModal } from "../components/modals/EditStudentModal";
import type { EditStudentFormPayload } from "../components/modals/EditStudentModal";
import type { AdminStudentRow } from "../../../hooks/useAdminStudentsPage";
import { PageHeader } from "../../../components/common/PageHeader";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Panel } from "../../../components/common/Panel";
import { Toolbar } from "../../../components/common/Toolbar";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapStudentDtoToRow } from "../../../lib/adminMappers";
import { adminStudentsService } from "../../../services/adminStudents.service";
import { adminUsersService } from "../../../services/adminUsers.service";
import { useAdminStudentsPage } from "../../../hooks/useAdminStudentsPage";
import { useSemester } from "../../../contexts/SemesterContext";
export const StudentsView = ({ onShowToast }) => {
  const { selectedSemester } = useSemester();
  const [searchParams] = useSearchParams();
  const apiPage = useAdminStudentsPage(onShowToast);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudentRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminStudentRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentRow | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGenerateAccountsModalOpen, setIsGenerateAccountsModalOpen] =
    useState(false);
  const [mockStudents, setMockStudents] = useState([
    {
      id: "st-1",
      mssv: "20110201",
      fullName: "Nguy\u1EC5n V\u0103n Minh",
      gender: "Nam",
      dateOfBirth: "15/04/2002",
      classCode: "20CNTT1",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110201@student.hcmute.edu.vn",
      phone: "0912 345 678",
      assignedLecturer: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      companyName: "FPT Software HCM",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "02/08/2026 08:45",
      gpa: 3.42,
    },
    {
      id: "st-2",
      mssv: "20110202",
      fullName: "Tr\u1EA7n Th\u1ECB Thu Th\u1EA3o",
      gender: "N\u1EEF",
      dateOfBirth: "22/09/2002",
      classCode: "20CNTT1",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110202@student.hcmute.edu.vn",
      phone: "0908 765 432",
      assignedLecturer: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      companyName: "VNG Corporation",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "01/08/2026 19:20",
      gpa: 3.65,
    },
    {
      id: "st-3",
      mssv: "20110205",
      fullName: "L\xEA Ho\xE0ng Nam",
      gender: "Nam",
      dateOfBirth: "10/11/2002",
      classCode: "20KTPM1",
      major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110205@student.hcmute.edu.vn",
      phone: "0933 111 222",
      assignedLecturer: "TS. Nguy\u1EC5n V\u0103n Ph\u01B0\u1EDBc",
      companyName: "Viettel Telecom",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "02/08/2026 10:12",
      gpa: 3.18,
    },
    {
      id: "st-4",
      mssv: "20110208",
      fullName: "Ph\u1EA1m \u0110\u0103ng Khoa",
      gender: "Nam",
      dateOfBirth: "05/02/2002",
      classCode: "20KTPM2",
      major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110208@student.hcmute.edu.vn",
      phone: "0977 888 999",
      assignedLecturer: "ThS. Tr\u1EA7n Th\u1ECB Mai Anh",
      companyName: "MGM Technology",
      accountStatus: "active",
      internshipStatus: "interning",
      lastLogin: "31/07/2026 15:30",
      gpa: 3.25,
    },
    {
      id: "st-5",
      mssv: "20110212",
      fullName: "V\u0169 Ng\u1ECDc B\u1EA3o Tr\xE2m",
      gender: "N\u1EEF",
      dateOfBirth: "18/06/2002",
      classCode: "20MMT1",
      major: "M\u1EA1ng m\xE1y t\xEDnh",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110212@student.hcmute.edu.vn",
      phone: "0988 222 333",
      assignedLecturer: "PGS.TS. L\xEA Ho\xE0ng Th\xE1i",
      companyName: "TMA Solutions",
      accountStatus: "pending",
      internshipStatus: "preparing",
      lastLogin: "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
      gpa: 3.5,
    },
    {
      id: "st-6",
      mssv: "20110218",
      fullName: "Ng\xF4 Qu\u1ED1c Huy",
      gender: "Nam",
      dateOfBirth: "30/01/2002",
      classCode: "20HTTT1",
      major: "H\u1EC7 th\u1ED1ng Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110218@student.hcmute.edu.vn",
      phone: "0918 555 666",
      assignedLecturer: "Ch\u01B0a ph\xE2n c\xF4ng",
      companyName: "KMS Technology",
      accountStatus: "pending",
      internshipStatus: "preparing",
      lastLogin: "Ch\u01B0a c\u1EA5p t\xE0i kho\u1EA3n",
      gpa: 2.95,
    },
    {
      id: "st-7",
      mssv: "20110224",
      fullName: "Ho\xE0ng Minh Tu\u1EA5n",
      gender: "Nam",
      dateOfBirth: "12/08/2002",
      classCode: "20CNTT2",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110224@student.hcmute.edu.vn",
      phone: "0903 444 777",
      assignedLecturer: "TS. B\xF9i Minh Ti\u1EBFn",
      companyName: "Bosch Global Software",
      accountStatus: "locked",
      internshipStatus: "paused",
      lastLogin: "20/06/2026 (\u0110\xE3 kh\xF3a)",
      gpa: 2.7,
    },
    {
      id: "st-8",
      mssv: "20110230",
      fullName: "\u0110\u1EB7ng Th\xF9y D\u01B0\u01A1ng",
      gender: "N\u1EEF",
      dateOfBirth: "03/03/2002",
      classCode: "20CNTT1",
      major: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      faculty: "C\xF4ng ngh\u1EC7 Th\xF4ng tin",
      cohort: "K20",
      email: "20110230@student.hcmute.edu.vn",
      phone: "0912 999 000",
      assignedLecturer: "ThS. Ph\u1EA1m Qu\u1ED1c B\u1EA3o",
      companyName: "Shopee Vietnam",
      accountStatus: "active",
      internshipStatus: "completed",
      lastLogin: "02/08/2026 07:15",
      gpa: 3.8,
    },
  ]);
  const students = USE_MOCK ? mockStudents : apiPage.students;
  const setStudents = USE_MOCK ? setMockStudents : apiPage.setStudents;
  const isLoadingApi = USE_MOCK ? false : apiPage.isLoading;
  const reloadStudents = apiPage.reload;
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") ?? "",
  );
  const [classFilter, setClassFilter] = useState("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState("all");
  const [internshipFilter, setInternshipFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const q = searchParams.get("q");
    if (q != null) {
      setSearchQuery(q);
      setCurrentPage(1);
    }
  }, [searchParams]);
  const [pageSize, setPageSize] = useState(10);
  const [importFileName, setImportFileName] = useState(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const classOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((s) => s.classCode)
          .filter((c) => c && c !== "—"),
      ),
    ).sort();
  }, [students]);

  const handleDownloadTemplate = async () => {
    if (USE_MOCK) {
      onShowToast("Đã tải xuống file mẫu Danh_sach_Sinh_vien_Template.xlsx");
      return;
    }
    try {
      const { blob, filename } =
        await adminStudentsService.downloadImportTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast(`Đã tải xuống ${filename}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  const handleAddStudent = async (payload: CreateStudentFormPayload) => {
    if (USE_MOCK) {
      const newSt = {
        id: "std-" + Date.now(),
        userId: payload.grantAccount ? "mock-user" : null,
        mssv: payload.studentCode,
        fullName: payload.fullName,
        gender: "—",
        dateOfBirth: "—",
        classCode: payload.class ?? "—",
        major: payload.major ?? "—",
        faculty: "—",
        cohort: "—",
        email: payload.email ?? "—",
        phone: payload.phone ?? "—",
        assignedLecturer: "Chưa phân công",
        companyName: "Chưa có DN",
        accountStatus: (payload.grantAccount ? "active" : "pending") as
          | "active"
          | "pending"
          | "locked",
        internshipStatus: "registered",
        lastLogin: payload.grantAccount ? "Vừa tạo" : "Chưa cấp tài khoản",
        gpa: 0,
      };
      setStudents((prev) => [newSt, ...prev]);
      return;
    }
    try {
      await adminStudentsService.create({
        studentCode: payload.studentCode,
        fullName: payload.fullName,
        class: payload.class,
        major: payload.major,
        email: payload.email,
        phone: payload.phone,
        grantAccount: payload.grantAccount,
      });
      await reloadStudents();
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
      throw err;
    }
  };

  const handleUpdateStudent = async (
    id: string,
    payload: EditStudentFormPayload,
  ) => {
    const existing = students.find((s) => s.id === id);
    if (!existing) return;

    if (USE_MOCK) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                fullName: payload.fullName,
                classCode: payload.class ?? "—",
                major: payload.major ?? "—",
                email: payload.email ?? "—",
                phone: payload.phone ?? "—",
                accountStatus: s.accountStatus,
              }
            : s,
        ),
      );
      return;
    }

    try {
      await adminStudentsService.update(id, {
        fullName: payload.fullName,
        class: payload.class,
        major: payload.major,
        email: payload.email,
        phone: payload.phone,
      });
      await reloadStudents();
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
      throw err;
    }
  };

  const handleDeleteStudent = async (st: AdminStudentRow) => {
    if (USE_MOCK) {
      setStudents((prev) => prev.filter((s) => s.id !== st.id));
      onShowToast(`Đã xóa ${st.fullName}`);
      return;
    }

    try {
      await adminStudentsService.delete(st.id);
      if (selectedStudent?.id === st.id) setSelectedStudent(null);
      if (editingStudent?.id === st.id) setEditingStudent(null);
      await reloadStudents();
      onShowToast(`Đã xóa ${st.fullName}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  const confirmDeleteStudent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await handleDeleteStudent(deleteTarget);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (s) => s.accountStatus === "active",
  ).length;
  const pendingAccounts = students.filter(
    (s) => s.accountStatus === "pending",
  ).length;
  const interningStudents = students.filter(
    (s) =>
      s.internshipStatus === "interning" ||
      (s.companyName !== "Chưa có DN" && s.companyName !== "Chưa có"),
  ).length;
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mssv.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = classFilter === "all" || s.classCode === classFilter;
      const matchAccount =
        accountStatusFilter === "all" ||
        s.accountStatus === accountStatusFilter;
      const matchIntern =
        internshipFilter === "all" || s.internshipStatus === internshipFilter;
      return matchSearch && matchClass && matchAccount && matchIntern;
    });
  }, [
    students,
    searchQuery,
    classFilter,
    accountStatusFilter,
    internshipFilter,
  ]);
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);
  const isAllPageSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedIds.includes(s.id));
  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedStudents.some((ps) => ps.id === id)),
      );
    } else {
      const pageIds = paginatedStudents.map((s) => s.id);
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
  const handleQuickGrantSingle = async (st) => {
    if (USE_MOCK) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === st.id
            ? {
                ...s,
                accountStatus: "active",
                lastLogin: "Vừa cấp tài khoản",
              }
            : s,
        ),
      );
      onShowToast(
        st.email !== "—"
          ? `Đã cấp tài khoản ${st.mssv} — email mời đã gửi (nếu SMTP bật)`
          : `Đã cấp tài khoản ${st.mssv} — chưa có email để gửi mật khẩu`,
      );
      return;
    }
    try {
      await adminStudentsService.update(st.id, {
        fullName: st.fullName,
        class: st.classCode !== "—" ? st.classCode : undefined,
        major: st.major !== "—" ? st.major : undefined,
        email: st.email !== "—" ? st.email : undefined,
        phone: st.phone !== "—" ? st.phone : undefined,
        grantAccount: true,
      });
      await reloadStudents();
      onShowToast(
        st.email !== "—"
          ? `Đã cấp tài khoản ${st.mssv} — email mời đã gửi (nếu SMTP bật)`
          : `Đã cấp tài khoản ${st.mssv} — chưa có email để gửi mật khẩu`,
      );
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };
  const handleBatchGenerateAccounts = async () => {
    const targetIds =
      selectedIds.length > 0
        ? selectedIds
        : students
            .filter((s) => s.accountStatus === "pending")
            .map((s) => s.id);
    if (USE_MOCK) {
      setStudents((prev) =>
        prev.map((s) => {
          if (targetIds.includes(s.id)) {
            return {
              ...s,
              accountStatus: "active",
              lastLogin: "Vừa cấp tài khoản",
            };
          }
          return s;
        }),
      );
      onShowToast(
        `Đã cấp tài khoản thành công cho ${targetIds.length} sinh viên`,
      );
      setIsGenerateAccountsModalOpen(false);
      setSelectedIds([]);
      return;
    }
    let ok = 0;
    let fail = 0;
    for (const id of targetIds) {
      const st = students.find((s) => s.id === id);
      if (!st || st.accountStatus !== "pending") continue;
      try {
        const dto = await adminStudentsService.update(st.id, {
          fullName: st.fullName,
          class: st.classCode !== "—" ? st.classCode : undefined,
          major: st.major !== "—" ? st.major : undefined,
          email: st.email !== "—" ? st.email : undefined,
          phone: st.phone !== "—" ? st.phone : undefined,
          grantAccount: true,
        });
        if (USE_MOCK) {
          setStudents((prev) =>
            prev.map((s) => (s.id === st.id ? mapStudentDtoToRow(dto) : s)),
          );
        }
        ok++;
      } catch {
        fail++;
      }
    }
    onShowToast(
      fail > 0
        ? `Cấp tài khoản: ${ok} thành công, ${fail} lỗi`
        : `Đã cấp tài khoản thành công cho ${ok} sinh viên`,
    );
    if (!USE_MOCK && ok > 0) await reloadStudents();
    setIsGenerateAccountsModalOpen(false);
    setSelectedIds([]);
  };
  const handleResetPassword = async (st) => {
    if (USE_MOCK) {
      onShowToast(
        `Đã reset mật khẩu tạm (8 ký tự ngẫu nhiên) cho sinh viên ${st.fullName}`,
      );
      return;
    }
    const userId = (st as { userId?: string | null }).userId;
    if (!userId) {
      onShowToast("Sinh viên chưa có tài khoản đăng nhập");
      return;
    }
    try {
      const res = await adminUsersService.resetPassword(userId);
      onShowToast(
        res.emailSent
          ? `Đã gửi email đặt lại mật khẩu cho ${st.fullName}`
          : `Đã reset mật khẩu cho ${res.username}`,
      );
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };
  const handleToggleLockAccount = async (id) => {
    const st = students.find((s) => s.id === id);
    if (!st) return;
    const newStatus = st.accountStatus === "locked" ? "active" : "locked";
    if (USE_MOCK) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            onShowToast(
              `Đã ${newStatus === "locked" ? "khóa" : "mở khóa"} tài khoản của ${s.fullName}`,
            );
            return { ...s, accountStatus: newStatus };
          }
          return s;
        }),
      );
      return;
    }
    const userId = (st as { userId?: string | null }).userId;
    if (!userId) {
      onShowToast("Sinh viên chưa có tài khoản đăng nhập");
      return;
    }
    try {
      await adminUsersService.update(userId, {
        fullName: st.fullName,
        email: st.email !== "—" ? st.email : undefined,
        isActive: newStatus === "active",
      });
      if (USE_MOCK) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, accountStatus: newStatus } : s)),
        );
      } else {
        await reloadStudents();
      }
      onShowToast(
        `Đã ${newStatus === "locked" ? "khóa" : "mở khóa"} tài khoản của ${st.fullName}`,
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

  const handleConfirmImport = async () => {
    if (USE_MOCK) {
      onShowToast("Đã import thành công danh sách sinh viên từ Excel");
      setIsImportModalOpen(false);
      return;
    }
    if (!importFile) {
      onShowToast("Vui lòng chọn file Excel trước khi import");
      return;
    }
    setIsImporting(true);
    try {
      const result = await adminStudentsService.importExcel(importFile);
      await reloadStudents();
      onShowToast(
        `Import xong: ${result.successCount}/${result.totalRows} sinh viên · email: ${result.emailSentCount} · MK: 8 ký tự ngẫu nhiên/email`,
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
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={GraduationCap}
        title="Quản lý Sinh viên"
        subtitle="Danh sách sinh viên đồng bộ từ API — GV, DN, tài khoản"
        actions={[
          {
            label: "Import Excel",
            icon: FileUp,
            onClick: () => setIsImportModalOpen(true),
            variant: "secondary",
          },
          {
            label: "Thêm sinh viên",
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

      {selectedSemester.status === "completed" && (
        <div className="px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-800 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-slate-600 shrink-0" />
          <span>
            Đợt thực tập <strong>{selectedSemester.name}</strong> đã kết thúc & đóng dữ liệu. Danh sách sinh viên đang ở chế độ <strong>Lưu trữ (Chỉ xem)</strong>.
          </span>
        </div>
      )}

      <Toolbar
        left={
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-bold text-[11px]">
              {selectedSemester.name}
            </span>
            <span>·</span>
            <span className="font-bold text-slate-800">{totalStudents}</span> SV ·{" "}
            <span className="font-bold text-emerald-700">{activeStudents}</span> đã cấp TK ·{" "}
            <span className="font-bold text-amber-700">{pendingAccounts}</span> chưa TK ·{" "}
            <span className="font-bold text-sky-700">{interningStudents}</span> đã có DN
            {isLoadingApi && (
              <span className="ml-2 text-blue-600 font-semibold">
                · Đang tải API…
              </span>
            )}
          </div>
        }
      />

      {/* STUDENTS MAIN TABLE */}
      <Panel className="space-y-4">
        {/* Table Header & Search Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Danh sách Sinh viên ({filteredStudents.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bảng thông tin chi tiết và quản lý tài khoản sinh viên
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
                placeholder="Tìm tên, MSSV, Email, Doanh nghiệp..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả Lớp</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  Lớp {cls}
                </option>
              ))}
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
                <th className="py-2.5 px-3">Sinh viên</th>
                <th className="py-2.5 px-3">MSSV & Lớp</th>
                <th className="py-2.5 px-3">Doanh nghiệp thực tập</th>
                <th className="py-2.5 px-3">GV Hướng dẫn</th>
                <th className="py-2.5 px-3 text-center">Trạng thái TK</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy sinh viên nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => {
                  const isSelected = selectedIds.includes(st.id);
                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(st.id)}
                          className="rounded text-blue-600 cursor-pointer"
                        />
                      </td>

                      {/* Name & Gender */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {st.fullName.split(" ").slice(-1)[0][0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {st.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {st.gender} • {st.dateOfBirth}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* MSSV & Class */}
                      <td className="py-3 px-3">
                        <p className="font-mono font-bold text-slate-800">
                          {st.mssv}
                        </p>
                        <p className="text-[10px] text-blue-600 font-bold">
                          {st.classCode}
                        </p>
                      </td>

                      {/* Company */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{st.companyName}</span>
                        </div>
                      </td>

                      {/* Lecturer */}
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800">
                          {st.assignedLecturer}
                        </p>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3 px-3 text-center">
                        {st.accountStatus === "active" && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                            Đã cấp
                          </span>
                        )}
                        {st.accountStatus === "pending" && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-amber-600" /> Chưa
                            cấp
                          </span>
                        )}
                        {st.accountStatus === "locked" && (
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-600" /> Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {st.accountStatus === "pending" && (
                            <button
                              onClick={() => handleQuickGrantSingle(st)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Cấp tài khoản ngay"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Cấp TK ngay</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedStudent(st as AdminStudentRow)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingStudent(st as AdminStudentRow)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(st as AdminStudentRow)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleResetPassword(st)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Đặt lại mật khẩu"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleLockAccount(st.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title={
                              st.accountStatus === "locked"
                                ? "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n"
                                : "Kh\xF3a t\xE0i kho\u1EA3n"
                            }
                          >
                            {st.accountStatus === "locked" ? (
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
              Hiển thị {paginatedStudents.length} / {filteredStudents.length}{" "}
              sinh viên
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
                  Import Danh sách Sinh viên từ Excel
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
                    Hỗ trợ định dạng .XLSX, .XLS - Tối đa 15MB
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
                type="button"
                onClick={() => void handleDownloadTemplate()}
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
              Khởi tạo tài khoản đăng nhập MSSV cho{" "}
              <span className="font-bold text-emerald-700">
                {selectedIds.length > 0
                  ? `${selectedIds.length} sinh vi\xEAn \u0111\xE3 ch\u1ECDn`
                  : `${pendingAccounts} sinh vi\xEAn ch\u01B0a c\xF3 t\xE0i kho\u1EA3n`}
              </span>
              .
            </p>

            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-xs space-y-1">
              <p className="font-bold text-emerald-950">
                Quy tắc cấp tài khoản mặc định:
              </p>
              <ul className="list-disc pl-4 text-[11px] text-emerald-800 space-y-0.5">
                <li>Username: Mã số sinh viên (MSSV)</li>
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

      {/* STUDENT DETAIL DRAWER */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-md p-6 space-y-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Hồ sơ Sinh viên
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#1d4ed8] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                {selectedStudent.fullName.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedStudent.fullName}
                </h4>
                <p className="text-xs font-mono font-bold text-blue-600">
                  {selectedStudent.mssv}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Lớp: {selectedStudent.classCode} • GPA: {selectedStudent.gpa}
                </p>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md space-y-2 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngành học:</span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.major}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Khóa học:</span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.cohort}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-blue-600">
                    {selectedStudent.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GV Hướng dẫn:</span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.assignedLecturer}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doanh nghiệp thực tập:</span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái tài khoản:</span>
                  <span className="font-bold uppercase text-emerald-700">
                    {selectedStudent.accountStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              {selectedStudent.accountStatus === "pending" && (
                <button
                  onClick={() => {
                    handleQuickGrantSingle(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Cấp tài khoản ngay
                </button>
              )}

              <button
                onClick={() => {
                  setEditingStudent(selectedStudent as AdminStudentRow);
                  setSelectedStudent(null);
                }}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa hồ sơ
              </button>

              <button
                onClick={() => {
                  setDeleteTarget(selectedStudent as AdminStudentRow);
                  setSelectedStudent(null);
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa sinh viên
              </button>

              <button
                onClick={() => handleResetPassword(selectedStudent)}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Đặt lại mật khẩu tài khoản
              </button>

              <button
                onClick={() => handleToggleLockAccount(selectedStudent.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />{" "}
                {selectedStudent.accountStatus === "locked"
                  ? "M\u1EDF kh\xF3a t\xE0i kho\u1EA3n"
                  : "Kh\xF3a t\xE0i kho\u1EA3n"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STUDENT MODAL */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onShowToast={onShowToast}
        onAddStudent={handleAddStudent}
      />

      <EditStudentModal
        isOpen={Boolean(editingStudent)}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onShowToast={onShowToast}
        onSave={handleUpdateStudent}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa sinh viên"
        description={
          deleteTarget ? (
            <>
              Xóa sinh viên{" "}
              <strong className="text-slate-900">{deleteTarget.fullName}</strong> (
              {deleteTarget.mssv})? Hành động không thể hoàn tác.
            </>
          ) : null
        }
        confirmLabel="Xóa sinh viên"
        variant="danger"
        loading={isDeleting}
        onConfirm={() => void confirmDeleteStudent()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export { StudentsView as AdminStudentsView };
