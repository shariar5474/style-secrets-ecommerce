'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, User, Menu, X, Facebook, Instagram, Youtube, LogOut, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const { customer, isLoggedIn, logout } = useCustomerAuth();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }, [searchQuery]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-brand-pink to-brand-dark-pink text-white text-xs py-1 text-center">
        Free shipping on orders over ৳1,000 | Call: 01XXX-XXXXXX
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-brand-charcoal p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="Style Secrets"
                width={60}
                height={60}
                className="rounded-full"
                priority
              />
            </Link>

            {/* Search bar - desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, dresses, tops, sarees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-4 bg-brand-pink text-white rounded-r-lg hover:bg-brand-dark-pink transition-colors cursor-pointer"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden text-brand-charcoal p-1"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* User Profile / Login */}
              {isLoggedIn && customer ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="hidden lg:flex items-center gap-2 text-sm text-brand-charcoal hover:text-brand-pink transition-colors py-1.5 px-2.5 rounded-full hover:bg-brand-soft-pink/20 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-pink to-brand-dark-pink text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {customer.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold max-w-[120px] truncate text-xs text-brand-charcoal">
                      {customer.name}
                    </span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-brand-pink transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Desktop Dropdown */}
                  <div className="hidden group-hover:block absolute right-0 top-full pt-1.5 w-52 z-50 animate-scale-in">
                    <div className="bg-white rounded-xl shadow-xl border border-border-subtle py-2 text-xs">
                      <div className="px-3.5 py-2 border-b border-border-subtle bg-gray-50/50">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Signed In As</p>
                        <p className="font-bold text-brand-charcoal truncate text-xs mt-0.5">{customer.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{customer.email}</p>
                      </div>

                      <Link
                        href="/account"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-pink-50 hover:text-brand-pink transition-colors"
                      >
                        <User size={15} className="text-brand-pink" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-pink-50 hover:text-brand-pink transition-colors"
                      >
                        <ShoppingBag size={15} className="text-brand-pink" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/account/wishlist"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-pink-50 hover:text-brand-pink transition-colors"
                      >
                        <Heart size={15} className="text-brand-pink" />
                        <span>My Wishlist</span>
                      </Link>

                      <div className="border-t border-border-subtle my-1"></div>

                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden lg:flex items-center gap-1.5 text-sm text-brand-charcoal hover:text-brand-pink transition-colors py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <User size={19} />
                  <span className="font-medium text-xs">Login | Register</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="text-brand-charcoal hover:text-brand-pink transition-colors p-1"
                aria-label="Wishlist"
              >
                <Heart size={22} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative text-brand-charcoal hover:text-brand-pink transition-colors p-1 cursor-pointer"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Social icons - desktop */}
              <div className="hidden xl:flex items-center gap-2 ml-2 pl-2 border-l border-border-subtle">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="lg:hidden pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm"
                  autoFocus
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-brand-pink text-white rounded-r-lg">
                  <Search size={18} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border-subtle bg-white">
            <nav className="px-4 py-3 space-y-1">
              {isLoggedIn && customer ? (
                <div className="p-3 bg-brand-soft-pink/20 rounded-xl mb-3 flex items-center justify-between">
                  <Link
                    href="/account"
                    className="flex items-center gap-2.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-pink text-white font-bold text-xs flex items-center justify-center">
                      {customer.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <strong className="block text-xs text-brand-charcoal font-semibold">{customer.name}</strong>
                      <span className="text-[10px] text-gray-500 truncate max-w-[150px] block">{customer.email}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-red-600 text-xs flex items-center gap-1 hover:underline cursor-pointer font-medium"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 py-2 text-sm text-brand-charcoal hover:text-brand-pink font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} /> Login / Register
                </Link>
              )}

              {['Home', 'New Arrivals', 'Collections', 'Saree', 'Salwar Kameez', 'Tops', 'Hijab', 'Western Wear', 'Offers'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/categories/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block py-2 text-sm text-brand-charcoal hover:text-brand-pink"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
