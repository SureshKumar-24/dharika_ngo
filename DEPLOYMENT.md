# Deployment Checklist

Complete checklist for deploying the Dharika NGO website to production.

## Pre-Deployment

### Code Preparation

- [ ] All features implemented and tested
- [ ] No console errors or warnings
- [ ] TypeScript compilation successful
- [ ] All tests passing (if applicable)
- [ ] Code reviewed and approved
- [ ] Git repository clean (no uncommitted changes)

### Configuration

- [ ] Update domain in `src/app/layout.tsx` (metadataBase)
- [ ] Update domain in `src/app/sitemap.ts`
- [ ] Update domain in `src/app/robots.ts`
- [ ] Update contact information in `src/lib/constants.ts`
- [ ] Update social media links in `src/lib/constants.ts`
- [ ] Remove or update Google verification code in layout.tsx

### Environment Variables

- [ ] `NOTION_API_KEY` - Notion integration secret
- [ ] `NOTION_CAROUSEL_DB_ID` - Carousel database ID
- [ ] `NOTION_TESTIMONIALS_DB_ID` - Testimonials database ID
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- [ ] `GOOGLE_PRIVATE_KEY` - Service account private key (properly formatted)
- [ ] `GOOGLE_SHEET_ID_VOLUNTEER` - Volunteer submissions sheet ID
- [ ] `GOOGLE_SHEET_ID_SUGGESTION` - Suggestions sheet ID
- [ ] `REVALIDATE_SECRET` - Strong random secret for webhook

### Notion Setup

- [ ] Notion integration created
- [ ] Carousel database created with correct schema
- [ ] Testimonials database created with correct schema
- [ ] Databases shared with integration
- [ ] Test content added to databases
- [ ] Published checkbox working correctly

### Google Sheets Setup

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] Service account key downloaded
- [ ] Volunteer sheet created
- [ ] Suggestion sheet created
- [ ] Sheets shared with service account email
- [ ] Headers added to sheets (run initialization functions)

### Testing

- [ ] Local development server works (`npm run dev`)
- [ ] Production build successful (`npm run build`)
- [ ] Production server works (`npm start`)
- [ ] All pages load correctly
- [ ] Navigation works smoothly
- [ ] Carousel displays and auto-plays
- [ ] Forms validate correctly
- [ ] Form submissions work (test with real Google Sheets)
- [ ] Notion content displays correctly
- [ ] All images load properly
- [ ] No broken links

### Performance

- [ ] Lighthouse audit run (target: 90+ performance)
- [ ] Images optimized
- [ ] Fonts loading correctly
- [ ] No layout shift issues
- [ ] Page load time < 2 seconds
- [ ] Mobile performance tested

### Accessibility

- [ ] Lighthouse accessibility score 100
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] ARIA labels present
- [ ] Alt text on all images

### SEO

- [ ] Meta tags configured
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data (JSON-LD) added

## Deployment

### Vercel Deployment

- [ ] GitHub repository created and pushed
- [ ] Vercel account created/logged in
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Build settings configured (if needed)
- [ ] Deploy button clicked
- [ ] Build successful
- [ ] Deployment URL accessible

### Custom Domain (if applicable)

- [ ] Domain purchased
- [ ] Domain added in Vercel
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] HTTPS working
- [ ] WWW redirect configured (if needed)

### Webhook Configuration

- [ ] Revalidation webhook URL noted
- [ ] Webhook configured in Notion
- [ ] Webhook tested (update content, verify revalidation)

## Post-Deployment

### Verification

- [ ] Production site loads correctly
- [ ] All sections display properly
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Check Google Sheets for test submissions
- [ ] Notion content displays
- [ ] Update Notion content and verify revalidation
- [ ] Test on multiple devices
- [ ] Test on multiple browsers

### SEO Setup

- [ ] Google Search Console account created
- [ ] Site ownership verified
- [ ] Sitemap submitted
- [ ] Request indexing for main pages
- [ ] Google Analytics set up (optional)
- [ ] Bing Webmaster Tools (optional)

### Monitoring

- [ ] Vercel Analytics enabled
- [ ] Error tracking set up (Sentry, optional)
- [ ] Uptime monitoring configured (optional)
- [ ] Performance monitoring enabled

### Documentation

- [ ] Update README with production URL
- [ ] Document any deployment-specific configurations
- [ ] Create runbook for common issues
- [ ] Share credentials securely with team

### Communication

- [ ] Notify stakeholders of deployment
- [ ] Share production URL
- [ ] Provide admin access to Notion
- [ ] Provide access to Google Sheets
- [ ] Schedule training session (if needed)

## Post-Launch

### Week 1

- [ ] Monitor error logs daily
- [ ] Check form submissions
- [ ] Verify analytics data
- [ ] Test all functionality
- [ ] Gather initial user feedback
- [ ] Fix any critical issues

### Week 2-4

- [ ] Review performance metrics
- [ ] Analyze user behavior
- [ ] Check SEO rankings
- [ ] Monitor uptime
- [ ] Address user feedback
- [ ] Plan improvements

### Ongoing

- [ ] Regular content updates via Notion
- [ ] Monitor form submissions
- [ ] Review analytics monthly
- [ ] Update dependencies quarterly
- [ ] Backup data regularly
- [ ] Security updates as needed

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**
   - Vercel: Revert to previous deployment in dashboard
   - Other platforms: Redeploy previous version

2. **Identify Issue**
   - Check error logs
   - Review recent changes
   - Test locally

3. **Fix and Redeploy**
   - Fix issue in development
   - Test thoroughly
   - Deploy fix

## Emergency Contacts

- **Technical Lead**: [Name/Email]
- **Vercel Support**: support@vercel.com
- **Notion Support**: team@makenotion.com
- **Google Cloud Support**: [Support link]

## Notes

- Keep this checklist updated as deployment process evolves
- Document any issues encountered and solutions
- Share learnings with team
- Celebrate successful deployment! 🎉
