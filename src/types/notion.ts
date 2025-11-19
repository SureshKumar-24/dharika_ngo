/**
 * TypeScript interfaces for Notion CMS data structures
 */

export interface NotionCarouselSlide {
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

export interface NotionTestimonial {
  id: string;
  properties: {
    Quote: { rich_text: Array<{ plain_text: string }> };
    Name: { title: Array<{ plain_text: string }> };
    Role: { rich_text: Array<{ plain_text: string }> };
    Order: { number: number };
    Published: { checkbox: boolean };
  };
}

export interface CarouselSlide {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  ctaText: string;
  ctaLink: string;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  order: number;
}
