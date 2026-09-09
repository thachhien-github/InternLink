import {
  apiRequest,
  setStoredToken,
  setStoredRefreshToken,
  getStoredRefreshToken,
  clearAuthTokens,
} from "../lib/apiClient";
import type {
  AuthActivityDto,
  AuthSessionDto,
  ChangePasswordRequestDto,
  CurrentUserDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
  RefreshTokenRequestDto,
} from "../types/api";
import { DEMO_MODE } from "../config/env";

const DEMO_USERS = {
  admin: {
    username: "admin.demo",
    password: "Demo123!",
    role: "SuperAdmin",
    fullName: "Quản trị viên demo",
    email: "admin.demo@internlink.local",
  },
  lecturer: {
    username: "gv.demo",
    password: "Demo123!",
    role: "Lecturer",
    fullName: "Giảng viên demo",
    email: "gv.demo@internlink.local",
  },
  student: {
    username: "sv.demo",
    password: "Demo123!",
    role: "Student",
    fullName: "Sinh viên demo",
    email: "sv.demo@internlink.local",
  },
} as const;

const DEMO_USER_STORAGE_KEY = "internlink_demo_user";

function getDemoUser() {
  const username = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  return Object.values(DEMO_USERS).find((user) => user.username === username) ?? null;
}

function demoToken(username: string) {
  return `demo-token-${username}`;
}

export const authService = {
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    if (DEMO_MODE) {
      const user = Object.values(DEMO_USERS).find(
        (candidate) => candidate.username === credentials.username && candidate.password === credentials.password,
      );
      if (!user) {
        throw new Error("Tài khoản hoặc mật khẩu demo không đúng.");
      }
      localStorage.setItem(DEMO_USER_STORAGE_KEY, user.username);
      const token = demoToken(user.username);
      setStoredToken(token);
      return {
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        role: user.role,
        mustChangePassword: false,
      };
    }
    const data = await apiRequest<LoginResponseDto>("/api/Auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
    });
    setStoredToken(data.token);
    if (data.refreshToken) {
      setStoredRefreshToken(data.refreshToken);
    }
    return data;
  },

  async refreshToken(payload: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    const data = await apiRequest<LoginResponseDto>("/api/Auth/refresh-token", {
      method: "POST",
      body: payload,
      auth: false,
    });
    setStoredToken(data.token);
    if (data.refreshToken) {
      setStoredRefreshToken(data.refreshToken);
    }
    return data;
  },

  async getMe(): Promise<CurrentUserDto> {
    if (DEMO_MODE) {
      const user = getDemoUser();
      if (!user) throw new Error("Phiên demo không hợp lệ.");
      return {
        id: `demo-${user.username}`,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: true,
        mustChangePassword: false,
      };
    }
    return apiRequest<CurrentUserDto>("/api/Auth/me");
  },

  async getSessions(): Promise<AuthSessionDto[]> {
    return apiRequest<AuthSessionDto[]>("/api/Auth/sessions");
  },

  async getActivity(limit = 30): Promise<AuthActivityDto[]> {
    return apiRequest<AuthActivityDto[]>(`/api/Auth/activity?limit=${limit}`);
  },

  async logout(): Promise<void> {
    if (DEMO_MODE) {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      clearAuthTokens();
      return;
    }
    const rfToken = getStoredRefreshToken();
    try {
      if (rfToken) {
        await apiRequest<null>("/api/Auth/revoke-token", {
          method: "POST",
          body: { refreshToken: rfToken },
        }).catch(() => null);
      } else {
        await apiRequest<null>("/api/Auth/logout", { method: "POST" });
      }
    } finally {
      clearAuthTokens();
    }
  },

  async changePassword(payload: ChangePasswordRequestDto): Promise<void> {
    await apiRequest<null>("/api/Auth/change-password", {
      method: "POST",
      body: payload,
    });
  },

  async forgotPassword(payload: ForgotPasswordRequestDto): Promise<void> {
    await apiRequest<null>("/api/Auth/forgot-password", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },

  async resetPassword(payload: ResetPasswordRequestDto): Promise<void> {
    await apiRequest<null>("/api/Auth/reset-password", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
};
