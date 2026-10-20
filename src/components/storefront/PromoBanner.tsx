'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PromoData {
  title: string;
  subtitle: string;
  discount_text: string;
  button_text: string;
  button_link: string;
}

const DEFAULT_PROMO: PromoData = {
  title: 'Special Offer',
  subtitle: 'On Selected Collections',
  discount_text: 'Flat 20% OFF',
  button_text: 'SHOP NOW',
  button_link: '/categories/all',
};

export default function PromoBanner() {
  const [promo, setPromo] = useState<PromoData>(DEFAULT_PROMO);

  useEffect(() => {
    async function loadPromo() {
      try {
        const res = await fetch('/api/banners?type=promo&active=true');
        const json = await res.json();
        if (json.success && Array.isArray(json.promo_banners) && json.promo_banners.length > 0) {
          const first = json.promo_banners[0];
          setPromo({
            title: first.title || DEFAULT_PROMO.title,
            subtitle: first.subtitle || DEFAULT_PROMO.subtitle,
            discount_text: first.discount_text || DEFAULT_PROMO.discount_text,
            button_text: first.button_text || DEFAULT_PROMO.button_text,
            button_link: first.button_link || DEFAULT_PROMO.button_link,
          });
        }
      } catch (err) {}
    }
    loadPromo();
  }, []);

  return (
    <section className="py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-dark-pink via-brand-pink to-rose-400 text-white shadow-md">
          <div className="relative px-6 py-10 md:px-12 md:py-14 text-center">
            <p className="text-lg md:text-xl font-display italic text-white/90">{promo.title}</p>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">
              {promo.discount_text}
            </h2>
            <p className="text-sm md:text-base text-white/80 mt-2">{promo.subtitle}</p>
            <Link
              href={promo.button_link}
              className="inline-flex items-center gap-2 mt-6 bg-white text-brand-pink px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold hover:text-white transition-colors text-sm shadow-sm"
            >
              {promo.button_text} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
