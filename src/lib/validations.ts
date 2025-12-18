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

// Student Support – Micro-learning query form
export const studentQueryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  age: z
    .string()
    .regex(/^\d{1,2}$/, 'Please enter a valid age')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name must not exceed 100 characters')
    .trim(),
  locality: z
    .string()
    .min(2, 'Locality is required')
    .max(100, 'Locality must not exceed 100 characters')
    .trim(),
  studentClass: z
    .string()
    .refine(
      (val) => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(val),
      { message: 'Please select a class between 1 and 12' }
    ),
  subject: z
    .string()
    .refine(
      (val) => ['maths', 'english', 'hindi', 'science', 'other'].includes(val),
      { message: 'Please select a subject' }
    ),
  topic: z
    .string()
    .min(5, 'Please describe your topic or question (at least 5 characters)')
    .max(500, 'Topic description must not exceed 500 characters')
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  attendingOfflineClasses: z.enum(['yes', 'no']),
  honeypot: z.string().optional(),
});

export type StudentQueryFormInput = z.infer<typeof studentQueryFormSchema>;

// Food Rescue – Surplus food alert form
export const foodAlertFormSchema = z.object({
  donorType: z
    .string()
    .refine(
      (val) => ['restaurant', 'cafe', 'caterer', 'individual'].includes(val),
      { message: 'Please select a donor type' }
    ),
  establishmentName: z
    .string()
    .min(2, 'Establishment name is required')
    .max(150, 'Establishment name must not exceed 150 characters')
    .trim(),
  contactPersonName: z
    .string()
    .min(2, 'Contact person name is required')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  address: z
    .string()
    .min(5, 'Address is required')
    .max(300, 'Address must not exceed 300 characters')
    .trim(),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name must not exceed 100 characters')
    .trim(),
  quantity: z
    .string()
    .min(1, 'Please mention approximate quantity')
    .max(100, 'Quantity description is too long')
    .trim(),
  preparedAt: z
    .string()
    .min(1, 'Please specify time of preparation')
    .trim(),
  expiryEstimate: z
    .string()
    .refine(
      (val) => ['2_hours', '4_hours', '6_hours', '8_hours', 'same_day'].includes(val),
      { message: 'Please select an expiry estimate' }
    ),
  photoUrl: z
    .string()
    .url('Please enter a valid URL for the photo')
    .optional()
    .or(z.literal('')),
  declarationTodayPrepared: z.boolean().refine((val) => val === true, {
    message: 'Please confirm the food was prepared today',
  }),
  declarationHygienic: z.boolean().refine((val) => val === true, {
    message: 'Please confirm the food is stored hygienically',
  }),
  declarationSafe: z.boolean().refine((val) => val === true, {
    message: 'Please confirm the food is safe for consumption',
  }),
  honeypot: z.string().optional(),
});

export type FoodAlertFormInput = z.infer<typeof foodAlertFormSchema>;

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
