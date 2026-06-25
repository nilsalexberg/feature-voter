import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '@/services/auth';
import { ApiError } from '@/services/api';

type PageState = 'idle' | 'done' | 'expired';
type State = { pageState: PageState; isPending: boolean; error: string | null };

export function useResetPassword() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();

  const [state, setState] = useState<State>({
    pageState: uidb64 && token ? 'idle' : 'expired',
    isPending: false,
    error: null,
  });

  async function submit(password: string) {
    if (!uidb64 || !token) return;

    setState((prev) => ({ ...prev, isPending: true, error: null }));
    try {
      await authService.resetPassword(uidb64, token, password);
      setState({ pageState: 'done', isPending: false, error: null });
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setState({ pageState: 'expired', isPending: false, error: null });
      } else {
        setState((prev) => ({
          ...prev,
          isPending: false,
          error: 'Something went wrong. Please try again.',
        }));
      }
    }
  }

  return { ...state, submit };
}
