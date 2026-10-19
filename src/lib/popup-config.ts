import { WelcomePopupSettings } from '@/types';

export const DEFAULT_POPUP_SETTINGS: WelcomePopupSettings = {
  is_enabled: true,
  welcome_text: 'Welcome to ♡',
  brand_title: 'Style Secrets',
  brand_subtitle: 'LADIES CLOTHING ONLINE SHOP',
  special_offer_heading: 'Special Offer Just for You!',
  discount_badge_text: 'GET',
  discount_title: '10% OFF',
  discount_subtitle: '— ON YOUR FIRST ORDER —',
  badge_text: 'SHOP YOUR STYLE TODAY ♥',
  email_placeholder: 'Enter your email address',
  button_text: 'GET DISCOUNT →',
  supporting_text: 'Get latest collection, exclusive offers and fashion updates.',
  coupon_code: 'STYLE10',
  success_heading: 'Offer Unlocked! 🎉',
  success_message: 'Use this promo coupon code during checkout to enjoy your exclusive 10% discount:',
  image_url: '/images/welcome-popup.jpg',
  frequency: 'once_per_session',
  frequency_days: 3,
  delay_seconds: 1,
  close_on_overlay_click: true,
  target_pages: 'all_public',
  desktop_enabled: true,
  mobile_enabled: true,
  // Service cards
  service_delivery_title: 'Free Delivery',
  service_delivery_sub: 'On orders over ৳1000',
  service_payment_title: 'Secure Payment',
  service_payment_sub: '100% Safe & Secure',
  service_return_title: 'Easy Return',
  service_return_sub: '7 Days Return Policy',
  service_support_title: '24/7 Support',
  service_support_sub: "We're Here to Help",
};

const STORAGE_KEY_SESSION = 'style_secrets_popup_session_dismissed';
const STORAGE_KEY_LOCAL = 'style_secrets_popup_last_dismissed';
const STORAGE_KEY_CUSTOM_SETTINGS = 'style_secrets_welcome_popup_custom_settings';

/**
 * Checks whether the welcome popup should be shown based on configured frequency and client storage.
 */
export function shouldShowWelcomePopup(settings: WelcomePopupSettings): boolean {
  if (!settings.is_enabled) return false;
  if (typeof window === 'undefined') return false;

  const frequency = settings.frequency;

  if (frequency === 'disabled') return false;
  if (frequency === 'every_page_load') return true;

  if (frequency === 'once_per_session') {
    const isDismissed = sessionStorage.getItem(STORAGE_KEY_SESSION);
    return !isDismissed;
  }

  if (frequency === 'every_visit') {
    const isDismissed = sessionStorage.getItem(STORAGE_KEY_SESSION);
    return !isDismissed;
  }

  if (frequency === 'every_n_days') {
    const lastDismissed = localStorage.getItem(STORAGE_KEY_LOCAL);
    if (!lastDismissed) return true;
    const daysSince = (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
    return daysSince >= (settings.frequency_days || 1);
  }

  return true;
}

/**
 * Records that the visitor has dismissed or claimed the popup.
 */
export function recordPopupDismissal(settings: WelcomePopupSettings): void {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
  localStorage.setItem(STORAGE_KEY_LOCAL, Date.now().toString());
}

/**
 * Saves popup settings to localStorage for immediate instant client reactivity
 */
export function saveLocalPopupSettings(settings: WelcomePopupSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Loads popup settings from localStorage if available
 */
export function getLocalPopupSettings(): WelcomePopupSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore parse errors
  }
  return null;
}
