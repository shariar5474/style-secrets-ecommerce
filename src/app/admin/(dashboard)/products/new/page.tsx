'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Check,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/admin-demo-data';
import type { Category } from '@/types';

interface VariationRow {
  id: string;
  size: string;
  color: string;
  regular_price: number;
  sale_price: number;
  stock: number;
  image: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'variations' | 'images' | 'stock'>('general');
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success && Array.isArray(json.categories)) {
          setCategories(json.categories);
          if (json.categories.length > 0 && !categoryId) {
            setCategoryId(json.categories[0].id);
          }
        }
      } catch (err) {}
    }
    loadCats();
  }, []);

  // Form Fields
  const [productName, setProductName] = useState('Stylish Cotton Kurti');
  const [categoryId, setCategoryId] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(1200);
  const [salePrice, setSalePrice] = useState<number>(890);
  const [sku, setSku] = useState('KRT-001');
  const [description, setDescription] = useState('Breathable premium pure cotton kurti with elegant boat neckline and subtle lace embellishments on sleeves.');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80');

  // Variations Table matching Mockup Section 2
  const [variations, setVariations] = useState<VariationRow[]>([
    { id: 'v1', size: 'S', color: 'Red', regular_price: 1200, sale_price: 890, stock: 10, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80' },
    { id: 'v2', size: 'M', color: 'Red', regular_price: 1200, sale_price: 890, stock: 15, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80' },
    { id: 'v3', size: 'L', color: 'Blue', regular_price: 1200, sale_price: 890, stock: 20, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=200&q=80' },
    { id: 'v4', size: 'XL', color: 'Pink', regular_price: 1200, sale_price: 890, stock: 8, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=200&q=80' },
  ]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addVariation = () => {
    const newId = `var-${Date.now()}`;
    setVariations((prev) => [
      ...prev,
      {
        id: newId,
        size: 'M',
        color: 'Rose Gold',
        regular_price: regularPrice,
        sale_price: salePrice,
        stock: 12,
        image: featuredImage,
      },
    ]);
  };

  const removeVariation = (id: string) => {
    setVariations((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVariation = (id: string, field: keyof VariationRow, value: any) => {
    setVariations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          category_id: categoryId || categories[0]?.id,
          regular_price: regularPrice,
          sale_price: salePrice > 0 ? salePrice : null,
          sku: sku,
          description: description,
          short_description: description.slice(0, 120),
          featured_image_url: featuredImage,
          is_variable: variations.length > 0,
          status: 'published',
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || 'Failed to create product in database');
        setSaving(false);
        return;
      }

      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving product');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-border-subtle hover:bg-brand-soft-pink/20 transition-colors"
          >
            <ArrowLeft size={18} className="text-brand-charcoal" />
          </Link>
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Product Creator</span>
            <h1 className="text-2xl font-display font-bold text-brand-charcoal">
              Add Product (with Variations)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="btn-secondary text-xs py-2 px-4"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProduct}
            disabled={saving}
            className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
          >
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Publish Product'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
          <Check size={16} /> Product saved successfully! Redirecting to products list...
        </div>
      )}

      {/* Main Card with Tabs matching Mockup Section 2 */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border-subtle px-6 pt-4 gap-6 bg-gray-50/50">
          {[
            { id: 'general', label: 'General' },
            { id: 'variations', label: `Variations (${variations.length})` },
            { id: 'images', label: 'Images & Media' },
            { id: 'stock', label: 'Inventory & Stock' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                activeTab === tab.id
                  ? 'text-brand-pink font-bold'
                  : 'text-gray-500 hover:text-brand-charcoal'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-6">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Stylish Cotton Kurti"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input-field text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.name_bn ? `(${c.name_bn})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Base SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. KRT-001"
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Regular Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="input-field text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sale Price (৳) (Optional)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="input-field text-xs font-bold text-brand-pink"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description & Fabric Care
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field text-xs resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VARIATIONS (Matching Mockup 2 Table Exactly) */}
          {activeTab === 'variations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div>
                  <h3 className="font-semibold text-brand-charcoal text-sm">Product Variations Grid</h3>
                  <p className="text-xs text-gray-400">Configure custom prices, stocks, and images for each Size + Color pair.</p>
                </div>
                <button
                  type="button"
                  onClick={addVariation}
                  className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Plus size={14} /> + Add Variation
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Size</th>
                      <th className="px-4 py-3 font-semibold">Color</th>
                      <th className="px-4 py-3 font-semibold">Regular Price</th>
                      <th className="px-4 py-3 font-semibold">Sale Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Image</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variations.map((v) => (
                      <tr key={v.id} className="hover:bg-brand-ivory/40">
                        {/* Size */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={v.size}
                            onChange={(e) => updateVariation(v.id, 'size', e.target.value)}
                            className="w-16 px-2 py-1.5 border border-border-subtle rounded text-xs font-semibold uppercase"
                          />
                        </td>

                        {/* Color */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={v.color}
                            onChange={(e) => updateVariation(v.id, 'color', e.target.value)}
                            className="w-24 px-2 py-1.5 border border-border-subtle rounded text-xs"
                          />
                        </td>

                        {/* Regular Price */}
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={v.regular_price}
                            onChange={(e) => updateVariation(v.id, 'regular_price', Number(e.target.value))}
                            className="w-24 px-2 py-1.5 border border-border-subtle rounded text-xs font-mono"
                          />
                        </td>

                        {/* Sale Price */}
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={v.sale_price}
                            onChange={(e) => updateVariation(v.id, 'sale_price', Number(e.target.value))}
                            className="w-24 px-2 py-1.5 border border-border-subtle rounded text-xs font-mono font-bold text-brand-pink"
                          />
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => updateVariation(v.id, 'stock', Number(e.target.value))}
                            className="w-20 px-2 py-1.5 border border-border-subtle rounded text-xs font-bold"
                          />
                        </td>

                        {/* Image Preview */}
                        <td className="px-4 py-3">
                          <div className="w-10 h-12 rounded bg-gray-100 overflow-hidden border border-border-subtle flex items-center justify-center">
                            {v.image ? (
                              <img src={v.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Upload size={14} className="text-gray-400" />
                            )}
                          </div>
                        </td>

                        {/* Delete Action */}
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeVariation(v.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                            title="Remove Variation"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={addVariation}
                  className="w-full py-2.5 border-2 border-dashed border-brand-pink/40 hover:border-brand-pink bg-brand-soft-pink/10 hover:bg-brand-soft-pink/20 text-brand-pink font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={16} /> + Add Another Variation
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Featured Product Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://..."
                    className="input-field text-xs flex-1"
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-border-subtle rounded-2xl p-8 text-center bg-gray-50/50">
                <Upload size={32} className="text-brand-pink mx-auto mb-2" />
                <h4 className="font-semibold text-brand-charcoal text-xs">Drop additional product photos here</h4>
                <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                <button type="button" className="btn-secondary text-[11px] px-3 py-1.5 mt-3">
                  Browse Files
                </button>
              </div>

              {featuredImage && (
                <div>
                  <span className="text-xs font-semibold text-gray-600 block mb-2">Image Preview:</span>
                  <div className="w-32 h-40 rounded-xl overflow-hidden border border-border-subtle shadow-sm">
                    <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STOCK */}
          {activeTab === 'stock' && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Low Stock Threshold Alert
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="input-field text-xs"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Notify dashboard when product or variation stock falls below this quantity.
                </span>
              </div>

              <div className="p-4 bg-brand-ivory rounded-xl border border-border-subtle">
                <span className="text-xs text-gray-500">Calculated Total Stock:</span>
                <p className="text-2xl font-bold text-brand-charcoal mt-1">
                  {variations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} units
                </p>
                <span className="text-[11px] text-gray-400">Summed across all {variations.length} active variations.</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Save bar */}
          <div className="pt-6 border-t border-border-subtle flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2.5 px-6 shadow-sm"
            >
              {saving ? 'Saving...' : 'Save & Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
