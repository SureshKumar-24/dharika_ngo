'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';

export interface AboutSectionProps {
  logoUrl: string;
  mission: string;
  vision: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  logoUrl,
  mission,
  vision,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <>
      <GoldDivider className="my-0" />
      <Section id="about" className="bg-cream py-16 md:py-24">
        <Container>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src={logoUrl}
                alt="Dharika Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>

            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-12">
              About Dharika
            </h2>

            {/* Mission and Vision Grid */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-maroon mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {mission}
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-maroon mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {vision}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

AboutSection.displayName = 'AboutSection';
