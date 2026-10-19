'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  onMenuClick?: () => void;
}

export default function AdminHeader({
  title = 'Style Secrets Admin',
  subtitle,
  onOpenMobileMenu,
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      document.cookie =
        'admin_demo_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors in demo mode
    }
    router.push('/admin/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/orders?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const demoNotifications = [
    {
      id: 'n1',
      title: 'New order #ORD20240228-091',
      desc: 'Tasnim Farhana placed an order of ৳5,060 via bKash',
      time: '12m ago',
      type: 'order',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Low stock warning',
      desc: 'Dhakai Jamdani Heritage Saree has only 8 items left',
      time: '1h ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Payment verification needed',
      desc: 'bKash TrxID 9B7X28KA1P submitted for approval',
      time: '2h ago',
      type: 'payment',
      unread: true,
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#E8DCD8] shadow-sm">
      {/* 4px Pink Accent Line at top */}
      <div className="h-1 bg-gradient-to-r from-[#8E1748] via-[#C2185B] to-[#C9A04A]" />

      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick || onOpenMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-[#C2185B] hover:bg-[#FFF9F6] rounded-lg transition-colors border border-gray-200"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#282126] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Search + Notifications + Avatar */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative"
          >
            <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, SKU, customer..."
              className="w-64 pl-9 pr-4 py-1.5 text-xs bg-[#FFF9F6] border border-[#E8DCD8] rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 focus:border-[#C2185B] transition-all"
            />
          </form>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-full text-gray-600 hover:text-[#C2185B] hover:bg-[#FFF9F6] transition-colors border border-gray-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C2185B] border-2 border-white rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E8DCD8] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#E8DCD8]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#282126]">
                      Notifications
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#F8BBD0] text-[#8E1748] rounded-full">
                      {unreadCount} new
                    </span>
                  </div>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-xs text-[#C2185B] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {demoNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 hover:bg-[#FFF9F6] transition-colors flex gap-3 text-left cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {notif.type === 'order' && (
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-[#C2185B] flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'warning' && (
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'payment' && (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#282126] truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">
                          {notif.desc}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-[#E8DCD8] text-center">
                  <Link
                    href="/admin/orders"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#C2185B] font-semibold hover:underline block py-1"
                  >
                    View All Orders & Activities
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Avatar & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[#FFF9F6] border border-gray-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8E1748] to-[#C2185B] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                SR
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-semibold text-[#282126] block leading-none">
                  Sumaiya Rahman
                </span>
                <span className="text-[10px] text-[#C9A04A] font-medium leading-tight">
                  Super Admin
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#E8DCD8] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-[#E8DCD8]">
                  <p className="text-xs font-semibold text-[#282126]">
                    Sumaiya Rahman
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    admin@stylesecrets.com
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-pink-100 text-[#C2185B]">
                    Demo Admin Mode
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <Link
                    href="/admin/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-[#FFF9F6] hover:text-[#C2185B] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Store Settings
                  </Link>
                  <Link
                    href="/admin/customers"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-[#FFF9F6] hover:text-[#C2185B] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Customer Directory
                  </Link>
                </div>

                <div className="border-t border-[#E8DCD8] pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 w-full text-left transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
