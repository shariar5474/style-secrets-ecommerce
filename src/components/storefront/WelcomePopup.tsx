'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X, Mail, Gift, Truck, ShieldCheck, RotateCcw, Headphones, CheckCircle2, Copy, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { DEFAULT_POPUP_SETTINGS, shouldShowWelcomePopup, recordPopupDismissal, getLocalPopupSettings } from '@/lib/popup-config';
import type { WelcomePopupSettings } from '@/types';

export default function WelcomePopup() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<WelcomePopupSettings>(DEFAULT_POPUP_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Fetch settings from API or localStorage
  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      // Local cache first for instant load
      const local = getLocalPopupSettings();
      if (local && isMounted) {
        setSettings(local);
      }

      try {
        const res = await fetch('/api/popup-settings');
        const data = await res.json();
        if (data.success && data.settings && isMounted) {
          setSettings(data.settings);
        }
      } catch {
        // Use default settings
      }
    }

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Evaluate visibility based on path and frequency
  useEffect(() => {
    // Never show on admin, auth, checkout, or account pages
    if (
      !pathname ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/checkout') ||
      pathname.startsWith('/account')
    ) {
      setIsOpen(false);
      return;
    }

    // Check target pages rule
    if (settings.target_pages === 'homepage_only' && pathname !== '/') {
      setIsOpen(false);
      return;
    }

    // Check frequency and dismissal
    if (shouldShowWelcomePopup(settings)) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, (settings.delay_seconds || 1) * 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname, settings]);

  // 3. Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    recordPopupDismissal(settings);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (settings.close_on_overlay_click && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        recordPopupDismissal(settings);
      } else {
        setErrorMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      // Offline fallback: still unlock the coupon for customer delight
      setIsSuccess(true);
      recordPopupDismissal(settings);
    } finally {
      setLoading(false);
    }
  };

  const copyCouponCode = () => {
    navigator.clipboard.writeText(settings.coupon_code || 'STYLE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fade-in transition-all overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      {/* Main Modal Box */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-gradient-to-br from-[#FFF9F6] via-[#FFF3F5] to-[#FCE4EC] rounded-3xl shadow-2xl border border-pink-200/80 overflow-hidden flex flex-col my-auto transition-transform duration-300"
      >
        {/* Circular Close Button (top-right) */}
        <button
          onClick={handleClose}
          aria-label="Close welcome popup"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8E1748] hover:bg-[#C2185B] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C9A04A]"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Left Column: Fashion Model Image with Gold Floral Arc */}
          <div className="md:col-span-5 relative bg-gradient-to-b from-[#FCE4EC] to-[#F8BBD0] min-h-[220px] sm:min-h-[280px] md:min-h-[460px] flex items-end justify-center overflow-hidden">
            {/* Background Decorative Gold Arc */}
            <div className="absolute inset-2 sm:inset-4 rounded-2xl md:rounded-l-2xl md:rounded-r-full border-2 border-[#C9A04A]/60 pointer-events-none" />

            {/* Model Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.image_url || '/images/welcome-popup.jpg'}
              alt="Style Secrets Welcome Fashion"
              className="w-full h-full object-cover object-top relative z-10 transition-transform duration-700 hover:scale-105"
            />

            {/* Floral Petals Overlay */}
            <div className="absolute -bottom-4 -left-4 z-20 pointer-events-none select-none">
              <span className="text-3xl sm:text-4xl filter drop-shadow">🌸</span>
              <span className="text-2xl sm:text-3xl filter drop-shadow -ml-2">🌺</span>
            </div>
            <div className="absolute top-4 left-4 z-20 pointer-events-none select-none text-xl opacity-75">
              🌸
            </div>
          </div>

          {/* Right Column: Promotional Content & Subscription */}
          <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative z-10">
            <div>
              {/* Header: Welcome cursive text */}
              <div className="text-center md:text-left mb-1">
                <span className="font-serif italic text-lg sm:text-xl text-[#8E1748] tracking-wide inline-flex items-center gap-1 font-semibold">
                  {settings.welcome_text}
                </span>
              </div>

              {/* Brand Typography */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <h2
                    id="welcome-popup-title"
                    className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#C2185B] tracking-tight"
                  >
                    {settings.brand_title}
                  </h2>
                  <span className="text-[#C2185B] text-xl font-bold">🍃</span>
                </div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#282126] mt-0.5">
                  {settings.brand_subtitle}
                </p>
              </div>

              {/* Special Offer Heading */}
              <div className="text-center md:text-left mt-3">
                <p className="font-serif italic text-sm sm:text-base text-[#8E1748] font-medium flex items-center justify-center md:justify-start gap-1">
                  {settings.special_offer_heading} <span className="text-[#C2185B]">♥</span>
                </p>
              </div>

              {/* Discount Ribbon & Floating Badge */}
              <div className="relative my-3 sm:my-4">
                <div className="bg-gradient-to-r from-[#8E1748] via-[#A8184C] to-[#8E1748] border-y-2 border-[#C9A04A] py-2.5 sm:py-3 px-4 rounded-xl text-center text-white shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent pointer-events-none" />
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F8BBD0]">
                    {settings.discount_badge_text}
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#F5DEB3] drop-shadow tracking-wider py-0.5">
                    {settings.discount_title}
                  </div>
                  <div className="text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-pink-100">
                    {settings.discount_subtitle}
                  </div>
                </div>

                {/* Floating Round Shopping Badge (matches mockup) */}
                <div className="hidden sm:flex absolute -right-3 -top-3 z-20 flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-100 border-2 border-dashed border-[#C2185B] text-[#8E1748] shadow-lg transform rotate-6 hover:rotate-0 transition-transform">
                  <Gift className="w-4 h-4 text-[#C2185B]" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-center leading-tight mt-0.5">
                    SHOP YOUR<br />STYLE TODAY ♥
                  </span>
                </div>
              </div>

              {/* Email Form / Success State */}
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-1 rounded-full border border-pink-200 shadow-inner">
                    <div className="flex items-center gap-2 pl-3 flex-1 w-full sm:w-auto">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={settings.email_placeholder}
                        className="w-full text-xs sm:text-sm text-gray-800 focus:outline-none bg-transparent placeholder-gray-400 py-2"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#C2185B] hover:bg-[#8E1748] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-75"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>{settings.button_text}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-red-600 text-center sm:text-left pl-2">
                      {errorMessage}
                    </p>
                  )}

                  <p className="text-[10px] sm:text-xs text-gray-500 text-center md:text-left mt-1.5 italic">
                    {settings.supporting_text}
                  </p>
                </form>
              ) : (
                /* Success Screen with Coupon Code Reveal */
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center my-3 animate-scale-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-emerald-900">
                    {settings.success_heading}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
                    {settings.success_message}
                  </p>

                  {/* Promo Code Box */}
                  <div className="mt-3 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-sm">
                    <span className="font-mono font-black text-lg text-[#C2185B] tracking-wider">
                      {settings.coupon_code || 'STYLE10'}
                    </span>
                    <button
                      type="button"
                      onClick={copyCouponCode}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#C2185B] hover:bg-pink-50 transition-colors"
                      title="Copy Coupon Code"
                    >
                      {copied ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                        </span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleClose}
                      className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#C2185B] hover:bg-[#8E1748] text-white rounded-full text-xs font-bold transition-all shadow-md"
                    >
                      <span>Continue Shopping</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Service Strip (Floating white card inside modal) */}
            <div className="mt-4 pt-3 border-t border-pink-200/60 bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center sm:text-left">
                {/* 1. Free Delivery */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-[#C2185B] flex-shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {settings.service_delivery_title}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-gray-500 line-clamp-1">
                      {settings.service_delivery_sub}
                    </div>
                  </div>
                </div>

                {/* 2. Secure Payment */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-[#C2185B] flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {settings.service_payment_title}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-gray-500 line-clamp-1">
                      {settings.service_payment_sub}
                    </div>
                  </div>
                </div>

                {/* 3. Easy Return */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-[#C2185B] flex-shrink-0">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {settings.service_return_title}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-gray-500 line-clamp-1">
                      {settings.service_return_sub}
                    </div>
                  </div>
                </div>

                {/* 4. Support */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-[#C2185B] flex-shrink-0">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-900 leading-tight">
                      {settings.service_support_title}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-gray-500 line-clamp-1">
                      {settings.service_support_sub}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
