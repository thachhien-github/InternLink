import { apiRequest, setStoredToken } from "../lib/apiClient";
import type {
  ChangePasswordRequestDto,
  CurrentUserDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
} from "../types/api";

export const authService = {
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    const data = await apiRequest<LoginResponseDto>("/api/Auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe(): Promise<CurrentUserDto> {
    return apiRequest<CurrentUserDto>("/api/Auth/me");
  },

  async logout(): Promise<void> {
    try {
      await apiRequest<null>("/api/Auth/logout", { method: "POST" });
    } finally {
      setStoredToken(null);
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
