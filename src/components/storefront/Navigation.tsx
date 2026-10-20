'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Grid3X3 } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { name: 'Salwar Kameez', slug: 'salwar-kameez' },
  { name: 'Kurtis & Tunics', slug: 'kurtis-tunics' },
  { name: 'Sarees', slug: 'sarees' },
  { name: 'Abayas & Hijabs', slug: 'abayas-hijabs' },
  { name: 'Western Wear', slug: 'western-wear' },
  { name: 'Three Piece', slug: 'three-piece' },
  { name: 'Night Wear', slug: 'night-wear' },
  { name: 'Accessories', slug: 'accessories' },
];

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/categories/all' },
  { label: 'Salwar Kameez', href: '/categories/salwar-kameez' },
  { label: 'Sarees', href: '/categories/sarees' },
  { name: 'Kurtis', label: 'Kurtis', href: '/categories/kurtis-tunics' },
  { label: 'Abayas & Hijabs', href: '/categories/abayas-hijabs' },
  { label: 'Western Wear', href: '/categories/western-wear' },
  { label: 'Offers', href: '/categories/all', highlight: true },
];

export default function Navigation() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success && Array.isArray(json.categories) && json.categories.length > 0) {
          setCategories(
            json.categories
              .filter((c: any) => c.is_active !== false)
              .map((c: any) => ({ name: c.name, slug: c.slug }))
          );
        }
      } catch (err) {}
    }
    loadCats();
  }, []);

  return (
    <nav className="bg-white border-b border-border-subtle hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-0">
          {/* All Categories dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-brand-pink text-white px-5 py-3 text-sm font-semibold hover:bg-brand-dark-pink transition-colors cursor-pointer">
              <Grid3X3 size={16} />
              All Categories
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg border border-border-subtle w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="block px-4 py-2.5 text-sm text-brand-charcoal hover:bg-brand-soft-pink/30 hover:text-brand-pink transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav items */}
          <div className="flex items-center overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  item.highlight
                    ? 'text-brand-pink hover:text-brand-dark-pink font-semibold'
                    : 'text-brand-charcoal hover:text-brand-pink'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
