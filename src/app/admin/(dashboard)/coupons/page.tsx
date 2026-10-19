'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Tag, Calendar, Users, Copy, CheckCircle } from 'lucide-react';
import { DEMO_COUPONS } from '@/lib/admin-demo-data';
import type { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(DEMO_COUPONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>(1000);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>(500);
  const [usageLimit, setUsageLimit] = useState<number | ''>(100);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openNewModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderAmount(1500);
    setMaxDiscountAmount(1000);
    setUsageLimit(200);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setDiscountType(coupon.discount_type);
    setDiscountValue(coupon.discount_value);
    setMinOrderAmount(coupon.min_order_amount ?? '');
    setMaxDiscountAmount(coupon.max_discount_amount ?? '');
    setUsageLimit(coupon.usage_limit ?? '');
    setStartDate(coupon.start_date || '');
    setEndDate(coupon.end_date || '');
    setIsActive(coupon.is_active);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: code.trim().toUpperCase(),
                description,
                discount_type: discountType,
                discount_value: Number(discountValue),
                min_order_amount: minOrderAmount === '' ? null : Number(minOrderAmount),
                max_discount_amount: maxDiscountAmount === '' ? null : Number(maxDiscountAmount),
                usage_limit: usageLimit === '' ? null : Number(usageLimit),
                start_date: startDate || null,
                end_date: endDate || null,
                is_active: isActive,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      const newCoupon: Coupon = {
        id: `coup-${Date.now()}`,
        code: code.trim().toUpperCase(),
        description,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: minOrderAmount === '' ? null : Number(minOrderAmount),
        max_discount_amount: maxDiscountAmount === '' ? null : Number(maxDiscountAmount),
        usage_limit: usageLimit === '' ? null : Number(usageLimit),
        used_count: 0,
        start_date: startDate || null,
        end_date: endDate || null,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCoupons((prev) => [newCoupon, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promotional coupon?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? coupon.is_active
        : !coupon.is_active;
    return matchesSearch && matchesStatus;
  });

  const totalUsed = coupons.reduce((sum, c) => sum + c.used_count, 0);
  const activeCount = coupons.filter((c) => c.is_active).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Coupons & Discounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage promotional coupon codes, discounts, and customer incentives
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Coupons</span>
            <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-brand-pink">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{coupons.length}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Active Coupons</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">{activeCount}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Redemptions</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{totalUsed}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Max Discount Active</span>
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-brand-gold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">25% OFF</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-brand-border/60 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-brand-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({coupons.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-brand-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-brand-pink text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Inactive ({coupons.length - activeCount})
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-medium text-gray-500">
              <tr>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min Spend</th>
                <th className="px-6 py-4">Usage / Limit</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-brand-ivory/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded border border-gray-200 tracking-wide text-xs">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-gray-400 hover:text-brand-pink transition-colors p-1"
                        title="Copy coupon code"
                      >
                        {copiedCode === coupon.code ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {coupon.description && (
                      <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {coupon.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {coupon.discount_type === 'percentage' ? (
                      <span className="text-brand-pink">{coupon.discount_value}% OFF</span>
                    ) : (
                      <span className="text-brand-pink">৳{coupon.discount_value} FLAT</span>
                    )}
                    {coupon.max_discount_amount && (
                      <div className="text-xs font-normal text-gray-400">
                        Up to ৳{coupon.max_discount_amount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {coupon.min_order_amount ? `৳${coupon.min_order_amount}` : 'No minimum'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-800">
                      {coupon.used_count} / {coupon.usage_limit ? coupon.usage_limit : '∞'}
                    </div>
                    {coupon.usage_limit && (
                      <div className="w-24 bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-brand-pink h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (coupon.used_count / coupon.usage_limit) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div>From: {coupon.start_date || 'Anytime'}</div>
                    <div>To: {coupon.end_date || 'No Expiry'}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleActive(coupon.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        coupon.is_active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          coupon.is_active ? 'bg-emerald-600' : 'bg-gray-400'
                        }`}
                      />
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded transition-colors"
                        title="Edit coupon"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No coupons found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-brand-border/80">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="E.g. EID2026"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink bg-white"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (৳ FLAT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. Special Eid 15% discount for all sarees"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    {discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (৳) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'percentage' ? 100 : 50000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Min Order Amount (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Max Discount Cap (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Leave empty for unlimited"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Usage Limit (Times)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Unlimited if empty"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    End Date (Expiry)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="coupon-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink h-4 w-4"
                />
                <label htmlFor="coupon-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Activate this coupon immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink text-white rounded-lg text-sm font-medium hover:bg-brand-pink-dark transition-colors"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
