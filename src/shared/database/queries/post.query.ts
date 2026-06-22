import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { posts, tags, postTags } from '../schema';
import type { BlogPost } from '@/shared/types/blog-type';

/**
 * 태그 이름을 URL-safe slug로 변환한다.
 * 한글은 보존하고(예: "스타트업" → "스타트업"), 공백/특수문자는 정리한다.
 * 모두 제거되어 빈 문자열이 되면 원본을 인코딩해 고유성을 유지한다.
 */
export function slugifyTag(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || encodeURIComponent(name.trim().toLowerCase());
}

/** DB의 timestamp 발행일을 MDX와 동일한 'YYYY-MM-DD' 문자열로 변환한다. */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

type PostRow = typeof posts.$inferSelect & {
  tags: { tag: typeof tags.$inferSelect }[];
};

function toBlogPost(row: PostRow, withContent: boolean): BlogPost {
  const tagNames = row.tags.map((pt) => pt.tag.name);
  const result: BlogPost = {
    slug: row.slug,
    title: row.title,
    date: formatDate(row.date),
    description: row.description,
    tags: tagNames.length > 0 ? tagNames : undefined,
  };
  if (withContent) {
    result.content = row.content;
  }
  return result;
}

export interface PostInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  /** 'YYYY-MM-DD' 또는 ISO 문자열. 생략 시 현재 시각. */
  date?: string;
  tags?: string[];
  published?: boolean;
}

/** 발행된 글 목록을 발행일 내림차순으로 반환한다(본문 제외). */
export async function listPosts(
  options: { publishedOnly?: boolean } = {},
): Promise<BlogPost[]> {
  const { publishedOnly = true } = options;
  const rows = await db.query.posts.findMany({
    where: publishedOnly ? eq(posts.published, true) : undefined,
    orderBy: desc(posts.date),
    with: { tags: { with: { tag: true } } },
  });
  return rows.map((row) => toBlogPost(row as PostRow, false));
}

/** slug로 단건 조회(본문 포함). 없으면 null. */
export async function getPostBySlug(
  slug: string,
  options: { publishedOnly?: boolean } = {},
): Promise<BlogPost | null> {
  const { publishedOnly = true } = options;
  const row = await db.query.posts.findFirst({
    where: publishedOnly
      ? and(eq(posts.slug, slug), eq(posts.published, true))
      : eq(posts.slug, slug),
    with: { tags: { with: { tag: true } } },
  });
  return row ? toBlogPost(row as PostRow, true) : null;
}

/** 모든 태그를 이름/slug로 반환한다. */
export async function listTags(): Promise<{ name: string; slug: string }[]> {
  const rows = await db
    .select({ name: tags.name, slug: tags.slug })
    .from(tags)
    .orderBy(tags.name);
  return rows;
}

/**
 * 글의 태그를 주어진 이름 목록으로 동기화한다(트랜잭션 내부에서 호출).
 * 기존 연결을 모두 지우고 다시 연결하므로 멱등하다.
 */
async function setPostTags(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  postId: string,
  tagNames: string[],
): Promise<void> {
  await tx.delete(postTags).where(eq(postTags.postId, postId));

  const uniqueNames = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
  if (uniqueNames.length === 0) return;

  await tx
    .insert(tags)
    .values(uniqueNames.map((name) => ({ name, slug: slugifyTag(name) })))
    .onConflictDoNothing({ target: tags.name });

  const tagRows = await tx
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.name, uniqueNames));

  if (tagRows.length > 0) {
    await tx
      .insert(postTags)
      .values(tagRows.map((t) => ({ postId, tagId: t.id })));
  }
}

function parseDate(date?: string): Date {
  if (!date) return new Date();
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * MDX 동기화용 upsert. slug 충돌 시 갱신하며 source='mdx'로 표시한다.
 * MDX 글은 사이트에 라이브이므로 published=true로 적재한다.
 */
export async function upsertPostFromMdx(input: PostInput): Promise<void> {
  await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(posts)
      .values({
        slug: input.slug,
        title: input.title,
        description: input.description,
        content: input.content,
        date: parseDate(input.date),
        published: true,
        source: 'mdx',
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: input.title,
          description: input.description,
          content: input.content,
          date: parseDate(input.date),
          published: true,
          source: 'mdx',
          updatedAt: new Date(),
        },
      })
      .returning({ id: posts.id });

    await setPostTags(tx, row.id, input.tags ?? []);
  });
}

/** 외부 쓰기로 글을 생성한다(source='api'). 생성된 글을 반환. */
export async function createPost(input: PostInput): Promise<BlogPost> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(posts)
      .values({
        slug: input.slug,
        title: input.title,
        description: input.description,
        content: input.content,
        date: parseDate(input.date),
        published: input.published ?? false,
        source: 'api',
      })
      .returning();

    await setPostTags(tx, row.id, input.tags ?? []);

    return {
      slug: row.slug,
      title: row.title,
      date: formatDate(row.date),
      description: row.description,
      content: row.content,
      tags: input.tags?.length ? input.tags : undefined,
    };
  });
}

/**
 * slug로 글을 수정한다. 전달된 필드만 갱신한다.
 * 대상이 없으면 null. tags가 제공되면 태그도 재동기화한다.
 */
export async function updatePost(
  slug: string,
  input: Partial<PostInput>,
): Promise<BlogPost | null> {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug));

    if (existing.length === 0) return null;
    const postId = existing[0].id;

    const updates: Partial<typeof posts.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.content !== undefined) updates.content = input.content;
    if (input.published !== undefined) updates.published = input.published;
    if (input.date !== undefined) updates.date = parseDate(input.date);

    const [row] = await tx
      .update(posts)
      .set(updates)
      .where(eq(posts.id, postId))
      .returning();

    if (input.tags !== undefined) {
      await setPostTags(tx, postId, input.tags);
    }

    const tagRows = await tx
      .select({ name: tags.name })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, postId));

    return {
      slug: row.slug,
      title: row.title,
      date: formatDate(row.date),
      description: row.description,
      content: row.content,
      tags: tagRows.length ? tagRows.map((t) => t.name) : undefined,
    };
  });
}

/** slug로 글을 삭제한다. 삭제되면 true. (post_tags는 cascade로 제거됨) */
export async function deletePost(slug: string): Promise<boolean> {
  const deleted = await db
    .delete(posts)
    .where(eq(posts.slug, slug))
    .returning({ id: posts.id });
  return deleted.length > 0;
}

/**
 * MDX 동기화 후 정리: source='mdx'이지만 현재 MDX slug 집합에 없는 글을 삭제한다.
 * source='api' 글은 절대 건드리지 않는다. 삭제된 slug 목록을 반환.
 */
export async function pruneMdxPostsNotIn(
  keepSlugs: string[],
): Promise<string[]> {
  const mdxRows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.source, 'mdx'));

  const keep = new Set(keepSlugs);
  const toDelete = mdxRows.map((r) => r.slug).filter((s) => !keep.has(s));

  if (toDelete.length > 0) {
    await db
      .delete(posts)
      .where(and(eq(posts.source, 'mdx'), inArray(posts.slug, toDelete)));
  }
  return toDelete;
}
