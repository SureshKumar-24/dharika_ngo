/**
 * Form data types for Dharika NGO website
 */

export interface VolunteerFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: 'food' | 'teaching' | 'both';
  availability: string;
  honeypot?: string;
}

export interface SuggestionFormData {
  name?: string;
  email?: string;
  message: string;
  honeypot?: string;
}

export interface VolunteerSubmission {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: 'food' | 'teaching' | 'both';
  availability: string;
  source: 'website';
}

export interface SuggestionSubmission {
  timestamp: string;
  name?: string;
  email?: string;
  message: string;
  source: 'website';
}
