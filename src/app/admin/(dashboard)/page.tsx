'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
} from 'lucide-react';
import { DEMO_STATS, DEMO_ORDERS, DEMO_PRODUCTS } from '@/lib/admin-demo-data';
import { formatPrice, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('This Month');

  // Sales chart sample data (12 bars representing months/weeks)
  const salesData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 65 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 80 },
    { label: 'May', value: 70 },
    { label: 'Jun', value: 95 },
    { label: 'Jul', value: 60 },
    { label: 'Aug', value: 85 },
    { label: 'Sep', value: 110 },
    { label: 'Oct', value: 128 },
    { label: 'Nov', value: 90 },
    { label: 'Dec', value: 115 },
  ];

  const recentOrders = DEMO_ORDERS.slice(0, 5);
  const lowStockItems = DEMO_PRODUCTS.filter((p) => p.total_stock <= 15).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Overview</span>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
            Style Secrets Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics, order activities, and catalog health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <ShoppingBag size={16} /> All Orders
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Matching Mockup 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-brand-pink">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold text-brand-charcoal">{DEMO_STATS.total_orders}</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">{DEMO_STATS.pending_orders} pending fulfillment</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Products</span>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-brand-gold">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold text-brand-charcoal">{DEMO_STATS.total_products}</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +8%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Active across 8 categories</p>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold text-brand-charcoal">{DEMO_STATS.registered_customers.toLocaleString()}</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +15%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Registered shopper accounts</p>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-brand-dark-pink">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold text-brand-pink">{formatPrice(DEMO_STATS.total_sales)}</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +20%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Verified revenue from delivered orders</p>
        </div>
      </div>

      {/* Grid: Sales Chart & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-card border border-border-subtle">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
            <div>
              <h2 className="font-semibold text-brand-charcoal text-base">Sales Overview</h2>
              <p className="text-xs text-gray-400">Monthly revenue trends in Bangladesh Taka</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs border border-border-subtle rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-pink"
              >
                <option value="This Month">This Year (Monthly)</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Week">This Week</option>
              </select>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-2 pt-8 px-2">
            {salesData.map((d) => {
              const maxVal = 140;
              const heightPercent = Math.round((d.value / maxVal) * 100);
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    ৳{d.value}k
                  </span>
                  <div className="w-full max-w-[28px] bg-brand-soft-pink/40 rounded-t-lg group-hover:bg-brand-pink transition-all duration-300 relative overflow-hidden" style={{ height: `${heightPercent}%` }}>
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-brand-pink to-brand-soft-pink opacity-80" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-card border border-border-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <h2 className="font-semibold text-brand-charcoal text-base">Low Stock Alerts</h2>
              </div>
              <span className="badge-sale text-[10px]">{DEMO_STATS.low_stock_products} Low</span>
            </div>

            <div className="space-y-3">
              {lowStockItems.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.featured_image_url || 'https://via.placeholder.com/50'}
                      alt=""
                      className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-brand-charcoal truncate">{p.name}</h4>
                      <span className="text-[10px] text-gray-400">SKU: {p.sku}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md flex-shrink-0">
                    {p.total_stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/inventory"
            className="mt-4 pt-4 border-t border-border-subtle text-xs text-brand-pink font-semibold hover:underline flex items-center justify-between"
          >
            <span>Manage Inventory & Restock</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Orders Table Matching Mockup 5 */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-brand-charcoal text-base">Recent Orders</h2>
            <p className="text-xs text-gray-400">Latest customer orders across Bangladesh</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-pink hover:underline flex items-center gap-1">
            View All Orders <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3.5 font-semibold"># Order</th>
                <th className="px-6 py-3.5 font-semibold">Customer</th>
                <th className="px-6 py-3.5 font-semibold">Total</th>
                <th className="px-6 py-3.5 font-semibold">Payment</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-brand-ivory/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-brand-pink">
                    {ord.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <strong className="block text-brand-charcoal font-semibold">{ord.customer_name}</strong>
                    <span className="text-gray-400 text-[11px]">{ord.customer_phone}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-charcoal">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="uppercase text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {ord.payment_method === 'cod' ? 'COD' : ord.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${getOrderStatusColor(ord.order_status)}`}>
                      {ord.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-soft-pink/20 transition-colors inline-block"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
