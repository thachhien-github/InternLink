import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type UserRole } from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, isBootstrapping, role, mustChangePassword } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-600 font-medium">
        Đang tải phiên đăng nhập…
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "lecturer")
      return <Navigate to="/lecturer/dashboard" replace />;
    if (role === "student") return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}
