'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface CustomerUser {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  memberSince?: string;
}

export function useCustomerAuth() {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncCustomer = useCallback(async () => {
    try {
      // 1. Try Supabase Auth
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Customer';

        const customerData: CustomerUser = {
          name: fullName,
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          avatarUrl: user.user_metadata?.avatar_url || '',
          memberSince: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
        };

        setCustomer(customerData);
        // Ensure localStorage & cookie are in sync
        if (typeof window !== 'undefined') {
          document.cookie = 'customer_session=true; Path=/; max-age=2592000; SameSite=Lax;';
          localStorage.setItem('style_secrets_customer_profile', JSON.stringify(customerData));
        }
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Supabase auth fetch error:', e);
    }

    // 2. Fallback to localStorage + cookie check
    if (typeof window !== 'undefined') {
      const hasCookie = document.cookie.includes('customer_session=true');
      const stored = localStorage.getItem('style_secrets_customer_profile');

      if (stored && hasCookie) {
        try {
          const parsed = JSON.parse(stored);
          setCustomer(parsed);
          setLoading(false);
          return;
        } catch {}
      } else if (hasCookie && !stored) {
        // Cookie exists, generate fallback profile
        const fallback: CustomerUser = {
          name: 'My Account',
          email: 'customer@stylesecrets.com',
        };
        setCustomer(fallback);
        setLoading(false);
        return;
      }
    }

    setCustomer(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    syncCustomer();

    // Listen to custom auth events
    const handleAuthEvent = () => {
      syncCustomer();
    };

    window.addEventListener('customer_auth_changed', handleAuthEvent);
    window.addEventListener('storage', handleAuthEvent);

    // Also listen to Supabase auth state change
    try {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        syncCustomer();
      });
      return () => {
        subscription.unsubscribe();
        window.removeEventListener('customer_auth_changed', handleAuthEvent);
        window.removeEventListener('storage', handleAuthEvent);
      };
    } catch {
      return () => {
        window.removeEventListener('customer_auth_changed', handleAuthEvent);
        window.removeEventListener('storage', handleAuthEvent);
      };
    }
  }, [syncCustomer]);

  const logout = useCallback(async () => {
    // Clear cookies
    document.cookie = 'customer_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('style_secrets_customer_profile');
    }

    // Sign out from Supabase
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}

    setCustomer(null);
    window.dispatchEvent(new Event('customer_auth_changed'));
    window.location.href = '/auth/login';
  }, []);

  return {
    customer,
    loading,
    isLoggedIn: !!customer,
    logout,
    refreshCustomer: syncCustomer,
  };
}
