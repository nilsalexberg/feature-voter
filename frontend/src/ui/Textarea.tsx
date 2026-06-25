import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const textareaBase =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text ' +
  'placeholder:text-muted transition-colors resize-y min-h-[80px] ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const textareaError = 'border-danger focus:ring-danger/20 focus:border-danger';

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${textareaBase} ${error ? textareaError : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
