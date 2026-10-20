import { NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { DEMO_PRODUCTS } from '@/lib/admin-demo-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status'); // 'published', 'draft', or 'all'

    const supabase = createAdminSupabaseClient();
    let query = supabase
      .from('products')
      .select('*, category:categories(*)');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    } else if (!status) {
      // By default if no status specified, show published
      query = query.eq('status', 'published');
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      // If category filter requested
      let filtered = data;
      if (category && category !== 'All' && category !== 'all') {
        const catLower = category.toLowerCase();
        filtered = data.filter((p: any) =>
          p.category?.name?.toLowerCase() === catLower ||
          p.category?.slug?.toLowerCase() === catLower ||
          p.category_id === category
        );
      }
      return NextResponse.json({ success: true, products: filtered });
    }

    // Fallback to demo products if DB query fails or empty
    let fallback = DEMO_PRODUCTS;
    if (status && status !== 'all') {
      fallback = fallback.filter(p => p.status === status);
    }
    if (featured === 'true') {
      fallback = fallback.filter(p => p.is_featured);
    }
    if (category && category !== 'All' && category !== 'all') {
      const catLower = category.toLowerCase();
      fallback = fallback.filter(p =>
        p.category?.name?.toLowerCase() === catLower ||
        p.category?.slug?.toLowerCase() === catLower ||
        p.category_id === category
      );
    }

    return NextResponse.json({ success: true, products: fallback });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: true, products: DEMO_PRODUCTS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();

    // Generate unique slug & sku if not provided
    const baseSlug = (body.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = body.slug || `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const sku = body.sku || `SS-${Date.now().toString().slice(-6)}`;

    // Prepare insert payload
    const productPayload = {
      name: body.name,
      slug: slug,
      description: body.description || null,
      short_description: body.short_description || null,
      sku: sku,
      regular_price: Number(body.regular_price) || 0,
      sale_price: body.sale_price ? Number(body.sale_price) : null,
      is_variable: Boolean(body.is_variable),
      is_featured: Boolean(body.is_featured),
      is_new: body.is_new !== undefined ? Boolean(body.is_new) : true,
      status: body.status || 'published',
      category_id: body.category_id || null,
      featured_image_url: body.featured_image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      meta_title: body.meta_title || `${body.name} | Style Secrets`,
      meta_description: body.meta_description || body.short_description || null,
      total_stock: Number(body.total_stock) || 50,
      avg_rating: 4.8,
      review_count: 5,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .insert(productPayload)
      .select('*, category:categories(*)')
      .single();

    if (error) {
      console.error('Supabase product insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    console.error('Error in POST /api/products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from('products')
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
