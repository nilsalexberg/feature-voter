import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  'inline-flex items-center justify-center font-medium rounded-md transition-opacity cursor-pointer ' +
  'disabled:opacity-40 disabled:pointer-events-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'bg-surface text-accent border border-accent hover:bg-accent/5',
  ghost: 'text-muted hover:text-text hover:bg-border/60',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-8 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
