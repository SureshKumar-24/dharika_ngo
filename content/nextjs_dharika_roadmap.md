# DHARIKA — Complete Development Roadmap
**NGO Website | Next.js 16 + TypeScript + Notion CMS**

---

## 🎯 Project Vision
A single-page, mobile-first website for Dharika's social initiatives (food drives & teaching drives) that inspires youth (14-35) to volunteer. Built with speed, authenticity, and warmth.

**Primary CTA:** Join as a Volunteer  
**Design Theme:** Light pastel foundation with gold accents, maroon hero/footer  
**Target:** Pan-India youth, Tier-1 cities focus

---

## 📋 PHASE 1 — Foundation & Setup (Day 1-2)

### 1.1 Development Environment
- [x] Next.js 16 initialized with App Router
- [x] TypeScript configured
- [x] Tailwind CSS 4 setup
- [ ] Install additional dependencies:
  ```bash
  npm install framer-motion zod @notionhq/client
  npm install -D prettier eslint-config-prettier
  npm install embla-carousel-react lucide-react
  npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
  ```

### 1.2 Project Structure Setup
```
src/
├── app/
│   ├── layout.tsx (root layout with nav)
│   ├── page.tsx (single-page sections)
│   ├── api/
│   │   ├── volunteer/route.ts
│   │   ├── suggestion/route.ts
│   │   └── revalidate/route.ts (Notion webhook)
│   └── globals.css
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── FoodDrives.tsx
│   │   ├── TeachingDrives.tsx
│   │   ├── Testimonials.tsx
│   │   ├── JoinForm.tsx
│   │   └── Connect.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   └── GoldDivider.tsx
│   ├── Carousel.tsx
│   └── Navigation.tsx
├── lib/
│   ├── notion.ts (Notion API client)
│   ├── googleSheets.ts (form submission handler)
│   ├── validations.ts (Zod schemas)
│   ├── utils.ts (cn helper)
│   └── constants.ts (colors, social links)
└── types/
    ├── notion.ts
    └── forms.ts
```

### 1.3 Design System Configuration
- [ ] Configure Tailwind with custom colors:
  ```js
  colors: {
    cream: '#FFF8F0',
    gold: '#D4AF37',
    maroon: '#800020',
    pastel: {
      pink: '#FFE5E5',
      blue: '#E5F2FF',
      yellow: '#FFF9E5'
    }
  }
  ```
- [ ] Set up typography (serif for headings, sans for body)
- [ ] Configure responsive breakpoints (mobile-first)

---

## 🎨 PHASE 2 — Design System & UI Components (Day 3-4)

### 2.1 Core UI Components
- [ ] **Button Component**
  - Primary (gold background)
  - Secondary (outline)
  - Maroon variant for hero/footer
  - Loading states
  
- [ ] **Form Components**
  - Input with validation states
  - Textarea
  - Select dropdown
  - Checkbox/Radio
  - Error message display

- [ ] **Layout Components**
  - Section wrapper (with ID for scroll)
  - Container (max-width, padding)
  - Gold divider (decorative)
  - Spacing utilities

### 2.2 Navigation Component
- [ ] Sticky navigation bar
- [ ] Smooth scroll to sections
- [ ] Mobile hamburger menu
- [ ] Active section highlighting
- [ ] Links: About, Food Drives, Teaching, Stories, Join, Connect

### 2.3 Carousel Component
- [ ] Full-width responsive carousel
- [ ] Image + video support
- [ ] Auto-play with pause on hover
- [ ] Navigation dots
- [ ] CTA overlay on each slide
- [ ] Optimized with Next/Image

---

## 🏗️ PHASE 3 — Section Development (Day 5-9)

### 3.1 Hero Section (Maroon Background)
- [ ] Full-width carousel integration
- [ ] Dynamic content from Notion
- [ ] CTA buttons per slide:
  - Join as a volunteer
  - Donate surplus food
  - Teach a skill
  - Mission/Vision/Blog links
- [ ] Overlay text with high contrast
- [ ] Mobile-optimized touch gestures

### 3.2 About Dharika Section
- [ ] Light pastel background
- [ ] Gold accent dividers
- [ ] Logo integration (Dharika mandala logo)
- [ ] Mission statement
- [ ] Vision statement
- [ ] Warm, authentic copy
- [ ] Subtle fade-in animation

### 3.3 Why Food Drives Section
- [ ] Text + image grid layout
- [ ] Responsive 2-column (desktop) / 1-column (mobile)
- [ ] Impact statistics (if available)
- [ ] Supporting images with alt text
- [ ] Scroll-triggered animations (Framer Motion)

### 3.4 Why Teaching Drives Section
- [ ] Similar layout to Food Drives
- [ ] Different pastel background shade
- [ ] Text + image grid
- [ ] Impact stories
- [ ] Consistent spacing with other sections

