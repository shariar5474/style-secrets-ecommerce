'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  FileText,
} from 'lucide-react';
import { DEMO_ORDERS } from '@/lib/admin-demo-data';
import { formatPrice, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';
import type { OrderStatus, Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
      const matchPayment = paymentFilter === 'all' || o.payment_method === paymentFilter;
      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Mockup Section 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Fulfillment</span>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">
            Order Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer deliveries, verify mobile financial transactions, and update statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-brand-pink/10 text-brand-pink rounded-lg">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-border-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, customer name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-border-subtle rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-pink"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs border border-border-subtle rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-pink"
          >
            <option value="all">All Payment Methods</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
          </select>
        </div>
      </div>

      {/* Orders Table matching Mockup #5 */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
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
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-brand-ivory/50 transition-colors">
                  {/* Order Number */}
                  <td className="px-6 py-4 font-mono font-semibold text-brand-pink">
                    <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                      {ord.order_number}
                    </Link>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <strong className="block text-brand-charcoal font-semibold text-xs">
                      {ord.customer_name}
                    </strong>
                    <span className="text-gray-400 text-[11px] font-mono">{ord.customer_phone}</span>
                    <span className="text-gray-400 text-[10px] block">{ord.district}, {ord.division}</span>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 font-bold text-brand-charcoal text-sm">
                    {formatPrice(ord.total)}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <span className="uppercase text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                      {ord.payment_method === 'cod' ? 'COD' : ord.payment_method}
                    </span>
                    {ord.transaction_id && (
                      <span className="block text-[10px] text-gray-400 font-mono mt-0.5">
                        Trx: {ord.transaction_id}
                      </span>
                    )}
                  </td>

                  {/* Status with dropdown selector */}
                  <td className="px-6 py-4">
                    <select
                      value={ord.order_status}
                      onChange={(e) => updateStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-full capitalize border-none focus:ring-1 focus:ring-brand-pink cursor-pointer ${getOrderStatusColor(ord.order_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-soft-pink/20 transition-colors inline-block"
                      title="View Order Details"
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
