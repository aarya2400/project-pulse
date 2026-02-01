import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup(email, password, name, role);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account');
    }
  };

  const features = [
    'AI-powered project health monitoring',
    'Real-time risk prediction and alerts',
    'Smart task assignment recommendations',
    'Team performance analytics',
  ];

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

        <div className="space-y-8">
          <h2 className="text-4xl font-semibold leading-tight text-sidebar-primary-foreground">
            Start managing projects
            <br />
            <span className="text-sidebar-primary">the intelligent way</span>
          </h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary/20">
                  <Check className="h-3.5 w-3.5 text-sidebar-primary" />
                </div>
                <span className="text-sidebar-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sidebar-muted">
          © 2025 ProjectHealth. Enterprise-grade project management.
        </p>
      </div>

      {/* Right Panel - Signup Form */}
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
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="mt-2 text-muted-foreground">
              Get started with AI-powered project management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="form-group">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="email">Work Email</Label>
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
                  placeholder="At least 8 characters"
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
              <Label>Your Role</Label>
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
                      Lead & manage teams
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
                      Contribute to projects
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
