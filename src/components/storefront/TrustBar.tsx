'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

export default function TrustBar() {
  const [services, setServices] = useState([
    { icon: Truck, title: 'Free Delivery', description: 'On orders over ৳1500 across Bangladesh' },
    { icon: Shield, title: 'Secure Payment', description: '100% verified Cash on Delivery & bKash' },
    { icon: RotateCcw, title: 'Easy Return', description: '7 Days Return Policy' },
    { icon: Headphones, title: '24/7 Support', description: 'Dedicated assistance via WhatsApp' },
  ]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.general) {
          const g = json.general;
          setServices([
            {
              icon: Truck,
              title: g.trustDeliveryTitle || 'Free Delivery',
              description: g.trustDeliveryDesc || `On orders over ৳${g.freeShippingThreshold || 1500} across Bangladesh`,
            },
            {
              icon: Shield,
              title: g.trustPaymentTitle || 'Secure Payment',
              description: g.trustPaymentDesc || '100% verified Cash on Delivery & bKash',
            },
            {
              icon: RotateCcw,
              title: g.trustReturnTitle || 'Easy Return',
              description: g.trustReturnDesc || '7 Days Return Policy',
            },
            {
              icon: Headphones,
              title: g.trustSupportTitle || '24/7 Support',
              description: g.trustSupportDesc || 'Dedicated assistance via WhatsApp',
            },
          ]);
        }
      } catch (err) {}
    }
    loadSettings();
  }, []);

  return (
    <section className="py-8 bg-white border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {services.map((service) => (
            <div key={service.title} className="flex items-center gap-3 justify-center">
              <div className="w-12 h-12 rounded-full bg-brand-soft-pink/30 flex items-center justify-center flex-shrink-0">
                <service.icon size={22} className="text-brand-pink" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-charcoal">{service.title}</h3>
                <p className="text-xs text-gray-500">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
