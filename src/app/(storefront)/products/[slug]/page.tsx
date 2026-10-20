'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/data/sampleData';
import { formatPrice, calculateDiscount, getStockStatus } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';
import ProductCard from '@/components/storefront/ProductCard';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // Find product by slug or id, initialized with demo fallback
  const [product, setProduct] = useState<Product>(() => {
    return (
      DEMO_PRODUCTS.find((p) => p.slug === slug || p.id === slug) ||
      DEMO_PRODUCTS[0]
    );
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products?status=all');
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          const match = json.products.find((p: any) => p.slug === slug || p.id === slug);
          if (match) {
            setProduct(match);
          }
        }
      } catch (err) {}
    }
    fetchProduct();
  }, [slug]);

  // Extract available attributes (Size, Color, etc.) from variations
  const attributesMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    if (product?.variations && product.variations.length > 0) {
      product.variations.forEach((v) => {
        v.attributes?.forEach((attr) => {
          const name = attr.attribute_name || 'Option';
          const val = attr.attribute_value || '';
          if (!map[name]) map[name] = new Set();
          if (val) map[name].add(val);
        });
      });
    }
    return Object.fromEntries(
      Object.entries(map).map(([k, set]) => [k, Array.from(set)])
    );
  }, [product]);

  // Selected variation state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(attributesMap).forEach(([attrName, values]) => {
      if (values.length > 0) initial[attrName] = values[0];
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Match the active variation based on selected attributes
  const matchedVariation = useMemo(() => {
    if (!product?.variations || product.variations.length === 0) return null;
    return product.variations.find((v) => {
      if (!v.attributes) return false;
      return v.attributes.every(
        (attr) =>
          selectedAttributes[attr.attribute_name || 'Option'] === attr.attribute_value
      );
    }) || product.variations[0];
  }, [product, selectedAttributes]);

  // Compute active price, stock, and SKU
  const currentPrice = matchedVariation
    ? (matchedVariation.sale_price ?? matchedVariation.regular_price)
    : (product.sale_price ?? product.regular_price);

  const regularPrice = matchedVariation
    ? matchedVariation.regular_price
    : product.regular_price;

  const currentStock = matchedVariation
    ? matchedVariation.stock_quantity
    : product.total_stock;

  const currentSKU = matchedVariation ? matchedVariation.sku : product.sku;

  const discount = calculateDiscount(regularPrice, currentPrice);
  const stockStatus = getStockStatus(currentStock);

  // Gallery images
  const images = useMemo(() => {
    const list: string[] = [];
    if (matchedVariation?.image_url) list.push(matchedVariation.image_url);
    if (product.featured_image_url && !list.includes(product.featured_image_url)) {
      list.push(product.featured_image_url);
    }
    if (product.images) {
      product.images.forEach((img) => {
        if (!list.includes(img.url)) list.push(img.url);
      });
    }
    if (list.length === 0) {
      list.push('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80');
    }
    return list;
  }, [product, matchedVariation]);

  const activeImage = images[activeImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem(
      product.id,
      matchedVariation?.id || null,
      quantity,
      product,
      matchedVariation || undefined
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(
      product.id,
      matchedVariation?.id || null,
      quantity,
      product,
      matchedVariation || undefined
    );
    router.push('/checkout');
  };

  const relatedProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  }, [product]);

  return (
    <div className="bg-brand-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-pink transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-brand-charcoal font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl p-6 lg:p-8 shadow-card border border-border-subtle">
          {/* Left: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-brand-pink ring-2 ring-brand-pink/20' : 'border-border-subtle hover:border-brand-soft-pink'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image */}
            <div className="relative flex-1 rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.is_new && <span className="badge-new text-xs">New Arrival</span>}
                {discount > 0 && <span className="badge-sale text-xs">Save {discount}%</span>}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isWishlisted ? 'bg-brand-pink text-white' : 'bg-white/90 text-brand-charcoal hover:bg-white hover:text-brand-pink'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {/* Right: Product Info & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Category: <strong className="text-brand-charcoal">{product.category?.name || 'Ladies Fashion'}</strong></span>
                <span>SKU: <strong className="text-brand-charcoal">{currentSKU}</strong></span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= Math.round(product.avg_rating || 5) ? 'fill-amber-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {product.avg_rating > 0 ? `${product.avg_rating} out of 5` : '5.0'} ({product.review_count || 12} Verified Reviews)
                </span>
                <span className="text-gray-300">•</span>
                <span className={`text-xs font-semibold ${
                  stockStatus === 'in_stock' ? 'text-green-600' : stockStatus === 'low_stock' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {stockStatus === 'in_stock' ? `In Stock (${currentStock} available)` : stockStatus === 'low_stock' ? `Only ${currentStock} left in stock!` : 'Out of Stock'}
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mt-5 p-4 bg-brand-ivory rounded-xl border border-border-subtle">
                <span className="text-3xl font-bold text-brand-pink">
                  {formatPrice(currentPrice)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(regularPrice)}
                    </span>
                    <span className="badge-sale text-xs px-2 py-1">
                      Save {discount}% ({formatPrice(regularPrice - currentPrice)})
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Variations Selector: Size & Color */}
              {Object.keys(attributesMap).length > 0 && (
                <div className="mt-6 space-y-4 pt-6 border-t border-border-subtle">
                  {Object.entries(attributesMap).map(([attrName, values]) => (
                    <div key={attrName} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-brand-charcoal uppercase tracking-wider">
                          Select {attrName}: <span className="text-brand-pink">{selectedAttributes[attrName]}</span>
                        </span>
                        {attrName.toLowerCase() === 'size' && (
                          <button className="text-brand-pink hover:underline text-[11px] font-medium">
                            Size Guide
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {values.map((val) => {
                          const isSelected = selectedAttributes[attrName] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => {
                                setSelectedAttributes((prev) => ({ ...prev, [attrName]: val }));
                              }}
                              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                                isSelected
                                  ? 'bg-brand-pink text-white border-brand-pink shadow-sm scale-105'
                                  : 'bg-white text-brand-charcoal border-border-subtle hover:border-brand-pink'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity & CTA Buttons */}
              <div className="mt-8 space-y-4 pt-6 border-t border-border-subtle">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-border-subtle rounded-lg bg-white h-12 w-36 justify-between px-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="text-gray-500 hover:text-brand-pink disabled:opacity-30 p-1"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-sm text-brand-charcoal">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock}
                      className="text-gray-500 hover:text-brand-pink disabled:opacity-30 p-1"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className="flex-1 btn-primary h-12 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <ShoppingBag size={18} />
                    {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    disabled={currentStock <= 0}
                    className="flex-1 btn-gold h-12 flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold"
                  >
                    <Zap size={18} />
                    Buy Now
                  </button>
                </div>

                {addedNotice && (
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-200 animate-fade-in">
                    <Check size={14} /> Item added to your shopping bag!
                  </div>
                )}
              </div>

              {/* Delivery & Trust Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-border-subtle">
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <Truck size={18} className="text-brand-pink flex-shrink-0" />
                  <span>Fast Delivery across Bangladesh (2-5 Days)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <ShieldCheck size={18} className="text-brand-pink flex-shrink-0" />
                  <span>100% Authentic Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <RotateCcw size={18} className="text-brand-pink flex-shrink-0" />
                  <span>Easy 7-day Exchange Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl p-6 lg:p-8 shadow-card border border-border-subtle">
          <div className="flex border-b border-border-subtle gap-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-semibold transition-all relative ${
                activeTab === 'description' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-charcoal'
              }`}
            >
              Description & Fabric Details
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-sm font-semibold transition-all relative ${
                activeTab === 'shipping' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-charcoal'
              }`}
            >
              Shipping & Returns
              {activeTab === 'shipping' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-semibold transition-all relative ${
                activeTab === 'reviews' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-charcoal'
              }`}
            >
              Customer Reviews ({product.review_count || 12})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />
              )}
            </button>
          </div>

          <div className="py-6 text-sm text-gray-600 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>
                  {product.description ||
                    'Crafted from the finest premium fabrics, this outfit reflects effortless elegance and contemporary flair. Designed with precision stitching, exquisite embellishments, and attention to comfort, it is ideal for festive parties, family gatherings, or special occasions.'}
                </p>
                <h4 className="font-semibold text-brand-charcoal text-sm">Highlights:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Fabric: Premium Georgette / Cotton Blend with soft breathable lining</li>
                  <li>Work: Hand-threaded embroidery with delicate zari highlights</li>
                  <li>Occasion: Festive, Wedding Party, Evening Wear, Casual Luxury</li>
                  <li>Care Instructions: Dry clean recommended. Gentle hand wash in cold water with mild detergent.</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <p><strong>Inside Dhaka Delivery:</strong> 24-48 Hours (Charge: ৳60)</p>
                <p><strong>Outside Dhaka Delivery:</strong> 3-5 Business Days (Charge: ৳120)</p>
                <p><strong>Return Policy:</strong> You may check and inspect the product in front of the courier delivery representative. If there is any defect or size mismatch, returns are accepted within 7 days with original tags intact.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="border-b border-border-subtle pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-brand-charcoal text-xs">Farzana Akter</strong>
                    <span className="text-[10px] text-gray-400">Dhaka • 2 weeks ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-600">The fabric quality is outstanding and the embroidery is even more gorgeous than in the pictures! Will definitely order again.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-brand-charcoal text-xs">Nusrat Jahan</strong>
                    <span className="text-[10px] text-gray-400">Chittagong • 1 month ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-600">Very comfortable fitting and fast delivery. bKash payment process was smooth and confirmed quickly.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-brand-charcoal">
              You May Also Like
            </h2>
            <Link href="/categories/all" className="text-xs font-semibold text-brand-pink hover:underline">
              View All Products &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
