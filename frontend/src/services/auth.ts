import { api } from './api';

export type TokenPair = { access: string; refresh: string };
export type User = { id: number; username: string; email: string };

export const authService = {
  login: (email: string, password: string) =>
    api.post<TokenPair>('/api/auth/login/', { email, password }),

  forgotPassword: (email: string) =>
    api.post<{ detail: string }>('/api/auth/forgot-password/', { email }),

  resetPassword: (uidb64: string, token: string, password: string) =>
    api.post<{ detail: string }>('/api/auth/reset-password/', {
      uidb64,
      token,
      password,
    }),

  me: (accessToken: string) =>
    api.get<User>('/api/auth/me/', {
      Authorization: `Bearer ${accessToken}`,
    }),
};
