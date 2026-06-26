import { useState } from 'react';
import { featureService, type FeatureRequest } from '@/services/features';
import { ApiError } from '@/services/api';

type State = { isPending: boolean; error: string | null };

export function useCreateFeature() {
  const [state, setState] = useState<State>({ isPending: false, error: null });

  async function createFeature(title: string, description: string, category_id: number): Promise<FeatureRequest | undefined> {
    setState({ isPending: true, error: null });
    try {
      const feature = await featureService.create(title, description, category_id);
      setState({ isPending: false, error: null });
      return feature;
    } catch (error) {
      setState({ isPending: false, error: resolveError(error) });
    }
  }

  return { ...state, createFeature };
}

function resolveError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  const d = error.data as Record<string, unknown> | null;
  if (typeof d?.detail === 'string') return d.detail;
  const first = d ? Object.values(d)[0] : null;
  if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
  return 'Request failed. Please try again.';
}
