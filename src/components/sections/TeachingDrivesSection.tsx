'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';

export interface TeachingDrivesSectionProps {
  title: string;
  description: string;
  images: Array<{ url: string; alt: string }>;
  statistics?: Array<{ label: string; value: string }>;
}

export const TeachingDrivesSection: React.FC<TeachingDrivesSectionProps> = ({
  title,
  description,
  images,
  statistics,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <>
      <GoldDivider className="my-0" />
      <Section id="teaching" className="bg-pastel-blue py-16 md:py-24">
        <Container>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-center">
              {title}
            </h2>

            {/* Content Grid - Reversed order on desktop */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Images Grid - First on mobile, second on desktop */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-3 sm:gap-4 md:order-1"
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-md"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      quality={80}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </motion.div>

              {/* Text Content - Second on mobile, first on desktop */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6 md:order-2"
              >
                <div className="space-y-4">
                  {description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Statistics */}
                {statistics && statistics.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {statistics.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-sm"
                      >
                        <div className="text-3xl sm:text-4xl font-bold text-maroon mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

TeachingDrivesSection.displayName = 'TeachingDrivesSection';
