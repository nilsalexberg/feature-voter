import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { FeatureCard } from './FeatureCard';
import { Pagination } from './Pagination';
import { Button, Input, Select } from '@/ui';
import { useFeatureRequests } from '@/hooks/useFeatureRequests';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useVote } from '@/hooks/useVote';
import { useUnvote } from '@/hooks/useUnvote';
import type { FeatureRequestOrdering } from '@/services/features';

const PAGE_SIZE = 20;

const ORDERING_OPTIONS: { label: string; value: FeatureRequestOrdering }[] = [
  { label: 'Most votes', value: '-vote_count' },
  { label: 'Least votes', value: 'vote_count' },
  { label: 'Newest', value: '-created_at' },
  { label: 'Oldest', value: 'created_at' },
];

type VoteOverride = { has_voted: boolean; vote_count: number };

export function HomePage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState<FeatureRequestOrdering>('-vote_count');
  const [page, setPage] = useState(1);
  const [voteOverrides, setVoteOverrides] = useState<Map<number, VoteOverride>>(new Map());
  const [pendingVoteId, setPendingVoteId] = useState<number | null>(null);

  const { data, isPending, error, refetch } = useFeatureRequests({
    page,
    page_size: PAGE_SIZE,
    ordering,
    search: search || undefined,
  });

  const { user: currentUser } = useCurrentUser();
  const { vote } = useVote();
  const { unvote } = useUnvote();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setVoteOverrides(new Map());
  }, [page, search, ordering]);

  async function handleVoteToggle(id: number, hasVoted: boolean, voteCount: number) {
    if (pendingVoteId !== null) return;
    setPendingVoteId(id);

    setVoteOverrides((prev) => {
      const next = new Map(prev);
      next.set(id, {
        has_voted: !hasVoted,
        vote_count: hasVoted ? voteCount - 1 : voteCount + 1,
      });
      return next;
    });

    const success = hasVoted ? await unvote(id) : await vote(id);

    if (!success) {
      setVoteOverrides((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }

    setPendingVoteId(null);
  }

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;
  const results = data?.results ?? [];
  const isEmpty = !isPending && !error && results.length === 0;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display italic text-[2rem] text-text leading-snug">
              Feature Requests
            </h1>
            {data && (
              <p className="text-xs text-muted mt-0.5">
                {data.count} {data.count === 1 ? 'request' : 'requests'}
              </p>
            )}
          </div>
          <Button onClick={() => navigate('/features/new')}>New request</Button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search features…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value as FeatureRequestOrdering);
                setPage(1);
              }}
            >
              {ORDERING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isPending && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-border/50 animate-pulse" />
            ))}
          </div>
        )}

        {error && !isPending && (
          <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
            <span className="w-3 h-3 rounded-full bg-accent/20 ring-4 ring-accent/10" />
            {search ? (
              <>
                <p className="text-sm text-muted">No features match &ldquo;{search}&rdquo;.</p>
                <Button variant="ghost" size="sm" onClick={() => setSearchInput('')}>
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-display italic text-[2rem] text-text leading-snug">
                  No features yet.
                </h2>
                <p className="text-sm text-muted max-w-xs leading-relaxed">
                  Submit a request and let your team vote on what gets built next.
                </p>
              </>
            )}
          </div>
        )}

        {!isPending && results.length > 0 && (
          <div className="flex flex-col border border-border rounded-lg overflow-hidden divide-y divide-border">
            {results.map((feature) => {
              const override = voteOverrides.get(feature.id);
              const hasVoted = override?.has_voted ?? feature.has_voted;
              const voteCount = override?.vote_count ?? feature.vote_count;

              return (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  hasVoted={hasVoted}
                  voteCount={voteCount}
                  isPending={pendingVoteId === feature.id}
                  onVoteToggle={handleVoteToggle}
                  isOwner={currentUser?.username === feature.author.username}
                  onDelete={refetch}
                />
              );
            })}
          </div>
        )}

        {!isPending && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        )}
      </div>
    </AppLayout>
  );
}
