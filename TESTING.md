# Testing Guide

Comprehensive testing guide for the Dharika NGO website.

## Testing Overview

This document covers all testing procedures to ensure the website functions correctly across all devices, browsers, and scenarios.

## Test Environment Setup

### Local Testing

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Test Data

- Use mock data for initial testing
- Configure Notion with test content
- Set up test Google Sheets
- Use test email addresses for forms

## Functional Testing

### Navigation Testing

**Desktop Navigation**
- [ ] Logo click returns to top
- [ ] All navigation links work
- [ ] Smooth scroll to sections
- [ ] Active section highlights correctly
- [ ] Hover states display
- [ ] Keyboard navigation (Tab, Enter)
- [ ] Focus indicators visible

**Mobile Navigation**
- [ ] Hamburger menu opens/closes
- [ ] Menu slides in smoothly
- [ ] All links work in mobile menu
- [ ] Menu closes after link click
- [ ] Touch gestures work
- [ ] No horizontal scroll

### Carousel Testing

**Functionality**
- [ ] Carousel loads with first slide
- [ ] Auto-play advances slides (5s interval)
- [ ] Pause on hover works
- [ ] Navigation dots work
- [ ] Clicking dots changes slides
- [ ] Previous/Next buttons work
- [ ] Keyboard navigation (arrow keys)
- [ ] Touch/swipe gestures on mobile

**Content**
- [ ] Images load correctly
- [ ] Videos play (muted, autoplay)
- [ ] CTA buttons display
- [ ] CTA buttons link correctly
- [ ] Text overlay readable
- [ ] Responsive sizing

### Section Testing

**About Section**
- [ ] Logo displays correctly
- [ ] Mission text displays
- [ ] Vision text displays
- [ ] Responsive layout works
- [ ] Fade-in animation triggers
- [ ] Two-column layout on desktop
- [ ] Single column on mobile

**Food Drives Section**
- [ ] Title displays
- [ ] Description text readable
- [ ] Images load in grid
- [ ] Statistics display (if present)
- [ ] Responsive layout works
- [ ] Animations trigger on scroll
- [ ] Image hover effects work

**Teaching Drives Section**
- [ ] Title displays
- [ ] Description text readable
- [ ] Images load in grid
- [ ] Statistics display (if present)
- [ ] Layout reverses on desktop
- [ ] Animations trigger on scroll
- [ ] Image hover effects work

**Testimonials Section**
- [ ] All testimonials display
- [ ] Quote marks visible
- [ ] Names and roles show
- [ ] Grid layout responsive
- [ ] Staggered animations work
- [ ] Cards have proper spacing

### Form Testing

**Volunteer Form - Validation**
- [ ] Empty name shows error
- [ ] Short name (< 2 chars) shows error
- [ ] Empty phone shows error
- [ ] Invalid phone format shows error
- [ ] Non-Indian phone shows error
- [ ] Empty email shows error
- [ ] Invalid email format shows error
- [ ] Empty city shows error
- [ ] No interest selected shows error
- [ ] Empty availability shows error
- [ ] Short availability (< 10 chars) shows error

**Volunteer Form - Submission**
- [ ] Valid form submits successfully
- [ ] Loading state displays during submission
- [ ] Success message shows after submission
- [ ] Form clears after success
- [ ] Error message shows on failure
- [ ] Data appears in Google Sheets
- [ ] Timestamp is correct
- [ ] All fields saved correctly
- [ ] Honeypot field works (spam rejection)
- [ ] Rate limiting works (3 per hour)

**Suggestion Form - Validation**
- [ ] Empty message shows error
- [ ] Short message (< 10 chars) shows error
- [ ] Invalid email format shows error (if provided)
- [ ] Long message (> 1000 chars) shows error

**Suggestion Form - Submission**
- [ ] Valid form submits successfully
- [ ] Works with optional fields empty
- [ ] Works with optional fields filled
- [ ] Loading state displays
- [ ] Success message shows
- [ ] Form clears after success
- [ ] Error message shows on failure
- [ ] Data appears in Google Sheets
- [ ] Honeypot field works
- [ ] Rate limiting works (5 per hour)

### Notion Integration Testing

**Carousel Content**
- [ ] Published slides display
- [ ] Unpublished slides hidden
- [ ] Slides ordered correctly (by Order field)
- [ ] Images load from Notion URLs
- [ ] Videos load from Notion URLs
- [ ] CTA text displays correctly
- [ ] CTA links work

