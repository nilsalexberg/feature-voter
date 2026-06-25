import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const selectBase =
  'w-full rounded-md border border-border bg-surface pl-3 pr-8 py-2 text-sm text-text ' +
  'appearance-none cursor-pointer transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const selectError = 'border-danger focus:ring-danger/20 focus:border-danger';

export function Select({ label, error, className = '', id, children, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`${selectBase} ${error ? selectError : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
