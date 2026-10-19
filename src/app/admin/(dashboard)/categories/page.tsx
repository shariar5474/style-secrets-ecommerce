'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Image as ImageIcon } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/admin-demo-data';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openNewModal = () => {
    setEditingCategory(null);
    setName('');
    setNameBn('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameBn(cat.name_bn || '');
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setIsActive(cat.is_active);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, name_bn: nameBn, slug, description, image_url: imageUrl, is_active: isActive }
            : c
        )
      );
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        name_bn: nameBn,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        image_url: imageUrl,
        parent_id: null,
        sort_order: categories.length + 1,
        is_active: isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_count: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Mockup Section 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Taxonomy</span>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">
            Category Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize ladies fashion collections with bilingual Bengali/English titles.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} /> + Add Category
        </button>
      </div>

      {/* Categories Table matching Mockup #4 */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3.5 font-semibold">#</th>
                <th className="px-6 py-3.5 font-semibold">Image</th>
                <th className="px-6 py-3.5 font-semibold">Name (English & Bengali)</th>
                <th className="px-6 py-3.5 font-semibold">Slug</th>
                <th className="px-6 py-3.5 font-semibold">Products</th>
                <th className="px-6 py-3.5 font-semibold">Active Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-brand-ivory/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-brand-gold/30 flex-shrink-0">
                      <img
                        src={cat.image_url || 'https://via.placeholder.com/60'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <strong className="block text-brand-charcoal font-semibold text-sm">
                      {cat.name}
                    </strong>
                    {cat.name_bn && (
                      <span className="text-[11px] text-brand-pink font-medium">
                        {cat.name_bn}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-[11px]">
                    /{cat.slug}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {cat.product_count || 15} items
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(cat.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        cat.is_active ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cat.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <h3 className="font-semibold text-brand-charcoal text-base">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Category Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. Salwar Kameez"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Category Name (Bengali)
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="e.g. সালোয়ার কামিজ"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="salwar-kameez"
                  className="input-field text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of this clothing category..."
                  className="input-field text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCat"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-brand-pink"
                />
                <label htmlFor="activeCat" className="font-semibold text-gray-700">
                  Visible & Active on storefront navigation
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-2">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
