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

## Select

```tsx
import { Select } from '@/ui';

<Select label="Status" defaultValue="">
  <option value="" disabled>Pick one</option>
  <option value="open">Open</option>
  <option value="closed">Closed</option>
</Select>
<Select label="Priority" error="Required" />
```

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | Renders `<label>` above, auto-links via `id` |
| `error` | `string` | Red border + message below |

Wraps native `<select>`. Forwards all native props. Pass `<option>` elements as children.

## Dropdown

Custom menu triggered by arbitrary content. Not a form input — use `Select` for form fields.

```tsx
import { Dropdown } from '@/ui';
import { Button } from '@/ui';

<Dropdown
  trigger={<Button variant="secondary">Actions</Button>}
  align="right"
  items={[
    { label: 'Edit', onClick: () => {} },
    { label: 'Duplicate', onClick: () => {} },
    { label: 'Delete', onClick: () => {}, danger: true },
    { label: 'Archived', onClick: () => {}, disabled: true },
  ]}
/>
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `trigger` | `ReactNode` | — | Element that opens/closes the menu |
| `items` | `DropdownItem[]` | — | Menu entries |
| `align` | `left \| right` | `left` | Menu alignment relative to trigger |

`DropdownItem` fields: `label` (string), `onClick` (() => void), `disabled?` (boolean), `danger?` (boolean — renders in `text-danger`).

Closes on outside click and `Escape`.

## Dialog

Modal dialog using native `<dialog>` + `showModal()`. Rendered into `document.body` via portal.

```tsx
import { Dialog } from '@/ui';
import { Button } from '@/ui';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm action"
  size="sm"
>
  <p className="text-sm text-muted">This cannot be undone.</p>
  <div className="mt-4 flex justify-end gap-2">
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </div>
</Dialog>
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called on backdrop click, `Escape`, or close button |
| `title` | `string` | — | Renders header with close button; omit for bare dialog |
| `size` | `sm \| md \| lg` | `md` | Max-width: 384 / 448 / 512px |
| `children` | `ReactNode` | — | Dialog body content |

## Extending

Add new components to `src/ui/`, export from `src/ui/index.ts`. Use existing tokens — do not hardcode colors or fonts.
