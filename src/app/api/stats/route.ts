import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getShortUrlStats } from '@/shared/database/queries';
import {
  authenticateBasic,
  basicAuthChallenge,
} from '@/shared/libs/basic-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

/** GET /api/stats — URL Shortener 사용 통계. HTTP Basic 인증 필요. */
export async function GET(request: NextRequest) {
  // proxy가 1차로 막지만, matcher를 우회하는 경우를 대비해 다시 확인한다.
  if (!authenticateBasic(request.headers.get('authorization'))) {
    return basicAuthChallenge();
  }

  try {
    const stats = await getShortUrlStats();
    return NextResponse.json(stats, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: { code: 'STATS_ERROR', message: 'Failed to load stats.' } },
      { status: 500, headers: NO_STORE },
    );
  }
}
