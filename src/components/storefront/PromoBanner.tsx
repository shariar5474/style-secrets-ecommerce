import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-dark-pink via-brand-pink to-rose-400 text-white">
          <div className="relative px-6 py-10 md:px-12 md:py-14 text-center">
            <p className="text-lg md:text-xl font-display italic text-white/90">Special Offer</p>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Flat 20% <span className="text-brand-gold">OFF</span></h2>
            <p className="text-sm md:text-base text-white/80 mt-2">On Selected Collections</p>
            <Link href="/categories/offers" className="inline-flex items-center gap-2 mt-6 bg-white text-brand-pink px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold hover:text-white transition-colors text-sm">
              SHOP NOW <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}