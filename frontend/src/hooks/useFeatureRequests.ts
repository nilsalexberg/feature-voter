import { useEffect, useState } from 'react';
import {
  featureService,
  type FeatureRequest,
  type FeatureRequestParams,
  type PaginatedResponse,
} from '@/services/features';

type State = {
  data: PaginatedResponse<FeatureRequest> | null;
  isPending: boolean;
  error: string | null;
};

export function useFeatureRequests(params?: FeatureRequestParams) {
  const [state, setState] = useState<State>({ data: null, isPending: true, error: null });

  useEffect(() => {
    setState((prev) => ({ ...prev, isPending: true, error: null }));
    featureService
      .list(params)
      .then((data) => setState({ data, isPending: false, error: null }))
      .catch(() =>
        setState({ data: null, isPending: false, error: 'Failed to load feature requests.' }),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.page_size, params?.ordering, params?.search, params?.author]);

  return state;
}
