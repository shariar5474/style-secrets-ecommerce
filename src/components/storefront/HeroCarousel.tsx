'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SLIDES = [
  {
    id: '1',
    label: 'NEW COLLECTION',
    title: 'Elegance\nIn Every You',
    description: 'Trendy Outfits for Every Occasion\nBecause Your Style is Our Secret',
    buttonText: 'SHOP NOW',
    buttonLink: '/categories/new-arrivals',
    bgGradient: 'from-pink-50 via-rose-50 to-amber-50',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    label: 'FESTIVE SEASON',
    title: 'Celebrate\nWith Grace',
    description: 'Exclusive festive collection\nDesigned to make you shine',
    buttonText: 'EXPLORE NOW',
    buttonLink: '/categories/saree',
    bgGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    label: 'SUMMER SALE',
    title: 'Up to 40%\nOFF',
    description: 'On selected summer styles\nLimited time offer',
    buttonText: 'SHOP SALE',
    buttonLink: '/categories/offers',
    bgGradient: 'from-amber-50 via-orange-50 to-rose-50',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`flex-[0_0_100%] min-w-0 bg-gradient-to-r ${slide.bgGradient}`}
            >
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center min-h-[300px] md:min-h-[450px] lg:min-h-[500px] py-8 md:py-0">
                  {/* Text content */}
                  <div className="flex-1 space-y-3 md:space-y-5 text-center md:text-left z-10 order-2 md:order-1">
                    <span className="inline-block text-brand-pink font-medium text-xs md:text-sm tracking-widest uppercase">
                      {slide.label}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-brand-charcoal leading-tight whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 whitespace-pre-line max-w-md">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center gap-2 btn-primary text-sm md:text-base"
                    >
                      {slide.buttonText}
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="flex-1 flex justify-center md:justify-end order-1 md:order-2 mb-4 md:mb-0">
                    <div className="relative w-64 h-64 md:w-80 md:h-96 lg:w-96 lg:h-[450px] rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={slide.image}
                        alt={slide.title.replace('\n', ' ')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-brand-charcoal" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-brand-charcoal" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === selectedIndex ? 'bg-brand-pink w-6' : 'bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
