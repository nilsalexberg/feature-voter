import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/ui';
import { AuthLayout } from './AuthLayout';
import { useForgotPassword } from '@/hooks/useForgotPassword';

export function ForgotPasswordPage() {
  const { submit, isPending, error, isSent, reset } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setFieldError('Email is required'); return; }
    setFieldError('');
    await submit(email);
  }

  if (isSent) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[1.375rem] font-semibold text-text tracking-tight">Check your inbox</h1>
            <p className="text-sm text-muted">
              We sent a reset link to <span className="text-text font-medium">{email}</span>.
              It expires in 30 minutes.
            </p>
          </div>
          <p className="text-sm text-muted">
            Didn't get it?{' '}
            <button
              type="button"
              onClick={reset}
              className="text-accent hover:opacity-80 transition-opacity font-medium"
            >
              Send again
            </button>
          </p>
          <Link to="/login" className="text-sm text-muted hover:text-text transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[1.375rem] font-semibold text-text tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError}
          />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-1" disabled={isPending}>
            {isPending ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <Link to="/login" className="text-sm text-muted hover:text-text transition-colors text-center">
          ← Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
