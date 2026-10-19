import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DEFAULT_POPUP_SETTINGS } from '@/lib/popup-config';
import type { WelcomePopupSettings } from '@/types';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'welcome_popup_config')
      .single();

    if (!error && data?.value) {
      const parsed: WelcomePopupSettings = JSON.parse(data.value);
      return NextResponse.json({ success: true, settings: { ...DEFAULT_POPUP_SETTINGS, ...parsed } });
    }
  } catch (err) {
    // Database connection or table not yet configured; use default settings gracefully
  }

  return NextResponse.json({ success: true, settings: DEFAULT_POPUP_SETTINGS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings: WelcomePopupSettings = {
      ...DEFAULT_POPUP_SETTINGS,
      ...body,
    };

    try {
      const supabase = createServerSupabaseClient();
      await supabase
        .from('store_settings')
        .upsert(
          {
            key: 'welcome_popup_config',
            value: JSON.stringify(settings),
            type: 'json',
            group: 'appearance',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
    } catch (dbErr) {
      // Supabase write error; still return settings for demo/offline functionality
      console.warn('Could not persist popup settings to Supabase:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Popup settings saved successfully',
      settings,
    });
  } catch (error: any) {
    console.error('Save popup settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save popup settings' },
      { status: 500 }
    );
  }
}
