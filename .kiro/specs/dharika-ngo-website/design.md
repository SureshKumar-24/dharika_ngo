# Design Document: Dharika NGO Website

## Overview

The Dharika NGO website is a single-page, mobile-first web application built with Next.js 16 App Router, TypeScript, and Tailwind CSS 4. The application serves as a digital presence for Dharika's social initiatives, specifically food drives and teaching drives, targeting youth aged 14-35 across India with a focus on Tier-1 cities.

### Key Design Principles

1. **Mobile-First**: All components and layouts are designed for mobile devices first, then progressively enhanced for larger screens
2. **Performance-Oriented**: Leveraging Next.js ISR, image optimization, and code splitting to achieve sub-2-second load times
3. **Content-Driven**: Notion CMS integration allows non-technical administrators to manage dynamic content
4. **Accessibility-First**: WCAG 2.1 AA compliance ensures the website is usable by all visitors
5. **Conversion-Focused**: Clear CTAs and streamlined volunteer form to maximize conversion rates

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **CMS**: Notion API (@notionhq/client)
- **Data Storage**: Google Sheets API (googleapis)
- **Validation**: Zod
- **Carousel**: Embla Carousel React
- **Icons**: Lucide React
- **UI Utilities**: Radix UI, class-variance-authority, clsx, tailwind-merge

## Architecture

### Application Structure

The application follows Next.js 16 App Router conventions with a single-page architecture where all sections are rendered on the home page (`/`). Navigation is handled through smooth scrolling to section anchors rather than route changes.

```
┌─────────────────────────────────────────┐
│         Browser (Client)                │
│  ┌───────────────────────────────────┐  │
│  │  Single Page Application          │  │
│  │  - Navigation (sticky)            │  │
│  │  - Hero Carousel                  │  │
│  │  - Content Sections               │  │
│  │  - Forms (Volunteer, Suggestion)  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  │ API Routes
                  ▼
┌─────────────────────────────────────────┐
│      Next.js Server (Edge/Node)         │
│  ┌───────────────────────────────────┐  │
│  │  /api/volunteer (POST)            │  │
│  │  /api/suggestion (POST)           │  │
│  │  /api/revalidate (POST)           │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Server Components                │  │
│  │  - Fetch Notion data (ISR)        │  │
│  │  - Render initial HTML            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │                    │
         │                    │
         ▼                    ▼
┌──────────────┐    ┌──────────────────┐
│  Notion API  │    │  Google Sheets   │
│  - Carousel  │    │  - Volunteers    │
│  - Blog      │    │  - Suggestions   │
│  - Stories   │    └──────────────────┘
└──────────────┘
```

### Data Flow

1. **Initial Page Load (SSG/ISR)**:
   - Server fetches data from Notion API during build or revalidation
   - Server renders HTML with fetched content
   - Client receives fully rendered page with hydration data
   - Client hydrates interactive components (carousel, forms, navigation)

2. **Form Submission Flow**:
   - User fills form → Client validates with Zod → POST to API route
   - API route validates again → Checks honeypot → Appends to Google Sheets
   - Returns success/error → Client displays message

3. **Content Update Flow**:
   - Admin updates Notion → Notion webhook triggers → POST to /api/revalidate
   - Revalidation endpoint verifies secret → Triggers ISR revalidation
   - Next request fetches fresh data from Notion

### Rendering Strategy

- **Static Generation with ISR**: All content sections are statically generated at build time and revalidated every 3600 seconds (1 hour)
- **Client-Side Interactivity**: Forms, carousel controls, and navigation use client-side JavaScript
- **API Routes**: Form submissions and webhook handling use serverless functions

## Components and Interfaces

