import { HealthStatus, TaskStatus, TaskPriority } from '@/types';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface HealthBadgeProps {
  health: HealthStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthBadge({ health, showLabel = true, size = 'md' }: HealthBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const labels: Record<HealthStatus, string> = {
    excellent: 'Excellent',
    good: 'Good',
    moderate: 'Moderate',
    'at-risk': 'At Risk',
    critical: 'Critical',
  };

  return (
    <span
      className={cn(
        'health-badge',
        sizeClasses[size],
        health === 'excellent' && 'health-excellent',
        health === 'good' && 'health-good',
        health === 'moderate' && 'health-moderate',
        health === 'at-risk' && 'health-at-risk',
        health === 'critical' && 'health-critical'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          health === 'excellent' && 'bg-health-excellent',
          health === 'good' && 'bg-health-good',
          health === 'moderate' && 'bg-health-moderate',
          health === 'at-risk' && 'bg-health-at-risk',
          health === 'critical' && 'bg-health-critical'
        )}
      />
      {showLabel && labels[health]}
    </span>
  );
}

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const configs: Record<TaskStatus, { label: string; icon: React.ElementType; className: string }> = {
    backlog: {
      label: 'Backlog',
      icon: Circle,
      className: 'bg-muted text-muted-foreground',
    },
    todo: {
      label: 'To Do',
      icon: Circle,
      className: 'bg-secondary text-secondary-foreground',
    },
    'in-progress': {
      label: 'In Progress',
      icon: Clock,
      className: 'bg-primary/10 text-primary',
    },
    review: {
      label: 'Review',
      icon: AlertCircle,
      className: 'bg-warning/10 text-warning',
    },
    done: {
      label: 'Done',
      icon: CheckCircle2,
      className: 'bg-success/10 text-success',
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.className
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const configs: Record<TaskPriority, { label: string; className: string }> = {
    low: {
      label: 'Low',
      className: 'bg-muted text-muted-foreground',
    },
    medium: {
      label: 'Medium',
      className: 'bg-info/10 text-info',
    },
    high: {
      label: 'High',
      className: 'bg-warning/10 text-warning',
    },
    urgent: {
      label: 'Urgent',
      className: 'bg-destructive/10 text-destructive',
    },
  };

  const config = configs[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs',
        config.className
      )}
    >
      {priority === 'urgent' && <AlertTriangle className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'neutral';
  value?: number;
  label?: string;
}

export function TrendIndicator({ trend, value, label }: TrendIndicatorProps) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <div
      className={cn(
        'flex items-center gap-1 text-xs',
        trend === 'up' && 'text-success',
        trend === 'down' && 'text-destructive',
        trend === 'neutral' && 'text-muted-foreground'
      )}
    >
      <Icon className="h-3 w-3" />
      {value !== undefined && (
        <span className="font-medium">
          {trend === 'up' ? '+' : trend === 'down' ? '' : ''}
          {value}%
        </span>
      )}
      {label && <span className="text-muted-foreground">{label}</span>}
    </div>
  );
}

interface ConfidenceIndicatorProps {
  score: number;
  showLabel?: boolean;
}

export function ConfidenceIndicator({ score, showLabel = true }: ConfidenceIndicatorProps) {
  const level = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
  const labels = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={cn(
              'h-3 w-1 rounded-full',
              bar === 1 && 'bg-current',
              bar === 2 && (level === 'high' || level === 'medium' ? 'bg-current' : 'bg-muted'),
              bar === 3 && (level === 'high' ? 'bg-current' : 'bg-muted'),
              level === 'high' && 'confidence-high',
              level === 'medium' && 'confidence-medium',
              level === 'low' && 'confidence-low'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {score}% · {labels[level]}
        </span>
      )}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex-1 overflow-hidden rounded-full bg-secondary', heightClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>}
    </div>
  );
}
