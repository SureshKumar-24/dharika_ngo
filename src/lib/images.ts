/**
 * Centralized image configuration using Cloudinary
 * Update URLs here when images change
 */

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dsr89dej0/image/upload';

export const IMAGES = {
  // Logo
  logo: `${CLOUDINARY_BASE_URL}/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png`,

  // Food Drives Images
  foodDrives: {
    image1: `${CLOUDINARY_BASE_URL}/v1763573392/Dharika/gallery/iuuzz6g2mrboothcou0z.jpg`,
    image2: `${CLOUDINARY_BASE_URL}/v1763573388/Dharika/gallery/xxm7p9tpc6hrje6phuze.jpg`,
    image3: `${CLOUDINARY_BASE_URL}/v1763573388/Dharika/gallery/lbedrmmfeoq9kdvjbhck.jpg`,
    image4: `${CLOUDINARY_BASE_URL}/v1763573389/Dharika/gallery/lbedrmmfeoq9kdvjbhck.jpg`,
  },

  // Teaching Drives Images
  teachingDrives: {
    image1: `${CLOUDINARY_BASE_URL}/v1763573389/Dharika/gallery/tovc0dg3hxmwsutrmdc9.jpg`,
    image2: `${CLOUDINARY_BASE_URL}/v1763573389/Dharika/gallery/xrjzcj4gkmpxzighnl9l.jpg`,
    image3: `${CLOUDINARY_BASE_URL}/v1763573389/Dharika/gallery/tovc0dg3hxmwsutrmdc9.jpg`,
    image4: `${CLOUDINARY_BASE_URL}/v1763573389/Dharika/gallery/xrjzcj4gkmpxzighnl9l.jpg`,
  },

  // Carousel/Hero Images
  carousel: {
    slide1: `${CLOUDINARY_BASE_URL}/v1763573391/Dharika/gallery/lf4cjqhztn9svqnwjcwj.jpg`, // Make a difference today
    slide2: `${CLOUDINARY_BASE_URL}/v1763573388/Dharika/gallery/xxm7p9tpc6hrje6phuze.jpg`, // Join our food deliveries
    slide3: `${CLOUDINARY_BASE_URL}/v1763573389/Dharika/gallery/tovc0dg3hxmwsutrmdc9.jpg`, // Empower through education
  },

  // Open Graph / Social Media
  ogImage: `${CLOUDINARY_BASE_URL}/v1763573431/Dharika/gallery/og-image.jpg`,
} as const;

/**
 * Helper function to get optimized Cloudinary URL with transformations
 * @param url - Base Cloudinary URL
 * @param options - Transformation options
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  if (!url.includes('cloudinary.com')) {
    return url; // Return as-is if not a Cloudinary URL
  }

  const { width, height, quality = 80, format = 'auto' } = options || {};

  // Build transformation string
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // Insert transformations into URL
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
  }

  return url;
}

/**
 * Get responsive image srcset for Cloudinary images
 */
export function getResponsiveSrcSet(url: string): string {
  if (!url.includes('cloudinary.com')) {
    return '';
  }

  const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
  return widths
    .map((width) => `${getOptimizedImageUrl(url, { width })} ${width}w`)
    .join(', ');
}
