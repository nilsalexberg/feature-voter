import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteFeature } from '@/hooks/useDeleteFeature';
import type { FeatureRequest } from '@/services/features';

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
  const [isConfirming, setIsConfirming] = useState(false);
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
          <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
            {feature.description}
          </p>
        )}
        <p className="text-[11px] text-muted mt-1.5">
          by {feature.author.username} &middot;{' '}
          {new Date(feature.created_at).toLocaleDateString()}
        </p>
      </div>

      {isOwner && (
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          {isConfirming ? (
            <>
              <span className="text-[11px] text-muted">Delete?</span>
              <button
                onClick={() => setIsConfirming(false)}
                className="text-[11px] text-muted hover:text-text transition-colors px-1.5 py-0.5 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-[11px] text-danger hover:text-danger/80 transition-colors px-1.5 py-0.5 rounded disabled:opacity-40 disabled:pointer-events-none"
              >
                {isDeleting ? '…' : 'Yes'}
              </button>
            </>
          ) : (
            <>
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
                onClick={() => setIsConfirming(true)}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
