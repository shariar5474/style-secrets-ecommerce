'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react';
import { DEMO_ORDERS } from '@/lib/data/sampleData';
import { formatPrice, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';

export default function CustomerOrdersPage() {
  return (
    <div className="bg-brand-ivory min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/account" className="hover:text-brand-pink transition-colors">My Account</Link>
          <ChevronRight size={12} />
          <span className="text-brand-charcoal font-medium">My Orders</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-charcoal">
              Order History
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track your shipments, review past orders, and view official invoices.
            </p>
          </div>
          <Link href="/account" className="flex items-center gap-1 text-xs text-brand-pink font-semibold hover:underline">
            <ArrowLeft size={14} /> Back to Account
          </Link>
        </div>

        {DEMO_ORDERS.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border-subtle shadow-card">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-brand-charcoal">No orders yet</h3>
            <p className="text-xs text-gray-500 mt-1">Start shopping to view your orders here.</p>
            <Link href="/" className="btn-primary text-xs mt-4 inline-block">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {DEMO_ORDERS.map((ord) => (
              <div key={ord.id} className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Order Number</span>
                      <strong className="text-sm font-mono text-brand-pink">{ord.order_number}</strong>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Date Placed</span>
                      <span className="text-xs text-brand-charcoal">
                        {new Date(ord.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getOrderStatusColor(ord.order_status)}`}>
                      Status: {ord.order_status}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${getPaymentStatusColor(ord.payment_status)}`}>
                      Payment: {ord.payment_status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-6 space-y-4">
                  {ord.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/100'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-brand-charcoal truncate">{item.product_name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">SKU: {item.product_sku}</p>
                        {item.variation_attributes && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {Object.entries(item.variation_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                        <p className="text-xs text-brand-charcoal font-medium mt-1">
                          Qty: {item.quantity} × {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-brand-pink">{formatPrice(item.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="bg-brand-ivory/60 px-4 sm:px-6 py-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Shipping to: </span>
                    <strong className="text-brand-charcoal">{ord.address}</strong>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-500">Total Paid: </span>
                      <strong className="text-sm text-brand-pink font-bold">{formatPrice(ord.total)}</strong>
                    </div>
                    <Link
                      href={`/account/orders/${ord.id}`}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      Invoice Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
