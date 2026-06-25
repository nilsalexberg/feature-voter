# UI Library

Located at `frontend/src/ui/`. Built on Tailwind v4.

## Tokens

Defined in `src/index.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F8F8F6` | Page background |
| `--color-surface` | `#FFFFFF` | Card/input backgrounds |
| `--color-border` | `#E2E1DC` | Borders, dividers |
| `--color-text` | `#1C1C1A` | Primary text |
| `--color-muted` | `#71706C` | Secondary text, placeholders |
| `--color-accent` | `#1A56DB` | Primary actions |
| `--color-vote` | `#D45F00` | Upvote interactions |
| `--color-danger` | `#C23B22` | Errors, destructive actions |
| `--font-sans` | Inter | Body text |
| `--font-display` | Instrument Serif | Headings |

Use as Tailwind utilities: `bg-accent`, `text-muted`, `border-border`, `font-display`, etc.

## Button

```tsx
import { Button } from '@/ui';

<Button variant="primary" size="md">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">Learn more</Button>
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `primary \| secondary \| ghost` | `primary` |
| `size` | `sm \| md \| lg` | `md` |

Forwards all native `<button>` props.

## Input

```tsx
import { Input } from '@/ui';

<Input label="Feature title" placeholder="What should we build?" />
<Input label="Email" type="email" error="Invalid email address" />
```

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | Renders `<label>` above, auto-links via `id` |
| `error` | `string` | Red border + message below |

Forwards all native `<input>` props.

## Textarea

```tsx
import { Textarea } from '@/ui';

<Textarea label="Description" placeholder="Describe the feature..." />
<Textarea label="Notes" error="Required" rows={6} />
```

Same props as `Input`. Resizable vertically, min-height 80px.

## Extending

Add new components to `src/ui/`, export from `src/ui/index.ts`. Use existing tokens — do not hardcode colors or fonts.
