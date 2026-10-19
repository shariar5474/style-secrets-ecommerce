'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/types';
import { useCartStore } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const discount = product.sale_price
    ? calculateDiscount(product.regular_price, product.sale_price)
    : 0;

  const handleAddToCart = () => {
    if (product.is_variable) {
      // Navigate to product page for variation selection
      window.location.href = `/products/${product.slug}`;
      return;
    }
    addItem(product.id, null, 1, product);
    openCart();
  };

  return (
    <div className="card group relative overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link href={`/products/${product.slug}`}>
          <img
            src={product.featured_image_url || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <span className="badge-new text-[10px]">New</span>
          )}
          {product.is_featured && (
            <span className="badge-bestseller text-[10px]">Best Seller</span>
          )}
          {discount > 0 && (
            <span className="badge-sale text-[10px]">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-brand-pink hover:text-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={14} />
        </button>
      </div>

      {/* Info */}
      <div className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        <Link href={`/products/${product.slug}`}>
          <h3 className={`font-semibold text-brand-charcoal hover:text-brand-pink transition-colors line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {product.name}
          </h3>
        </Link>

        {!compact && product.category && (
          <p className="text-xs text-gray-400">{product.category.name}</p>
        )}

        {/* Rating */}
        {!compact && product.review_count > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={star <= Math.round(product.avg_rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className={`price-current ${compact ? 'text-sm' : 'text-base'}`}>
            {formatPrice(product.sale_price ?? product.regular_price)}
          </span>
          {product.sale_price && (
            <span className="price-original">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {!compact && (
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5 mt-2"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
