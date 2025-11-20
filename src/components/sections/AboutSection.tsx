'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';

export interface AboutSectionProps {
  logoUrl: string;
  philosophy: {
    sanskrit: string;
    translation: string;
    description: string;
  };
  ecosystem: Array<{
    title: string;
    description: string;
  }>;
  mission: string;
  closing: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  logoUrl,
  philosophy,
  ecosystem,
  mission,
  closing,
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
              About Us
            </h2>

            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-12 px-4"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-maroon mb-2">
                {philosophy.sanskrit}
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 italic mb-6">
                "{philosophy.translation}"
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {philosophy.description}
              </p>
            </motion.div>

            {/* Our Ecosystem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Our Ecosystem
              </h3>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {ecosystem.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <h4 className="text-xl font-semibold text-maroon mb-3">
                      {item.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                {mission}
              </p>
            </motion.div>

            {/* Closing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                {closing}
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

AboutSection.displayName = 'AboutSection';
