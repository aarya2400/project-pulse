import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendIndicator } from './StatusIndicators';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  change,
  changeLabel,
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold tracking-tight">{value}</span>
        {trend && change !== undefined && (
          <TrendIndicator trend={trend} value={change} label={changeLabel} />
        )}
      </div>
    </div>
  );
}

interface AIInsightCardProps {
  type: 'risk' | 'recommendation' | 'prediction' | 'alert';
  title: string;
  description: string;
  confidenceScore: number;
  signals: string[];
  projectName?: string;
  className?: string;
  onAction?: () => void;
}

export function AIInsightCard({
  type,
  title,
  description,
  confidenceScore,
  signals,
  projectName,
  className,
}: AIInsightCardProps) {
  const typeStyles = {
    risk: 'border-l-destructive',
    alert: 'border-l-warning',
    recommendation: 'border-l-primary',
    prediction: 'border-l-success',
  };

  const typeLabels = {
    risk: 'Risk Detected',
    alert: 'Alert',
    recommendation: 'Recommendation',
    prediction: 'Prediction',
  };

  return (
    <div className={cn('ai-insight-card', typeStyles[type], className)}>
      <div className="relative z-10 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-2xs font-medium uppercase tracking-wider',
                  type === 'risk' && 'text-destructive',
                  type === 'alert' && 'text-warning',
                  type === 'recommendation' && 'text-primary',
                  type === 'prediction' && 'text-success'
                )}
              >
                {typeLabels[type]}
              </span>
              {projectName && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-2xs text-muted-foreground">{projectName}</span>
                </>
              )}
            </div>
            <h4 className="font-medium">{title}</h4>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1">
            <span className="text-xs font-medium">{confidenceScore}%</span>
            <span className="text-2xs text-muted-foreground">confidence</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Contributing Signals:</p>
          <ul className="space-y-1">
            {signals.map((signal, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {Icon && <Icon className="empty-state-icon" />}
      <div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-description">{description}</p>
      </div>
      {action}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
