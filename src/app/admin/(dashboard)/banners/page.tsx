'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { DEMO_HERO_SLIDES, DEMO_PROMO_BANNERS } from '@/lib/admin-demo-data';
import type { HeroSlide, PromoBanner } from '@/types';

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'promo'>('hero');
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEMO_HERO_SLIDES);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(DEMO_PROMO_BANNERS);

  // Hero Slide Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('Shop Collection');
  const [heroButtonLink, setHeroButtonLink] = useState('/products');
  const [heroIsActive, setHeroIsActive] = useState(true);

  // Promo Banner Modal states
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromoBanner, setEditingPromoBanner] = useState<PromoBanner | null>(null);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoSubtitle, setPromoSubtitle] = useState('');
  const [promoDescription, setPromoDescription] = useState('');
  const [promoDiscountText, setPromoDiscountText] = useState('');
  const [promoImageUrl, setPromoImageUrl] = useState('');
  const [promoButtonText, setPromoButtonText] = useState('Explore Offer');
  const [promoButtonLink, setPromoButtonLink] = useState('/products');
  const [promoStartDate, setPromoStartDate] = useState('');
  const [promoEndDate, setPromoEndDate] = useState('');
  const [promoIsActive, setPromoIsActive] = useState(true);

  // HERO SLIDES HANDLERS
  const openNewHeroModal = () => {
    setEditingHeroSlide(null);
    setHeroTitle('');
    setHeroSubtitle('New Exclusive Arrivals');
    setHeroDescription('Step into timeless grace with our latest curated Pakistani & Bangladeshi luxury dresses.');
    setHeroImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80');
    setHeroButtonText('Shop Now');
    setHeroButtonLink('/products');
    setHeroIsActive(true);
    setHeroModalOpen(true);
  };

  const openEditHeroModal = (slide: HeroSlide) => {
    setEditingHeroSlide(slide);
    setHeroTitle(slide.title);
    setHeroSubtitle(slide.subtitle || '');
    setHeroDescription(slide.description || '');
    setHeroImageUrl(slide.image_url);
    setHeroButtonText(slide.button_text);
    setHeroButtonLink(slide.button_link);
    setHeroIsActive(slide.is_active);
    setHeroModalOpen(true);
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHeroSlide) {
      setHeroSlides((prev) =>
        prev.map((s) =>
          s.id === editingHeroSlide.id
            ? {
                ...s,
                title: heroTitle,
                subtitle: heroSubtitle,
                description: heroDescription,
                image_url: heroImageUrl,
                button_text: heroButtonText,
                button_link: heroButtonLink,
                is_active: heroIsActive,
                updated_at: new Date().toISOString(),
              }
            : s
        )
      );
    } else {
      const newSlide: HeroSlide = {
        id: `slide-${Date.now()}`,
        title: heroTitle,
        subtitle: heroSubtitle,
        description: heroDescription,
        image_url: heroImageUrl,
        button_text: heroButtonText,
        button_link: heroButtonLink,
        sort_order: heroSlides.length + 1,
        is_active: heroIsActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setHeroSlides((prev) => [...prev, newSlide]);
    }
    setHeroModalOpen(false);
  };

  const toggleHeroActive = (id: string) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  const moveHeroSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;
    const updated = [...heroSlides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    // update sort orders
    updated.forEach((s, idx) => {
      s.sort_order = idx + 1;
    });
    setHeroSlides(updated);
  };

  const handleDeleteHeroSlide = (id: string) => {
    if (confirm('Delete this hero slide?')) {
      setHeroSlides((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // PROMO BANNERS HANDLERS
  const openNewPromoModal = () => {
    setEditingPromoBanner(null);
    setPromoTitle('Special Summer Elegance');
    setPromoSubtitle('Curated Festive Wear on Flat Discount');
    setPromoDescription('Enjoy premier cotton and lawn fabrics crafted for Dhaka climate.');
    setPromoDiscountText('Flat 20% OFF');
    setPromoImageUrl('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80');
    setPromoButtonText('Shop Now');
    setPromoButtonLink('/products');
    setPromoStartDate(new Date().toISOString().split('T')[0]);
    setPromoEndDate('');
    setPromoIsActive(true);
    setPromoModalOpen(true);
  };

  const openEditPromoModal = (banner: PromoBanner) => {
    setEditingPromoBanner(banner);
    setPromoTitle(banner.title);
    setPromoSubtitle(banner.subtitle || '');
    setPromoDescription(banner.description || '');
    setPromoDiscountText(banner.discount_text || '');
    setPromoImageUrl(banner.image_url || '');
    setPromoButtonText(banner.button_text || 'Shop Now');
    setPromoButtonLink(banner.button_link || '/products');
    setPromoStartDate(banner.start_date || '');
    setPromoEndDate(banner.end_date || '');
    setPromoIsActive(banner.is_active);
    setPromoModalOpen(true);
  };

  const handleSavePromoBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromoBanner) {
      setPromoBanners((prev) =>
        prev.map((b) =>
          b.id === editingPromoBanner.id
            ? {
                ...b,
                title: promoTitle,
                subtitle: promoSubtitle,
                description: promoDescription,
                discount_text: promoDiscountText,
                image_url: promoImageUrl,
                button_text: promoButtonText,
                button_link: promoButtonLink,
                start_date: promoStartDate || null,
                end_date: promoEndDate || null,
                is_active: promoIsActive,
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );
    } else {
      const newBanner: PromoBanner = {
        id: `banner-${Date.now()}`,
        title: promoTitle,
        subtitle: promoSubtitle,
        description: promoDescription,
        discount_text: promoDiscountText,
        image_url: promoImageUrl,
        button_text: promoButtonText,
        button_link: promoButtonLink,
        sort_order: promoBanners.length + 1,
        is_active: promoIsActive,
        start_date: promoStartDate || null,
        end_date: promoEndDate || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPromoBanners((prev) => [...prev, newBanner]);
    }
    setPromoModalOpen(false);
  };

  const togglePromoActive = (id: string) => {
    setPromoBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    );
  };

  const handleDeletePromoBanner = (id: string) => {
    if (confirm('Delete this promotional banner?')) {
      setPromoBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Banners & Hero Carousel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage storefront hero slides, promotional banners, offers, and schedule campaigns
          </p>
        </div>
        <button
          onClick={activeTab === 'hero' ? openNewHeroModal : openNewPromoModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'hero' ? 'Add Hero Slide' : 'Add Promo Banner'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'hero'
                ? 'border-brand-pink text-brand-pink font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Hero Slides Carousel ({heroSlides.length})
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'promo'
                ? 'border-brand-pink text-brand-pink font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Promotional Banners ({promoBanners.length})
          </button>
        </nav>
      </div>

      {/* TAB 1: HERO SLIDES */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Order control */}
                  <div className="flex flex-col gap-1 text-gray-400">
                    <button
                      disabled={index === 0}
                      onClick={() => moveHeroSlide(index, 'up')}
                      className="p-1 hover:text-brand-pink disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-center text-gray-600">
                      #{slide.sort_order}
                    </span>
                    <button
                      disabled={index === heroSlides.length - 1}
                      onClick={() => moveHeroSlide(index, 'down')}
                      className="p-1 hover:text-brand-pink disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-28 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Slide details */}
                  <div className="min-w-0 flex-1">
                    {slide.subtitle && (
                      <span className="text-xs font-semibold text-brand-pink tracking-wide uppercase">
                        {slide.subtitle}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-gray-900 text-base truncate">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {slide.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        Button: &quot;{slide.button_text}&quot;
                      </span>
                      <span>→</span>
                      <span className="font-mono text-gray-600">{slide.button_link}</span>
                    </div>
                  </div>
                </div>

                {/* Status & actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    onClick={() => toggleHeroActive(slide.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      slide.is_active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        slide.is_active ? 'bg-emerald-600' : 'bg-gray-400'
                      }`}
                    />
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditHeroModal(slide)}
                      className="p-2 text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded-lg transition-colors"
                      title="Edit slide"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteHeroSlide(slide.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMO BANNERS */}
      {activeTab === 'promo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promoBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl border border-brand-border/60 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Preview banner style */}
              <div className="relative h-44 bg-gradient-to-r from-brand-pink to-brand-pink-dark p-6 text-white flex flex-col justify-between overflow-hidden">
                {banner.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 mix-blend-overlay"
                  />
                )}
                <div className="relative z-10">
                  {banner.discount_text && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase mb-2">
                      {banner.discount_text}
                    </span>
                  )}
                  <h4 className="text-xl font-serif font-bold text-white drop-shadow-sm">
                    {banner.title}
                  </h4>
                  {banner.subtitle && (
                    <p className="text-xs text-pink-100 mt-1 line-clamp-1">{banner.subtitle}</p>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between mt-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-brand-pink px-3 py-1 rounded shadow-sm">
                    {banner.button_text} <ExternalLink className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-pink-200">
                    {banner.is_active ? 'Active On Storefront' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Banner details & actions */}
              <div className="p-4 bg-white flex items-center justify-between border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  <div>Link: <span className="font-mono text-gray-700">{banner.button_link}</span></div>
                  <div>Schedule: {banner.start_date || 'Always active'}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePromoActive(banner.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      banner.is_active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => openEditPromoModal(banner)}
                    className="p-1.5 text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePromoBanner(banner.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HERO SLIDE MODAL */}
      {heroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-brand-border/80">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                {editingHeroSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
              </h3>
              <button onClick={() => setHeroModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="E.g. Spring Festive Luxe 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Subtitle / Badge Text
                </label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="E.g. NEW ARRIVALS & FESTIVE COLLECTION"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Promotional Description
                </label>
                <textarea
                  rows={2}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Short elegant tagline for the hero banner..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={heroButtonText}
                    onChange={(e) => setHeroButtonText(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Button Link URL
                  </label>
                  <input
                    type="text"
                    value={heroButtonLink}
                    onChange={(e) => setHeroButtonLink(e.target.value)}
                    placeholder="/products or /categories/sarees"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hero-active"
                  checked={heroIsActive}
                  onChange={(e) => setHeroIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink h-4 w-4"
                />
                <label htmlFor="hero-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Publish to storefront carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setHeroModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark"
                >
                  {editingHeroSlide ? 'Update Slide' : 'Add Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMO BANNER MODAL */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-brand-border/80">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                {editingPromoBanner ? 'Edit Promo Banner' : 'Create Promo Banner'}
              </h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromoBanner} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="E.g. Mid-Season Festive Sale"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Discount Badge Text
                  </label>
                  <input
                    type="text"
                    value={promoDiscountText}
                    onChange={(e) => setPromoDiscountText(e.target.value)}
                    placeholder="E.g. Flat 20% OFF"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={promoSubtitle}
                    onChange={(e) => setPromoSubtitle(e.target.value)}
                    placeholder="On Selected Collections"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Background/Side Image URL
                </label>
                <input
                  type="url"
                  value={promoImageUrl}
                  onChange={(e) => setPromoImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={promoButtonText}
                    onChange={(e) => setPromoButtonText(e.target.value)}
                    placeholder="SHOP NOW"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={promoButtonLink}
                    onChange={(e) => setPromoButtonLink(e.target.value)}
                    placeholder="/products"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="promo-active"
                  checked={promoIsActive}
                  onChange={(e) => setPromoIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink h-4 w-4"
                />
                <label htmlFor="promo-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Activate banner on storefront
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark"
                >
                  {editingPromoBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
