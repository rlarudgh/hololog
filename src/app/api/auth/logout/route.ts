import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/shared/libs/supabase';
import { isSameOrigin } from '@/shared/libs/admin-auth';

export const dynamic = 'force-dynamic';

/** POST /api/auth/logout — 세션 쿠키를 제거한다. */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
