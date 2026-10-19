'use client';
import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { setStatus('success'); setMessage('Thank you for subscribing!'); setEmail(''); }
      else { setStatus('error'); setMessage(data.error || 'Subscription failed.'); }
    } catch { setStatus('error'); setMessage('Network error. Please try again.'); }
  };

  return (
    <section className="py-8 bg-gradient-to-r from-brand-pink to-brand-dark-pink">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Mail size={20} /></div>
            <div>
              <h3 className="font-semibold text-sm md:text-base">Subscribe to Our Newsletter</h3>
              <p className="text-xs text-white/80">Get updates on new arrivals, offers and more</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-0">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 md:w-80 px-4 py-3 rounded-l-lg text-sm focus:outline-none" required />
            <button type="submit" disabled={status === 'loading'} className="px-6 py-3 bg-brand-charcoal text-white font-semibold text-sm rounded-r-lg hover:bg-black transition-colors disabled:opacity-50">
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
        {status === 'success' && <div className="flex items-center gap-2 mt-3 text-white/90 text-sm"><CheckCircle size={16} />{message}</div>}
        {status === 'error' && <div className="flex items-center gap-2 mt-3 text-yellow-200 text-sm"><AlertCircle size={16} />{message}</div>}
      </div>
    </section>
  );
}