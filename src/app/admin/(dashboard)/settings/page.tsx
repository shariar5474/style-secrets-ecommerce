'use client';

import React, { useState, useEffect } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Clock, Globe, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // General Settings
  const [storeName, setStoreName] = useState('Style Secrets');
  const [tagline, setTagline] = useState('Elegance in Every You — Premier Ladies Clothing');
  const [logoUrl, setLogoUrl] = useState('/images/logo.jpg');
  const [contactPhone, setContactPhone] = useState('+8801700000000');
  const [whatsappNumber, setWhatsappNumber] = useState('+8801700000000');
  const [contactEmail, setContactEmail] = useState('support@stylesecrets.com');
  const [storeAddress, setStoreAddress] = useState('House #14, Road #7, Dhanmondi, Dhaka 1205, Bangladesh');
  const [businessHours, setBusinessHours] = useState('Sat - Thu: 10:00 AM - 9:00 PM, Friday: 3:00 PM - 9:00 PM');

  // Shipping & Delivery
  const [insideDhakaFee, setInsideDhakaFee] = useState(60);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(120);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);

  // Social Media Links
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/stylesecretsbd');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/stylesecretsbd');
  const [tiktokUrl, setTiktokUrl] = useState('https://tiktok.com/@stylesecrets');
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com/@stylesecretsbd');

  // Trust Bar Settings
  const [trustDeliveryTitle, setTrustDeliveryTitle] = useState('Free Delivery');
  const [trustDeliveryDesc, setTrustDeliveryDesc] = useState('On orders over ৳1500 across Bangladesh');
  const [trustPaymentTitle, setTrustPaymentTitle] = useState('Secure Payment');
  const [trustPaymentDesc, setTrustPaymentDesc] = useState('100% verified Cash on Delivery & bKash');
  const [trustReturnTitle, setTrustReturnTitle] = useState('Easy 7-Day Returns');
  const [trustReturnDesc, setTrustReturnDesc] = useState('Hassle-free exchange policy on unworn items');
  const [trustSupportTitle, setTrustSupportTitle] = useState('Dedicated Support');
  const [trustSupportDesc, setTrustSupportDesc] = useState('Friendly assistance via WhatsApp & phone');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.general) {
          const g = json.general;
          if (g.storeName) setStoreName(g.storeName);
          if (g.tagline) setTagline(g.tagline);
          if (g.logoUrl) setLogoUrl(g.logoUrl);
          if (g.contactPhone) setContactPhone(g.contactPhone);
          if (g.whatsappNumber) setWhatsappNumber(g.whatsappNumber);
          if (g.contactEmail) setContactEmail(g.contactEmail);
          if (g.storeAddress) setStoreAddress(g.storeAddress);
          if (g.businessHours) setBusinessHours(g.businessHours);
          if (g.insideDhakaFee !== undefined) setInsideDhakaFee(g.insideDhakaFee);
          if (g.outsideDhakaFee !== undefined) setOutsideDhakaFee(g.outsideDhakaFee);
          if (g.freeShippingThreshold !== undefined) setFreeShippingThreshold(g.freeShippingThreshold);
          if (g.facebookUrl) setFacebookUrl(g.facebookUrl);
          if (g.instagramUrl) setInstagramUrl(g.instagramUrl);
          if (g.tiktokUrl) setTiktokUrl(g.tiktokUrl);
          if (g.youtubeUrl) setYoutubeUrl(g.youtubeUrl);
          if (g.trustDeliveryTitle) setTrustDeliveryTitle(g.trustDeliveryTitle);
          if (g.trustDeliveryDesc) setTrustDeliveryDesc(g.trustDeliveryDesc);
          if (g.trustPaymentTitle) setTrustPaymentTitle(g.trustPaymentTitle);
          if (g.trustPaymentDesc) setTrustPaymentDesc(g.trustPaymentDesc);
          if (g.trustReturnTitle) setTrustReturnTitle(g.trustReturnTitle);
          if (g.trustReturnDesc) setTrustReturnDesc(g.trustReturnDesc);
          if (g.trustSupportTitle) setTrustSupportTitle(g.trustSupportTitle);
          if (g.trustSupportDesc) setTrustSupportDesc(g.trustSupportDesc);
        }
      } catch (err) {
        console.error('Failed to load store settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          general: {
            storeName,
            tagline,
            logoUrl,
            contactPhone,
            whatsappNumber,
            contactEmail,
            storeAddress,
            businessHours,
            insideDhakaFee,
            outsideDhakaFee,
            freeShippingThreshold,
            facebookUrl,
            instagramUrl,
            tiktokUrl,
            youtubeUrl,
            trustDeliveryTitle,
            trustDeliveryDesc,
            trustPaymentTitle,
            trustPaymentDesc,
            trustReturnTitle,
            trustReturnDesc,
            trustSupportTitle,
            trustSupportDesc,
          },
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Store Settings & Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure brand identity, Bangladesh delivery charges, social handles, and policies
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-sm font-medium">
            Settings updated successfully! Changes reflect across storefront immediately.
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Store Identity */}
        <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Building2 className="w-5 h-5 text-brand-pink" />
            <h2 className="text-base font-serif font-bold text-gray-900">Brand & Store Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Header Logo URL / Path
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
                <div className="w-16 h-10 border border-gray-200 rounded bg-brand-ivory flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Store logo" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Phone className="w-5 h-5 text-brand-pink" />
            <h2 className="text-base font-serif font-bold text-gray-900">Customer Support & Contact Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                WhatsApp Order Line
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Display Outlet / Office Address
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Business & Working Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Charges */}
        <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Truck className="w-5 h-5 text-brand-pink" />
            <h2 className="text-base font-serif font-bold text-gray-900">Bangladesh Delivery Fees</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Inside Dhaka City (৳)
              </label>
              <input
                type="number"
                min={0}
                value={insideDhakaFee}
                onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
              <span className="text-xs text-gray-400 mt-1 block">Default standard fee: ৳60</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Outside Dhaka / Sub-Districts (৳)
              </label>
              <input
                type="number"
                min={0}
                value={outsideDhakaFee}
                onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
              <span className="text-xs text-gray-400 mt-1 block">National courier fee: ৳120</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Free Delivery Above (৳)
              </label>
              <input
                type="number"
                min={0}
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
              <span className="text-xs text-gray-400 mt-1 block">Orders reaching this amount get free delivery</span>
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Globe className="w-5 h-5 text-brand-pink" />
            <h2 className="text-base font-serif font-bold text-gray-900">Social Media Channels</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                TikTok Handle URL
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
              />
            </div>
          </div>
        </div>

        {/* Trust & Service Bar Customization */}
        <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <ShieldCheck className="w-5 h-5 text-brand-pink" />
            <h2 className="text-base font-serif font-bold text-gray-900">Storefront Trust Badges Content</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="p-3 bg-brand-ivory/50 rounded-lg border border-brand-border/40 space-y-2">
              <label className="text-xs font-bold text-gray-800">Badge 1: Delivery Policy</label>
              <input
                type="text"
                value={trustDeliveryTitle}
                onChange={(e) => setTrustDeliveryTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={trustDeliveryDesc}
                onChange={(e) => setTrustDeliveryDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-600"
              />
            </div>

            <div className="p-3 bg-brand-ivory/50 rounded-lg border border-brand-border/40 space-y-2">
              <label className="text-xs font-bold text-gray-800">Badge 2: Payment Security</label>
              <input
                type="text"
                value={trustPaymentTitle}
                onChange={(e) => setTrustPaymentTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={trustPaymentDesc}
                onChange={(e) => setTrustPaymentDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-600"
              />
            </div>

            <div className="p-3 bg-brand-ivory/50 rounded-lg border border-brand-border/40 space-y-2">
              <label className="text-xs font-bold text-gray-800">Badge 3: Return Policy</label>
              <input
                type="text"
                value={trustReturnTitle}
                onChange={(e) => setTrustReturnTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={trustReturnDesc}
                onChange={(e) => setTrustReturnDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-600"
              />
            </div>

            <div className="p-3 bg-brand-ivory/50 rounded-lg border border-brand-border/40 space-y-2">
              <label className="text-xs font-bold text-gray-800">Badge 4: Support Policy</label>
              <input
                type="text"
                value={trustSupportTitle}
                onChange={(e) => setTrustSupportTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={trustSupportDesc}
                onChange={(e) => setTrustSupportDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs bg-white text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
