import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const inputBase =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text ' +
  'placeholder:text-muted transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const inputError = 'border-danger focus:ring-danger/20 focus:border-danger';

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${inputBase} ${error ? inputError : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
