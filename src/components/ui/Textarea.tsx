import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, name, required, rows = 4, labelClassName, ...props }, ref) => {
    const textareaId = id || name;
    
    return (
      <div className="w-full">
        <label
          htmlFor={textareaId}
          className={cn("block text-sm font-medium text-foreground mb-2", labelClassName)}
        >
          {label}
          {required && <span className="text-maroon ml-1" aria-label="required">*</span>}
        </label>
        <textarea
          id={textareaId}
          name={name}
          ref={ref}
          required={required}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base',
            'transition-colors',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
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

Textarea.displayName = 'Textarea';

export { Textarea };
