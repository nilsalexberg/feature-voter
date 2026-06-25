import { AppLayout } from './AppLayout';

export function HomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <span className="w-3 h-3 rounded-full bg-accent/20 ring-4 ring-accent/10" />
        <h1 className="font-display italic text-[2rem] text-text leading-snug">
          No features yet.
        </h1>
        <p className="text-sm text-muted max-w-xs leading-relaxed">
          Submit a request and let your team vote on what gets built next.
        </p>
      </div>
    </AppLayout>
  );
}
