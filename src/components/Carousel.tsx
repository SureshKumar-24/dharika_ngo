'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { CarouselSlide } from '@/types/notion';

export interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  slides, 
  autoPlayInterval = 5000 
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: autoPlayInterval, stopOnInteraction: false })]
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-[500px] bg-maroon flex items-center justify-center">
        <p className="text-white text-lg">No slides available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-maroon">
      {/* Carousel Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0"
            >
              {/* Media Container */}
              <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] bg-maroon">
                {slide.mediaType === 'image' ? (
                  <Image
                    src={slide.mediaUrl}
                    alt={slide.title}
                    fill
                    className="object-cover object-center"
                    priority={slide.order === 1}
                    loading={slide.order === 1 ? 'eager' : 'lazy'}
                    quality={85}
                    sizes="100vw"
                  />
                ) : (
                  <video
                    src={slide.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover object-center"
                    aria-label={slide.title}
                  />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 drop-shadow-md max-w-3xl mx-auto px-4">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaText && slide.ctaLink && (
                      <a href={slide.ctaLink}>
                        <Button variant="primary" size="lg">
                          {slide.ctaText}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-10',
              'w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm',
              'flex items-center justify-center',
              'transition-all hover:bg-white/30',
              'focus:outline-none focus:ring-2 focus:ring-gold',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 z-10',
              'w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm',
              'flex items-center justify-center',
              'transition-all hover:bg-white/30',
              'focus:outline-none focus:ring-2 focus:ring-gold',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex gap-2" role="tablist" aria-label="Carousel navigation">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                  selectedIndex === index
                    ? 'bg-gold w-8'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={selectedIndex === index}
                role="tab"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';
