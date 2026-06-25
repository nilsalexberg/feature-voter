import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { clearSession } from '@/services/api';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useCurrentUser();
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
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm px-3 py-1.5 rounded-md transition-colors ${
                  isActive ? 'text-text font-medium' : 'text-muted hover:text-text'
                }`
              }
            >
              Features
            </NavLink>
            {user && (
              <span className="text-sm text-muted">{user.email}</span>
            )}
            {user && (
              <button
                onClick={clearSession}
                className="text-sm px-3 py-1.5 rounded-md text-muted hover:text-text transition-colors"
              >
                Logout
              </button>
            )}
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
