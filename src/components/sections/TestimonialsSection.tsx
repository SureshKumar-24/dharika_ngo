'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types/notion';

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Sort testimonials to always start with founder
  const sortedTestimonials = React.useMemo(() => {
    const sorted = [...testimonials];
    sorted.sort((a, b) => {
      // Founder always first
      if (a.role.toLowerCase().includes('founder')) return -1;
      if (b.role.toLowerCase().includes('founder')) return 1;
      // Otherwise maintain original order
      return a.order - b.order;
    });
    return sorted;
  }, [testimonials]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      skipSnaps: false,
      align: 'start',
      startIndex: 0,
    },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

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
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg">
              Voices from the heart of our community
            </p>

            {/* Testimonials Carousel */}
            <div className="relative max-w-6xl mx-auto">
              {/* Navigation Arrows */}
              {sortedTestimonials.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className={cn(
                      'absolute left-4 top-1/2 -translate-y-1/2 z-10',
                      'w-10 h-10 rounded-full bg-white shadow-lg',
                      'flex items-center justify-center',
                      'transition-all hover:bg-gold hover:text-white',
                      'focus:outline-none focus:ring-2 focus:ring-gold',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'hidden md:flex'
                    )}
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>

                  <button
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className={cn(
                      'absolute right-4 top-1/2 -translate-y-1/2 z-10',
                      'w-10 h-10 rounded-full bg-white shadow-lg',
                      'flex items-center justify-center',
                      'transition-all hover:bg-gold hover:text-white',
                      'focus:outline-none focus:ring-2 focus:ring-gold',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'hidden md:flex'
                    )}
                    aria-label="Next testimonials"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}

              <div className="px-4 md:px-16 pt-6 pb-2">
                <div ref={emblaRef} className="overflow-hidden">
                  <div className="flex">
                    {sortedTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                      >
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md relative flex flex-col min-h-[320px] mr-4 mt-4">
                          {/* Quote Icon */}
                          <div className="absolute -top-4 left-8">
                            <div className="bg-gold rounded-full p-3 shadow-md">
                              <Quote className="w-5 h-5 text-white" aria-hidden="true" />
                            </div>
                          </div>

                          {/* Quote Text */}
                          <blockquote className="mt-6 mb-6 grow">
                            <p className="text-gray-700 leading-relaxed text-base">
                              "{testimonial.quote}"
                            </p>
                          </blockquote>

                          {/* Author Info */}
                          <div className="border-t border-gray-200 pt-4">
                            <cite className="not-italic">
                              <div className="font-semibold text-foreground text-lg">
                                {testimonial.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {testimonial.role}
                              </div>
                            </cite>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
                {sortedTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                      selectedIndex === index
                        ? 'bg-gold w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-selected={selectedIndex === index}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

TestimonialsSection.displayName = 'TestimonialsSection';
