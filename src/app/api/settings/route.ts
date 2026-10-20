import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DEMO_PAYMENT_SETTINGS } from '@/lib/admin-demo-data';

const DEFAULT_STORE_SETTINGS = {
  storeName: 'Style Secrets',
  tagline: 'Elegance in Every You — Premier Ladies Clothing',
  logoUrl: '/images/logo.jpg',
  contactPhone: '+8801700000000',
  whatsappNumber: '+8801700000000',
  contactEmail: 'support@stylesecrets.com',
  storeAddress: 'House #14, Road #7, Dhanmondi, Dhaka 1205, Bangladesh',
  businessHours: 'Sat - Thu: 10:00 AM - 9:00 PM, Friday: 3:00 PM - 9:00 PM',
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeShippingThreshold: 1500,
  facebookUrl: 'https://facebook.com/stylesecretsbd',
  instagramUrl: 'https://instagram.com/stylesecretsbd',
  tiktokUrl: 'https://tiktok.com/@stylesecrets',
  youtubeUrl: 'https://youtube.com/@stylesecretsbd',
  trustDeliveryTitle: 'Free Delivery',
  trustDeliveryDesc: 'On orders over ৳1500 across Bangladesh',
  trustPaymentTitle: 'Secure Payment',
  trustPaymentDesc: '100% verified Cash on Delivery & bKash',
  trustReturnTitle: 'Easy 7-Day Returns',
  trustReturnDesc: 'Hassle-free exchange policy on unworn items',
  trustSupportTitle: 'Dedicated Support',
  trustSupportDesc: 'Friendly assistance via WhatsApp & phone',
};

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    // Fetch store general settings
    const { data: storeSettingData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'store_general_config')
      .single();

    let generalSettings = DEFAULT_STORE_SETTINGS;
    if (storeSettingData?.value) {
      try {
        generalSettings = { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(storeSettingData.value) };
      } catch {}
    }

    // Fetch payment settings
    const { data: paymentData } = await supabase
      .from('payment_settings')
      .select('*')
      .order('sort_order', { ascending: true });

    const paymentSettings = (paymentData && paymentData.length > 0)
      ? paymentData
      : DEMO_PAYMENT_SETTINGS;

    return NextResponse.json({
      success: true,
      general: generalSettings,
      payments: paymentSettings,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      general: DEFAULT_STORE_SETTINGS,
      payments: DEMO_PAYMENT_SETTINGS,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { general, payments } = body;
    const supabase = createAdminSupabaseClient();

    // 1. Update general settings if provided
    if (general) {
      const merged = { ...DEFAULT_STORE_SETTINGS, ...general };
      await supabase
        .from('store_settings')
        .upsert({
          key: 'store_general_config',
          value: JSON.stringify(merged),
          type: 'json',
          group: 'general',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
    }

    // 2. Update payment settings if provided
    if (Array.isArray(payments)) {
      for (const p of payments) {
        if (!p.method) continue;
        await supabase
          .from('payment_settings')
          .upsert({
            method: p.method,
            is_enabled: Boolean(p.is_enabled),
            account_number: p.account_number || null,
            account_type: p.account_type || null,
            instructions: p.instructions || null,
            logo_url: p.logo_url || null,
            sort_order: Number(p.sort_order) || 0,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'method' });
      }
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (err: any) {
    console.error('Error saving settings:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
