import { z } from 'zod';

/**
 * Validation schemas for form data using Zod
 */

// Volunteer Form Schema
export const volunteerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name must not exceed 100 characters')
    .trim(),
  interest: z.enum(['food', 'teaching', 'both'], {
    message: 'Please select your area of interest',
  }),
  availability: z
    .string()
    .min(10, 'Please provide at least 10 characters describing your availability')
    .max(500, 'Availability description must not exceed 500 characters')
    .trim(),
  honeypot: z.string().optional(),
});

export type VolunteerFormInput = z.infer<typeof volunteerFormSchema>;

// Suggestion Form Schema
export const suggestionFormSchema = z.object({
  name: z
    .string()
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim(),
  honeypot: z.string().optional(),
});

export type SuggestionFormInput = z.infer<typeof suggestionFormSchema>;

/**
 * Helper function to validate form data and return formatted errors
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  
  return { success: false, errors };
}