**Testimonials Content**
- [ ] Published testimonials display
- [ ] Unpublished testimonials hidden
- [ ] Testimonials ordered correctly
- [ ] Quotes display correctly
- [ ] Names display correctly
- [ ] Roles display correctly

**Revalidation**
- [ ] Update content in Notion
- [ ] Trigger revalidation webhook
- [ ] Content updates on site
- [ ] Cache invalidates correctly

### API Testing

**Volunteer API (`/api/volunteer`)**
- [ ] POST with valid data returns 200
- [ ] POST with invalid data returns 400
- [ ] POST with honeypot returns 200 (silent)
- [ ] Rate limit returns 429
- [ ] Missing fields return errors
- [ ] Invalid secret returns 401
- [ ] GET request returns 405

**Suggestion API (`/api/suggestion`)**
- [ ] POST with valid data returns 200
- [ ] POST with invalid data returns 400
- [ ] POST with honeypot returns 200 (silent)
- [ ] Rate limit returns 429
- [ ] GET request returns 405

**Revalidate API (`/api/revalidate`)**
- [ ] POST with valid secret returns 200
- [ ] POST with invalid secret returns 401
- [ ] GET with valid secret returns 200
- [ ] Revalidation actually occurs
- [ ] Specific paths can be revalidated

## Cross-Browser Testing

### Desktop Browsers

**Chrome (Latest)**
- [ ] All features work
- [ ] Animations smooth
- [ ] Forms submit correctly
- [ ] No console errors

**Firefox (Latest)**
- [ ] All features work
- [ ] Animations smooth
- [ ] Forms submit correctly
- [ ] No console errors

**Safari (Latest)**
- [ ] All features work
- [ ] Animations smooth
- [ ] Forms submit correctly
- [ ] No console errors
- [ ] Video autoplay works

**Edge (Latest)**
- [ ] All features work
- [ ] Animations smooth
- [ ] Forms submit correctly
- [ ] No console errors

### Mobile Browsers

**Safari iOS**
- [ ] Touch gestures work
- [ ] Forms usable
- [ ] Carousel swipe works
- [ ] No zoom issues
- [ ] Video playback works

**Chrome Android**
- [ ] Touch gestures work
- [ ] Forms usable
- [ ] Carousel swipe works
- [ ] No zoom issues
- [ ] Video playback works

**Samsung Internet**
- [ ] All features work
- [ ] Touch interactions smooth
- [ ] Forms submit correctly

## Device Testing

### Mobile Devices

**iPhone SE (375px)**
- [ ] Layout displays correctly
- [ ] Text readable without zoom
- [ ] Touch targets adequate
- [ ] Forms usable
- [ ] No horizontal scroll

**iPhone 12/13 (390px)**
- [ ] Layout displays correctly
- [ ] All features work
- [ ] Performance smooth

**iPhone 14 Pro Max (430px)**
- [ ] Layout displays correctly
- [ ] All features work
- [ ] Performance smooth

**Samsung Galaxy S21 (360px)**
- [ ] Layout displays correctly
- [ ] All features work
- [ ] Performance smooth

**Small Android (320px)**
- [ ] Layout displays correctly
- [ ] Text readable
- [ ] Touch targets adequate
- [ ] No content overflow

### Tablets

**iPad (810px × 1080px)**
- [ ] Layout adapts correctly
- [ ] Touch interactions work
- [ ] Forms comfortable to use
- [ ] Both orientations work

**iPad Pro (1024px × 1366px)**
- [ ] Desktop layout displays
- [ ] Touch interactions work
- [ ] Performance smooth

**Android Tablets**
- [ ] Layout adapts correctly
- [ ] All features work
- [ ] Performance smooth

### Desktop

**1024px × 768px**
- [ ] Layout displays correctly
- [ ] All features work
- [ ] Hover states work

**1366px × 768px**
- [ ] Layout displays correctly
- [ ] Content well-spaced
- [ ] Images high quality

**1920px × 1080px**
- [ ] Layout displays correctly
- [ ] Content centered
- [ ] No excessive whitespace

**2560px × 1440px**
- [ ] Layout displays correctly
- [ ] Images sharp
- [ ] Content readable

## Performance Testing

### Lighthouse Audit

Run Lighthouse in Chrome DevTools:

