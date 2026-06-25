import { useState } from 'react';
import { Button, Input, Textarea } from '@/ui';

interface FeatureFormProps {
  defaultValues?: { title: string; description: string };
  onSubmit: (title: string, description: string) => Promise<void>;
  onCancel?: () => void;
  isPending: boolean;
  error: string | null;
  submitLabel: string;
}

export function FeatureForm({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  error,
  submitLabel,
}: FeatureFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [titleError, setTitleError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError(undefined);
    await onSubmit(title.trim(), description.trim());
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
      <Textarea
        label="Description"
        placeholder="Describe the feature in more detail…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        disabled={isPending}
      />
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" disabled={isPending}>
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
