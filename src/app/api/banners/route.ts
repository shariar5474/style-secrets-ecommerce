import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DEMO_HERO_SLIDES, DEMO_PROMO_BANNERS } from '@/lib/admin-demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'hero', 'promo', or 'all'
    const activeOnly = searchParams.get('active') === 'true';

    const supabase = createAdminSupabaseClient();

    let heroQuery = supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
    let promoQuery = supabase.from('promo_banners').select('*').order('sort_order', { ascending: true });

    if (activeOnly) {
      heroQuery = heroQuery.eq('is_active', true);
      promoQuery = promoQuery.eq('is_active', true);
    }

    const [heroRes, promoRes] = await Promise.all([heroQuery, promoQuery]);

    const heroSlides = (!heroRes.error && heroRes.data && heroRes.data.length > 0)
      ? heroRes.data
      : (activeOnly ? DEMO_HERO_SLIDES.filter(s => s.is_active) : DEMO_HERO_SLIDES);

    const promoBanners = (!promoRes.error && promoRes.data && promoRes.data.length > 0)
      ? promoRes.data
      : (activeOnly ? DEMO_PROMO_BANNERS.filter(b => b.is_active) : DEMO_PROMO_BANNERS);

    if (type === 'hero') {
      return NextResponse.json({ success: true, hero_slides: heroSlides });
    }
    if (type === 'promo') {
      return NextResponse.json({ success: true, promo_banners: promoBanners });
    }

    return NextResponse.json({
      success: true,
      hero_slides: heroSlides,
      promo_banners: promoBanners,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      hero_slides: DEMO_HERO_SLIDES,
      promo_banners: DEMO_PROMO_BANNERS,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body; // type is 'hero' | 'promo'
    const supabase = createAdminSupabaseClient();

    if (type === 'hero' || !type) {
      const payload = {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        image_url: data.image_url,
        button_text: data.button_text || 'Shop Now',
        button_link: data.button_link || '/products',
        sort_order: Number(data.sort_order) || 0,
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        updated_at: new Date().toISOString(),
      };

      if (data.id && !data.id.startsWith('slide-')) {
        const { data: updated, error } = await supabase
          .from('hero_slides')
          .update(payload)
          .eq('id', data.id)
          .select()
          .single();

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        return NextResponse.json({ success: true, slide: updated });
      } else {
        const { data: created, error } = await supabase
          .from('hero_slides')
          .insert(payload)
          .select()
          .single();

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        return NextResponse.json({ success: true, slide: created });
      }
    } else {
      // promo banner
      const payload = {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        discount_text: data.discount_text || null,
        image_url: data.image_url || null,
        button_text: data.button_text || 'Shop Now',
        button_link: data.button_link || '/products',
        sort_order: Number(data.sort_order) || 0,
        is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        updated_at: new Date().toISOString(),
      };

      if (data.id && !data.id.startsWith('promo-')) {
        const { data: updated, error } = await supabase
          .from('promo_banners')
          .update(payload)
          .eq('id', data.id)
          .select()
          .single();

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        return NextResponse.json({ success: true, banner: updated });
      } else {
        const { data: created, error } = await supabase
          .from('promo_banners')
          .insert(payload)
          .select()
          .single();

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        return NextResponse.json({ success: true, banner: created });
      }
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, type, is_active, sort_order } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const tableName = type === 'promo' ? 'promo_banners' : 'hero_slides';

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (is_active !== undefined) updates.is_active = Boolean(is_active);
    if (sort_order !== undefined) updates.sort_order = Number(sort_order);

    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'hero';

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const tableName = type === 'promo' ? 'promo_banners' : 'hero_slides';

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
