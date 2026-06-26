# Voting API

Base path: `/api/voting/`

Authentication: JWT Bearer token (`Authorization: Bearer <access>`). **All endpoints require authentication.**

---

## Categories

### List

```
GET /api/voting/categories/
```

Returns all categories. No pagination.

**Response `200`**

```json
[
  { "id": 1, "name": "General" },
  { "id": 2, "name": "Performance" }
]
```

---

### Retrieve

```
GET /api/voting/categories/{id}/
```

**Response `200`** — single category object.

---

## Feature Requests

### List

```
GET /api/voting/feature-requests/
```

Returns paginated list of feature requests.

**Query params**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `page_size` | int | 20 | Items per page (max 100) |
| `ordering` | string | `-vote_count` | Sort field. Allowed: `vote_count`, `-vote_count`, `created_at`, `-created_at` |
| `search` | string | — | Case-insensitive match on `title` or `description` |
| `author` | int | — | Filter by author user ID |

**Response `200`**

```json
{
  "count": 42,
  "next": "http://localhost:8000/api/voting/feature-requests/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Dark mode",
      "description": "Add a dark mode toggle.",
      "author": { "id": 3, "username": "alice" },
      "category": { "id": 1, "name": "General" },
      "vote_count": 17,
      "has_voted": true,
      "created_at": "2026-06-25T12:00:00Z",
      "updated_at": "2026-06-25T12:00:00Z"
    }
  ]
}
```

---

### Create

```
POST /api/voting/feature-requests/
```

Requires auth.

**Body**

```json
{ "title": "Dark mode", "description": "Add a dark mode toggle.", "category_id": 1 }
```

**Response `201`** — full feature request object (author set to current user).

---

### Retrieve

```
GET /api/voting/feature-requests/{id}/
```

**Response `200`** — single feature request object (includes `category` nested object).

---

### Update (partial)

```
PATCH /api/voting/feature-requests/{id}/
```

Requires auth. Only the **owner** may update.

**Body** — any subset of writable fields:

```json
{ "title": "Updated title", "category_id": 2 }
```

**Response `200`** — updated feature request object.

**Response `403`** — not the owner.

---

### Delete

```
DELETE /api/voting/feature-requests/{id}/
```

Requires auth. Only the **owner** may delete.

**Response `204`** — no content.

**Response `403`** — not the owner.

---

## Votes

### Vote

```
POST /api/voting/feature-requests/{id}/vote/
```

Requires auth. Records one vote from the current user.

**Response `204`** — voted.

**Response `409`** — already voted.

---

### Unvote

```
DELETE /api/voting/feature-requests/{id}/vote/
```

Requires auth. Removes the current user's vote.

**Response `204`** — unvoted.

**Response `404`** — no existing vote to remove.

---

## Error shape

All errors follow DRF convention:

```json
{ "detail": "Human-readable message." }
```

Validation errors use field-keyed objects:

```json
{ "title": ["This field may not be blank."] }
```