### Core UI Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'maroon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Variants**:
- `primary`: Gold background (#D4AF37), white text
- `secondary`: Transparent background, gold border, gold text
- `maroon`: Maroon background (#800020), white text

**States**: Default, hover, active, disabled, loading

#### Input Component
```typescript
interface InputProps {
  type: 'text' | 'email' | 'tel' | 'url';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}
```

**Features**: Label, error message display, validation state styling, accessible ARIA attributes

#### Textarea Component
```typescript
interface TextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}
```

#### Select Component
```typescript
interface SelectProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}
```

#### GoldDivider Component
```typescript
interface GoldDividerProps {
  className?: string;
}
```

**Design**: Decorative horizontal line with gold color, used between sections

### Layout Components

#### Navigation Component
```typescript
interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}
```

**Features**:
- Sticky positioning at top of viewport
- Active section highlighting based on scroll position
- Smooth scroll to sections on click
- Mobile hamburger menu with slide-out drawer
- Transparent background with backdrop blur

**Implementation Notes**:
- Use Intersection Observer API to detect active section
- Use `scrollIntoView({ behavior: 'smooth' })` for smooth scrolling
- Mobile menu uses Framer Motion for slide animations

#### Carousel Component
```typescript
interface CarouselSlide {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  ctaText: string;
  ctaLink: string;
  order: number;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number; // milliseconds
}
```

**Features**:
- Full-width responsive display
- Auto-play with configurable interval (default: 5000ms)
- Pause on hover
- Manual navigation via dots
- Touch/swipe gestures on mobile
- CTA overlay on each slide
- Lazy loading for images
- Video autoplay (muted)

**Implementation Notes**:
- Use Embla Carousel React for core functionality
- Use Next.js Image component for optimized images
- Use native `<video>` element with autoplay, muted, loop attributes
- Implement keyboard navigation (arrow keys)

### Section Components

#### Hero Section
```typescript
interface HeroSectionProps {
  slides: CarouselSlide[];
}
```

**Design**: Full-width carousel with maroon background, white text overlay, prominent CTAs

#### About Section
```typescript
interface AboutSectionProps {
  logoUrl: string;
  mission: string;
  vision: string;
}
```

**Design**: Light pastel background, centered content, logo at top, mission and vision in two columns on desktop

#### FoodDrives Section
```typescript
interface FoodDrivesSectionProps {
  title: string;
  description: string;
  images: Array<{ url: string; alt: string }>;
  statistics?: Array<{ label: string; value: string }>;
}
```

**Design**: Two-column grid (desktop) / single column (mobile), text on left, images on right, pastel pink background

#### TeachingDrives Section
```typescript
interface TeachingDrivesSectionProps {
  title: string;
  description: string;
  images: Array<{ url: string; alt: string }>;
  statistics?: Array<{ label: string; value: string }>;
}
```

**Design**: Similar to FoodDrives but with pastel blue background, alternating text/image layout

#### Testimonials Section
```typescript
interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  order: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}
```

**Design**: Typography-focused, large quote marks in gold, volunteer name and role below quote, pastel yellow background

#### JoinForm Section
```typescript
interface VolunteerFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: 'food' | 'teaching' | 'both';
  availability: string;
  honeypot?: string; // hidden field
}

interface JoinFormSectionProps {
  onSubmit: (data: VolunteerFormData) => Promise<void>;
}
```

**Design**: Inline form (not modal), cream background, gold accents, clear field labels, radio buttons for interest selection

#### Connect Section
```typescript
interface ConnectSectionProps {
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

interface SuggestionFormData {
  name?: string;
  email?: string;
  message: string;
  honeypot?: string;
}
```

**Design**: Maroon background, white text, two-column layout (contact info + suggestion form), social icons in footer

## Data Models

### Notion Database Schemas

#### Carousel Database
```typescript
interface NotionCarouselSlide {
  id: string;
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    'Media URL': { url: string };
    'Media Type': { select: { name: 'image' | 'video' } };
    'CTA Text': { rich_text: Array<{ plain_text: string }> };
    'CTA Link': { url: string };
    Order: { number: number };
    Published: { checkbox: boolean };
  };
}
```

#### Blog Database
```typescript
interface NotionBlogPost {
  id: string;
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    Slug: { rich_text: Array<{ plain_text: string }> };
    Content: { rich_text: Array<{ plain_text: string }> };
    'Featured Image': { url: string };
    'Published Date': { date: { start: string } };
    Published: { checkbox: boolean };
  };
}
```

#### Testimonials Database
```typescript
interface NotionTestimonial {
  id: string;
  properties: {
    Quote: { rich_text: Array<{ plain_text: string }> };
    Name: { title: Array<{ plain_text: string }> };
    Role: { rich_text: Array<{ plain_text: string }> };
    Order: { number: number };
    Published: { checkbox: boolean };
  };
}
```

### Application Data Models

#### Carousel Slide Model
```typescript
interface CarouselSlide {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  ctaText: string;
  ctaLink: string;
  order: number;
}
```

#### Testimonial Model
```typescript
interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  order: number;
}
```

#### Volunteer Submission Model
```typescript
interface VolunteerSubmission {
  timestamp: string; // ISO 8601 format
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: 'food' | 'teaching' | 'both';
  availability: string;
  source: 'website';
}
```

#### Suggestion Submission Model
```typescript
interface SuggestionSubmission {
  timestamp: string;
  name?: string;
  email?: string;
  message: string;
  source: 'website';
}
```

### Validation Schemas (Zod)

#### Volunteer Form Schema
```typescript
const volunteerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(2, 'City is required').max(100),
  interest: z.enum(['food', 'teaching', 'both']),
  availability: z.string().min(10, 'Please provide availability details').max(500),
  honeypot: z.string().optional(),
});
```

#### Suggestion Form Schema
```typescript
const suggestionFormSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  honeypot: z.string().optional(),
});
```

## Correctness Properties