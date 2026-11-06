import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/shared/libs/supabase';
import { isAdmin, isSameOrigin } from '@/shared/libs/admin-auth';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
});

/** POST /api/auth/login — Supabase Auth 이메일/비밀번호 로그인(admin 전용). */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  // 계정 존재 여부가 드러나지 않도록 실패 메시지를 하나로 통일한다.
  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (!isAdmin(data.user)) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    user: { id: data.user.id, email: data.user.email },
  });
}
