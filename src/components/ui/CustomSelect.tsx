'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectId = id || name;

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || options[0]?.label || 'Select...';
  const isPlaceholder = !value || value === '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: { value: optionValue, name },
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className={cn('w-full', className)} ref={dropdownRef}>
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

      <div className="relative">
        {/* Hidden native select for form submission */}
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown trigger */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !isOpen && setIsFocused(false)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={selectId}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-lg border-2 bg-white px-4 py-2 text-base font-medium text-left',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:shadow-md',
            'hover:border-gold/60 hover:shadow-sm',
            'cursor-pointer',
            // Default state
            !error && 'border-gray-300',
            // Placeholder state
            isPlaceholder && 'text-gray-400 font-normal',
            // Selected state
            !isPlaceholder && 'text-gray-900',
            // Error state
            error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
            // Open state
            isOpen && 'border-gold ring-2 ring-gold/30 shadow-md'
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown
            className={cn(
              'h-5 w-5 transition-all duration-200 flex-shrink-0 ml-2',
              error ? 'text-red-500' : isFocused || isOpen ? 'text-gold' : 'text-gray-400',
              isOpen && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </button>

        {/* Custom dropdown menu */}
        {isOpen && (
          <div
            role="listbox"
            className={cn(
              'absolute z-50 w-full mt-2 bg-white border-2 border-gold rounded-lg shadow-xl',
              'max-h-60 overflow-auto',
              'animate-in fade-in-0 zoom-in-95 duration-200'
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isDisabled = option.value === '';

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleOptionClick(option.value)}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-base flex items-center justify-between',
                    'transition-colors duration-150',
                    'first:rounded-t-lg last:rounded-b-lg',
                    // Disabled/placeholder option
                    isDisabled && 'text-gray-400 bg-gray-50 cursor-not-allowed font-normal',
                    // Regular options
                    !isDisabled && 'text-gray-900 hover:bg-gold/10 hover:text-gold cursor-pointer',
                    // Selected option
                    isSelected && !isDisabled && 'bg-gold/20 text-gold font-medium',
                    // Focus state
                    !isDisabled && 'focus:outline-none focus:bg-gold/10 focus:text-gold'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && !isDisabled && (
                    <Check className="h-4 w-4 text-gold flex-shrink-0 ml-2" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Error message */}
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
};

CustomSelect.displayName = 'CustomSelect';
