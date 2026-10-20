'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [tabs, setTabs] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load categories for tabs
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?status=published'),
        ]);

        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.categories)) {
          const catNames = catJson.categories.map((c: any) => c.name);
          setTabs(['All', ...catNames]);
        }

        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.products)) {
          setProducts(prodJson.products);
        }
      } catch (err) {
        console.error('Failed to load products grid:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'All') return true;
    const catName = p.category?.name || '';
    const catSlug = p.category?.slug || '';
    const activeLower = activeTab.toLowerCase();
    return (
      catName.toLowerCase() === activeLower ||
      catSlug.toLowerCase() === activeLower ||
      catName.toLowerCase().includes(activeLower)
    );
  });

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Curated Fashion</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
              Latest Products
            </h2>
          </div>
          <Link href="/categories/all" className="flex items-center gap-1 text-sm font-medium text-brand-pink hover:text-brand-dark-pink transition-colors">
            View All ({products.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'bg-white text-brand-charcoal border border-border-subtle hover:border-brand-pink hover:text-brand-pink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-border-subtle animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
