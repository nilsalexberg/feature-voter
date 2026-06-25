import { useState } from 'react';
import { featureService } from '@/services/features';
import { ApiError } from '@/services/api';

type State = { isPending: boolean; error: string | null };

export function useDeleteFeature() {
  const [state, setState] = useState<State>({ isPending: false, error: null });

  async function deleteFeature(id: number): Promise<boolean> {
    setState({ isPending: true, error: null });
    try {
      await featureService.remove(id);
      setState({ isPending: false, error: null });
      return true;
    } catch (error) {
      setState({ isPending: false, error: resolveError(error) });
      return false;
    }
  }

  return { ...state, deleteFeature };
}

function resolveError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  const d = error.data as Record<string, unknown> | null;
  if (typeof d?.detail === 'string') return d.detail;
  return 'Request failed. Please try again.';
}
