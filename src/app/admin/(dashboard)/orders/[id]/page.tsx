'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { DEMO_ORDERS } from '@/lib/admin-demo-data';
import { formatPrice, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';
import type { OrderStatus, PaymentStatus } from '@/types';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const initialOrder = useMemo(() => {
    return DEMO_ORDERS.find((o) => o.id === id || o.order_number === id) || DEMO_ORDERS[0];
  }, [id]);

  const [order, setOrder] = useState(initialOrder);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.order_status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.payment_status);
  const [internalNote, setInternalNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setOrder((prev) => ({
      ...prev,
      order_status: orderStatus,
      payment_status: paymentStatus,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-border-subtle hover:bg-brand-soft-pink/20 transition-colors"
          >
            <ArrowLeft size={18} className="text-brand-charcoal" />
          </Link>
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Order Details</span>
            <h1 className="text-2xl font-display font-bold text-brand-charcoal">
              Order #{order.order_number}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Printer size={15} /> Print Invoice
          </button>
          <button
            onClick={handleSave}
            className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 shadow-sm"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle size={16} /> Order updated successfully!
        </div>
      )}

      {/* Main Order Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items and Status Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Controls Card */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle no-print">
            <h3 className="font-semibold text-brand-charcoal text-sm mb-4 border-b border-border-subtle pb-3">
              Order Status & Payment Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                  className="input-field text-xs bg-white font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled (Restore Stock)</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Verification Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="input-field text-xs bg-white font-medium"
                >
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Verified (Payment Received)</option>
                  <option value="rejected">Rejected (Invalid TrxID)</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {order.transaction_id && (
              <div className="mt-4 p-3 bg-brand-ivory rounded-xl border border-brand-soft-pink flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">MFS Transaction ID: </span>
                  <strong className="font-mono text-brand-pink text-sm">{order.transaction_id}</strong>
                  {order.sender_phone && (
                    <span className="text-gray-500 block text-[11px]">Sender: {order.sender_phone}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentStatus('verified')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-[11px] font-semibold hover:bg-green-700"
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => setPaymentStatus('rejected')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-[11px] font-semibold hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Line Items Card */}
          <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h3 className="font-semibold text-brand-charcoal text-base">
                Order Items ({order.items?.length || 1})
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {order.items?.map((it) => (
                <div key={it.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-none">
                  <div className="w-16 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-border-subtle">
                    <img
                      src={it.image_url || 'https://via.placeholder.com/80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-brand-charcoal truncate">{it.product_name}</h4>
                    <span className="text-[11px] text-gray-400 font-mono block">SKU: {it.product_sku}</span>
                    {it.variation_attributes && (
                      <p className="text-xs text-brand-pink font-medium mt-1">
                        {Object.entries(it.variation_attributes).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">
                      {it.quantity} × {formatPrice(it.unit_price)}
                    </span>
                    <strong className="text-sm font-bold text-brand-charcoal">{formatPrice(it.total)}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="bg-gray-50 p-6 border-t border-border-subtle flex justify-end">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold">{formatPrice(order.delivery_fee)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-brand-charcoal pt-2 border-t border-border-subtle">
                  <span>Grand Total:</span>
                  <span className="text-brand-pink text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Timeline (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Details Card */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle space-y-4">
            <h3 className="font-semibold text-brand-charcoal text-base border-b border-border-subtle pb-3">
              Customer Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <strong className="text-sm text-brand-charcoal">{order.customer_name}</strong>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} className="text-brand-pink flex-shrink-0" />
                <a href={`tel:${order.customer_phone}`} className="hover:underline font-mono">
                  {order.customer_phone}
                </a>
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-brand-pink flex-shrink-0" />
                  <span>{order.customer_email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600 pt-2 border-t border-border-subtle">
                <MapPin size={16} className="text-brand-pink flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-brand-charcoal">Delivery Address:</span>
                  <p className="mt-0.5 leading-relaxed">{order.address}</p>
                  <p className="mt-0.5 font-medium">{order.district}, {order.division}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Admin Note */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-border-subtle space-y-3 no-print">
            <h3 className="font-semibold text-brand-charcoal text-sm">Internal Staff Note</h3>
            <textarea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Private note for warehouse packing or delivery agent..."
              className="input-field text-xs resize-none"
            />
            <button
              onClick={() => {
                alert('Note saved to order history');
                setInternalNote('');
              }}
              className="btn-secondary text-xs w-full py-1.5"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
