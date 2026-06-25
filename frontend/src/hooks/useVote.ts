import { useState } from 'react';
import { featureService } from '@/services/features';
import { ApiError } from '@/services/api';

type State = { isPending: boolean; error: string | null };

export function useVote() {
  const [state, setState] = useState<State>({ isPending: false, error: null });

  async function vote(id: number): Promise<boolean> {
    setState({ isPending: true, error: null });
    try {
      await featureService.vote(id);
      setState({ isPending: false, error: null });
      return true;
    } catch (error) {
      setState({ isPending: false, error: resolveError(error) });
      return false;
    }
  }

  return { ...state, vote };
}

function resolveError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  if (error.status === 409) return 'You have already voted for this feature.';
  const d = error.data as Record<string, unknown> | null;
  if (typeof d?.detail === 'string') return d.detail;
  return 'Request failed. Please try again.';
}
