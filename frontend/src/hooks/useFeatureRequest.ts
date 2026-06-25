import { useEffect, useState } from 'react';
import { featureService, type FeatureRequest } from '@/services/features';

type State = { data: FeatureRequest | null; isPending: boolean; error: string | null };

export function useFeatureRequest(id: number) {
  const [state, setState] = useState<State>({ data: null, isPending: true, error: null });

  useEffect(() => {
    setState({ data: null, isPending: true, error: null });
    featureService
      .get(id)
      .then((data) => setState({ data, isPending: false, error: null }))
      .catch(() =>
        setState({ data: null, isPending: false, error: 'Failed to load feature request.' }),
      );
  }, [id]);

  return state;
}
