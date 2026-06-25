# API Patterns

## HTTP Client (`src/services/api.ts`)

Thin wrapper around `fetch`. All methods throw `ApiError` on non-2xx.

```ts
import { api } from '@/services/api';

api.get<T>(path, headers?)
api.post<T>(path, body, headers?)
api.put<T>(path, body, headers?)       // full replace
api.patch<T>(path, body, headers?)     // partial update
api.delete<T>(path, headers?)
```

`ApiError` carries `.status` (HTTP code) and `.data` (parsed JSON body or `null`).

---

## Service Layer (`src/services/*.ts`)

Group related endpoints into a plain object. Import `api`; never call `fetch` directly.

```ts
// src/services/features.ts
import { api } from './api';

export type Feature = { id: number; title: string; description: string; votes: number };

export const featureService = {
  list: () =>
    api.get<Feature[]>('/api/features/'),

  create: (title: string, description: string) =>
    api.post<Feature>('/api/features/', { title, description }),

  update: (id: number, data: Partial<Feature>) =>
    api.patch<Feature>(`/api/features/${id}/`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/features/${id}/`),

  upvote: (id: number) =>
    api.post<Feature>(`/api/features/${id}/upvote/`, {}),
};
```

Rules:
- One file per domain (`auth.ts`, `features.ts`, …).
- Services are pure data — no React, no state.
- Auth headers go in the service, not the component.

---

## Hook Layer (`src/hooks/use*.ts`)

Hooks own state and side effects. One hook per action/resource.

```ts
// src/hooks/useCreateFeature.ts
import { useState } from 'react';
import { featureService } from '@/services/features';
import { ApiError } from '@/services/api';

type State = { isPending: boolean; error: string | null };

export function useCreateFeature() {
  const [state, setState] = useState<State>({ isPending: false, error: null });

  async function createFeature(title: string, description: string) {
    setState({ isPending: true, error: null });
    try {
      const feature = await featureService.create(title, description);
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
  return 'Request failed. Please try again.';
}
```

Rules:
- Hooks call services — never `api` directly.
- Expose `isPending`, `error`, and the action function.
- `resolveError` lives next to the hook that uses it (not shared unless identical).
- No business logic in components; components only call hook actions and render state.

---

## Data Flow

```
Component
  └─ calls hook action (e.g. createFeature)
       └─ hook calls service (featureService.create)
            └─ service calls api.post
                 └─ fetch → Django REST API
```
