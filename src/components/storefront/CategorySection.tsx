'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Salwar Kameez', name_bn: 'সালোয়ার কামিজ', slug: 'salwar-kameez', image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Kurtis & Tunics', name_bn: 'কুর্তি ও টিউনিক', slug: 'kurtis-tunics', image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Sarees', name_bn: 'শাড়ি', slug: 'sarees', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Abayas & Hijabs', name_bn: 'হিজাব ও আবায়া', slug: 'abayas-hijabs', image_url: 'https://images.unsplash.com/photo-1590246814883-57c511c5e0f6?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Western Wear', name_bn: 'ওয়েস্টার্ন', slug: 'western-wear', image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80' },
  { id: '6', name: 'Three Piece', name_bn: 'থ্রি পিস', slug: 'three-piece', image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
  { id: '7', name: 'Night Wear', name_bn: 'নাইট ওয়্যার', slug: 'night-wear', image_url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=300&q=80' },
  { id: '8', name: 'Accessories', name_bn: 'অ্যাক্সেসরিজ', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=300&q=80' },
];

export default function CategorySection() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success && Array.isArray(json.categories) && json.categories.length > 0) {
          const mapped = json.categories
            .filter((c: any) => c.is_active !== false)
            .map((c: any) => ({
              id: c.id,
              name: c.name,
              name_bn: c.name_bn || '',
              slug: c.slug,
              image_url: c.image_url || DEFAULT_CATEGORIES[0].image_url,
            }));
          if (mapped.length > 0) {
            setCategories(mapped);
          }
        }
      } catch (err) {}
    }
    loadCategories();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Categories</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
              Shop by Category
            </h2>
          </div>
          <Link href="/categories/all" className="flex items-center gap-1 text-sm font-medium text-brand-pink hover:text-brand-dark-pink transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden ring-2 ring-brand-gold ring-offset-2 group-hover:ring-brand-pink transition-all duration-300">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm font-medium text-brand-charcoal group-hover:text-brand-pink transition-colors">
                  {cat.name}
                </p>
                {cat.name_bn && (
                  <p className="text-[10px] md:text-xs text-gray-400">{cat.name_bn}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
