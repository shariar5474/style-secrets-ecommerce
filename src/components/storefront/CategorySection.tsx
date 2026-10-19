'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: '1', name: 'Saree', name_bn: 'শাড়ি', slug: 'saree', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Salwar Kameez', name_bn: 'সালোয়ার কামিজ', slug: 'salwar-kameez', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Tops', name_bn: 'টপস', slug: 'tops', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Hijab', name_bn: 'হিজাব', slug: 'hijab', image: 'https://images.unsplash.com/photo-1590246814883-57c511c5e0f6?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Three Piece', name_bn: 'থ্রি পিস', slug: 'three-piece', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
  { id: '6', name: 'Western Wear', name_bn: 'ওয়েস্টার্ন', slug: 'western-wear', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80' },
  { id: '7', name: 'Night Wear', name_bn: 'নাইট ওয়্যার', slug: 'night-wear', image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=300&q=80' },
  { id: '8', name: 'Accessories', name_bn: 'অ্যাক্সেসরিজ', slug: 'accessories', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=300&q=80' },
];

export default function CategorySection() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
            Shop by Category
          </h2>
          <Link href="/categories/all" className="flex items-center gap-1 text-sm font-medium text-brand-pink hover:text-brand-dark-pink transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden ring-2 ring-brand-gold ring-offset-2 group-hover:ring-brand-pink transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm font-medium text-brand-charcoal group-hover:text-brand-pink transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] md:text-xs text-gray-400">{cat.name_bn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
