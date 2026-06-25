import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { clearSession } from '@/services/api';
import { Dropdown, Dialog, Button } from '@/ui';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useCurrentUser();
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted group-hover:text-text transition-colors">
              featurevoter
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            {user && (
              <Dropdown
                trigger={
                  <button className="text-sm text-muted hover:text-text transition-colors px-1 py-0.5 rounded">
                    {user.email}
                  </button>
                }
                align="right"
                items={[
                  { label: 'Log out', onClick: () => setLogoutOpen(true), danger: true },
                ]}
              />
            )}
            <Dialog
              open={logoutOpen}
              onClose={() => setLogoutOpen(false)}
              title="Log out"
              size="sm"
            >
              <p className="text-sm text-muted">Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setLogoutOpen(false)}>Cancel</Button>
                <Button onClick={clearSession}>Log out</Button>
              </div>
            </Dialog>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
