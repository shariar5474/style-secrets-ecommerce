'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye,
  Sliders,
  Tag,
  Image as ImageIcon,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Mail,
  Gift,
  X,
  AlertCircle,
  Copy,
  Clock,
  Layers,
} from 'lucide-react';
import { DEFAULT_POPUP_SETTINGS, saveLocalPopupSettings } from '@/lib/popup-config';
import type { WelcomePopupSettings, PopupFrequency, PopupTargetPages } from '@/types';

export default function AdminPopupManagementPage() {
  const [settings, setSettings] = useState<WelcomePopupSettings>(DEFAULT_POPUP_SETTINGS);
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'appearance' | 'services'>('general');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewSubscribed, setPreviewSubscribed] = useState(false);

  // Load existing settings
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/popup-settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch {
        // Fallback to default
      }
    }
    load();
  }, []);

  const handleChange = (key: keyof WelcomePopupSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // 1. Save locally for instant reactivity
      saveLocalPopupSettings(settings);

      // 2. Persist to API & Supabase database
      const res = await fetch('/api/popup-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch {
      // Local save succeeded
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset popup settings to reference default design?')) {
      setSettings(DEFAULT_POPUP_SETTINGS);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Welcome Popup Management</h1>
            <span className="bg-pink-100 text-[#C2185B] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {settings.is_enabled ? 'Active' : 'Disabled'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Configure the luxury welcome modal, first-order discount offer, subscription triggers, and design
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            View Storefront
          </a>

          <button
            onClick={() => handleSave()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#C2185B] hover:bg-[#8E1748] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center justify-between shadow-sm animate-scale-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm font-medium">
              Welcome popup settings saved and published to the live storefront successfully!
            </div>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded">LIVE</span>
        </div>
      )}

      {/* Main Grid: Settings (Left) + Interactive Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Settings Tabs & Forms (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Settings Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-1 flex space-x-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'general' ? 'bg-[#C2185B] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>General & Rules</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'content' ? 'bg-[#C2185B] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Offer & Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'appearance' ? 'bg-[#C2185B] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image & Design</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'services' ? 'bg-[#C2185B] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Service Strip</span>
            </button>
          </div>

          {/* TAB 1: GENERAL & DISPLAY RULES */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-base">Display Status & Triggers</h3>
                  <p className="text-xs text-gray-500">Enable popup and configure when and where it displays</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.is_enabled}
                    onChange={(e) => handleChange('is_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C2185B]"></div>
                </label>
              </div>

              {/* Display Frequency */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Display Frequency
                  </label>
                  <select
                    value={settings.frequency}
                    onChange={(e) => handleChange('frequency', e.target.value as PopupFrequency)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#C2185B]"
                  >
                    <option value="once_per_session">Once per browser session (Recommended)</option>
                    <option value="every_visit">Every new visit (Reset when browser closes)</option>
                    <option value="every_n_days">Once every X days</option>
                    <option value="every_page_load">Every page load (Testing & Preview)</option>
                    <option value="disabled">Disabled</option>
                  </select>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Controls how frequently repeat visitors will encounter the popup.
                  </span>
                </div>

                {settings.frequency === 'every_n_days' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Days Between Displays
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={settings.frequency_days}
                      onChange={(e) => handleChange('frequency_days', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Target Storefront Pages
                    </label>
                    <select
                      value={settings.target_pages}
                      onChange={(e) => handleChange('target_pages', e.target.value as PopupTargetPages)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#C2185B]"
                    >
                      <option value="all_public">All Public Pages (Home, Shop, Categories)</option>
                      <option value="homepage_only">Homepage Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Delay Before Showing (Seconds)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={settings.delay_seconds}
                      onChange={(e) => handleChange('delay_seconds', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={settings.close_on_overlay_click}
                      onChange={(e) => handleChange('close_on_overlay_click', e.target.checked)}
                      className="rounded border-gray-300 text-[#C2185B] focus:ring-[#C2185B] w-4 h-4"
                    />
                    <span>Allow closing by clicking background overlay</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={settings.desktop_enabled}
                      onChange={(e) => handleChange('desktop_enabled', e.target.checked)}
                      className="rounded border-gray-300 text-[#C2185B] focus:ring-[#C2185B] w-4 h-4"
                    />
                    <span>Enable on Desktop & Laptops</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={settings.mobile_enabled}
                      onChange={(e) => handleChange('mobile_enabled', e.target.checked)}
                      className="rounded border-gray-300 text-[#C2185B] focus:ring-[#C2185B] w-4 h-4"
                    />
                    <span>Enable on Mobile Devices</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFER & CONTENT */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-serif font-bold text-gray-900 text-base">Promotional Copy & Offer</h3>
                <p className="text-xs text-gray-500">Edit titles, discount banner copy, and coupon reveal</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Top Cursive Welcome Text
                  </label>
                  <input
                    type="text"
                    value={settings.welcome_text}
                    onChange={(e) => handleChange('welcome_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Special Offer Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.special_offer_heading}
                    onChange={(e) => handleChange('special_offer_heading', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                  />
                </div>
              </div>

              {/* Discount Banner Fields */}
              <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100 space-y-3">
                <div className="font-bold text-xs text-[#8E1748] uppercase tracking-wider">
                  Discount Brush Banner Copy
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pre-title</label>
                    <input
                      type="text"
                      value={settings.discount_badge_text}
                      onChange={(e) => handleChange('discount_badge_text', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Main Discount</label>
                    <input
                      type="text"
                      value={settings.discount_title}
                      onChange={(e) => handleChange('discount_title', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={settings.discount_subtitle}
                      onChange={(e) => handleChange('discount_subtitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Circular Promo Badge Text
                  </label>
                  <input
                    type="text"
                    value={settings.badge_text}
                    onChange={(e) => handleChange('badge_text', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                  />
                </div>
              </div>

              {/* Coupon Code to Unlock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Linked Real Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.coupon_code}
                    onChange={(e) => handleChange('coupon_code', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono font-bold text-[#C2185B] focus:outline-none focus:border-[#C2185B]"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Displayed to customers upon email subscription (e.g. STYLE10).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.button_text}
                    onChange={(e) => handleChange('button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Supporting Disclaimer
                </label>
                <input
                  type="text"
                  value={settings.supporting_text}
                  onChange={(e) => handleChange('supporting_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Success Message (Post-Subscription)
                </label>
                <input
                  type="text"
                  value={settings.success_message}
                  onChange={(e) => handleChange('success_message', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE & DESIGN */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-serif font-bold text-gray-900 text-base">Model Image & Visual Assets</h3>
                <p className="text-xs text-gray-500">Configure modal imagery, brand title, and custom URLs</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Model Fashion Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('image_url', '/images/welcome-popup.jpg')}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-600 flex-shrink-0"
                  >
                    Use Reference Image
                  </button>
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Default: <code>/images/welcome-popup.jpg</code> matching the uploaded mockup.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Brand Name Headline
                  </label>
                  <input
                    type="text"
                    value={settings.brand_title}
                    onChange={(e) => handleChange('brand_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Brand Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.brand_subtitle}
                    onChange={(e) => handleChange('brand_subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C2185B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICE STRIP */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-serif font-bold text-gray-900 text-base">Bottom Service Badges</h3>
                <p className="text-xs text-gray-500">Configure the 4 floating trust cards inside the modal</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C2185B]" /> Service 1: Delivery
                  </span>
                  <input
                    type="text"
                    value={settings.service_delivery_title}
                    onChange={(e) => handleChange('service_delivery_title', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={settings.service_delivery_sub}
                    onChange={(e) => handleChange('service_delivery_sub', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-500"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C2185B]" /> Service 2: Payment
                  </span>
                  <input
                    type="text"
                    value={settings.service_payment_title}
                    onChange={(e) => handleChange('service_payment_title', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={settings.service_payment_sub}
                    onChange={(e) => handleChange('service_payment_sub', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-500"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C2185B]" /> Service 3: Returns
                  </span>
                  <input
                    type="text"
                    value={settings.service_return_title}
                    onChange={(e) => handleChange('service_return_title', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={settings.service_return_sub}
                    onChange={(e) => handleChange('service_return_sub', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-500"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-[#C2185B]" /> Service 4: Support
                  </span>
                  <input
                    type="text"
                    value={settings.service_support_title}
                    onChange={(e) => handleChange('service_support_title', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={settings.service_support_sub}
                    onChange={(e) => handleChange('service_support_sub', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              Reset to Defaults
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C2185B] hover:bg-[#8E1748] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Publish Changes'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C2185B]" />
                <span className="font-serif font-bold text-gray-900 text-sm">Interactive Live Preview</span>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded text-xs font-medium transition-colors ${
                    previewDevice === 'desktop' ? 'bg-white text-[#C2185B] shadow-sm' : 'text-gray-500'
                  }`}
                  title="Desktop View"
                >
                  <Laptop className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded text-xs font-medium transition-colors ${
                    previewDevice === 'mobile' ? 'bg-white text-[#C2185B] shadow-sm' : 'text-gray-500'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Toggle Preview Subscribed State */}
            <div className="flex items-center justify-end gap-2 mt-2">
              <span className="text-[11px] text-gray-500">Preview View:</span>
              <button
                type="button"
                onClick={() => setPreviewSubscribed(false)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  !previewSubscribed ? 'bg-[#C2185B] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setPreviewSubscribed(true)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  previewSubscribed ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Coupon Reveal
              </button>
            </div>

            {/* Simulated Frame */}
            <div className="mt-4 bg-[#282126]/10 p-3 sm:p-4 rounded-2xl flex items-center justify-center overflow-hidden">
              <div
                className={`bg-gradient-to-br from-[#FFF9F6] via-[#FFF3F5] to-[#FCE4EC] rounded-2xl shadow-xl border border-pink-200 overflow-hidden relative transition-all duration-300 ${
                  previewDevice === 'desktop' ? 'w-full' : 'w-[280px]'
                }`}
              >
                {/* Simulated Close button */}
                <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-[#8E1748] text-white flex items-center justify-center shadow text-xs">
                  ✕
                </div>

                <div className={`grid ${previewDevice === 'desktop' ? 'grid-cols-12' : 'grid-cols-1'}`}>
                  {/* Model Image */}
                  <div
                    className={`${
                      previewDevice === 'desktop' ? 'col-span-5 min-h-[220px]' : 'col-span-1 h-[140px]'
                    } relative bg-gradient-to-b from-[#FCE4EC] to-[#F8BBD0] flex items-end justify-center overflow-hidden`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.image_url || '/images/welcome-popup.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`${
                      previewDevice === 'desktop' ? 'col-span-7 p-3.5' : 'col-span-1 p-3'
                    } flex flex-col justify-between`}
                  >
                    <div>
                      <div className="text-center font-serif italic text-xs text-[#8E1748] font-semibold">
                        {settings.welcome_text}
                      </div>
                      <div className="text-center font-serif font-black text-base text-[#C2185B] leading-tight">
                        {settings.brand_title}
                      </div>
                      <div className="text-center text-[8px] uppercase tracking-widest font-bold text-gray-700">
                        {settings.brand_subtitle}
                      </div>

                      {/* Brush Banner */}
                      <div className="my-2 bg-gradient-to-r from-[#8E1748] via-[#A8184C] to-[#8E1748] border-y border-[#C9A04A] py-1.5 px-2 rounded-lg text-center text-white shadow-sm">
                        <div className="text-[7px] font-bold uppercase text-[#F8BBD0]">
                          {settings.discount_badge_text}
                        </div>
                        <div className="text-base font-serif font-black text-[#F5DEB3]">
                          {settings.discount_title}
                        </div>
                        <div className="text-[7px] uppercase tracking-wider text-pink-100">
                          {settings.discount_subtitle}
                        </div>
                      </div>

                      {/* Form or Success */}
                      {!previewSubscribed ? (
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-pink-200">
                            <span className="text-[9px] text-gray-400 pl-2">✉️</span>
                            <span className="text-[9px] text-gray-400 flex-1 truncate">
                              {settings.email_placeholder}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-[#C2185B] text-white text-[9px] font-bold">
                              GO
                            </span>
                          </div>
                          <p className="text-[8px] text-gray-500 text-center line-clamp-1 italic">
                            {settings.supporting_text}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center my-1">
                          <div className="text-[10px] font-bold text-emerald-800">
                            {settings.success_heading}
                          </div>
                          <div className="font-mono font-black text-xs text-[#C2185B] mt-0.5">
                            {settings.coupon_code}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Service Strip in preview */}
                    <div className="mt-2 pt-1 border-t border-pink-100 text-[7px] text-gray-600 flex justify-between">
                      <span>🚚 {settings.service_delivery_title}</span>
                      <span>🛡️ {settings.service_payment_title}</span>
                      <span>📦 {settings.service_return_title}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              Preview updates live as you type. Click &quot;Save & Publish&quot; to apply to the storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
