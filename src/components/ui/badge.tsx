import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-caption font-medium',
        {
          'bg-ground-muted text-ink': variant === 'default',
          'bg-accent-muted text-accent': variant === 'accent',
          'bg-emerald-50 text-success': variant === 'success',
          'bg-amber-50 text-warning': variant === 'warning',
          'bg-red-50 text-error': variant === 'error',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}

