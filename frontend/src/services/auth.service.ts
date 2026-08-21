import {
  apiRequest,
  setStoredToken,
  setStoredRefreshToken,
  getStoredRefreshToken,
  clearAuthTokens,
} from "../lib/apiClient";
import type {
  ChangePasswordRequestDto,
  CurrentUserDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
  RefreshTokenRequestDto,
} from "../types/api";

export const authService = {
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
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
    return apiRequest<CurrentUserDto>("/api/Auth/me");
  },

  async logout(): Promise<void> {
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
