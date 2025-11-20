/**
 * Application constants for Dharika NGO website
 */

import { IMAGES } from './images';

export const COLORS = {
  cream: '#FFF8F0',
  gold: '#D4AF37',
  maroon: '#800020',
  pastel: {
    pink: '#FFE5E5',
    blue: '#E5F2FF',
    yellow: '#FFF9E5',
  },
} as const;

export const SITE_CONFIG = {
  name: 'Dharika',
  url: 'https://dharika.org',
  logo: IMAGES.logo,
  ogImage: IMAGES.ogImage,
} as const;

export const NAVIGATION_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'food-drives', label: 'Food Drives' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'stories', label: 'Stories' },
  { id: 'join', label: 'Join' },
  { id: 'connect', label: 'Connect' },
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/dharika.in',
  linkedin: 'https://www.linkedin.com/in/siya-sethi-a2439a301',
  whatsapp: 'https://wa.me/919876543210',
  telegram: 'https://t.me/dharika',
} as const;

export const CONTACT_INFO = {
  emails: ['Dharika.co@gmail.com', 'sethisiya6@gmail.com'],
  location: 'Ambal City, 134004, Haryana, India',
} as const;

export const CAROUSEL_CONFIG = {
  autoPlayInterval: 5000, // 5 seconds
} as const;

export const ISR_CONFIG = {
  revalidate: 3600, // 1 hour in seconds
} as const;
