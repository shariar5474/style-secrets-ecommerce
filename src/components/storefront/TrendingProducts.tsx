'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

const DEFAULT_TRENDING: Product[] = [
  { id: 't1', name: 'Printed Cotton Kurti', slug: 'printed-cotton-kurti', description: null, short_description: null, sku: 'SS-PCK-001', regular_price: 750, sale_price: null, is_variable: false, is_featured: false, is_new: true, status: 'published', category_id: 'cat-3', featured_image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80', meta_title: null, meta_description: null, avg_rating: 4.5, review_count: 10, total_stock: 60, created_at: '', updated_at: '' },
  { id: 't2', name: 'Chiffon Hijab', slug: 'chiffon-hijab', description: null, short_description: null, sku: 'SS-HIJ-001', regular_price: 450, sale_price: 350, is_variable: false, is_featured: false, is_new: false, status: 'published', category_id: 'cat-4', featured_image_url: 'https://images.unsplash.com/photo-1590246814883-57c511c5e0f6?auto=format&fit=crop&w=300&q=80', meta_title: null, meta_description: null, avg_rating: 4.7, review_count: 8, total_stock: 80, created_at: '', updated_at: '' },
  { id: 't3', name: 'Long Tops', slug: 'long-tops', description: null, short_description: null, sku: 'SS-LT-001', regular_price: 890, sale_price: null, is_variable: false, is_featured: false, is_new: true, status: 'published', category_id: 'cat-3', featured_image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80', meta_title: null, meta_description: null, avg_rating: 4.4, review_count: 12, total_stock: 45, created_at: '', updated_at: '' },
  { id: 't4', name: 'Anarkali Dress', slug: 'anarkali-dress', description: null, short_description: null, sku: 'SS-AN-001', regular_price: 1490, sale_price: null, is_variable: true, is_featured: false, is_new: false, status: 'published', category_id: 'cat-6', featured_image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80', meta_title: null, meta_description: null, avg_rating: 4.8, review_count: 15, total_stock: 20, created_at: '', updated_at: '' },
  { id: 't5', name: 'Co-ord Set', slug: 'co-ord-set', description: null, short_description: null, sku: 'SS-COS-001', regular_price: 1190, sale_price: null, is_variable: false, is_featured: false, is_new: false, status: 'published', category_id: 'cat-6', featured_image_url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=300&q=80', meta_title: null, meta_description: null, avg_rating: 4.6, review_count: 11, total_stock: 30, created_at: '', updated_at: '' },
  { id: 't6', name: 'Handbag', slug: 'handbag', description: null, short_description: null, sku: 'SS-HB-001', regular_price: 650, sale_price: null, is_variable: false, is_featured: false, is_new: false, status: 'published', category_id: 'cat-8', featured_image_url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=300&q=80', meta_title: null, meta_description: null, avg_rating: 4.3, review_count: 9, total_stock: 40, created_at: '', updated_at: '' },
];

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_TRENDING);

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch('/api/products?status=published');
        const json = await res.json();
        if (json.success && Array.isArray(json.products) && json.products.length > 0) {
          // Take top 6 products
          setProducts(json.products.slice(0, 6));
        }
      } catch (err) {}
    }
    loadTrending();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal mb-8">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
