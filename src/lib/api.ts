import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}${API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    this.client.interceptors.request.use((config) => {
      config = this.addAuthHeader(config);
      config = this.addTenantHeader(config);
      return config;
    });
    this.client.interceptors.response.use(
      (response) => response,
      this.handleError.bind(this)
    );
  }

  private addAuthHeader(config: InternalAxiosRequestConfig) {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  private addTenantHeader(config: InternalAxiosRequestConfig) {
    if (config.headers?.['X-Tenant-ID']) return config;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tenantId = params.get('tenantId');
      if (tenantId && config.headers) {
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }
    return config;
  }

  private async handleError(error: AxiosError) {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await this.refreshAccessToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return this.client(originalRequest);
      } catch {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    this.refreshPromise = (async () => {
      try {
        const headers: Record<string, string> = {};
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const tenantId = params.get('tenantId');
          if (tenantId) headers['X-Tenant-ID'] = tenantId;
        }
        const response = await axios.post(
          `${API_URL}${API_PREFIX}/auth/refresh`,
          { refreshToken },
          { headers }
        );
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;
        setTokens({ accessToken, refreshToken: newRefreshToken });
        return accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async get<T>(url: string, params?: Record<string, any>, tenantId?: string) {
    return this.client.get<T>(url, {
      params,
      headers: tenantId ? { 'X-Tenant-ID': tenantId } : undefined,
    });
  }

  async post<T>(url: string, data?: any, tenantId?: string) {
    return this.client.post<T>(url, data, {
      headers: tenantId ? { 'X-Tenant-ID': tenantId } : undefined,
    });
  }

  async put<T>(url: string, data?: any, tenantId?: string) {
    return this.client.put<T>(url, data, {
      headers: tenantId ? { 'X-Tenant-ID': tenantId } : undefined,
    });
  }

  async patch<T>(url: string, data?: any, tenantId?: string) {
    return this.client.patch<T>(url, data, {
      headers: tenantId ? { 'X-Tenant-ID': tenantId } : undefined,
    });
  }

  async delete<T>(url: string, tenantId?: string) {
    return this.client.delete<T>(url, {
      headers: tenantId ? { 'X-Tenant-ID': tenantId } : undefined,
    });
  }
}

export const api = new ApiClient();

import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  if (typeof window === 'undefined') return;
  Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
    expires: 1 / 96,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
