import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter your email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Attempt to persist subscriber in Supabase database
    try {
      const supabase = createServerSupabaseClient();
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: cleanEmail, is_active: true });

      // If Postgres returns code 23505 (unique constraint violation), user is already subscribed
      if (insertError && insertError.code !== '23505') {
        console.warn('Newsletter DB insert note:', insertError.message);
      }
    } catch (dbErr) {
      // Graceful fallback for offline / demo mode
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Style Secrets updates!',
      coupon_code: 'STYLE10',
    });
  } catch (err: any) {
    console.error('Newsletter subscription error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to complete subscription. Please try again.' },
      { status: 500 }
    );
  }
}
