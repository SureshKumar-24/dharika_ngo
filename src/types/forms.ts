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

// Student Support – micro-learning queries
export interface StudentQueryFormData {
  name: string;
  age?: string;
  city: string;
  locality: string;
  studentClass: string;
  subject: string;
  topic: string;
  phone: string;
  email: string;
  attendingOfflineClasses: 'yes' | 'no';
  honeypot?: string;
}

export interface StudentQuerySubmission {
  timestamp: string;
  name: string;
  age?: string;
  city: string;
  locality: string;
  studentClass: string;
  subject: string;
  topic: string;
  phone: string;
  email: string;
  attendingOfflineClasses: 'yes' | 'no';
  source: 'website';
}

// Food Rescue – surplus food alerts
export interface FoodAlertFormData {
  donorType: string;
  establishmentName: string;
  contactPersonName: string;
  phone: string;
  address: string;
  city: string;
  quantity: string;
  preparedAt: string;
  expiryEstimate: string;
  photoUrl?: string;
  declarationTodayPrepared: boolean;
  declarationHygienic: boolean;
  declarationSafe: boolean;
  honeypot?: string;
}

export interface FoodAlertSubmission {
  timestamp: string;
  donorType: string;
  establishmentName: string;
  contactPersonName: string;
  phone: string;
  address: string;
  city: string;
  quantity: string;
  preparedAt: string;
  expiryEstimate: string;
  photoUrl?: string;
  status: 'pending' | 'assigned' | 'completed';
  pickupPhotoUrl?: string;
  deliveryPhotoUrl?: string;
  source: 'website';
}
