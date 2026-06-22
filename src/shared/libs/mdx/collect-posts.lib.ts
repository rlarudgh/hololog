import { getAllPosts, getPostBySlug } from './mdx.lib';
import type { PostInput } from '@/shared/database/queries';

/**
 * 모든 MDX 글을 읽어 DB upsert용 PostInput 배열로 변환한다.
 * DB에 의존하지 않으므로(파일시스템만 사용) 단위 테스트가 가능하다.
 */
export function collectMdxPosts(): PostInput[] {
  const summaries = getAllPosts();
  const result: PostInput[] = [];

  for (const summary of summaries) {
    const full = getPostBySlug(summary.slug);
    if (!full) continue;

    result.push({
      slug: summary.slug,
      title: summary.title,
      description: summary.description,
      content: full.content,
      date: summary.date,
      tags: summary.tags,
    });
  }

  return result;
}
