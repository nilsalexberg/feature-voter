import { useEffect, useState } from 'react';
import { authService, type User } from '@/services/auth';

type State = { user: User | null; isPending: boolean; error: string | null };

export function useCurrentUser() {
  const [state, setState] = useState<State>({ user: null, isPending: true, error: null });

  useEffect(() => {
    authService
      .me()
      .then((user) => setState({ user, isPending: false, error: null }))
      .catch(() => setState({ user: null, isPending: false, error: 'Failed to load user.' }));
  }, []);

  return state;
}
