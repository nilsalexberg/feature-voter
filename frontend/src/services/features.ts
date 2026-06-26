import { api } from './api';

export type FeatureAuthor = { id: number; username: string };
export type FeatureCategory = { id: number; name: string };

export type FeatureRequest = {
  id: number;
  title: string;
  description: string;
  author: FeatureAuthor;
  category: FeatureCategory;
  vote_count: number;
  has_voted: boolean;
  created_at: string;
  updated_at: string;
};

export type FeatureRequestWritable = {
  title: string;
  description: string;
  category_id: number;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type FeatureRequestOrdering =
  | 'vote_count'
  | '-vote_count'
  | 'created_at'
  | '-created_at';

export type FeatureRequestParams = {
  page?: number;
  page_size?: number;
  ordering?: FeatureRequestOrdering;
  search?: string;
  author?: number;
};

export const featureService = {
  list: (params?: FeatureRequestParams) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.page_size !== undefined) query.set('page_size', String(params.page_size));
    if (params?.ordering) query.set('ordering', params.ordering);
    if (params?.search) query.set('search', params.search);
    if (params?.author !== undefined) query.set('author', String(params.author));
    const qs = query.toString();
    return api.get<PaginatedResponse<FeatureRequest>>(
      `/api/voting/feature-requests/${qs ? `?${qs}` : ''}`,
    );
  },

  get: (id: number) =>
    api.get<FeatureRequest>(`/api/voting/feature-requests/${id}/`),

  create: (title: string, description: string, category_id: number) =>
    api.post<FeatureRequest>('/api/voting/feature-requests/', { title, description, category_id }),

  update: (id: number, data: Partial<FeatureRequestWritable>) =>
    api.patch<FeatureRequest>(`/api/voting/feature-requests/${id}/`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/voting/feature-requests/${id}/`),

  vote: (id: number) =>
    api.post<void>(`/api/voting/feature-requests/${id}/vote/`, {}),

  unvote: (id: number) =>
    api.delete<void>(`/api/voting/feature-requests/${id}/vote/`),
};