### 3.5 Stories & Testimonials Section
- [ ] Text-only testimonials (no images)
- [ ] Typography-focused design
- [ ] Quote styling with gold accents
- [ ] Volunteer names + roles
- [ ] Carousel or grid layout
- [ ] Authentic, human tone

### 3.6 Join Us — Volunteer Form Section
- [ ] Inline form (not modal)
- [ ] Fields:
  - Name (required)
  - Phone (required, validation)
  - Email (required, validation)
  - City (required, dropdown or text)
  - Interest: Food/Teaching/Both (radio)
  - Availability (textarea)
- [ ] Real-time validation
- [ ] Loading state on submit
- [ ] Success/error messages
- [ ] Honeypot spam protection
- [ ] Mobile-friendly inputs

### 3.7 Connect + Footer Section (Maroon Background)
- [ ] Contact information:
  - Email address
  - Office location
- [ ] Social media links:
  - Instagram (icon + link)
  - LinkedIn (icon + link)
- [ ] Suggestion form:
  - Name (optional)
  - Email (optional)
  - Message (required)
- [ ] Footer links:
  - WhatsApp
  - Telegram
- [ ] Copyright notice
- [ ] Privacy policy link (if needed)

---

## ⚙️ PHASE 4 — Backend Integration (Day 10-12)

### 4.1 Notion CMS Setup
- [ ] Create Notion workspace for Dharika
- [ ] **Carousel Database:**
  - Title (text)
  - Media URL (url)
  - Media Type (select: image/video)
  - CTA Text (text)
  - CTA Link (url)
  - Order (number)
  - Published (checkbox)
  
- [ ] **Blog Database:**
  - Title (text)
  - Slug (text)
  - Content (rich text)
  - Featured Image (url)
  - Published Date (date)
  - Published (checkbox)

- [ ] **Testimonials Database:**
  - Quote (text)
  - Name (text)
  - Role (text)
  - Order (number)
  - Published (checkbox)

### 4.2 Notion API Integration
- [ ] Set up Notion integration & API key
- [ ] Create `lib/notion.ts` with helper functions:
  - `getCarouselSlides()`
  - `getBlogPosts()`
  - `getTestimonials()`
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Cache strategy (revalidate every 3600s)
- [ ] Error handling for API failures

### 4.3 Google Sheets Integration
- [ ] Create Google Sheets for:
  - Volunteer submissions
  - Suggestion submissions
- [ ] Set up Google Service Account
- [ ] Install `googleapis` package
- [ ] Create `lib/googleSheets.ts`:
  - `appendVolunteerData()`
  - `appendSuggestionData()`
- [ ] Column structure:
  - Timestamp
  - Name
  - Phone
  - Email
  - City
  - Interest
  - Availability
  - Source (website)

### 4.4 Form API Routes
- [ ] **`/api/volunteer` POST endpoint:**
  - Validate with Zod schema
  - Check honeypot field
  - Append to Google Sheets
  - Send email notification (optional)
  - Return success/error response
  
- [ ] **`/api/suggestion` POST endpoint:**
  - Validate input
  - Append to Google Sheets
  - Return success response

- [ ] **`/api/revalidate` POST endpoint:**
  - Verify webhook secret
  - Trigger on-demand revalidation
  - Return success response

### 4.5 Email Notifications (Optional)
- [ ] Set up email service (Resend/SendGrid)
- [ ] Email template for new volunteer
- [ ] Email template for new suggestion
- [ ] Send to Dharika team email

### 4.6 Spam Protection
- [ ] Implement honeypot field (hidden)
- [ ] Rate limiting on API routes
- [ ] Optional: Google reCAPTCHA v3

---

## 🚀 PHASE 5 — Deployment & Webhooks (Day 13)

