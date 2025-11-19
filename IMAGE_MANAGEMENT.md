# Image Management Guide

This guide explains how to manage and update images for the Dharika website using Cloudinary.

## Cloudinary Configuration

**Account**: `dsr89dej0`  
**Base URL**: `https://res.cloudinary.com/dsr89dej0/image/upload`

All images are stored in the `/Dharika/gallery/` folder on Cloudinary.

## How to Update Images

All image URLs are centralized in one file: **`src/lib/images.ts`**

### Step 1: Upload New Image to Cloudinary

1. Go to your Cloudinary dashboard
2. Upload the image to the `Dharika/gallery` folder
3. Copy the image URL (it will look like: `https://res.cloudinary.com/dsr89dej0/image/upload/v1234567890/Dharika/gallery/your-image.jpg`)

### Step 2: Update the Image URL

Open `src/lib/images.ts` and update the relevant image URL:

```typescript
export const IMAGES = {
  // Logo - Update this URL when you change the logo
  logo: `${CLOUDINARY_BASE_URL}/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png`,

  // Food Drives Images - Update these URLs
  foodDrives: {
    image1: `${CLOUDINARY_BASE_URL}/v1763573431/Dharika/gallery/food-drive-1.jpg`,
    image2: `${CLOUDINARY_BASE_URL}/v1763573431/Dharika/gallery/food-drive-2.jpg`,
    // ... etc
  },
  
  // Teaching Drives Images - Update these URLs
  teachingDrives: {
    image1: `${CLOUDINARY_BASE_URL}/v1763573431/Dharika/gallery/teaching-1.jpg`,
    // ... etc
  },
};
```

### Step 3: Rebuild and Deploy

After updating the URLs:

```bash
npm run build
```

Then deploy to your hosting platform (Vercel, etc.)

## Image Locations in the Website

| Image | Used In | File Location |
|-------|---------|---------------|
| Logo | Navigation, About Section, Metadata | `IMAGES.logo` |
| Food Drive Images | Food Drives Section | `IMAGES.foodDrives.*` |
| Teaching Images | Teaching Drives Section | `IMAGES.teachingDrives.*` |
| Carousel Images | Hero Section | `IMAGES.carousel.*` |
| OG Image | Social Media Sharing | `IMAGES.ogImage` |

## Image Optimization

The website automatically optimizes Cloudinary images using the `getOptimizedImageUrl()` helper function.

### Example Usage:

```typescript
import { getOptimizedImageUrl } from '@/lib/images';

// Get optimized image with specific width and quality
const optimizedUrl = getOptimizedImageUrl(IMAGES.logo, {
  width: 800,
  quality: 80,
  format: 'webp',
});
```

### Responsive Images:

```typescript
import { getResponsiveSrcSet } from '@/lib/images';

// Get responsive srcset for different screen sizes
const srcSet = getResponsiveSrcSet(IMAGES.logo);
```

## Image Requirements

### Logo
- **Format**: PNG with transparency
- **Recommended Size**: 500x500px minimum
- **Current URL**: `v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png`

### Food Drives Images
- **Format**: JPG or PNG
- **Recommended Size**: 800x800px minimum
- **Aspect Ratio**: Square (1:1)

### Teaching Drives Images
- **Format**: JPG or PNG
- **Recommended Size**: 800x800px minimum
- **Aspect Ratio**: Square (1:1)

### Carousel/Hero Images
- **Format**: JPG
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **File Size**: Keep under 500KB for performance

### Open Graph Image (Social Media)
- **Format**: JPG or PNG
- **Required Size**: 1200x630px
- **Aspect Ratio**: 1.91:1

## Quick Reference: Cloudinary URL Structure

```
https://res.cloudinary.com/dsr89dej0/image/upload/v[VERSION]/Dharika/gallery/[FILENAME]
```

- `dsr89dej0` - Your Cloudinary account name
- `v[VERSION]` - Version number (e.g., v1763573431)
- `Dharika/gallery` - Folder path
- `[FILENAME]` - Image filename

## Adding New Images

To add a completely new image category:

1. Upload images to Cloudinary in the `Dharika/gallery` folder
2. Add a new section in `src/lib/images.ts`:

```typescript
export const IMAGES = {
  // ... existing images ...
  
  // New category
  newCategory: {
    image1: `${CLOUDINARY_BASE_URL}/v1234567890/Dharika/gallery/new-image-1.jpg`,
    image2: `${CLOUDINARY_BASE_URL}/v1234567890/Dharika/gallery/new-image-2.jpg`,
  },
};
```

3. Use in your components:

```typescript
import { IMAGES } from '@/lib/images';

<Image src={IMAGES.newCategory.image1} alt="Description" />
```

## Troubleshooting

### Error: "hostname is not configured"

If you see this error, make sure `res.cloudinary.com` is added to `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/dsr89dej0/**',
    },
  ],
}
```

### Images Not Loading

1. Check the URL is correct in `src/lib/images.ts`
2. Verify the image exists in your Cloudinary account
3. Make sure the image is in the `Dharika/gallery` folder
4. Check browser console for specific error messages

## Best Practices

1. **Use descriptive filenames**: `food-drive-mumbai-2024.jpg` instead of `IMG_1234.jpg`
2. **Optimize before upload**: Compress images before uploading to Cloudinary
3. **Use WebP format**: For better performance (Cloudinary can auto-convert)
4. **Keep originals**: Always keep original high-res images as backup
5. **Version control**: Update version number in URL when replacing images
6. **Test locally**: Always test image changes locally before deploying

## Support

For Cloudinary-specific issues, refer to:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
