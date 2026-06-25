import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { ApiError } from '@/services/api';

type State = { isPending: boolean; error: string | null };

export function useLogin() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ isPending: false, error: null });

  async function login(email: string, password: string) {
    setState({ isPending: true, error: null });
    try {
      const tokens = await authService.login(email, password);
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      navigate('/');
    } catch (error) {
      setState({
        isPending: false,
        error: resolveErrorMessage(error),
      });
    }
  }

  return { ...state, login };
}

function resolveErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Something went wrong. Please try again.';
  }
  const data = error.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === 'string') return d.detail;
    const first = Object.values(d)[0];
    if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
  }
  return 'Invalid credentials. Please try again.';
}
