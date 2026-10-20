import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DEMO_CATEGORIES } from '@/lib/admin-demo-data';

export async function GET(request: Request) {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, categories: data });
    }

    return NextResponse.json({ success: true, categories: DEMO_CATEGORIES });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: true, categories: DEMO_CATEGORIES });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();

    const baseSlug = (body.name || 'category')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = body.slug || baseSlug;

    const payload = {
      name: body.name,
      name_bn: body.name_bn || null,
      slug: slug,
      description: body.description || null,
      image_url: body.image_url || null,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      sort_order: Number(body.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    if (body.id && !body.id.startsWith('cat-')) {
      // Update existing
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, category: data });
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, category: data });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
