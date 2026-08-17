import { useMemo, useState, useEffect } from "react";
import {
  Users,
  Search,
  KeyRound,
  Lock,
  Unlock,
  Shield,
  GraduationCap,
  UserCheck,
  UserPlus,
  Trash2,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Panel } from "../../../components/common/Panel";
import { Toolbar } from "../../../components/common/Toolbar";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "../../../types/user";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { mapUserDtoToAdminUser } from "../../../lib/adminMappers";
import { adminUsersService } from "../../../services/adminUsers.service";
import {
  CreateUserModal,
  type CreateUserFormPayload,
} from "../components/modals/CreateUserModal";

const INITIAL_USERS: AdminUser[] = [
  {
    id: "u-1",
    code: "admin",
    fullName: "Trưởng Ban Điều hành",
    email: "admin@hcmute.edu.vn",
    role: "admin",
    status: "active",
    departmentOrClass: "Ban Điều hành Khoa CNTT",
    lastLogin: "13/08/2026 06:40",
  },
  {
    id: "u-2",
    code: "GV001",
    fullName: "TS. Nguyễn Văn Phước",
    email: "phuocnv@hcmute.edu.vn",
    role: "lecturer",
    status: "active",
    departmentOrClass: "Bộ môn CNPM",
    lastLogin: "12/08/2026 21:10",
  },
  {
    id: "u-3",
    code: "GV002",
    fullName: "ThS. Trần Thị Mai Anh",
    email: "maianh@hcmute.edu.vn",
    role: "lecturer",
    status: "locked",
    departmentOrClass: "Bộ môn HTTT",
    lastLogin: "01/08/2026 09:00",
  },
  {
    id: "u-4",
    code: "20110201",
    fullName: "Nguyễn Văn Minh",
    email: "20110201@student.hcmute.edu.vn",
    role: "student",
    status: "active",
    departmentOrClass: "20CNTT1",
    lastLogin: "02/08/2026 08:45",
  },
  {
    id: "u-5",
    code: "20110208",
    fullName: "Phạm Đăng Khoa",
    email: "20110208@student.hcmute.edu.vn",
    role: "student",
    status: "pending",
    departmentOrClass: "20KTPM2",
    lastLogin: "—",
    mustChangePassword: true,
  },
  {
    id: "u-6",
    code: "20110215",
    fullName: "Lê Thị Hồng",
    email: "20110215@student.hcmute.edu.vn",
    role: "student",
    status: "active",
    departmentOrClass: "20CNTT2",
    lastLogin: "11/08/2026 14:22",
  },
];

const ROLE_LABEL: Record<AdminUserRole, string> = {
  admin: "Admin",
  lecturer: "Giảng viên",
  student: "Sinh viên",
};

const STATUS_STYLE: Record<AdminUserStatus, string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  locked: "bg-rose-50 text-rose-800 border-rose-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
};

const STATUS_LABEL: Record<AdminUserStatus, string> = {
  active: "Hoạt động",
  locked: "Đã khóa",
  pending: "Chờ kích hoạt",
};

