/**
 * Utility functions for form handling
 */

/**
 * Scroll to the first error field in a form
 */
export function scrollToFirstError(errors: Record<string, string>) {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the element after scrolling
      setTimeout(() => {
        (element as HTMLElement).focus();
      }, 500);
    }
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string>): string {
  const errorCount = Object.keys(errors).length;
  if (errorCount === 1) {
    return Object.values(errors)[0];
  }
  return `Please fix ${errorCount} errors in the form`;
}

/**
 * Sanitize form data before submission
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data } as Record<string, any>;
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === 'string') {
      // Trim whitespace
      sanitized[key] = sanitized[key].trim();
    }
  });
  return sanitized as T;
}
