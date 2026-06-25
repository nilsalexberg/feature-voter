import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-ink flex-col justify-between p-10 relative overflow-hidden">
        {/* Subtle grain texture overlay */}
        <div className="grain-overlay absolute inset-0 opacity-[0.1] pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group w-fit">
          <span className="w-2 h-2 rounded-full bg-accent group-hover:bg-white transition-colors" />
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
            featurevoter
          </span>
        </Link>

        {/* Quote */}
        <div className="flex flex-col gap-8">
          <p className="font-display italic text-white text-[2.25rem] leading-tight">
            Your vote shapes<br />what gets built.
          </p>
        </div>

        {/* Bottom filler */}
        <div />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted">
              featurevoter
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
