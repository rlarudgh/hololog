import type { NextRequest } from 'next/server';
import {
  requireApiKey,
  jsonWithCors,
  handleOptions,
} from '@/shared/libs/api-auth';
import { listTags } from '@/shared/database/queries';

export const dynamic = 'force-dynamic';

/** GET /api/tags — 전체 태그 목록. 읽기 키 필요. */
export async function GET(request: NextRequest) {
  const denied = requireApiKey(request, 'read');
  if (denied) return denied;

  const tags = await listTags();
  return jsonWithCors(request, { tags });
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
