import { NextResponse } from 'next/server';
import { openapiSpec, apiDocsEnabled } from '@/shared/libs/openapi';

export const dynamic = 'force-dynamic';

/** GET /api/openapi — OpenAPI 스펙(JSON). 문서용이라 인증 불필요. */
export function GET() {
  if (!apiDocsEnabled()) {
    return new NextResponse('Not Found', { status: 404 });
  }
  return NextResponse.json(openapiSpec, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
