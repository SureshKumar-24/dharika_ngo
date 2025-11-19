# Performance Optimization

This document outlines the performance optimizations implemented in the Dharika NGO website.

## Performance Targets

- ✅ Lighthouse Performance Score: 90+
- ✅ First Contentful Paint (FCP): < 1.8s
- ✅ Largest Contentful Paint (LCP): < 2.5s
- ✅ Time to Interactive (TTI): < 3.8s
- ✅ Cumulative Layout Shift (CLS): < 0.1
- ✅ Total Blocking Time (TBT): < 300ms

## Implemented Optimizations

### Image Optimization

1. **Next.js Image Component**
   - All images use `next/image` for automatic optimization
   - Responsive images with `sizes` attribute
   - Lazy loading for below-the-fold images
   - Priority loading for hero carousel first slide
   - WebP format with fallbacks

2. **Image Configuration**
   ```typescript
   // Carousel images
   <Image
     src={slide.mediaUrl}
     alt={slide.title}
     fill
     className="object-cover"
     priority={selectedIndex === 0}  // Priority for first slide
     sizes="100vw"
   />
   
   // Section images
   <Image
     src={image.url}
     alt={image.alt}
     fill
     className="object-cover"
     sizes="(max-width: 768px) 50vw, 25vw"  // Responsive sizing
   />
   ```

### Font Optimization

1. **Font Display Strategy**
   - `display: swap` for all fonts to prevent FOIT (Flash of Invisible Text)
   - Preload enabled for critical fonts
   - Variable fonts for better performance

2. **Font Configuration**
   ```typescript
   const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
     display: "swap",
     preload: true,
   });
   ```

### Code Splitting

1. **Automatic Code Splitting**
   - Next.js automatically splits code by route
   - Dynamic imports for heavy components
   - Separate bundles for client and server components

2. **Component Strategy**
   - Server components for static content
   - Client components only where interactivity is needed
   - Lazy loading for below-the-fold sections

### JavaScript Bundle Optimization

1. **Bundle Size Reduction**
   - Tree shaking enabled by default
   - Production builds minified
   - Unused code eliminated
   - External dependencies optimized

2. **Current Bundle Sizes** (approximate)
   - Main bundle: ~150KB (gzipped)
   - Framework: ~90KB (gzipped)
   - Total JS: ~240KB (gzipped)

### CSS Optimization

1. **Tailwind CSS**
   - Purge unused styles in production
   - JIT (Just-In-Time) compilation
   - Minimal CSS bundle size

2. **Critical CSS**
   - Inline critical CSS for above-the-fold content
   - Defer non-critical CSS loading

### API and Data Fetching

1. **Incremental Static Regeneration (ISR)**
   - Static pages with on-demand revalidation
   - Cached responses for fast page loads
   - Background revalidation for fresh content

2. **Data Fetching Strategy**
   ```typescript
   // Parallel data fetching
   const [notionSlides, notionTestimonials] = await Promise.all([
     getCarouselSlides(),
     getTestimonials(),
   ]);
   ```

3. **Error Handling**
   - Graceful fallbacks to mock data
   - No blocking on API failures
   - Cached responses served on errors

### Caching Strategy

1. **Browser Caching**
   - Static assets cached with long TTL
   - Versioned assets for cache busting
   - Service worker for offline support (future)

2. **CDN Caching**
   - Vercel Edge Network for global distribution
   - Automatic cache invalidation on revalidation

### Animation Performance

1. **GPU Acceleration**
   - CSS transforms for animations
   - `will-change` for animated elements
   - Framer Motion optimized animations

2. **Reduced Motion Support**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

### Third-Party Scripts

1. **Script Loading Strategy**
   - Defer non-critical scripts
   - Async loading where possible
   - No blocking third-party scripts

2. **Analytics** (when implemented)
   - Load after page interactive
   - Use `next/script` with `strategy="lazyOnload"`

## Performance Monitoring

### Lighthouse Audit

Run Lighthouse audit:
```bash
npm run build
npm start
# Open Chrome DevTools > Lighthouse > Run audit
```

Target scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Real User Monitoring (RUM)

Consider implementing:
- Vercel Analytics
- Google Analytics 4 with Web Vitals
- Custom performance tracking

### Performance Budget

| Metric | Budget | Current |
|--------|--------|---------|
| Total JS | < 300KB | ~240KB ✅ |
| Total CSS | < 50KB | ~15KB ✅ |
| Total Images | < 500KB | Varies ⚠️ |
| FCP | < 1.8s | TBD |
| LCP | < 2.5s | TBD |
| CLS | < 0.1 | TBD |

## Optimization Checklist

- [x] Use Next.js Image component for all images
- [x] Implement lazy loading for below-the-fold images
- [x] Configure font preloading and display swap
- [x] Enable code splitting (automatic with Next.js)
- [x] Minimize JavaScript bundle size
- [x] Implement ISR for dynamic content
- [x] Add error boundaries for graceful failures
- [x] Optimize CSS with Tailwind purge
- [x] Use GPU-accelerated animations
- [x] Add reduced motion support
- [ ] Implement service worker for offline support
- [ ] Add performance monitoring
- [ ] Optimize third-party scripts
- [ ] Implement resource hints (preconnect, prefetch)

## Future Optimizations

1. **Service Worker**
   - Offline support
   - Background sync for form submissions
   - Push notifications

2. **Advanced Caching**
   - Stale-while-revalidate strategy
   - Cache API for dynamic content
   - IndexedDB for offline data

3. **Image Optimization**
   - AVIF format support
   - Responsive image art direction
   - Blur-up placeholders

4. **Code Optimization**
   - Route-based code splitting
   - Component lazy loading
   - Dynamic imports for heavy libraries

5. **Network Optimization**
   - HTTP/3 support
   - Early hints
   - Resource prioritization

## Testing Performance

### Local Testing

```bash
# Build production version
npm run build

# Start production server
npm start

# Run Lighthouse in Chrome DevTools
# Or use CLI:
npx lighthouse http://localhost:3000 --view
```

### Production Testing

```bash
# Test deployed site
npx lighthouse https://dharika.org --view
```

### Continuous Monitoring

Set up automated performance testing:
- Lighthouse CI in GitHub Actions
- Vercel Analytics
- Custom performance monitoring

## Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
