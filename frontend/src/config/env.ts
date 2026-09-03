/** API base URL — in production Docker defaults to relative root (Nginx Reverse Proxy), in local dev defaults to port 7109. */
export const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '' : 'http://localhost:7109');
export const API_BASE_URL = API_URL;

/** API timeout in milliseconds */
export const API_TIMEOUT = parseInt(
  import.meta.env.VITE_API_TIMEOUT || '10000',
  10
);

// ===== Feature Flags =====
export const ENABLE_REAL_STUDENT_DATA =
  import.meta.env.VITE_ENABLE_REAL_STUDENT_DATA !== 'false';
export const ENABLE_REAL_ADMIN_DATA =
  import.meta.env.VITE_ENABLE_REAL_ADMIN_DATA !== 'false';
export const ENABLE_REAL_LECTURER_DATA =
  import.meta.env.VITE_ENABLE_REAL_LECTURER_DATA !== 'false';
export const ENABLE_REAL_AUTH =
  import.meta.env.VITE_ENABLE_REAL_AUTH !== 'false';

export const TOKEN_STORAGE_KEY = 'internlink_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'internlink_refresh_token';
