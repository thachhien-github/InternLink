import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to proper dashboard based on active role
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'lecturer') return <Navigate to="/lecturer/dashboard" replace />;
    if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}
