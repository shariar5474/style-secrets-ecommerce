'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  Download,
  Calendar,
  Package,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { DEMO_PRODUCTS, DEMO_MONTHLY_SALES_DATA } from '@/lib/admin-demo-data';

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'this_month' | 'this_year'>('this_month');

  // Top products calculation from demo data
  const topProducts = [
    {
      id: 'prod-101',
      name: 'Premium Georgette Three Piece with Heavy Zari Work',
      category: 'Salwar Kameez',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
      unitsSold: 84,
      revenue: 294000,
      stock: 45,
    },
    {
      id: 'prod-103',
      name: 'Royal Dhakai Jamdani Handloom Festive Saree',
      category: 'Sarees',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80',
      unitsSold: 62,
      revenue: 403000,
      stock: 18,
    },
    {
      id: 'prod-102',
      name: 'Designer Embroidered Cotton Kurti with Palazzo',
      category: 'Kurtis & Tunics',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80',
      unitsSold: 58,
      revenue: 107300,
      stock: 28,
    },
    {
      id: 'prod-104',
      name: 'Imported Dubai Nidha Luxury Butterfly Abaya',
      category: 'Abayas & Hijabs',
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=200&q=80',
      unitsSold: 46,
      revenue: 174800,
      stock: 35,
    },
    {
      id: 'prod-105',
      name: 'Floral Chiffon Summer Casual Coordinate Set',
      category: 'Western Wear',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80',
      unitsSold: 39,
      revenue: 76050,
      stock: 12,
    },
  ];

  const maxMonthlySales = Math.max(...DEMO_MONTHLY_SALES_DATA.map((d) => d.amount));

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Revenue,Orders\n' +
      DEMO_MONTHLY_SALES_DATA.map((e) => `${e.month},${e.amount},${e.orders}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `style_secrets_sales_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Analytics & Sales Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track business growth, gross revenue, product performance, and customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-brand-pink"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="this_month">This Month (February)</option>
              <option value="this_year">This Fiscal Year (2026)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span>Gross Sales</span>
            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-brand-pink">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">৳1,055,150</div>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">664</div>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+12.1% completed orders</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-brand-gold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">৳1,589</div>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+5.6% basket size</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-border/60 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <span>Registered Customers</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">1,250</div>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>68% repeat purchase rate</span>
          </div>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-serif font-bold text-gray-900">Monthly Revenue Growth (BDT)</h2>
            <p className="text-xs text-gray-500 mt-0.5">Showing performance across the past 6 billing cycles</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-pink" />
              <span className="text-gray-600">Revenue (৳)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-gold" />
              <span className="text-gray-600">Orders Count</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 flex items-end gap-6 sm:gap-12 pt-8 pb-4 border-b border-gray-100 px-4">
          {DEMO_MONTHLY_SALES_DATA.map((item) => {
            const heightPercent = Math.round((item.amount / maxMonthlySales) * 100);
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-brand-pink bg-pink-50 px-2 py-0.5 rounded shadow-sm">
                  ৳{(item.amount / 1000).toFixed(0)}k
                </div>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-brand-pink-dark to-brand-pink rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white opacity-80">
                    {item.orders}
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500 mt-1">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Top Products & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-pink" />
              <h2 className="text-base font-serif font-bold text-gray-900">Top Performing Outfits</h2>
            </div>
            <span className="text-xs text-gray-400">By sales volume</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-400 border-b border-gray-100 pb-2">
                <tr>
                  <th className="py-2.5">Item</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-center">Units Sold</th>
                  <th className="py-2.5 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-brand-ivory/30">
                    <td className="py-3 pr-3 flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-medium text-gray-900 text-xs line-clamp-1 max-w-[200px]">
                        {p.name}
                      </div>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{p.category}</td>
                    <td className="py-3 text-xs font-semibold text-gray-900 text-center">{p.unitsSold} pcs</td>
                    <td className="py-3 text-xs font-bold text-brand-pink text-right">৳{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown: Payment Methods & Geography */}
        <div className="space-y-6">
          {/* Payment Method Distribution */}
          <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-brand-pink" />
              <h2 className="text-base font-serif font-bold text-gray-900">Payment Breakdown</h2>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-700">Cash on Delivery (COD)</span>
                  <span className="text-gray-900 font-bold">58% (৳612,000)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-brand-pink h-full rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-700">bKash Merchant Pay</span>
                  <span className="text-gray-900 font-bold">28% (৳295,400)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-pink-400 h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-700">Nagad Mobile Wallet</span>
                  <span className="text-gray-900 font-bold">11% (৳116,000)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '11%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-700">Rocket Pay</span>
                  <span className="text-gray-900 font-bold">3% (৳31,750)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: '3%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Regional Sales */}
          <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm p-6">
            <h2 className="text-base font-serif font-bold text-gray-900 mb-3">Delivery Geography</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-600">Dhaka Metropolitan Area</span>
                <span className="font-bold text-gray-900">62% of Orders</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-600">Chittagong Division</span>
                <span className="font-bold text-gray-900">18% of Orders</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-600">Sylhet Division</span>
                <span className="font-bold text-gray-900">9% of Orders</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-600">Other Divisions (Rajshahi, Khulna...)</span>
                <span className="font-bold text-gray-900">11% of Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
