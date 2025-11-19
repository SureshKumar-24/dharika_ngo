import { Navigation } from '@/components/Navigation';
import {
  HeroSection,
  AboutSection,
  FoodDrivesSection,
  TeachingDrivesSection,
  TestimonialsSection,
  JoinFormSection,
  ConnectSection,
} from '@/components/sections';
import {
  getCarouselSlides,
  getTestimonials,
  getMockCarouselSlides,
  getMockTestimonials,
  isNotionConfigured,
} from '@/lib/notion';
import { SOCIAL_LINKS, CONTACT_INFO, SITE_CONFIG } from '@/lib/constants';
import { IMAGES } from '@/lib/images';

export default async function Home() {
  // Fetch data from Notion or use mock data
  // ISR revalidation is handled via the revalidate API route
  let carouselSlides = getMockCarouselSlides();
  let testimonials = getMockTestimonials();

  if (isNotionConfigured()) {
    try {
      const [notionSlides, notionTestimonials] = await Promise.all([
        getCarouselSlides(),
        getTestimonials(),
      ]);

      // Use Notion data if available, otherwise fall back to mock data
      if (notionSlides.length > 0) carouselSlides = notionSlides;
      if (notionTestimonials.length > 0) testimonials = notionTestimonials;
    } catch (error) {
      console.error('Error fetching Notion data:', error);
      // Continue with mock data
    }
  }

  const aboutData = {
    logoUrl: SITE_CONFIG.logo,
    mission:
      'To empower communities across India by addressing hunger through food drives and fostering education through teaching initiatives, creating lasting positive change.',
    vision:
      'A society where every individual has access to nutritious food and quality education, enabling them to reach their full potential and contribute to their communities.',
  };

  const foodDrivesData = {
    title: 'Why Food Drives?',
    description:
      'Millions of people in India face food insecurity daily. Our food drives connect surplus food from restaurants, events, and donors with communities in need. We believe no one should go hungry when there is food available. Through our organized distribution network, we ensure fresh, nutritious meals reach those who need them most.',
    images: [
      { url: IMAGES.foodDrives.image1, alt: 'Food distribution event' },
      { url: IMAGES.foodDrives.image2, alt: 'Volunteers packing meals' },
      { url: IMAGES.foodDrives.image3, alt: 'Community meal service' },
      { url: IMAGES.foodDrives.image4, alt: 'Food donation collection' },
    ],
    statistics: [
      { label: 'Meals Distributed', value: '10K+' },
      { label: 'Communities Served', value: '50+' },
    ],
  };

  const teachingDrivesData = {
    title: 'Why Teaching Drives?',
    description:
      'Education is the foundation of empowerment. Our teaching drives bring skilled volunteers to underserved communities to teach valuable skills - from basic literacy to vocational training. We focus on practical knowledge that can immediately improve lives and create opportunities for economic independence.',
    images: [
      { url: IMAGES.teachingDrives.image1, alt: 'Teaching session in progress' },
      { url: IMAGES.teachingDrives.image2, alt: 'Students learning new skills' },
      { url: IMAGES.teachingDrives.image3, alt: 'Volunteer teaching children' },
      { url: IMAGES.teachingDrives.image4, alt: 'Classroom activity' },
    ],
    statistics: [
      { label: 'Students Taught', value: '5K+' },
      { label: 'Skills Workshops', value: '200+' },
    ],
  };

  return (
    <>
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Navigation />
      <main id="main-content" className="min-h-screen">
        <HeroSection slides={carouselSlides} />
        <AboutSection {...aboutData} />
        <FoodDrivesSection {...foodDrivesData} />
        <TeachingDrivesSection {...teachingDrivesData} />
        <TestimonialsSection testimonials={testimonials} />
        <JoinFormSection />
        <ConnectSection
          email={CONTACT_INFO.email}
          location={CONTACT_INFO.location}
          socialLinks={SOCIAL_LINKS}
        />
      </main>
    </>
  );
}
