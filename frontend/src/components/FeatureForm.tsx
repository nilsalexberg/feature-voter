import { useState } from 'react';
import { Button, Input, MarkdownEditor, Select } from '@/ui';
import type { FeatureCategory } from '@/services/features';

interface FeatureFormProps {
  categories: FeatureCategory[];
  defaultValues?: { title: string; description: string; category_id?: number };
  onSubmit: (title: string, description: string, categoryId: number) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  error: string | null;
  submitLabel: string;
}

export function FeatureForm({
  categories,
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  error,
  submitLabel,
}: FeatureFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [categoryId, setCategoryId] = useState<number | undefined>(
    defaultValues?.category_id ?? categories[0]?.id,
  );
  const [titleError, setTitleError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError(undefined);
    if (categoryId === undefined) return;
    await onSubmit(title.trim(), description.trim(), categoryId);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Input
        label="Title"
        placeholder="What should we build?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={titleError}
        disabled={isPending}
        autoFocus
      />
      <Select
        label="Category"
        value={categoryId ?? ''}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        disabled={isPending || categories.length === 0}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <MarkdownEditor
        label="Description"
        placeholder="Describe the feature in more detail…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        disabled={isPending}
      />
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" disabled={isPending || categoryId === undefined}>
          {isPending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
