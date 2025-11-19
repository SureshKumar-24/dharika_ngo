import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, name, required, ...props }, ref) => {
    const selectId = id || name;
    
    return (
      <div className="w-full">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
          {required && <span className="text-maroon ml-1" aria-label="required">*</span>}
        </label>
        <div className="relative">
          <select
            id={selectId}
            name={name}
            ref={ref}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
              'flex h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-base',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
