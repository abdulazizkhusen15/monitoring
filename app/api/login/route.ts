import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Connect ke Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query admin dari database
    const { data, error } = await supabase
      .from('admins')
      .select('id, username')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Login berhasil
    return NextResponse.json({
      success: true,
      username: data.username,
      message: 'Login berhasil',
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
