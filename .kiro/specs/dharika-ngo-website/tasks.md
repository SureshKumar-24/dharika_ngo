# Implementation Plan

- [ ] 1. Project setup and dependencies
  - Install required dependencies: framer-motion, zod, @notionhq/client, googleapis, embla-carousel-react, lucide-react, @radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge
  - Configure Tailwind CSS with custom colors (cream, gold, maroon, pastel variants)
  - Set up project directory structure (components, lib, types folders)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 2. Design system and core UI components
  - Create utility functions (cn helper for className merging)
  - Define TypeScript interfaces for all form data and component props
  - _Requirements: 13.5, 13.6_

- [ ] 2.1 Implement Button component with variants
  - Create Button component with primary, secondary, and maroon variants
  - Implement size variants (sm, md, lg) and states (loading, disabled)
  - Add proper accessibility attributes and keyboard support
  - _Requirements: 10.4, 10.5_

- [ ] 2.2 Implement form input components
  - Create Input component with validation state styling
  - Create Textarea component with validation support
  - Create Select component with accessible dropdown
  - Add proper labels, error messages, and ARIA attributes
  - _Requirements: 4.3, 4.4, 4.5, 10.2, 10.4, 10.5_

- [ ] 2.3 Create layout components
  - Implement GoldDivider decorative component
  - Create section wrapper components with proper semantic HTML
  - _Requirements: 7.6, 10.2_

- [ ] 3. Validation schemas with Zod
  - Create volunteer form validation schema with phone number regex for Indian numbers
  - Create suggestion form validation schema
  - Export validation functions for client and server use
  - _Requirements: 4.3, 4.4, 4.5, 13.1, 13.2, 13.3, 13.4_

- [ ] 4. Navigation component
  - Implement sticky navigation bar with transparent background and backdrop blur
  - Add smooth scroll functionality to section anchors
  - Implement active section highlighting using Intersection Observer API
  - Create mobile hamburger menu with slide-out drawer animation
  - Add keyboard navigation support
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.5, 10.6_

- [ ] 5. Carousel component with Embla
  - Set up Embla Carousel with auto-play functionality
  - Implement pause on hover behavior
  - Add navigation dots for manual slide selection
  - Support both image and video media types
  - Implement touch/swipe gestures for mobile
  - Add CTA overlay on each slide
  - Optimize images with Next.js Image component
  - Add keyboard navigation (arrow keys)
  - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 9.3, 9.4, 10.5_

- [ ] 6. Notion CMS integration
  - Set up Notion API client with @notionhq/client
  - Create TypeScript interfaces for Notion database schemas
  - Implement getCarouselSlides() function to fetch published slides ordered by Order field
  - Implement getTestimonials() function to fetch published testimonials
  - Add error handling for Notion API failures
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 12.5, 13.5_

- [ ] 7. Hero section with dynamic carousel
  - Create Hero section component with maroon background
  - Integrate Carousel component with Notion data
  - Fetch carousel slides using ISR with 3600s revalidation
  - Display CTA buttons with proper styling and accessibility
  - Ensure mobile-optimized layout and touch interactions
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.8, 7.1, 12.1_

- [ ] 8. About section
  - Create About section with light pastel background
  - Display logo, mission statement, and vision statement
  - Implement responsive two-column layout (desktop) / single column (mobile)
  - Add fade-in animation on scroll using Framer Motion
  - _Requirements: 7.1, 7.7, 10.2_

- [ ] 9. Food Drives and Teaching Drives sections
  - Create FoodDrives section with text and image grid
  - Create TeachingDrives section with similar layout
  - Implement responsive grid (2-column desktop / 1-column mobile)
  - Add scroll-triggered animations
  - Use different pastel backgrounds for each section
  - _Requirements: 6.2, 6.3, 6.4, 7.2, 7.3, 7.5, 7.7, 10.2, 10.3_

- [ ] 10. Stories and Testimonials section
  - Create Testimonials section component
  - Fetch testimonials from Notion with ISR
  - Display quotes with gold accent styling
  - Show volunteer names and roles
  - Implement typography-focused design
  - _Requirements: 3.4, 7.4, 7.5, 10.2_

- [ ] 11. Google Sheets integration setup
  - Set up Google Service Account and obtain credentials
  - Install googleapis package
  - Create Google Sheets helper functions (appendVolunteerData, appendSuggestionData)
  - Define column structure with timestamp, form fields, and source
  - Add error handling for Google Sheets API failures
  - _Requirements: 4.2, 4.10_

