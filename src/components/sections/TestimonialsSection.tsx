'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';
import type { Testimonial } from '@/types/notion';

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <>
      <GoldDivider className="my-0" />
      <Section id="stories" className="bg-pastel-yellow py-16 md:py-24">
        <Container>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-center">
              Stories & Testimonials
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Hear from our volunteers about their experiences making a difference
            </p>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-2xl p-8 shadow-sm relative"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gold rounded-full p-3 shadow-md">
                      <Quote className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Quote Text */}
                  <blockquote className="mt-6 mb-6">
                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                  </blockquote>

                  {/* Author Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <cite className="not-italic">
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {testimonial.role}
                      </div>
                    </cite>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

TestimonialsSection.displayName = 'TestimonialsSection';
