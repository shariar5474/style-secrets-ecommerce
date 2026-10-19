'use client';

import React, { useState } from 'react';
import { CreditCard, Save, CheckCircle, Smartphone, AlertCircle, Info } from 'lucide-react';
import { DEMO_PAYMENT_SETTINGS } from '@/lib/admin-demo-data';
import type { PaymentSetting } from '@/types';

export default function AdminPaymentSettingsPage() {
  const [payments, setPayments] = useState<PaymentSetting[]>([
    {
      id: 'pay-cod',
      method: 'cod',
      is_enabled: true,
      account_number: '01332-852610',
      account_type: 'Helpline / Confirmation',
      instructions: 'Pay cash upon delivery at your doorstep across all 64 districts in Bangladesh.',
      logo_url: null,
      sort_order: 1,
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pay-bkash',
      method: 'bkash',
      is_enabled: true,
      account_number: '01712345678',
      account_type: 'Merchant / Send Money',
      instructions: 'Go to bKash App > Send Money or Payment > Enter Number > Complete transaction and enter TrxID.',
      logo_url: null,
      sort_order: 2,
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pay-nagad',
      method: 'nagad',
      is_enabled: true,
      account_number: '01812345678',
      account_type: 'Merchant / Send Money',
      instructions: 'Go to Nagad App > Send Money > Enter Nagad Number > Provide TrxID at checkout.',
      logo_url: null,
      sort_order: 3,
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pay-rocket',
      method: 'rocket',
      is_enabled: true,
      account_number: '01912345678',
      account_type: 'Personal Wallet',
      instructions: 'Send money to Rocket account > Enter 12-digit transaction number at checkout.',
      logo_url: null,
      sort_order: 4,
      updated_at: new Date().toISOString(),
    },
  ]);

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleUpdate = (id: string, field: keyof PaymentSetting, value: any) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveItem = (method: string) => {
    setSavedNotice(`Payment configuration for ${method.toUpperCase()} saved successfully!`);
    setTimeout(() => setSavedNotice(null), 2500);
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
