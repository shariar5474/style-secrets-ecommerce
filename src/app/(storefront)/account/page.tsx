'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { DEMO_ORDERS } from '@/lib/data/sampleData';
import { formatPrice, getOrderStatusColor } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function AccountDashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Tamanna Islam',
    email: 'tamanna@example.com',
    phone: '01712345678',
    memberSince: 'January 2026',
    address: 'House 42, Road 11, Banani, Dhaka',
  });

  useEffect(() => {
    async function loadCustomer() {
      // 1. Check Supabase user
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const metaName = user.user_metadata?.full_name || user.email?.split('@')[0];
          setUserProfile((prev) => ({
            ...prev,
            name: metaName || prev.name,
            email: user.email || prev.email,
            phone: user.user_metadata?.phone || prev.phone,
          }));
          return;
        }
      } catch {}

      // 2. Check local profile
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('style_secrets_customer_profile');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUserProfile((prev) => ({ ...prev, ...parsed }));
          } catch {}
        }
      }
    }
    loadCustomer();
  }, []);

  const handleLogout = async () => {
    document.cookie = 'customer_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('style_secrets_customer_profile');
      window.dispatchEvent(new Event('customer_auth_changed'));
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.href = '/auth/login';
  };

  const recentOrders = DEMO_ORDERS.slice(0, 3);

  return (
    <div className="bg-brand-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal font-medium">My Account</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-brand-soft-pink/40 flex items-center justify-center text-brand-pink font-bold text-xl">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-charcoal text-base">{userProfile.name}</h3>
                  <p className="text-xs text-gray-400">{userProfile.email}</p>
                  <p className="text-[11px] text-brand-pink font-medium mt-0.5">Customer since {userProfile.memberSince}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-brand-pink text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <User size={16} />
                    <span>Account Overview</span>
                  </div>
                  <ChevronRight size={14} />
                </Link>

                <Link
                  href="/account/orders"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-brand-soft-pink/20 hover:text-brand-pink transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} />
                    <span>My Orders</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{DEMO_ORDERS.length}</span>
                </Link>

                <Link
                  href="/account/wishlist"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-brand-soft-pink/20 hover:text-brand-pink transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart size={16} />
                    <span>My Wishlist</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">3</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors pt-3 text-left cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right: Dashboard Summary */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-card border border-border-subtle">
                <span className="text-xs text-gray-400">Total Orders</span>
                <p className="text-2xl font-bold text-brand-charcoal mt-1">{DEMO_ORDERS.length}</p>
                <Link href="/account/orders" className="text-[11px] text-brand-pink hover:underline mt-2 inline-block">
                  View all orders &rarr;
                </Link>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-card border border-border-subtle">
                <span className="text-xs text-gray-400">Wishlist Items</span>
                <p className="text-2xl font-bold text-brand-charcoal mt-1">3</p>
                <Link href="/account/wishlist" className="text-[11px] text-brand-pink hover:underline mt-2 inline-block">
                  Browse wishlist &rarr;
                </Link>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-card border border-border-subtle">
                <span className="text-xs text-gray-400">Reward Points</span>
                <p className="text-2xl font-bold text-brand-gold mt-1">450 pts</p>
                <span className="text-[11px] text-gray-400 mt-2 inline-block">৳450 discount ready</span>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle">
              <h3 className="font-semibold text-brand-charcoal text-base mb-4 border-b border-border-subtle pb-3">
                Saved Delivery Address
              </h3>
              <div className="flex items-start gap-3 p-4 bg-brand-ivory rounded-xl border border-border-subtle">
                <MapPin size={20} className="text-brand-pink flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs font-semibold text-brand-charcoal">{userProfile.name}</strong>
                  <p className="text-xs text-gray-600 mt-1">{userProfile.address}</p>
                  <p className="text-xs text-gray-500 mt-1">Phone: {userProfile.phone}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
                <h3 className="font-semibold text-brand-charcoal text-base">Recent Orders</h3>
                <Link href="/account/orders" className="text-xs text-brand-pink font-semibold hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-xl border border-border-subtle flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-xs text-brand-pink">{ord.order_number}</strong>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${getOrderStatusColor(ord.order_status)}`}>
                          {ord.order_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ord.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {ord.items?.length || 1} items
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <strong className="text-sm font-bold text-brand-charcoal">{formatPrice(ord.total)}</strong>
                      <Link
                        href={`/account/orders/${ord.id}`}
                        className="btn-secondary text-[11px] px-3 py-1.5"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
