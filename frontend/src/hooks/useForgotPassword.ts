import { useState } from 'react';
import { authService } from '@/services/auth';

type State = { isPending: boolean; error: string | null; isSent: boolean };

export function useForgotPassword() {
  const [state, setState] = useState<State>({
    isPending: false,
    error: null,
    isSent: false,
  });

  async function submit(email: string) {
    setState({ isPending: true, error: null, isSent: false });
    try {
      await authService.forgotPassword(email);
      setState({ isPending: false, error: null, isSent: true });
    } catch {
      setState({
        isPending: false,
        error: 'Something went wrong. Please try again.',
        isSent: false,
      });
    }
  }

  function reset() {
    setState({ isPending: false, error: null, isSent: false });
  }

  return { ...state, submit, reset };
}
