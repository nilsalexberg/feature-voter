import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/ui';
import { AuthLayout } from './AuthLayout';
import { useLogin } from '@/hooks/useLogin';

export function LoginPage() {
  const { login, isPending, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const next: typeof fieldErrors = {};
    if (!email) next.email = 'Email is required';
    if (!password) next.password = 'Password is required';
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) { setFieldErrors(next); return; }
    setFieldErrors({});
    await login(email, password);
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[1.375rem] font-semibold text-text tracking-tight">Sign in</h1>
          <p className="text-sm text-muted">Vote on features. Shape the roadmap.</p>
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
            error={fieldErrors.email}
          />
          <div className="flex flex-col gap-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-muted hover:text-text transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-1" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
