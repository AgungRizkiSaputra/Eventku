'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-200 press-scale select-none',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-accent text-white hover:bg-accent-hover': variant === 'primary',
            'bg-ink text-ground hover:bg-ink/90': variant === 'secondary',
            'border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-ground': variant === 'outline',
            'bg-transparent text-ink hover:bg-ground-muted': variant === 'ghost',
            'bg-error text-white hover:bg-error/90': variant === 'danger',
          },
          {
            'px-4 py-2 text-body-sm': size === 'sm',
            'px-6 py-3 text-body': size === 'md',
            'px-8 py-4 text-body-lg': size === 'lg',
          },
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
export type { ButtonProps };

