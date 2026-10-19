'use client';

import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, Search, RefreshCw, CheckCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { DEMO_PRODUCTS } from '@/lib/admin-demo-data';
import { getStockStatus } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [adjustModalProduct, setAdjustModalProduct] = useState<any | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState(10);
  const [adjustmentReason, setAdjustmentReason] = useState('New Shipment Received');
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  const totalInStock = products.reduce((acc, p) => acc + p.total_stock, 0);
  const lowStockCount = products.filter((p) => p.total_stock > 0 && p.total_stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.total_stock <= 0).length;

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjustModalProduct.id
          ? { ...p, total_stock: Math.max(0, p.total_stock + Number(adjustmentQty)) }
          : p
      )
    );

    setAdjustSuccess(true);
    setTimeout(() => {
      setAdjustSuccess(false);
      setAdjustModalProduct(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Warehouse</span>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal">
          Inventory & Stock Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor warehouse quantities, variation stocks, and log stock adjustments.
        </p>
      </div>

      {/* Stock Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-border-subtle">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Units in Stock</span>
          <p className="text-3xl font-bold text-brand-charcoal mt-1">{totalInStock} pcs</p>
          <span className="text-[11px] text-green-600 font-medium">Across all active items</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-border-subtle">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Low Stock Warnings</span>
          <p className="text-3xl font-bold text-amber-600 mt-1">{lowStockCount} items</p>
          <span className="text-[11px] text-gray-400">Below 10 units threshold</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-border-subtle">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Out of Stock</span>
          <p className="text-3xl font-bold text-red-600 mt-1">{outOfStockCount} items</p>
          <span className="text-[11px] text-gray-400">Needs replenishment</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Product & SKU</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Current Stock</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const status = getStockStatus(p.total_stock, 10);
                return (
                  <tr key={p.id} className="hover:bg-brand-ivory/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.featured_image_url || 'https://via.placeholder.com/50'}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg border border-border-subtle flex-shrink-0"
                        />
                        <div>
                          <strong className="block text-brand-charcoal font-semibold text-xs">{p.name}</strong>
                          <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {p.category?.name || 'Ladies Wear'}
                    </td>

                    <td className="px-6 py-4">
                      <strong className="text-sm font-bold text-brand-charcoal">{p.total_stock} units</strong>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          status === 'in_stock'
                            ? 'bg-green-100 text-green-700'
                            : status === 'low_stock'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustModalProduct(p);
                          setAdjustmentQty(10);
                        }}
                        className="btn-secondary text-[11px] px-3 py-1.5"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-semibold text-brand-charcoal text-base mb-1">
              Adjust Stock Quantity
            </h3>
            <p className="text-xs text-gray-500 mb-4">{adjustModalProduct.name}</p>

            {adjustSuccess && (
              <div className="p-3 mb-3 rounded-lg bg-green-50 text-green-700 text-xs flex items-center gap-2">
                <CheckCircle size={14} /> Stock updated successfully!
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Quantity Change (+ or -)
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                  className="input-field text-xs font-bold text-brand-charcoal"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Current: {adjustModalProduct.total_stock} units &rarr; New:{' '}
                  {adjustModalProduct.total_stock + Number(adjustmentQty)} units
                </span>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="input-field text-xs bg-white"
                >
                  <option value="New Shipment Received">New Shipment Received</option>
                  <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
                  <option value="Returned Item Restocked">Returned Item Restocked</option>
                  <option value="Damaged / Defective Removed">Damaged / Defective Removed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                  Confirm Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
