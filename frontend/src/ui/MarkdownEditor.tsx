import { useState } from 'react';
import { Textarea, type TextareaProps } from './Textarea';
import { MarkdownContent } from './MarkdownContent';

type Tab = 'write' | 'preview';

export interface MarkdownEditorProps extends Omit<TextareaProps, 'label'> {
  label?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  disabled,
  rows,
  error,
  id,
  ...props
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>('write');
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const minHeight = rows ? `${rows * 1.5}rem` : '7.5rem';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        {label && (
          <label htmlFor={tab === 'write' ? inputId : undefined} className="text-xs font-medium text-text">
            {label}
          </label>
        )}
        <a
          href="https://commonmark.org/help/"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted hover:text-text transition-colors flex items-center gap-0.5 shrink-0"
          tabIndex={-1}
        >
          Markdown supported
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
        <div className="flex gap-0.5 ml-auto">
          {(['write', 'preview'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`text-xs px-2 py-0.5 rounded transition-colors capitalize ${
                tab === t ? 'bg-accent text-white' : 'text-muted hover:text-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <Textarea
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          error={error}
          {...props}
        />
      ) : (
        <div
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text overflow-auto"
          style={{ minHeight }}
        >
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <span className="text-muted text-sm italic">Nothing to preview.</span>
          )}
        </div>
      )}
    </div>
  );
}
