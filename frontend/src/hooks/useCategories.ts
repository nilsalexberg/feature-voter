import { useState, useEffect } from 'react';
import { categoryService, type Category } from '@/services/categories';
import { ApiError } from '@/services/api';

type State = { categories: Category[]; isPending: boolean; error: string | null };

export function useCategories() {
  const [state, setState] = useState<State>({ categories: [], isPending: true, error: null });

  useEffect(() => {
    let cancelled = false;
    categoryService
      .list()
      .then((categories) => {
        if (!cancelled) setState({ categories, isPending: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof ApiError ? 'Failed to load categories.' : 'Something went wrong.';
          setState({ categories: [], isPending: false, error: message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
