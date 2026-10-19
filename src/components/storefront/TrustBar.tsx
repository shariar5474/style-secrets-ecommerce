import React from 'react';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const SERVICES = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders over ৳1,000' },
  { icon: Shield, title: 'Secure Payment', description: '100% Secure Payment' },
  { icon: RotateCcw, title: 'Easy Return', description: '7 Days Return Policy' },
  { icon: Headphones, title: '24/7 Support', description: 'Always Here to Help' },
];

export default function TrustBar() {
  return (
    <section className="py-8 bg-white border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {SERVICES.map((service) => (
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
