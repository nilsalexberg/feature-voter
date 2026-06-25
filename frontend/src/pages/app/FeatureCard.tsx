import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteFeature } from '@/hooks/useDeleteFeature';
import type { FeatureRequest } from '@/services/features';
import { Dialog, Button, MarkdownContent } from '@/ui';

interface FeatureCardProps {
  feature: FeatureRequest;
  hasVoted: boolean;
  voteCount: number;
  isPending: boolean;
  onVoteToggle: (id: number, hasVoted: boolean, voteCount: number) => void;
  isOwner?: boolean;
  onDelete?: () => void;
}

export function FeatureCard({
  feature,
  hasVoted,
  voteCount,
  isPending,
  onVoteToggle,
  isOwner,
  onDelete,
}: FeatureCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { deleteFeature, isPending: isDeleting } = useDeleteFeature();

  async function handleDelete() {
    const success = await deleteFeature(feature.id);
    if (success) onDelete?.();
  }

  return (
    <div className="flex items-start gap-4 px-4 py-4 bg-surface hover:bg-bg transition-colors">
      <button
        onClick={() => onVoteToggle(feature.id, hasVoted, voteCount)}
        disabled={isPending}
        aria-label={hasVoted ? 'Remove vote' : 'Upvote'}
        aria-pressed={hasVoted}
        className={`flex flex-col items-center gap-0.5 min-w-[2.5rem] pt-0.5 rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none ${
          hasVoted ? 'text-vote' : 'text-muted hover:text-vote'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 3L14 11H2L8 3Z"
            fill={hasVoted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-medium tabular-nums">{voteCount}</span>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text leading-snug">{feature.title}</p>
        {feature.description && (
          <div className="text-xs text-muted mt-1 leading-relaxed [&_.markdown-content]:text-xs [&_.markdown-content]:text-muted">
            <MarkdownContent content={feature.description} />
          </div>
        )}
        <p className="text-[11px] text-muted mt-1.5">
          by {feature.author.username} &middot;{' '}
          {new Date(feature.created_at).toLocaleDateString()}
        </p>
      </div>

      {isOwner && (
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <Link
            to={`/features/${feature.id}/edit`}
            aria-label="Edit"
            className="p-1 rounded text-muted hover:text-text transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete"
            className="p-1 rounded text-muted hover:text-danger transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 4H12M5 4V2.5H9V4M4.5 4L5 11H9L9.5 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Dialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            title="Delete feature"
            size="sm"
          >
            <p className="text-sm text-muted">
              Delete &ldquo;{feature.title}&rdquo;? This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
}
