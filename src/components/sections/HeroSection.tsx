import React from 'react';
import { Carousel } from '@/components/Carousel';
import type { CarouselSlide } from '@/types/notion';

export interface HeroSectionProps {
  slides: CarouselSlide[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  return (
    <section id="hero" className="relative w-full">
      <Carousel slides={slides} autoPlayInterval={5000} />
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
