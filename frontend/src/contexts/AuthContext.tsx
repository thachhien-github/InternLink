import {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { USE_MOCK } from "../config/env";
import { getStoredToken, setStoredToken } from "../lib/apiClient";
import { mapBackendRole } from "../lib/roleMap";
import { authService } from "../services/auth.service";
import type { CurrentUserDto } from "../types/api";

export type UserRole = "admin" | "lecturer" | "student";

export interface AuthUser {
  id?: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string | null;
}

export interface AuthSession {
  token?: string;
  user: AuthUser;
  mustChangePassword?: boolean;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  isBootstrapping: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  mustChangePassword: boolean;
  login: (session: AuthSession) => void;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  clearMustChangePassword: () => void;
  /** Demo-only portal switch when USE_MOCK */
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function mapMeToAuthUser(me: CurrentUserDto): AuthUser {
  const role = mapBackendRole(me.role);
  if (!role) {
    throw new Error(`Unsupported role: ${me.role}`);
  }
  return {
    id: me.id,
    username: me.username,
    name: me.fullName?.trim() || me.username,
    role,
    email: me.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(!USE_MOCK);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const login = useCallback((session: AuthSession) => {
    if (session.token) setStoredToken(session.token);
    setIsLoggedIn(true);
    setUser(session.user);
    setMustChangePassword(Boolean(session.mustChangePassword));
    if (session.user.username) {
      localStorage.setItem(
        "internlink_remembered_username",
        session.user.username,
      );
    }
  }, []);

  const logout = useCallback(async () => {
    if (!USE_MOCK && getStoredToken()) {
      try {
        await authService.logout();
      } catch {
        /* ignore network/server errors during logout */
      } finally {
        setStoredToken(null);
      }
    } else {
      setStoredToken(null);
    }
    setIsLoggedIn(false);
    setUser(null);
    setMustChangePassword(false);
  }, []);

  const refreshMe = useCallback(async () => {
    const me = await authService.getMe();
    setUser(mapMeToAuthUser(me));
    setMustChangePassword(me.mustChangePassword);
    setIsLoggedIn(true);
  }, []);

  const clearMustChangePassword = useCallback(() => {
    setMustChangePassword(false);
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    if (!USE_MOCK) return;
    setUser((prev) => {
      if (!prev) return prev;
      const roleNames: Record<UserRole, string> = {
        admin: "Quản trị viên Hệ thống (Super Admin)",
        lecturer: "ThS. Nguyễn Văn Phước (Giảng viên)",
        student: "Trần Thị Thu Thảo (Sinh viên)",
      };
      return { ...prev, role: newRole, name: roleNames[newRole] };
    });
  }, []);

  useEffect(() => {
    if (USE_MOCK) return;

    let cancelled = false;
    (async () => {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) setIsBootstrapping(false);
        return;
      }
      try {
        const me = await authService.getMe();
        if (cancelled) return;
        login({
          token,
          user: mapMeToAuthUser(me),
          mustChangePassword: me.mustChangePassword,
        });
      } catch {
        setStoredToken(null);
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isBootstrapping,
        user,
        role: user?.role ?? null,
        mustChangePassword,
        login,
        logout,
        refreshMe,
        clearMustChangePassword,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
