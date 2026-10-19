'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/data/sampleData';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(() => DEMO_PRODUCTS.slice(0, 4));
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMoveToCart = (product: any) => {
    addItem(product.id, null, 1, product);
    handleRemove(product.id);
    openCart();
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/account" className="hover:text-brand-pink transition-colors">My Account</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal font-medium">My Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
              My Wishlist ({wishlist.length})
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Items you have saved to purchase later or keep track of discounts.
            </p>
          </div>
          <Link href="/account" className="flex items-center gap-1 text-xs text-brand-pink font-semibold hover:underline">
            <ArrowLeft size={14} /> Back to Account
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border-subtle shadow-card max-w-md mx-auto">
            <Heart size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-brand-charcoal">Your Wishlist is Empty</h3>
            <p className="text-xs text-gray-500 mt-1">Explore our latest styles and tap the heart icon on any product.</p>
            <Link href="/" className="btn-primary text-xs mt-6 inline-block">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {wishlist.map((p) => (
              <div key={p.id} className="card group relative overflow-hidden flex flex-col justify-between">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={p.featured_image_url || 'https://via.placeholder.com/300x400'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-sm"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{p.category?.name || 'Ladies Wear'}</span>
                    <h3 className="text-xs font-semibold text-brand-charcoal line-clamp-2 mt-0.5">{p.name}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="price-current text-sm">{formatPrice(p.sale_price ?? p.regular_price)}</span>
                      {p.sale_price && (
                        <span className="price-original text-xs">{formatPrice(p.regular_price)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(p)}
                    className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
