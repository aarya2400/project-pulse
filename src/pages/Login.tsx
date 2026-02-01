import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
            <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-primary-foreground">
              ProjectHealth
            </h1>
            <p className="text-xs text-sidebar-muted">AI-Powered Management</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-semibold leading-tight text-sidebar-primary-foreground">
            Intelligent project oversight,
            <br />
            <span className="text-sidebar-primary">powered by AI</span>
          </h2>
          <p className="max-w-md text-sidebar-foreground">
            Gain real-time visibility into project health, predict risks before
            they impact deadlines, and make data-driven decisions with
            confidence.
          </p>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-semibold text-sidebar-primary-foreground">
                87%
              </p>
              <p className="text-sidebar-muted">Accuracy in risk prediction</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-sidebar-primary-foreground">
                2.5x
              </p>
              <p className="text-sidebar-muted">Faster issue resolution</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-sidebar-primary-foreground">
                40%
              </p>
              <p className="text-sidebar-muted">Reduction in overdue tasks</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-sidebar-muted">
          © 2025 ProjectHealth. Enterprise-grade project management.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">ProjectHealth</h1>
              <p className="text-xs text-muted-foreground">AI-Powered</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <Label>Sign in as</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                className="mt-3 grid grid-cols-2 gap-4"
              >
                <label
                  className={cn(
                    'flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors',
                    role === 'manager'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <RadioGroupItem value="manager" id="manager" className="sr-only" />
                  <div className="text-center">
                    <p className="font-medium">Team Manager</p>
                    <p className="text-xs text-muted-foreground">
                      Full access & controls
                    </p>
                  </div>
                </label>
                <label
                  className={cn(
                    'flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors',
                    role === 'member'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <RadioGroupItem value="member" id="member" className="sr-only" />
                  <div className="text-center">
                    <p className="font-medium">Team Member</p>
                    <p className="text-xs text-muted-foreground">
                      Task & project access
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
