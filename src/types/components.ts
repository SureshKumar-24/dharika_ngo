/**
 * Component prop interfaces for Dharika NGO website
 */

import { CarouselSlide, Testimonial } from './notion';
import { VolunteerFormData, SuggestionFormData } from './forms';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'maroon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'url';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface TextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}

export interface SelectProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface GoldDividerProps {
  className?: string;
}

export interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
}

export interface HeroSectionProps {
  slides: CarouselSlide[];
}

export interface AboutSectionProps {
  logoUrl: string;
  mission: string;
  vision: string;
}

export interface FoodDrivesSectionProps {
  title: string;
  description: string;
  images: Array<{ url: string; alt: string }>;
  statistics?: Array<{ label: string; value: string }>;
}

export interface TeachingDrivesSectionProps {
  title: string;
  description: string;
  images: Array<{ url: string; alt: string }>;
  statistics?: Array<{ label: string; value: string }>;
}

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export interface JoinFormSectionProps {
  onSubmit: (data: VolunteerFormData) => Promise<void>;
}

export interface ConnectSectionProps {
  email: string;
  location: string;
  socialLinks: {
    instagram: string;
    linkedin: string;
    whatsapp: string;
    telegram: string;
  };
  onSuggestionSubmit: (data: SuggestionFormData) => Promise<void>;
}
