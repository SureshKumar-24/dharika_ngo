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
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className="w-full">
        <label
          htmlFor={selectId}
          className={cn(
            'block text-sm font-medium mb-2 transition-colors',
            isFocused && !error && 'text-gold',
            error && 'text-red-600',
            !isFocused && !error && 'text-foreground'
          )}
        >
          {label}
          {required && <span className="text-maroon ml-1" aria-label="required">*</span>}
        </label>
        <div className="relative group">
          <select
            id={selectId}
            name={name}
            ref={ref}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'flex h-11 w-full appearance-none rounded-lg border-2 bg-white px-4 py-2 pr-10 text-base font-medium',
              'transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:shadow-md',
              'hover:border-gold/60 hover:shadow-sm',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
              'cursor-pointer',
              // Default state
              !error && 'border-gray-300 text-gray-900',
              // Placeholder state (when value is empty)
              props.value === '' && 'text-gray-400 font-normal',
              // Error state
              error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.value === '' ? true : false}
                className={cn(
                  'text-gray-900 font-normal py-2',
                  option.value === '' && 'text-gray-400 bg-gray-50'
                )}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200',
            isFocused && 'rotate-180'
          )}>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-colors',
                error ? 'text-red-500' : isFocused ? 'text-gold' : 'text-gray-400 group-hover:text-gold'
              )}
              aria-hidden="true"
            />
          </div>
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
