import { useCallback, useEffect, useState } from "react";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "../types/user";
import { adminUsersService } from "../services/adminUsers.service";
import { mapUserDtoToAdminUser } from "../lib/adminMappers";
import { getApiErrorMessage } from "../lib/apiClient";
import { USE_MOCK } from "../config/env";

export const INITIAL_USERS: AdminUser[] = [
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

export interface UseAdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createUser: (payload: {
    username: string;
    fullName: string;
    email?: string;
    role: string;
    studentCode?: string;
    staffCode?: string;
  }) => Promise<AdminUser>;
  updateUser: (
    id: string,
    payload: { fullName: string; email?: string; isActive: boolean },
  ) => Promise<AdminUser>;
  toggleLock: (user: AdminUser) => Promise<string>;
  resetPassword: (
    id: string,
  ) => Promise<{ userId: string; username: string; emailSent: boolean }>;
  deleteUser: (id: string) => Promise<void>;
}

export const useAdminUsers = (): UseAdminUsersState => {
  const [users, setUsers] = useState<AdminUser[]>(USE_MOCK ? INITIAL_USERS : []);
  const [loading, setLoading] = useState<boolean>(!USE_MOCK);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    if (USE_MOCK) {
      setUsers(INITIAL_USERS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await adminUsersService.getAll({ take: 500 });
      setUsers(res.items.map(mapUserDtoToAdminUser));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(getApiErrorMessage(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (payload: {
    username: string;
    fullName: string;
    email?: string;
    role: string;
    studentCode?: string;
    staffCode?: string;
  }): Promise<AdminUser> => {
    if (USE_MOCK) {
      const newUser: AdminUser = {
        id: `u-${Date.now()}`,
        code: payload.username,
        fullName: payload.fullName,
        email: payload.email || "—",
        role: payload.role as AdminUserRole,
        status: "active",
        departmentOrClass: "—",
        lastLogin: "—",
        mustChangePassword: true,
      };
      setUsers((prev) => [newUser, ...prev]);
      return newUser;
    }

    const createdDto = await adminUsersService.create(payload);
    const mapped = mapUserDtoToAdminUser(createdDto);
    setUsers((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateUser = async (
    id: string,
    payload: { fullName: string; email?: string; isActive: boolean },
  ): Promise<AdminUser> => {
    if (USE_MOCK) {
      const updatedStatus: AdminUserStatus = payload.isActive ? "active" : "locked";
      let updatedUser: AdminUser | null = null;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === id) {
            updatedUser = {
              ...u,
              fullName: payload.fullName,
              email: payload.email || u.email,
              status: updatedStatus,
            };
            return updatedUser;
          }
          return u;
        }),
      );
      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    }

    const updatedDto = await adminUsersService.update(id, payload);
    const mapped = mapUserDtoToAdminUser(updatedDto);
    setUsers((prev) => prev.map((u) => (u.id === id ? mapped : u)));
    return mapped;
  };

  const toggleLock = async (user: AdminUser): Promise<string> => {
    const next: AdminUserStatus = user.status === "locked" ? "active" : "locked";
    if (USE_MOCK) {
      setUsers((prev) =>
        prev.map((x) => (x.id === user.id ? { ...x, status: next } : x)),
      );
      return next === "locked"
        ? `Đã khóa tài khoản ${user.code}`
        : `Đã mở khóa ${user.code}`;
    }

    await adminUsersService.update(user.id, {
      fullName: user.fullName,
      email: user.email !== "—" ? user.email : undefined,
      isActive: next === "active",
    });
    setUsers((prev) =>
      prev.map((x) => (x.id === user.id ? { ...x, status: next } : x)),
    );
    return next === "locked"
      ? `Đã khóa tài khoản ${user.code}`
      : `Đã mở khóa ${user.code}`;
  };

  const resetPassword = async (
    id: string,
  ): Promise<{ userId: string; username: string; emailSent: boolean }> => {
    if (USE_MOCK) {
      setUsers((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, mustChangePassword: true, status: "active" } : x,
        ),
      );
      const u = users.find((x) => x.id === id);
      return {
        userId: id,
        username: u?.code || "user",
        emailSent: false,
      };
    }

    const res = await adminUsersService.resetPassword(id);
    setUsers((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, mustChangePassword: true, status: "active" } : x,
      ),
    );
    return res;
  };

  const deleteUser = async (id: string): Promise<void> => {
    if (!USE_MOCK) {
      await adminUsersService.delete(id);
    }
    setUsers((prev) => prev.filter((x) => x.id !== id));
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    toggleLock,
    resetPassword,
    deleteUser,
  };
};
