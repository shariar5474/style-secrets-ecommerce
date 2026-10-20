import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

// GET: Fetch all users from profiles
export async function GET() {
  try {
    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profiles });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create a new Admin user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, phone, role = 'admin' } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Full name, email and password are required' }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database service key not configured' }, { status: 500 });
    }

    // 1. Create user in Supabase Auth with auto-confirmed email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name.trim(),
        phone: phone || '',
        role: role,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (userId) {
      // 2. Ensure profile has admin role
      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email.trim().toLowerCase(),
          full_name: full_name.trim(),
          phone: phone || '',
          role: role,
          is_active: true,
        });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        full_name,
        role,
      },
    });
  } catch (err: any) {
    console.error('Error creating admin:', err);
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 });
  }
}

// PATCH: Update user role or status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, role, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database service key not configured' }, { status: 500 });
    }

    const updates: Record<string, any> = {};
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
