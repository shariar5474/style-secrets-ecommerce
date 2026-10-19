'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '@/lib/admin-demo-data';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        categoryFilter === 'all' || p.category_id === categoryFilter || p.category?.slug === categoryFilter;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'published' ? 'draft' : 'published';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteModalId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Mockup Section 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Catalog</span>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">
            Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your ladies fashion items, inventory variations, and prices.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} /> + Add Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-border-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search product by title, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-border-subtle rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-pink"
          >
            <option value="all">All Categories</option>
            {DEMO_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-border-subtle rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-pink"
          >
            <option value="all">All Status</option>
            <option value="published">Active</option>
            <option value="draft">Draft / Inactive</option>
          </select>
        </div>
      </div>

      {/* Table matching Mockup #3 */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Image</th>
                <th className="px-6 py-3.5 font-semibold">Name</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Price</th>
                <th className="px-6 py-3.5 font-semibold">Stock</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isActive = p.status === 'published';
                return (
                  <tr key={p.id} className="hover:bg-brand-ivory/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="w-12 h-14 rounded-lg bg-gray-100 overflow-hidden border border-border-subtle flex-shrink-0">
                        <img
                          src={p.featured_image_url || 'https://via.placeholder.com/80'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <strong className="block text-brand-charcoal font-semibold">{p.name}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</span>
                      {p.is_variable && (
                        <span className="ml-2 text-[10px] bg-purple-50 text-purple-600 font-medium px-1.5 py-0.5 rounded">
                          Variable ({p.variations?.length || 4} variants)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-medium">
                      {p.category?.name || 'Ladies Wear'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-brand-charcoal">
                        {formatPrice(p.sale_price ?? p.regular_price)}
                      </span>
                      {p.sale_price && (
                        <span className="block text-[10px] text-gray-400 line-through">
                          {formatPrice(p.regular_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`font-semibold ${
                        p.total_stock <= 5 ? 'text-red-600 font-bold' : p.total_stock <= 15 ? 'text-amber-600' : 'text-gray-700'
                      }`}>
                        {p.total_stock} pcs
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                          isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {isActive ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-soft-pink/20 transition-colors"
                          title="View Live"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteModalId(p.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-semibold text-brand-charcoal text-base">Delete Product?</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to remove this product? This action will remove all associated stock and variation data.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteModalId(null)}
                className="btn-secondary flex-1 text-xs py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModalId)}
                className="bg-red-600 text-white font-semibold rounded-lg flex-1 text-xs py-2 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
