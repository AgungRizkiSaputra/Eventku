'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-transparent border-b-2 border-ink/20 px-0 py-2.5 text-body text-ink',
            'placeholder:text-ink-faint',
            'focus:outline-none focus:border-ink transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error',
            className,
          )}
          {...props}
        />
        {error && <p className="text-caption text-error">{error}</p>}
        {hint && !error && <p className="text-caption text-ink-faint">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };

