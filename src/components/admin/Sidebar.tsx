'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Grid3X3,
  Users,
  Ticket,
  Image as ImageIcon,
  CreditCard,
  Settings,
  BarChart3,
  Boxes,
  LogOut,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/banners', label: 'Banners & Hero', icon: ImageIcon },
  { href: '/admin/popup', label: 'Welcome Popup', icon: Sparkles },
  { href: '/admin/payments', label: 'Payment Methods', icon: CreditCard },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear demo session cookie
      document.cookie = 'admin_demo_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors in demo mode
    }
    router.push('/admin/login');
  };

  const isActive = (itemHref: string, exact?: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#282126] text-gray-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#3b3239]">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8E1748] to-[#C2185B] flex items-center justify-center text-white shadow-md shadow-[#C2185B]/20">
            <Sparkles className="w-5 h-5 text-[#C9A04A]" />
          </div>
          <div>
            <div className="text-lg font-serif font-bold tracking-wide text-white group-hover:text-[#F8BBD0] transition-colors">
              Style Secrets
            </div>
            <div className="text-[11px] font-medium tracking-wider text-[#C9A04A] uppercase">
              Admin Portal
            </div>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* View Live Store quick link */}
      <div className="px-4 pt-3 pb-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-300 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            View Live Store
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          Management
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-[#C2185B] text-white shadow-md shadow-[#C2185B]/30 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-transform group-hover:scale-110',
                  active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              <span className="truncate">{item.label}</span>
              {item.label === 'Orders' && (
                <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  18
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer Profile & Logout */}
      <div className="p-4 border-t border-[#3b3239] bg-[#221b20]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#8E1748] border border-[#C9A04A]/40 flex items-center justify-center text-white font-semibold text-xs shadow-inner shrink-0">
              SR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Sumaiya Rahman
              </p>
              <p className="text-[10px] text-emerald-400 font-medium truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Super Admin [DEMO]
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg text-gray-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] h-screen fixed inset-y-0 left-0 z-30 shadow-xl border-r border-[#3b3239]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-[270px] max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
