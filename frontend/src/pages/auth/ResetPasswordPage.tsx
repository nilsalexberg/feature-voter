import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/ui';
import { AuthLayout } from './AuthLayout';
import { useResetPassword } from '@/hooks/useResetPassword';

export function ResetPasswordPage() {
  const { submit, isPending, error, pageState } = useResetPassword();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

  function validate() {
    const next: typeof fieldErrors = {};
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Must be at least 8 characters';
    if (!confirm) next.confirm = 'Please confirm your password';
    else if (confirm !== password) next.confirm = "Passwords don't match";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) { setFieldErrors(next); return; }
    setFieldErrors({});
    await submit(password);
  }

  if (pageState === 'expired') {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[1.375rem] font-semibold text-text tracking-tight">Link expired</h1>
            <p className="text-sm text-muted">
              This reset link has expired or already been used. Request a new one.
            </p>
          </div>
          <Link to="/forgot-password">
            <Button variant="primary" size="lg" className="w-full">
              Request new link
            </Button>
          </Link>
          <Link to="/login" className="text-sm text-muted hover:text-text transition-colors text-center">
            ← Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (pageState === 'done') {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[1.375rem] font-semibold text-text tracking-tight">Password updated</h1>
            <p className="text-sm text-muted">You're all set. Sign in with your new password.</p>
          </div>
          <Link to="/login">
            <Button variant="primary" size="lg" className="w-full">
              Sign in
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[1.375rem] font-semibold text-text tracking-tight">Choose a new password</h1>
          <p className="text-sm text-muted">Pick something you haven't used before.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={fieldErrors.confirm}
          />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-1" disabled={isPending}>
            {isPending ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <Link to="/login" className="text-sm text-muted hover:text-text transition-colors text-center">
          ← Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
