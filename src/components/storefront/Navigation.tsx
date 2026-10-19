'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, Grid3X3 } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/categories/new-arrivals' },
  { label: 'Collections', href: '/categories/collections' },
  { label: 'Saree', href: '/categories/saree' },
  { label: 'Salwar Kameez', href: '/categories/salwar-kameez' },
  { label: 'Tops', href: '/categories/tops' },
  { label: 'Hijab', href: '/categories/hijab' },
  { label: 'Western Wear', href: '/categories/western-wear' },
  { label: 'Offers', href: '/categories/offers', highlight: true },
];

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-border-subtle hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-0">
          {/* All Categories dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-brand-pink text-white px-5 py-3 text-sm font-semibold hover:bg-brand-dark-pink transition-colors">
              <Grid3X3 size={16} />
              All Categories
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg border border-border-subtle w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {['Saree', 'Salwar Kameez', 'Tops', 'Hijab', 'Three Piece', 'Western Wear', 'Night Wear', 'Accessories'].map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-2.5 text-sm text-brand-charcoal hover:bg-brand-soft-pink/30 hover:text-brand-pink transition-colors"
                >
                  {cat}
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