### 5.1 Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables:
  - `NOTION_API_KEY`
  - `NOTION_CAROUSEL_DB_ID`
  - `NOTION_BLOG_DB_ID`
  - `NOTION_TESTIMONIALS_DB_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
  - `GOOGLE_SHEET_ID_VOLUNTEER`
  - `GOOGLE_SHEET_ID_SUGGESTION`
  - `REVALIDATE_SECRET`
  - `EMAIL_API_KEY` (if using)
- [ ] Set up custom domain (if available)
- [ ] Configure build settings
- [ ] Test production build

### 5.2 Notion Webhook Setup
- [ ] Create webhook in Notion
- [ ] Point to `/api/revalidate` endpoint
- [ ] Test auto-rebuild on content update
- [ ] Document webhook setup for team

### 5.3 Performance Optimization
- [ ] Enable Next.js image optimization
- [ ] Configure font preloading
- [ ] Minimize JavaScript bundle
- [ ] Lazy load below-fold images
- [ ] Test Core Web Vitals

---

## 🔍 PHASE 6 — SEO & Accessibility (Day 14)

### 6.1 SEO Implementation
- [ ] Meta tags in `layout.tsx`:
  - Title: "Dharika | Join Our Food & Teaching Drives"
  - Description (compelling, 150-160 chars)
  - Keywords
  - Open Graph image
  - Twitter card
- [ ] Generate `sitemap.xml`
- [ ] Create `robots.txt`
- [ ] Add structured data (JSON-LD):
  - Organization schema
  - Social profile links
- [ ] Optimize page load speed
- [ ] Mobile-friendly test

### 6.2 Accessibility (WCAG 2.1 AA)
- [ ] Semantic HTML throughout
- [ ] Alt text for all images
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Focus visible states (gold outline)
- [ ] Color contrast check (gold on white, white on maroon)
- [ ] Screen reader testing
- [ ] Skip to content link

### 6.3 Analytics Setup
- [ ] Google Analytics 4 (optional)
- [ ] Track form submissions
- [ ] Track CTA clicks
- [ ] Privacy-compliant implementation

---

## 🧪 PHASE 7 — Testing & QA (Day 15-16)

### 7.1 Functional Testing
- [ ] Test all navigation links (smooth scroll)
- [ ] Test carousel functionality (auto-play, manual nav)
- [ ] Test volunteer form:
  - All validation rules
  - Success submission
  - Error handling
  - Google Sheets data appears
- [ ] Test suggestion form
- [ ] Test Notion content updates
- [ ] Test webhook revalidation

### 7.2 Cross-Browser Testing
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Firefox
- [ ] Edge

### 7.3 Responsive Testing
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)
- [ ] Large screens (1920px+)

### 7.4 Performance Testing
- [ ] Lighthouse audit (aim for 90+ scores)
- [ ] PageSpeed Insights
- [ ] Test on slow 3G connection
- [ ] Check bundle size

### 7.5 Content QA
- [ ] Proofread all copy
- [ ] Check image quality
- [ ] Verify all links work
- [ ] Test with real content from Dharika team
- [ ] Final approval from stakeholders

---

## 📦 PHASE 8 — Delivery & Handover (Day 17)

### 8.1 Documentation
- [ ] Update README.md with:
  - Project overview
  - Setup instructions
  - Environment variables guide
  - Deployment guide
- [ ] Create Notion CMS guide:
  - How to add carousel slides
  - How to add blog posts
  - How to add testimonials
  - Best practices for images
- [ ] Create Google Sheets guide:
  - How to access submissions
  - How to export data
  - Privacy considerations
- [ ] Create maintenance guide:
  - How to update dependencies
  - How to trigger manual revalidation
  - Troubleshooting common issues

### 8.2 Training Session
- [ ] Walkthrough of Notion CMS
- [ ] Demonstrate form submissions
- [ ] Show Google Sheets integration
- [ ] Explain Vercel dashboard
- [ ] Q&A session

### 8.3 Final Delivery
- [ ] Source code handover (GitHub access)
- [ ] Vercel project transfer (if needed)
- [ ] Notion workspace access
- [ ] Google Sheets access
- [ ] All credentials documented securely
- [ ] Support period agreement (if applicable)

---

## 📊 Project Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Foundation | 2 days | Project setup, dependencies, structure |
| Phase 2: Design System | 2 days | UI components, navigation, carousel |
| Phase 3: Sections | 5 days | All 7 sections built and styled |
| Phase 4: Backend | 3 days | Notion + Google Sheets + APIs |
| Phase 5: Deployment | 1 day | Live on Vercel with webhooks |
| Phase 6: SEO/A11y | 1 day | Optimized and accessible |
| Phase 7: Testing | 2 days | QA across devices and browsers |
| Phase 8: Handover | 1 day | Documentation and training |

**Total: 17 days** (production-ready, fully tested)

---

## 🎯 Success Metrics

- **Performance:** Lighthouse score 90+ (all categories)
- **Mobile-first:** Perfect mobile experience
- **Speed:** Page load < 2 seconds
- **Conversion:** Clear CTA path to volunteer form
- **Accessibility:** WCAG 2.1 AA compliant
- **Maintainability:** Non-technical editors can update content via Notion

---

## 🔄 Post-Launch Roadmap (Future Phases)

### Phase 9: Blog Section (Optional)
- Individual blog post pages
- Blog listing page
- Categories/tags
- Social sharing

### Phase 10: Multi-language Support
- Hindi translation
- Language switcher
- i18n setup

### Phase 11: Advanced Features
- Volunteer dashboard
- Event calendar
- Photo gallery from drives
- Impact counter (animated stats)

---

## 📝 Notes for Development

- **Mobile-first:** Design and test mobile before desktop
- **Performance:** Keep animations minimal, optimize images aggressively
- **Authenticity:** Use real photos/videos when available, avoid stock imagery
- **Youth appeal:** Modern, clean design with warm human touch
- **Gold usage:** Subtle accents only, not overwhelming
- **Maroon usage:** Only hero and footer sections
- **No green:** Not part of brand identity
- **Smooth experience:** Prioritize smooth scrolling and transitions
- **Trust signals:** Testimonials, real stories, transparent mission

---

**Ready to build something beautiful for Dharika! 🌟**

