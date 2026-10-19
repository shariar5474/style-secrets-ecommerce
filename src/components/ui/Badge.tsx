import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'sale' | 'bestseller' | 'outline' | 'default' | 'gold';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium uppercase tracking-wider rounded-full transition-colors select-none';

  const variants: Record<string, string> = {
    default: 'bg-brand-soft-pink/40 text-brand-pink',
    new: 'bg-emerald-100 text-emerald-800 font-semibold',
    sale: 'bg-rose-100 text-rose-700 font-bold',
    bestseller: 'bg-amber-100 text-amber-800 font-semibold border border-amber-300',
    gold: 'bg-brand-gold/15 text-brand-gold border border-brand-gold/40 font-semibold',
    outline: 'border border-border-subtle text-brand-charcoal/80 bg-white',
  };

  const sizes: Record<string, string> = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
