import { api } from './api';

export type Category = { id: number; name: string };

let _cache: Category[] | null = null;

export const categoryService = {
  list: async (): Promise<Category[]> => {
    if (_cache) return _cache;
    const data = await api.get<Category[]>('/api/voting/categories/');
    _cache = data;
    return data;
  },
};
