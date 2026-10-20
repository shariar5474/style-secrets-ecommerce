'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle, Smartphone, AlertCircle, Info } from 'lucide-react';
import { DEMO_PAYMENT_SETTINGS } from '@/lib/admin-demo-data';
import type { PaymentSetting } from '@/types';

export default function AdminPaymentSettingsPage() {
  const [payments, setPayments] = useState<PaymentSetting[]>(DEMO_PAYMENT_SETTINGS);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && Array.isArray(json.payments)) {
          setPayments(json.payments);
        }
      } catch (err) {}
    }
    loadPayments();
  }, []);

  const handleUpdate = (id: string, field: keyof PaymentSetting, value: any) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveItem = async (method: string) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payments }),
      });
      setSavedNotice(`Payment configuration for ${method.toUpperCase()} saved successfully!`);
      setTimeout(() => setSavedNotice(null), 2500);
    } catch (err) {
      console.error('Failed to save payment settings:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching Mockup Section 7 */}
      <div>
        <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Billing & Financials</span>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal">
          Payment Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Admin can change official numbers, account types, and instructions for customer checkout.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle size={16} /> {savedNotice}
        </div>
      )}

      {/* Payment Methods Configuration Grid matching Mockup 7 */}
      <div className="space-y-4">
        {payments.map((method) => {
          const colorClass =
            method.method === 'bkash'
              ? 'border-pink-300 bg-pink-50/20'
              : method.method === 'nagad'
              ? 'border-orange-300 bg-orange-50/20'
              : method.method === 'rocket'
              ? 'border-purple-300 bg-purple-50/20'
              : 'border-green-300 bg-green-50/20';

          const title =
            method.method === 'cod'
              ? 'Cash On Delivery'
              : method.method === 'bkash'
              ? 'bKash'
              : method.method === 'nagad'
              ? 'Nagad'
              : 'Rocket';

          return (
            <div
              key={method.id}
              className={`bg-white rounded-2xl p-6 shadow-card border ${colorClass} transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-border-subtle flex items-center justify-center font-bold text-xs uppercase">
                    {method.method}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-charcoal text-sm">{title}</h3>
                    <span className="text-[11px] text-gray-400">Status: {method.is_enabled ? 'Active on Checkout' : 'Disabled'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
                  <input
                    type="text"
                    value={method.account_number || ''}
                    onChange={(e) => handleUpdate(method.id, 'account_number', e.target.value)}
                    placeholder="Account phone number"
                    className="input-field text-xs font-mono font-bold max-w-[220px]"
                  />
                  <button
                    onClick={() => handleSaveItem(title)}
                    className="btn-primary text-xs py-2.5 px-6 font-semibold flex-shrink-0 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Instructions and toggle accordion */}
              <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Account Type / Note:
                  </label>
                  <input
                    type="text"
                    value={method.account_type || ''}
                    onChange={(e) => handleUpdate(method.id, 'account_type', e.target.value)}
                    className="input-field text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Customer Instructions on Checkout:
                  </label>
                  <input
                    type="text"
                    value={method.instructions || ''}
                    onChange={(e) => handleUpdate(method.id, 'instructions', e.target.value)}
                    className="input-field text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-brand-ivory border border-border-subtle flex items-start gap-3 text-xs text-gray-600">
        <Info size={18} className="text-brand-pink flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-brand-charcoal">Security Notice:</strong> Mobile financial service payments are manually inspected by administrative staff before parcels are dispatched. Official merchant API credentials can be integrated in this module when API merchant contracts are activated.
        </div>
      </div>
    </div>
  );
}
