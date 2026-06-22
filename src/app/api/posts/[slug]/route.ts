import type { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  requireApiKey,
  jsonWithCors,
  handleOptions,
} from '@/shared/libs/api-auth';
import {
  getPostBySlug,
  updatePost,
  deletePost,
} from '@/shared/database/queries';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

/** GET /api/posts/[slug] — 단건 조회(본문 포함). 읽기 키 필요. */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const denied = requireApiKey(request, 'read');
  if (denied) return denied;

  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return jsonWithCors(request, { error: 'Post not found' }, { status: 404 });
  }
  return jsonWithCors(request, { post });
}

/** PUT /api/posts/[slug] — 글 수정. 쓰기 키 필요. */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const denied = requireApiKey(request, 'write');
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) {
    return jsonWithCors(
      request,
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { slug } = await params;
  const post = await updatePost(slug, parsed.data);
  if (!post) {
    return jsonWithCors(request, { error: 'Post not found' }, { status: 404 });
  }
  return jsonWithCors(request, { post });
}

/** DELETE /api/posts/[slug] — 글 삭제. 쓰기 키 필요. */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const denied = requireApiKey(request, 'write');
  if (denied) return denied;

  const { slug } = await params;
  const ok = await deletePost(slug);
  if (!ok) {
    return jsonWithCors(request, { error: 'Post not found' }, { status: 404 });
  }
  return jsonWithCors(request, { success: true });
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
