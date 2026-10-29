'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-body-sm font-medium text-ink">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none bg-transparent border-b-2 border-ink/20 px-0 py-2.5 pr-8 text-body text-ink',
              'focus:outline-none focus:border-ink transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>
        {error && <p className="text-caption text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export { Select };

