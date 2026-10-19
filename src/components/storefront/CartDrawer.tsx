'use client';
import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-drawer flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="text-lg font-semibold text-brand-charcoal">Shopping Cart ({items.length})</h2>
          <button onClick={closeCart} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag size={48} className="text-gray-300" />
            <p className="text-gray-500">Your cart is empty</p>
            <button onClick={closeCart} className="btn-primary text-sm">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
              {items.map((item) => {
                const key = item.variation_id ? `${item.product_id}_${item.variation_id}` : item.product_id;
                const price = item.variation?.sale_price ?? item.variation?.regular_price ?? item.product?.sale_price ?? item.product?.regular_price ?? 0;
                const attrs = item.variation?.attributes;
                return (
                  <div key={key} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      {(item.variation?.image_url || item.product?.featured_image_url) && (
                        <img src={item.variation?.image_url || item.product?.featured_image_url || ''} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-brand-charcoal truncate">{item.product?.name}</h4>
                      {attrs && attrs.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {attrs.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(', ')}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-brand-pink mt-1">{formatPrice(price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border-subtle rounded">
                          <button onClick={() => updateQuantity(key, item.quantity - 1)} className="p-1 hover:bg-gray-100"><Minus size={14} /></button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(key, item.quantity + 1)} className="p-1 hover:bg-gray-100"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(key)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Footer */}
            <div className="border-t border-border-subtle px-6 py-4 space-y-3">
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal:</span>
                <span className="text-brand-pink">{formatPrice(getTotal())}</span>
              </div>
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center block">
                Checkout
              </Link>
              <button onClick={closeCart} className="w-full text-center text-sm text-gray-500 hover:text-brand-pink">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
