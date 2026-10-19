'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer, CheckCircle, Clock, Truck, Package, ShieldCheck } from 'lucide-react';
import { DEMO_ORDERS } from '@/lib/data/sampleData';
import { formatPrice, getOrderStatusColor } from '@/lib/utils';

export default function OrderInvoicePage() {
  const params = useParams();
  const id = params?.id as string;

  const order = useMemo(() => {
    return DEMO_ORDERS.find((o) => o.id === id || o.order_number === id) || DEMO_ORDERS[0];
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { title: 'Placed', desc: 'Order received', done: true },
    { title: 'Confirmed', desc: 'Payment checked', done: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.order_status) },
    { title: 'Processing', desc: 'Packed & labeled', done: ['processing', 'shipped', 'delivered'].includes(order.order_status) },
    { title: 'Shipped', desc: 'With courier', done: ['shipped', 'delivered'].includes(order.order_status) },
    { title: 'Delivered', desc: 'Received at door', done: order.order_status === 'delivered' },
  ];

  return (
    <div className="bg-brand-ivory min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link href="/account/orders" className="flex items-center gap-1.5 text-xs text-brand-pink font-semibold hover:underline">
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <button
            onClick={handlePrint}
            className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <Printer size={14} /> Print Invoice
          </button>
        </div>

        {/* Invoice Container */}
        <div className="bg-white rounded-2xl shadow-card border border-border-subtle p-8 md:p-12 print:shadow-none print:border-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle pb-6 gap-4">
            <div>
              <span className="text-xl font-display font-bold text-brand-pink block">Style Secrets</span>
              <p className="text-xs text-gray-500">Premium Ladies Clothing Online Shop</p>
              <p className="text-xs text-gray-400 mt-1">Chittagong, Bangladesh • support@stylesecrets.com</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-wider text-gray-400 block font-semibold">Official Invoice</span>
              <strong className="text-lg font-mono text-brand-charcoal block">{order.order_number}</strong>
              <span className="text-xs text-gray-500">
                Date: {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="py-8 border-b border-border-subtle no-print">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">Delivery Progress</h3>
            <div className="grid grid-cols-5 gap-2">
              {steps.map((s, idx) => (
                <div key={idx} className="text-center relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold transition-all ${
                    s.done ? 'bg-brand-pink text-white shadow-sm' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {s.done ? <CheckCircle size={14} /> : idx + 1}
                  </div>
                  <strong className={`block text-xs ${s.done ? 'text-brand-charcoal' : 'text-gray-400'}`}>
                    {s.title}
                  </strong>
                  <span className="text-[10px] text-gray-400 hidden sm:block">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-border-subtle text-xs">
            <div>
              <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] mb-2 text-gray-400">
                Invoiced To:
              </h4>
              <strong className="block text-sm text-brand-charcoal">{order.customer_name}</strong>
              <p className="text-gray-600 mt-1">{order.address}</p>
              <p className="text-gray-600 mt-0.5">Phone: {order.customer_phone}</p>
              {order.customer_email && <p className="text-gray-600">Email: {order.customer_email}</p>}
            </div>

            <div className="sm:text-right">
              <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] mb-2 text-gray-400">
                Payment Info:
              </h4>
              <p className="text-gray-600">
                Method: <strong className="uppercase text-brand-charcoal">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</strong>
              </p>
              <p className="text-gray-600 mt-0.5">
                Payment Status:{' '}
                <span className="font-semibold capitalize text-brand-pink">{order.payment_status}</span>
              </p>
              {order.transaction_id && (
                <p className="text-gray-600 font-mono mt-0.5">TrxID: {order.transaction_id}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6 border-b border-border-subtle">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-subtle text-gray-400 uppercase tracking-wider text-[11px]">
                  <th className="text-left pb-3 font-semibold">Item & Description</th>
                  <th className="text-center pb-3 font-semibold">Qty</th>
                  <th className="text-right pb-3 font-semibold">Unit Price</th>
                  <th className="text-right pb-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items?.map((it) => (
                  <tr key={it.id}>
                    <td className="py-3">
                      <strong className="block text-brand-charcoal">{it.product_name}</strong>
                      <span className="text-gray-400 text-[11px]">SKU: {it.product_sku}</span>
                      {it.variation_attributes && (
                        <span className="text-gray-500 text-[11px] block">
                          {Object.entries(it.variation_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center text-brand-charcoal font-medium">{it.quantity}</td>
                    <td className="py-3 text-right text-gray-600">{formatPrice(it.unit_price)}</td>
                    <td className="py-3 text-right font-semibold text-brand-charcoal">{formatPrice(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="py-6 flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium text-brand-charcoal">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge:</span>
                <span className="font-medium text-brand-charcoal">
                  {order.delivery_fee === 0 ? 'FREE' : formatPrice(order.delivery_fee)}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-brand-charcoal pt-2 border-t border-border-subtle">
                <span>Total:</span>
                <span className="text-base text-brand-pink">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center pt-6 border-t border-border-subtle text-[11px] text-gray-400">
            Thank you for shopping with Style Secrets! For any queries regarding this order, please contact 01XXX-XXXXXX.
          </div>
        </div>
      </div>
    </div>
  );
}