export const UsersView = ({
  onShowToast,
}: {
  onShowToast: (msg: string) => void;
}) => {
  const [users, setUsers] = useState<AdminUser[]>(
    USE_MOCK ? INITIAL_USERS : [],
  );
  const [isLoadingApi, setIsLoadingApi] = useState(!USE_MOCK);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AdminUserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminUserStatus>(
    "all",
  );
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (!USE_MOCK) {
        await adminUsersService.delete(deleteTarget.id);
      }
      setUsers((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      onShowToast(`Đã xóa tài khoản ${deleteTarget.fullName} khỏi hệ thống.`);
      setDeleteTarget(null);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      setIsLoadingApi(true);
      try {
        const res = await adminUsersService.getAll({ take: 500 });
        if (!cancelled) setUsers(res.items.map(mapUserDtoToAdminUser));
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchQ && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const counts = useMemo(
    () => ({
      total: users.length,
      locked: users.filter((u) => u.status === "locked").length,
      pending: users.filter((u) => u.status === "pending").length,
    }),
    [users],
  );

  const toggleLock = async (u: AdminUser) => {
    const next: AdminUserStatus = u.status === "locked" ? "active" : "locked";
    if (USE_MOCK) {
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)),
      );
      onShowToast(
        next === "locked"
          ? `Đã khóa tài khoản ${u.code}`
          : `Đã mở khóa ${u.code}`,
      );
      return;
    }
    try {
      await adminUsersService.update(u.id, {
        fullName: u.fullName,
        email: u.email !== "—" ? u.email : undefined,
        isActive: next === "active",
      });
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)),
      );
      onShowToast(
        next === "locked"
          ? `Đã khóa tài khoản ${u.code}`
          : `Đã mở khóa ${u.code}`,
      );
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    }
  };

  const confirmReset = async () => {
    if (!resetTarget) return;
    setIsResetting(true);
    try {
      if (!USE_MOCK) {
        const res = await adminUsersService.resetPassword(resetTarget.id);
        onShowToast(
          res.emailSent
            ? `Đã gửi email đặt lại mật khẩu cho ${resetTarget.fullName}`
            : `Đã reset mật khẩu tạm (8 ký tự) cho ${res.username}`,
        );
      } else {
        onShowToast(
          `Đã đặt lại mật khẩu tạm cho ${resetTarget.fullName} — bắt buộc đổi khi đăng nhập`,
        );
      }
      setUsers((prev) =>
        prev.map((x) =>
          x.id === resetTarget.id
            ? { ...x, mustChangePassword: true, status: "active" }
            : x,
        ),
      );
      setResetTarget(null);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsResetting(false);
    }
  };

  const handleCreateUser = async (payload: CreateUserFormPayload) => {
    if (USE_MOCK) {
      const feRole =
        payload.role === "Lecturer" ? ("lecturer" as const) : ("student" as const);
      const newUser: AdminUser = {
        id: `u-${Date.now()}`,
        code: payload.username,
        fullName: payload.fullName,
        email: payload.email ?? "—",
        role: feRole,
        status: "active",
        departmentOrClass:
          payload.studentCode ?? payload.staffCode ?? "—",
        lastLogin: "—",
        mustChangePassword: true,
      };
      setUsers((prev) => [newUser, ...prev]);
      onShowToast(
        `Đã tạo tài khoản ${payload.fullName} — mật khẩu tạm gửi qua email (mock).`,
      );
      return;
    }

    const created = await adminUsersService.create(payload);
    setUsers((prev) => [mapUserDtoToAdminUser(created), ...prev]);
    onShowToast(
      created.email
        ? `Đã tạo tài khoản ${created.fullName ?? created.username} — email mời đã gửi nếu SMTP bật.`
        : `Đã tạo tài khoản ${created.fullName ?? created.username}.`,
    );
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={Users}
        title="Người dùng"
        subtitle="Tài khoản hệ thống — danh sách, khóa/mở, đặt lại mật khẩu"
        actions={[
          {
            label: "Tạo tài khoản",
            icon: UserPlus,
            onClick: () => setIsCreateOpen(true),
            variant: "primary",
          },
        ]}
      />

      <Toolbar
        left={
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{counts.total}</span>{" "}
            tài khoản ·{" "}
            <span className="font-bold text-amber-700">{counts.pending}</span>{" "}
            chờ kích hoạt ·{" "}
            <span className="font-bold text-rose-700">{counts.locked}</span>{" "}
            đang khóa
          </p>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Danh sách tài khoản ({filtered.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Gộp quản lý Admin / Giảng viên / Sinh viên
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã, tên, email…"
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:border-blue-500 outline-none w-52"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "all" | AdminUserRole)
              }
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 font-medium outline-none cursor-pointer"
            >
              <option value="all">Mọi vai trò</option>
              <option value="admin">Admin</option>
              <option value="lecturer">Giảng viên</option>
              <option value="student">Sinh viên</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | AdminUserStatus)
              }
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 font-medium outline-none cursor-pointer"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ kích hoạt</option>
              <option value="locked">Đã khóa</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-2.5 pr-3">Người dùng</th>
                <th className="py-2.5 pr-3">Vai trò</th>
                <th className="py-2.5 pr-3">Đơn vị</th>
                <th className="py-2.5 pr-3">Đăng nhập gần nhất</th>
                <th className="py-2.5 pr-3">Trạng thái</th>
                <th className="py-2.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => {
                const RoleIcon =
                  u.role === "admin"
                    ? Shield
                    : u.role === "lecturer"
                      ? UserCheck
                      : GraduationCap;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {u.code} · {u.email}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                        <RoleIcon className="w-3.5 h-3.5 text-slate-400" />
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {u.departmentOrClass}
                    </td>
                    <td className="py-3 pr-3 text-slate-500">{u.lastLogin}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold ${STATUS_STYLE[u.status]}`}
                      >
                        {STATUS_LABEL[u.status]}
                      </span>
                      {u.mustChangePassword && (
                        <span className="ml-1.5 text-[10px] font-semibold text-amber-700">
                          Đổi MK lần đầu
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setResetTarget(u)}
                          className="p-1.5 rounded-md text-slate-500 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
                          title="Đặt lại mật khẩu"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleLock(u)}
                          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                          title={u.status === "locked" ? "Mở khóa" : "Khóa"}
                        >
                          {u.status === "locked" ? (
                            <Unlock className="w-3.5 h-3.5" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-400 font-medium"
                  >
                    Không có tài khoản khớp bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <ConfirmDialog
        open={Boolean(resetTarget)}
        title="Đặt lại mật khẩu"
        description={
          resetTarget ? (
            <>
              Tài khoản{" "}
              <strong className="text-slate-900">{resetTarget.fullName}</strong> (
              {resetTarget.code}) sẽ nhận mật khẩu tạm 8 ký tự ngẫu nhiên và bắt
              buộc đổi khi đăng nhập.
              {resetTarget.email !== "—" && (
                <span className="block mt-1 text-slate-500">
                  Mật khẩu sẽ gửi qua email nếu SMTP đã bật.
                </span>
              )}
            </>
          ) : null
        }
        confirmLabel="Đặt lại mật khẩu"
        variant="warning"
        loading={isResetting}
        onConfirm={() => void confirmReset()}
        onCancel={() => setResetTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa tài khoản"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc chắn muốn xóa tài khoản{" "}
              <strong className="text-slate-900">{deleteTarget.fullName}</strong> (
              {deleteTarget.code})? Thao tác này không thể hoàn tác.
            </>
          ) : null
        }
        confirmLabel="Xóa tài khoản"
        variant="danger"
        loading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onShowToast={onShowToast}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
};

export { UsersView as AdminUsersView };