- [ ] 12. Volunteer form section
  - Create JoinForm section component with inline form
  - Implement all form fields (name, phone, email, city, interest, availability)
  - Add hidden honeypot field for spam protection
  - Implement client-side validation with Zod
  - Add real-time validation error display
  - Implement loading state during submission
  - Add success and error message display
  - Clear form fields on successful submission
  - Ensure mobile-friendly input sizing (44x44px touch targets minimum)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.1, 6.6, 10.2, 10.4, 10.5, 13.1, 13.4_

- [ ] 13. Volunteer form API route
  - Create /api/volunteer POST endpoint
  - Validate request data with Zod schema on server
  - Check honeypot field and reject spam submissions silently
  - Implement rate limiting to prevent excessive submissions
  - Append validated data to Google Sheets with timestamp
  - Return appropriate success/error responses
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.10, 5.1, 5.2, 5.3, 5.4, 13.2, 13.3_

- [ ] 14. Connect section with suggestion form
  - Create Connect section with maroon background
  - Display contact information (email, office location)
  - Add social media links (Instagram, LinkedIn) with icons
  - Create suggestion form with name, email, and message fields
  - Add hidden honeypot field
  - Implement client-side validation
  - Add WhatsApp and Telegram links in footer
  - Display copyright notice
  - _Requirements: 5.1, 7.1, 8.1, 8.2, 8.3, 8.4, 8.6, 8.7, 10.2, 10.3, 10.4_

- [ ] 15. Suggestion form API route
  - Create /api/suggestion POST endpoint
  - Validate request data with Zod schema
  - Check honeypot field for spam protection
  - Append data to Google Sheets
  - Return success/error response
  - _Requirements: 5.1, 5.2, 8.5, 13.2, 13.3_

- [ ] 16. Main page integration
  - Update page.tsx to render all sections in order
  - Implement proper section IDs for navigation anchors
  - Ensure smooth scrolling behavior
  - Add proper spacing between sections with gold dividers
  - _Requirements: 1.2, 7.6, 7.7_

- [ ] 17. SEO and metadata configuration
  - Update layout.tsx with comprehensive meta tags
  - Add Open Graph meta tags for social media sharing
  - Add Twitter Card meta tags
  - Create JSON-LD structured data for Organization schema
  - Add JSON-LD for social profile links
  - Ensure meta description is 150-160 characters
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.7, 11.8_

- [ ] 18. Generate sitemap and robots.txt
  - Create sitemap.xml file
  - Create robots.txt file
  - _Requirements: 11.5, 11.6_

- [ ] 19. ISR and revalidation webhook
  - Configure ISR with 3600 second revalidation period for all Notion data fetching
  - Create /api/revalidate POST endpoint
  - Verify webhook secret before triggering revalidation
  - Reject requests with invalid secret
  - Implement on-demand revalidation for specific paths
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 20. Accessibility enhancements
  - Add skip-to-content link at top of page
  - Ensure all images have descriptive alt text
  - Add ARIA labels to interactive elements without visible text
  - Implement visible focus indicators with gold outline
  - Verify semantic HTML usage throughout
  - Test keyboard navigation for all interactive elements
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.9_

- [ ] 21. Color contrast verification
  - Verify normal text has 4.5:1 contrast ratio minimum
  - Verify large text and UI components have 3:1 contrast ratio minimum
  - Test gold on white, white on maroon, and all text combinations
  - _Requirements: 10.7, 10.8_

- [ ] 22. Performance optimization
  - Optimize all images using Next.js Image component
  - Implement lazy loading for below-the-fold images
  - Configure font preloading to prevent layout shift
  - Minimize JavaScript bundle through code splitting
  - Test and achieve Lighthouse performance score of 90+
  - Verify page load time is under 2 seconds
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 23. Responsive design testing and refinement
  - Test and refine layouts for 320px-480px (mobile)
  - Test and refine layouts for 481px-768px (tablet)
  - Test and refine layouts for 769px+ (desktop)
  - Test and refine layouts for 1920px+ (large screens)
  - Verify single-column layouts on mobile
  - Verify multi-column layouts on desktop
  - Ensure all touch targets are minimum 44x44px
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 24. Environment variables and deployment preparation
  - Document all required environment variables
  - Create .env.example file with placeholder values
  - Update README with setup instructions
  - Prepare deployment configuration for Vercel
  - _Requirements: 12.2, 12.3, 12.4_

- [ ] 25. Final testing and QA
  - Test all navigation links and smooth scrolling
  - Test carousel auto-play, pause, and manual navigation
  - Test volunteer form validation and submission
  - Test suggestion form validation and submission
  - Verify Google Sheets data appears correctly
  - Test Notion content updates and revalidation
  - Cross-browser testing (Chrome, Safari, Firefox, Edge)
  - Test on actual mobile devices
  - Run Lighthouse audit and address any issues
  - _Requirements: All requirements validation_
