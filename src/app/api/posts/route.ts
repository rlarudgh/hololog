import type { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  requireApiKey,
  jsonWithCors,
  handleOptions,
} from '@/shared/libs/api-auth';
import { listPosts, createPost } from '@/shared/database/queries';

// API 라우트는 항상 동적으로 실행한다(정적 캐싱 방지).
export const dynamic = 'force-dynamic';

const createPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

/** GET /api/posts — 발행된 글 목록(본문 제외). 읽기 키 필요. */
export async function GET(request: NextRequest) {
  const denied = requireApiKey(request, 'read');
  if (denied) return denied;

  const posts = await listPosts();
  return jsonWithCors(request, { posts });
}

/** POST /api/posts — 글 생성. 쓰기 키 필요. */
export async function POST(request: NextRequest) {
  const denied = requireApiKey(request, 'write');
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return jsonWithCors(
      request,
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const post = await createPost(parsed.data);
    return jsonWithCors(request, { post }, { status: 201 });
  } catch {
    return jsonWithCors(
      request,
      { error: 'Failed to create post. The slug may already exist.' },
      { status: 409 },
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
