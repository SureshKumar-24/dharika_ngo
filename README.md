# Dharika NGO Website

A modern, mobile-first website for Dharika's social initiatives - food drives and teaching drives across India.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **CMS**: Notion API
- **Data Storage**: Google Sheets API
- **Validation**: Zod
- **Carousel**: Embla Carousel React
- **Icons**: Lucide React

## Features

- ✅ Responsive, mobile-first design
- ✅ Dynamic carousel with Notion CMS integration
- ✅ Cloudinary image hosting with centralized configuration
- ✅ Smooth scroll navigation with active section highlighting
- ✅ Volunteer and suggestion forms with validation
- ✅ Google Sheets integration for form submissions
- ✅ Spam protection with honeypot fields and rate limiting
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ SEO optimized
- ✅ Incremental Static Regeneration (ISR)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Notion account (for CMS)
- Google Cloud account (for Sheets API)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dharika
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- Notion API key and database IDs
- Google Service Account credentials
- Revalidation secret

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── volunteer/     # Volunteer form submission
│   │   └── suggestion/    # Suggestion form submission
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── sections/          # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FoodDrivesSection.tsx
│   │   ├── TeachingDrivesSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── JoinFormSection.tsx
│   │   └── ConnectSection.tsx
│   ├── ui/                # Reusable UI components
│   ├── Navigation.tsx     # Sticky navigation
│   └── Carousel.tsx       # Hero carousel
├── lib/
│   ├── notion.ts          # Notion API client
│   ├── googleSheets.ts    # Google Sheets API
│   ├── validations.ts     # Zod schemas
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # App constants
└── types/                 # TypeScript types
```

## ISR and Revalidation

The website uses on-demand revalidation via webhook. When content is updated in Notion, trigger revalidation by calling:

```bash
POST https://your-domain.com/api/revalidate?secret=YOUR_SECRET
```

Optional body to revalidate specific paths:
```json
{
  "paths": ["/", "/#about"]
}
```

## Configuration

### Image Management

All images are hosted on Cloudinary and centrally managed in `src/lib/images.ts`. 

To update images:
1. Upload new images to Cloudinary (`Dharika/gallery` folder)
2. Update URLs in `src/lib/images.ts`
3. Rebuild and deploy

See [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) for detailed instructions.

### Notion CMS Setup

1. Create a Notion integration at https://www.notion.so/my-integrations
2. Create databases for:
   - Carousel slides (Title, Media URL, Media Type, CTA Text, CTA Link, Order, Published)
   - Testimonials (Quote, Name, Role, Order, Published)
3. Share databases with your integration
4. Add database IDs to `.env.local`

### Google Sheets Setup

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a service account and download credentials
4. Create two Google Sheets (Volunteers, Suggestions)
5. Share sheets with service account email
6. Add credentials to `.env.local`

## Environment Variables

See `.env.example` for all required environment variables:

- `NOTION_API_KEY` - Notion integration secret
- `NOTION_CAROUSEL_DB_ID` - Carousel database ID
- `NOTION_TESTIMONIALS_DB_ID` - Testimonials database ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Service account private key
- `GOOGLE_SHEET_ID_VOLUNTEER` - Volunteer sheet ID
- `GOOGLE_SHEET_ID_SUGGESTION` - Suggestion sheet ID
- `REVALIDATE_SECRET` - Secret for webhook revalidation

## Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Notion databases set up and shared
- [ ] Google Sheets created and shared with service account
- [ ] Test forms locally
- [ ] Run production build locally (`npm run build`)
- [ ] Test production build (`npm start`)
- [ ] Run Lighthouse audit
- [ ] Update domain in metadata (layout.tsx, sitemap.ts, robots.ts)
- [ ] Set up Google Search Console verification

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**
   Add all variables from `.env.example`:
   - `NOTION_API_KEY`
   - `NOTION_CAROUSEL_DB_ID`
   - `NOTION_TESTIMONIALS_DB_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID_VOLUNTEER`
   - `GOOGLE_SHEET_ID_SUGGESTION`
   - `REVALIDATE_SECRET`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployed site

5. **Set Up Custom Domain** (Optional)
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update domain in code (layout.tsx, sitemap.ts, robots.ts)

6. **Configure Notion Webhook**
   - In Notion, set up webhook to trigger on content updates
   - Point to: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - Test webhook by updating content

### Netlify

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   - Add all variables from `.env.example` in Netlify dashboard

3. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Deploy

### AWS Amplify

1. **Connect Repository**
   - Connect GitHub repository
   - Select branch

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add all variables in Amplify console

### Self-Hosted with Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t dharika-website .
   docker run -p 3000:3000 --env-file .env.local dharika-website
   ```

### Post-Deployment

1. **Verify Deployment**
   - Test all pages and sections
   - Test form submissions
   - Verify Google Sheets integration
   - Test Notion content updates
   - Check revalidation webhook

2. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Configure uptime monitoring

3. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Verify site ownership
   - Request indexing
   - Set up Google Analytics (optional)

4. **Performance Testing**
   - Run Lighthouse audit on production
   - Test on real devices
   - Monitor Core Web Vitals

### Troubleshooting

**Build Fails**
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors
- Review build logs

**Environment Variables Not Working**
- Verify variable names match exactly
- Check for typos in values
- Ensure no trailing spaces
- Restart deployment after changes

**Forms Not Submitting**
- Verify Google Sheets credentials
- Check API route logs
- Test rate limiting
- Verify honeypot field

**Notion Content Not Updating**
- Check Notion API key
- Verify database IDs
- Test revalidation webhook
- Check database permissions

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- Heroku (with buildpack)

## License

© 2024 Dharika. All rights reserved.

## Contact

- Email: hello@dharika.org
- Location: Mumbai, India
- Instagram: [@dharika](https://instagram.com/dharika)
- LinkedIn: [Dharika](https://linkedin.com/company/dharika)
