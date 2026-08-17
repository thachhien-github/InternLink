import { API_BASE_URL, TOKEN_STORAGE_KEY } from "../config/env";
import type { ApiResponse } from "../types/api";

export class ApiClientError extends Error {
  status: number;
  body?: ApiResponse<unknown>;

  constructor(message: string, status: number, body?: ApiResponse<unknown>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiClientError) return err.message;
  if (err instanceof Error) return err.message;
  return "Đã xảy ra lỗi không xác định.";
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  if (!text) {
    return { success: res.ok, data: undefined };
  }
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new ApiClientError(
      res.ok ? "Phản hồi API không hợp lệ." : `HTTP ${res.status}`,
      res.status,
    );
  }
}

export function resolveApiUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base.endsWith("/api") && p.startsWith("/api/")) {
    return `${base}${p.slice(4)}`;
  }
  return `${base}${p}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const url = resolveApiUrl(path);

  const reqHeaders = new Headers(headers);
  if (body !== undefined && !(body instanceof FormData)) {
    reqHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getStoredToken();
    if (token) reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...rest,
    headers: reqHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  const payload = await parseJson<T>(res);

  if (!res.ok || payload.success === false) {
    const msg =
      payload.error?.title ||
      payload.error?.detail ||
      `HTTP ${res.status}`;
    throw new ApiClientError(msg, res.status, payload);
  }

  return payload.data as T;
}

/** For endpoints that return raw JSON (e.g. EvaluationController). */
export async function apiRequestRaw<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const url = resolveApiUrl(path);

  const reqHeaders = new Headers(headers);
  if (body !== undefined && !(body instanceof FormData)) {
    reqHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getStoredToken();
    if (token) reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...rest,
    headers: reqHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = JSON.parse(text) as { message?: string; title?: string };
      msg = err.message ?? err.title ?? msg;
    } catch {
      /* ignore */
    }
    throw new ApiClientError(msg, res.status);
  }

  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function parseContentDispositionFilename(
  header: string | null,
): string | null {
  if (!header) return null;
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(header);
  return match ? decodeURIComponent(match[1].replace(/"/g, "")) : null;
}

/** Download binary file with JWT auth. */
export async function downloadAuthenticatedFile(
  path: string,
  fallbackFilename: string,
): Promise<{ blob: Blob; filename: string }> {
  const url = resolveApiUrl(path);
  const token = getStoredToken();
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = (await res.json()) as ApiResponse<unknown>;
      msg = err.error?.title ?? err.error?.detail ?? msg;
    } catch {
      /* binary or empty body */
    }
    throw new ApiClientError(msg, res.status);
  }
  const filename =
    parseContentDispositionFilename(res.headers.get("Content-Disposition")) ??
    fallbackFilename;
  const blob = await res.blob();
  return { blob, filename };
}

/** Trigger browser download for a blob (works reliably across browsers). */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
