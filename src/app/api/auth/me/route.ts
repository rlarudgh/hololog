import { NextResponse } from 'next/server';
import { getAdminUser } from '@/shared/libs/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/auth/me — 현재 로그인한 admin 정보. 아니면 401. */
export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
