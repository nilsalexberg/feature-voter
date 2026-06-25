import { useState } from 'react';
import { featureService } from '@/services/features';
import { ApiError } from '@/services/api';

type State = { isPending: boolean; error: string | null };

export function useUnvote() {
  const [state, setState] = useState<State>({ isPending: false, error: null });

  async function unvote(id: number): Promise<boolean> {
    setState({ isPending: true, error: null });
    try {
      await featureService.unvote(id);
      setState({ isPending: false, error: null });
      return true;
    } catch (error) {
      setState({ isPending: false, error: resolveError(error) });
      return false;
    }
  }

  return { ...state, unvote };
}

function resolveError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  if (error.status === 404) return 'You have not voted for this feature.';
  const d = error.data as Record<string, unknown> | null;
  if (typeof d?.detail === 'string') return d.detail;
  return 'Request failed. Please try again.';
}
