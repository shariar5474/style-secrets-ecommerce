'use client';

import React, { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/data/sampleData';
import ProductCard from '@/components/storefront/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase().trim();
    return DEMO_PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchSku = p.sku.toLowerCase().includes(term);
      const matchCategory = p.category?.name.toLowerCase().includes(term);
      const matchDesc = p.description?.toLowerCase().includes(term);
      return matchName || matchSku || matchCategory || matchDesc;
    });
  }, [query]);

  return (
    <div className="bg-brand-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal font-medium">Search Results</span>
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
            Search Results for <span className="text-brand-pink">&ldquo;{query}&rdquo;</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Found {matchedProducts.length} matching products
          </p>
        </div>

        {matchedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border-subtle shadow-card max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-soft-pink/30 flex items-center justify-center mx-auto mb-4 text-brand-pink">
              <Search size={28} />
            </div>
            <h3 className="font-semibold text-brand-charcoal text-base">No products found</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              We couldn&apos;t find any item matching &ldquo;{query}&rdquo;. Try checking the spelling or searching for a broader term like &ldquo;saree&rdquo;, &ldquo;kurti&rdquo;, or &ldquo;three piece&rdquo;.
            </p>
            <Link href="/categories/all" className="inline-block btn-primary text-xs mt-6">
              Browse All Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {matchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="bg-brand-ivory min-h-screen py-12 flex items-center justify-center text-sm text-gray-500">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
