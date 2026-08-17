export type AdminUserRole = "admin" | "lecturer" | "student";

export type AdminUserStatus = "active" | "locked" | "pending";

export interface AdminUser {
  id: string;
  code: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  departmentOrClass: string;
  lastLogin: string;
  mustChangePassword?: boolean;
}
