import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonWithCors, handleOptions } from '@/shared/libs/api-auth';
import { requireWriteAccess } from '@/shared/libs/admin-auth';
import { createPost } from '@/shared/database/queries';
import { getAllPosts } from '@/shared/libs/mdx';

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

const MAX_PAGE_LIMIT = 50;
const DEFAULT_PAGE_LIMIT = 10;

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

/** 공개 목록은 CDN에서 잠깐 캐싱한다. */
const LIST_CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';

/**
 * GET /api/posts?page=1&limit=10 — `content/posts`의 MDX 글 목록(본문 제외, 페이지네이션).
 * 공개 데이터라서 인증이 필요 없다(브라우저 노출은 CORS allowlist로 제한).
 */
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = listQuerySchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  });
  if (!parsed.success) {
    return jsonWithCors(
      request,
      { error: 'Invalid query parameters', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { page, limit } = parsed.data;
  // MDX가 원본이므로 DB 없이 파일에서 바로 읽는다(배포 = 반영). 발행일 내림차순 정렬됨.
  const allPosts = getAllPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const posts = allPosts.slice(start, start + limit);

  return jsonWithCors(
    request,
    {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
      },
    },
    { headers: { 'Cache-Control': LIST_CACHE_CONTROL } },
  );
}

/** POST /api/posts — 글 생성. 쓰기 키 또는 admin 세션 필요. */
export async function POST(request: NextRequest) {
  const denied = await requireWriteAccess(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(
      request,
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
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
