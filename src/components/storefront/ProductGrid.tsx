'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

const TABS = ['All', 'Saree', 'Salwar Kameez', 'Tops', 'Hijab', 'Western Wear'];

// Demo products for development
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Premium Georgette Saree With Embroidery', slug: 'premium-georgette-saree',
    description: null, short_description: null, sku: 'SS-SAR-001',
    regular_price: 1990, sale_price: 1590, is_variable: true, is_featured: false, is_new: true,
    status: 'published', category_id: 'cat-1', featured_image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    meta_title: null, meta_description: null, avg_rating: 4.5, review_count: 120, total_stock: 50,
    created_at: '', updated_at: '',
    category: { id: 'cat-1', name: 'Saree', name_bn: 'শাড়ি', slug: 'saree', description: null, image_url: null, parent_id: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  },
  {
    id: 'p2', name: 'Elegant Three Piece Set', slug: 'elegant-three-piece-set',
    description: null, short_description: null, sku: 'SS-3PC-001',
    regular_price: 1590, sale_price: 1290, is_variable: true, is_featured: true, is_new: false,
    status: 'published', category_id: 'cat-5', featured_image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    meta_title: null, meta_description: null, avg_rating: 4.2, review_count: 85, total_stock: 35,
    created_at: '', updated_at: '',
    category: { id: 'cat-5', name: 'Three Piece', name_bn: 'থ্রি পিস', slug: 'three-piece', description: null, image_url: null, parent_id: null, sort_order: 5, is_active: true, created_at: '', updated_at: '' },
  },
  {
    id: 'p3', name: 'Stylish Cotton Kurti', slug: 'stylish-cotton-kurti',
    description: null, short_description: null, sku: 'SS-TOP-001',
    regular_price: 890, sale_price: null, is_variable: false, is_featured: true, is_new: false,
    status: 'published', category_id: 'cat-3', featured_image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    meta_title: null, meta_description: null, avg_rating: 4.0, review_count: 210, total_stock: 100,
    created_at: '', updated_at: '',
    category: { id: 'cat-3', name: 'Tops', name_bn: 'টপস', slug: 'tops', description: null, image_url: null, parent_id: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
  },
  {
    id: 'p4', name: 'Party Wear Gown', slug: 'party-wear-gown',
    description: null, short_description: null, sku: 'SS-WW-001',
    regular_price: 1990, sale_price: 1690, is_variable: true, is_featured: false, is_new: false,
    status: 'published', category_id: 'cat-6', featured_image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
    meta_title: null, meta_description: null, avg_rating: 4.3, review_count: 150, total_stock: 25,
    created_at: '', updated_at: '',
    category: { id: 'cat-6', name: 'Western Wear', name_bn: 'ওয়েস্টার্ন', slug: 'western-wear', description: null, image_url: null, parent_id: null, sort_order: 6, is_active: true, created_at: '', updated_at: '' },
  },
];

export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
            Latest Products
          </h2>
          <Link href="/categories/all" className="flex items-center gap-1 text-sm font-medium text-brand-pink hover:text-brand-dark-pink transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-brand-pink text-white'
                  : 'bg-white text-brand-charcoal border border-border-subtle hover:border-brand-pink hover:text-brand-pink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {DEMO_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
