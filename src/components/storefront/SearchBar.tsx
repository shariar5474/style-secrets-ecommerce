'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/data/sampleData';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSelect?: () => void;
}

export function SearchBar({
  placeholder = 'Search for products, dresses, tops, sarees...',
  className = '',
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<Product[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const matched = DEMO_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q) ||
          p.category?.name_bn?.toLowerCase().includes(q)
      ).slice(0, 5);

      setResults(matched);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onSelect) onSelect();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white text-sm text-brand-charcoal pl-10 pr-20 py-2.5 rounded-full border border-border-subtle shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all placeholder:text-gray-400"
        />
        <div className="absolute left-3.5 flex items-center pointer-events-none text-brand-pink">
          <Search className="h-4 w-4" />
        </div>
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-brand-pink rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="bg-brand-pink text-white p-1.5 rounded-full hover:bg-brand-dark-pink transition-colors"
            aria-label="Submit search"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-border-subtle overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {isLoading ? (
            <div className="p-6 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-brand-pink" />
              <span>Searching catalog...</span>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="px-4 py-2.5 bg-brand-ivory text-xs font-semibold uppercase tracking-wider text-brand-charcoal/70 border-b border-border-subtle flex justify-between items-center">
                <span>Products Found ({results.length})</span>
                <span className="text-[10px] text-gray-500">Press Enter for all</span>
              </div>
              <ul className="divide-y divide-border-subtle/60 max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelect) onSelect();
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-brand-ivory/80 transition-colors group"
                    >
                      <div className="relative w-12 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-border-subtle">
                        {product.featured_image_url ? (
                          <Image
                            src={product.featured_image_url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-brand-pink font-medium truncate">
                          {product.category?.name || 'Ladies Fashion'}
                        </p>
                        <h6 className="text-sm font-semibold text-brand-charcoal truncate group-hover:text-brand-pink transition-colors">
                          {product.name}
                        </h6>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-brand-pink">
                            {formatPrice(product.sale_price ?? product.regular_price)}
                          </span>
                          {product.sale_price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatPrice(product.regular_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-gray-50 border-t border-border-subtle text-center">
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (onSelect) onSelect();
                  }}
                  className="text-xs font-semibold text-brand-pink hover:underline inline-flex items-center gap-1"
                >
                  View all results for &ldquo;{query}&rdquo; <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-brand-charcoal">No products found</p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching with different keywords like saree, kurti, hijab or western
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