**Performance**
- [ ] Score: 90+ ✅
- [ ] FCP: < 1.8s
- [ ] LCP: < 2.5s
- [ ] TBT: < 300ms
- [ ] CLS: < 0.1

**Accessibility**
- [ ] Score: 100 ✅
- [ ] All checks pass

**Best Practices**
- [ ] Score: 100 ✅
- [ ] HTTPS used
- [ ] No console errors
- [ ] Images optimized

**SEO**
- [ ] Score: 100 ✅
- [ ] Meta tags present
- [ ] Crawlable content
- [ ] Mobile-friendly

### Load Testing

- [ ] Test with slow 3G connection
- [ ] Test with fast 3G connection
- [ ] Test with 4G connection
- [ ] Test with WiFi connection
- [ ] Verify page loads < 2s on standard connection

### Bundle Size

- [ ] Total JS < 300KB (gzipped)
- [ ] Total CSS < 50KB (gzipped)
- [ ] No unnecessary dependencies
- [ ] Code splitting working

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Arrow keys work in carousel
- [ ] Escape closes mobile menu
- [ ] Focus visible on all elements
- [ ] Skip-to-content link works
- [ ] No keyboard traps

### Screen Reader Testing

**NVDA (Windows)**
- [ ] All content announced
- [ ] Form labels read correctly
- [ ] Error messages announced
- [ ] Landmarks identified
- [ ] Images have alt text

**JAWS (Windows)**
- [ ] All content announced
- [ ] Navigation works
- [ ] Forms usable

**VoiceOver (Mac/iOS)**
- [ ] All content announced
- [ ] Touch gestures work
- [ ] Forms usable

### Color Contrast

- [ ] All text meets 4.5:1 ratio
- [ ] Large text meets 3:1 ratio
- [ ] UI components meet 3:1 ratio
- [ ] Focus indicators visible
- [ ] Error messages readable

### Visual Testing

- [ ] Test with 200% zoom
- [ ] Test with high contrast mode
- [ ] Test with color blindness simulators
- [ ] Test with dark mode (if applicable)

## Security Testing

### Form Security

- [ ] Honeypot field prevents spam
- [ ] Rate limiting works
- [ ] Input validation on server
- [ ] No SQL injection possible
- [ ] XSS prevention working
- [ ] CSRF protection (if needed)

### API Security

- [ ] Webhook secret required
- [ ] Invalid secrets rejected
- [ ] Rate limiting enforced
- [ ] No sensitive data exposed
- [ ] HTTPS enforced

## SEO Testing

### Meta Tags

- [ ] Title tag present and descriptive
- [ ] Meta description 150-160 characters
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URL set

### Structured Data

- [ ] JSON-LD present
- [ ] Organization schema valid
- [ ] Test with Google Rich Results Test
- [ ] No errors in structured data

### Crawlability

- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)
- [ ] No blocked resources
- [ ] All pages crawlable
- [ ] Internal links work

## Error Handling Testing

### Network Errors

- [ ] Notion API failure handled gracefully
- [ ] Google Sheets API failure handled
- [ ] Form submission failure shows error
- [ ] Retry mechanism works
- [ ] Fallback to mock data works

### User Errors

- [ ] Invalid form input shows clear errors
- [ ] 404 page displays (if applicable)
- [ ] Error boundaries catch React errors
- [ ] User-friendly error messages

## Regression Testing

After any code changes:

- [ ] Run full test suite
- [ ] Test affected features
- [ ] Test related features
- [ ] Verify no new bugs introduced
- [ ] Check performance not degraded

## Automated Testing

### Setup (Future)

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### Test Coverage

- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Visual regression tests

## Bug Reporting

When a bug is found:

1. **Document**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos
   - Browser/device info

2. **Prioritize**
   - Critical: Blocks core functionality
   - High: Major feature broken
   - Medium: Minor feature issue
   - Low: Cosmetic issue

3. **Fix and Verify**
   - Fix the bug
   - Test the fix
   - Verify no regression
   - Deploy fix

## Testing Sign-off

Before production deployment:

- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] Known issues documented
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Security verified
- [ ] Cross-browser tested
- [ ] Mobile tested
- [ ] Stakeholder approval

## Continuous Testing

- Run tests before each deployment
- Monitor production for errors
- Collect user feedback
- Regular accessibility audits
- Quarterly performance reviews
- Annual security audits

## Resources

- [Testing Library](https://testing-library.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [BrowserStack](https://www.browserstack.com/)
