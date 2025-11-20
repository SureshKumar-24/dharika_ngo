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
        subtitle: properties.Subtitle?.rich_text?.[0]?.plain_text || undefined,
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
      id: 'hero-1',
      title: 'Every Child Deserves a Window to the World',
      subtitle: 'A single opportunity can shape a lifetime. Your support helps open that window.',
      mediaUrl: `${CLOUDINARY_BASE}/v1763573389/Dharika/gallery/tovc0dg3hxmwsutrmdc9.jpg`,
      mediaType: 'image',
      ctaText: 'Get Involved',
      ctaLink: '#join',
      order: 1,
    },
    {
      id: 'hero-2',
      title: 'A Shared Meal, A Shared Humanity',
      subtitle: 'Among all the acts of kindness, feeding the hungry stands highest.',
      mediaUrl: `${CLOUDINARY_BASE}/v1763573391/Dharika/gallery/lf4cjqhztn9svqnwjcwj.jpg`,
      mediaType: 'image',
      ctaText: 'Support Food Drives',
      ctaLink: '#food-drives',
      order: 2,
    },
    {
      id: 'hero-3',
      title: 'Let\'s Build a Brighter Future For Them, One Child At A Time',
      subtitle: 'Small Acts Together Create a Lifetime Of Impact',
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
      id: 'testimonial-1',
      quote: 'Building Dharika has been something very close to my heart. Every time we sit with the children, their eyes light up with curiosity. They welcome us with open hearts — the kind of warmth you never forget. Even if you visit a hundred times, their eagerness to learn feels brand new each day.',
      name: 'Siya Sethi',
      role: 'Founder',
      order: 1,
    },
    {
      id: 'testimonial-2',
      quote: 'When I ask the children what they want to learn next, they smile and say \'bas humein padhna hai\'. When translated, all it means is: they simply want someone to sit with them and teach them gently. Their honesty humbles me every single time.',
      name: 'Meera Khanna',
      role: 'Teaching Drive Coordinator',
      order: 2,
    },
    {
      id: 'testimonial-3',
      quote: 'One child told me, \'Bhaiya, kal phir se aana\'. Behind those words is trust — trust that we will keep showing up for them. That one sentence stays with you long after the drive is over.',
      name: 'Arjun Malhotra',
      role: 'Volunteer',
      order: 3,
    },
    {
      id: 'testimonial-4',
      quote: 'Meri beti school nahi jaa paati, par yahan likhna seekh rahi hai. There was pride in her voice — the quiet kind that comes from knowing her child finally has a chance she never had.',
      name: 'Parent',
      role: 'Community Member',
      order: 4,
    },
    {
      id: 'testimonial-5',
      quote: 'Main bhi uske saath baithu? Mujhe bhi rang karna hai. Sometimes the smallest wishes from the youngest ones remind us why creating safe learning spaces matters so deeply.',
      name: 'Akash',
      role: 'Younger Sibling',
      order: 5,
    },
    {
      id: 'testimonial-6',
      quote: 'Aap log aate ho toh basti mein shanti si lagti hai. Their words reflect how these small efforts ripple far beyond just the children — they bring dignity, hope, and togetherness to the entire neighbourhood.',
      name: 'Meera',
      role: 'Community Elder',
      order: 6,
    },
    {
      id: 'testimonial-7',
      quote: 'Didi, main bada hokar teacher banna chahti hoon. In that moment, her dream felt bigger than the space we were standing in — and that is exactly why these drives matter.',
      name: 'Monica',
      role: 'Child',
      order: 7,
    },
  ];
}
