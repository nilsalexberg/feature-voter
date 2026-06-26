const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const DEV_DELAY_MS = 500;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(`HTTP ${status}`);
  }
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('No refresh token');

  const response = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);

  localStorage.setItem('access_token', data.access);
  return data.access as string;
}

export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.replace('/login');
}

function doFetch(path: string, options: RequestInit | undefined, token: string | null) {
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options?.headers,
    },
  });
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (import.meta.env.DEV) await sleep(DEV_DELAY_MS);

  const token = localStorage.getItem('access_token');
  const response = await doFetch(path, options, token);

  if (response.status === 401) {
    if (!token) {
      const data = await response.json().catch(() => null);
      throw new ApiError(response.status, data);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;

      const retryResponse = await doFetch(path, options, newToken);

      const retryData = await retryResponse.json().catch(() => null);
      if (!retryResponse.ok) throw new ApiError(retryResponse.status, retryData);
      return retryData as T;
    } catch {
      clearSession();
      throw new ApiError(401, null);
    }
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  return data as T;
}

export const api = {
  get: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'GET', headers }),
  post: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), headers }),
  put: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body), headers }),
  patch: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), headers }),
  delete: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'DELETE', headers }),
};
