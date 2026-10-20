'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '@/lib/data/sampleData';
import ProductCard from '@/components/storefront/ProductCard';
import type { Product, Category } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [categoriesList, setCategoriesList] = useState<Category[]>(DEMO_CATEGORIES);
  const [productsList, setProductsList] = useState<Product[]>(DEMO_PRODUCTS);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?status=published'),
        ]);
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.categories)) {
          setCategoriesList(catJson.categories);
        }
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.products)) {
          setProductsList(prodJson.products);
        }
      } catch (err) {}
    }
    loadData();
  }, []);

  const currentCategory = useMemo(() => {
    if (!slug || slug === 'all') {
      return {
        id: 'all',
        name: 'All Collections',
        name_bn: 'সকল পোশাক',
        slug: 'all',
        description: 'Explore all exquisite ladies clothing items crafted for contemporary glamour.',
      };
    }
    return (
      categoriesList.find((c) => c.slug === slug) || {
        id: slug,
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        name_bn: '',
        slug,
        description: 'Exclusive ladies collection designed for elegance and festive charm.',
      }
    );
  }, [slug, categoriesList]);

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [priceFilter, setPriceFilter] = useState<number>(10000);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let list = [...productsList];
    if (slug && slug !== 'all') {
      const slugLower = slug.toLowerCase();
      const matched = list.filter((p) => {
        const catSlug = p.category?.slug?.toLowerCase() || '';
        const catName = p.category?.name?.toLowerCase() || '';
        const pCatId = p.category_id || '';
        return (
          catSlug === slugLower ||
          catName === slugLower ||
          catName.includes(slugLower) ||
          pCatId === slug
        );
      });
      if (matched.length > 0) {
        list = matched;
      }
    }

    list = list.filter((p) => (p.sale_price ?? p.regular_price) <= priceFilter);

    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    }

    return list;
  }, [slug, sortBy, priceFilter, productsList]);

  return (
    <div className="bg-brand-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/categories/all" className="hover:text-brand-pink transition-colors">Categories</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal font-medium">{currentCategory.name}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="bg-gradient-to-r from-brand-pink to-brand-dark-pink text-white rounded-2xl p-6 md:p-10 mb-8 relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-brand-soft-pink font-semibold">
              Category Showcase
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-1">
              {currentCategory.name}{' '}
              {currentCategory.name_bn && (
                <span className="text-xl md:text-2xl font-normal opacity-90">({currentCategory.name_bn})</span>
              )}
            </h1>
            <p className="text-xs md:text-sm text-white/80 mt-2 leading-relaxed">
              {currentCategory.description}
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border-subtle flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <SlidersHorizontal size={16} className="text-brand-pink" />
            <span>Showing <strong className="text-brand-charcoal">{filteredProducts.length}</strong> items</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Price slider */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-gray-500">Max Price:</span>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="w-28 accent-brand-pink"
              />
              <span className="font-semibold text-brand-pink">৳{priceFilter}</span>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown size={14} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-brand-charcoal focus:ring-1 focus:ring-brand-pink focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border-subtle">
            <p className="text-gray-500 text-sm">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setPriceFilter(10000);
                setSortBy('featured');
              }}
              className="btn-primary text-xs mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
