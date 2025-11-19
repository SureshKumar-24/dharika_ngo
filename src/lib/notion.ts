import { Client } from '@notionhq/client';
import type {
  NotionCarouselSlide,
  NotionTestimonial,
  CarouselSlide,
  Testimonial,
} from '@/types/notion';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database IDs from environment variables
const CAROUSEL_DB_ID = process.env.NOTION_CAROUSEL_DB_ID || '';
const TESTIMONIALS_DB_ID = process.env.NOTION_TESTIMONIALS_DB_ID || '';

/**
 * Fetch carousel slides from Notion database
 * Returns only published slides, ordered by the Order field
 */
export async function getCarouselSlides(): Promise<CarouselSlide[]> {
  try {
    if (!CAROUSEL_DB_ID) {
      console.warn('NOTION_CAROUSEL_DB_ID not configured');
      return [];
    }

    const response: any = await (notion as any).databases.query({
      database_id: CAROUSEL_DB_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    const slides: CarouselSlide[] = response.results.map((page: any) => {
      const properties = page.properties as NotionCarouselSlide['properties'];

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || '',
        mediaUrl: properties['Media URL']?.url || '',
        mediaType: properties['Media Type']?.select?.name || 'image',
        ctaText: properties['CTA Text']?.rich_text?.[0]?.plain_text || '',
        ctaLink: properties['CTA Link']?.url || '',
        order: properties.Order?.number || 0,
      };
    });

    return slides;
  } catch (error) {
    console.error('Error fetching carousel slides from Notion:', error);
    // Return empty array on error to gracefully handle failures
    return [];
  }
}

/**
 * Fetch testimonials from Notion database
 * Returns only published testimonials, ordered by the Order field
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    if (!TESTIMONIALS_DB_ID) {
      console.warn('NOTION_TESTIMONIALS_DB_ID not configured');
      return [];
    }

    const response: any = await (notion as any).databases.query({
      database_id: TESTIMONIALS_DB_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    const testimonials: Testimonial[] = response.results.map((page: any) => {
      const properties = page.properties as NotionTestimonial['properties'];

      return {
        id: page.id,
        quote: properties.Quote?.rich_text?.[0]?.plain_text || '',
        name: properties.Name?.title?.[0]?.plain_text || '',
        role: properties.Role?.rich_text?.[0]?.plain_text || '',
        order: properties.Order?.number || 0,
      };
    });

    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials from Notion:', error);
    // Return empty array on error to gracefully handle failures
    return [];
  }
}

/**
 * Helper function to check if Notion is properly configured
 */
export function isNotionConfigured(): boolean {
  return !!(
    process.env.NOTION_API_KEY &&
    (process.env.NOTION_CAROUSEL_DB_ID || process.env.NOTION_TESTIMONIALS_DB_ID)
  );
}

/**
 * Get mock carousel slides for development/testing
 */
export function getMockCarouselSlides(): CarouselSlide[] {
  // Import IMAGES dynamically to avoid circular dependency
  const CLOUDINARY_BASE = 'https://res.cloudinary.com/dsr89dej0/image/upload';
  
  return [
    {
      id: 'mock-1',
      title: 'Empower Through Education',
      mediaUrl: `${CLOUDINARY_BASE}/v1763573389/Dharika/gallery/tovc0dg3hxmwsutrmdc9.jpg`,
      mediaType: 'image',
      ctaText: 'Teach a Skill',
      ctaLink: '#join',
      order: 1,
    },
    {
      id: 'mock-2',
      title: 'Make a Difference Today',
      mediaUrl: `${CLOUDINARY_BASE}/v1763573391/Dharika/gallery/lf4cjqhztn9svqnwjcwj.jpg`,
      mediaType: 'image',
      ctaText: 'Get Involved',
      ctaLink: '#join',
      order: 2,
    },
    {
      id: 'mock-3',
      title: 'Join Our Food Deliveries',
      mediaUrl: `${CLOUDINARY_BASE}/v1763573388/Dharika/gallery/xxm7p9tpc6hrje6phuze.jpg`,
      mediaType: 'image',
      ctaText: 'Volunteer Now',
      ctaLink: '#join',
      order: 3,
    },

  ];
}

/**
 * Get mock testimonials for development/testing
 */
export function getMockTestimonials(): Testimonial[] {
  return [
    {
      id: 'mock-1',
      quote: 'Volunteering with Dharika has been an incredibly rewarding experience. Seeing the smiles on children\'s faces makes every moment worthwhile.',
      name: 'Priya Sharma',
      role: 'Teaching Volunteer',
      order: 1,
    },
    {
      id: 'mock-2',
      quote: 'The food drive initiative is making a real impact in our community. I\'m proud to be part of this movement.',
      name: 'Rahul Verma',
      role: 'Food Drive Coordinator',
      order: 2,
    },
    {
      id: 'mock-3',
      quote: 'Dharika gave me the opportunity to give back to society in a meaningful way. The organization is well-structured and truly cares about making a difference.',
      name: 'Ananya Patel',
      role: 'Volunteer',
      order: 3,
    },
  ];
}
