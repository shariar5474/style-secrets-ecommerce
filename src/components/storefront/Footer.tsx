import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Image src="/images/logo.jpg" alt="Style Secrets" width={80} height={80} className="rounded-full mb-4" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Your favourite online store for trendy and premium ladies fashion. Shop your style with Style Secrets.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-pink transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[{l:'Home',h:'/'},{l:'About Us',h:'#'},{l:'Shop',h:'/categories/all'},{l:'My Account',h:'/account'},{l:'Track Order',h:'/account/orders'},{l:'Contact Us',h:'#'}].map(({l,h})=>(
                <li key={l}><Link href={h} className="text-xs text-gray-400 hover:text-brand-pink transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {['FAQ','Return & Refund','Shipping Policy','Privacy Policy','Terms & Conditions','Size Guide'].map((link)=>(
                <li key={link}><Link href="#" className="text-xs text-gray-400 hover:text-brand-pink transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-brand-pink" /><span className="text-xs text-gray-400">[Your Address], Chittagong, Bangladesh</span></li>
              <li className="flex items-center gap-2"><Phone size={14} className="flex-shrink-0 text-brand-pink" /><span className="text-xs text-gray-400">01XXX-XXXXXX</span></li>
              <li className="flex items-center gap-2"><Mail size={14} className="flex-shrink-0 text-brand-pink" /><span className="text-xs text-gray-400">info@stylesecrets.com</span></li>
              <li className="flex items-center gap-2"><Clock size={14} className="flex-shrink-0 text-brand-pink" /><span className="text-xs text-gray-400">10:00 AM - 10:00 PM</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Payment Methods</h4>
            <div className="space-y-2">
              {[{n:'Cash On Delivery',c:'bg-green-600'},{n:'bKash',c:'bg-pink-600'},{n:'Nagad',c:'bg-orange-500'},{n:'Rocket',c:'bg-purple-600'}].map(({n,c})=>(
                <div key={n} className="flex items-center gap-2"><div className={`w-6 h-4 rounded ${c}`}/><span className="text-xs text-gray-400">{n}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">&copy; 2026 Style Secrets. All Rights Reserved.</p>
          <p className="text-xs text-brand-gold font-display italic">Shop Your Style</p>
        </div>
      </div>
      <div className="border-t border-white/5 bg-black/30 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[11px] text-gray-400 tracking-wide">
            Developed By{' '}
            <a
              href="https://www.facebook.com/shariarislamfm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Shariar Islam Sohel on Facebook"
              className="text-brand-gold font-medium hover:text-brand-pink transition-colors duration-200 hover:underline underline-offset-4"
            >
              Shariar Islam Sohel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}