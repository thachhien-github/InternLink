import { createContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'admin' | 'lecturer' | 'student';

export interface AuthUser {
  username: string;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((authUser: AuthUser) => {
    setIsLoggedIn(true);
    setUser(authUser);
    if (authUser.username) {
      localStorage.setItem('internlink_remembered_username', authUser.username);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      const roleNames: Record<UserRole, string> = {
        admin: 'Quản trị viên Hệ thống (Super Admin)',
        lecturer: 'ThS. Nguyễn Văn Phước (Giảng viên)',
        student: 'Trần Thị Thu Thảo (Sinh viên)',
      };
      return { ...prev, role: newRole, name: roleNames[newRole] };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        role: user?.role ?? null,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
