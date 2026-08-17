import { AxiosError } from 'axios';

/**
 * API Error Handler
 * Provides error parsing and user-friendly messages
 */

export interface ApiErrorResponse {
  message: string;
  status: number;
  details?: any;
  timestamp?: string;
}

export interface ParsedError {
  message: string;
  status?: number;
  details?: any;
  userMessage: string;
}

/**
 * Parse API error into user-friendly message
 */
export const parseApiError = (error: any): ParsedError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    let userMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';

    if (status === 401) {
      userMessage = 'Đăng nhập hết hạn. Vui lòng đăng nhập lại.';
    } else if (status === 403) {
      userMessage = 'Bạn không có quyền truy cập tài nguyên này.';
    } else if (status === 404) {
      userMessage = 'Tài nguyên không tìm thấy.';
    } else if (status === 400) {
      userMessage = data?.message || 'Yêu cầu không hợp lệ.';
    } else if (status === 500) {
      userMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
    } else if (!error.response) {
      userMessage =
        'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
    }

    return {
      message: data?.message || error.message,
      status,
      details: data,
      userMessage,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      userMessage: error.message,
    };
  }

  return {
    message: String(error),
    userMessage: 'Đã xảy ra lỗi không xác định.',
  };
};

/**
 * Log API error
 */
export const logApiError = (error: any, context?: string) => {
  const parsed = parseApiError(error);
  console.error(
    `[API Error${context ? ` - ${context}` : ''}]`,
    parsed.message,
    'Details:',
    parsed.details
  );
};

/**
 * Handle API error in UI
 */
export const handleApiError = (
  error: any,
  context?: string
): ParsedError => {
  const parsed = parseApiError(error);
  logApiError(error, context);
  return parsed;
};
