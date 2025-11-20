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
import { getSectionImages } from '@/lib/db';

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

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

  // Fetch section images from database
  let foodDrivesImages: Array<{ url: string; alt: string }> = [
    { url: IMAGES.foodDrives.image1, alt: 'Food distribution event' },
    { url: IMAGES.foodDrives.image2, alt: 'Volunteers packing meals' },
    { url: IMAGES.foodDrives.image3, alt: 'Community meal service' },
    { url: IMAGES.foodDrives.image4, alt: 'Food donation collection' },
  ];

  let teachingDrivesImages: Array<{ url: string; alt: string }> = [
    { url: IMAGES.teachingDrives.image1, alt: 'Teaching session in progress' },
    { url: IMAGES.teachingDrives.image2, alt: 'Students learning new skills' },
    { url: IMAGES.teachingDrives.image3, alt: 'Volunteer teaching children' },
    { url: IMAGES.teachingDrives.image4, alt: 'Classroom activity' },
  ];

  try {
    const [foodImages, teachingImages] = await Promise.all([
      getSectionImages('food_drives'),
      getSectionImages('teaching_drives'),
    ]);

    if (foodImages.length > 0) {
      foodDrivesImages = foodImages.map((img) => ({
        url: img.image_url,
        alt: img.alt_text || 'Food drives image',
      }));
    }

    if (teachingImages.length > 0) {
      teachingDrivesImages = teachingImages.map((img) => ({
        url: img.image_url,
        alt: img.alt_text || 'Teaching drives image',
      }));
    }
  } catch (error) {
    console.error('Error fetching section images:', error);
    // Continue with fallback images
  }

  const aboutData = {
    logoUrl: SITE_CONFIG.logo,
    philosophy: {
      sanskrit: 'वसुधैव कुटुम्बकम्',
      translation: 'The world is one family.',
      description: 'This ancient ethos is the foundation on which Dharika stands. Dharika is a multi-vertical initiative built on the belief that creativity, culture, and compassion can coexist and strengthen each other. We operate where ideas meet impact — uniting fashion, technology, and social action under one purpose-driven umbrella.',
    },
    ecosystem: [
      {
        title: 'Indian Wear Label',
        description: 'A line dedicated to reviving Indian craftsmanship and cultural identity through modern, meaningful design.',
      },
      {
        title: 'Creative Tech Agency',
        description: 'A collective of designers, developers, and strategists building digital experiences — from branding and content to full-scale web solutions.',
      },
      {
        title: 'Youth-Led Social Wing',
        description: 'An initiative mobilizing young individuals to teach, volunteer, and contribute to education, community upliftment, and cultural awareness.',
      },
    ],
    mission: 'We believe that humanity thrives when creativity, compassion, and collaboration come together — no matter the field, background, or skill. At Dharika, we are united by one belief: every individual and every sector can collaborate for something bigger than themselves. A brand can contribute to social change. Innovation and impact can coexist — and thrive.',
    closing: 'We are here to create, build, and give back. To connect people across disciplines. To inspire a generation that believes in purpose as much as progress. Welcome to Dharika — where culture meets creativity, and creativity fuels change.',
  };

  const foodDrivesData = {
    title: 'Because No Child Should Sleep Hungry',
    description:
      'Millions in India struggle to secure even one proper meal a day — especially children. A simple plate of food restores energy, dignity, and the ability to learn, grow, and live like any other child their age.\n\nAt Dharika, our youth-led drives ensure fresh, nourishing meals reach the ones who need them most. And along with preparing food, we also redirect surplus meals from cafeterias, caterers, and local kitchens — because what becomes "waste" for one can be a lifeline for another.\n\nIf you\'re a café, restaurant, or kitchen owner willing to contribute your surplus, you can sign up to be connected directly with the children who need it most.',
    images: foodDrivesImages,
    statistics: [
      { label: 'Meals Distributed', value: '1K+' },
      { label: 'Cities Served', value: '10+' },
    ],
  };

  const teachingDrivesData = {
    title: 'Sanskriti, Shiksha, Samarthan',
    description:
      'Education is the one tool that can transform a child\'s entire future — yet thousands of young minds grow up without access to even the basics. A little guidance, a little attention, and a little consistency can change everything.\n\nOur youth-led Teaching Drives bring learning directly to children in underserved communities — from basic literacy to spoken English, from school subjects to life skills. Each session is designed to help them build confidence, curiosity, and the ability to dream beyond their circumstances.\n\nIf you\'re a student, graduate, or working professional with a passion for teaching, you can volunteer with us and become the mentor a child has been waiting for.',
    images: teachingDrivesImages,
    statistics: [
      { label: 'Students Taught', value: '100+' },
      { label: 'Skill Shops', value: '20+' },
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
          emails={CONTACT_INFO.emails}
          location={CONTACT_INFO.location}
          socialLinks={SOCIAL_LINKS}
        />
      </main>
    </>
  );
}
