import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function calculateDiscount(regular: number, sale: number): number {
  if (!sale || sale >= regular) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}

export function generateOrderNumber(): string {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateSKU(name: string, index?: number): string {
  const base = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 6)
    .toUpperCase();
  const suffix = index !== undefined ? `-${String(index + 1).padStart(3, '0')}` : '';
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SS-${base}-${random}${suffix}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function normalizeBDPhone(phone: string): string | null {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Bangladesh phone: 11 digits starting with 01
  if (digits.length === 11 && digits.startsWith('01')) {
    return '+880' + digits.substring(1);
  }
  // With country code 880
  if (digits.length === 13 && digits.startsWith('880')) {
    return '+' + digits;
  }
  // With +880
  if (digits.length === 10 && digits.startsWith('1')) {
    return '+880' + digits;
  }
  
  return null;
}

export function validateBDPhone(phone: string): boolean {
  const normalized = normalizeBDPhone(phone);
  if (!normalized) return false;
  // Valid BD mobile prefixes: 013, 014, 015, 016, 017, 018, 019
  return /^\+880(13|14|15|16|17|18|19)\d{8}$/.test(normalized);
}

export function getStockStatus(quantity: number, lowThreshold: number = 5): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= lowThreshold) return 'low_stock';
  return 'in_stock';
}

export function getStockLabel(status: 'in_stock' | 'low_stock' | 'out_of_stock'): string {
  switch (status) {
    case 'in_stock': return 'In Stock';
    case 'low_stock': return 'Low Stock';
    case 'out_of_stock': return 'Out of Stock';
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'confirmed': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-purple-100 text-purple-700';
    case 'shipped': return 'bg-indigo-100 text-indigo-700';
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'refunded': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'verified': return 'bg-green-100 text-green-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    case 'refunded': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
