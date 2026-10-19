'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight, Plus, Edit2, Trash2, CheckCircle2, Home, Briefcase } from 'lucide-react';
import { DIVISIONS, DISTRICTS } from '@/types';

interface Address {
  id: string;
  title: string;
  recipient_name: string;
  phone: string;
  division: string;
  district: string;
  address_line: string;
  is_default: boolean;
  type: 'home' | 'office' | 'other';
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    title: 'Home Address',
    recipient_name: 'Tamanna Islam',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Dhaka',
    address_line: 'House 42, Road 11, Block D, Banani, Dhaka 1213',
    is_default: true,
    type: 'home',
  },
  {
    id: 'addr-2',
    title: 'Work / Studio',
    recipient_name: 'Tamanna Islam',
    phone: '01812345678',
    division: 'Dhaka',
    district: 'Dhaka',
    address_line: 'Level 5, Plot 18, Gulshan Avenue, Dhaka 1212',
    is_default: false,
    type: 'office',
  },
];

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [addressLine, setAddressLine] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [type, setType] = useState<'home' | 'office' | 'other'>('home');

  const availableDistricts = DISTRICTS[division] || [division];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const firstDistrict = (DISTRICTS[newDiv] && DISTRICTS[newDiv][0]) || newDiv;
    setDistrict(firstDistrict);
  };

  const openNewModal = () => {
    setEditingId(null);
    setTitle('Home Address');
    setRecipientName('Tamanna Islam');
    setPhone('01712345678');
    setDivision('Dhaka');
    setDistrict('Dhaka');
    setAddressLine('');
    setIsDefault(addresses.length === 0);
    setType('home');
    setModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setTitle(addr.title);
    setRecipientName(addr.recipient_name);
    setPhone(addr.phone);
    setDivision(addr.division);
    setDistrict(addr.district);
    setAddressLine(addr.address_line);
    setIsDefault(addr.is_default);
    setType(addr.type);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingId) {
            return {
              ...a,
              title,
              recipient_name: recipientName,
              phone,
              division,
              district,
              address_line: addressLine,
              is_default: isDefault,
              type,
            };
          }
          return isDefault ? { ...a, is_default: false } : a;
        })
      );
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        title,
        recipient_name: recipientName,
        phone,
        division,
        district,
        address_line: addressLine,
        is_default: isDefault || addresses.length === 0,
        type,
      };
      setAddresses((prev) => [
        ...(isDefault ? prev.map((a) => ({ ...a, is_default: false })) : prev),
        newAddress,
      ]);
    }
    setModalOpen(false);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this delivery address?')) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/account" className="hover:text-brand-pink transition-colors">My Account</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal font-medium">Saved Addresses</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-brand-soft-pink/40 flex items-center justify-center text-brand-pink font-bold text-xl">
                  T
                </div>
                <div>
                  <h3 className="font-semibold text-brand-charcoal text-base">Tamanna Islam</h3>
                  <p className="text-xs text-gray-400">tamanna@example.com</p>
                  <p className="text-[11px] text-brand-pink font-medium mt-0.5">Verified Bangladesh Customer</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-brand-soft-pink/20 hover:text-brand-pink transition-colors"
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
                  <ChevronRight size={14} />
                </Link>

                <Link
                  href="/account/wishlist"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-brand-soft-pink/20 hover:text-brand-pink transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart size={16} />
                    <span>My Wishlist</span>
                  </div>
                  <ChevronRight size={14} />
                </Link>

                <Link
                  href="/account/addresses"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-brand-pink text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} />
                    <span>Saved Addresses</span>
                  </div>
                  <ChevronRight size={14} />
                </Link>

                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors pt-3"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Right: Saved Addresses List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-subtle">
                <div>
                  <h1 className="text-xl font-serif font-bold text-brand-charcoal">Delivery Addresses</h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage your shipping locations across Bangladesh for quick checkout
                  </p>
                </div>
                <button
                  onClick={openNewModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink text-white rounded-lg text-xs font-semibold hover:bg-brand-pink-dark transition-colors shadow-sm"
                >
                  <Plus size={14} />
                  Add New Address
                </button>
              </div>

              {/* Address Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-xl p-5 border relative transition-all ${
                      addr.is_default
                        ? 'border-brand-pink bg-pink-50/20 shadow-sm'
                        : 'border-border-subtle hover:border-brand-pink/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {addr.type === 'home' && <Home size={15} className="text-brand-pink" />}
                        {addr.type === 'office' && <Briefcase size={15} className="text-brand-gold" />}
                        <span className="font-semibold text-sm text-brand-charcoal">{addr.title}</span>
                      </div>
                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-pink bg-pink-100/70 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} /> Default
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 mt-3">
                      <p className="font-medium text-gray-900">{addr.recipient_name}</p>
                      <p>{addr.phone}</p>
                      <p className="line-clamp-2 leading-relaxed text-gray-700">{addr.address_line}</p>
                      <p className="text-gray-400 font-medium">
                        {addr.district}, {addr.division}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-xs">
                      {!addr.is_default ? (
                        <button
                          onClick={() => setDefault(addr.id)}
                          className="text-brand-pink hover:underline font-medium"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-gray-400">Primary delivery</span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(addr)}
                          className="p-1.5 text-gray-500 hover:text-brand-pink rounded hover:bg-pink-50 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        {addresses.length > 1 && (
                          <button
                            onClick={() => handleDelete(addr.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-border-subtle">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal mb-4 pb-3 border-b border-gray-100">
              {editingId ? 'Edit Address' : 'Add New Shipping Address'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Address Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Home, Office, Parents..."
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-white focus:outline-none focus:border-brand-pink"
                  >
                    <option value="home">Home</option>
                    <option value="office">Office / Workplace</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-white focus:outline-none focus:border-brand-pink"
                  >
                    {DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-white focus:outline-none focus:border-brand-pink"
                  >
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Street Address, House & Road details *
                </label>
                <textarea
                  rows={2}
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="House #, Flat #, Road #, Area name, Landmark..."
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addr-default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink h-4 w-4"
                />
                <label htmlFor="addr-default" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink text-white rounded-lg text-xs font-semibold hover:bg-brand-pink-dark shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
