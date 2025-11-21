import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Dharika | Join Our Food & Teaching Drives",
  description:
    "Empowering communities through food drives and teaching initiatives. Join us in making a difference across India. Volunteer today!",
  keywords: [
    "NGO",
    "food drives",
    "teaching drives",
    "volunteer",
    "India",
    "social impact",
    "community service",
    "education",
    "hunger relief",
  ],
  authors: [{ name: "Dharika" }],
  creator: "Dharika",
  publisher: "Dharika",
  metadataBase: new URL(SITE_CONFIG.url),
  icons: {
    icon: [
      { url: '/icon.png', sizes: '500x500', type: 'image/png' },
      { url: '/dharika-logo.png', sizes: '500x500', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '500x500', type: 'image/png' },
    ],
    shortcut: ['/dharika-logo.png'],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_CONFIG.url,
    title: 'Dharika | Join Our Food & Teaching Drives',
    description:
      'Empowering communities through food drives and teaching initiatives. Join us in making a difference across India. Volunteer today!',
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: 'Dharika - Empowering Communities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dharika | Join Our Food & Teaching Drives',
    description:
      'Empowering communities through food drives and teaching initiatives. Join us in making a difference across India.',
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    description:
      'Empowering communities through food drives and teaching initiatives across India',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@dharika.org',
      contactType: 'General Inquiries',
    },
    sameAs: [
      'https://instagram.com/dharika',
      'https://linkedin.com/company/dharika',
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
